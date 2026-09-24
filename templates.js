/* Original reference-informed layouts: print, collage, Y2K and merch menus. */
(() => {
const F=window.Flyra,base=F.makeProject;
F.palettes.push(['#eee9d8','#243d3b','#e76a32','#658f88'],['#ffd936','#b6226c','#193ee0','#f8efcf'],['#f2f3fa','#24222d','#6542df','#b7baf0'],['#f8f7f1','#153bcc','#e3ef24','#a7c9db']);
const additions=[{id:'riso',name:'Ink & rhythm',caption:'RISOGRAPH / LIVE',category:'live',palette:9},{id:'zine',name:'Quiet days',caption:'PHOTO ZINE / LIVE',category:'live',palette:8},{id:'y2k',name:'Parallel world',caption:'Y2K / LIVE',category:'live',palette:10},{id:'merch',name:'Merch market',caption:'MERCH LIST / GOODS',category:'goods',palette:11}];
F.templates.unshift(...additions);F.defaultContent.title='NOISE\n& FORM';
F.makeProject=(id='riso',content=F.defaultContent,width=1080,height=1350,seed=2026)=>{
 if(!additions.some(x=>x.id===id))return base(id,content,width,height,seed);
 const t=additions.find(x=>x.id===id),p=F.palettes[t.palette],layers=[];
 const add=(type,x,y,w,h,e={})=>{const o=F.layer(type,x,y,w,h,{color:p[1],color2:p[2],...e});layers.push(o);return o;};
 const txt=(role,x,y,w,h,size,e={})=>add('text',x,y,w,h,{name:({title:'タイトル',subtitle:'キャッチコピー',date:'日時',venue:'会場',details:'出演・説明',price:'料金'})[role],role,text:content[role],font:'sans',fontWeight:700,fontSize:size,lineHeight:1.1,align:'left',...e});
 const raw=(text,x,y,w,h,size,e={})=>add('text',x,y,w,h,{name:text,text,font:'sans',fontWeight:700,fontSize:size,lineHeight:1.1,align:'left',...e});
 const slot=(x,y,w,h,e={})=>add('rect',x,y,w,h,{color:p[3],name:'写真・商品画像を入れる',slot:true,...e});
 if(id==='riso'){
  raw('INDEPENDENT SOUND & VISUAL CULTURE',55,40,730,35,16);raw('001',835,35,110,50,35,{align:'right'});
  txt('title',45,113,910,320,168,{font:'heavy',lineHeight:.9});
  add('ellipse',180,420,660,520,{name:'メインの色面',color:p[1]});add('rings',205,410,595,550,{name:'レコードの軌道',color:p[0]});
  add('halftone',100,460,770,430,{name:'印刷の網点',density:40,opacity:.42,color:p[0]});
  raw('LIVE MUSIC / ART / PEOPLE',150,625,700,80,28,{color:p[0],textShape:'arc'});
  txt('subtitle',55,940,890,44,24);add('line',55,1005,890,3);txt('date',55,1030,890,52,38);txt('venue',55,1100,890,35,22);txt('details',55,1150,585,70,19,{lineHeight:1.4});txt('price',655,1160,285,60,20,{align:'right'});
  add('grain',0,0,1000,1250,{name:'印刷のざらつき',density:55,seed,opacity:.18,color:p[1],locked:true});
 }else if(id==='zine'){
  raw('NOTES FROM THE EVERYDAY',48,43,670,27,15,{font:'mono'});raw('VOL. 026',740,43,212,27,15,{align:'right',font:'mono'});
  txt('subtitle',48,204,904,35,20);txt('title',36,260,928,291,166,{font:'heavy',color:p[2],lineHeight:.86});
  const photo=slot(48,553,904,440);add('ellipse',360,610,330,330,{name:'仮のオブジェクト',color:p[2],placeholderFor:photo.id});raw('YOUR PHOTO HERE',305,800,400,55,25,{color:p[0],align:'center',placeholderFor:photo.id});
  txt('date',48,1030,904,47,32,{font:'mono'});txt('venue',48,1095,904,32,20);txt('details',48,1148,600,67,19,{fontWeight:400,lineHeight:1.4});txt('price',680,1150,270, sixty(),17,{align:'right'});
  add('grain',0,0,1000,1250,{name:'古い紙の粒子',density:60,seed,opacity:.18,color:p[1],locked:true});
 }else if(id==='y2k'){
  add('mesh',0,0,1000,1250,{name:'淡いホログラム',color:p[0],color2:p[3],seed});add('chrome',160,305,730,670,{name:'クロームの軌道',rotation:15});add('checker',55,58,225,100,{name:'チェッカー',color:p[2]});raw('DIGITAL CULTURE\nIN REAL LIFE',600,57,330, sixty(),18,{align:'right',font:'mono'});
  txt('title',50,207,900,325,157,{font:'serif',lineHeight:.92});txt('subtitle',55,557,840,55,25,{color:p[2]});
  add('star',825,720,105,105,{name:'スパーク',color:p[2]});add('rect',48,948,904,259,{name:'情報の台紙',color:p[0],opacity:.92});txt('date',75,973,850,50,36,{color:p[2]});txt('venue',75,1043,850,35,21);txt('details',75,1100,570,73,22,{fontWeight:400,lineHeight:1.4});txt('price',670,1110,245,60,18,{align:'right',color:p[2]});
 }else{
  add('grid',0,0,1000,1250,{name:'ノートの方眼',color:p[3],opacity:.55});add('rect',0,0,1000,250,{name:'ヘッダー',color:p[1]});txt('title',45,40,730,130, seventy(),{font:'heavy',color:p[0],lineHeight:.95});txt('subtitle',50,194,730,34,19,{color:p[0]});add('burst',817,42,137,137,{name:'NEW バッジ',color:p[2]});raw('NEW',830,94,110,45,28,{color:p[1],align:'center'});
  const names=['T-SHIRT','PHOTO BOOK','ACRYLIC KEY','STICKER SET','TOTE BAG','PIN BADGE'];const prices=['¥3,500','¥1,800','¥800','¥500','¥2,000','¥400'];
  names.forEach((name,i)=>{const x=50+(i%3)*320,y=288+Math.floor(i/3)*355;const imageSlot=slot(x,y,260,245,{color:i%2?p[3]:p[0],name:'商品画像 '+(i+1)});add('star',x+80,y+62,100,110,{color:p[1],name:'仮の装飾 '+(i+1),placeholderFor:imageSlot.id});raw(name,x,y+262,260,33,20);raw(prices[i],x,y+306,260,33,22,{color:p[1]});});
  add('rect',0,1046,1000,204,{name:'フッター',color:p[1]});txt('date',50,1073,900,40,25,{color:p[0]});txt('venue',50,1122,900,34,20,{color:p[0]});txt('details',50,1172,595,55,16,{color:p[0],lineHeight:1.25});txt('price',680,1180,270, forty(),17,{color:p[2],align:'right'});
 }
 for(const o of layers){o.x*=width/1000;o.y*=height/1250;o.w*=width/1000;o.h*=height/1250;if(o.fontSize)o.fontSize*=Math.min(width/1000,height/1250);}
 return {format:'flyra',version:1,name:'はじめてのフライヤー',width,height,template:id,seed,palette:p.slice(),content:F.clone(content),background:{type:'solid',color:p[0],color2:p[3],angle:135,density:45,seed},layers};
};
function forty(){return 40;}function sixty(){return 60;}function seventy(){return 70;}
})();
