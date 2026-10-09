/* ===== Missione 5: il pollaio di zia Mile (le addizioni fino a 9: 2 + 3 = ?) ===== */
(()=>{
const MILE={x:885,y:425,s:1.5};
const NESTS=[{x:350,y:330},{x:610,y:330}];
const BOARD={x:540,y:112,w:310,h:116};
const eggSVG=on=>`<svg viewBox="0 0 26 26" aria-hidden="true"><ellipse cx="13" cy="14" rx="8" ry="10" fill="${on?'#fff8ec':'#e4d6b8'}" stroke="#3b2a35" stroke-width="1.6"/><ellipse cx="10" cy="10" rx="2" ry="3" fill="${on?'#fff':'#efe5cf'}"/></svg>`;
let S={};
/* posti delle uova dentro il nido: fino a 5 */
const EGG_POS=[[-42,0],[0,0],[42,0],[-21,-44],[21,-44]];
function sums(lo,hi,maxA,maxB,n){const all=[];for(let a=1;a<=maxA;a++)for(let b=1;b<=maxB;b++)if(a+b>=lo&&a+b<=hi)all.push([a,b]);return shuffle(all).slice(0,n).map(([a,b])=>({a,b,keys:String(a+b)}));}

function nest(c,x,y){E(c,x,y,64,20);fs(c,'#e8c66a',2.6);c.strokeStyle='#c9a24a';c.lineWidth=1.8;for(let k=-50;k<=50;k+=10){c.beginPath();c.moveTo(x+k-5,y-10);c.lineTo(x+k+5,y+8);c.stroke();}}
const o={
  index:4,who:'mile',name:'Il pollaio di zia Mile',sub:'PIÙ',music:'audio/m5.mp3',
  rounds:[()=>sums(2,5,3,2,5),()=>sums(3,7,4,3,5),()=>sums(6,9,5,4,5)],
  reset(){S={eggs:[],hop:0,wave:0,hen:0,res:null,pi:0,p:null};},
  intro:()=>[`CIAO ${N()}!`,'LE GALLINE FANNO LE UOVA.','CONTA TUTTE LE UOVA!','QUANTE UOVA IN TUTTO?'],
  between:r=>r==1?['ADESSO TANTE UOVA!']:[],
  ending:()=>['CHE BELLE UOVA!','FACCIAMO LA FRITTATA.',`GRAZIE ${N()}!`],
  endText:'Zia Mile fa una frittata gigante con tutte le uova!',
  quest:()=>'QUANTE UOVA IN TUTTO? PREMI IL NUMERO',
  icon:eggSVG,
  show(p){S.p=p;S.res=null;S.eggs=[];
    for(let i=0;i<p.a;i++)S.eggs.push({n:0,i,t:-i*.15,hl:0});
    for(let i=0;i<p.b;i++)S.eggs.push({n:1,i,t:-(p.a*.15+.5+i*.35),hl:0,laid:true});
    o.Q.after(p.a*.15+.4,()=>{S.hen=p.b*.35+.3;});
    return p.a*.15+.6+p.b*.35;},
  prompt(p){sayList([NOME[p.a],'più',NOME[p.b]],750);},
  step(){},
  /* giusto: si contano tutte le uova, una alla volta */
  good(p){S.hop=1;S.wave=1.6;const kc=keyCenter(p.keys);burst(kc.x,kc.y,16,['#ffd23d','#fff']);
    S.eggs.forEach((e,i)=>o.Q.after(i*.5,()=>{e.hl=.7;e.num=i+1;sayWord(NOME[i+1]);}));
    const sum=p.a+p.b;o.Q.after(sum*.5+.2,()=>{S.res=sum;sayList(['fa',NOME[sum]],600);floatText(BOARD.x,BOARD.y-60,p.err==0&&Math.random()<.5?BRAVI():'',"#ffd23d");});
    return sum*.5+1.8;},
  bad(){S.eggs.forEach(e=>e.no=1);},
  help(p){S.eggs.forEach((e,i)=>o.Q.after(i*.7,()=>{e.hl=.6;sayWord(NOME[i+1]);}));},
  update(dt){S.hop=Math.max(0,S.hop-dt*3);S.wave=Math.max(0,S.wave-dt);S.hen=Math.max(0,S.hen-dt);
    S.eggs.forEach(e=>{const was=e.t;e.t+=dt;e.hl=Math.max(0,e.hl-dt);e.no=Math.max(0,(e.no||0)-dt*2);if(e.laid&&was<0&&e.t>=0)sfx.tic();});},
  draw(c){
    /* aia: cielo, prato, pollaio */
    c.fillStyle='#cdeeff';c.fillRect(-EX,-EY,LW+2*EX,250+EY);
    [[90,70],[700,50]].forEach(([x,y])=>drawIcon(c,'nuvola',x,y,1.3));
    c.fillStyle='#8fd36a';c.fillRect(-EX,250,LW+2*EX,170);c.strokeStyle='#7cc65a';c.lineWidth=3;
    for(let x=-Math.ceil(EX/37)*37;x<LW+EX;x+=37){c.beginPath();c.moveTo(x,300+(x%3)*20);c.lineTo(x+4,290+(x%3)*20);c.stroke();}
    drawCoop(c,105,300);
    c.save();c.translate(MILE.x,MILE.y);c.scale(MILE.s,MILE.s);drawPerson(c,0,0,{kind:'mile',t:T,wave:S.wave>0});c.restore();
    drawBoard(c);
    NESTS.forEach(n=>nest(c,n.x,n.y));
    /* la gallina che fa le uova nel secondo nido */
    const lay=S.hen>0&&!RM,hb=lay?Math.abs(Math.sin(T*10))*8:0;
    hen(c,NESTS[1].x+116,NESTS[1].y+4-hb,-1,['#fff4e0','#e9d6b8'],{s:2,t:T,peck:!lay,k:1});
    if(S.p)bigText(c,'+',(NESTS[0].x+NESTS[1].x)/2,NESTS[0].y-14,56,'#fff');
    S.eggs.forEach(e=>{if(e.t<0)return;const n=NESTS[e.n],[dx,dy]=EGG_POS[e.i],pop=RM?1:Math.min(1,e.t*5),
      wig=e.no&&!RM?Math.sin(e.no*30)*4*e.no:0,hy=e.laid?-Math.max(0,1-e.t*3)*50:0;
      uovo(c,n.x+dx+wig,n.y+dy-12+hy,1.3*pop,e.hl>0);
      if(e.num)bigText(c,String(e.num),n.x+dx,n.y+dy-46,26,'#fff');});
    drawQCat(c,S.hop);
  }
};
/* la lavagnetta con il conto */
function drawBoard(c){const {x,y,w,h}=BOARD;
  rr(c,x-w/2,y-h/2,w,h,10);fs(c,'#b0743f',3);rr(c,x-w/2+10,y-h/2+10,w-20,h-20,6);c.fillStyle='#2f4a3a';c.fill();
  const p=S.p;if(!p)return;
  const txt=`${p.a} + ${p.b} = ${S.res==null?'?':S.res}`;
  c.save();c.font='700 64px Fredoka, system-ui, sans-serif';c.textAlign='center';c.textBaseline='middle';
  c.fillStyle=S.res==null?'#f6f1e4':'#ffd23d';c.fillText(txt,x,y+4);c.restore();}
function drawCoop(c,x,y){shadowAt(c,x,y+4,90,12);
  rr(c,x-70,y-80,140,80,4);fs(c,'#e9c27a');c.strokeStyle='#cfa25c';c.lineWidth=2;for(let k=x-56;k<x+70;k+=18){c.beginPath();c.moveTo(k,y-78);c.lineTo(k,y-2);c.stroke();}
  c.beginPath();c.moveTo(x-86,y-74);c.lineTo(x,y-124);c.lineTo(x+86,y-74);c.closePath();fs(c,'#d0623c');
  c.beginPath();c.moveTo(x-20,y);c.lineTo(x-20,y-36);c.arc(x,y-36,20,Math.PI,0);c.lineTo(x+20,y);c.closePath();fs(c,'#5a3a2a');
  hen(c,x+6,y-120,1,['#e5533d','#b0402a'],{rooster:true,t:T,s:.9});}
MISSIONS.push(makeQuiz(o));
})();
