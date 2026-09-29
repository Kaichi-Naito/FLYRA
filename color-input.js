/* HEX entry shares the existing color input's change and undo path. */
(() => {
'use strict';
const F=window.Flyra;
F.normalizeHexColor=value=>{
 const hex=String(value).trim().replace(/^#/,'');
 if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex))return null;
 return '#'+(hex.length===3?[...hex].map(c=>c+c).join(''):hex).toLowerCase();
};
let serial=0;
function enhance(root){
 for(const picker of root.querySelectorAll('input[type="color"]')){
  if(picker.closest('.color-entry'))continue;
  const name=picker.getAttribute('aria-label')||picker.closest('label')?.firstChild?.textContent.trim()||'色';
  const wrap=document.createElement('span'),code=document.createElement('input'),error=document.createElement('small');
  wrap.className='color-entry';code.type='text';code.className='color-code';code.spellcheck=false;code.autocomplete='off';code.placeholder='#RRGGBB';
  code.setAttribute('aria-label',name+'のカラーコード');code.title='3桁または6桁のHEXカラーコード。Enterまたは欄の外をクリックして適用';
  error.id='color-code-error-'+(++serial);error.className='color-code-error';error.textContent='3桁または6桁のカラーコードを入力してください。';error.hidden=true;
  code.setAttribute('aria-describedby',error.id);
  picker.before(wrap);wrap.append(picker,code,error);
  const invalid=bad=>{code.setAttribute('aria-invalid',String(bad));code.setCustomValidity(bad?error.textContent:'');error.hidden=!bad;};
  const sync=()=>{code.value=picker.value.toUpperCase();code.disabled=picker.disabled;invalid(false);};
  const apply=()=>{
   if(picker.disabled)return;
   const value=F.normalizeHexColor(code.value);invalid(!value);if(!value)return;
   code.value=value.toUpperCase();if(value===picker.value)return;
   picker.value=value;picker.dispatchEvent(new Event('input',{bubbles:true}));picker.dispatchEvent(new Event('change',{bubbles:true}));
  };
  code.addEventListener('input',e=>{e.stopPropagation();invalid(!F.normalizeHexColor(code.value));});
  code.addEventListener('change',e=>{e.stopPropagation();apply();});
  code.addEventListener('blur',apply);
  code.addEventListener('keydown',e=>{
   if(e.key==='Enter'){e.preventDefault();e.stopPropagation();apply();if(code.isConnected)code.reportValidity();}
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();sync();}
  });
  picker.addEventListener('input',sync);picker.addEventListener('change',sync);sync();
 }
}
F.enhanceColorInputs=enhance;
enhance(document);
// Only dynamic color-control panels are observed; canvas redraws do not scan the UI.
for(const id of ['properties','paletteColors']){
 const root=document.getElementById(id);if(root)new MutationObserver(()=>enhance(root)).observe(root,{childList:true,subtree:true});
}
})();
