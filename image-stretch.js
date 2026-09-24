/* Keep the existing crop, then deform the whole image with its frame. */
(() => {
const F=window.Flyra,draw=F.drawLayer,validate=F.validate;
F.imageFrameSize=o=>({w:o.imageStretchRatio?o.h*o.imageStretchRatio:o.w,h:o.h});
F.drawLayer=(ctx,o,images)=>{
 if(o.type!=='image'||!o.imageStretchRatio)return draw(ctx,o,images);
 const size=F.imageFrameSize(o);
 ctx.save();try{
  ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.scale(o.w/size.w,1);
  draw(ctx,{...o,x:-size.w/2,y:-size.h/2,w:size.w,h:size.h,rotation:0},images);
 }finally{ctx.restore();}
};
F.validate=p=>{for(const o of p.layers||[])if(o.imageStretchRatio!==undefined&&(!Number.isFinite(o.imageStretchRatio)||o.imageStretchRatio<=0||o.imageStretchRatio>2000))throw Error('画像の伸縮比が不正です');return validate(p);};
})();
