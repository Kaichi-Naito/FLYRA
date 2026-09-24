/* Five editable portrait windows inspired by the supplied live flyer. */
(() => {
const F=window.Flyra,make=F.makeProject,draw=F.drawLayer,id='five-cut-live';
const palette=['#6cf394','#151715','#ed75b4','#28623d'];
const paletteIndex=F.palettes.push(palette)-1;
F.templates.unshift({id,name:'Five cuts / 5人のステージ',caption:'5 PORTRAITS · NEON / LIVE',category:'live',palette:paletteIndex,preview:{title:'FIVE / LIVE',subtitle:'FIVE VOICES. ONE NIGHT.',date:'2026.12.19  SAT',venue:'SHIBUYA / LIVE HOUSE',details:'MEMBER 01 / MEMBER 02 / MEMBER 03 / MEMBER 04 / MEMBER 05',price:'OPEN 18:30 / START 19:00  ·  ADV ¥3,500'}});
const shapes=[
 [[.03,0],[1,.03],[.81,1],[.05,.94]],
 [[.16,.03],[.94,0],[1,.94],[0,1]],
 [[0,0],[.95,.035],[1,1],[.12,.965]],
 [[.09,.02],[.89,0],[1,.965],[0,.92]],
 [[0,.035],[.92,0],[1,.93],[.17,1]]
];
shapes.forEach((points,i)=>{const key='five-cut-'+i;F.extraMasks.push([key,'5人用・斜め枠 '+(i+1)]);F.extraMaskPaths[key]=(c,w,h)=>{points.forEach(([x,y],j)=>j?c.lineTo(x*w,y*h):c.moveTo(x*w,y*h));c.closePath();};});
F.drawLayer=(ctx,o,images)=>{
 if(o.type!=='rect'||(!o.fivePortrait&&!o.tornEdge))return draw(ctx,o,images);
 if(!o.visible)return;ctx.save();ctx.globalAlpha=o.opacity;ctx.globalCompositeOperation=o.blend||'source-over';ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.translate(-o.w/2,-o.h/2);
 if(o.tornEdge){const rnd=F.random(o.seed);ctx.fillStyle=o.color;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(o.w*.75,0);for(let y=0;y<=o.h;y+=o.h/35)ctx.lineTo(o.w*(.12+rnd()*.88),y);ctx.lineTo(0,o.h);ctx.closePath();ctx.fill();}
 else{F.maskPath(ctx,o);ctx.clip();ctx.fillStyle=o.color;ctx.fillRect(0,0,o.w,o.h);const n=o.portraitIndex||0,cx=o.w*(.46+(n%3)*.035),cy=o.h*(.25+(n%2)*.025);ctx.fillStyle=o.color2;ctx.beginPath();ctx.ellipse(cx,cy,o.w*.27,o.h*.09,(n-2)*.08,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(cx-o.w*.16,cy+o.h*.08);ctx.lineTo(cx+o.w*.15,cy+o.h*.08);ctx.lineTo(cx+o.w*.24,cy+o.h*.15);ctx.bezierCurveTo(o.w*1.2,o.h*.43,o.w*.93,o.h*.8,o.w,o.h);ctx.lineTo(0,o.h);ctx.bezierCurveTo(o.w*.07,o.h*.66,-o.w*.12,o.h*.42,cx-o.w*.23,cy+o.h*.15);ctx.closePath();ctx.fill();ctx.fillStyle=o.color;for(let j=0;j<6;j++)ctx.fillRect(0,o.h*(.48+j*.065),o.w,o.h*.012);ctx.globalAlpha*=.35;ctx.fillStyle=o.color2;for(let j=0;j<28;j++)ctx.fillRect((j%7)*o.w/7,Math.floor(j/7)*o.h/7,o.w*.015,o.h*.015);}
 ctx.restore();
};
F.makeProject=(key,content,width=1080,height=1350,seed=2026)=>{
 if(key!==id)return make(key,content,width,height,seed);
 content=content||F.defaultContent;const p=palette,layers=[];
 const add=(type,x,y,w,h,e={})=>{const o=F.layer(type,x,y,w,h,{color:p[1],color2:p[0],seed,...e});layers.push(o);return o;};
 const text=(value,x,y,w,h,size,e={})=>add('text',x,y,w,h,{text:value,name:value,font:'heavy',fontSize:size,fontWeight:900,lineHeight:1,align:'left',...e});
 const bound=(role,label,x,y,w,h,size,e={})=>text(content[role]||'',x,y,w,h,size,{role,name:label,...e});
 bound('title','イベント名',48,34,904,125,108,{align:'center'});
 bound('venue','会場',55,170,290,58,24,{font:'barlow',fontWeight:800});
 add('burst',470,171,60,60,{color:p[2],name:'ピンクの光'});
 bound('subtitle','キャッチコピー',640,172,305,58,23,{align:'right',font:'barlow',fontWeight:800});
 add('rect',0,250,1000,121,{name:'日付の黒帯'});
 bound('date','公演日・時間',35,255,930,108,88,{color:p[0],align:'center',font:'barlow'});
 for(let i=0;i<5;i++){
 const x=30+i*190,y=382+(i%2?8:0),h=680-(i%2?20:0);
 add('rect',x,y,180,h,{name:'人物 '+(i+1)+' · 写真を入れる',frameName:'人物 '+(i+1)+' · 斜め枠',slot:true,photoWindow:true,fivePortrait:true,portraitIndex:i,mask:'five-cut-'+i,effect:'duotone',ink:p[1],paper:p[0],brightness:100,contrast:120});
 text(String(i+1).padStart(2,'0'),x+12,i%2?y+h-82:y+14,90,65,58,{color:p[2],font:'serif',name:'人物番号 '+(i+1)});
 }
 bound('details','5人の名前・出演者',55,1100,890,58,25,{align:'center',font:'barlow',fontWeight:800});
 add('line',55,1170,890,2,{name:'フッター罫線'});
 bound('price','開演・料金',55,1184,890,33,22,{align:'center',font:'barlow',fontWeight:700});
 add('rect',0,0,34,1250,{tornEdge:true,name:'左端の破れ',locked:true});
 add('rect',966,0,34,1250,{tornEdge:true,name:'右端の破れ',rotation:180,locked:true});
 add('grain',0,0,1000,1250,{name:'コピー印刷の粒子',density:38,opacity:.16,locked:true});
 for(const o of layers){o.x*=width/1000;o.y*=height/1250;o.w*=width/1000;o.h*=height/1250;if(o.fontSize)o.fontSize*=Math.min(width/1000,height/1250);}
 return{format:'flyra',version:1,name:'5人のライブフライヤー',width,height,template:id,seed,palette:p.slice(),content:F.clone(content),background:{type:'solid',color:p[0],color2:p[3],angle:0,density:45,seed},layers};
};
})();
