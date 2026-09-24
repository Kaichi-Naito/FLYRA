// Run with Node.js after editing assets/manifest.json. No packages needed.
// Embedding preserves file:// support and avoids canvas cross-origin restrictions.
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'assets');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const records=manifest.map(a=>({...a,src:'data:image/png;base64,'+fs.readFileSync(path.join(dir,a.file)).toString('base64')}));
fs.writeFileSync(path.join(dir,'catalog.js'),'/* Generated from original assets; see GENERATION.md. */\nwindow.FLYRA_ASSETS = '+JSON.stringify(records.slice(0,6))+';\n');
fs.writeFileSync(path.join(dir,'catalog-2.js'),'/* Additional original assets; see PACK-02.md. */\nwindow.FLYRA_ASSETS.push(...'+JSON.stringify(records.slice(6))+');\n');
console.log(`Bundled ${records.length} assets for offline use.`);
