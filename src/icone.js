/* ===== Figure: le immagini delle parole, gomitoli, uova, cesti ===== */
const ICON={
  mela(c){c.beginPath();c.moveTo(0,-22);c.bezierCurveTo(-30,-40,-46,0,-22,30);c.quadraticCurveTo(0,42,22,30);c.bezierCurveTo(46,0,30,-40,0,-22);fs(c,'#e5533d');
    E(c,-12,-8,6,10,-.5);c.fillStyle='rgba(255,255,255,.5)';c.fill();
    c.beginPath();c.moveTo(0,-22);c.lineTo(3,-36);c.strokeStyle=OL;c.lineWidth=4;c.stroke();E(c,14,-34,11,5,-.4);fs(c,'#5cbf60',2.5);},
  palla(c){C(c,0,0,34);fs(c,'#fff');c.save();C(c,0,0,34);c.clip();
    ['#e5533d','#ffc93d','#6ab8ff'].forEach((col,i)=>{c.save();c.rotate(i*TAU/3);c.beginPath();c.moveTo(0,0);c.arc(0,0,40,-.5,.5);c.closePath();c.fillStyle=col;c.fill();c.restore();});
    c.restore();C(c,0,0,34);c.lineWidth=3;c.strokeStyle=OL;c.stroke();C(c,0,0,6);fs(c,'#fff',2);},
  luna(c){const r1=34,r2=28,dx=14,dy=-10,d=Math.hypot(dx,dy),q=(r1*r1-r2*r2+d*d)/(2*d),th=Math.atan2(dy,dx),al=Math.acos(q/r1);
    const pa=th+al,pb=th-al,ang=p=>Math.atan2(r1*Math.sin(p)-dy,r1*Math.cos(p)-dx);
    c.beginPath();c.arc(0,0,r1,pa,pb+TAU);c.arc(dx,dy,r2,ang(pb),ang(pa),true);c.closePath();fs(c,'#ffd23d');
    C(c,-16,0,3);c.fillStyle=OL;c.fill();c.beginPath();c.arc(-12,12,6,.4,1.8);c.lineWidth=2.5;c.strokeStyle=OL;c.stroke();},
  tazza(c){rr(c,-26,-24,44,48,8);fs(c,'#6ab8ff');c.beginPath();c.arc(20,0,12,-1.3,1.3);c.lineWidth=6;c.strokeStyle=OL;c.stroke();c.lineWidth=3;c.strokeStyle='#6ab8ff';c.stroke();
    E(c,-4,-24,22,5);fs(c,'#8a5a36',2.5);[-12,0].forEach(d=>{c.beginPath();c.moveTo(d,-34);c.quadraticCurveTo(d+6,-40,d,-48);c.strokeStyle='rgba(59,42,53,.4)';c.lineWidth=2.5;c.stroke();});},
  sole(c){for(let i=0;i<10;i++){c.save();c.rotate(i*TAU/10+(RM?0:T*.5));c.beginPath();c.moveTo(-5,-26);c.lineTo(0,-40);c.lineTo(5,-26);c.closePath();fs(c,'#ffb02e',2);c.restore();}
    C(c,0,0,26);fs(c,'#ffd23d');C(c,-8,-4,3);C(c,8,-4,3);c.fillStyle=OL;c.fill();c.beginPath();c.arc(0,4,10,.3,Math.PI-.3);c.lineWidth=3;c.stroke();},
  nuvola(c){c.beginPath();c.arc(-18,6,16,Math.PI*.5,Math.PI*1.5);c.arc(-4,-10,18,Math.PI,Math.PI*1.9);c.arc(18,-2,16,Math.PI*1.3,Math.PI*.4);c.lineTo(-18,22);c.closePath();fs(c,'#fff');
    C(c,-8,2,2.5);C(c,8,2,2.5);c.fillStyle=OL;c.fill();},
  rana(c){E(c,0,8,34,24);fs(c,'#5cbf60');[-16,16].forEach(d=>{C(c,d,-14,11);fs(c,'#5cbf60');C(c,d,-14,6);fs(c,'#fff',2);C(c,d+1,-13,3);c.fillStyle=OL;c.fill();});
    c.beginPath();c.arc(0,8,16,.3,Math.PI-.3);c.strokeStyle=OL;c.lineWidth=3;c.stroke();E(c,-20,14,4,3);E(c,20,14,4,3);c.fillStyle='rgba(255,110,140,.5)';c.fill();},
  dado(c){c.save();c.rotate(-.15);rr(c,-30,-30,60,60,12);fs(c,'#fff');[[-14,-14],[14,-14],[0,0],[-14,14],[14,14]].forEach(([a,b])=>{C(c,a,b,5.5);c.fillStyle='#e5533d';c.fill();});c.restore();}
};
function drawIcon(c,name,x,y,s){if(!ICON[name])return;c.save();c.translate(x,y);c.scale(s||1,s||1);c.lineJoin='round';c.lineCap='round';ICON[name](c);c.restore();}

/* gomitolo di lana con i fili */
function gomitolo(c,x,y,r,col,rot){c.save();c.translate(x,y);c.rotate(rot||0);C(c,0,0,r);fs(c,col,3);
  c.save();C(c,0,0,r);c.clip();c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=r*.09;
  for(let i=-3;i<=3;i++){c.beginPath();c.ellipse(i*r*.22,0,r*.35,r*1.1,.5,0,TAU);c.stroke();}
  c.strokeStyle='rgba(59,42,53,.25)';for(let i=-2;i<=2;i++){c.beginPath();c.ellipse(0,i*r*.3,r*1.1,r*.3,-.3,0,TAU);c.stroke();}
  c.restore();c.restore();}
function uovo(c,x,y,s,glow){c.save();c.translate(x,y);c.scale(s||1,s||1);
  if(glow){c.save();c.shadowColor='#ffd23d';c.shadowBlur=18;E(c,0,0,13,16);c.fillStyle='#ffe98a';c.fill();c.restore();}
  E(c,0,0,12,15);fs(c,glow?'#fff4c2':'#fff8ec',2.4);E(c,-4,-6,3,4,-.4);c.fillStyle='rgba(255,255,255,.9)';c.fill();c.restore();}
function cesto(c,x,y,w,front){
  const h=w*.45;
  if(!front){c.beginPath();c.arc(x,y-h*.2,w*.5,Math.PI,0);c.strokeStyle=OL;c.lineWidth=7;c.stroke();c.strokeStyle='#c98b55';c.lineWidth=4;c.stroke();E(c,x,y-h*.2,w*.5,h*.22);c.fillStyle='#7a4e2c';c.fill();return;}
  c.beginPath();c.moveTo(x-w*.5,y-h*.2);c.lineTo(x-w*.4,y+h*.6);c.lineTo(x+w*.4,y+h*.6);c.lineTo(x+w*.5,y-h*.2);c.closePath();fs(c,'#c98b55');
  c.strokeStyle='#a86d3c';c.lineWidth=2.5;for(let i=1;i<4;i++){const yy=y-h*.2+i*h*.2;c.beginPath();c.moveTo(x-w*.48+i*2,yy);c.lineTo(x+w*.48-i*2,yy);c.stroke();}
  E(c,x,y-h*.2,w*.5,h*.22);c.lineWidth=3;c.strokeStyle=OL;c.stroke();}
