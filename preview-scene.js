/* Cache unchanged source-over runs at exact preview pixels. Blends still
   composite against the live backdrop; exports never pass through this path. */
(() => {
const F=window.Flyra,render=F.renderPreview,draw=F.drawLayer;
const cache=new Map(),bitmaps=new WeakMap(),sourceIds=new WeakMap();
let pixels=0,nextSource=0,previous=new Map(),moving=new Map(),building=false,epoch=0;
const budget=24000000;
F.previewSceneStats={hits:0,misses:0,pixels:0};
function clear(){cache.clear();pixels=0;epoch++;}
document.fonts?.addEventListener('loadingdone',clear);
document.fonts?.addEventListener('loadingerror',clear);
F.drawLayer=(ctx,o,images)=>{
 const bitmap=bitmaps.get(o);if(!bitmap)return draw(ctx,o,images);
 ctx.save();try{ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.drawImage(bitmap,0,0);}finally{ctx.restore();}
};
F.renderPreview=(canvas,p,options={})=>{
 const size=canvas.width*canvas.height;
 if(building||options.onlyLayer||size>4000000||document.fonts?.status==='loading')return render(canvas,p,options);
 const now=performance.now(),keys=new Map();
 for(const o of p.layers){
  const {src,...props}=o;const source=src&&options.images?.get(src);
  if(source&&!sourceIds.has(source))sourceIds.set(source,++nextSource);
  const key=JSON.stringify([props,source?sourceIds.get(source):null]);keys.set(o.id,key);
  if(previous.has(o.id)&&previous.get(o.id)!==key)moving.set(o.id,now+500);
 }
 previous=keys;for(const [id,until] of moving)if(until<now||!keys.has(id))moving.delete(id);
 const context=JSON.stringify([canvas.width,canvas.height,p.width,p.height,options.viewport||null,epoch,document.fonts?.size]);
 const layers=[],run=[];
 function flush(){
  if(!run.length)return;
  // Cheap individual shapes do not warrant allocating a full-screen bitmap.
  if(run.length===1&&!['text','grain','particles','halftone','mesh'].includes(run[0].type)){layers.push(...run);run.length=0;return;}
  const key=context+'|'+run.map(o=>keys.get(o.id)).join('|');let bitmap=cache.get(key);
  if(bitmap){F.previewSceneStats.hits++;cache.delete(key);cache.set(key,bitmap);}
  else{
   F.previewSceneStats.misses++;bitmap=document.createElement('canvas');bitmap.width=canvas.width;bitmap.height=canvas.height;
   building=true;try{render(bitmap,{...p,layers:[...run]},{...options,transparent:true});}finally{building=false;}
   while(cache.size&&(cache.size>=12||pixels+size>budget)){const first=cache.keys().next().value,old=cache.get(first);pixels-=old.width*old.height;cache.delete(first);}
   cache.set(key,bitmap);pixels+=size;
  }
  const proxy={type:'preview',visible:true,blend:'source-over'};bitmaps.set(proxy,bitmap);layers.push(proxy);run.length=0;
 }
 for(const o of p.layers){
  if(!o.visible)continue;
  if(moving.has(o.id)||(o.blend&&o.blend!=='source-over')){flush();layers.push(o);}else run.push(o);
 }
 flush();F.previewSceneStats.pixels=pixels;
 return render(canvas,{...p,layers},options);
};
})();
