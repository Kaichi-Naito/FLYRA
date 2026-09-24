/* Cache image filtering/masking at preview resolution; transforms stay live. */
(() => {
const F=window.Flyra,draw=F.drawLayer,cache=new Map(),ids=new WeakMap();let nextId=0,pixels=0,building=false;
F.previewImageStats={hits:0,misses:0};
F.drawLayer=(ctx,o,images)=>{
 if(!F.previewMode||building||o.type!=='image'||!o.visible)return draw(ctx,o,images);
 const source=images?.get(o.src);if(!source)return draw(ctx,o,images);
 if(!ids.has(source))ids.set(source,++nextId);
 const matrix=ctx.getTransform(),sx=Math.hypot(matrix.a,matrix.b),sy=Math.hypot(matrix.c,matrix.d);
 let w=Math.max(1,Math.ceil(o.w*sx)),h=Math.max(1,Math.ceil(o.h*sy));const limit=Math.min(1,Math.sqrt(2000000/(w*h)));w=Math.max(1,Math.ceil(w*limit));h=Math.max(1,Math.ceil(h*limit));
 const {src,x,y,rotation,opacity,blend,mirror,flipX,id,...content}=o;
 const key=JSON.stringify([ids.get(source),w,h,content]);let bitmap=cache.get(key);
 if(bitmap){F.previewImageStats.hits++;cache.delete(key);cache.set(key,bitmap);}
 else{
  F.previewImageStats.misses++;bitmap=document.createElement('canvas');bitmap.width=w;bitmap.height=h;
  const b=bitmap.getContext('2d');b.scale(w/o.w,h/o.h);building=true;
  try{draw(b,{...o,x:0,y:0,rotation:0,opacity:1,blend:'source-over',mirror:false,flipX:false},images);}finally{building=false;}
  while(cache.size&&(cache.size>=64||pixels+w*h>24000000)){const first=cache.keys().next().value,old=cache.get(first);pixels-=old.width*old.height;cache.delete(first);}
  cache.set(key,bitmap);pixels+=w*h;
 }
 ctx.save();ctx.globalAlpha=o.opacity;ctx.globalCompositeOperation=o.blend||'source-over';ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.drawImage(bitmap,-o.w/2,-o.h/2,o.w,o.h);ctx.restore();
};
})();
