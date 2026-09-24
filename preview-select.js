/* Accessible select menus: hover/focus previews, click/Enter commits. */
(() => {
'use strict';
let active=null,serial=0;
const controls=new WeakMap();
function close(restoreFocus=false){
 if(!active)return;const a=active;active=null;a.cancel();a.menu.remove();a.button.setAttribute('aria-expanded','false');
 if(restoreFocus&&a.button.isConnected)a.button.focus();
}
function enhance(root=document){
 root.querySelectorAll('select').forEach(select=>{
  if(controls.has(select))return;
  const button=document.createElement('button');button.type='button';button.className='preview-select';
  const label=select.getAttribute('aria-label')||select.closest('label')?.firstChild?.textContent?.trim()||'選択';
  button.setAttribute('aria-label',label);button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');
  select.classList.add('native-preview-select');select.tabIndex=-1;select.setAttribute('aria-hidden','true');select.after(button);controls.set(select,button);
  const refresh=()=>{button.textContent=(select.selectedOptions[0]?.textContent||'選択')+' ▾';button.disabled=select.disabled;};refresh();
  new MutationObserver(refresh).observe(select,{attributes:true,attributeFilter:['disabled']});select.addEventListener('change',refresh);
  function open(focus=false){
   if(select.disabled)return;if(active?.select===select){if(focus)active.menu.querySelector('[aria-selected=true]')?.focus();return;}close();
   const menu=document.createElement('div');menu.className='preview-menu';menu.id='preview-menu-'+(++serial);menu.setAttribute('role','listbox');menu.setAttribute('aria-label',label);
   const hint=document.createElement('div');hint.className='preview-hint';hint.textContent='カーソルで試す · クリックで確定';menu.append(hint);
   const original=select.value;
   const cancel=()=>select.dispatchEvent(new CustomEvent('previewcancel',{bubbles:true}));
   active={select,button,menu,cancel};button.setAttribute('aria-controls',menu.id);button.setAttribute('aria-expanded','true');
   const items=[];
   for(const option of select.options){
    const item=document.createElement('button');item.type='button';item.setAttribute('role','option');item.setAttribute('aria-selected',String(option.value===original));item.textContent=option.textContent;item.dataset.value=option.value;item.disabled=option.disabled;item.tabIndex=option.value===original?0:-1;
    const preview=()=>{if(item.disabled)return;items.forEach(x=>x.classList.toggle('previewing',x===item));select.dispatchEvent(new CustomEvent('optionpreview',{bubbles:true,detail:{value:option.value}}));};
    item.addEventListener('pointerenter',preview);item.addEventListener('focus',preview);
    item.onclick=()=>{const value=option.value;close();if(value!==original){select.value=value;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));}refresh();
     const next=select.isConnected?button:document.querySelector(`[data-prop="${select.dataset.prop}"] + .preview-select`);next?.focus();};
    item.onkeydown=e=>{let index=items.indexOf(item);if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();index=e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items[index].focus();}};
    items.push(item);menu.append(item);
   }
   (select.closest('dialog')||document.body).append(menu);
   const rect=button.getBoundingClientRect(),height=Math.min(330,window.innerHeight-24),width=Math.min(Math.max(rect.width,220),window.innerWidth-16);
   menu.style.width=width+'px';menu.style.maxHeight=height+'px';menu.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-width-8))+'px';
   const actual=menu.getBoundingClientRect().height;menu.style.top=Math.max(8,Math.min(rect.bottom,window.innerHeight-actual-8))+'px';
   menu.addEventListener('pointerleave',()=>{cancel();items.forEach(x=>x.classList.remove('previewing'));});
   if(focus)(items.find(x=>x.getAttribute('aria-selected')==='true')||items[0])?.focus();
  }
  button.onclick=()=>{if(active?.select===select)close();else open(true);};
  button.onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();open(true);}};
 });
}
document.addEventListener('pointerdown',e=>{if(active&&!active.menu.contains(e.target)&&!active.button.contains(e.target))close();},true);
document.addEventListener('keydown',e=>{if(active&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close(true);}},true);
document.addEventListener('focusin',e=>{if(active&&!active.menu.contains(e.target)&&e.target!==active.button)close();});
window.addEventListener('blur',()=>close());window.addEventListener('resize',()=>close());
document.addEventListener('scroll',e=>{if(active&&!active.menu.contains(e.target))close();},true);
window.FlyraSelect={enhance,close,refresh(){document.querySelectorAll('select').forEach(s=>{const b=controls.get(s);if(b){b.textContent=(s.selectedOptions[0]?.textContent||'選択')+' ▾';b.disabled=s.disabled;}});}};
})();
