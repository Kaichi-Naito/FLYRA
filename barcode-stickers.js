/* Generated sticker artwork with editable, project-embedded typography. */
(() => {
const F=window.Flyra,draw=F.drawLayer,validate=F.validate,cache=new Map();
F.stickerFields=[['stickerTitle','見出し'],['stickerSubtitle','サブタイトル'],['stickerMeta','詳細情報'],['stickerCode','管理番号']];
F.stickerDefaults={inventory:{stickerTitle:'PHALUX / ARCHIVE',stickerSubtitle:'HANDLE WITH CARE',stickerMeta:'MADE IN: DARKNESS\nMODEL: ORIGINAL SOUND',stickerCode:'FL — 026'},system:{stickerTitle:'EXPERIMENTAL\nVECTOR SYSTEM',stickerSubtitle:'PHALUX / SOUND DIVISION',stickerMeta:'LIMITED EDITION',stickerCode:'TS26 / 001'},equipment:{stickerTitle:'SPECIAL EDITION',stickerSubtitle:'PHALUX / 2026',stickerMeta:'REFERENCE: SOUND\nPART NO: 026',stickerCode:'FL / 001'}};
for(const d of Object.values(F.stickerDefaults)){for(const [k] of F.stickerFields)d[k]='';d.stickerShowText=false;}
const layouts={
 inventory:[[.08,.215,.83,.065,38],[.08,.29,.83,.035,20],[.08,.70,.59,.07,22],[.08,.79,.59,.025,20]],
 system:[[.08,.2,.83,.25,72],[.08,.09,.8,.05,23],[.08,.49,.64,.055,25],[.12,.9,.75,.04,22]],
 equipment:[[.08,.17,.65,.09,35],[.08,.30,.65,.065,25],[.08,.43,.63,.12,24],[.15,.72,.4,.055,22]]
};
const signatures=new Map();
async function signature(src){
 if(signatures.has(src))return signatures.get(src);
 const task=(async()=>{const im=await F.loadImage(src),c=document.createElement('canvas'),scale=Math.min(1,2400/Math.max(im.width,im.height));c.width=Math.round(im.width*scale);c.height=Math.round(im.height*scale);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c.toDataURL('image/png');})();
 signatures.set(src,task);if(signatures.size>20)signatures.delete(signatures.keys().next().value);return task;
}
F.stickerForSource=async src=>{
 const candidates=(window.FLYRA_ASSETS||[]).filter(a=>Object.hasOwn(layouts,a.stickerKind));
 if(!candidates.length)return {};
 try{const normalized=await signature(src);for(const a of candidates){try{if(normalized===await signature(await F.assetDataURL(a)))return {stickerKind:a.stickerKind,...F.stickerDefaults[a.stickerKind]};}catch{}}}catch{}
 return {};
};
F.restoreStickers=async p=>{let changed=false;for(const o of p.layers||[]){if(o.type!=='image'||o.stickerKind)continue;const data=await F.stickerForSource(o.src);if(data.stickerKind){Object.assign(o,data);changed=true;}}return changed;};
F.drawLayer=(ctx,o,images=new Map())=>{
 if(o.type!=='image'||!layouts[o.stickerKind])return draw(ctx,o,images);
 const source=images.get(o.src);if(!source||!o.visible)return;
 const key=o.src+'#sticker:'+JSON.stringify([o.stickerKind,o.stickerColorMode,o.stickerColor,o.stickerColorFinish,o.stickerShowText,...F.stickerFields.map(([k])=>o[k])]);
 let canvas=cache.get(key);
 if(!canvas){canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;const c=canvas.getContext('2d');
 // Clip generated artwork to its die-cut contour; keep the page outside transparent.
 c.save();c.scale(canvas.width,canvas.height);c.beginPath();
 if(o.stickerKind==='inventory')c.roundRect(.012,.102,.976,.795,.052);
 else if(o.stickerKind==='equipment'){c.moveTo(.055,.074);c.lineTo(.947,.074);c.quadraticCurveTo(.99,.074,.99,.13);c.lineTo(.99,.55);c.lineTo(.963,.59);c.lineTo(.777,.59);c.lineTo(.682,.724);c.lineTo(.682,.776);c.lineTo(.604,.908);c.lineTo(.056,.908);c.quadraticCurveTo(.012,.908,.012,.85);c.lineTo(.012,.13);c.quadraticCurveTo(.012,.074,.055,.074);c.closePath();}
 else c.rect(0,0,1,1);c.restore();c.clip();c.drawImage(source,0,0);c.fillStyle='#eeeee8';c.textBaseline='top';
 if(o.stickerColorMode==='color'){
 const tint=document.createElement('canvas');tint.width=canvas.width;tint.height=canvas.height;const tc=tint.getContext('2d');tc.fillStyle=F.paint(tc,{...o,w:canvas.width,h:canvas.height,stickerColor:o.stickerColor||'#303030'},'stickerColor');tc.fillRect(0,0,tint.width,tint.height);const colors=tc.getImageData(0,0,tint.width,tint.height).data,pixels=c.getImageData(0,0,canvas.width,canvas.height),d=pixels.data;
 for(let j=0;j<d.length;j+=4){if(!d[j+3])continue;const v=(d[j]*.2126+d[j+1]*.7152+d[j+2]*.0722)/255,weight=Math.max(0,Math.min(1,(.85-v)/.65));for(let k=0;k<3;k++)d[j+k]=Math.round(d[j+k]*(1-weight)+Math.min(255,colors[j+k]*(.78+v*1.2))*weight);}c.putImageData(pixels,0,0);
 }
 if(o.stickerShowText!==false)F.stickerFields.forEach(([field],i)=>{const [x,y,w,h,size]=layouts[o.stickerKind][i],lines=String(o[field]??'').split('\n');let px=size*canvas.width/1000;const set=()=>c.font=`${i===0?700:400} ${px}px monospace`;set();const widest=Math.max(1,...lines.map(s=>c.measureText(s).width));px*=Math.min(1,w*canvas.width/widest,h*canvas.height/(lines.length*px*1.2));set();lines.forEach((line,j)=>c.fillText(line,x*canvas.width,y*canvas.height+j*px*1.2));});
 cache.set(key,canvas);if(cache.size>12)cache.delete(cache.keys().next().value);}
 const mapped=new Map(images);mapped.set(key,canvas);return draw(ctx,{...o,src:key},mapped);
};
F.validate=p=>{for(const o of p.layers||[])if(o.stickerKind!==undefined){if(o.type!=='image'||!Object.hasOwn(layouts,o.stickerKind)||F.stickerFields.some(([k])=>typeof o[k]!=='string'||o[k].length>300))throw Error('ステッカーの文字データが不正です');}for(const o of p.layers||[]){if(o.stickerColor!==undefined&&!/^#[0-9a-f]{6}$/i.test(o.stickerColor))throw Error('ステッカー色が不正です');if(o.stickerColorMode!==undefined&&!['original','color'].includes(o.stickerColorMode))throw Error('ステッカー色設定が不正です');if(o.stickerColorFinish!==undefined&&!F.finishes.some(([v])=>v===o.stickerColorFinish))throw Error('ステッカー仕上げが不正です');if(o.stickerShowText!==undefined&&typeof o.stickerShowText!=='boolean')throw Error('文字表示が不正です');}return validate(p);};
})();
