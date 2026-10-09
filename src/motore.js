/* ===== Motore: schermo, audio, voci, dialoghi, effetti, salvataggi ===== */
const cv=document.getElementById('game'),ctx=cv.getContext('2d');
const OL='#3b2a35',TAU=Math.PI*2;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* il gioco è disegnato su un foglio di 1000×760: in alto la scena, in basso la tastiera */
const LW=1000,LH=760;
let VW,VH,DPR,Z,OX,OY,EX,EY,T=0;   /* EX, EY: quanto spazio avanza ai lati e sopra, in unità logiche */
function resize(){DPR=Math.min(2,devicePixelRatio||1);VW=innerWidth;VH=innerHeight;cv.width=VW*DPR;cv.height=VH*DPR;
  Z=Math.min(VW/LW,VH/LH);OX=(VW-LW*Z)/2;OY=(VH-LH*Z)/2;EX=OX/Z;EY=OY/Z;
  document.documentElement.style.setProperty('--gy',(OY+250*Z)+'px');}
addEventListener('resize',resize);resize();
const toLogic=(cx,cy)=>({x:(cx-OX)/Z,y:(cy-OY)/Z});

/* ---------- salvataggio ---------- */
const SAVE={cur:'maci',stelle:{},zampa:{},lettere:{}};
try{Object.assign(SAVE,JSON.parse(localStorage.getItem('ticTacMiao')||'{}'));}catch(e){}
function save(){try{localStorage.setItem('ticTacMiao',JSON.stringify(SAVE));}catch(e){}}
/* per la cesta dei tesori: quante volte ogni lettera è stata giusta o sbagliata */
function segna(k,ok){const s=SAVE.lettere[k]||(SAVE.lettere[k]={ok:0,no:0});ok?s.ok++:s.no++;save();}

/* ---------- audio ---------- */
let AC=null;
function unlockAudio(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC&&AC.state=='suspended')AC.resume();}
function tone(f,d,delay,type,vol){if(!AC)return;try{const o=AC.createOscillator(),g=AC.createGain();o.type=type||'triangle';o.frequency.value=f;const t0=AC.currentTime+(delay||0);g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol||.18,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g).connect(AC.destination);o.start(t0);o.stop(t0+d+.05);}catch(e){}}
/* il motivo "tic-tac-miao": due tic e un miao che sale, ritorna in tutto il gioco */
const sfx={
  tic:()=>tone(1500,.04,0,'square',.06),
  ok:()=>{tone(660,.12);tone(880,.12,.07);tone(1320,.2,.14);},
  boop:()=>tone(240,.14,0,'sine',.14),
  meow:()=>{tone(700,.1,0,'sine');tone(520,.2,.08,'sine');},
  motivo:()=>{tone(1320,.05,0,'square',.08);tone(990,.05,.16,'square',.08);tone(660,.12,.34,'sine');tone(880,.25,.42,'sine');},
  win:()=>[523,659,784,1046,1318].forEach((f,i)=>tone(f,.3,i*.11)),
  zap:()=>{for(let i=0;i<6;i++)tone(500+i*160,.07,i*.04,'square',.07);}
};
const music=new Audio();music.loop=true;music.preload='auto';
const VOL=.3;music.volume=VOL;
let musicOn=true;try{musicOn=localStorage.getItem('ticTacMiaoMusica')!=='no';}catch(e){}
function playMusic(src){if(src&&!music.src.endsWith(src)){music.src=src;}if(musicOn)music.play().catch(()=>{});}
function setMusic(on){musicOn=on;try{localStorage.setItem('ticTacMiaoMusica',on?'si':'no');}catch(e){}
  const b=document.getElementById('bMus');b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);
  if(on)music.play().catch(()=>{});else music.pause();}

