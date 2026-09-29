/* Render installed faces through CSS local(); only names enter project data. */
(() => {
'use strict';
const F=window.Flyra,ensure=F.ensureFont,validate=F.validate,entries=new Map(),loads=new Map(),sources=new Map();
const prefix='local:',quote=s=>'"'+s.replace(/["\\\n\r\f]/g,c=>'\\'+c.codePointAt(0).toString(16)+' ')+'"';
let lastScan=null,restoreScan=null;
const valid=names=>Array.isArray(names)&&names.length===4&&names.every(s=>typeof s==='string'&&s.length>0&&s.length<=300&&!/[\u0000-\u001f\u007f]/.test(s));
function register(names){
 if(!valid(names))throw Error('PCのフォント情報が不正です');
 const id=prefix+encodeURIComponent(JSON.stringify(names));
 if(entries.has(id))return entries.get(id);
 const [postscriptName,fullName,family,style]=names,alias='FLYRA_Local_'+entries.size;
 const f={id,label:'PC · '+fullName,family,style,postscriptName,fullName,alias,aliases:names,familyNames:[family],fullNames:[postscriptName,fullName],local:true,weights:[100,200,300,400,500,600,700,800,900]};
 entries.set(id,f);F.fontCatalog.push(f);F.fonts[id]=quote(alias)+', '+F.fonts.sans;return f;
}
F.localFontInfo=id=>{
 if(typeof id!=='string'||!id.startsWith(prefix))return null;
 if(id.length>12000)throw Error('PCのフォント情報が長すぎます');
 if(entries.has(id))return entries.get(id);
 let names;try{names=JSON.parse(decodeURIComponent(id.slice(prefix.length)));}catch{throw Error('PCのフォント情報が不正です');}
 const f=register(names);if(f.id!==id)throw Error('PCのフォント情報が不正です');return f;
};
F.localFontsSupported=()=>window.isSecureContext&&typeof window.queryLocalFonts==='function';
F.localFontListSummary=()=>lastScan?'このブラウザから取得：'+lastScan.received+'件 / FLYRAに登録：'+lastScan.registered+'件':'このブラウザのフォント一覧は未取得です。';
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
F.addLocalFontByName=async(name,onProgress)=>{
 name=String(name).replace(/[\u200b-\u200d\ufeff]/g,'').trim();if(!valid([name,name,name,'Regular']))throw Error('フォントの正式な名前を入力してください（300文字以内）。');
 const report={requested:name,probes:[]};F.localFontLastCheck=report;
 // Query while the button's user activation is still available. Permission alone
 // does not populate sources, and CSS local() can fail even for enumerated fonts.
 if(F.localFontsSupported()){
  try{await F.importLocalFonts(onProgress);report.enumeration='取得済み';}
  catch(error){report.enumeration=error.message;}
 }else report.enumeration='このブラウザはフォント一覧の取得に対応していません';
 const normalize=F.normalizeFontSearch||((s)=>s.normalize('NFKC').toLowerCase().replace(/[\s-]+/g,'')),key=normalize(name);
 const candidates=[...entries.values()].sort((a,b)=>Number(sources.has(b.id))-Number(sources.has(a.id)));
 const existing=candidates.find(f=>f.fullNames.some(n=>normalize(n)===key));
 const use=async f=>{report.match=f.fullName;try{if(loads.get(f.id)?.failed)loads.delete(f.id);await F.ensureFont({font:f.id});report.result=f.loadMethod||'読み込み済み';return f;}catch(error){report.result=error.message;throw error;}};
 if(existing)return use(existing);
 const probe=async(candidate,style='Regular')=>{try{const face=new FontFace('FLYRA_Local_Probe','local('+quote(candidate)+')');await face.load();report.probes.push({name:candidate,loaded:true});return {face,name:candidate,style};}catch(error){report.probes.push({name:candidate,loaded:false,error:error.name});return null;}};
 const save=result=>{
  const f=register([result.name,result.name,name,result.style]);result.face.family=f.alias;document.fonts.add(result.face);f.available=true;
  loads.set(f.id,{failed:false,promise:Promise.resolve()});return f;
 };
 // local() accepts full/PostScript names, not necessarily the displayed family name.
 // Check the exact name first, then resolve its family without silently picking a weight.
 const exact=await probe(name)||await probe(name.normalize('NFKC').replace(/\s+/g,' '));if(exact)return save(exact);
 const family=candidates.filter(f=>f.familyNames.some(n=>normalize(n)===key)).filter((f,i,all)=>all.findIndex(other=>normalize(other.fullName)===normalize(f.fullName))===i);
 const chooseMessage=names=>'「'+name+'」には複数の太さがあります。次の名前から選んで入力してください：'+names.join(' / ');
 if(family.length>1)throw Error(chooseMessage(family.map(f=>f.fullName)));
 if(family.length===1)return use(family[0]);
 const found=[],bases=[...new Set([name,name.normalize('NFKC').replace(/\s+/g,' ')])];
 // Adobe/Japanese fonts commonly append these style names. Each candidate must
 // actually load; failed probes never become catalog entries or project fonts.
 for(const [style,suffixes] of [['Regular',[' R','-R',' Regular','-Regular']],['Medium',[' M','-M',' Medium','-Medium']],['Bold',[' B','-B',' Bold','-Bold']],['Heavy',[' Hv','-Hv',' Heavy','-Heavy']]]){
  let matched=null;for(const base of bases){for(const suffix of suffixes){matched=await probe(base+suffix,style);if(matched)break;}if(matched)break;}if(matched)found.push(matched);
 }
 if(found.length===1)return save(found[0]);
 if(found.length>1)throw Error(chooseMessage(found.map(f=>f.name)));
 throw Error('「'+name+'」を、このブラウザから読み込めませんでした。'+F.localFontListSummary()+' ブラウザによって取得できる一覧が異なる場合があります。インストール済みでも見つからない場合は、別の対応ブラウザ（Chrome / Edge）で「このPCのフォントを使う」をお試しください。下の診断情報で取得状況を確認できます。');
};
F.localFontDiagnosticText=async()=>{
 let permission='確認できません';try{permission=(await navigator.permissions.query({name:'local-fonts'})).state;}catch{}
 const check=F.localFontLastCheck,lines=['ブラウザ: '+navigator.userAgent,'ローカルフォントAPI: '+(F.localFontsSupported()?'対応':'非対応'),'フォント権限: '+permission,lastScan?'一覧: ブラウザ取得 '+lastScan.received+' / FLYRA登録 '+lastScan.registered:'一覧: このページでは未取得'];
 lines.push('件数はこのブラウザが返した一覧です。PCにある全フォントの件数ではなく、別のブラウザでは異なる場合があります。');
 if(check){lines.push('入力名: '+check.requested);if(check.enumeration)lines.push('一覧取得結果: '+check.enumeration);lines.push('一致したフォント: '+(check.match||'なし'));if(check.result)lines.push('読み込み結果: '+check.result);for(const p of check.probes)lines.push((p.loaded?'成功: ':'失敗: ')+p.name+(p.error?' ('+p.error+')':''));}
 return lines.join('\n');
};
async function restoreGrantedSources(){
 if(!F.localFontsSupported())return;
 if(!restoreScan)restoreScan=(async()=>{
  // Restoring a project must not open an unsolicited permission dialog.
  const status=await navigator.permissions.query({name:'local-fonts'});
  if(status.state==='granted')await F.importLocalFonts();
 })().catch(()=>{});
 await restoreScan;
}
function sourceFor(f){
 if(sources.has(f.id))return sources.get(f.id);
 // Older projects can contain names entered manually rather than API metadata.
 const key=s=>s.normalize('NFKC').toLowerCase().replace(/[\s-]+/g,'');
 const names=new Set(f.fullNames.map(key));
 for(const [id,source] of sources){if(entries.get(id).fullNames.some(n=>names.has(key(n))))return source;}
 return null;
}
F.ensureFont=async o=>{
 const f=F.localFontInfo(o.font);if(!f)return ensure(o);
 if(loads.has(f.id))return loads.get(f.id).promise;
 const record={failed:false};
 record.promise=(async()=>{
  let face;try{
   try{
    face=new FontFace(f.alias,f.fullNames.map(name=>'local('+quote(name)+')').join(', '));await face.load();f.loadMethod='名前から読み込み';
   }catch(error){
    // Some installed faces enumerate correctly but local() cannot resolve their names.
    // Use the permission-granted font in memory; never serialize or upload its bytes.
    if(!sourceFor(f)&&!lastScan)await restoreGrantedSources();
    const source=sourceFor(f);if(!source)throw error;
    const blob=await source.blob();face=new FontFace(f.alias,await blob.arrayBuffer());await face.load();f.loadMethod='許可済みのフォントデータから読み込み';
   }
   document.fonts.add(face);f.available=true;
  }catch(error){record.failed=true;f.available=false;if(face)document.fonts.delete(face);throw Error(sourceFor(f)?'「'+f.fullName+'」は一覧にありますが、ブラウザがフォントデータを読み込めませんでした（'+error.name+'）。':'「'+f.fullName+'」がこのPCで使えません。「このPCのフォントを使う」で一覧を取得してから、もう一度お試しください。');}
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
