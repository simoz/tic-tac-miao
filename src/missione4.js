/* ===== Missione 4: l'orto di zio Giulio (contare fino a 9) ===== */
(()=>{
const GIULIO={x:885,y:425,s:1.5};
const BASKET={x:750,y:380};
const carrotSVG=on=>`<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M9 9l11 2-9 12z" fill="${on?'#ff8a2a':'#e4d6b8'}" stroke="#3b2a35" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 9L6 3M11 8l1-6M12 9l5-5" stroke="${on?'#3f9a48':'#cbbf9f'}" stroke-width="1.8" stroke-linecap="round"/></svg>`;
let S={};
/* dove spuntano gli ortaggi: una fila fino a 5, due file oltre */
function spots(n){const rows=n<=5?[n]:[Math.ceil(n/2),Math.floor(n/2)],out=[];
  rows.forEach((m,r)=>{for(let i=0;i<m;i++)out.push({x:480+(i-(m-1)/2)*92,y:rows.length==1?285:248+r*72});});return out;}
function pick(from,n){return shuffle(from).slice(0,n);}
const prova=(n,veg)=>({n,keys:String(n),veg});

function pomodoro(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);C(c,0,0,16);fs(c,'#e5533d',2.4);E(c,-6,-5,4,3,-.5);c.fillStyle='rgba(255,255,255,.5)';c.fill();
  c.fillStyle='#3f9a48';for(let i=0;i<5;i++){c.save();c.rotate(i*TAU/5);E(c,0,-14,3,7);c.fill();c.restore();}c.restore();}
function plant(c,v){
  const pop=Math.min(1,v.t*5),s=(RM?1:pop*(1+.2*Math.max(0,1-v.t*4)));
  if(s<=0)return;
  const hl=v.hl>0,wig=(v.no&&!RM?Math.sin(v.no*30)*.2*v.no:0)+(hl&&!RM?Math.sin(v.hl*20)*.1:0);
  c.save();c.translate(v.x,v.y);c.rotate(wig);c.scale(s*1.6,s*1.6);
  if(hl){c.save();c.shadowColor='#ffd23d';c.shadowBlur=24;C(c,0,-10,30);c.fillStyle='rgba(255,230,120,.7)';c.fill();c.restore();}
  if(v.veg=='carota'){E(c,0,4,22,7);c.fillStyle='#6f4127';c.fill();carrotTop(c,0,0,true);}
  else{rr(c,-2,-40,4,42,2);c.fillStyle='#3f9a48';c.fill();E(c,-10,-26,9,4,-.4);E(c,10,-34,9,4,.4);c.fillStyle='#4caf50';c.fill();pomodoro(c,0,-10,1.1);}
  c.restore();
  if(v.num)bigText(c,String(v.num),v.x,v.y-84,38,'#fff');
}
const o={
  index:3,who:'giulio',name:"L'orto di zio Giulio",sub:'CONTARE',music:'audio/m4.mp3',
  rounds:[
    ()=>shuffle([1,2,3,4,5]).map(n=>prova(n,'carota')),
    ()=>pick([3,4,5,6,7,8,9],5).map(n=>prova(n,'carota')),
    ()=>pick([4,5,6,7,8,9],4).map(n=>prova(n,'pomodoro'))
  ],
  reset(){S={veg:[],flying:[],basket:[],hop:0,wave:0,first:true};},
  intro:()=>[`CIAO ${N()}!`,'RACCOGLIAMO LE CAROTE!','CONTA LE CAROTE.','PREMI IL NUMERO GIUSTO!'],
  between:r=>r==1?['ADESSO I POMODORI!']:[],
  ending:()=>['CHE BEL CESTO!',`GRAZIE ${N()}!`],
  endText:'Il cesto di zio Giulio è pieno di carote e pomodori!',
  quest:r=>r==2?'QUANTI POMODORI? PREMI IL NUMERO':'QUANTE CAROTE? PREMI IL NUMERO',
  icon:carrotSVG,
  show(p){S.veg=spots(p.n).map((s,i)=>({...s,veg:p.veg,t:-i*.14,hl:0,no:0,num:0}));return .5+p.n*.14;},
  prompt(p){say(p.veg=='carota'?'QUANTE CAROTE?':'QUANTI POMODORI?','giulio');},
  step(){},
  /* giusto: si contano a voce mentre saltano nel cesto */
  good(p){S.hop=1;S.wave=1.5;const kc=keyCenter(p.keys);burst(kc.x,kc.y,16,['#ffd23d','#fff','#ff8a2a']);
    S.veg.forEach((v,i)=>o.Q.after(.35+i*.6,()=>{v.num=i+1;sayWord(NOME[i+1]);
      o.Q.after(.3,()=>{S.flying.push({x:v.x,y:v.y-10,veg:v.veg,t:0,fx:v.x,fy:v.y-10});v.gone=true;});}));
    o.Q.after(.35+p.n*.6+.3,()=>{floatText(480,150,String(p.n)+'!','#ffd23d',70);if(p.err==0&&Math.random()<.5)floatText(480,90,BRAVI(),'#fff');});
    return .35+p.n*.6+1.2;},
  bad(p){S.veg.forEach(v=>v.no=1);},
  /* dopo due errori zio Giulio li conta insieme, uno alla volta (senza raccoglierli) */
  help(p){S.veg.forEach((v,i)=>o.Q.after(i*.7,()=>{v.hl=.6;sayWord(NOME[i+1]);}));},
  update(dt){S.hop=Math.max(0,S.hop-dt*3);S.wave=Math.max(0,S.wave-dt);
    S.veg.forEach(v=>{v.t+=dt;v.hl=Math.max(0,v.hl-dt);v.no=Math.max(0,v.no-dt*2);});
    S.flying.forEach(f=>{f.t+=dt/.55;const t=Math.min(1,f.t);f.x=f.fx+(BASKET.x-f.fx)*t;f.y=f.fy+(BASKET.y-20-f.fy)*t-Math.sin(t*Math.PI)*120;});
    S.flying.forEach(f=>{if(f.t>=1)S.basket.push(f.veg);});S.flying=S.flying.filter(f=>f.t<1);
    S.veg=S.veg.filter(v=>!v.gone);},
  draw(c){
    /* cielo, colline, orto con la staccionata */
    c.fillStyle='#bfe6ff';c.fillRect(-EX,-EY,LW+2*EX,230+EY);
    drawIcon(c,'sole',140,80,1.1);
    [[150,230,260,'#8fd36a'],[560,230,330,'#7cc65a'],[960,230,260,'#8fd36a']].forEach(([x,y,r,k])=>{E(c,x,y,r,70);c.fillStyle=k;c.fill();});
    c.fillStyle='#8a5a36';c.fillRect(-EX,210,LW+2*EX,130);
    c.strokeStyle='#74482c';c.lineWidth=3;for(let y=232;y<336;y+=26){c.beginPath();c.moveTo(-EX,y);c.lineTo(LW+EX,y);c.stroke();}
    c.fillStyle='#6aa94b';c.fillRect(-EX,330,LW+2*EX,90);c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(-EX,330);c.lineTo(LW+EX,330);c.stroke();
    c.beginPath();c.moveTo(-EX,208);c.lineTo(LW+EX,208);c.strokeStyle=OL;c.lineWidth=8;c.stroke();c.strokeStyle='#e8d2a8';c.lineWidth=4;c.stroke();
    for(let px=-Math.ceil(EX/40)*40;px<=LW+EX;px+=40){c.beginPath();c.moveTo(px-5,214);c.lineTo(px-5,190);c.lineTo(px,184);c.lineTo(px+5,190);c.lineTo(px+5,214);c.closePath();fs(c,'#f7ead0',2.2);}
    c.save();c.translate(GIULIO.x,GIULIO.y);c.scale(GIULIO.s,GIULIO.s);drawPerson(c,0,0,{kind:'giulio',t:T,wave:S.wave>0});c.restore();
    cesto(c,BASKET.x,BASKET.y,110,false);
    S.basket.slice(-12).forEach((v,i)=>{const a=(i%6)/5-.5,row=Math.floor(i/6);v=='carota'?carrot(c,BASKET.x+a*70,BASKET.y-30-row*8,a*.8):pomodoro(c,BASKET.x+a*70,BASKET.y-24-row*8,.7);});
    cesto(c,BASKET.x,BASKET.y,110,true);
    drawQCat(c,S.hop);
    S.veg.forEach(v=>plant(c,v));
    S.flying.forEach(f=>f.veg=='carota'?(c.save(),c.translate(f.x,f.y),c.scale(2,2),carrot(c,0,0,f.t*8),c.restore()):pomodoro(c,f.x,f.y,1.2));
  }
};
MISSIONS.push(makeQuiz(o));
})();
