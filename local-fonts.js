/* Use installed faces through CSS local(); never read or upload font files. */
(() => {
'use strict';
const F=window.Flyra,ensure=F.ensureFont,validate=F.validate,entries=new Map(),loads=new Map();
const prefix='local:',quote=s=>'"'+s.replace(/["\\\n\r\f]/g,c=>'\\'+c.codePointAt(0).toString(16)+' ')+'"';
const valid=names=>Array.isArray(names)&&names.length===4&&names.every(s=>typeof s==='string'&&s.length>0&&s.length<=300&&!/[\u0000-\u001f\u007f]/.test(s));
function register(names){
 if(!valid(names))throw Error('PCの書体情報が不正です');
 const id=prefix+encodeURIComponent(JSON.stringify(names));
 if(entries.has(id))return entries.get(id);
 const [postscriptName,fullName,family,style]=names,alias='FLYRA_Local_'+entries.size;
 const f={id,label:'PC · '+fullName,family,style,postscriptName,fullName,alias,local:true,weights:[100,200,300,400,500,600,700,800,900]};
 entries.set(id,f);F.fontCatalog.push(f);F.fonts[id]=quote(alias)+', '+F.fonts.sans;return f;
}
F.localFontInfo=id=>{
 if(typeof id!=='string'||!id.startsWith(prefix))return null;
 if(id.length>12000)throw Error('PCの書体情報が長すぎます');
 if(entries.has(id))return entries.get(id);
 let names;try{names=JSON.parse(decodeURIComponent(id.slice(prefix.length)));}catch{throw Error('PCの書体情報が不正です');}
 const f=register(names);if(f.id!==id)throw Error('PCの書体情報が不正です');return f;
};
F.localFontsSupported=()=>window.isSecureContext&&typeof window.queryLocalFonts==='function';
F.importLocalFonts=async()=>{
 if(!F.localFontsSupported())throw Error('PC版ChromeまたはEdgeで開くと、このPCのフォントを利用できます。');
 let faces;try{faces=await window.queryLocalFonts();}catch(e){
  if(e.name==='NotAllowedError'||e.name==='SecurityError')throw Error('フォントへのアクセスが許可されていません。ブラウザのサイト設定で「ローカルフォント」を許可して、もう一度押してください。');
  if(e.name==='AbortError')throw Error('フォントの読み込みをキャンセルしました。');
  throw Error('PCのフォントを取得できませんでした。もう一度お試しください。');
 }
 const found=new Set();for(const face of faces){const names=[face.postscriptName,face.fullName,face.family,face.style||'Regular'];if(valid(names))found.add(register(names).id);}
 F.fontCatalog.sort((a,b)=>a.local&&b.local?a.label.localeCompare(b.label,'ja'):a.local?1:b.local?-1:0);
 // A font may have been installed or reactivated since the last attempt.
 for(const [id,record] of loads)if(record.failed)loads.delete(id);
 if(!found.size)throw Error('利用できるフォントが見つかりません。Creative Cloudでフォントをインストールしてから、もう一度お試しください。');
 return found.size;
};
F.ensureFont=async o=>{
 const f=F.localFontInfo(o.font);if(!f)return ensure(o);
 if(loads.has(f.id))return loads.get(f.id).promise;
 const record={failed:false};
 record.promise=(async()=>{
  let face;try{
   face=new FontFace(f.alias,'local('+quote(f.postscriptName)+'), local('+quote(f.fullName)+')');
   await face.load();document.fonts.add(face);f.available=true;
  }catch{record.failed=true;f.available=false;if(face)document.fonts.delete(face);throw Error('「'+f.fullName+'」がこのPCで使えません。フォントをインストールし、「このPCのフォントを使う」で再読み込みしてください。');}
 })();loads.set(f.id,record);return record.promise;
};
F.ensureProjectFonts=async p=>{
 const results=await Promise.allSettled(p.layers.filter(o=>o.type==='text'&&o.visible).map(o=>F.ensureFont(o)));
 const failed=results.find(r=>r.status==='rejected');if(failed)throw failed.reason;
};
F.validate=p=>{
 for(const o of [...(Array.isArray(p?.layers)?p.layers:[]),...(Array.isArray(p?.favorites)?p.favorites.map(f=>f?.layer):[])])if(o?.type==='text')F.localFontInfo(o.font);
 return validate(p);
};
})();
