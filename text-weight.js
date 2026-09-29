/* Keep the chosen face fixed while continuously expanding/eroding its outline.
   Legacy layers retain their original rendering until their weight is edited. */
(() => {
'use strict';
const F=window.Flyra,validate=F.validate;
const weight=v=>Math.max(100,Math.min(2000,Number(v)||400));
const native=v=>Math.min(900,weight(v));
const legacyExtra=v=>Math.max(0,weight(v)-900)/1100*.16;
const thickness=v=>v<=900?(v-400)*.0001:.05+(v-900)/1100*.16;
F.setTextWeight=(o,value)=>{
 const next=weight(value);if(next===o.fontWeight)return;
 if(o.fontWeightAnchor===undefined)o.fontWeightAnchor=weight(o.fontWeight);
 o.fontWeight=next;
};
F.nativeTextWeight=o=>native(o.fontWeightAnchor??o.fontWeight);
let surface;
function paintExportMask(ctx,text,x,y,amount,rect){
 // Rasterize directly in output pixels, including text zoom and rotation.
 // Bound the temporary bitmap to visible output (plus shadow reach), so very
 // large or mostly off-canvas text never requires an unbounded allocation.
 const t=ctx.getTransform(),{left,top,w,h}=rect;
 const points=[[left,top],[left+w,top],[left,top+h],[left+w,top+h]].map(([x,y])=>({x:t.a*x+t.c*y+t.e,y:t.b*x+t.d*y+t.f}));
 const blur=Math.ceil(ctx.shadowBlur*3+2),sx=ctx.shadowOffsetX,sy=ctx.shadowOffsetY;
 const px=Math.max(Math.floor(Math.min(...points.map(p=>p.x))),-Math.ceil(Math.max(0,sx)+blur));
 const py=Math.max(Math.floor(Math.min(...points.map(p=>p.y))),-Math.ceil(Math.max(0,sy)+blur));
 const right=Math.min(Math.ceil(Math.max(...points.map(p=>p.x))),ctx.canvas.width+Math.ceil(Math.max(0,-sx)+blur));
 const bottom=Math.min(Math.ceil(Math.max(...points.map(p=>p.y))),ctx.canvas.height+Math.ceil(Math.max(0,-sy)+blur));
 if(right<=px||bottom<=py)return;
 surface.width=right-px;surface.height=bottom-py;
 const mask=surface.getContext('2d');mask.setTransform(t.a,t.b,t.c,t.d,t.e-px,t.f-py);
 drawMask(mask,ctx,text,x,y,amount,left,top,w,h);
 ctx.save();try{ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(surface,px,py);}finally{ctx.restore();}
}
function drawMask(mask,ctx,text,x,y,amount,left,top,w,h){
 mask.font=ctx.font;mask.textAlign=ctx.textAlign;mask.textBaseline=ctx.textBaseline;mask.direction=ctx.direction;
 for(const key of ['fontKerning','fontStretch','fontVariantCaps','letterSpacing','wordSpacing'])if(key in ctx)mask[key]=ctx[key];
 mask.fillStyle=mask.strokeStyle='#000';mask.lineJoin='round';mask.lineWidth=Math.abs(amount);
 mask.fillText(text,x,y);
 if(amount<0)mask.globalCompositeOperation='destination-out';
 mask.strokeText(text,x,y);
 mask.globalCompositeOperation='source-in';mask.fillStyle=ctx.fillStyle;mask.fillRect(left,top,w,h);
}
function paintAdjusted(ctx,text,x,y,amount){
 // Thinning must not erase the flyer behind the text. Composite the finished
 // glyph only once so opacity, blend modes and shadows apply to the whole ink.
 surface??=document.createElement('canvas');
 const m=ctx.measureText(text),pad=Math.ceil(Math.abs(amount)/2+3);
 const left=Math.floor(x-m.actualBoundingBoxLeft-pad),top=Math.floor(y-m.actualBoundingBoxAscent-pad);
 const w=Math.max(1,Math.ceil(x+m.actualBoundingBoxRight+pad-left)),h=Math.max(1,Math.ceil(y+m.actualBoundingBoxDescent+pad-top));
 if(!F.previewMode){paintExportMask(ctx,text,x,y,amount,{left,top,w,h});return;}
 const t=ctx.getTransform();
 const scale=Math.min(Math.max(1,Math.hypot(t.a,t.b),Math.hypot(t.c,t.d)),4,4096/w,4096/h,Math.sqrt(4000000/(w*h)));
 surface.width=Math.max(1,Math.ceil(w*scale));surface.height=Math.max(1,Math.ceil(h*scale));
 const mask=surface.getContext('2d');mask.scale(scale,scale);mask.translate(-left,-top);
 drawMask(mask,ctx,text,x,y,amount,left,top,w,h);
 ctx.drawImage(surface,0,0,w*scale,h*scale,left,top,w,h);
}
F.paintText=(ctx,o,text,x,y)=>{
 const size=Number(/([\d.]+)px/.exec(ctx.font)?.[1])||o.fontSize||40;
 const smooth=o.fontWeightAnchor!==undefined,anchor=weight(o.fontWeightAnchor);
 const extra=(smooth?legacyExtra(anchor)+thickness(weight(o.fontWeight))-thickness(anchor):legacyExtra(o.fontWeight))*size;
 ctx.save();try{
 ctx.lineJoin='round';
 if(o.outline){
  const base=Math.max(1,size*.022);
  ctx.lineWidth=extra<0?base*Math.exp(extra/base):base+extra;ctx.strokeText(text,x,y);
 }else if(smooth&&Math.abs(extra)>1e-8){paintAdjusted(ctx,text,x,y,extra);}
 else {if(extra>1e-8){ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=extra;ctx.strokeText(text,x,y);}ctx.fillText(text,x,y);}
 }finally{ctx.restore();}
};
F.validate=p=>{
 for(const o of [...(Array.isArray(p?.layers)?p.layers:[]),...(Array.isArray(p?.favorites)?p.favorites.map(f=>f?.layer):[])]){
  if(o?.fontWeightAnchor!==undefined&&(!Number.isFinite(o.fontWeightAnchor)||o.fontWeightAnchor<100||o.fontWeightAnchor>2000))throw Error('文字の太さの基準値が不正です');
 }
 return validate(p);
};
})();
