/* FLYRA — original, dependency-free static design engine. MIT. */
(function(root){
'use strict';
const F = {}; const TAU=Math.PI*2;
F.uid=()=> 'l'+Math.random().toString(36).slice(2,10)+Date.now().toString(36);
F.clone=x=>JSON.parse(JSON.stringify(x));
F.random=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
F.fonts={sans:'Arial, "Yu Gothic", "Meiryo", sans-serif',serif:'Georgia, "Yu Mincho", "MS PMincho", serif',mono:'"Courier New", "Yu Gothic", monospace',heavy:'"Arial Black", "Yu Gothic", "Meiryo", sans-serif'};
F.palettes=[['#f3eee3','#26281f','#ea653f','#585fef'],['#18251f','#f5efe3','#d7f171','#648b58'],['#dedaf0','#262053','#fb764b','#7c92d2'],['#f4c3be','#802537','#e63d43','#f5e7c8'],['#eee9db','#23344b','#6a83b5','#d58449'],['#c5edfd','#151c7a','#ed631e','#8da4e8'],['#212122','#f5f0e0','#e2ff4c','#667e56'],['#f4e447','#27291f','#df4c28','#f8a9a1']];
F.templates=[
{id:'afterhours',name:'After hours',caption:'GRADIENT / LIVE',category:'live',palette:0},
{id:'acid',name:'Acid frequency',caption:'BOLD / LIVE',category:'live',palette:6},
{id:'editorial',name:'Slow Sunday',caption:'EDITORIAL / LIVE',category:'live',palette:4},
{id:'blue',name:'Blue room',caption:'ATMOSPHERIC / LIVE',category:'live',palette:5},
{id:'goods',name:'Little things',caption:'POP / GOODS',category:'goods',palette:3},
{id:'grunge',name:'Noise club',caption:'RAW / LIVE',category:'live',palette:1},
{id:'gallery',name:'Objects & stories',caption:'MINIMAL / GOODS',category:'goods',palette:2},
{id:'sunset',name:'Golden hour',caption:'WARM / LIVE',category:'live',palette:7}
];
F.defaultContent={title:'AFTER\nHOURS',subtitle:'A NIGHT FOR THE REST OF US.',date:'2026.11.21  SAT  /  OPEN 18:00',venue:'TOKYO · YOUR LIVE HOUSE',details:'YOUR BAND  /  THE NEIGHBORS\nSPECIAL GUEST & FRIENDS',price:'ADV ¥2,500  /  DOOR ¥3,000'};
F.layer=(type,x,y,w,h,extra={})=>Object.assign({id:F.uid(),type,x,y,w,h,rotation:0,opacity:1,color:'#282b23',color2:'#6866e8',visible:true,locked:false,blend:'source-over',name:type},extra);
F.makeProject=(id='afterhours',content=F.defaultContent,width=1080,height=1350,seed=2026)=>{
 const t=F.templates.find(t=>t.id===id)||F.templates[0],p=F.palettes[t.palette],layers=[];
 // Layouts use a 1000 x 1250 design space, then adapt to the target document.
 const s=(type,x,y,w,h,e={})=>{const o=F.layer(type,x,y,w,h,e);layers.push(o);return o;};
 const text=(key,x,y,w,h,size,e={})=>s('text',x,y,w,h,{name:({title:'タイトル',subtitle:'キャッチコピー',date:'日時',venue:'会場',details:'出演・説明',price:'料金'})[key]||key,text:content[key]||'',role:key,font:'sans',fontSize:size,fontWeight:700,lineHeight:1.02,align:'left',color:p[1],...e});
 const raw=(value,x,y,w,h,size,e={})=>s('text',x,y,w,h,{name:value,text:value,font:'mono',fontSize:size,fontWeight:400,lineHeight:1.1,color:p[1],align:'left',...e});
 const line=(y)=>s('line',65,y,870,2,{color:p[1],name:'罫線'});
 let bg={type:'solid',color:p[0],color2:p[3],angle:135,seed,density:45};
 if(id==='afterhours'){
  s('mesh',185,345,670,610,{color:p[2],color2:p[3],angle:135,name:'夜のオーロラ',seed,density:45});
  s('rings',365,430,340,460,{color:p[0],opacity:.5,name:'軌道',rotation:-28});
  raw('SOUND / CULTURE / CONNECTION',64,44,750,30,16,{fontWeight:700});raw('VOL. 01',790,44,150,30,16,{align:'right'});line(99);
  text('title',55,139,900,322,168,{font:'heavy',fontWeight:900,lineHeight:.87});
  text('subtitle',65,505,455,56,21);s('star',807,532,105,105,{color:p[1],name:'スパーク'});
  text('date',65,904,870,52,37);line(980);text('venue',65,1005,870,36,21);
  text('details',65,1064,670,77,24,{lineHeight:1.45,fontWeight:400});text('price',65,1178,870,28,18,{font:'mono',fontWeight:400});
 }else if(id==='acid'){
  s('ellipse',210,245,740,740,{color:p[2],name:'アシッドディスク'});s('rings',40,120,780,1000,{color:p[2],name:'周波数',rotation:25});
  raw('INDEPENDENT MUSIC / NO LIMITS',50,42,900,32,18,{color:p[2]});line(99);
  text('title',40,160,920,380,180,{color:p[1],font:'heavy',lineHeight:.85});
  text('subtitle',78,612,790,75,30,{color:p[0],rotation:-8});
  s('rect',0,875,1000,375,{color:p[2],name:'インフォメーション背景'});
  text('date',55,918,890,57,41,{color:p[0]});text('venue',55,998,890,45,26,{color:p[0]});text('details',55,1064,890,70,22,{color:p[0],lineHeight:1.4});text('price',55,1170,890,35,21,{color:p[0]});
 }else if(id==='editorial'){
  raw('THE INDEPENDENT SESSIONS',65,45,870,28,17,{align:'center'});line(98);
  text('title',65,152,870,310,148,{font:'serif',fontWeight:400,lineHeight:.9});
  s('rect',65,510,870,368,{color:p[3],name:'夕暮れの窓'});s('ellipse',275,560,370,370,{color:p[2],name:'静かな太陽'});s('rect',65,772,870,106,{color:p[1],name:'水平線'});
  text('subtitle',65,905,870,42,21,{fontWeight:400});text('date',65,985,870,55,38,{font:'serif',fontWeight:400});line(1061);text('venue',65,1084,870,33,19);text('details',65,1135,525,69,18,{fontWeight:400,lineHeight:1.5});text('price',650,1135,285,65,16,{align:'right',font:'mono'});
 }else if(id==='blue'){
  bg={...bg,type:'gradient',color:'#c6ecf8',color2:'#6d85e3',angle:90};
  s('mesh',20,200,980,850,{color:'#c9f2ed',color2:'#455be3',seed,name:'ブルーの光'});s('rings',-180,290,1330,620,{color:'#e8f6f8',rotation:34,opacity:.6,name:'波紋'});
  raw('AN INTIMATE LIVE EXPERIENCE',65,50,870,34,19,{align:'center'});
  text('title',60,205,880,340,150,{font:'serif',fontWeight:400,align:'center'});text('subtitle',70,635,860,74,23,{align:'center'});
  text('date',65,938,870,50,34,{align:'center'});text('venue',65,1010,870,40,23,{align:'center'});text('details',65,1080,870,70,22,{align:'center',fontWeight:400,lineHeight:1.4});text('price',65,1180,870,30,17,{align:'center'});
 }else if(id==='goods'){
  raw('MADE FOR YOUR EVERYDAY',60,45,880,34,18,{align:'center'});
  s('burst',145,320,700,700,{color:p[3],rotation:10,name:'ポップな台紙'});s('ellipse',296,454,410,425,{color:p[2],name:'商品画像の置き場所'});raw('YOUR\nGOODS',332,555,340,240,63,{align:'center',font:'heavy',fontWeight:900,color:p[3]});
  text('title',55,135,890,250,139,{align:'center',font:'heavy'});text('subtitle',85,898,830,65,26,{align:'center'});line(990);text('date',60,1015,880,45,30,{align:'center'});text('venue',60,1079,880,40,23,{align:'center'});text('details',60,1133,555,65,18,{fontWeight:400,lineHeight:1.4});text('price',637,1140,300,60,24,{align:'right'});
 }else if(id==='grunge'){
  s('grid',0,0,1000,1250,{color:p[3],opacity:.25,name:'グリッド'});
  s('rect',-20,230,1040,455,{color:p[2],rotation:-7,name:'切り貼りの紙'});
  raw('TURN IT UP. FEEL EVERYTHING.',60,70,870,70,27,{font:'mono'});
  text('title',40,250,920,372,178,{color:p[0],rotation:-7,font:'heavy',lineHeight:.88});text('subtitle',75,735,850,70,30,{rotation:3,color:p[2]});
  text('date',65,908,870,55,37);line(988);text('venue',65,1013,870,40,26);text('details',65,1080,870, seventy(),23,{font:'mono',lineHeight:1.4});text('price',65,1180,870,30,20,{color:p[2]});
  s('grain',0,0,1000,1250,{color:p[0],seed,density:70,opacity:.28,name:'コピー用紙の粒子',locked:true});
 }else if(id==='gallery'){
  raw('COLLECTION / 001',60,50,880,40,21,{font:'mono'});line(120);
  text('title',60,174,880,276,128,{font:'serif',fontWeight:400});text('subtitle',60,481,880,50,22,{fontWeight:400});
  s('rect',60,588,880,373,{color:p[1],name:'展示台'});s('ellipse',215,629,260,260,{color:p[2],name:'オブジェクト A'});s('rect',540,651,230,260,{color:p[0],rotation:12,name:'オブジェクト B'});
  text('date',60,1005,880,46,32);text('venue',60,1070,880,38,24);text('details',60,1132,555,70,19,{lineHeight:1.5,fontWeight:400});text('price',652,1140,288,65,18,{align:'right'});
 }else{
  s('gradient',0,0,1000,1250,{color:p[0],color2:p[2],angle:90,name:'ゴールデンアワー',seed});s('ellipse',150,290,700,700,{color:p[3],name:'太陽'});s('rings',45,350,920,740,{color:p[1],rotation:-12,opacity:.7,name:'レコード'});
  raw('GOOD MUSIC. GOOD PEOPLE.',60,50,880,35,21,{align:'center'});text('title',45,160,910,330,164,{font:'heavy',align:'center',lineHeight:.9});text('subtitle',90,650,820,65,27,{align:'center'});text('date',60,928,880,54,38,{align:'center'});text('venue',60,1006,880, forty(),24,{align:'center'});line(1064);text('details',60,1100,880,70,24,{align:'center',lineHeight:1.4});text('price',60,1190,880,30,18,{align:'center'});
 }
 const sx=width/1000,sy=height/1250;
 for(const o of layers){o.x*=sx;o.y*=sy;o.w*=sx;o.h*=sy;if(o.fontSize)o.fontSize*=Math.min(sx,sy);}
 return {format:'flyra',version:1,name:'はじめてのフライヤー',width,height,template:id,seed,palette:p.slice(),content:F.clone(content),background:bg,layers};
};
function seventy(){return 70;}function forty(){return 40;}
const imageCache=new Map();
F.loadImage=src=>{if(imageCache.has(src))return imageCache.get(src);const task=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{imageCache.delete(src);reject(new Error('画像を読み込めませんでした'));};im.src=src;});imageCache.set(src,task);return task;};
F.prepare=async p=>{const map=new Map();await Promise.all(p.layers.filter(x=>x.type==='image').map(async o=>map.set(o.src,await F.loadImage(o.src))));return map;};
function gradient(ctx,o){if(F.paint&&o.colorFinish&&o.colorFinish!=='solid')return F.paint(ctx,o);if(F.paint&&o.color2Finish&&o.color2Finish!=='solid')return F.paint(ctx,o,'color2');const rad=(o.angle||0)/180*Math.PI,dx=Math.cos(rad)*o.w/2,dy=Math.sin(rad)*o.h/2;const g=ctx.createLinearGradient(o.w/2-dx,o.h/2-dy,o.w/2+dx,o.h/2+dy);g.addColorStop(0,o.color);g.addColorStop(1,o.color2);return g;}
function textLines(ctx,text,max){const out=[];for(const paragraph of String(text).split('\n')){let line='';for(const char of Array.from(paragraph)){if(line&&ctx.measureText(line+char).width>max){out.push(line);line=char;}else line+=char;}out.push(line);}return out;}
F.drawLayer=(ctx,o,images=new Map())=>{
 if(!o.visible)return;ctx.save();ctx.globalAlpha=o.opacity;ctx.globalCompositeOperation=o.blend||'source-over';ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate(o.rotation*Math.PI/180);ctx.translate(-o.w/2,-o.h/2);ctx.fillStyle=F.paint?F.paint(ctx,o):o.color;ctx.strokeStyle=F.paint?F.paint(ctx,o):o.color;ctx.lineWidth=Math.max(1,o.w/350);
 const w=o.w,h=o.h,rnd=F.random(o.seed||42);
 switch(o.type){
 case 'text':{
  const family=F.fonts[o.font]||F.fonts.sans;let fs=o.fontSize||40,lines=[];
  const fit=()=>{ctx.font=`${F.nativeTextWeight?F.nativeTextWeight(o):o.fontWeight||400} ${fs}px ${family}`;lines=textLines(ctx,o.text,w);return lines.length*fs*(o.lineHeight||1.1)<=h;};
  let count=0;while(!fit()&&fs>3&&count++<150)fs*=.96;
  ctx.textBaseline='top';ctx.textAlign=o.align||'left';const tx=o.align==='center'?w/2:o.align==='right'?w:0;
  if(o.shadow&&o.color2Finish&&o.color2Finish!=='solid'&&F.paint){ctx.save();ctx.translate(fs*.045,fs*.045);ctx.fillStyle=ctx.strokeStyle=F.paint(ctx,o,'color2');lines.forEach((line,i)=>{if(F.paintText)F.paintText(ctx,o,line,tx,i*fs*(o.lineHeight||1.1));else if(o.outline)ctx.strokeText(line,tx,i*fs*(o.lineHeight||1.1));else ctx.fillText(line,tx,i*fs*(o.lineHeight||1.1));});ctx.restore();}else if(o.shadow){ctx.shadowColor=o.color2;ctx.shadowBlur=0;ctx.shadowOffsetX=fs*.045;ctx.shadowOffsetY=fs*.045;}
  lines.forEach((line,i)=>{if(F.paintText)F.paintText(ctx,o,line,tx,i*fs*(o.lineHeight||1.1));else if(o.outline)ctx.strokeText(line,tx,i*fs*(o.lineHeight||1.1));else ctx.fillText(line,tx,i*fs*(o.lineHeight||1.1));});break;
 }
 case 'rect':ctx.fillRect(0,0,w,h);break;
 case 'line':ctx.fillRect(0,0,w,h);break;
 case 'ellipse':ctx.beginPath();ctx.ellipse(w/2,h/2,w/2,h/2,0,0,TAU);ctx.fill();break;
 case 'triangle':ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();break;
 case 'star':case 'burst':{
  const n=o.type==='star'?4:18,inner=o.type==='star'?.16:.83;ctx.beginPath();for(let i=0;i<n*2;i++){const a=i*Math.PI/n-Math.PI/2,r=i%2?inner:1;const x=w/2+Math.cos(a)*w/2*r,y=h/2+Math.sin(a)*h/2*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();break;
 }
 case 'rings':for(let i=0;i<13;i++){ctx.beginPath();ctx.ellipse(w/2,h/2,w*(.08+i*.032),h*(.08+i*.032),0,0,TAU);ctx.stroke();}break;
 case 'grid':ctx.beginPath();for(let i=0;i<=w;i+=w/18){ctx.moveTo(i,0);ctx.lineTo(i,h);}for(let i=0;i<=h;i+=w/18){ctx.moveTo(0,i);ctx.lineTo(w,i);}ctx.stroke();break;
 case 'gradient':ctx.fillStyle=gradient(ctx,o);ctx.fillRect(0,0,w,h);break;
 case 'mesh':{
  ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();ctx.fillStyle=gradient(ctx,o);ctx.fillRect(0,0,w,h);
  for(let i=0;i<6;i++){const x=rnd()*w,y=rnd()*h,r=Math.max(w,h)*(.35+rnd()*.4);const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,(i%2?o.color:o.color2)+'dd');g.addColorStop(1,(i%2?o.color:o.color2)+'00');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
  break;
 }
 case 'particles':case 'grain':{
  const density=o.density||45,n=o.type==='grain'?density*180:density*11;
  for(let i=0;i<n;i++){ctx.globalAlpha=o.opacity*(.12+rnd()*.7);const x=rnd()*w,y=rnd()*h,r=(o.type==='grain'?.5+rnd():.5+rnd()*3.5)*w/700;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}break;
 }
 case 'halftone':{
  const step=w/(8+(o.density||45)*.5);for(let x=step/2;x<w;x+=step)for(let y=step/2;y<h;y+=step){ctx.beginPath();ctx.arc(x,y,step*.4*(.2+.8*y/h),0,TAU);ctx.fill();}break;
 }
 case 'image':{
  const im=images.get(o.src);if(!im)break;ctx.beginPath();if(o.mask==='ellipse')ctx.ellipse(w/2,h/2,w/2,h/2,0,0,TAU);else ctx.rect(0,0,w,h);ctx.clip();
  ctx.filter=`brightness(${o.brightness||100}%) contrast(${o.contrast||100}%) grayscale(${o.grayscale||0}%)`;
  const ratio=(o.fit==='contain'?Math.min:Math.max)(w/im.width,h/im.height)*(o.cropZoom||1),iw=im.width*ratio,ih=im.height*ratio;
  const ix=(w-iw)/2+(o.cropX||0)*(Math.abs(w-iw)/2),iy=(h-ih)/2+(o.cropY||0)*(Math.abs(h-ih)/2);ctx.drawImage(im,ix,iy,iw,ih);break;
 }
 }ctx.restore();
};
F.render=(canvas,p,{images=new Map(),transparent=false,onlyLayer=null}={})=>{
 const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/p.width,canvas.height/p.height);
 if(!transparent&&!onlyLayer){F.drawLayer(ctx,F.layer(p.background.type==='solid'?'rect':p.background.type,0,0,p.width,p.height,{...p.background,type:p.background.type==='solid'?'rect':p.background.type,visible:true,opacity:1,rotation:0}),images);}
 for(const o of onlyLayer?[onlyLayer]:p.layers)F.drawLayer(ctx,o,images);ctx.restore();
};
F.localPoint=(o,x,y)=>{const a=-o.rotation*Math.PI/180,dx=x-o.x-o.w/2,dy=y-o.y-o.h/2;return {x:dx*Math.cos(a)-dy*Math.sin(a)+o.w/2,y:dx*Math.sin(a)+dy*Math.cos(a)+o.h/2};};
F.hit=(o,x,y)=>{const p=F.localPoint(o,x,y);return o.visible&&!o.locked&&p.x>=0&&p.x<=o.w&&p.y>=0&&p.y<=o.h;};
F.resizeProject=(p,w,h)=>{const sx=w/p.width,sy=h/p.height;for(const o of p.layers){o.x*=sx;o.y*=sy;o.w*=sx;o.h*=sy;if(o.fontSize)o.fontSize*=Math.min(sx,sy);}p.width=w;p.height=h;};
F.applyTemplate=(p,id,seed)=>{
 const next=F.makeProject(id,p.content,p.width,p.height,seed);next.name=p.name;
 const photos=p.layers.filter(o=>o.slot&&o.type==='image'&&!o.locked),slots=next.layers.filter(o=>o.slot&&!o.locked),used=new Set(),filled=new Set();
 slots.forEach((slot,i)=>{if(!photos.length)return;const photo=photos[i%photos.length];used.add(photo.id);filled.add(slot.id);slot.frameName=slot.name;slot.type='image';slot.src=photo.src;slot.name=photo.name;slot.fit='cover';slot.mask=slot.mask||'rect';slot.cropZoom=1;slot.cropX=0;slot.cropY=0;slot.userAdded=true;for(const key of ['brightness','contrast','grayscale','effect','ink','paper','dotSize','effectAmount'])if(photo[key]!==undefined)slot[key]=photo[key];});
 next.layers=next.layers.filter(o=>!filled.has(o.placeholderFor));
 const retained=p.layers.filter(o=>(o.locked||o.userAdded)&&!used.has(o.id));const roles=new Set(retained.filter(o=>o.role).map(o=>o.role));
 next.layers=next.layers.filter(o=>!roles.has(o.role)&&!(o.type==='grain'&&retained.some(r=>r.type==='grain'&&r.locked))).concat(F.clone(retained));if(next.layers.length>150)throw new Error('テンプレートを適用すると150レイヤーを超えます。不要な要素を減らしてください。');return next;
};
F.recolor=(p,palette)=>{const old=p.palette;p.layers.forEach(o=>{if(o.locked)return;for(const key of ['color','color2']){const i=old.indexOf(o[key]);if(i!==-1)o[key]=palette[i];}});for(const key of ['color','color2']){const i=old.indexOf(p.background[key]);if(i!==-1)p.background[key]=palette[i];}p.palette=palette.slice();};
F.validate=p=>{
 const fail=()=>{throw new Error('FLYRA の編集データとして読み込めない形式です。');};
 const num=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
 const color=x=>typeof x==='string'&&/^#[0-9a-f]{6}$/i.test(x);
 if(!p||p.format!=='flyra'||p.version!==1||!num(p.width,100,5000)||!num(p.height,100,5000)||typeof p.name!=='string'||p.name.length>80||!Array.isArray(p.layers)||p.layers.length>150||!p.background||!p.content||!Array.isArray(p.palette)||p.palette.length!==4||!p.palette.every(color))fail();
 const materials=['solid','gradient','mesh','particles','grain','halftone'];
 const types=['text','rect','ellipse','triangle','star','burst','line','rings','grid','gradient','mesh','particles','grain','halftone','image'];
 if(!materials.includes(p.background.type)||!color(p.background.color)||!color(p.background.color2)||!num(p.background.angle,0,360)||!num(p.background.density,5,100)||!num(p.background.seed,0,2147483647))fail();
 for(const key of Object.keys(F.defaultContent)){if(typeof p.content[key]!=='string'||p.content[key].length>1000)fail();}
 const ids=new Set();for(const o of p.layers){
  if(!o||!types.includes(o.type)||typeof o.id!=='string'||ids.has(o.id)||typeof o.name!=='string'||o.name.length>200||!num(o.x,-20000,20000)||!num(o.y,-20000,20000)||!num(o.w,1,20000)||!num(o.h,1,20000)||!num(o.rotation,-360,360)||!num(o.opacity,0,1)||!color(o.color)||!color(o.color2)||typeof o.visible!=='boolean'||typeof o.locked!=='boolean'||!['source-over','multiply','screen','overlay'].includes(o.blend))fail();ids.add(o.id);
  if(o.type==='text'&&(typeof o.text!=='string'||o.text.length>5000||!num(o.fontSize,1,2000)||!Object.keys(F.fonts).includes(o.font)||!num(o.fontWeight,100,2000)||!num(o.lineHeight,.7,3)||!['left','center','right'].includes(o.align)))fail();
  for(const [k,min,max] of [['seed',0,2147483647],['angle',0,360],['density',5,100],['brightness',1,200],['contrast',1,200],['grayscale',0,100],['cropZoom',1,4],['cropX',-1,1],['cropY',-1,1]])if(o[k]!==undefined&&!num(o[k],min,max))fail();
  if(o.type==='image'&&(typeof o.src!=='string'||!/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(o.src)||o.src.length>15000000||!['cover','contain'].includes(o.fit)||!['rect','ellipse'].includes(o.mask)))fail();
  if(o.role&&!Object.keys(F.defaultContent).includes(o.role))fail();
 }return F.clone(p);
};
root.Flyra=F;if(typeof module!=='undefined')module.exports=F;
})(typeof window!=='undefined'?window:globalThis);
