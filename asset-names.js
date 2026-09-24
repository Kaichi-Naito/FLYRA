/* Match original file bytes before resizing; never guess from a generic filename. */
(() => {
'use strict';
window.Flyra.resolveAssetName=async(file,assets=window.FLYRA_ASSETS||[])=>{
 const fallback=String(file.name||'画像').slice(0,200);
 const bytes=await file.arrayBuffer();
 if(globalThis.crypto?.subtle){
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  const match=assets.find(a=>a.sha256===hash);if(match)return match.name;
 }
 // Also recognize custom library images, and support contexts without Web Crypto.
 const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
 return assets.find(a=>a.src===src)?.name||fallback;
};
})();

