(() => {
const F=window.Flyra;let menu=null,returnFocus=null;
F.closeContextMenu=(restore=false)=>{menu?.remove();menu=null;if(restore&&returnFocus?.isConnected)returnFocus.focus({preventScroll:true});};
F.openContextMenu=(event,title,items)=>{
 event.preventDefault();F.closeContextMenu();returnFocus=document.activeElement;
 menu=document.createElement('div');menu.className='context-menu';menu.setAttribute('role','menu');menu.setAttribute('aria-label',title);
 const heading=document.createElement('div');heading.className='context-menu-title';heading.textContent=title;menu.append(heading);
 for(const item of items){if(!item){const line=document.createElement('div');line.className='context-menu-divider';line.setAttribute('role','separator');menu.append(line);continue;}
 const button=document.createElement('button');button.type='button';button.setAttribute('role',item.checked===undefined?'menuitem':'menuitemcheckbox');if(item.checked!==undefined)button.setAttribute('aria-checked',String(item.checked));button.textContent=(item.checked?'✓ ':'')+item.label;button.disabled=!!item.disabled;if(item.danger)button.className='danger';button.onclick=()=>{F.closeContextMenu();Promise.resolve().then(item.run).catch(e=>console.error(e));};menu.append(button);}
 document.body.append(menu);menu.style.maxHeight=Math.max(100,innerHeight-16)+'px';const rect=menu.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(event.clientX,innerWidth-rect.width-8))+'px';menu.style.top=Math.max(8,Math.min(event.clientY,innerHeight-rect.height-8))+'px';menu.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
 menu.addEventListener('keydown',e=>{const buttons=[...menu.querySelectorAll('button:not(:disabled)')],i=buttons.indexOf(document.activeElement);if(e.key==='Escape'){e.preventDefault();e.stopPropagation();F.closeContextMenu(true);}else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();buttons[e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();}else if(e.key==='Tab')F.closeContextMenu();});
};
document.addEventListener('pointerdown',e=>{if(menu&&!menu.contains(e.target))F.closeContextMenu();},true);
document.addEventListener('scroll',e=>{if(menu&&!menu.contains(e.target))F.closeContextMenu();},true);
window.addEventListener('resize',()=>F.closeContextMenu());window.addEventListener('blur',()=>F.closeContextMenu());
})();
