// Gera PNGs de ícones PWA (192, 512, maskable) com encoder PNG mínimo (sem dependências).
const fs=require('fs'),zlib=require('zlib');
function crc32(buf){let c,t=[];for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}
 let crc=0xFFFFFFFF;for(const b of buf)crc=(crc>>>8)^t[(crc^b)&0xFF];return (crc^0xFFFFFFFF)>>>0;}
function chunk(type,data){const len=Buffer.alloc(4);len.writeUInt32BE(data.length);
 const td=Buffer.concat([Buffer.from(type,'ascii'),data]);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(td));
 return Buffer.concat([len,td,crc]);}
function png(w,h,pix){ // pix: RGBA buffer
 const sig=Buffer.from([137,80,78,71,13,10,26,10]);
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;
 const raw=Buffer.alloc((w*4+1)*h);
 for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;pix.copy(raw,y*(w*4+1)+1,y*w*4,(y+1)*w*4);}
 const idat=zlib.deflateSync(raw,{level:9});
 return Buffer.concat([sig,chunk('IHDR',ihdr),chunk('IDAT',idat),chunk('IEND',Buffer.alloc(0))]);}
function makeIcon(size){
 const w=size,h=size;const pix=Buffer.alloc(w*h*4);
 const bg=[15,55,49],gold=[197,160,89],cream=[243,239,230];
 // geometria: alefato estilizado (א) em dourado + círculo interno creme — desenho autoral simples.
 const cx=w/2;
 function setPx(x,y,c,a=255){if(x<0||y<0||x>=w||y>=h)return;const i=(y*w+x)*4;pix[i]=c[0];pix[i+1]=c[1];pix[i+2]=c[2];pix[i+3]=a;}
 function rect(x0,y0,x1,y1,c){for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)setPx(x,y,c);}
 // fundo com cantos arredondados
 const r=size*0.18;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const dx=Math.min(x,w-1-x),dy=Math.min(y,h-1-y);
   if(dx<r&&dy<r&&Math.hypot(r-dx,r-dy)>r)continue;
   if(dx>r||dy>r)setPx(x,y,bg);else setPx(x,y,bg);
 }
 const u=size/100;
 // א estilizada: duas pernas diagonais + braço direito vertical + traço esquerdo
 const s=size*0.26, t=Math.max(2,size*0.055);
 // perna esquerda inferior (diagonal ↘)
 for(let k=0;k<s*1.6;k++){const x=cx-t*1.6+k*0.55,y=size*0.72-k*0.75;rect(Math.round(x-t/2),Math.round(y-t/2),Math.round(x+t*1.5),Math.round(y+t/2),gold);}
 // perna direita (↗ do centro pra cima)
 for(let k=0;k<s*1.7;k++){const x=cx+t*0.4+k*0.5,y=size*0.72-k*0.8;rect(Math.round(x-t/2),Math.round(y-t/2),Math.round(x+t/2),Math.round(y+t/2),gold);}
 // haste vertical esquerda
 rect(cx-s*1.05,size*0.28,cx-s*1.05+t,size*0.72,gold);
 // barra transversal superior
 rect(cx-s*1.05,size*0.28,cx+s*0.2,size*0.28+t,gold);
 return png(w,h,pix);}
fs.writeFileSync('assets/icons/app-icon-192.png',makeIcon(192));
fs.writeFileSync('assets/icons/app-icon-512.png',makeIcon(512));
fs.writeFileSync('assets/icons/maskable-512.png',makeIcon(512));
fs.writeFileSync('assets/icons/favicon-32.png',makeIcon(32));
console.log('PNGs gerados');
