/* Render installed faces through CSS local(); only names enter project data. */
(() => {
'use strict';
const F=window.Flyra,ensure=F.ensureFont,validate=F.validate,entries=new Map(),loads=new Map(),sources=new Map();
const prefix='local:',quote=s=>'"'+s.replace(/["\\\n\r\f]/g,c=>'\\'+c.codePointAt(0).toString(16)+' ')+'"';
let lastScan=null;
const valid=names=>Array.isArray(names)&&names.length===4&&names.every(s=>typeof s==='string'&&s.length>0&&s.length<=300&&!/[\u0000-\u001f\u007f]/.test(s));
function register(names){
 if(!valid(names))throw Error('PCの書体情報が不正です');
 const id=prefix+encodeURIComponent(JSON.stringify(names));
 if(entries.has(id))return entries.get(id);
 const [postscriptName,fullName,family,style]=names,alias='FLYRA_Local_'+entries.size;
 const f={id,label:'PC · '+fullName,family,style,postscriptName,fullName,alias,aliases:names,familyNames:[family],fullNames:[postscriptName,fullName],local:true,weights:[100,200,300,400,500,600,700,800,900]};
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
F.fontSearchText=id=>{const f=F.fontCatalog.find(f=>f.id===id);return f?[f.label,f.family,f.style,f.postscriptName,f.fullName,...(f.aliases||[])].filter(Boolean).join(' '):id;};
F.importLocalFonts=async(onProgress)=>{
 if(!F.localFontsSupported())throw Error('PC版ChromeまたはEdgeで開くと、このPCのフォントを利用できます。');
 let faces;try{faces=await window.queryLocalFonts();}catch(e){
  if(e.name==='NotAllowedError'||e.name==='SecurityError')throw Error('フォントへのアクセスが許可されていません。ブラウザのサイト設定で「ローカルフォント」を許可して、もう一度押してください。');
  if(e.name==='AbortError')throw Error('フォントの読み込みをキャンセルしました。');
  throw Error('PCのフォントを取得できませんでした。もう一度お試しください。');
 }
 lastScan={received:faces.length,registered:0};const found=new Set();let next=0,done=0;
 // Limit concurrent metadata reads so large Japanese font libraries stay responsive.
 await Promise.all(Array.from({length:Math.min(4,faces.length)},async()=>{
  while(next<faces.length){
   const face=faces[next++],usable=s=>typeof s==='string'&&valid([s,s,s,s]);
   const fallback=[face.fullName,face.postscriptName,face.family].find(usable);
   if(fallback){
    const names=[face.postscriptName,face.fullName,face.family,face.style].map((s,i)=>usable(s)?s:i===3?'Regular':fallback);
    const f=register(names);found.add(f.id);sources.set(f.id,face);
    try{
     const info=await F.readLocalFontNames(face);
     f.aliases=[...new Set([...names,...info.aliases])];f.fullNames=[...new Set([f.postscriptName,f.fullName,...info.fullNames])];
     f.familyNames=[...new Set([f.family,...(info.families||[])])];
     if(info.label)f.label='PC · '+info.label;
    }catch{/* Missing name metadata must never remove a usable face from the list. */}
   }
   onProgress?.(++done,faces.length);
  }
 }));
 F.fontCatalog.sort((a,b)=>a.local&&b.local?a.label.localeCompare(b.label,'ja'):a.local?1:b.local?-1:0);
 // A font may have been installed or reactivated since the last attempt.
 for(const [id,record] of loads)if(record.failed)loads.delete(id);
 lastScan.registered=found.size;
 if(!found.size)throw Error('利用できるフォントが見つかりません。Creative Cloudでフォントをインストールしてから、もう一度お試しください。');
 return found.size;
};
F.addLocalFontByName=async name=>{
 name=String(name).replace(/[\u200b-\u200d\ufeff]/g,'').trim();if(!valid([name,name,name,'Regular']))throw Error('書体の正式な名前を入力してください（300文字以内）。');
 const report={requested:name,probes:[]};F.localFontLastCheck=report;
 const normalize=F.normalizeFontSearch||((s)=>s.normalize('NFKC').toLowerCase().replace(/[\s-]+/g,'')),key=normalize(name);
 const existing=[...entries.values()].find(f=>f.fullNames.some(n=>normalize(n)===key));
 if(existing){if(loads.get(existing.id)?.failed)loads.delete(existing.id);await F.ensureFont({font:existing.id});return existing;}
 const probe=async(candidate,style='Regular')=>{try{const face=new FontFace('FLYRA_Local_Probe','local('+quote(candidate)+')');await face.load();report.probes.push({name:candidate,loaded:true});return {face,name:candidate,style};}catch(error){report.probes.push({name:candidate,loaded:false,error:error.name});return null;}};
 const save=result=>{
  const f=register([result.name,result.name,name,result.style]);result.face.family=f.alias;document.fonts.add(result.face);f.available=true;
  loads.set(f.id,{failed:false,promise:Promise.resolve()});return f;
 };
 // local() accepts full/PostScript names, not necessarily the displayed family name.
 // Check the exact name first, then resolve its family without silently picking a weight.
 const exact=await probe(name)||await probe(name.normalize('NFKC').replace(/\s+/g,' '));if(exact)return save(exact);
 const family=[...entries.values()].filter(f=>f.familyNames.some(n=>normalize(n)===key));
 const chooseMessage=names=>'「'+name+'」には複数の太さがあります。次の名前から選んで入力してください：'+names.join(' / ');
 if(family.length>1)throw Error(chooseMessage(family.map(f=>f.fullName)));
 if(family.length===1){const f=family[0];if(loads.get(f.id)?.failed)loads.delete(f.id);await F.ensureFont({font:f.id});return f;}
 const found=[],bases=[...new Set([name,name.normalize('NFKC').replace(/\s+/g,' ')])];
 // Adobe/Japanese fonts commonly append these style names. Each candidate must
 // actually load; failed probes never become catalog entries or project fonts.
 for(const [style,suffixes] of [['Regular',[' R','-R',' Regular','-Regular']],['Medium',[' M','-M',' Medium','-Medium']],['Bold',[' B','-B',' Bold','-Bold']],['Heavy',[' Hv','-Hv',' Heavy','-Heavy']]]){
  let matched=null;for(const base of bases){for(const suffix of suffixes){matched=await probe(base+suffix,style);if(matched)break;}if(matched)break;}if(matched)found.push(matched);
 }
 if(found.length===1)return save(found[0]);
 if(found.length>1)throw Error(chooseMessage(found.map(f=>f.name)));
 throw Error('「'+name+'」を、このブラウザから読み込めませんでした。インストール済みでも、ブラウザにフォントが公開されていない場合があります。下の診断情報で、権限・一覧の取得状況・名前の読み込み結果を確認できます。');
};
F.localFontDiagnosticText=async()=>{
 let permission='確認できません';try{permission=(await navigator.permissions.query({name:'local-fonts'})).state;}catch{}
 const check=F.localFontLastCheck,lines=['ブラウザ: '+navigator.userAgent,'ローカルフォントAPI: '+(F.localFontsSupported()?'対応':'非対応'),'フォント権限: '+permission,lastScan?'一覧: ブラウザ取得 '+lastScan.received+' / FLYRA登録 '+lastScan.registered:'一覧: このページでは未取得'];
 if(check){lines.push('入力名: '+check.requested);for(const p of check.probes)lines.push((p.loaded?'成功: ':'失敗: ')+p.name+(p.error?' ('+p.error+')':''));}
 return lines.join('\n');
};
F.ensureFont=async o=>{
 const f=F.localFontInfo(o.font);if(!f)return ensure(o);
 if(loads.has(f.id))return loads.get(f.id).promise;
 const record={failed:false};
 record.promise=(async()=>{
  let face;try{
   try{
    face=new FontFace(f.alias,f.fullNames.map(name=>'local('+quote(name)+')').join(', '));await face.load();
   }catch(error){
    // Some installed faces enumerate correctly but local() cannot resolve their names.
    // Use the permission-granted font in memory; never serialize or upload its bytes.
    const source=sources.get(f.id);if(!source)throw error;
    const blob=await source.blob();face=new FontFace(f.alias,await blob.arrayBuffer());await face.load();
   }
   document.fonts.add(face);f.available=true;
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
