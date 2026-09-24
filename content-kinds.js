/* Independent briefs for live announcements and merchandise. */
(() => {
const F=window.Flyra,make=F.makeProject,apply=F.applyTemplate,validate=F.validate;
F.contentKind=id=>F.templates.find(t=>t.id===id)?.category==='goods'?'goods':'live';
F.goodsContent={title:'PHALUX\nNEW GOODS',subtitle:'いつもの毎日に、好きな音楽を。',date:'2026.12.09 販売開始',venue:'公式オンラインショップ / ライブ会場',details:'オリジナル Tシャツ\nサイズ：S / M / L / XL\nカラー：BLACK / WHITE',price:'¥3,500（税込）'};
F.contentLabels={live:{title:'イベント名',subtitle:'キャッチコピー',date:'開催日・開場／開演',venue:'会場',details:'出演者',price:'料金・チケット'},goods:{title:'商品名・シリーズ名',subtitle:'キャッチコピー',date:'販売開始日・販売期間',venue:'販売場所・ショップ',details:'商品説明・サイズ・カラー',price:'価格・購入方法'}};
F.makeProject=(id,content,...args)=>{const kind=F.contentKind(id);const p=make(id,content??(kind==='goods'?F.goodsContent:F.defaultContent),...args);p.contentKind=kind;return p;};
F.applyTemplate=(p,id,seed)=>{
 const from=p.contentKind||F.contentKind(p.template),to=F.contentKind(id);
 const briefs=F.clone(p.contentByKind||{});briefs[from]=F.clone(p.content);
 const content=from===to?p.content:(briefs[to]||(to==='goods'?F.goodsContent:F.defaultContent));
 const next=apply({...p,content},id,seed);next.contentKind=to;next.contentByKind=briefs;next.contentByKind[to]=F.clone(content);return next;
};
F.validate=p=>{
 if(p.contentKind!==undefined&&!['live','goods'].includes(p.contentKind))throw Error('告知内容の種類が不正です');
 if(p.contentByKind!==undefined){if(!p.contentByKind||typeof p.contentByKind!=='object'||Array.isArray(p.contentByKind))throw Error('告知内容が不正です');for(const [kind,content] of Object.entries(p.contentByKind)){if(!['live','goods'].includes(kind)||!content||Object.keys(F.defaultContent).some(k=>typeof content[k]!=='string'||content[k].length>1000))throw Error('告知内容が不正です');}}
 return validate(p);
};
})();
