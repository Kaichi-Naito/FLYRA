/* Clip the complete image pipeline (effects, stretching and offline notice)
   in final frame coordinates, with an independent inside border. */
(() => {
const F=window.Flyra,draw=F.drawLayer;
F.drawLayer=(ctx,o,images)=>{
 if(o.type!=='image'||!o.visible||(o.mask&&o.mask!=='rect')||(!o.cornerRadius&&!o.borderWidth))return draw(ctx,o,images);
 const w=o.w,h=o.h,r=Math.max(0,Math.min(o.cornerRadius||0,w/2,h/2)),b=Math.max(0,Math.min(o.borderWidth||0,w/2,h/2));
 ctx.save();
 try{
  ctx.translate(o.x+w/2,o.y+h/2);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.translate(-w/2,-h/2);
  if(w>2*b&&h>2*b){
   ctx.save();ctx.beginPath();ctx.roundRect(b,b,w-2*b,h-2*b,Math.max(0,r-b));ctx.clip();
   draw(ctx,{...o,x:0,y:0,rotation:0},images);ctx.restore();
  }
  if(b){
   ctx.globalAlpha=o.opacity;ctx.globalCompositeOperation=o.blend||'source-over';
   ctx.fillStyle=F.paint?F.paint(ctx,{...o,borderColor:o.borderColor||'#282b23'},'borderColor'):o.borderColor||'#282b23';
   ctx.beginPath();ctx.roundRect(0,0,w,h,r);
   if(w>2*b&&h>2*b)ctx.roundRect(b,b,w-2*b,h-2*b,Math.max(0,r-b));
   ctx.fill('evenodd');
  }
 }finally{ctx.restore();}
};
})();
