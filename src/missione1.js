/* ===== Missione 1: il computer di zio Simone (le vocali e la parola MIAO) ===== */
(()=>{
const MON={x:330,y:34,w:340,h:250};
const HOME={x:500,y:160};          /* dove i robottini entrano ed escono dallo schermo */
const DESK=345;                    /* piano della scrivania */
const CATP={x:165,y:DESK};
const SIMP={x:880,y:425,s:1.6};
const ROBOT_COL=['#cfd3e0','#8fc8ff','#ffd36a','#a8e08f','#f9b4c8'];
const HINT=[0,2.5,5];              /* dopo quanti secondi brilla il tasto, per ogni zampa */
const robotSVG=on=>`<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M13 6V3" stroke="#3b2a35" stroke-width="1.6"/><circle cx="13" cy="2.6" r="2" fill="${on?'#e5533d':'#cbbf9f'}"/><rect x="7" y="6" width="12" height="8" rx="2.5" fill="${on?'#8fc8ff':'#e4d6b8'}" stroke="#3b2a35" stroke-width="1.5"/><circle cx="11" cy="10" r="1.2" fill="${on?'#2b2a33':'#cbbf9f'}"/><circle cx="15" cy="10" r="1.2" fill="${on?'#2b2a33':'#cbbf9f'}"/><rect x="6" y="14.5" width="14" height="8" rx="2.5" fill="${on?'#8fc8ff':'#e4d6b8'}" stroke="#3b2a35" stroke-width="1.5"/><circle cx="9" cy="24" r="1.8" fill="#3b2a35"/><circle cx="17" cy="24" r="1.8" fill="#3b2a35"/></svg>`;
let S,timers=[];
const after=(sec,fn)=>timers.push({t:sec,fn});

/* tre ondate: le vocali, ancora le vocali mescolate, poi quattro robottini che scrivono MIAO */
function vocali6(){const v=[...'AEIOU'],out=[];while(out.length<6){const k=v[Math.floor(Math.random()*5)];if(k!=out[out.length-1])out.push(k);}return out;}
const ROUNDS=[()=>({letters:shuffle([...'AEIOU'])}),()=>({letters:vocali6()}),()=>({letters:[...'MIAO'],word:true})];

function startRound(i){
  S.round=i;S.rErr=0;const r=ROUNDS[i]();S.word=r.word?'':null;S.total=r.letters.length;S.doneN=0;
  S.queue=r.letters.map((l,k)=>({l,k,col:ROBOT_COL[k%ROBOT_COL.length],phase:'idle',t:0,x:HOME.x,y:HOME.y,s:.2,err:0,no:0}));
  if(r.word){const n=S.queue.length;S.queue.forEach((m,k)=>{m.tx=500+(k-(n-1)/2)*130;m.ty=DESK;m.ts=1.45;m.delay=k*.35;m.phase='out';m.t=-m.delay;});}
  else nextRobot();
  hud();
}
function nextRobot(){const m=S.queue.find(m=>m.phase=='idle');if(!m)return;m.tx=500;m.ty=DESK;m.ts=1.9;m.phase='out';m.t=0;}
const current=()=>S.queue&&S.queue.find(m=>m.phase=='wait'||m.phase=='out');
function hud(){
  setQuest(S.round==2?'SCRIVI LA PAROLA DEI ROBOTTINI':'PREMI LA LETTERA DEL ROBOTTINO',ZAMPE[S.zampa]);
  setProg(S.queue?S.queue.map((m,i)=>robotSVG(m.phase=='home'||m.phase=='gone')).join(''):'');
}

function key(id){
  const m=current();if(!m||m.phase!='wait'||S.busy)return;
  if(id==m.l){
    segna(m.l,true);sayKey(m.l);sfx.ok();sfx.zap();
    m.phase='home';m.t=0;m.fx=m.x;m.fy=m.y;m.fs=m.s;S.hop=1;S.wave=1.2;
    const kc=keyCenter(id);burst(kc.x,kc.y,18,['#ffd23d','#fff',DITA[DITO_DI[id]]]);
    if(S.word!=null)S.word+=m.l;else S.flash={txt:m.l,t:1.4};
    if(m.err==0&&Math.random()<.4)floatText(m.x,m.y-200,['SÌ!','EVVIVA!','BRAVISSIM'+(SAVE.cur=='piumi'?'A!':'O!')][Math.floor(Math.random()*3)],'#ffd23d');
    hud();
  }else{
    if(KEYS[id])KEYS[id].shake=1;sfx.boop();m.err++;m.no=1;S.rErr++;S.err++;segna(m.l,false);
    if(m.err==2){floatText(CATP.x+10,CATP.y-110,'MIAO?','#fff',30);after(.35,()=>{if(m.phase=='wait')sayKey(m.l);});}
  }
}

function endRound(){
  const r=S.round,b=`${BRAV()} ${N()}!`;
  if(r==0){
    const pages=[b];
    if(S.rErr<=1&&S.zampa<2){S.zampa++;pages.push('ADESSO IL TASTO NON BRILLA SUBITO!');}
    else if(S.rErr>=5&&S.zampa>0){S.zampa--;pages.push('CERCA IL TASTO CHE BRILLA!');}
    openDialog('simone',pages,()=>startRound(1));
  }else if(r==1){
    if(S.rErr>=5&&S.zampa>0)S.zampa--;
    openDialog('simone',[b,'GUARDA! INSIEME FANNO UNA PAROLA!'],()=>startRound(2));
  }else{
    S.flash={txt:'MIAO!',t:3};sfx.meow();after(.3,sfx.meow);floatText(CATP.x+10,CATP.y-120,'MIAO!','#ffd23d',40);
    after(1.3,()=>openDialog('simone',['IL COMPUTER HA DETTO MIAO!','I MIEI ROBOTTINI!',`GRAZIE ${N()}!`],()=>{
      sfx.win();confetti(500,200);S.finished=true;
      const stelle=S.err<=2?3:S.err<=6?2:1;
      SAVE.stelle[0]=Math.max(SAVE.stelle[0]||0,stelle);SAVE.zampa[0]=S.zampa;save();
      after(1.6,()=>showEnd(stelle,'I robottini sono tornati nel computer di zio Simone!'));
    }));
  }
}

function update(dt){
  const ts=timers;timers=[];ts.forEach(t=>{t.t-=dt;if(t.t<=0)t.fn();else timers.push(t);});
  S.hop=Math.max(0,S.hop-dt*3);S.wave=Math.max(0,S.wave-dt);
  if(S.flash){S.flash.t-=dt;if(S.flash.t<=0)S.flash=null;}
  if(!S.queue)return;
  S.queue.forEach(m=>{
    m.no=Math.max(0,m.no-dt*2);
    if(m.phase=='out'){m.t+=dt/.9;if(m.t<0)return;const t=Math.min(1,m.t),e=1-Math.pow(1-t,3);
      m.x=HOME.x+(m.tx-HOME.x)*e;m.y=HOME.y+(m.ty-HOME.y)*e-Math.sin(t*Math.PI)*90;m.s=.2+(m.ts-.2)*e;
      if(t>=1){m.phase='wait';m.wt=0;if(m===current()||S.word==null)after(.25,()=>{if(m.phase=='wait'&&m===current())sayKey(m.l);});}}
    else if(m.phase=='wait')m.wt+=dt;
    else if(m.phase=='home'){m.t+=dt/.7;const t=Math.min(1,m.t),e=t*t;
      m.x=m.fx+(HOME.x-m.fx)*e;m.y=m.fy+(HOME.y-m.fy)*e-Math.sin(t*Math.PI)*110;m.s=m.fs+(.15-m.fs)*e;
      if(t>=1){m.phase='gone';S.doneN++;burst(HOME.x,HOME.y,14,['#5cff7a','#6ab8ff','#ffc93d']);
        if(S.doneN>=S.total){S.queue=null;setProg('');after(.5,endRound);}
        else if(S.word==null)after(.3,nextRobot);
        else{const n=current();if(n&&n.phase=='wait')after(.2,()=>{if(n.phase=='wait'&&n===current())sayKey(n.l);});}}}
  });
}

/* ---------- disegno ---------- */
function drawRoom(c){
  c.fillStyle='#dfe9f2';c.fillRect(-EX,-EY,LW+2*EX,DESK+EY);
  c.fillStyle='#d2deea';for(let x=-Math.ceil(EX/36)*36;x<LW+EX;x+=36)c.fillRect(x,-EY,12,DESK+EY);
  /* finestra con le stelle, come nello studio di Maci e Piumi */
  const x=40,y=40,w=170,h=120;rr(c,x,y,w,h,6);fs(c,'#fff');c.save();rr(c,x+8,y+8,w-16,h-16,3);c.clip();c.fillStyle='#1f2a5a';c.fillRect(x,y,w,h);
  [[62,60],[110,80],[160,56],[90,128],[176,120],[140,140]].forEach(([a,b],i)=>{const tw=RM?1:.6+.4*Math.sin(T*3+i);C(c,a,b,1.8*tw+.6);c.fillStyle='#fff7b0';c.fill();});
  C(c,170,82,14);c.fillStyle='#fff3c4';c.fill();C(c,163,77,12);c.fillStyle='#1f2a5a';c.fill();
  c.restore();c.strokeStyle='#fff';c.lineWidth=6;c.beginPath();c.moveTo(x+w/2,y+6);c.lineTo(x+w/2,y+h-6);c.stroke();rr(c,x,y,w,h,6);c.lineWidth=3;c.strokeStyle=OL;c.stroke();
  /* armadio dei server con le lucine */
  const rx=730,ry=60;rr(c,rx,ry,60,DESK-ry,6);fs(c,'#2b2a33');
  for(let i=0;i<8;i++){const yy=ry+10+i*34;rr(c,rx+6,yy,48,26,3);fs(c,'#3d3c48',1.6);
    for(let j=0;j<3;j++){const on=RM?(i+j)%2:Math.sin(T*(3+i)+j*2.1+i)>0;C(c,rx+15+j*10,yy+13,3);c.fillStyle=on?['#5cff7a','#ffc93d','#6ab8ff'][j]:'#4a4954';c.fill();}}
}
function drawDesk(c){rr(c,-EX-10,DESK-12,LW+2*EX+20,26,6);fs(c,'#e9edf2');c.fillStyle='#c4ccd6';c.fillRect(-EX,DESK+14,LW+2*EX,420-DESK-14);
  c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(-EX,DESK+14);c.lineTo(LW+EX,DESK+14);c.stroke();
  /* tazza di zio Simone */
  rr(c,640,DESK-48,30,36,6);fs(c,'#fff',2.5);c.fillStyle='#e5533d';c.fillRect(640,DESK-38,30,5);c.beginPath();c.arc(672,DESK-30,8,-1.3,1.3);c.lineWidth=4;c.strokeStyle=OL;c.stroke();}
function drawMonitor(c){
  const {x,y,w,h}=MON;
  rr(c,x+w/2-20,y+h-4,40,DESK-12-(y+h-4),4);fs(c,'#5a6270');
  rr(c,x,y,w,h,16);fs(c,'#2b2a33',3.5);
  c.save();rr(c,x+16,y+16,w-32,h-32,8);c.clip();c.fillStyle='#14202e';c.fillRect(x,y,w,h);
  const showWord=S.word!=null&&S.queue,txt=S.flash?S.flash.txt:showWord?S.word+'_'.repeat(Math.max(0,S.total-S.word.length)):null;
  if(txt){const sz=txt.length>2?72:120,pop=S.flash&&!RM?1+.1*Math.sin(S.flash.t*12):1;
    c.save();c.translate(x+w/2,showWord&&!S.flash?y+72:y+h/2+6);c.scale(pop,pop);bigText(c,txt,0,0,sz,'#ffd23d');c.restore();}
  else{const cols=['#7fe08a','#ffc93d','#6ab8ff','#f28cb0','#fff'];
    for(let i=0;i<11;i++){const ly=y+30+i*17,off=(i*29)%60,len=40+((i*53)%120);c.fillStyle=cols[i%cols.length];c.globalAlpha=.75;c.fillRect(x+30+off,ly,len,7);}
    c.globalAlpha=1;if(!RM&&(T*2|0)%2){c.fillStyle='#fff';c.fillRect(x+30,y+h-40,14,10);}}
  c.restore();
  C(c,x+w-26,y+h-10,4);c.fillStyle='#5cff7a';c.fill();
}
function drawRobot(c,m){
  if(m.phase=='idle'||m.phase=='gone'||m.t<0)return;
  c.save();c.translate(m.x,m.y);c.scale(m.s,m.s);
  if(m.phase=='home'&&!RM)c.rotate(m.t*TAU);
  robot(c,{x:0,y:0,k:m.k,col:m.col,run:m.phase!='wait'});
  if(m.phase!='home'){
    const cur=m===current()&&m.phase=='wait',sw=m.no&&!RM?Math.sin(m.no*30)*.25*m.no:0;
    c.save();c.translate(0,-56);c.rotate(sw);
    c.beginPath();c.moveTo(0,0);c.lineTo(0,-16);c.strokeStyle=OL;c.lineWidth=3;c.stroke();
    rr(c,-30,-76,60,60,12);fs(c,cur?'#fff':'#f3ece2',3);
    bigText(c,m.l,0,-45,46,cur?'#e5533d':'#b9aea0');
    c.restore();
    if(cur&&S.word!=null&&!RM){const b=Math.sin(T*6)*4;c.beginPath();c.moveTo(-10,-150+b);c.lineTo(10,-150+b);c.lineTo(0,-138+b);c.closePath();fs(c,'#ffd23d',2.5);}
  }
  c.restore();
}
function draw(c){
  drawRoom(c);
  /* zio Simone sta dietro la scrivania: si vedono testa e spalle */
  c.save();c.translate(SIMP.x,SIMP.y);c.scale(SIMP.s,SIMP.s);drawPerson(c,0,0,{kind:'simone',t:T,wave:S.wave>0,noShadow:true});c.restore();
  drawDesk(c);drawMonitor(c);
  drawCat(c,CATP.x,CATP.y-Math.sin(S.hop*Math.PI)*28,CATS[SAVE.cur],{sit:S.hop<.05,f:1,t:T,scale:1.7,moving:S.hop>0});
  if(S.queue)S.queue.forEach(m=>drawRobot(c,m));
}
function kbOpts(){
  const m=S.queue&&current();if(!m||m.phase!='wait')return {};
  const delay=HINT[S.zampa],glow=m.err>0?1:Math.max(0,Math.min(1,(m.wt-delay)/.4));
  return {target:m.l,glow};
}

MISSIONS.push({
  name:'Il computer di zio Simone',sub:'A E I O U',who:'simone',ready:true,music:'audio/m1.mp3',
  start(){
    timers=[];S={zampa:SAVE.zampa[0]||0,err:0,rErr:0,hop:0,wave:0,flash:null,queue:null,word:null,round:-1,finished:false};
    hud();setProg('');
    openDialog('simone',[`CIAO ${N()}!`,'I MIEI ROBOTTINI SONO SCAPPATI!','SONO USCITI DAL COMPUTER.','OGNI ROBOTTINO HA UNA LETTERA.','PREMI LA STESSA LETTERA SULLA TASTIERA!','COSÌ IL ROBOTTINO TORNA A CASA.'],()=>startRound(0));
  },
  update,draw,key,kbOpts
});
})();
