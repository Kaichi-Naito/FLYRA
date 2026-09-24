/* Deterministic foil finishes, retained separately from ordinary hex colors. */
(() => {
const F=window.Flyra,validate=F.validate,textures=new Map();
F.finishes=[['solid','単色'],['holo','ホログラム · レインボー'],['pearl','ホログラム · パール']];
F.finishTexture=kind=>{
 if(textures.has(kind))return textures.get(kind);
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 const colors=kind==='pearl'?['#eef9fc','#ccc5f4','#e6fcf7','#fff7d8','#f8d9ec','#c9e4f5','#f7fbff']:['#9295f3','#8df4ef','#f8fcdd','#ffd997','#f6a4d7','#a4a0f2','#65d9c5'];
 const g=x.createLinearGradient(0,0,440,512);colors.forEach((v,i)=>g.addColorStop(i/(colors.length-1),v));x.fillStyle=g;x.fillRect(0,0,512,512);
 [[110,360,220,'#ffb4df'],[400,130,230,'#8eeedd'],[260,270,130,'#fffbc1'],[90,85,160,'#c5bafa']].forEach(([cx,cy,r,color])=>{const q=x.createRadialGradient(cx,cy,0,cx,cy,r);q.addColorStop(0,color+'cc');q.addColorStop(1,color+'00');x.fillStyle=q;x.fillRect(0,0,512,512);});
 const light=x.createLinearGradient(0,512,512,0);[[0,'#ffffff00'],[.3,'#ffffff00'],[.42,'#ffffffb0'],[.47,'#ffffffee'],[.51,'#ffffff20'],[.66,'#26377725'],[.76,'#ffffff99'],[1,'#ffffff00']].forEach(([p,v])=>light.addColorStop(p,v));x.fillStyle=light;x.fillRect(0,0,512,512);textures.set(kind,c);return c;
};
F.paint=(ctx,o,key='color')=>{const kind=o[key+'Finish'];if(!kind||kind==='solid')return o[key];const p=ctx.createPattern(F.finishTexture(kind),'repeat');p.setTransform(new DOMMatrix().scale(Math.max(1,o.w)/512,Math.max(1,o.h)/512));return p;};
F.validate=p=>{for(const o of [p.background,...(p.layers||[])])for(const k of ['colorFinish','color2Finish'])if(o?.[k]!==undefined&&!F.finishes.some(([v])=>v===o[k]))throw Error('色の仕上げが不正です');return validate(p);};
})();
