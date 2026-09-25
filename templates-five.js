/* Five editable portrait windows inspired by the supplied live flyer. */
(() => {
const F=window.Flyra,make=F.makeProject,draw=F.drawLayer,id='five-cut-live',duoId='five-cut-duo-3-2';
const palette=['#6cf394','#151715','#ed75b4','#28623d'];
const paletteIndex=F.palettes.push(palette)-1;
F.templates.unshift(
 {id:duoId,name:'Three + Two / ツーマン',caption:'TRIANGLE + DIAGONAL · TWO-MAN / LIVE',category:'live',palette:paletteIndex,preview:{title:'TWO BANDS / ONE NIGHT',subtitle:'3 MEMBERS × 2 MEMBERS',date:'2026.12.19  SAT',venue:'SHIBUYA / LIVE HOUSE',details:'TWO SOUNDS. ONE STAGE.',price:'OPEN 18:30 / START 19:00  ·  ADV ¥3,500'}},
 {id,name:'Five cuts / 5人のステージ',caption:'5 PORTRAITS · NEON / LIVE',category:'live',palette:paletteIndex,preview:{title:'FIVE / LIVE',subtitle:'FIVE VOICES. ONE NIGHT.',date:'2026.12.19  SAT',venue:'SHIBUYA / LIVE HOUSE',details:'MEMBER 01 / MEMBER 02 / MEMBER 03 / MEMBER 04 / MEMBER 05',price:'OPEN 18:30 / START 19:00  ·  ADV ¥3,500'}}
);
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
 else{F.maskPath(ctx,o);ctx.clip();ctx.fillStyle=o.color;ctx.fillRect(0,0,o.w,o.h);const n=o.portraitIndex||0,cx=o.w*(.46+(n%3)*.035),cy=o.h*(.25+(n%2)*.025);ctx.fillStyle=o.color2;ctx.beginPath();ctx.ellipse(cx,cy,o.w*(o.mask==='rect'?.15:.27),o.h*(o.mask==='rect'?.14:.09),(n-2)*.08,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(cx-o.w*.16,cy+o.h*.08);ctx.lineTo(cx+o.w*.15,cy+o.h*.08);ctx.lineTo(cx+o.w*.24,cy+o.h*.15);ctx.bezierCurveTo(o.w*1.2,o.h*.43,o.w*.93,o.h*.8,o.w,o.h);ctx.lineTo(0,o.h);ctx.bezierCurveTo(o.w*.07,o.h*.66,-o.w*.12,o.h*.42,cx-o.w*.23,cy+o.h*.15);ctx.closePath();ctx.fill();ctx.fillStyle=o.color;for(let j=0;j<6;j++)ctx.fillRect(0,o.h*(.48+j*.065),o.w,o.h*.012);ctx.globalAlpha*=.35;ctx.fillStyle=o.color2;for(let j=0;j<28;j++)ctx.fillRect((j%7)*o.w/7,Math.floor(j/7)*o.h/7,o.w*.015,o.h*.015);}
 ctx.restore();
};
F.makeProject=(key,content,width=1080,height=1350,seed=2026)=>{
 if(key!==id&&key!==duoId)return make(key,content,width,height,seed);
 content=content||F.defaultContent;const p=palette,layers=[];
 const add=(type,x,y,w,h,e={})=>{const o=F.layer(type,x,y,w,h,{color:p[1],color2:p[0],seed,...e});layers.push(o);return o;};
 const text=(value,x,y,w,h,size,e={})=>add('text',x,y,w,h,{text:value,name:value,font:'heavy',fontSize:size,fontWeight:900,lineHeight:1,align:'left',...e});
 const bound=(role,label,x,y,w,h,size,e={})=>text(content[role]||'',x,y,w,h,size,{role,name:label,...e});
 bound('title','イベント名',48,34,904,125,108,{align:'center'});
 bound('venue','会場',55,170,key===duoId?380:290,58,key===duoId?22:24,{font:'barlow',fontWeight:800});
 add('burst',470,171,60,60,{color:p[2],name:'ピンクの光'});
 bound('subtitle','キャッチコピー',key===duoId?565:640,172,key===duoId?380:305,58,key===duoId?22:23,{align:'right',font:'barlow',fontWeight:800});
 add('rect',0,250,1000,121,{name:'日付の黒帯'});
 bound('date','公演日・時間',35,255,930,108,88,{color:p[0],align:'center',font:'barlow'});
 if(key===duoId){
  // The member order stays 01,02,03 / 04,05 so existing photos map to
  // top-left, bottom-centre, top-right / bottom-left, top-right.
  add('triangle',83,470,413,492,{name:'左バンド・三角の背景',rotation:180,color:p[3],opacity:.2});
  add('line',645,554,229,24,{name:'右バンド・斜めのつながり',rotation:108,color:p[2],opacity:.55});
  text('01 / TRIO',43,385,230,28,19,{name:'左グループ見出し',font:'barlow',fontWeight:800});
  text('02 / DUO',741,385,220,28,19,{name:'右グループ見出し',font:'barlow',fontWeight:800,align:'right'});
  const frames=[
   [40,427,235,270,-4],[177,738,250,285,3],[304,427,235,270,4],
   [584,742,275,285,-5],[694,427,275,285,5]
  ];
  frames.forEach(([x,y,w,h,rotation],i)=>{
   add('rect',x-7,y-7,w+14,h+14,{name:'人物 '+(i+1)+' · 写真の縁',rotation,color:i<3?p[1]:p[2]});
   add('rect',x,y,w,h,{name:'人物 '+(i+1)+' · 写真を入れる',frameName:(i<3?'左バンド':'右バンド')+' · 人物 '+(i+1),rotation,slot:true,photoWindow:true,fivePortrait:true,portraitIndex:i,mask:'rect',color2:i<3?p[0]:p[2],effect:'duotone',ink:p[1],paper:i<3?p[0]:p[2],brightness:100,contrast:120});
   const labelX=x+(i===2||i===4?w-56:2),labelY=y+h-38;
   add('rect',labelX-5,labelY-3,62,48,{name:'人物 '+(i+1)+' · 番号の台紙',color:p[1]});
   text(String(i+1).padStart(2,'0'),labelX,labelY,54,42,34,{color:i<3?p[0]:p[2],font:'barlow',name:'人物番号 '+(i+1)});
  });
  text('BAND 01',73,1049,440,45,37,{font:'barlow',fontWeight:900,align:'center',name:'左バンド名'});
  text('BAND 02',600,1049,344,45,37,{font:'barlow',fontWeight:900,align:'center',name:'右バンド名'});
 }else for(let i=0;i<5;i++){
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
 return{format:'flyra',version:1,name:key===duoId?'3人組 × 2人組のツーマンフライヤー':'5人のライブフライヤー',width,height,template:key,seed,palette:p.slice(),content:F.clone(content),background:{type:'solid',color:p[0],color2:p[3],angle:0,density:45,seed},layers};
};
})();
