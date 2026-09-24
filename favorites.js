/* Favorites belong to the project and embed their layer images. */
(() => {
const F=window.Flyra,apply=F.applyTemplate,validate=F.validate;
F.favoriteFromLayer=(p,o)=>({id:F.uid(),name:o.name,width:p.width,height:p.height,layer:F.clone(o)});
F.layerFromFavorite=(p,f)=>{
 const copy={width:f.width,height:f.height,layers:[F.clone(f.layer)]};F.resizeProject(copy,p.width,p.height);
 return {...copy.layers[0],id:F.uid(),name:f.name,role:undefined,userAdded:true,locked:false,visible:true};
};
F.applyTemplate=(p,...args)=>{const next=apply(p,...args);next.favorites=F.clone(p.favorites||[]);return next;};
F.validate=p=>{
 if(p.favorites!==undefined){
 if(!Array.isArray(p.favorites)||p.favorites.length>100)throw Error('お気に入りは100件までです');
 const ids=new Set();for(const f of p.favorites){
 if(!f||typeof f.id!=='string'||ids.has(f.id)||typeof f.name!=='string'||f.name.length>200||![f.width,f.height].every(n=>Number.isFinite(n)&&n>=100&&n<=5000))throw Error('お気に入りのデータが不正です');
 ids.add(f.id);validate({...p,width:f.width,height:f.height,layers:[f.layer],favorites:[]});
 }
 }
 return validate(p);
};
})();
