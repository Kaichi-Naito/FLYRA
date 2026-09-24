/* Google Fonts are loaded on demand. No project text is sent in font URLs. */
(() => {
'use strict';const F=window.Flyra,range=(a,b)=>Array.from({length:(b-a)/100+1},(_,i)=>a+i*100);
F.fontCatalog=[
 {id:'sans',label:'標準ゴシック / Sans',weights:[400,700,900]},
 {id:'heavy',label:'標準極太 / Heavy',weights:[400,700,900]},
 {id:'serif',label:'標準明朝 / Serif',weights:[400,700,900]},
 {id:'mono',label:'標準等幅 / Mono',weights:[400,700,900]},
 {id:'noto-sans',label:'Noto Sans JP · 日本語ゴシック',family:'Noto Sans JP',weights:range(100,900)},
 {id:'noto-serif',label:'Noto Serif JP · 日本語明朝',family:'Noto Serif JP',weights:range(200,900),fallback:'serif'},
 {id:'zen-maru',label:'Zen Maru Gothic · 丸ゴシック',family:'Zen Maru Gothic',weights:[300,400,500,700,900]},
 {id:'zen-kaku',label:'Zen Kaku Gothic New · 角ゴシック',family:'Zen Kaku Gothic New',weights:[300,400,500,700,900]},
 {id:'kaisei',label:'Kaisei Decol · 装飾明朝',family:'Kaisei Decol',weights:[400,500,700],fallback:'serif'},
 {id:'barlow',label:'Barlow Condensed · 英字・縦長',family:'Barlow Condensed',weights:range(100,900)},
 {id:'oswald',label:'Oswald · 英字・見出し',family:'Oswald',weights:range(200,700)},
 {id:'anton',label:'Anton · 英字・極太',family:'Anton',weights:[400]},
 {id:'bebas',label:'Bebas Neue · 英字・大文字',family:'Bebas Neue',weights:[400]},
 {id:'playfair',label:'Playfair Display · 英字・クラシック',family:'Playfair Display',weights:range(400,900),fallback:'serif'},
 {id:'cormorant',label:'Cormorant Garamond · 英字・細身',family:'Cormorant Garamond',weights:range(300,700),fallback:'serif'},
 {id:'space',label:'Space Grotesk · 英字・幾何学',family:'Space Grotesk',weights:range(300,700)},
 {id:'caveat',label:'Caveat · 英字・手書き',family:'Caveat',weights:range(400,700)},
 {id:'pacifico',label:'Pacifico · 英字・筆記体',family:'Pacifico',weights:[400]}
];
for(const f of F.fontCatalog)if(f.family)F.fonts[f.id]=`"${f.family}", ${F.fonts[f.fallback||'sans']}`;
F.fontWeights=id=>F.fontCatalog.find(f=>f.id===id)?.weights||[400,700,900];
F.closestWeight=(id,weight)=>F.fontWeights(id).reduce((a,b)=>Math.abs(a-weight)<=Math.abs(b-weight)?a:b);
const sheets=new Map(),loads=new Map();
function stylesheet(f){if(sheets.has(f.id))return sheets.get(f.id);const p=new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family='+f.family.replaceAll(' ','+')+':wght@'+f.weights.join(';')+'&display=swap';const timer=setTimeout(()=>{link.remove();reject(Error('書体の読み込みがタイムアウトしました'));},15000);link.onload=()=>{clearTimeout(timer);resolve();};link.onerror=()=>{clearTimeout(timer);link.remove();reject(Error('オンライン書体を読み込めませんでした'));};document.head.append(link);});sheets.set(f.id,p);p.catch(()=>sheets.delete(f.id));return p;}
F.ensureFont=async o=>{const f=F.fontCatalog.find(f=>f.id===o.font);if(!f?.family)return;const weight=F.closestWeight(o.font,o.fontWeight),sample='Aa'+(o.text||'あ');const key=f.id+'|'+weight+'|'+sample;if(loads.has(key))return loads.get(key);const p=(async()=>{await stylesheet(f);const loaded=await document.fonts.load(`${weight} 32px "${f.family}"`,sample);if(!loaded.length)throw Error('書体を読み込めませんでした');})();loads.set(key,p);p.catch(()=>loads.delete(key));return p;};
F.ensureProjectFonts=p=>Promise.all(p.layers.filter(o=>o.type==='text'&&o.visible).map(o=>F.ensureFont(o)));
})();


