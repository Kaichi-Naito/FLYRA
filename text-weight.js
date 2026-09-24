/* Values above native font weights add a proportional outline to the glyph. */
(() => {
const F=window.Flyra;
F.nativeTextWeight=o=>Math.max(100,Math.min(900,Number(o.fontWeight)||400));
F.paintText=(ctx,o,text,x,y)=>{
 const size=Number(/([\d.]+)px/.exec(ctx.font)?.[1])||o.fontSize||40;
 const extra=Math.max(0,(Number(o.fontWeight)||400)-900)/1100*size*.16;
 ctx.save();try{
 ctx.lineJoin='round';
 if(o.outline){ctx.lineWidth=Math.max(1,size*.022)+extra;ctx.strokeText(text,x,y);}
 else {if(extra){ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=extra;ctx.strokeText(text,x,y);}ctx.fillText(text,x,y);}
 }finally{ctx.restore();}
};
})();
