(async()=>{
const F=Flyra,out=document.querySelector('#results'),check=(v,s)=>{if(!v)throw Error(s);out.textContent+='\nPASS '+s;};
const assets=FLYRA_ASSETS.filter(a=>a.stickerKind==='graphic');check(assets.length===8,'eight separate stickers');
for(const a of assets){
const src=await F.assetDataURL(a),im=await F.loadImage(src),p=F.makeProject();p.width=im.width;p.height=im.height;
const o=F.layer('image',0,0,im.width,im.height,{...F.stickerDefaults.graphic,stickerKind:'graphic',src,fit:'contain',mask:'rect',name:a.name});p.layers=[o];
const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const images=await F.prepare(p);F.render(c,p,{images,transparent:true});document.querySelector('#gallery').append(c);
const before=c.getContext('2d').getImageData(0,0,c.width,c.height).data,original=c.toDataURL();Object.assign(o,{stickerColorMode:'color',stickerColor:'#fc2268'});const tint=document.createElement('canvas');tint.width=c.width;tint.height=c.height;F.render(tint,p,{images,transparent:true});const after=tint.getContext('2d').getImageData(0,0,c.width,c.height).data;
check(tint.toDataURL()!==original,a.name+' recolors');let black=0;
for(let i=0;i<before.length;i+=4)if(before[i]<8&&before[i+1]<8&&before[i+2]<8&&before[i+3]>250){if(after[i]!==before[i]||after[i+1]!==before[i+1]||after[i+2]!==before[i+2])throw Error('black print changed');black++;}
check(black>100,a.name+' black print preserved');
check(F.validate(p).layers[0].stickerTintTarget==='paper',a.name+' saved color target');
}
out.textContent+='\nALL PASSED';
})().catch(e=>document.querySelector('#results').textContent+='\nFAIL '+e.stack);