/* ---------- voci ---------- */
let voices=[],chosen=null;
function voiceScore(v){const n=v.name.toLowerCase();let s=0;
  if(/natural|neural|online/.test(n))s+=50;if(/premium/.test(n))s+=45;if(/enhanced|migliorat/.test(n))s+=35;if(/google/.test(n))s+=30;
  if(/alice|federica|elsa|isabella|paola|emma|silvia|giulia/.test(n))s+=8;
  if(/compact|espeak/.test(n))s-=40;if(v.localService===false)s+=5;return s;}
function loadVoices(){try{voices=speechSynthesis.getVoices().filter(v=>/^it/i.test(v.lang)).sort((a,b)=>voiceScore(b)-voiceScore(a));}catch(e){voices=[];}chosen=voices[0]||null;}
try{loadVoices();speechSynthesis.onvoiceschanged=loadVoices;}catch(e){}
const VOX={emma:{pitch:.95,rate:.82},girl:{pitch:1.3,rate:.95},simone:{pitch:.9,rate:.92},lettere:{pitch:1.1,rate:.8},cat:{pitch:1.15,rate:.9}};
/* Frasi registrate: audio/voce/<prefisso><numero>.mp3 nell'ordine della lista (le prime 11 di zio Simone vengono da Maci e Piumi) */
const PREFIX={simone:'o'};
const LINES={
  simone:['CIAO MACI!','VAI DALLA ZIA SILVIA.','I MIEI ROBOTTINI SONO SCAPPATI!','MI AIUTI A PRENDERLI?','CORRI, MACI!','I MIEI ROBOTTINI!','GRAZIE MACI!','GUARDA IL COMPUTER!','CIAO PIUMI!','CORRI, PIUMI!','GRAZIE PIUMI!',
    'SONO USCITI DAL COMPUTER.','OGNI ROBOTTINO HA UNA LETTERA.','PREMI LA STESSA LETTERA SULLA TASTIERA!','COSÌ IL ROBOTTINO TORNA A CASA.','BRAVO MACI!','BRAVA PIUMI!',
    'ADESSO IL TASTO NON BRILLA SUBITO!','GUARDA! INSIEME FANNO UNA PAROLA!','IL COMPUTER HA DETTO MIAO!','PREMI INVIO PER ANDARE AVANTI.','CERCA IL TASTO CHE BRILLA!']
};
/* lettere e numeri registrati: audio/lettere/<tasto>.mp3 */
const LETTER_CLIPS=new Set([...'AEIOUM']);
let clip=null,voice=true;
function stopVoice(){try{speechSynthesis.cancel();}catch(e){}if(clip){clip.pause();clip=null;}}
function playClip(src,fallback){clip=new Audio(src);clip.play().catch(fallback);clip.onerror=fallback;}
function say(t,who){if(!voice)return;stopVoice();
  const k=(LINES[who]||[]).indexOf(t);
  if(k>=0){playClip('audio/voce/'+PREFIX[who]+String(k+1).padStart(2,'0')+'.mp3',()=>ttsSay(t,who));return;}
  ttsSay(t,who);}
function sayKey(id){if(!voice||!NOME[id])return;stopVoice();
  if(LETTER_CLIPS.has(id))playClip('audio/lettere/'+id+'.mp3',()=>ttsSay(NOME[id],'lettere'));
  else ttsSay(NOME[id],'lettere');}
function ttsSay(t,who){try{speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t.toLowerCase().replace(/!/g,'! ').replace(/\./g,'. '));u.lang='it-IT';if(chosen)u.voice=chosen;
  const p=VOX[who]||VOX.cat;u.pitch=p.pitch;u.rate=p.rate;speechSynthesis.speak(u);}catch(e){}}

