/* Original editable layouts inspired by the user's poster references. */
(() => {
'use strict';const F=window.Flyra,previous=F.makeProject,draw=F.drawLayer;
F.extraMasks.push(['arch','アーチ'],['capsule','カプセル'],['steps','階段'],['wave','波形']);
F.extraMaskPaths={
 arch(c,w,h){const r=Math.min(w/2,h/2);c.moveTo(0,h);c.lineTo(0,r);c.ellipse(w/2,r,w/2,r,0,Math.PI,0);c.lineTo(w,h);c.closePath();},
 capsule(c,w,h){c.roundRect(0,0,w,h,Math.min(w,h)/2);},
 steps(c,w,h){c.moveTo(0,h*.3);c.lineTo(w*.2,h*.3);c.lineTo(w*.2,h*.15);c.lineTo(w*.4,h*.15);c.lineTo(w*.4,0);c.lineTo(w,0);c.lineTo(w,h*.7);c.lineTo(w*.8,h*.7);c.lineTo(w*.8,h*.85);c.lineTo(w*.6,h*.85);c.lineTo(w*.6,h);c.lineTo(0,h);c.closePath();},
 wave(c,w,h){c.moveTo(0,h*.07);c.bezierCurveTo(w*.35,-h*.12,w*.65,h*.22,w,h*.07);c.lineTo(w,h*.93);c.bezierCurveTo(w*.65,h*1.12,w*.35,h*.78,0,h*.93);c.closePath();}
};
// Photo placeholders are vector scenery, replaced by an imported image with the same mask.
F.drawLayer=(ctx,o,images)=>{
 if(o.type==='text'&&o.singleLine)return draw(ctx,{...o,text:o.text.replace(/\n/g,' ')},images);
 if(o.type!=='rect'||!o.photoWindow)return draw(ctx,o,images);
 if(!o.visible)return;ctx.save();ctx.globalAlpha=o.opacity;ctx.globalCompositeOperation=o.blend;
 ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate(o.rotation*Math.PI/180);ctx.translate(-o.w/2,-o.h/2);
 F.maskPath(ctx,o);ctx.clip();const g=ctx.createLinearGradient(0,0,o.w,o.h);g.addColorStop(0,o.color);g.addColorStop(1,o.color2);ctx.fillStyle=g;ctx.fillRect(0,0,o.w,o.h);
 ctx.fillStyle='#ffffff';ctx.globalAlpha=o.opacity*.45;ctx.beginPath();ctx.arc(o.w*.72,o.h*.25,Math.min(o.w,o.h)*.12,0,Math.PI*2);ctx.fill();
 for(let i=0;i<3;i++){ctx.globalAlpha=o.opacity*(.18+i*.12);ctx.fillStyle=i===1?'#ffffff':'#102a3b';ctx.beginPath();ctx.moveTo(0,o.h);ctx.lineTo(0,o.h*(.65+i*.08));ctx.bezierCurveTo(o.w*.3,o.h*(.25+i*.16),o.w*.6,o.h*(.95-i*.1),o.w,o.h*(.5+i*.12));ctx.lineTo(o.w,o.h);ctx.closePath();ctx.fill();}
 ctx.restore();
};
const defs=[
 ['orbit-paper','Orbit paper / 軌道の窓','ARCH · PAPER','live',['#ecebe5','#163fd0','#9bcde2','#c1bdad'],'ORBIT\nSESSIONS'],
 ['night-window','Night window / 夜のアーチ','ARCH · MONO','live',['#101416','#f0eee5','#537a8b','#1a393e'],'LAST\nNIGHT'],
 ['three-portals','Three portals / 三連の窓','TRIPTYCH','live',['#111b20','#eee9d8','#6b9295','#283d4a'],'REVERIE'],
 ['light-bloom','Light bloom / 光の余韻','GRADIENT · TYPE','live',['#183c4b','#fff8df','#e7aa70','#638e9b'],'strange\nWORLD'],
 ['acid-editorial','Acid editorial / 蛍光の誌面','NEON · EDITORIAL','live',['#a8fa26','#111911','#286769','#517843'],'AFTER\nIMAGE'],
 ['step-signal','Step signal / 階段の構図','STEP · NEON','live',['#bcff3e','#111719','#c3573f','#284c57'],'FALSE\nSIGNAL'],
 ['xerox-stage','Xerox stage / コピーの断片','COLLAGE · BLUE','live',['#dcdcd5','#141c24','#345ec1','#9da6ad'],'NEW\nMOTION'],
 ['vertical-city','Vertical city / 都市と文字','TALL TYPE','live',['#f2eee4','#161e23','#f34969','#a6b6b6'],'TOKYO\nSTORIES'],
 ['wave-gallery','Wave gallery / 波の展示','WAVE · PHOTO','goods',['#81bec7','#ffffff','#3c737a','#eea779'],'WAVE\nGALLERY'],
 ['pink-masthead','Pink masthead / 大文字の舞台','MAGENTA · TYPE','live',['#ef0877','#111317','#d4c9b9','#647a81'],'PLASTIC\nDREAM'],
 ['cobalt-index','Cobalt index / 青の標本','GRID · TECH','live',['#e8e7df','#1e31d8','#727eca','#b7c4dd'],'MODULAR\nSOUND'],
 ['paper-nature','Paper nature / 紙の風景','STEP · GRAIN','goods',['#f2efe5','#292e2a','#7c9678','#c7b782'],'NATURE\nIN FORM'],
 ['orbit-object','Orbit object / 浮遊する物','OBJECT · ORBIT','goods',['#ecebf0','#342872','#9992c4','#b8d2e1'],'ORBIT\nOBJECTS'],
 ['cutout-market','Cutout market / 切り貼り市','COLLAGE · GOODS','goods',['#eee6cc','#202923','#ec6e3b','#c8d9b0'],'SMALL\nFINDS'],
 ['duo-exhibit','Duo exhibit / 二つの展示','DIPTYCH','goods',['#ede9e1','#283b44','#d3957a','#a5bec0'],'TWO\nPERSPECTIVES'],
 ['chrome-release','Chrome release / 銀の新作','CHROME · DROP','goods',['#e9eef8','#1837ce','#bdb6df','#ffffff'],'NEXT\nEDITION']
];
const additions=defs.map(([id,name,caption,category,palette,title])=>{const n=F.palettes.push(palette)-1;return{id,name,caption,category,palette:n,preview:{title}};});
F.templates.unshift(...additions);
F.makeProject=(id='riso',content=F.defaultContent,width=1080,height=1350,seed=2026)=>{
 const t=additions.find(t=>t.id===id);if(!t)return previous(id,content,width,height,seed);
 const p=F.palettes[t.palette],layers=[],add=(type,x,y,w,h,e={})=>{const o=F.layer(type,x,y,w,h,{color:p[1],color2:p[2],...e});layers.push(o);return o;};
 const text=(value,x,y,w,h,size,e={})=>add('text',x,y,w,h,{name:value,text:value,font:'sans',fontWeight:700,fontSize:size,lineHeight:1,align:'left',...e});
 const names={title:'タイトル',subtitle:'キャッチコピー',date:'日時',venue:'会場',details:'出演・説明',price:'料金'};
 const txt=(role,x,y,w,h,size,e={})=>text(content[role]||'',x,y,w,h,size,{role,name:names[role],...e});
 const photo=(x,y,w,h,mask='rect',e={})=>add('rect',x,y,w,h,{name:'写真を入れる · '+({arch:'アーチ',capsule:'カプセル',steps:'階段',wave:'波形',rect:'四角',ellipse:'円'}[mask]||mask),slot:true,photoWindow:true,mask,color:p[2],color2:p[3],...e});
 const star=(x,y,s=45,color=p[1])=>add('star',x,y,s,s,{name:'星のアクセント',color});
 const line=(x,y,w,color=p[1])=>add('line',x,y,w,2,{name:'細い罫線',color});
 const grain=(opacity=.12)=>add('grain',0,0,1000,1250,{name:'紙とインクの粒子',density:55,seed,opacity,color:p[1],locked:true});
 const footer=(y=1060,color=p[1])=>{line(50,y,900,color);txt('date',50,y+18,900,42,27,{color});txt('venue',50,y+70,900,28,19,{color});txt('details',50,y+112,570,58,17,{color,fontWeight:400,lineHeight:1.3});txt('price',650,y+118,300,45,16,{color,align:'right'});};
 const kicker=(label)=>{text(label,50,35,760,25,14,{font:'mono'});text('FL / 026',820,35,130,25,14,{font:'mono',align:'right'});};
 if(id==='orbit-paper'){
  kicker('SOUND / SPACE / TOGETHER');txt('title',40,84,920,150, eighty(),{font:'serif',align:'center',outline:true});txt('subtitle',95,252,810,35,23,{align:'center'});
  add('rings',120,300,760,715,{name:'窓を囲む軌道',color:p[1]});photo(230,325,540,635,'capsule');star(78,476,75);star(821,342,50);add('ellipse',230,963,540,25,{name:'窓の影',color:p[1],opacity:.7});footer();grain(.13);
 }else if(id==='night-window'){
  kicker('AN ARCHIVE OF AFTER HOURS');photo(160,225,680,720,'arch');text('SOUND / STORIES / MEMORIES',100,170,800,190,36,{textShape:'arc',font:'serif'});
  add('rings',80,478,840,340,{name:'斜めの軌道',rotation:-18,color:p[1]});star(96,562,55);star(850,713,55);txt('title',80,770,840,250,125,{font:'heavy',outline:true});txt('subtitle',80,1030,840,35,20);footer(1070);grain(.17);
 }else if(id==='three-portals'){
  kicker('LANDSCAPES FOR LISTENING');photo(60,235,276,725,'arch');photo(362,120,276,840,'arch',{color:p[3],color2:p[2]});photo(664,235,276,725,'arch');
  add('rings',431,40,138,58,{name:'小さな地球の軌道'});txt('title',32,480,936,190,122,{font:'serif',fontWeight:400,align:'center'});txt('subtitle',75,985,850,40,24,{align:'center'});footer();grain(.11);
 }else if(id==='light-bloom'){
  add('mesh',0,0,1000,1250,{name:'光の色面',color:p[0],color2:p[2],seed});add('rings',-80,170,1130,750,{name:'流れる光',rotation:-24,color:p[1],opacity:.35});add('ellipse',720,510,45,230,{name:'遠くのシルエット',color:p[0]});
  kicker('STAY CURIOUS / KEEP CREATING');txt('subtitle',140,190,720,75,25,{align:'center',font:'serif',fontWeight:400});txt('title',45,435,910,350,172,{font:'serif',align:'center',fontWeight:400});footer(1060,p[1]);grain(.06);
 }else if(id==='acid-editorial'){
  kicker('INDEPENDENT IDEAS / OPEN MINDS');txt('title',40,100,920,220,140,{font:'heavy',lineHeight:.88});photo(0,355,1000,495);
  txt('subtitle',50,885,900,62,30);txt('date',50,979,900,45,30);txt('details',50,1050,420,120,21,{fontWeight:400,lineHeight:1.3});txt('venue',540,1050,410,60,22,{align:'right'});txt('price',540,1135,410,50,21,{align:'right'});star(50,1210,18);star(932,1210,18);
 }else if(id==='step-signal'){
  kicker('DAILY EXPERIMENT / NO. 024');photo(55,245,890,840,'steps');txt('title',48,95,600,235,118,{font:'heavy',lineHeight:.9});txt('subtitle',55,355,275,128, twenty(),{lineHeight:1.3});star(815,780,70,p[0]);txt('date',485,1090,460, forty(),26,{align:'right'});txt('venue',485,1140,460,30,19,{align:'right'});txt('details',55,1130,365, eighty(),16,{lineHeight:1.3});txt('price',485,1191,460,28,16,{align:'right'});
 }else if(id==='xerox-stage'){
  kicker('REPLAY / REBUILD / RECONNECT');photo(40,108,650,720,'rect',{rotation:-5});photo(490,510,445,490,'rect',{rotation:6});
  for(let i=0;i<3;i++)txt('title',55,600+i*105,870,110,95,{outline:true,color:p[0],font:'heavy',singleLine:true});
  add('rect',0,340,1000,125,{name:'青い切り貼りの帯',color:p[2],rotation:-3});txt('title',40,345,920,190,120,{color:p[0],font:'heavy',rotation:-3});txt('subtitle',50,982,900,45,27);footer();grain(.22);
 }else if(id==='vertical-city'){
  txt('title',-250,500,800,230,175,{font:'heavy',rotation:90});txt('title',450,500,800,230,175,{font:'heavy',rotation:90});photo(295,65,410,925,'arch');txt('title',40,485,920,280,150,{font:'serif',fontWeight:400,color:p[2],rotation:-8});
  text('URBAN / CULTURE',42, forty(),750, thirty(),18,{font:'mono'});txt('subtitle',60,1010,880,40,25,{font:'serif'});footer(1070);
 }else if(id==='wave-gallery'){
  photo(30,30,940,490,'wave');photo(30,695,940,500,'wave',{color:p[3],color2:p[2]});txt('title',65,520,870,160,95,{outline:true,align:'center'});txt('subtitle',65,666,870, thirty(),18,{align:'center'});
  txt('date',60,85,760, ninety(),27);txt('venue',435,1045,500,75,25,{align:'right'});add('rect',45,1130,910,85,{name:'案内の帯',color:p[0]});txt('details',65,1142,565,60,17,{lineHeight:1.3});txt('price',665,1155,265, forty(),17,{align:'right'});
 }else if(id==='pink-masthead'){
  txt('title',30,35,940,260,165,{font:'heavy',lineHeight:.85});photo(0,320,1000,615);txt('subtitle', fifty(),965,900,70,35);footer(1060);text('INDEPENDENT FILM / MUSIC / ART',50,288,900,25,14,{font:'mono'});
 }else if(id==='cobalt-index'){
  kicker('FREQUENCY / CATALOGUE / 026');add('grid',35, ninety(),930,940,{name:'標本の方眼',color:p[1],opacity:.18});add('checker',35, ninety(),300,125,{name:'チェッカー断片'});txt('title',360, ninety(),595,260,95,{font:'heavy'});
  add('rings',55,295,340,270,{name:'音の等高線'});photo(440,390,510,300);add('checker', fifty(),640,320,165,{name:'チェッカーの帯'});add('arrow',50,850,190, sixty(),{name:'方向記号'});txt('subtitle',400,760,545,140,27,{font:'mono'});text('F / 01 — 02 — 03', fifty(),970,900, thirty(),25,{font:'mono'});footer();grain(.07);
 }else if(id==='paper-nature'){
  kicker('FIELD NOTES / OBJECTS OF EVERYDAY');photo( ninety(),285,820,725,'steps');txt('title',40,85,920,255,143,{font:'sans',lineHeight:.92});txt('subtitle', eighty(),910,820, eighty(),33);footer();grain(.25);
 }else if(id==='orbit-object'){
  kicker('COLLECTION / NEW PERSPECTIVES');txt('title',55,100,890,205,110,{font:'serif',align:'center',fontWeight:400});add('rings',60,325,880,630,{name:'オブジェクトの軌道',rotation:-22});photo(295,365,410,510,'capsule');star(120,520, eighty());star(800,790,55);txt('subtitle',95,950,810,60,29,{align:'center'});footer();
 }else if(id==='cutout-market'){
  kicker('HANDMADE / COLLECTED / FOUND');txt('title',40, ninety(),920,220,130,{font:'heavy'});photo(65,360,400,360,'rect',{rotation:-6});photo(550,400,385,440,'arch',{rotation:5});photo( eighty(),785,375,235,'steps',{color:p[3],color2:p[2]});add('burst',365,600,210,210,{name:'新作のバッジ',color:p[2]});text('NEW',400,670,145, fifty(),42,{align:'center',color:p[0]});txt('subtitle',520,895,430, ninety(),30);footer();grain(.12);
 }else if(id==='duo-exhibit'){
  kicker('TWO VIEWS / ONE CONVERSATION');txt('title',50,110,900,195,115,{font:'serif',fontWeight:400});photo(50,355,430,620,'arch');photo(520,355,430,620,'arch',{color:p[3],color2:p[2]});text('01',75,900,150,50, forty(),{color:p[0]});text('02',545,900,150,50, forty(),{color:p[0]});txt('subtitle',50,995,900,40,24);footer();
 }else{
  add('mesh',0,0,1000,1250,{name:'銀色の空気',color:p[0],color2:p[2],seed});kicker('LIMITED SERIES / NEXT RELEASE');add('chrome',100,200,800,800,{name:'クローム・オービット',rotation:15});add('checker', fifty(), ninety(),250,120,{name:'デジタルの断片'});txt('title',40,300,920,280,148,{font:'serif',fontWeight:400});photo(345,650,310,300,'capsule',{opacity:.85});txt('subtitle',50,990,900, forty(),24);add('rect',25,1040,950,195,{name:'情報パネル',color:p[0],opacity:.92});footer();
 }
 for(const o of layers){o.x*=width/1000;o.y*=height/1250;o.w*=width/1000;o.h*=height/1250;if(o.fontSize)o.fontSize*=Math.min(width/1000,height/1250);}
 return{format:'flyra',version:1,name:'はじめてのフライヤー',width,height,template:id,seed,palette:p.slice(),content:F.clone(content),background:{type:'solid',color:p[0],color2:p[3],angle:135,density:45,seed},layers};
};
function twenty(){return 20;}function thirty(){return 30;}function forty(){return 40;}function fifty(){return 50;}function sixty(){return 60;}function eighty(){return 80;}function ninety(){return 90;}
})();


