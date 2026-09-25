/* Resolution-independent decorative shapes; the same paths power shelf previews and export. */
(() => {
const F=window.Flyra;
const polygon=(n,inner=1,phase=-Math.PI/2)=>Array.from({length:inner===1?n:n*2},(_,i)=>{const a=phase+i*Math.PI*2/(inner===1?n:n*2),r=inner===1||i%2===0?48:48*inner;return (i?'L':'M')+(50+Math.cos(a)*r)+','+(50+Math.sin(a)*r);}).join(' ')+'Z';
const circle='M 50 4 A 46 46 0 1 1 50 96 A 46 46 0 1 1 50 4 Z';
const shapes=[
 ['spark8','きらめき・8芒','星・きらめき','M50 0 L55 38 L77 23 L62 45 L100 50 L62 55 L77 77 L55 62 L50 100 L45 62 L23 77 L38 55 L0 50 L38 45 L23 23 L45 38 Z'],
 ['star5','五芒星','星・きらめき',polygon(5,.43)],
 ['star6','六芒星','星・きらめき',polygon(6,.52)],
 ['star12','トゲ星','星・きらめき',polygon(12,.48)],
 ['seal','ギザギザシール','星・きらめき',polygon(16,.86)],
 ['asterisk','アスタリスク','星・きらめき','', 'M50 5 V95 M11 27 L89 73 M11 73 L89 27',12],
 ['sun','太陽','星・きらめき','M50 24 A26 26 0 1 1 50 76 A26 26 0 1 1 50 24Z','M50 3 V14 M50 86 V97 M3 50 H14 M86 50 H97 M17 17 L25 25 M75 75 L83 83 M17 83 L25 75 M75 25 L83 17',5],
 ['moon','三日月','星・きらめき','M72 4 A48 48 0 1 0 72 96 A51 51 0 0 1 72 4Z'],
 ['heart','ハート','気持ち・マーク','M50 94 C40 83 3 58 3 31 C3 3 36 -4 50 23 C64 -4 97 3 97 31 C97 58 60 83 50 94Z'],
 ['heartOutline','ハート・輪郭','気持ち・マーク','', 'M50 93 C40 82 5 57 5 32 C5 6 36 0 50 25 C64 0 95 6 95 32 C95 57 60 82 50 93Z',5],
 ['smile','スマイル','気持ち・マーク','M34 28 A5 10 0 1 1 34 48 A5 10 0 1 1 34 28Z M66 28 A5 10 0 1 1 66 48 A5 10 0 1 1 66 28Z',circle+' M25 62 Q50 91 75 62',4],
 ['wink','ウインク','気持ち・マーク','M34 28 A5 10 0 1 1 34 48 A5 10 0 1 1 34 28Z',circle+' M59 37 Q67 30 75 37 M25 62 Q50 91 75 62',4],
 ['lightning','稲妻','気持ち・マーク','M55 1 L13 58 H43 L34 99 L87 40 H57 L72 1Z'],
 ['flower','フラワー','気持ち・マーク','M50 29 C15 -19 -16 21 28 50 C-16 79 15 119 50 71 C85 119 116 79 72 50 C116 21 85 -19 50 29Z'],
 ['clover','クローバー','気持ち・マーク','M30 2 A24 24 0 1 1 30 50 A24 24 0 1 1 30 2Z M67 2 A24 24 0 1 1 67 50 A24 24 0 1 1 67 2Z M30 37 A24 24 0 1 1 30 85 A24 24 0 1 1 30 37Z M67 37 A24 24 0 1 1 67 85 A24 24 0 1 1 67 37Z','M51 64 Q51 88 67 98',5],
 ['crown','王冠','気持ち・マーク','M9 80 L2 24 L29 46 L50 5 L71 46 L98 24 L91 80Z M10 87 H90 V98 H10Z'],
 ['note','音符','音楽','M55 5 H63 V70 C63 96 18 103 18 79 C18 63 40 58 55 64Z M63 5 C67 24 96 25 83 53 C86 31 64 36 63 29Z'],
 ['notes','連符','音楽','M31 19 L91 4 V71 C91 91 59 98 59 79 C59 67 73 63 84 67 V29 L38 41 V82 C38 102 6 107 6 89 C6 76 20 73 31 77Z'],
 ['headphones','ヘッドホン','音楽','M7 49 H24 V90 H7Z M76 49 H93 V90 H76Z','M11 59 V45 A39 39 0 0 1 89 45 V59',8],
 ['record','レコード','音楽','','M50 4 A46 46 0 1 1 50 96 A46 46 0 1 1 50 4Z M50 35 A15 15 0 1 1 50 65 A15 15 0 1 1 50 35Z M50 47 A3 3 0 1 1 50 53 A3 3 0 1 1 50 47Z M18 49 A32 32 0 0 1 49 18 M82 51 A32 32 0 0 1 51 82',4],
 ['equalizer','イコライザー','音楽','M3 35 H15 V95 H3Z M23 10 H35 V95 H23Z M44 26 H56 V95 H44Z M65 3 H77 V95 H65Z M85 44 H97 V95 H85Z'],
 ['play','再生','音楽','M15 4 L92 50 L15 96Z'],
 ['diamond','ひし形','ラベル・幾何学','M50 0 L100 50 L50 100 L0 50Z'],
 ['hexagon','六角形','ラベル・幾何学',polygon(6,1,0)],
 ['pentagon','五角形','ラベル・幾何学',polygon(5)],
 ['cross','プラス','ラベル・幾何学','M36 0 H64 V36 H100 V64 H64 V100 H36 V64 H0 V36 H36Z'],
 ['speech','吹き出し','ラベル・幾何学','M15 4 H85 Q98 4 98 18 V62 Q98 76 85 76 H46 L20 98 V76 H15 Q2 76 2 62 V18 Q2 4 15 4Z'],
 ['ticket','チケット','ラベル・幾何学','M2 10 H98 V35 C76 35 76 65 98 65 V90 H2 V65 C24 65 24 35 2 35Z'],
 ['ribbon','リボン','ラベル・幾何学','M0 17 H100 L82 50 L100 83 H0 L18 50Z'],
 ['arch','アーチ','ラベル・幾何学','M2 98 V50 A48 48 0 0 1 98 50 V98Z'],
 ['pill','カプセル','ラベル・幾何学','M27 17 H73 A25 33 0 0 1 73 83 H27 A25 33 0 0 1 27 17Z'],
 ['doubleArrow','両矢印','ラベル・幾何学','M0 50 L28 15 V36 H72 V15 L100 50 L72 85 V64 H28 V85Z']
];
F.extraShapes=Object.fromEntries(shapes.map(([id,label,group,fill,stroke='',width=4])=>[id,{label,group,fill,stroke,width,path:fill?new Path2D(fill):null,line:stroke?new Path2D(stroke):null}]));
F.drawExtraShape=(ctx,o)=>{const s=F.extraShapes[o.type];if(!s)return;ctx.save();ctx.scale(o.w/100,o.h/100);ctx.lineWidth=s.width;ctx.lineCap=ctx.lineJoin='round';if(s.path)ctx.fill(s.path);if(s.line)ctx.stroke(s.line);ctx.restore();};
const shelf=document.querySelector('#panel-elements .shape-grid');
if(shelf){for(const group of [...new Set(shapes.map(s=>s[2]))]){const title=document.createElement('div');title.className='section-title';title.textContent=group;const grid=document.createElement('div');grid.className='shape-grid';for(const [id,s] of Object.entries(F.extraShapes).filter(([,s])=>s.group===group)){const b=document.createElement('button');b.dataset.shape=id;b.title=s.label;b.innerHTML='<svg viewBox="0 0 100 100" width="30" height="30" aria-hidden="true">'+(s.fill?'<path d="'+s.fill+'" fill="currentColor"/>':'')+(s.stroke?'<path d="'+s.stroke+'" fill="none" stroke="currentColor" stroke-width="'+s.width+'" stroke-linecap="round" stroke-linejoin="round"/>':'')+'</svg><span class="shape-label">'+s.label+'</span>';grid.append(b);}shelf.parentElement.append(title,grid);}const tip=shelf.parentElement.querySelector('.tip');if(tip)shelf.parentElement.append(tip);}
})();
