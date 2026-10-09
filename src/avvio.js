/* ===== Avvio: schermate, tastiera vera e toccata, ciclo del gioco ===== */
/* le missioni che arriveranno */
[['I libri di nonna Luisa','LE LETTERE'],['I gomitoli di Emma','LE SILLABE'],["L'orto di zio Giulio",'CONTARE'],['Il pollaio di zia Mile','PIÙ'],
 ['I mirtilli di nonna Lucy','MENO'],['Le bolle di papà','LE PAROLE'],['La festa di Margherita e Rebecca','IL DETTATO']].forEach(([name,sub])=>MISSIONS.push({name,sub,ready:false}));

const $=id=>document.getElementById(id);
const starSVG=on=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${on?'#ffc93d':'#e4d6b8'}" stroke="#3b2a35" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

function show(scr){
  SCR=scr;document.body.classList.toggle('intro',scr=='intro');document.body.classList.toggle('play',scr=='play');
  $('start').hidden=scr!='intro';$('menu').hidden=scr!='menu';$('end').hidden=scr!='end';
}
function goIntro(){show('intro');introReset();}
function goMenu(){
  if(dlg){dlg=null;$('dlg').hidden=true;document.body.classList.remove('talking');}
  stopVoice();M=null;show('menu');floats=[];parts=[];playMusic('audio/intro.mp3');
  $('levels').innerHTML=MISSIONS.map((m,i)=>`<button class="lvl" data-m="${i}" ${m.ready?'':'disabled'}><b>${i+1}</b><span>${m.name}<small>${m.sub}</small>${m.ready?(SAVE.stelle[i]?`<i>${'★'.repeat(SAVE.stelle[i])}</i>`:''):'<i>PRESTO!</i>'}</span></button>`).join('');
  $('levels').querySelectorAll('.lvl').forEach(b=>b.onclick=()=>play(+b.dataset.m));
}
function play(i){
  const m=MISSIONS[i];if(!m||!m.ready)return;
  M=m;M.index=i;floats=[];parts=[];show('play');sfx.motivo();playMusic(m.music);m.start();
}
function showEnd(stelle,text){
  show('end');$('stars').innerHTML=[0,1,2].map(i=>starSVG(i<stelle)).join('');$('endText').textContent=text;sfx.win();
}
$('bPlay').onclick=()=>{unlockAudio();goMenu();};
$('again').onclick=()=>play(M.index);
$('toMenu').onclick=goMenu;
$('bBack').onclick=goMenu;
$('bMus').onclick=()=>{unlockAudio();if(musicOn&&music.paused){music.play().catch(()=>{});return;}setMusic(!musicOn);};
function setCat(k){SAVE.cur=k;save();$('bMaci').classList.toggle('on',k=='maci');$('bPiumi').classList.toggle('on',k=='piumi');sfx.meow();}
$('bMaci').onclick=()=>setCat('maci');
$('bPiumi').onclick=()=>setCat('piumi');
function drawPortraits(){
  [['bMaci','maci'],['bPiumi','piumi']].forEach(([id,k])=>{const p=document.querySelector('#'+id+' canvas').getContext('2d');p.setTransform(1,0,0,1,0,0);p.clearRect(0,0,96,96);p.setTransform(1.45,0,0,1.45,0,0);drawCat(p,30,62,CATS[k],{f:1,t:0,sit:true,noShadow:true});});
}

/* ---------- un tasto premuto: dalla tastiera vera o toccando quella disegnata ---------- */
function pressKey(id){
  unlockAudio();if(KEYS[id])KEYS[id].press=1;sfx.tic();
  if(dlg){if(id=='INVIO'||id=='SPAZIO')nextPage();return;}
  if(SCR=='intro'){if(id=='INVIO')goMenu();else sayKey(id);return;}
  if(SCR=='menu'){const n=+id;if(n>=1&&n<=MISSIONS.length&&MISSIONS[n-1].ready)play(n-1);else if(id=='INVIO')play(0);else sayKey(id);return;}
  if(SCR=='end'){if(id=='INVIO')play(M.index);return;}
  if(SCR=='play'&&M)M.key(id);
}
addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  const id=keyId(e);if(!id)return;
  /* se un pulsante ha il fuoco (si è arrivati con TAB), INVIO e SPAZIO lo premono */
  const a=document.activeElement;
  if((id=='INVIO'||id=='SPAZIO')&&a&&a.tagName=='BUTTON'){KEYS[id].press=1;return;}
  e.preventDefault();if(e.repeat)return;pressKey(id);
});
/* dopo un tocco su un pulsante il fuoco non deve restare lì, se no INVIO lo ripremerebbe */
addEventListener('pointerup',()=>setTimeout(()=>{const a=document.activeElement;if(a&&a.tagName=='BUTTON')a.blur();}),true);
cv.addEventListener('pointerdown',e=>{const p=toLogic(e.clientX,e.clientY),k=keyAt(p.x,p.y);if(k){e.preventDefault();pressKey(k.id);}});
/* la musica dell'intro parte al primo tocco, se il browser non l'ha fatta partire da sola */
['pointerup','keydown'].forEach(ev=>addEventListener(ev,()=>{unlockAudio();if(musicOn&&music.paused&&SCR!='play')playMusic('audio/intro.mp3');},true));

/* ---------- ciclo ---------- */
function update(dt){
  kbUpdate(dt);fxUpdate(dt);
  if(SCR=='intro'||SCR=='menu')introUpdate(dt);
  else if(M&&(SCR=='play'||SCR=='end'))M.update(dt);
}
function render(){
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#4a4252';ctx.fillRect(0,0,VW,VH);
  ctx.setTransform(DPR*Z,0,0,DPR*Z,DPR*OX,DPR*OY);
  const inPlay=M&&(SCR=='play'||SCR=='end');
  if(inPlay)M.draw(ctx);else introDraw(ctx);
  const o=dlg?{target:'INVIO'}:SCR=='intro'&&IN.pause>0?{target:'INVIO'}:SCR=='end'?{target:'INVIO'}:inPlay&&M.kbOpts?M.kbOpts():{};
  drawKeyboard(ctx,o);
  if(!inPlay)introCat(ctx);
  fxDraw(ctx);
}
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;update(dt);render();requestAnimationFrame(frame);}
setCat(SAVE.cur);$('bMus').classList.toggle('on',musicOn);
drawPortraits();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawPortraits);
goIntro();music.src='audio/intro.mp3';if(musicOn)music.play().catch(()=>{});
requestAnimationFrame(frame);
if(location.hash=='#debug')window.__ttm={get SCR(){return SCR;},play,goMenu,pressKey,SAVE,step:dt=>{T+=dt;update(dt);}};
