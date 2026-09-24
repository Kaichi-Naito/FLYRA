const assert=require('node:assert/strict'),Repository=require('./admin-api.js');
(async()=>{
let calls=[];const request=async(url,opts)=>{calls.push([url,opts]);const p=url.split('/FLYRA')[1];return {ok:true,json:async()=>p==='/git/ref/heads/main'?{object:{sha:'head'}}:{sha:'new-sha'}};};
const repo=new Repository('test-only',request);repo.head='head';repo.tree='base-tree';await repo.save({version:1},[],[{path:'assets/icons/new.png',base64:'AA=='},{path:'assets/icons/old.png',sha:null}]);
assert.equal(calls.length,5);const tree=JSON.parse(calls[2][1].body);assert.equal(tree.base_tree,'base-tree');assert.equal(tree.tree[1].sha,null);assert.equal(tree.tree.filter(e=>e.content).length,2);assert.equal(JSON.parse(calls[4][1].body).force,false);assert.deepEqual(JSON.parse(calls[3][1].body).parents,['head']);
assert.ok(calls.every(([url])=>url.startsWith('https://api.github.com/repos/Kaichi-Naito/FLYRA/')));
repo.disconnect();assert.equal(repo.token,'');
const conflict=new Repository('test-only',request);conflict.head='old';calls=[];await assert.rejects(()=>conflict.save({},[],[]),/他の人/);assert.equal(calls.length,1);
const invalid=new Repository('test-only',request);invalid.head='head';calls=[];await assert.rejects(()=>invalid.save({},[],[{path:'assets/icons/../../app.js',base64:'AA=='}]),/不正/);assert.equal(calls.length,1);
const denied=new Repository('test-only',async()=>({ok:false,status:403}));await assert.rejects(()=>denied.load(),/権限/);
console.log('API tests passed: atomic manifest/config commit, deletion, no force push, conflict rejection, path restriction, permission error, token disconnect');
})().catch(e=>{console.error(e);process.exitCode=1;});
