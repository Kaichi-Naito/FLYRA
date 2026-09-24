/* Reflect a duplicate across the document's vertical centerline. */
(() => {
const F=window.Flyra,draw=F.drawLayer,validate=F.validate;
F.mirrorLayer=(o,width)=>({...F.clone(o),id:F.uid(),name:o.name+' · ミラー',x:width-o.x-o.w,rotation:-(o.rotation||0),flipX:!o.flipX,role:undefined,userAdded:true});
F.drawLayer=(ctx,o,images)=>{
 if(!o.flipX)return draw(ctx,o,images);
 ctx.save();ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate(o.rotation*Math.PI/180);ctx.scale(-1,1);draw(ctx,{...o,x:-o.w/2,y:-o.h/2,rotation:0,flipX:false},images);ctx.restore();
};
F.validate=p=>{for(const o of p.layers||[])if(o.flipX!==undefined&&typeof o.flipX!=='boolean')throw Error('ミラー設定が不正です');return validate(p);};
})();
