/* ===== Missione 3: i gomitoli di Emma (le sillabe: MA ME MI MO MU, poi le parole) ===== */
(()=>{
const BALL={x:470,y:235,r:66};
const EMMA={x:860,y:345,s:2.3};
const BASKET={x:735,y:372};
const YARN=['#e5533d','#4f8fd8','#5cbf60','#ffc93d','#b46ee0','#ff9a3d','#f28cb0','#2f9fa0'];
const PAROLE3=[['ME','LA','mela'],['LU','NA','luna'],['SO','LE','sole']];
const yarnSVG=on=>`<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="9" fill="${on?'#f28cb0':'#e4d6b8'}" stroke="#3b2a35" stroke-width="1.6"/><path d="M7 9c4 2 8 2 12 0M6 14c5 2 9 2 14 0M8 19c3 1 7 1 10 0" fill="none" stroke="${on?'#fff':'#cbbf9f'}" stroke-width="1.4"/><path d="M21 17c2 2 2 5 0 6" fill="none" stroke="#3b2a35" stroke-width="1.4"/></svg>`;
let S={};
const col=()=>YARN[Math.floor(Math.random()*YARN.length)];
const sill=(c,v)=>({keys:c+v,parts:[c+v],say:(c+v).toLowerCase(),col:col()});

const o={
  index:2,who:'emma',name:'I gomitoli di Emma',sub:'LE SILLABE',music:'audio/m3.mp3',
  rounds:[
    ()=>shuffle([...'AEIOU']).map(v=>sill('M',v)),
    ()=>shuffle([...'PLTNS']).map(c=>sill(c,'AEIOU'[Math.floor(Math.random()*5)])),
    ()=>shuffle(PAROLE3).map(([a,b,w])=>({keys:a+b,parts:[a,b],say:w,word:true,col:col()}))
  ],
  reset(){S={ball:null,scarf:[],hop:0};},
  intro:()=>[`CIAO ${N()}!`,'FACCIO UNA SCIARPA PER MARGHERITA.','OGNI GOMITOLO HA UNA SILLABA.','SCRIVI LA SILLABA CON DUE TASTI!'],
  between:r=>r==1?['ADESSO LE PAROLE!']:[],
  ending:()=>['LA SCIARPA È PRONTA!',`GRAZIE ${N()}!`],
  endText:'Emma ha finito la sciarpa per Margherita!',
  quest:r=>r==2?'SCRIVI LA PAROLA':'SCRIVI LA SILLABA DEL GOMITOLO',
  icon:yarnSVG,
  show(p){S.ball={p,t:0,phase:'in',no:0,rot:0};return 1;},
  prompt(p){if(p.word)sayList([p.say,...p.parts.map(s=>s.toLowerCase())],900);else sayWord(p.say);},
  step(p,i,id){const kc=keyCenter(id);burst(kc.x,kc.y,10,['#ffd23d','#fff']);
    if(p.word&&i==2)sayWord(p.parts[0].toLowerCase());},
  good(p){const b=S.ball;b.phase='out';b.t=0;S.hop=1;
    const kc=keyCenter(p.keys[p.keys.length-1]);burst(kc.x,kc.y,16,['#ffd23d','#fff',p.col]);
    sayWord(p.say);if(p.err==0&&Math.random()<.4)floatText(BALL.x,BALL.y-120,BRAVI(),'#ffd23d');
    if(p.word){floatText(BALL.x,BALL.y-130,p.keys+'!','#ffd23d',46);return 1.7;}
    return 1.2;},
  bad(){if(S.ball)S.ball.no=1;},
  help(p){o.prompt(p);},
  update(dt){S.hop=Math.max(0,S.hop-dt*3);const b=S.ball;if(!b)return;b.t+=dt;b.no=Math.max(0,b.no-dt*2);
    if(b.phase=='out'&&b.t>=.9){S.scarf.push(b.p.col);S.ball=null;sfx.tic();}},
  draw(c){
    /* la stanza di Emma: carta da parati a righe, poltrona, cesto della lana */
    c.fillStyle='#fbe3e8';c.fillRect(-EX,-EY,LW+2*EX,330+EY);
    c.fillStyle='#f6d2da';for(let x=-Math.ceil(EX/50)*50;x<LW+EX;x+=50)c.fillRect(x,-EY,22,330+EY);
    /* quadro con una margherita */
    rr(c,90,60,120,96,6);fs(c,'#c98b55');rr(c,102,72,96,72,3);c.fillStyle='#bfe3a5';c.fill();daisy(c,150,108,22,T*.2);
    c.fillStyle='#c99a6b';c.fillRect(-EX,330,LW+2*EX,90);c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(-EX,330);c.lineTo(LW+EX,330);c.stroke();
    /* poltrona */
    rr(c,770,200,190,150,40);fs(c,'#6a8ff0');rr(c,760,280,40,90,18);fs(c,'#5a7fd8');rr(c,930,280,40,90,18);fs(c,'#5a7fd8');rr(c,790,300,150,50,14);fs(c,'#7f9ff4');
    drawCat(c,EMMA.x,EMMA.y,CATS.emma,{sit:true,f:-1,t:T,scale:EMMA.s});
    /* ferri da maglia */
    c.strokeStyle=OL;c.lineWidth=5;c.beginPath();c.moveTo(800,270);c.lineTo(840,300);c.moveTo(842,262);c.lineTo(812,304);c.stroke();
    c.strokeStyle='#d9d9e0';c.lineWidth=2.5;c.stroke();
    drawScarf(c);
    cesto(c,BASKET.x,BASKET.y,90,false);[['#5cbf60',-18],['#ffc93d',4],['#e5533d',20]].forEach(([k,d])=>gomitolo(c,BASKET.x+d,BASKET.y-12,15,k,d));cesto(c,BASKET.x,BASKET.y,90,true);
    drawQCat(c,S.hop);
    if(S.ball)drawBall(c,S.ball);
  }
};
/* la sciarpa scende dai ferri e corre sul pavimento: una riga per ogni sillaba */
function drawScarf(c){
  const n=S.scarf.length;if(!n)return;
  S.scarf.forEach((k,i)=>{const x=812-i*24,y=i==0?318:352;
    if(i==0){rr(c,800,300,24,44,4);fs(c,k,2.4);}
    else{rr(c,x,340,24,26,4);fs(c,k,2.4);c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=2;c.beginPath();c.moveTo(x+6,346);c.lineTo(x+6,360);c.moveTo(x+14,346);c.lineTo(x+14,360);c.stroke();}});
  /* le frange alla fine */
  if(n>1){const x=812-(n-1)*24;c.strokeStyle=S.scarf[n-1];c.lineWidth=3;for(let k=0;k<4;k++){c.beginPath();c.moveTo(x,344+k*6);c.lineTo(x-10,346+k*6);c.stroke();}}
}
function drawBall(c,b){
  const p=b.p;let x=BALL.x,y=BALL.y,s=1,rot=0;
  if(b.phase=='in'){const t=Math.min(1,b.t/.9),e=1-Math.pow(1-t,3);x=-80+(BALL.x+80)*e;rot=(e-1)*6;y=BALL.y-Math.abs(Math.sin(t*Math.PI*2))*30*(1-t);}
  else{const t=Math.min(1,b.t/.9);x=BALL.x+(BASKET.x-BALL.x)*t;y=BALL.y+(BASKET.y-30-BALL.y)*t-Math.sin(t*Math.PI)*90;s=1-.75*t;rot=t*6;}
  const sw=b.no&&!RM?Math.sin(b.no*30)*12*b.no:0;
  if(p.word)drawIcon(c,p.say,x,y-BALL.r-62,1.1);
  /* il filo che resta indietro */
  c.beginPath();c.moveTo(x-BALL.r*s*.6,y+BALL.r*s*.7);c.quadraticCurveTo(x-120,y+90,x-200,y+100);c.strokeStyle=p.col;c.lineWidth=3;c.stroke();
  gomitolo(c,x+sw,y,BALL.r*s,p.col,rot);
  if(b.phase=='out')return;
  /* la sillaba: le lettere già scritte diventano gialle; nelle parole un puntino divide le sillabe */
  /* il cartellino: lettere già scritte rosse, la prossima gialla, le altre grigie (come i libri di nonna Luisa) */
  const txt=p.word?p.parts.join('·'):p.keys,size=p.word?50:72,w=size*.66,tw=txt.length*w+30;let k=0;
  rr(c,x+sw-tw/2,y-size*.62,tw,size*1.25,16);fs(c,'#fffaf0',3);
  [...txt].forEach((ch,i)=>{const cx=x+sw+(i-(txt.length-1)/2)*w;
    if(ch=='·'){bigText(c,'·',cx,y+4,size,'#b9aea0');return;}
    bigText(c,ch,cx,y+4,size,k<p.pos?'#e5533d':k==p.pos?'#ffd23d':'#d9cfbf');k++;});
}
MISSIONS.push(makeQuiz(o));
})();
