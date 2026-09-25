/* Library assets use repository paths; personal images are embedded once. */
(() => {
const F=window.Flyra;
F.packProject=p=>{
 const copy=F.clone(p),assets={},ids=new Map();
 for(const o of [...copy.layers,...(copy.favorites||[]).map(f=>f.layer)]){
  if(o?.type!=='image'||typeof o.src!=='string')continue;
  const sourceKey=o.offlineAsset?JSON.stringify(o.offlineAsset):o.src;
  if(!ids.has(sourceKey)){
   const id='image-'+ids.size;ids.set(sourceKey,id);
   const libraryId=(window.FLYRA_ASSETS||[]).find(a=>a.src===o.src)?.id||F.bundledAssetSources?.get(o.src);
   const asset=F.libraryManifest?.find(a=>a.id===libraryId);
   assets[id]=o.offlineAsset|| (asset?{kind:'library',id:asset.id,file:asset.file,revision:asset.revision||'1'}:o.src);
  }
  o.src='flyra-image:'+ids.get(sourceKey);
 }
 return {...copy,version:2,imageAssets:assets};
};
F.unpackProject=async data=>{
 if(data?.format!=='flyra'||data.version!==2){
  const legacy=F.validate(data);
  const hashes=new Map((window.FLYRA_ASSETS||[]).filter(a=>a.sha256).map(a=>[a.sha256,a.id]));
  if(globalThis.crypto?.subtle&&hashes.size)for(const src of new Set([...legacy.layers,...(legacy.favorites||[]).map(f=>f.layer)].filter(o=>o.type==='image').map(o=>o.src))){
   if(F.bundledAssetSources?.has(src))continue;
   const bytes=await (await fetch(src)).arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
   if(hashes.has(hash))F.bundledAssetSources?.set(src,hashes.get(hash));
  }
  return legacy;
 }
 if(!data.imageAssets||typeof data.imageAssets!=='object'||Array.isArray(data.imageAssets)||Object.keys(data.imageAssets).length>250)throw Error('画像データの一覧を読み込めません');
 const copy=F.clone(data),resolved=new Map();copy.version=1;delete copy.imageAssets;
 if(!Array.isArray(copy.layers)||copy.favorites!==undefined&&!Array.isArray(copy.favorites))throw Error('レイヤー情報を読み込めません');
 for(const o of [...copy.layers,...(copy.favorites||[]).map(f=>f?.layer)]){
  if(o?.type!=='image')continue;
  const id=typeof o.src==='string'&&o.src.startsWith('flyra-image:')?o.src.slice(12):null;
  if(!id||!Object.hasOwn(data.imageAssets,id))throw Error('プロジェクト内の画像が見つかりません');
  if(!resolved.has(id)){
   const value=data.imageAssets[id];
   if(typeof value==='string')resolved.set(id,{src:value});
   else{
    if(!F.validLibraryRef(value))throw Error('素材棚の参照先が不正です');
    try{const src=await F.assetDataURL({src:'assets/'+value.file.split('/').map(encodeURIComponent).join('/')+'?v='+encodeURIComponent(value.revision||'1'),signal:AbortSignal.timeout(10000)});await F.loadImage(src);resolved.set(id,{src});F.bundledAssetSources?.set(src,value.id);}
    catch{resolved.set(id,{src:F.offlineImage,offlineAsset:F.clone(value)});}
   }
  }
  const result=resolved.get(id);o.src=result.src;if(result.offlineAsset)o.offlineAsset=F.clone(result.offlineAsset);else delete o.offlineAsset;
 }
 return F.validate(copy);
};
})();
