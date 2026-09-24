(() => {
const F=window.Flyra;
F.normalizeRotation=n=>((n%360)+360)%360;
F.worldPoint=(o,x,y)=>{const a=o.rotation*Math.PI/180,dx=x-o.w/2,dy=y-o.h/2;return{x:o.x+o.w/2+dx*Math.cos(a)-dy*Math.sin(a),y:o.y+o.h/2+dx*Math.sin(a)+dy*Math.cos(a)};};
F.rotationHandle=(o,unit,width,height)=>{let q={x:o.w/2,y:-28*unit},p=F.worldPoint(o,q.x,q.y);if(p.x<10*unit||p.x>width-10*unit||p.y<10*unit||p.y>height-10*unit)q.y=Math.min(o.h/2,28*unit);return q;};
F.resizeCorner=(o,dx,dy,sx,sy,proportional)=>{const a=o.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),rx=dx*c+dy*s,ry=-dx*s+dy*c;let w=Math.max(10,o.w+sx*rx),h=Math.max(10,o.h+sy*ry);if(proportional){const ratio=Math.max(.01,Math.min(20000/o.w,20000/o.h,Math.max(w/o.w,h/o.h)));w=o.w*ratio;h=o.h*ratio;}else{w=Math.min(20000,w);h=Math.min(20000,h);}const ax=sx*(w-o.w)/2,ay=sy*(h-o.h)/2;return{x:o.x+ax*c-ay*s-(w-o.w)/2,y:o.y+ax*s+ay*c-(h-o.h)/2,w,h,...(o.fontSize?{fontSize:Math.min(2000,o.fontSize*Math.min(w/o.w,h/o.h))}:{})};};
})();
