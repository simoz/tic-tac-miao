/* ===== Schermata iniziale: Maci e Piumi camminano sulla tastiera e scrivono TIC TAC MIAO ===== */
const TITLE=[...'TIC','SPAZIO',...'TAC','SPAZIO',...'MIAO'];
const TCOL=['#ff6fa8','#ffc93d','#5cbf60','#6ab8ff','#b46ee0','#ff9a3d'];
const IN={i:0,t:0,cat:'maci',typed:[],x:0,y:0,fx:0,fy:0,f:1,pause:0};
function introReset(){IN.i=0;IN.t=0;IN.typed=[];IN.pause=0;const p=keyCenter('Q');IN.x=IN.fx=p.x-90;IN.y=IN.fy=p.y+18;}
introReset();
function introUpdate(dt){
  if(IN.pause>0){IN.pause-=dt;if(IN.pause<=0){IN.cat=IN.cat=='maci'?'piumi':'maci';introReset();}return;}
  const id=TITLE[IN.i],to=keyCenter(id);to.y+=18;
  IN.t+=dt/(RM?.2:.5);const t=Math.min(1,IN.t);
  IN.x=IN.fx+(to.x-IN.fx)*t;IN.y=IN.fy+(to.y-IN.fy)*t-Math.sin(t*Math.PI)*40;IN.f=to.x>=IN.fx?1:-1;
  if(t>=1){
    KEYS[id].press=1;sfx.tic();
    IN.typed.push({ch:id=='SPAZIO'?' ':id,t:0});
    IN.fx=to.x;IN.fy=to.y;IN.t=0;IN.i++;
    if(IN.i>=TITLE.length){IN.pause=4;sfx.motivo();}
  }
  IN.typed.forEach(l=>l.t+=dt);
}
function introDraw(c){
  /* sfondo: la casa di nonna Emma, con Margherita e nonna Emma che guardano */
  c.fillStyle='#ffefc4';c.fillRect(-EX,-EY,LW+2*EX,420+EY);
  c.fillStyle='#ffe3a6';for(let x=-Math.ceil(EX/40)*40;x<LW+EX;x+=40)c.fillRect(x,0,16,330);
  c.fillStyle='#c99a6b';c.fillRect(-EX,330,LW+2*EX,90);c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(-EX,330);c.lineTo(LW+EX,330);c.stroke();
  drawCat(c,110,392,CATS.emma,{sit:true,f:1,t:T,scale:1.6});
  c.save();c.translate(890,400);c.scale(1.4,1.4);drawGirl(c,0,0,{t:T,wave:true});c.restore();
  /* il titolo che si scrive */
  let x=500-IN.typed.length*34;const cx=IN.typed.map(()=>{const v=x+34;x+=68;return v;});
  IN.typed.forEach((l,i)=>{if(l.ch==' ')return;const s=RM?1:Math.min(1,l.t*4)*(1+.25*Math.max(0,1-l.t*3)),b=RM?0:Math.sin(T*3+i)*4;
    c.save();c.translate(cx[i],170+b);c.scale(s,s);bigText(c,l.ch,0,0,96,TCOL[i%TCOL.length]);c.restore();});
}
function introCat(c){drawCat(c,IN.x,IN.y,CATS[IN.cat],{f:IN.f,t:T,scale:1.15,moving:IN.pause<=0});}