/* ---------- dialoghi (OK si preme anche con INVIO) ---------- */
const NAMES={emma:'NONNA EMMA',girl:'MARGHERITA',simone:'ZIO SIMONE'};
const PORTRAIT={
  emma:p=>{p.setTransform(2.6,0,0,2.6,0,0);drawCat(p,30,74,CATS.emma,{sit:true,f:1,t:0,noShadow:true});},
  girl:p=>{p.setTransform(2.4,0,0,2.4,0,0);drawGirl(p,38,148,{t:0,noShadow:true});},
  simone:p=>{p.setTransform(2.2,0,0,2.2,0,0);drawPerson(p,42,145,{kind:'simone',noShadow:true});}
};
let dlg=null;
function openDialog(who,pages,done){
  dlg={who,pages,i:0,done};music.volume=VOL*.35;
  document.getElementById('dlg').hidden=false;document.body.classList.add('talking');
  document.getElementById('dName').textContent=NAMES[who];
  const pctx=document.getElementById('dlgPic').getContext('2d');
  pctx.setTransform(1,0,0,1,0,0);pctx.clearRect(0,0,184,184);PORTRAIT[who](pctx);
  showPage();
}
function showPage(){const t=dlg.pages[dlg.i];document.getElementById('dText').textContent=t;say(t,dlg.who);sfx.meow();}
function nextPage(){if(!dlg)return;dlg.i++;if(dlg.i<dlg.pages.length){showPage();return;}
  const d=dlg.done;dlg=null;music.volume=VOL;document.getElementById('dlg').hidden=true;document.body.classList.remove('talking');stopVoice();if(d)d();}
document.getElementById('dOk').onclick=nextPage;
document.getElementById('dSay').onclick=()=>{if(dlg){const v=voice;voice=true;say(dlg.pages[dlg.i],dlg.who);voice=v;}};

/* ---------- effetti ---------- */
let floats=[],parts=[];
function floatText(x,y,txt,col,size){floats.push({x,y,txt,t:0,col:col||'#fff',size:size||34});}
function burst(x,y,n,cols){for(let i=0;i<(RM?Math.ceil(n/4):n);i++){const a=R()*TAU,s=60+R()*160;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-120,life:1+R()*.6,col:cols[i%cols.length],r:3+R()*4,rot:R()*6});}}
const confetti=(x,y)=>burst(x,y,90,['#ff6fa8','#ffc93d','#5cbf60','#6a8ff0','#fff']);
function fxUpdate(dt){
  floats.forEach(f=>f.t+=dt);floats=floats.filter(f=>f.t<1.6);
  parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=380*dt;p.life-=dt;p.rot+=dt*6;});parts=parts.filter(p=>p.life>0);
}
function fxDraw(c){
  parts.forEach(p=>{c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.globalAlpha=Math.min(1,p.life*2);c.fillStyle=p.col;c.fillRect(-p.r,-p.r/2,p.r*2,p.r);c.restore();});
  floats.forEach(f=>{const a=f.t<1.2?1:1-(f.t-1.2)/.4,y=f.y-f.t*40;c.save();c.globalAlpha=a;c.font=`700 ${f.size}px Fredoka, system-ui, sans-serif`;c.textAlign='center';c.textBaseline='middle';
    c.lineWidth=7;c.strokeStyle=OL;c.lineJoin='round';c.strokeText(f.txt,f.x,y);c.fillStyle=f.col;c.fillText(f.txt,f.x,y);c.restore();});
}
/* una grande lettera con il bordo, nello stile del gioco */
function bigText(c,txt,x,y,size,col){c.save();c.font=`700 ${size}px Fredoka, system-ui, sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
  c.lineWidth=size*.16;c.strokeStyle=OL;c.strokeText(txt,x,y);c.fillStyle=col||'#fff';c.fillText(txt,x,y);c.restore();}

/* ---------- missioni e schermate ---------- */
const MISSIONS=[];   /* {name,who,music,start(),update(dt),draw(c),key(id)} */
let SCR='intro',M=null;
const N=()=>CATS[SAVE.cur].name;
const BRAV=()=>SAVE.cur=='piumi'?'BRAVA':'BRAVO';
const ZAMPE=['ZAMPA PICCOLA','ZAMPA MEDIA','ZAMPA GRANDE'];
function setQuest(text,tag){document.getElementById('questText').textContent=text;if(tag)document.getElementById('questTag').textContent=tag;}
function setProg(html){document.getElementById('questProg').innerHTML=html||'';}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
