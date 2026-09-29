/* Geometry shared by marquee, group handles and numeric group transforms. */
(() => {
'use strict';
const F=window.Flyra,S=F.selectionGeometry={};
S.corners=o=>[[0,0],[o.w,0],[o.w,o.h],[0,o.h]].map(([x,y])=>F.worldPoint(o,x,y));
S.bounds=layers=>{
 if(!layers.length)return null;
 const points=layers.flatMap(S.corners),x=Math.min(...points.map(p=>p.x)),y=Math.min(...points.map(p=>p.y));
 return {x,y,w:Math.max(...points.map(p=>p.x))-x,h:Math.max(...points.map(p=>p.y))-y,rotation:0};
};
S.marquee=(a,b)=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x),h:Math.abs(a.y-b.y)});
S.enclosed=(o,rect,width)=>{
 const inside=points=>points.every(p=>p.x>=rect.x&&p.x<=rect.x+rect.w&&p.y>=rect.y&&p.y<=rect.y+rect.h);
 const points=S.corners(o);return inside(points)||!!(o.mirror&&inside(points.map(p=>({x:width-p.x,y:p.y}))));
};
S.move=(layers,dx,dy)=>{
 if(!layers.length)return [];
 dx=Math.max(...layers.map(o=>-20000-o.x),Math.min(dx,...layers.map(o=>20000-o.x)));
 dy=Math.max(...layers.map(o=>-20000-o.y),Math.min(dy,...layers.map(o=>20000-o.y)));
 return layers.map(o=>({...o,x:o.x+dx,y:o.y+dy}));
};
S.scale=(layers,amount,anchor)=>{
 if(!layers.length)return [];
 let min=0,max=Infinity;
 for(const o of layers){
  min=Math.max(min,1/o.w,1/o.h);max=Math.min(max,20000/o.w,20000/o.h);
  if(o.type==='text'){min=Math.max(min,1/o.fontSize);max=Math.min(max,2000/o.fontSize);}
  for(const key of ['x','y']){
   const delta=o[key]-anchor[key];if(!delta)continue;
   const a=(-20000-anchor[key])/delta,b=(20000-anchor[key])/delta;
   min=Math.max(min,Math.min(a,b));max=Math.min(max,Math.max(a,b));
  }
 }
 const scale=Math.max(min,Math.min(max,Number.isFinite(amount)?amount:1));
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 return layers.map(o=>({...o,x:clamp(anchor.x+(o.x-anchor.x)*scale,-20000,20000),y:clamp(anchor.y+(o.y-anchor.y)*scale,-20000,20000),w:clamp(o.w*scale,1,20000),h:clamp(o.h*scale,1,20000),...(o.type==='text'?{fontSize:clamp(o.fontSize*scale,1,2000)}:{})}));
};
S.resize=(layers,box,dx,dy,sx,sy)=>{
 const amount=1+(sx*dx*box.w+sy*dy*box.h)/(box.w*box.w+box.h*box.h);
 return S.scale(layers,amount,{x:box.x+(sx<0?box.w:0),y:box.y+(sy<0?box.h:0)});
};
})();
