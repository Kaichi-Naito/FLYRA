/* DOM-only drag feedback; order changes once on drop. */
(() => {
window.Flyra.bindLayerDrag=(list,onMove)=>{
 let active=null,destination=null,frame=0,lastY=0;
 const panel=list.closest('.layers-panel');
 const clearMarks=()=>list.querySelectorAll('.drop-before,.drop-after').forEach(r=>r.classList.remove('drop-before','drop-after'));
 function clean(){cancelAnimationFrame(frame);frame=0;active=null;destination=null;clearMarks();list.querySelectorAll('.layer-dragging').forEach(r=>r.classList.remove('layer-dragging'));}
 function locate(y){clearMarks();const rows=[...list.querySelectorAll('[data-layer-id]')];destination=null;if(!rows.length)return;
 const target=rows.find(r=>y<r.getBoundingClientRect().bottom)||rows.at(-1),r=target.getBoundingClientRect(),before=y<r.top+r.height/2;
 destination={id:target.dataset.layerId,before};if(destination.id!==active)target.classList.add(before?'drop-before':'drop-after');
 }
 function scroll(){if(!active)return;const r=panel.getBoundingClientRect(),speed=lastY<r.top+45?-10:lastY>r.bottom-45?10:0;if(speed){panel.scrollTop+=speed;locate(lastY);}frame=requestAnimationFrame(scroll);}
 list.addEventListener('dragstart',e=>{const row=e.target.closest('[data-layer-id]');if(!row||!row.draggable||e.target.closest('.layer-toggle')){e.preventDefault();return;}active=row.dataset.layerId;row.classList.add('layer-dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('application/x-flyra-layer',active);});
 panel.addEventListener('dragover',e=>{if(!active)return;e.preventDefault();e.dataTransfer.dropEffect='move';lastY=e.clientY;locate(lastY);if(!frame)frame=requestAnimationFrame(scroll);});
 panel.addEventListener('dragleave',e=>{if(!panel.contains(e.relatedTarget)){cancelAnimationFrame(frame);frame=0;destination=null;clearMarks();}});
 panel.addEventListener('drop',e=>{if(!active)return;e.preventDefault();locate(e.clientY);const id=active,to=destination;clean();if(to&&id!==to.id)onMove(id,to.id,to.before);});
 list.addEventListener('dragend',clean);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){clean();e.preventDefault();}});
 window.addEventListener('blur',clean);window.Flyra.cancelLayerDrag=clean;
};
})();
