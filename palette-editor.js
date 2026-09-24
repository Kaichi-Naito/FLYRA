/* Explicit color replacement, shared by preview and committed project. */
(() => {
const F=window.Flyra,valid=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);
const keys=o=>o.type==='image'?[...(o.effect&&o.effect!=='none'?['ink','paper']:[]),...(o.stickerColorMode==='color'?['stickerColor']:[])]:['color','color2',...(o.ink?['ink']:[]),...(o.paper?['paper']:[])];
F.projectColors=p=>[...new Set([p.background.color,p.background.color2,...p.palette,...p.layers.flatMap(o=>keys(o).map(k=>o[k]))].filter(valid).map(c=>c.toLowerCase()))];
F.replaceProjectColors=(p,replacements,includeLocked=true)=>{
 const replace=o=>{for(const k of keys(o)){const c=replacements[String(o[k]).toLowerCase()];if(valid(c))o[k]=c;}};
 replace(p.background);for(const o of p.layers)if(includeLocked||!o.locked)replace(o);
 p.palette=p.palette.map(c=>replacements[c.toLowerCase()]||c);
};
})();
