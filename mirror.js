/* One layer, optionally reflected across the document centerline. */
(() => {
const F=window.Flyra,draw=F.drawLayer,render=F.render,hit=F.hit,validate=F.validate;
let documentWidth=null;
function drawOne(ctx,o,images){
 if(!o.flipX)return draw(ctx,o,images);
 ctx.save();try{ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.scale(-1,1);draw(ctx,{...o,x:-o.w/2,y:-o.h/2,rotation:0,flipX:false},images);}finally{ctx.restore();}
}
F.render=(canvas,p,options)=>{const previous=documentWidth;documentWidth=p.width;try{return render(canvas,p,options);}finally{documentWidth=previous;}};
F.drawLayer=(ctx,o,images)=>{
 drawOne(ctx,o,images);
 if(o.mirror&&documentWidth!==null&&o.visible){ctx.save();try{ctx.translate(documentWidth,0);ctx.scale(-1,1);drawOne(ctx,o,images);}finally{ctx.restore();}}
};
F.isMirrorHit=(o,x,y,width)=>!!(o?.mirror&&!hit(o,x,y)&&hit(o,width-x,y));
F.hit=(o,x,y,width)=>hit(o,x,y)||(o.mirror&&Number.isFinite(width)&&hit(o,width-x,y));
F.validate=p=>{for(const o of p.layers||[])for(const key of ['flipX','mirror'])if(o[key]!==undefined&&typeof o[key]!=='boolean')throw Error('ミラー設定が不正です');return validate(p);};
})();
