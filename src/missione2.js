/* ===== Missione 2: i libri di nonna Luisa (le consonanti: M come MELA) ===== */
(()=>{
const SHELF={x:330,y:26,w:340,h:292};
const BOOK={x:500,y:212};          /* il libro aperto davanti alla libreria */
const LUISA={x:880,y:420,s:1.5};
const COLS=['#e5533d','#4f8fd8','#5cbf60','#ffc93d','#b46ee0','#ff9a3d','#2f6f8f','#f28cb0'];
const bookSVG=on=>`<svg viewBox="0 0 26 26" aria-hidden="true"><rect x="5" y="4" width="16" height="19" rx="2" fill="${on?'#4f8fd8':'#e4d6b8'}" stroke="#3b2a35" stroke-width="1.6"/><path d="M8 4v19" stroke="#3b2a35" stroke-width="1.4"/><path d="M11 9h7M11 13h7" stroke="${on?'#fff':'#cbbf9f'}" stroke-width="1.6" stroke-linecap="round"/></svg>`;
let S={};

function rounds(){
  const a=shuffle([...'MPLT']),b=shuffle([...shuffle([...'SNRD']),...a.slice(0,2)]);
  return [()=>a.map(l=>({keys:l,col:COLS[Math.floor(Math.random()*COLS.length)]})),
          ()=>b.map(l=>({keys:l,col:COLS[Math.floor(Math.random()*COLS.length)]})),
          ()=>[{keys:'NONNA',col:'#e5533d',word:true}]];
}
const R3=rounds();
const o={
  index:1,who:'luisa',name:'I libri di nonna Luisa',sub:'LE LETTERE',music:'audio/m2.mp3',
  rounds:[()=>R3[0](),()=>R3[1](),()=>R3[2]()],
  reset(){const r=rounds();R3.splice(0,3,...r);S={book:null,shelf:[],hop:0,wave:0};},
  intro:()=>[`CIAO ${N()}!`,'SONO CADUTI TUTTI I MIEI LIBRI!','OGNI LIBRO HA UNA LETTERA.','PREMI LA LETTERA E IL LIBRO TORNA A POSTO.'],
  between:r=>r==1?['ADESSO SCRIVI NONNA!']:[],
  ending:()=>['TUTTI I LIBRI SONO A POSTO!',`GRAZIE ${N()}!`],
  endText:'I libri di nonna Luisa sono tutti a posto!',
  quest:r=>r==2?'SCRIVI LA PAROLA NONNA':'PREMI LA LETTERA DEL LIBRO',
  icon:bookSVG,
  show(p){S.book={p,t:0,phase:'in',no:0};return .8;},
  prompt(p){p.word?sayWord('nonna'):sayWord(NOME[p.keys]+' come '+FIGURE[p.keys]);},
  step(p,i,id){sayKey(id);const kc=keyCenter(id);burst(kc.x,kc.y,10,['#ffd23d','#fff']);},
  good(p){const b=S.book;b.phase='out';b.t=0;S.hop=1;S.wave=1.2;
    const kc=keyCenter(p.keys[p.keys.length-1]);burst(kc.x,kc.y,16,['#ffd23d','#fff',p.col]);
    if(p.word){sayWord('nonna');confetti(BOOK.x,BOOK.y);floatText(BOOK.x,BOOK.y-120,'NONNA!','#ffd23d',46);return 1.8;}
    sayWord(NOME[p.keys]+' come '+FIGURE[p.keys]);
    if(p.err==0&&Math.random()<.4)floatText(BOOK.x,BOOK.y-110,['SÌ!','EVVIVA!','BRAVISSIM'+(SAVE.cur=='piumi'?'A!':'O!')][Math.floor(Math.random()*3)],'#ffd23d');
    return 1.1;},
  bad(){if(S.book)S.book.no=1;},
  help(p){o.prompt(p);},
  update(dt){S.hop=Math.max(0,S.hop-dt*3);S.wave=Math.max(0,S.wave-dt);
    const b=S.book;if(!b)return;b.t+=dt;b.no=Math.max(0,b.no-dt*2);
    if(b.phase=='out'&&b.t>=.8){S.shelf.push({col:b.p.col,l:b.p.word?'♥':b.p.keys});S.book=null;sfx.tic();}},
  draw(c){
    /* il salotto dei nonni */
    c.fillStyle='#f6e3c8';c.fillRect(-EX,-EY,LW+2*EX,330+EY);
    c.fillStyle='#efd3ae';for(let y=20;y<330;y+=46)for(let x=-Math.ceil(EX/46)*46+(y/46%2)*23;x<LW+EX;x+=46){C(c,x,y,4);c.fill();}
    c.fillStyle='#c99a6b';c.fillRect(-EX,330,LW+2*EX,90);c.strokeStyle='#b88a5c';c.lineWidth=2;for(let x=-EX;x<LW+EX;x+=70){c.beginPath();c.moveTo(x,330);c.lineTo(x-30,420);c.stroke();}
    c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(-EX,330);c.lineTo(LW+EX,330);c.stroke();
    /* tappeto */
    E(c,520,385,230,26);fs(c,'#d9534f');E(c,520,385,190,18);c.fillStyle='#f28c6a';c.fill();
    drawShelf(c);
    c.save();c.translate(LUISA.x,LUISA.y);c.scale(LUISA.s,LUISA.s);drawPerson(c,0,0,{kind:'luisa',glasses:true,t:T,wave:S.wave>0});c.restore();
    drawQCat(c,S.hop);
    if(S.book)drawBook(c,S.book);
  }
};
function drawShelf(c){
  const {x,y,w,h}=SHELF;shadowAt(c,x+w/2,y+h+4,w/2,10);
  rr(c,x,y,w,h,6);fs(c,'#9a6239');rr(c,x+10,y+12,w-20,h-24,3);c.fillStyle='#6f4127';c.fill();
  const rh=(h-24)/3;
  for(let r=0;r<3;r++){const by=y+12+(r+1)*rh;
    if(r!=1){let bx=x+16,k=r*5;while(bx<x+w-34){const bw=14+(k*37)%10,bh=50+(k*53)%22;rr(c,bx,by-bh-3,bw,bh,2);fs(c,COLS[k%COLS.length],1.8);
      c.beginPath();c.moveTo(bx+3,by-bh+6);c.lineTo(bx+bw-3,by-bh+6);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=2;c.stroke();bx+=bw+2;k++;}}
    else{/* qui tornano i libri caduti, con la loro lettera sul dorso */
      S.shelf.forEach((b,i)=>{const bx=x+18+i*27,bh=66;rr(c,bx,by-bh-3,25,bh,3);fs(c,b.col,2);
        bigText(c,b.l,bx+12.5,by-bh/2-3,18,'#fff');});}
    rr(c,x+8,by-3,w-16,8,2);fs(c,'#b0743f',2);}
  rr(c,x-6,y-6,w+12,14,4);fs(c,'#b0743f');
}
function drawBook(c,b){
  const p=b.p;let x=BOOK.x,y=BOOK.y,s=1,sx=1;
  if(b.phase=='in'){const t=Math.min(1,b.t/.7),e=1-Math.pow(1-t,3);y=400+(BOOK.y-400)*e;s=.3+.7*e;}
  else{const t=Math.min(1,b.t/.8),slot={x:SHELF.x+18+S.shelf.length*27+12,y:SHELF.y+12+2*(SHELF.h-24)/3-36};
    sx=Math.max(.08,1-t*3);x=BOOK.x+(slot.x-BOOK.x)*t*t;y=BOOK.y+(slot.y-BOOK.y)*t*t-Math.sin(t*Math.PI)*60;s=1-.65*t;}
  const sw=b.no&&!RM?Math.sin(b.no*30)*.08*b.no:0;
  c.save();c.translate(x,y);c.rotate(sw);c.scale(s*sx,s);
  const W=p.word?340:300,H=170;
  rr(c,-W/2-10,-H/2-8,W+20,H+18,12);fs(c,p.col,3);
  rr(c,-W/2,-H/2,W/2,H,6);fs(c,'#fffaf0',2.2);rr(c,0,-H/2,W/2,H,6);fs(c,'#fffaf0',2.2);
  c.beginPath();c.moveTo(0,-H/2+4);c.lineTo(0,H/2-4);c.strokeStyle='#c9bfae';c.lineWidth=2;c.stroke();
  if(p.word){/* NONNA: le lettere da copiare, quelle già scritte si colorano */
    const n=p.keys.length,gap=58;[...p.keys].forEach((l,i)=>{const done=i<p.pos,next=i==p.pos;
      bigText(c,l,(i-(n-1)/2)*gap,0,62,done?'#e5533d':next?'#ffd23d':'#e8e0d0');});}
  else{bigText(c,p.keys,-W/4,4,104,'#e5533d');drawIcon(c,FIGURE[p.keys],W/4,4,1.35);}
  c.restore();
}
MISSIONS.push(makeQuiz(o));
})();
