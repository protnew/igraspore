/* bioicons render mode - procedural scientific cell illustrations */
(function(){
'use strict';

var bioReady = true; // procedural mode — always ready

function drawCoccus(ctx,sz,col){
  var r=sz*0.5;
  var g=ctx.createRadialGradient(-r*0.3,-r*0.3,0,0,0,r);
  g.addColorStop(0,lighten(col,0.4));g.addColorStop(0.6,col);g.addColorStop(1,darken(col,0.3));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=darken(col,0.4);ctx.lineWidth=Math.max(0.8,sz*0.04);ctx.stroke();
  ctx.fillStyle=darken(col,0.2);ctx.globalAlpha=0.4;
  ctx.beginPath();ctx.arc(r*0.15,r*0.1,r*0.25,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
}
function drawRod(ctx,sz,col){
  var L=sz*0.8,W=sz*0.35,R=W;
  var g=ctx.createLinearGradient(-L,-W,L,W);
  g.addColorStop(0,lighten(col,0.3));g.addColorStop(0.5,col);g.addColorStop(1,darken(col,0.3));
  ctx.fillStyle=g;ctx.beginPath();
  ctx.moveTo(-L+R,-W);ctx.lineTo(L-R,-W);ctx.arc(L-R,0,R,-Math.PI/2,Math.PI/2);
  ctx.lineTo(-L+R,W);ctx.arc(-L+R,0,R,Math.PI/2,-Math.PI/2);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=darken(col,0.4);ctx.lineWidth=Math.max(0.8,sz*0.04);ctx.stroke();
  ctx.fillStyle=darken(col,0.2);ctx.globalAlpha=0.4;
  ctx.beginPath();ctx.arc(L*0.2,0,W*0.3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
}
function drawSpiral(ctx,sz,col){
  var L=sz*0.9;
  ctx.lineCap='round';
  ctx.beginPath();
  for(var i=0;i<=12;i++){var t=i/12,x=-L+2*L*t,y=Math.sin(t*Math.PI*3)*sz*0.2;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle=darken(col,0.3);ctx.lineWidth=Math.max(2,sz*0.15);ctx.stroke();
  ctx.strokeStyle=lighten(col,0.2);ctx.lineWidth=Math.max(1,sz*0.06);ctx.stroke();
}
function drawFilament(ctx,sz,col){
  var L=sz*1.2;ctx.lineCap='round';ctx.beginPath();
  for(var i=0;i<=20;i++){var t=i/20,x=-L+2*L*t,y=Math.sin(t*Math.PI*4)*sz*0.08;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle=darken(col,0.3);ctx.lineWidth=Math.max(2.5,sz*0.2);ctx.stroke();
  ctx.strokeStyle=lighten(col,0.3);ctx.lineWidth=Math.max(1,sz*0.08);ctx.stroke();
  ctx.strokeStyle=darken(col,0.5);ctx.lineWidth=1;
  for(var s=1;s<=3;s++){var sx=-L+2*L*(s/4);ctx.beginPath();ctx.moveTo(sx,-sz*0.18);ctx.lineTo(sx,sz*0.18);ctx.stroke();}
}
function drawComma(ctx,sz,col){
  var r=sz*0.45;
  var g=ctx.createRadialGradient(-r*0.2,-r*0.2,0,0,0,r);
  g.addColorStop(0,lighten(col,0.3));g.addColorStop(1,darken(col,0.3));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,Math.PI*0.3,Math.PI*1.7);
  ctx.quadraticCurveTo(-r*0.8,r*0.3,0,r*0.1);ctx.closePath();ctx.fill();
  ctx.strokeStyle=darken(col,0.4);ctx.lineWidth=Math.max(0.8,sz*0.04);ctx.stroke();
}
function drawColony(ctx,sz,col){
  var beadR=sz*0.25;
  for(var i=0;i<5;i++){
    var cx=-sz*0.6+(i*sz*0.3),cy=Math.sin(i*0.7)*sz*0.1;
    var g=ctx.createRadialGradient(cx-beadR*0.3,cy-beadR*0.3,0,cx,cy,beadR);
    g.addColorStop(0,lighten(col,0.3));g.addColorStop(1,darken(col,0.3));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,beadR,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=darken(col,0.4);ctx.lineWidth=0.8;ctx.stroke();
  }
}
function drawBell(ctx,sz,col){
  var r=sz*0.5;
  var g=ctx.createRadialGradient(-r*0.2,-r*0.3,0,0,0,r);
  g.addColorStop(0,lighten(col,0.4));g.addColorStop(0.6,col);g.addColorStop(1,darken(col,0.3));
  ctx.fillStyle=g;ctx.beginPath();
  ctx.moveTo(0,-r);
  ctx.bezierCurveTo(r*0.8,-r*0.8,r,-r*0.2,r*0.7,r*0.5);
  ctx.bezierCurveTo(r*0.4,r,-r*0.4,r,-r*0.7,r*0.5);
  ctx.bezierCurveTo(-r,-r*0.2,-r*0.8,-r*0.8,0,-r);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=darken(col,0.4);ctx.lineWidth=Math.max(0.8,sz*0.04);ctx.stroke();
  ctx.strokeStyle=darken(col,0.5);ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(r*0.3,r*0.2,r*0.25,-0.5,1.5);ctx.stroke();
}
function drawOval(ctx,sz,col){
  var rx=sz*0.45,ry=sz*0.5;
  var g=ctx.createRadialGradient(-rx*0.3,-ry*0.3,0,0,0,Math.max(rx,ry));
  g.addColorStop(0,lighten(col,0.4));g.addColorStop(0.6,col);g.addColorStop(1,darken(col,0.3));
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=darken(col,0.4);ctx.lineWidth=Math.max(0.8,sz*0.04);ctx.stroke();
  ctx.fillStyle=darken(col,0.2);ctx.globalAlpha=0.4;
  ctx.beginPath();ctx.arc(rx*0.4,-ry*0.3,rx*0.15,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
}
function lighten(hex,a){var c=ph(hex);return rs(Math.min(255,c.r+(255-c.r)*a),Math.min(255,c.g+(255-c.g)*a),Math.min(255,c.b+(255-c.b)*a));}
function darken(hex,a){var c=ph(hex);return rs(c.r*(1-a),c.g*(1-a),c.b*(1-a));}
function ph(s){if(!s||!s.startsWith('#'))return{r:120,g:180,b:80};var h=s.slice(1);if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)};}
function rs(r,g,b){return 'rgb('+Math.round(Math.max(0,Math.min(255,r)))+','+Math.round(Math.max(0,Math.min(255,g)))+','+Math.round(Math.max(0,Math.min(255,b)))+')';}

var SF={'circle':drawCoccus,'rod':drawRod,'spiral':drawSpiral,'filament':drawFilament,'comma':drawComma,'colony':drawColony,'bell':drawBell,'oval':drawOval,'irregular':drawOval,'star':drawColony};

window.loadBioicons=function(){};
window.bioiconsReady=function(){return bioReady;};

window.drawBioicon=function(ctx,o,sz,sh){
  var col=(o.sp&&o.sp.color)?o.sp.color:'#80c060';
  if(!col||(!col.startsWith('#')&&col.indexOf('rgb')<0))col='#80c060';
  if(col.indexOf('rgb')>=0){var m=col.match(/(\d+)/g);if(m&&m.length>=3)col='#'+(+m[0]).toString(16).padStart(2,'0')+(+m[1]).toString(16).padStart(2,'0')+(+m[2]).toString(16).padStart(2,'0');}
  var drawSz=Math.max(2.2,Math.min(18,sz*1.15));
  var fn=SF[sh]||drawCoccus;
  ctx.save();ctx.translate(o.x,o.y);
  var ang=(typeof o.facing==='number'&&isFinite(o.facing))?o.facing:(typeof o.angle==='number'&&isFinite(o.angle))?o.angle:0;
  if(sh==='rod'||sh==='spiral'||sh==='filament'||sh==='comma')ctx.rotate(ang);
  fn(ctx,drawSz,col);
  ctx.restore();
  if(o.infectionT>0){ctx.save();ctx.strokeStyle='rgba(255,40,40,0.7)';ctx.lineWidth=1.5;ctx.setLineDash([3,2]);ctx.beginPath();ctx.arc(o.x,o.y,drawSz*0.6+2,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
  return true;
};

window.drawVirusBioicon=function(ctx,v){
  var ds=18;ctx.save();ctx.translate(v.x,v.y);ctx.rotate(v.angle||0);
  ctx.fillStyle='rgba(255,60,60,0.15)';ctx.beginPath();ctx.arc(0,0,ds*0.8,0,Math.PI*2);ctx.fill();
  var g=ctx.createRadialGradient(-2,-2,0,0,0,ds*0.35);
  g.addColorStop(0,'#ffccc0');g.addColorStop(0.5,'#f44');g.addColorStop(1,'#a00');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,ds*0.35,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#600';ctx.lineWidth=1;ctx.stroke();
  ctx.strokeStyle='#c33';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,ds*0.35);ctx.lineTo(0,ds*0.7);ctx.stroke();
  ctx.restore();return true;
};

})();
