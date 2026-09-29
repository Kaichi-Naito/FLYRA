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
// Local aliases register one exact face as normal (400), even when its name
// contains Bold. Requesting 700 would synthesize additional bold on that face.
F.resetTextWeight=o=>{
 if(o.type!=='text')return;
 o.fontWeight=String(o.font).startsWith('local:')?400:(F.closestWeight?F.closestWeight(o.font,400):400);
 delete o.fontWeightAnchor;
};
let surface;
const glyphCache=new Map();let glyphPixels=0,fontEpoch=0;
const clearGlyphs=()=>{glyphCache.clear();glyphPixels=0;fontEpoch++;};
document.fonts?.addEventListener('loadingdone',clearGlyphs);
document.fonts?.addEventListener('loadingerror',clearGlyphs);
F.previewGlyphStats={hits:0,misses:0};
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
 mask.fillStyle=ctx.fillStyle;
 mask.fillText(text,x,y);
 adjustInk(mask,amount);
 mask.globalCompositeOperation='source-in';mask.fillStyle=ctx.fillStyle;mask.fillRect(left,top,w,h);
}
function adjustInk(ctx,amount){
 // strokeText can synthesize bold independently of lineWidth. Erasing that
 // stroke destroys small dot glyphs even for a 700 -> 699 adjustment. Start
 // from the actual filled glyph and expand/erode its alpha instead. Fractional
 // radii interpolate adjacent filters, including the unchanged zero radius.
 const {width:w,height:h}=ctx.canvas,t=ctx.getTransform(),radius=Math.abs(amount)/2;
 const rx=radius*Math.hypot(t.a,t.c),ry=radius*Math.hypot(t.b,t.d);
 if(Math.max(rx,ry)<1e-8)return;
 const image=ctx.getImageData(0,0,w,h),data=image.data,size=w*h;
 // Keep fractional coverage through every directional pass. Round to 8-bit
 // alpha only once, so a one-unit slider change is not lost at each pass.
 let source=new Uint16Array(size),target=new Uint16Array(size);
 for(let i=0;i<size;i++)source[i]=data[i*4+3]*256;
 const queue=new Int32Array(Math.max(w,h)),grow=amount>0;
 const pass=(r,lines)=>{
  if(r<1e-8)return;
  const whole=Math.floor(r),fraction=r-whole;
  const filter=(n,mix)=>{
   for(const [start,step,length] of lines){
    let head=0,tail=0,next=0;
    for(let i=0;i<length;i++){
     const end=Math.min(length-1,i+n);
     while(next<=end){const v=source[start+next*step];while(tail>head&&(grow?source[start+queue[tail-1]*step]<=v:source[start+queue[tail-1]*step]>=v))tail--;queue[tail++]=next++;}
     while(head<tail&&queue[head]<i-n)head++;
     const at=start+i*step,v=!grow&&(i<n||i+n>=length)?0:source[start+queue[head]*step];
     target[at]=mix?Math.round(target[at]*(1-mix)+v*mix):v;
    }
   }
  };
  filter(whole,0);if(fraction>1e-8)filter(whole+1,fraction);
  [source,target]=[target,source];
 };
 // Four separable directions approximate a round outline without a quadratic
 // kernel cost. The window algorithm stays linear even for very large text.
 const diagonal=Math.min(rx,ry)*(1-1/Math.sqrt(2));
 pass(rx-2*diagonal,Array.from({length:h},(_,y)=>[y*w,1,w]));
 pass(ry-2*diagonal,Array.from({length:w},(_,x)=>[x,w,h]));
 if(diagonal>1e-8){
  const down=[],up=[];
  for(let x=0;x<w;x++){down.push([x,w+1,Math.min(w-x,h)]);up.push([x,w-1,Math.min(x+1,h)]);}
  for(let y=1;y<h;y++){down.push([y*w,w+1,Math.min(w,h-y)]);up.push([y*w+w-1,w-1,Math.min(w,h-y)]);}
  pass(diagonal,down);pass(diagonal,up);
 }
 for(let i=0;i<size;i++)data[i*4+3]=Math.round(source[i]/256);
 ctx.putImageData(image,0,0);
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
 const key=typeof ctx.fillStyle==='string'&&document.fonts?.status!=='loading'?JSON.stringify([fontEpoch,document.fonts?.size,ctx.font,ctx.textAlign,ctx.textBaseline,ctx.direction,ctx.fontKerning,ctx.fontStretch,ctx.fontVariantCaps,ctx.letterSpacing,ctx.wordSpacing,ctx.fillStyle,text,x,y,amount,left,top,w,h,scale]):null;
 const cached=key&&glyphCache.get(key);
 if(cached){F.previewGlyphStats.hits++;glyphCache.delete(key);glyphCache.set(key,cached);ctx.drawImage(cached,0,0,w*scale,h*scale,left,top,w,h);return;}
 F.previewGlyphStats.misses++;
 surface.width=Math.max(1,Math.ceil(w*scale));surface.height=Math.max(1,Math.ceil(h*scale));
 const mask=surface.getContext('2d');mask.scale(scale,scale);mask.translate(-left,-top);
 drawMask(mask,ctx,text,x,y,amount,left,top,w,h);
 ctx.drawImage(surface,0,0,w*scale,h*scale,left,top,w,h);
 if(key){
  const size=surface.width*surface.height;
  while(glyphCache.size&&(glyphCache.size>=128||glyphPixels+size>12000000)){const first=glyphCache.keys().next().value,old=glyphCache.get(first);glyphPixels-=old.width*old.height;glyphCache.delete(first);}
  glyphCache.set(key,surface);glyphPixels+=size;surface=null;
 }
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
