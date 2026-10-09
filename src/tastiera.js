/* ===== Tastiera italiana disegnata: tasti colorati per dito, zampette su F e J ===== */
const KU=57,KG=4;   /* lato di un tasto e spazio fra i tasti (unità logiche) */
const KB={x:(LW-14.7*KU)/2,y:440};
/* colori delle dita: uguali per la stessa dita delle due mani, l'indice destro è viola per distinguerlo */
const DITA={mignolo:'#f9b4c8',anulare:'#ffd978',medio:'#a8e08f',indiceS:'#9fd0ff',indiceD:'#cfb3f5',pollice:'#ffbe85'};
const DITO_DI={};
[['mignolo','1QAZ0\'ÌPÈ+ÒÀÙ-'],['anulare','2WSX9OL.'],['medio','3EDC8IK,'],['indiceS','45RTFGVB'],['indiceD','67YUHJNM']].forEach(([d,s])=>[...s].forEach(k=>DITO_DI[k]=d));
DITO_DI.CANC=DITO_DI.INVIO='mignolo';DITO_DI.SPAZIO='pollice';

const KEYS={},KLIST=[];
function addKey(id,x,y,w,h){const k={id,x:KB.x+x*KU,y:KB.y+y*KU,w:w*KU-KG,h:h*KU-KG,press:0,shake:0};KEYS[id]=k;KLIST.push(k);}
[[0,0,[...'1234567890'],"'",'Ì'],[.5,1,[...'QWERTYUIOP'],'È','+'],[.8,2,[...'ASDFGHJKL'],'Ò','À','Ù'],[1.3,3,[...'ZXCVBNM'],',','.','-']].forEach(([x0,row,...rest])=>{
  rest.flat().forEach((id,i)=>addKey(id,x0+i,row,1,1));});
addKey('CANC',12,0,2.7,1);
addKey('INVIO',12.8,1,1.9,2);
addKey('SPAZIO',3.6,4,6.2,1);
const LABEL={CANC:'⌫ CANCELLA',INVIO:'INVIO ⏎',SPAZIO:''};

/* dal tasto premuto sulla tastiera vera al nome del tasto disegnato */
function keyId(e){
  if(e.key=='Enter')return 'INVIO';if(e.key=='Backspace'||e.key=='Delete')return 'CANC';if(e.key==' ')return 'SPAZIO';
  if(e.key&&e.key.length==1){const k=e.key.toUpperCase();if(KEYS[k])return k;}
  const m=/^(Key|Digit)(.)$/.exec(e.code||'');if(m&&KEYS[m[2]])return m[2];
  return null;
}
function keyAt(x,y){return KLIST.find(k=>x>=k.x&&x<=k.x+k.w&&y>=k.y&&y<=k.y+k.h)||null;}
function keyCenter(id){const k=KEYS[id];return {x:k.x+k.w/2,y:k.y+k.h/2};}
function kbUpdate(dt){KLIST.forEach(k=>{k.press=Math.max(0,k.press-dt*5);k.shake=Math.max(0,k.shake-dt*2.5);});}

function zampetta(c,x,y,s,col){c.fillStyle=col;E(c,x,y+s*.35,s*.55,s*.42);c.fill();
  [[-.55,-.2],[-.2,-.55],[.2,-.55],[.55,-.2]].forEach(([a,b])=>{E(c,x+a*s,y+b*s,s*.2,s*.24);c.fill();});}

/* o.target: tasto (o tasti) da premere; o.glow: quanto si vede l'aiuto (0..1); o.colors: colori delle dita */
function drawKeyboard(c,o){
  o=o||{};const tg=[].concat(o.target||[]),glow=o.glow==null?1:o.glow,colors=o.colors!==false;
  rr(c,KB.x-16,KB.y-16,14.7*KU+28,5*KU+28,22);fs(c,'#4a4252',3.5);
  rr(c,KB.x-8,KB.y-8,14.7*KU+12,5*KU+12,16);c.fillStyle='#3b3540';c.fill();
  const pulse=RM?.6:.5+.5*Math.sin(T*6);
  KLIST.forEach(k=>{
    const on=tg.includes(k.id)&&glow>0,dn=k.press*4,sx=k.shake?Math.sin(k.shake*40)*k.shake*5:0;
    const lift=on&&!RM?-3*pulse*glow:0;
    const x=k.x+sx,y=k.y+dn+lift,col=colors?DITA[DITO_DI[k.id]]||'#e8e2d6':'#efe8dc';
    rr(c,x,y+5,k.w,k.h,9);c.fillStyle='#231f27';c.fill();
    if(on){c.save();c.shadowColor='#ffd23d';c.shadowBlur=22*glow*(.5+pulse*.5);rr(c,x-3,y-3,k.w+6,k.h+6,11);c.fillStyle='rgba(255,210,61,'+(.6*glow)+')';c.fill();c.restore();}
    rr(c,x,y,k.w,k.h,9);c.fillStyle=on&&glow>.5?'#fff3b0':col;c.fill();c.lineWidth=on?3.5:2.2;c.strokeStyle=on?'#e08a00':OL;c.stroke();
    rr(c,x+4,y+3,k.w-8,k.h*.36,6);c.fillStyle='rgba(255,255,255,.35)';c.fill();
    const lab=LABEL[k.id]!=null?LABEL[k.id]:k.id;
    c.fillStyle=OL;c.textAlign='center';c.textBaseline='middle';
    c.font=`700 ${lab.length>1?17:27}px Fredoka, system-ui, sans-serif`;
    c.fillText(lab,x+k.w/2,y+k.h/2+(k.id=='F'||k.id=='J'?-5:1));
    if(k.id=='F'||k.id=='J')zampetta(c,x+k.w/2,y+k.h-11,7,'rgba(59,42,53,.55)');
    if(k.id=='SPAZIO'){zampetta(c,x+k.w/2-24,y+k.h/2,8,'rgba(59,42,53,.35)');zampetta(c,x+k.w/2+24,y+k.h/2,8,'rgba(59,42,53,.35)');}
  });
}
