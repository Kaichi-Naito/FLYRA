// Run after placing PNG/JPEG/WebP files in assets/icons or assets/textures.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
function build(root=__dirname){
 const dir=path.join(root,'assets'),manifestPath=path.join(dir,'manifest.json');
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8')),known=new Set(manifest.map(a=>a.file)),ids=new Set(manifest.map(a=>a.id));
 if(ids.size!==manifest.length)throw Error('Duplicate asset IDs');
 function scan(folder,relative=folder){for(const e of fs.readdirSync(path.join(dir,relative),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
  const file=relative+'/'+e.name;if(e.isDirectory()){scan(folder,file);continue;}if(!e.isFile()||!mime[path.extname(e.name).toLowerCase()]||known.has(file))continue;
  let id='import-'+crypto.createHash('sha256').update(file).digest('hex').slice(0,16);if(ids.has(id))throw Error('Duplicate generated ID: '+file);
  manifest.push({id,name:path.basename(e.name,path.extname(e.name)).slice(0,160),folder,file,blend:'source-over',opacity:1});known.add(file);ids.add(id);
 }}
 for(const folder of ['icons','textures','logos']){fs.mkdirSync(path.join(dir,folder),{recursive:true});scan(folder);}
 const records=manifest.map(a=>{const absolute=path.resolve(dir,a.file),rel=path.relative(dir,absolute);if(rel.startsWith('..')||path.isAbsolute(rel)||!['icons','textures','logos'].includes(a.folder))throw Error('Invalid asset path: '+a.file);
  const type=mime[path.extname(a.file).toLowerCase()];if(!type)throw Error('Unsupported image: '+a.file);
  const bytes=fs.readFileSync(absolute);return{...a,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),src:'data:'+type+';base64,'+bytes.toString('base64')};
 });
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
 fs.writeFileSync(path.join(dir,'catalog.js'),'/* Generated asset catalog. */\nwindow.FLYRA_ASSETS = '+JSON.stringify(records.slice(0,6))+';\n');
 fs.writeFileSync(path.join(dir,'catalog-2.js'),'/* Generated asset catalog. */\nwindow.FLYRA_ASSETS.push(...'+JSON.stringify(records.slice(6,12))+');\n');
 fs.writeFileSync(path.join(dir,'catalog-3.js'),'/* Generated asset catalog. */\nwindow.FLYRA_ASSETS.push(...'+JSON.stringify(records.slice(12))+');\n');
 console.log('Bundled '+records.length+' assets for offline use.');return records;
}
module.exports=build;if(require.main===module)build();
