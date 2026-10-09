/* ===== Il giro comune delle missioni 2–5 =====
   Una missione ha tre turni; ogni turno è una serie di prove; ogni prova chiede una sequenza di tasti
   (una lettera "M", una sillaba "MA", una parola "NONNA", un numero "5").
   La missione disegna la scena e decide cosa succede; qui si contano errori, aiuti, zampe e stelle. */
const HINT_DELAY=[0,2.5,5];   /* dopo quanti secondi brilla il tasto: zampa piccola, media, grande */
function makeQuiz(o){
  /* o: {index,who,name,sub,music,intro(),rounds:[()=>prove],between(r)→frasi,ending()→frasi,endText,
         quest(r),icon(on),show(p)→secondi,prompt(p),step(p,i),good(p)→secondi,bad(p,id),help(p),update(dt),draw(c)} */
  const Q={timers:[]};
  const after=(sec,fn)=>Q.timers.push({t:sec,fn});
  const cur=()=>Q.prove&&Q.prove[Q.pi];
  function hud(){setQuest(o.quest(Q.round),ZAMPE[Q.zampa]);setProg(Q.prove?Q.prove.map((p,i)=>o.icon(i<Q.pi||(i==Q.pi&&p.done))).join(''):'');}
  function startRound(r){Q.round=r;Q.rErr=0;Q.prove=o.rounds[r]();Q.pi=0;hud();showProva();}
  function showProva(){const p=cur();p.pos=0;p.err=0;p.done=false;Q.wt=0;Q.busy=true;
    after(o.show(p)||.8,()=>{Q.busy=false;Q.wt=0;o.prompt(p);});}
  function key(id){
    const p=cur();if(!p||Q.busy)return;
    const want=p.keys[p.pos];
    if(id==want){segna(want,true);p.pos++;sfx.ok();
      if(p.pos<p.keys.length){Q.wt=0;o.step(p,p.pos,id);return;}
      p.done=true;Q.busy=true;hud();const d=o.good(p);
      after(d==null?1:d,()=>{Q.pi++;if(Q.pi<Q.prove.length)showProva();else{Q.prove=null;hud();after(.4,endRound);}});
    }else{
      if(KEYS[id])KEYS[id].shake=1;sfx.boop();p.err++;Q.rErr++;Q.err++;segna(want,false);
      o.bad(p,id);
      if(p.err==2){floatText(QCAT.x+10,QCAT.y-110,'MIAO?','#fff',30);after(.4,()=>o.help(p));}
    }
  }
  function endRound(){
    const r=Q.round,pages=[`${BRAV()} ${N()}!`];
    if(r<o.rounds.length-1){
      if(Q.rErr<=1&&Q.zampa<2){Q.zampa++;pages.push('ADESSO IL TASTO NON BRILLA SUBITO!');}
      else if(Q.rErr>=5&&Q.zampa>0){Q.zampa--;pages.push('CERCA IL TASTO CHE BRILLA!');}
      openDialog(o.who,pages.concat(o.between(r)),()=>startRound(r+1));
    }else{
      openDialog(o.who,o.ending(),()=>{
        sfx.win();confetti(500,200);
        const stelle=Q.err<=2?3:Q.err<=6?2:1;
        SAVE.stelle[o.index]=Math.max(SAVE.stelle[o.index]||0,stelle);SAVE.zampa[o.index]=Q.zampa;save();
        after(1.4,()=>showEnd(stelle,o.endText));
      });
    }
  }
  const mission={name:o.name,sub:o.sub,who:o.who,ready:true,music:o.music,index:o.index,
    start(){Q.timers=[];Q.zampa=SAVE.zampa[o.index]||0;Q.err=0;Q.rErr=0;Q.prove=null;Q.round=0;Q.wt=0;Q.busy=true;
      o.reset&&o.reset();hud();setProg('');openDialog(o.who,o.intro(),()=>startRound(0));},
    update(dt){Q.wt+=dt;const ts=Q.timers;Q.timers=[];ts.forEach(t=>{t.t-=dt;if(t.t<=0)t.fn();else Q.timers.push(t);});o.update(dt);},
    draw:c=>o.draw(c),key,
    kbOpts(){const p=cur();if(!p||Q.busy||p.done)return {};
      const glow=p.err>0?1:Math.max(0,Math.min(1,(Q.wt-HINT_DELAY[Q.zampa])/.4));return {target:p.keys[p.pos],glow};}
  };
  Q.after=after;Q.cur=cur;o.Q=Q;
  return mission;
}
/* dove sta il gatto nelle scene delle missioni (per il "MIAO?" dopo due errori) */
const QCAT={x:150,y:400};
function drawQCat(c,hop){drawCat(c,QCAT.x,QCAT.y-Math.sin(hop*Math.PI)*28,CATS[SAVE.cur],{sit:hop<.05,f:1,t:T,scale:1.7,moving:hop>0});}
const BRAVI=()=>['SÌ!','EVVIVA!','BRAVISSIM'+(SAVE.cur=='piumi'?'A!':'O!')][Math.floor(Math.random()*3)];
