/* Independent typographic scaling without changing line breaks. */
(() => {
const F=window.Flyra,draw=F.drawLayer,validate=F.validate;
F.setTextZoom=(o,key,value)=>{
 const x=o.textZoomX??1,y=o.textZoomY??1,linked=o.textZoomLinked!==false;
 const base=key==='textZoomX'?x:y;
 let factor=value/base;
 const axes=linked?['x','y']:[key==='textZoomX'?'x':'y'];
 // Intersect limits so linked scaling always preserves the current ratio.
 const lo=Math.max(...axes.map(a=>Math.max(.01/(a==='x'?x:y),1/(a==='x'?o.w:o.h))));
 const hi=Math.min(...axes.map(a=>Math.min(10/(a==='x'?x:y),20000/(a==='x'?o.w:o.h))));factor=Math.max(lo,Math.min(hi,factor));
 if(axes.includes('x')){const w=o.w*factor;o.x+=(o.w-w)/2;o.w=w;o.textZoomX=Math.max(.01,Math.min(10,x*factor));}
 if(axes.includes('y')){const h=o.h*factor;o.y+=(o.h-h)/2;o.h=h;o.textZoomY=Math.max(.01,Math.min(10,y*factor));}
};
F.drawLayer=(ctx,o,images)=>{
 const x=o.textZoomX??1,y=o.textZoomY??1;
 if(o.type!=='text'||x===1&&y===1)return draw(ctx,o,images);
 ctx.save();try{ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.scale(x,y);draw(ctx,{...o,x:-o.w/x/2,y:-o.h/y/2,w:o.w/x,h:o.h/y,rotation:0},images);}finally{ctx.restore();}
};
F.validate=p=>{for(const o of p.layers||[]){for(const key of ['textZoomX','textZoomY'])if(o[key]!==undefined&&(!Number.isFinite(o[key])||o[key]<.01||o[key]>10))throw Error('文字ズームは0.01〜10で指定してください');if(o.textZoomLinked!==undefined&&typeof o.textZoomLinked!=='boolean')throw Error('文字ズームのリンク設定が不正です');}return validate(p);};
})();
