/* Shared library/settings. Project images remain embedded for portability. */
(() => {
const F=window.Flyra;
F.bundledAssetSources=new Map((window.FLYRA_ASSETS||[]).filter(a=>a.src?.startsWith("data:")).map(a=>[a.src,a.id]));
F.libraryManifest=[];
F.siteConfig={version:1,categories:[{id:'live',name:'ライブ'},{id:'goods',name:'グッズ'}],templates:{}};
F.loadSiteLibrary=async()=>{
 const results=await Promise.allSettled(['site-config.json','assets/manifest.json'].map(async path=>{const r=await fetch(path,{cache:'no-cache'});if(!r.ok)throw Error(path);return r.json();}));
 if(results[0].status==='fulfilled'){const c=results[0].value;if(c.version===1&&Array.isArray(c.categories)&&c.categories.every(x=>typeof x.id==='string'&&typeof x.name==='string')){F.siteConfig=c;for(const t of F.templates){const override=c.templates?.[t.id];if(override&&c.categories.some(c=>c.id===override.category))t.category=override.category;}}}
 if(results[1].status==='fulfilled'&&Array.isArray(results[1].value)){F.libraryManifest=results[1].value;window.FLYRA_ASSETS=results[1].value.filter(a=>!a.hidden&&typeof a.file==='string'&&/^(icons|textures|logos|barcodes)\//.test(a.file)&&!a.file.split('/').includes('..')).map(a=>({...a,sha256:a.sha256||(!a.revision?window.FLYRA_ASSETS.find(b=>b.id===a.id)?.sha256:undefined),src:'assets/'+a.file.split('/').map(encodeURIComponent).join('/')+'?v='+encodeURIComponent(a.revision||'1')}));}
};
F.assetDataURL=async asset=>{
 if(asset.src.startsWith('data:'))return asset.src;
 const r=await fetch(asset.src,{signal:asset.signal});if(!r.ok)throw Error('素材を取得できません');const blob=await r.blob();if(blob.size>20*1024*1024)throw Error('素材は20MB以下にしてください');
 const src=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
 if(!/^data:image\/(png|jpeg|webp);base64,/i.test(src))throw Error('未対応の画像です');asset.src=src;return src;
};
})();
