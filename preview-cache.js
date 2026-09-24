/* Preview-only raster cache for expensive, unchanged procedural textures.
   Export always uses the original full-resolution renderer. */
(() => {
const F=window.Flyra,draw=F.drawLayer,cache=new Map();
let active=null,building=false,pixels=0;
F.previewCacheStats={hits:0,misses:0};
F.renderPreview=(canvas,p,options)=>{active=p;F.previewMode=true;try{F.render(canvas,p,options);}finally{active=null;F.previewMode=false;}};
F.drawLayer=(ctx,o,images)=>{
 if(!active||building||!o.visible||!['grain','particles','halftone'].includes(o.type)||(o.blend&&o.blend!=='source-over'))return draw(ctx,o,images);
 const w=ctx.canvas.width,h=ctx.canvas.height,size=w*h;
 if(size>4000000)return draw(ctx,o,images);
 const {id,...properties}=o,key=JSON.stringify([w,h,active.width,active.height,properties]);
 let bitmap=cache.get(key);
 if(bitmap){F.previewCacheStats.hits++;cache.delete(key);cache.set(key,bitmap);}
 else{
  F.previewCacheStats.misses++;
  bitmap=document.createElement('canvas');bitmap.width=w;bitmap.height=h;
  building=true;try{F.render(bitmap,{...active,layers:[o]},{images,transparent:true});}finally{building=false;}
  while(cache.size&&(cache.size>=6||pixels+size>12000000)){const first=cache.keys().next().value,old=cache.get(first);pixels-=old.width*old.height;cache.delete(first);}
  cache.set(key,bitmap);pixels+=size;
 }
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.drawImage(bitmap,0,0);ctx.restore();
};
})();
