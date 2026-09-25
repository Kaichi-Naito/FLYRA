/* Missing library sources remain editable image layers with their original reference. */
(() => {
const F=window.Flyra,draw=F.drawLayer,validate=F.validate;
const pixel=document.createElement('canvas');pixel.width=pixel.height=1;F.offlineImage=pixel.toDataURL('image/png');
F.validLibraryRef=v=>!!(v&&v.kind==='library'&&typeof v.id==='string'&&v.id.length<=200&&typeof v.file==='string'&&v.file.length<500&&/^(icons|textures|logos|barcodes)\/.+\.(png|jpe?g|webp)$/i.test(v.file)&&!/[\\%?#:\x00-\x1f]/.test(v.file)&&!v.file.split('/').some(s=>s==='..'||s==='.'||!s));
F.drawLayer=(ctx,o,images)=>{
 if(!o.offlineAsset)return draw(ctx,o,images);
 if(!o.visible)return;
 ctx.save();ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.translate(-o.w/2,-o.h/2);
 if(F.maskPath){F.maskPath(ctx,o);ctx.clip();}
 ctx.fillStyle='#e7e5e1';ctx.fillRect(0,0,o.w,o.h);ctx.strokeStyle='#9f6d64';ctx.lineWidth=Math.max(1,Math.min(o.w,o.h)/100);ctx.setLineDash([ctx.lineWidth*4,ctx.lineWidth*3]);ctx.strokeRect(1,1,o.w-2,o.h-2);
 const size=Math.max(1,Math.min(42,o.w/6.4,o.h/3));ctx.font='700 '+size+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#76554e';ctx.fillText('オフライン',o.w/2,o.h/2,o.w*.9);ctx.restore();
};
F.validate=p=>{for(const o of p.layers||[])if(o.offlineAsset!==undefined&&(o.type!=='image'||!F.validLibraryRef(o.offlineAsset)))throw Error('オフライン画像の参照が不正です');return validate(p);};
})();
