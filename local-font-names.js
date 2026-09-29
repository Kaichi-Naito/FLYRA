/* Read localized OpenType names in memory only. No font files are saved or sent. */
(() => {
'use strict';
const F=window.Flyra,clean=s=>typeof s==='string'&&s.length>0&&s.length<=300&&!/[\u0000-\u001f\u007f\ufffd]/.test(s);
const utf16=new TextDecoder('utf-16be'),wanted=new Set([1,2,4,6,16,17]);
F.normalizeFontSearch=s=>String(s).normalize('NFKC').toLocaleLowerCase('ja').replace(/[\s\u200b-\u200d-]+/g,'');
F.readLocalFontNames=async face=>{
 const blob=await face.blob();
 const read=async(offset,length)=>{
  if(offset<0||length<0||offset+length>blob.size)throw Error('Invalid font table');
  return new DataView(await blob.slice(offset,offset+length).arrayBuffer());
 };
 async function namesAt(base){
  const head=await read(base,12),signature=head.getUint32(0),count=head.getUint16(4);
  if(![0x00010000,0x4f54544f,0x74727565].includes(signature)||count>256)throw Error('Unsupported font');
  const directory=await read(base+12,count*16);let offset=0,length=0;
  for(let i=0;i<count;i++){const p=i*16;if(directory.getUint32(p)===0x6e616d65){offset=directory.getUint32(p+8);length=directory.getUint32(p+12);break;}}
  if(length<6||length>2*1024*1024)return [];
  const table=await read(offset,length),format=table.getUint16(0),n=table.getUint16(2),storage=table.getUint16(4);
  if(format>1||n>8192||6+n*12>length||storage>length)return [];
  const decode=(start,size,decoder)=>{if(start<storage||start+size>length)return '';return decoder.decode(new Uint8Array(table.buffer,start,size)).trim();};
  const language=id=>{
   if(format!==1||id<0x8000)return '';
   const p=6+n*12;if(p+2>length)return '';
   const index=id-0x8000,tag=p+2+index*4;
   if(index>=table.getUint16(p)||tag+4>storage)return '';
   return decode(storage+table.getUint16(tag+2),table.getUint16(tag),utf16);
  };
  const names=[];
  for(let i=0;i<n;i++){
   const p=6+i*12,platform=table.getUint16(p),encoding=table.getUint16(p+2),lang=table.getUint16(p+4),id=table.getUint16(p+6);
   if(!wanted.has(id))continue;
   let decoder;if(platform===0||platform===3&&[0,1,10].includes(encoding))decoder=utf16;
   else if(platform===1&&encoding===1)decoder=new TextDecoder('shift_jis');else continue;
   const size=table.getUint16(p+8);if(decoder===utf16&&size%2)continue;
   const value=decode(storage+table.getUint16(p+10),size,decoder);
   if(clean(value))names.push({id,value,japanese:platform===3&&(lang&0x3ff)===0x11||platform===1&&lang===11||/^ja(?:-|$)/i.test(language(lang))});
  }
  return names;
 }
 const header=await read(0,12);let names;
 if(header.getUint32(0)===0x74746366){
  const count=header.getUint32(8);if(count>64)throw Error('Unsupported collection');
  const offsets=await read(12,count*4);
  for(let i=0;i<count;i++){
   const candidate=await namesAt(offsets.getUint32(i*4));
   if(candidate.some(n=>n.id===6&&n.value===face.postscriptName)){names=candidate;break;}
  }
 }else names=await namesAt(0);
 names=names||[];
 const japanese=names.filter(n=>n.japanese),full=japanese.find(n=>n.id===4)?.value;
 const family=japanese.find(n=>n.id===16)?.value||japanese.find(n=>n.id===1)?.value;
 const style=japanese.find(n=>n.id===17)?.value||japanese.find(n=>n.id===2)?.value||face.style;
 return {label:full||(family?[family,style].filter(Boolean).join(' '):''),aliases:[...new Set(names.map(n=>n.value))],families:[...new Set(names.filter(n=>n.id===1||n.id===16).map(n=>n.value))],fullNames:[...new Set(names.filter(n=>n.id===4||n.id===6).map(n=>n.value))]};
};
})();
