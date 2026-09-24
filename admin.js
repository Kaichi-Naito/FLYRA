(() => {
'use strict';
const $=id=>document.getElementById(id);let repo=null,config,assets=[],original=[],pending=new Map(),dirty=false,busy=false;
const status=s=>$('status').textContent=s;
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function changed(){dirty=true;$('changes').textContent='未保存の変更があります';}
function lock(value){busy=value;$('editor').disabled=value||!repo;$('connect').disabled=value;$('disconnect').disabled=value||!repo;}
function select(items,value,fn){const s=node('select');for(const [v,label] of items){const o=node('option',label);o.value=v;s.append(o);}s.value=value;s.onchange=()=>{fn(s.value);changed();};return s;}
function input(value,label,fn){const i=node('input');i.type='text';i.value=value;i.maxLength=160;i.setAttribute('aria-label',label);i.oninput=()=>{fn(i.value);changed();};return i;}
function renderCategories(){
 $('categories').replaceChildren();for(const category of config.categories){const row=node('div');row.className='admin-row';const categoryName=input(category.name,'カテゴリ名',v=>{category.name=v;});categoryName.onchange=renderCategories;row.append(categoryName);const remove=node('button','削除');remove.onclick=()=>{if(config.categories.length===1)return status('カテゴリを最低1つ残してください');const fallback=config.categories.find(c=>c!==category);config.categories=config.categories.filter(c=>c!==category);for(const t of Flyra.templates){if((config.templates[t.id]?.category||t.category)===category.id)config.templates[t.id]={...config.templates[t.id],category:fallback.id};}changed();renderCategories();};row.append(remove);$('categories').append(row);}
 $('templateSettings').replaceChildren();for(const t of Flyra.templates){const row=node('div');row.className='admin-row';const name=node('span',t.name);name.className='template-name';const category=config.templates[t.id]?.category||t.category;const choice=select(config.categories.map(c=>[c.id,c.name]),config.categories.some(c=>c.id===category)?category:config.categories[0].id,v=>config.templates[t.id]={...config.templates[t.id],category:v});choice.setAttribute('aria-label',t.name+' のカテゴリ');row.append(name,choice);$('templateSettings').append(row);}
}
function renderAssets(){
 $('assetSettings').replaceChildren();for(const a of assets){const row=node('div');row.className='admin-row';const img=node('img');img.alt=a.name;img.src=pending.get(a.id)?.src||'https://raw.githubusercontent.com/Kaichi-Naito/FLYRA/'+repo.head+'/assets/'+(original.find(x=>x.id===a.id)?.file||a.file).split('/').map(encodeURIComponent).join('/');
 const folder=select([['icons','アイコン'],['textures','テクスチャ']],a.folder,v=>{a.folder=v;});folder.setAttribute('aria-label',a.name+' の格納先');
 const visible=node('label','素材棚に表示 '),check=node('input');check.type='checkbox';check.checked=!a.hidden;check.onchange=()=>{a.hidden=!check.checked;changed();};visible.append(check);
 const replace=node('input');replace.type='file';replace.accept='image/png,image/jpeg,image/webp';replace.setAttribute('aria-label',a.name+' を差し替え');replace.onchange=async()=>{lock(true);try{await stage(replace.files[0],a);renderAssets();}catch(e){status(e.message);}finally{lock(false);}};
 row.append(img,input(a.name,'素材の表示名',v=>a.name=v),folder,visible,replace,node('small','保存先：assets/'+(a.file||a.folder+'/'+a.id+'.'+pending.get(a.id)?.ext)));$('assetSettings').append(row);}
}
async function stage(file,existing){
 if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10*1024*1024)throw Error('PNG / JPEG / WebP、10MB以下を選んでください');
 const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});await Flyra.loadImage(src);
 const id=existing?.id||'upload-'+crypto.randomUUID();const a=existing||{id,name:file.name.replace(/\.[^.]+$/,''),folder:$('uploadFolder').value,blend:'source-over',opacity:1};const ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[file.type];pending.set(id,{src,base64:src.split(',')[1],ext});a.sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer())),b=>b.toString(16).padStart(2,'0')).join('');a.revision=crypto.randomUUID();if(!existing)assets.push(a);changed();
}
$('addCategory').onclick=()=>{config.categories.push({id:'category-'+crypto.randomUUID(),name:'新しいカテゴリ'});changed();renderCategories();};
$('upload').onchange=async()=>{lock(true);try{for(const f of $('upload').files)await stage(f);renderAssets();}catch(e){status(e.message);}finally{$('upload').value='';lock(false);}};
$('connect').onclick=async()=>{if(dirty&&!confirm('未保存の変更を破棄して読み直しますか？'))return;const token=$('token').value.trim();$('token').value='';if(!token)return status('GitHubトークンを入力してください');lock(true);try{repo?.disconnect();repo=new FlyraRepository(token);await repo.load();config=structuredClone(repo.config);config.templates ||= {};assets=structuredClone(repo.manifest);original=structuredClone(assets);pending.clear();
 for(const f of repo.files.filter(f=>/^assets\/(icons|textures)\/.+\.(png|jpe?g|webp)$/i.test(f.path))){const file=f.path.slice(7);if(!assets.some(a=>a.file===file))assets.push({id:'import-'+f.sha.slice(0,16)+'-'+assets.length,file,folder:file.split('/')[0],name:file.split('/').pop().replace(/\.[^.]+$/,''),blend:'source-over',opacity:1});}
 dirty=assets.length!==original.length;$('changes').textContent=dirty?'未登録の画像を検出しました。保存すると素材棚に追加されます。':'変更はありません';renderCategories();renderAssets();status('接続しました。編集後「変更をGitHubに保存」で公開します。');
 }catch(e){repo?.disconnect();repo=null;status(e.message);}finally{lock(false);}};
$('disconnect').onclick=()=>{if(dirty&&!confirm('未保存の変更を破棄して切断しますか？'))return;repo?.disconnect();repo=null;dirty=false;pending.clear();$('categories').replaceChildren();$('templateSettings').replaceChildren();$('assetSettings').replaceChildren();status('切断しました');lock(false);};
$('save').onclick=async()=>{if(!repo||busy||!dirty)return;lock(true);try{
 if(config.categories.some(c=>!c.name.trim())||assets.some(a=>!a.name.trim()))throw Error('名前を空欄にしないでください');
 const manifest=structuredClone(assets),changes=[];for(const a of manifest){const old=original.find(x=>x.id===a.id),file=pending.get(a.id);const initial=a.file;if(file)a.file=a.folder+'/'+a.id+'.'+file.ext;else a.file=a.folder+'/'+a.file.split('/').slice(1).join('/');
 if(file||a.file!==initial){const source=repo.files.find(f=>f.path==='assets/'+initial);changes.push({path:'assets/'+a.file,...(file?{base64:file.base64}:{sha:source?.sha})});if(old&&old.file!==a.file)changes.push({path:'assets/'+old.file,sha:null});}
 }
 if(new Set(manifest.map(a=>a.file)).size!==manifest.length)throw Error('保存先のファイル名が重複しています');
 const sha=await repo.save(config,manifest,changes);dirty=false;pending.clear();assets=manifest;original=structuredClone(manifest);$('changes').textContent='保存しました';status('GitHubに保存しました。公開サイトへの反映には少し時間がかかります。エディターを再読み込みしてください。\nコミット：'+sha.slice(0,7));await repo.load();renderAssets();
 }catch(e){status(e.message);}finally{lock(false);}};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
})();
