/* GitHub credentials only live in this instance; never persisted. */
(() => {
class FlyraRepository {
 constructor(token,request=fetch){this.token=token;this.request=request;this.base='https://api.github.com/repos/Kaichi-Naito/FLYRA';}
 async api(path,method='GET',body){const r=await this.request(this.base+path,{method,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+this.token,'X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});if(!r.ok)throw Error(r.status===401?'接続情報が無効です':r.status===403?'書き込み権限、利用制限、ブランチ保護を確認してください':r.status===409||r.status===422?'GitHubに別の変更があります。再接続して変更をやり直してください':'GitHubとの通信に失敗しました ('+r.status+')');return r.json();}
 async load(){const head=await this.api('/git/ref/heads/main');this.head=head.object.sha;const commit=await this.api('/git/commits/'+this.head);this.tree=commit.tree.sha;const tree=await this.api('/git/trees/'+this.tree+'?recursive=1');if(tree.truncated)throw Error('素材一覧が大きすぎます');this.files=tree.tree.filter(x=>x.type==='blob');const read=async(path,fallback)=>{const entry=this.files.find(x=>x.path===path);if(!entry)return fallback;const blob=await this.api('/git/blobs/'+entry.sha);return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(blob.content.replace(/\s/g,'')),c=>c.charCodeAt(0))));};this.config=await read('site-config.json',{version:1,categories:[{id:'live',name:'ライブ'},{id:'goods',name:'グッズ'}],templates:{}});this.manifest=await read('assets/manifest.json',[]);return this;}
 async save(config,manifest,changes){
  const latest=await this.api('/git/ref/heads/main');if(latest.object.sha!==this.head)throw Error('他の人が更新しています。再接続して最新の内容を読み込んでください。編集内容はまだGitHubに保存されていません。');
  const entries=[];for(const change of changes){if(!/^assets\/(icons|textures|logos)\//.test(change.path)||change.path.split('/').includes('..'))throw Error('素材の保存先が不正です');let sha=change.sha;if(change.base64){const blob=await this.api('/git/blobs','POST',{content:change.base64,encoding:'base64'});sha=blob.sha;}entries.push({path:change.path,mode:'100644',type:'blob',sha});}
  entries.push(...[['site-config.json',config],['assets/manifest.json',manifest]].map(([path,value])=>({path,mode:'100644',type:'blob',content:JSON.stringify(value,null,2)+'\n'})));
  const unique=new Map();for(const entry of entries){if(entry.sha===null&&unique.has(entry.path))continue;unique.set(entry.path,entry);}const tree=await this.api('/git/trees','POST',{base_tree:this.tree,tree:[...unique.values()]});const commit=await this.api('/git/commits','POST',{message:'Update FLYRA shared assets and template categories',tree:tree.sha,parents:[this.head]});await this.api('/git/refs/heads/main','PATCH',{sha:commit.sha,force:false});this.head=commit.sha;this.tree=tree.sha;return commit.sha;
 }
 disconnect(){this.token='';}
}
if(typeof module!=='undefined')module.exports=FlyraRepository;else window.FlyraRepository=FlyraRepository;
})();
