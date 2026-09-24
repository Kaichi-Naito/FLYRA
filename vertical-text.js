/* Vertical Japanese text shares the canvas renderer used by PNG export. */
(() => {
const F=window.Flyra,draw=F.drawLayer,validate=F.validate;
const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('ja',{granularity:'grapheme'}):null;
const split=s=>segmenter?Array.from(segmenter.segment(s),v=>v.segment):Array.from(s);
F.verticalGlyph=ch=>({rotate:/^[ー―—–…‥（）()［］\[\]｛｝{}「」『』【】〈〉《》〔〕＜＞<>]$/u.test(ch),
 dx:/^[、。，．]$/u.test(ch)?.28:/^[ぁぃぅぇぉゃゅょっゎァィゥェォャュョッヮヵヶ]$/u.test(ch)?.14:0,
 dy:/^[、。，．]$/u.test(ch)?-.28:/^[ぁぃぅぇぉゃゅょっゎァィゥェォャュョッヮヵヶ]$/u.test(ch)?-.14:0});
F.verticalLayout=o=>{
 const paragraphs=String(o.text??'').replace(/\r\n?/g,'\n').split('\n').map(split),gap=o.lineHeight||1.1;
 const layout=size=>{const rows=Math.max(1,Math.floor((o.h+1e-7)/size)),columns=[];
 for(const chars of paragraphs){if(!chars.length)columns.push([]);else for(let i=0;i<chars.length;i+=rows)columns.push(chars.slice(i,i+rows));}
 return {size,columns,width:size+(columns.length-1)*size*gap};};
 let low=.01,high=Math.max(.01,Math.min(o.fontSize||40,o.h,o.w)),result=layout(high);
 if(result.width>o.w){for(let i=0;i<28;i++){const mid=(low+high)/2;if(layout(mid).width<=o.w)low=mid;else high=mid;}result=layout(low);}
 result.glyphs=[];result.columns.forEach((chars,col)=>{const used=chars.length*result.size,offset=o.align==='center'?(o.h-used)/2:o.align==='right'?o.h-used:0;
 chars.forEach((ch,row)=>result.glyphs.push({ch,x:o.w-result.size/2-col*result.size*gap,y:offset+(row+.5)*result.size,...F.verticalGlyph(ch)}));});
 return result;
};
F.drawLayer=(ctx,o,images)=>{
 if(o.type!=='text'||o.textShape!=='vertical')return draw(ctx,o,images);
 if(!o.visible)return;
 const layout=F.verticalLayout(o),size=layout.size;
 ctx.save();try{
 ctx.globalAlpha=o.opacity;ctx.globalCompositeOperation=o.blend||'source-over';
 ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.translate(-o.w/2,-o.h/2);
 ctx.font=`${F.nativeTextWeight?F.nativeTextWeight(o):o.fontWeight||400} ${size}px ${F.fonts[o.font]||F.fonts.sans}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=Math.max(.5,size*.022);
 const paint=key=>{ctx.fillStyle=ctx.strokeStyle=F.paint?F.paint(ctx,o,key):o[key];};
 const glyphs=()=>{for(const g of layout.glyphs){ctx.save();ctx.translate(g.x+g.dx*size,g.y+g.dy*size);if(g.rotate)ctx.rotate(Math.PI/2);if(F.paintText)F.paintText(ctx,o,g.ch,0,0);else if(o.outline)ctx.strokeText(g.ch,0,0);else ctx.fillText(g.ch,0,0);ctx.restore();}};
 if(o.shadow){ctx.save();ctx.translate(size*.045,size*.045);paint('color2');glyphs();ctx.restore();}
 paint('color');glyphs();
 }finally{ctx.restore();}
};
F.validate=p=>{for(const o of p.layers||[])if(o.type==='text'&&o.textShape!==undefined&&!['normal','arc','vertical'].includes(o.textShape))throw Error('文字の並びが不正です');return validate(p);};
})();
