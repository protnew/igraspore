/* bioicons render mode v2 — phase-contrast microscopy cell rendering */
(function(){
'use strict';
window._bioDebug = 'IIFE_RAN';
var bioReady = true;

/* ── helpers ── */
function hx(s){
  if(!s) return {r:120,g:180,b:80};
  if(s[0]==='#'){var h=s.slice(1);if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)};}
  var m=s.match(/(\d+)/g);if(m&&m.length>=3)return{r:+m[0],g:+m[1],b:+m[2]};
  return{r:120,g:180,b:80};
}
function L(c,a){return 'rgba('+Math.min(255,c.r+(255-c.r)*a|0)+','+Math.min(255,c.g+(255-c.g)*a|0)+','+Math.min(255,c.b+(255-c.b)*a|0)+',1)';}
function D(c,a){return 'rgba('+(c.r*(1-a)|0)+','+(c.g*(1-a)|0)+','+(c.b*(1-a)|0)+',1)';}

/* ── Phase halo: bright ring around every cell (phase contrast signature) ── */
function halo(ctx,r){
  var g=ctx.createRadialGradient(0,0,r*0.85,0,0,r*1.3);
  g.addColorStop(0,'rgba(255,250,240,0)');
  g.addColorStop(0.4,'rgba(255,250,240,0.18)');
  g.addColorStop(1,'rgba(255,250,240,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*1.3,0,Math.PI*2);ctx.fill();
}

/* ── Granules: small refractive dots inside cytoplasm ── */
function granules(ctx,sz,col,n,seed){
  ctx.save();ctx.fillStyle=L(col,0.35);
  var rng=seed||1;
  for(var i=0;i<n;i++){
    rng=(rng*9301+49297)%233280;var a=rng/233280*Math.PI*2;
    rng=(rng*9301+49297)%233280;var rr=rng/233280*sz*0.35;
    var px=Math.cos(a)*rr,py=Math.sin(a)*rr;
    var gr=ctx.createRadialGradient(px,py,0,px,py,sz*0.08);
    gr.addColorStop(0,L(col,0.6));gr.addColorStop(1,L(col,0));
    ctx.fillStyle=gr;
    ctx.beginPath();ctx.arc(px,py,sz*0.08,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

/* ── 1. COCCUS — sphere with halo, nucleoid, granules ── */
function drawCoccus(ctx,sz,col){
  var r=sz*0.42,c=hx(col);
  halo(ctx,r);
  /* cytoplasm: phase gradient (bright center → dark rim) */
  var g=ctx.createRadialGradient(-r*0.2,-r*0.2,r*0.1,0,0,r);
  g.addColorStop(0,L(c,0.5));g.addColorStop(0.5,col);g.addColorStop(0.85,D(c,0.2));g.addColorStop(1,D(c,0.5));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
  /* membrane ring */
  ctx.strokeStyle=D(c,0.5);ctx.lineWidth=Math.max(0.8,r*0.05);ctx.stroke();
  /* nucleoid (irregular dense region) */
  ctx.save();ctx.globalAlpha=0.5;ctx.fillStyle=D(c,0.35);
  ctx.beginPath();ctx.ellipse(r*0.1,r*0.05,r*0.25,r*0.18,0.3,0,Math.PI*2);ctx.fill();ctx.restore();
  /* granules */
  granules(ctx,r*2,c,4,Math.floor(sz*7));
  /* specular highlight */
  ctx.fillStyle='rgba(255,255,250,0.35)';
  ctx.beginPath();ctx.ellipse(-r*0.35,-r*0.35,r*0.18,r*0.12,-0.4,0,Math.PI*2);ctx.fill();
}

/* ── 2. ROD — bacillus with polar granules, septation line ── */
function drawRod(ctx,sz,col){
  var L2=sz*0.72,W=sz*0.3,R=W,c=hx(col);
  halo(ctx,Math.max(L2,W));
  /* body capsule */
  var g=ctx.createLinearGradient(0,-W,0,W);
  g.addColorStop(0,L(c,0.4));g.addColorStop(0.5,col);g.addColorStop(1,D(c,0.35));
  ctx.fillStyle=g;ctx.beginPath();
  ctx.moveTo(-L2+R,-W);ctx.lineTo(L2-R,-W);ctx.arc(L2-R,0,R,-Math.PI/2,Math.PI/2);
  ctx.lineTo(-L2+R,W);ctx.arc(-L2+R,0,R,Math.PI/2,-Math.PI/2);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=D(c,0.45);ctx.lineWidth=Math.max(0.8,W*0.08);ctx.stroke();
  /* septation (division plane) */
  ctx.strokeStyle=D(c,0.3);ctx.lineWidth=1;ctx.globalAlpha=0.4;
  ctx.beginPath();ctx.moveTo(0,-W*0.85);ctx.lineTo(0,W*0.85);ctx.stroke();ctx.globalAlpha=1;
  /* polar granules */
  granules(ctx,W*2,c,3,Math.floor(sz*5));
  /* specular */
  ctx.fillStyle='rgba(255,255,250,0.2)';
  ctx.beginPath();ctx.ellipse(-L2*0.3,-W*0.4,W*0.3,W*0.12,0,0,Math.PI*2);ctx.fill();
}

/* ── 3. SPIRAL — thick sinusoidal body with visible coils ── */
function drawSpiral(ctx,sz,col){
  var L2=sz*0.85,c=hx(col);
  halo(ctx,sz*0.5);
  /* main wave body — dark core */
  ctx.lineCap='round';
  ctx.beginPath();
  var steps=24;
  for(var i=0;i<=steps;i++){var t=i/steps,x=-L2+2*L2*t,y=Math.sin(t*Math.PI*3.5)*sz*0.22;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle=D(c,0.35);ctx.lineWidth=Math.max(3,sz*0.22);ctx.stroke();
  /* bright overlay (phase contrast) */
  ctx.strokeStyle=col;ctx.lineWidth=Math.max(1.5,sz*0.1);ctx.stroke();
  /* thin inner highlight */
  ctx.strokeStyle=L(c,0.4);ctx.lineWidth=Math.max(0.8,sz*0.04);ctx.stroke();
  /* cross-bands at coil peaks */
  ctx.strokeStyle=D(c,0.25);ctx.lineWidth=1;ctx.globalAlpha=0.4;
  for(var s=0;s<7;s++){var t2=(s+0.5)/7,x2=-L2+2*L2*t2,y2=Math.sin(t2*Math.PI*3.5)*sz*0.22;
    ctx.beginPath();ctx.moveTo(x2-sz*0.08,y2);ctx.lineTo(x2+sz*0.08,y2);ctx.stroke();}
  ctx.globalAlpha=1;
}

/* ── 4. FILAMENT — chain of cells with septa and sheath ── */
function drawFilament(ctx,sz,col){
  var L2=sz*1.1,W=sz*0.22,c=hx(col);
  halo(ctx,sz*0.4);
  /* outer sheath */
  ctx.strokeStyle=D(c,0.2);ctx.lineWidth=W*2.8;ctx.lineCap='round';ctx.globalAlpha=0.3;
  ctx.beginPath();
  for(var i=0;i<=20;i++){var t=i/20,x=-L2+2*L2*t,y=Math.sin(t*Math.PI*4)*sz*0.06;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.stroke();ctx.globalAlpha=1;
  /* cell chain (bright core) */
  ctx.strokeStyle=col;ctx.lineWidth=W*1.6;
  ctx.beginPath();
  for(var i=0;i<=20;i++){var t=i/20,x=-L2+2*L2*t,y=Math.sin(t*Math.PI*4)*sz*0.06;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.stroke();
  /* septa (cell walls between segments) */
  ctx.strokeStyle=D(c,0.5);ctx.lineWidth=1;
  for(var s=1;s<=4;s++){var t2=s/5,x2=-L2+2*L2*t2,y2=Math.sin(t2*Math.PI*4)*sz*0.06;
    ctx.beginPath();ctx.moveTo(x2,y2-W);ctx.lineTo(x2,y2+W);ctx.stroke();}
  /* heterocyst (specialized nitrogen-fixing cell) */
  ctx.fillStyle=D(c,0.3);
  ctx.beginPath();ctx.arc(-L2*0.6,Math.sin(0.2*Math.PI*4)*sz*0.06,W*1.3,0,Math.PI*2);ctx.fill();
}

/* ── 5. COMMA — vibrio crescent with polar flagellum ── */
function drawComma(ctx,sz,col){
  var r=sz*0.42,c=hx(col);
  halo(ctx,r);
  /* crescent body */
  var g=ctx.createRadialGradient(-r*0.15,-r*0.15,0,0,0,r);
  g.addColorStop(0,L(c,0.5));g.addColorStop(0.5,col);g.addColorStop(1,D(c,0.4));
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,0,r,0.4,Math.PI*1.6);
  ctx.quadraticCurveTo(-r*0.4,r*0.6,0,r*0.1);ctx.closePath();ctx.fill();
  ctx.strokeStyle=D(c,0.5);ctx.lineWidth=Math.max(0.8,r*0.06);ctx.stroke();
  /* flagellum tail */
  ctx.strokeStyle=L(c,0.3);ctx.lineWidth=1.5;ctx.globalAlpha=0.7;
  ctx.beginPath();ctx.moveTo(r*0.7,-r*0.4);
  ctx.quadraticCurveTo(r*1.5,-r*0.8,r*1.8,-r*0.2);
  ctx.stroke();ctx.globalAlpha=1;
  granules(ctx,r*1.5,c,2,sz*3);
}

/* ── 6. COLONY — cluster of cocci in gelatinous matrix ── */
function drawColony(ctx,sz,col){
  var beadR=sz*0.18,c=hx(col);
  /* gelatinous sheath */
  ctx.fillStyle='rgba(255,255,240,0.08)';
  ctx.beginPath();ctx.arc(0,0,sz*0.6,0,Math.PI*2);ctx.fill();
  /* beads */
  var pos=[[-0.25,-0.15],[0.2,-0.2],[0,0.15],[-0.3,0.25],[0.3,0.1],[0.15,0.35],[-0.1,-0.4]];
  for(var i=0;i<pos.length;i++){
    var bx=pos[i][0]*sz,by=pos[i][1]*sz;
    halo(ctx,beadR);
    var g=ctx.createRadialGradient(bx-beadR*0.3,by-beadR*0.3,0,bx,by,beadR);
    g.addColorStop(0,L(c,0.4));g.addColorStop(0.7,col);g.addColorStop(1,D(c,0.3));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(bx,by,beadR,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=D(c,0.4);ctx.lineWidth=0.8;ctx.stroke();
  }
}

/* ── 7. BELL — ciliate with oral groove, macronucleus, cilia ── */
function drawBell(ctx,sz,col){
  var r=sz*0.48,c=hx(col);
  halo(ctx,r);
  /* body — pitcher/bell shape */
  var g=ctx.createRadialGradient(-r*0.15,-r*0.25,0,0,0,r*1.1);
  g.addColorStop(0,L(c,0.45));g.addColorStop(0.5,col);g.addColorStop(1,D(c,0.35));
  ctx.fillStyle=g;
  ctx.beginPath();
  ctx.moveTo(0,-r*0.9);
  ctx.bezierCurveTo(r*0.7,-r*0.8,r*0.95,-r*0.1,r*0.65,r*0.55);
  ctx.bezierCurveTo(r*0.3,r*0.95,-r*0.3,r*0.95,-r*0.65,r*0.55);
  ctx.bezierCurveTo(-r*0.95,-r*0.1,-r*0.7,-r*0.8,0,-r*0.9);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=D(c,0.45);ctx.lineWidth=Math.max(0.8,r*0.05);ctx.stroke();
  /* macronucleus (C-shaped or ovoid, denser) */
  ctx.save();ctx.globalAlpha=0.4;ctx.fillStyle=D(c,0.3);
  ctx.beginPath();ctx.ellipse(-r*0.05,r*0.05,r*0.28,r*0.14,0.2,0,Math.PI*2);ctx.fill();ctx.restore();
  /* contractile vacuole */
  ctx.save();ctx.globalAlpha=0.3;ctx.fillStyle='rgba(200,230,255,0.5)';
  ctx.beginPath();ctx.arc(-r*0.35,-r*0.1,r*0.12,0,Math.PI*2);ctx.fill();ctx.restore();
  /* oral groove */
  ctx.strokeStyle=D(c,0.4);ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(r*0.3,r*0.15,r*0.2,-0.8,1.2);ctx.stroke();
  /* cilia ring */
  ctx.strokeStyle=L(c,0.25);ctx.lineWidth=1;ctx.globalAlpha=0.5;
  for(var a=0;a<Math.PI*2;a+=Math.PI/10){
    var cx2=Math.cos(a)*r*0.92,cy2=Math.sin(a)*r*0.92;
    var ex=cx2+Math.cos(a)*sz*0.08,ey=cy2+Math.sin(a)*sz*0.08;
    ctx.beginPath();ctx.moveTo(cx2,cy2);ctx.lineTo(ex,ey);ctx.stroke();
  }
  ctx.globalAlpha=1;
  /* food vacuoles */
  granules(ctx,r*1.5,c,3,sz*4);
}

/* ── 8. OVAL — yeast/fungal cell with bud scar and vacuole ── */
function drawOval(ctx,sz,col){
  var rx=sz*0.4,ry=sz*0.46,c=hx(col);
  halo(ctx,Math.max(rx,ry));
  var g=ctx.createRadialGradient(-rx*0.25,-ry*0.25,0,0,0,Math.max(rx,ry));
  g.addColorStop(0,L(c,0.45));g.addColorStop(0.5,col);g.addColorStop(1,D(c,0.35));
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=D(c,0.45);ctx.lineWidth=Math.max(0.8,sz*0.04);ctx.stroke();
  /* large central vacuole */
  ctx.save();ctx.globalAlpha=0.3;ctx.fillStyle='rgba(220,240,255,0.5)';
  ctx.beginPath();ctx.ellipse(-rx*0.05,ry*0.1,rx*0.3,ry*0.25,0,0,Math.PI*2);ctx.fill();ctx.restore();
  /* nucleus */
  ctx.save();ctx.globalAlpha=0.4;ctx.fillStyle=D(c,0.25);
  ctx.beginPath();ctx.arc(rx*0.15,0,rx*0.18,0,Math.PI*2);ctx.fill();ctx.restore();
  /* bud scar */
  ctx.strokeStyle=D(c,0.3);ctx.lineWidth=1.5;ctx.globalAlpha=0.5;
  ctx.beginPath();ctx.arc(rx*0.5,-ry*0.4,sz*0.08,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
  granules(ctx,Math.max(rx,ry)*1.5,c,3,sz*6);
}

/* ── slipper (Paramecium) — elongated slipper with cilia ── */
function drawSlipper(ctx,sz,col){
  var L2=sz*0.7,W=sz*0.28,c=hx(col);
  halo(ctx,Math.max(L2,W));
  var g=ctx.createLinearGradient(0,-W,0,W);
  g.addColorStop(0,L(c,0.4));g.addColorStop(0.5,col);g.addColorStop(1,D(c,0.35));
  ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(0,0,L2,W,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=D(c,0.4);ctx.lineWidth=Math.max(0.8,W*0.08);ctx.stroke();
  /* oral groove */
  ctx.strokeStyle=D(c,0.35);ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(-L2*0.3,-W*0.5);
  ctx.quadraticCurveTo(-L2*0.1,W*0.3,L2*0.3,W*0.2);ctx.stroke();
  /* macronucleus */
  ctx.save();ctx.globalAlpha=0.4;ctx.fillStyle=D(c,0.3);
  ctx.beginPath();ctx.ellipse(L2*0.1,0,W*0.4,W*0.2,0,0,Math.PI*2);ctx.fill();ctx.restore();
  /* cilia */
  ctx.strokeStyle=L(c,0.2);ctx.lineWidth=1;ctx.globalAlpha=0.4;
  for(var a=0;a<Math.PI*2;a+=Math.PI/12){
    var cx2=Math.cos(a)*L2,cy2=Math.sin(a)*W;
    ctx.beginPath();ctx.moveTo(cx2,cy2);
    ctx.lineTo(cx2+Math.cos(a)*sz*0.06,cy2+Math.sin(a)*sz*0.06);ctx.stroke();}
  ctx.globalAlpha=1;
  granules(ctx,W*2,c,4,sz*8);
}

/* ── irregular (amoeboid) — blobby shape with pseudopods ── */
function drawIrregular(ctx,sz,col){
  var r=sz*0.4,c=hx(col);
  halo(ctx,r);
  var g=ctx.createRadialGradient(-r*0.2,-r*0.2,0,0,0,r*1.2);
  g.addColorStop(0,L(c,0.4));g.addColorStop(0.5,col);g.addColorStop(1,D(c,0.3));
  ctx.fillStyle=g;
  ctx.beginPath();
  var pts=8;
  for(var i=0;i<=pts;i++){
    var a=i/pts*Math.PI*2;
    var rr=r*(0.7+0.4*Math.sin(a*3+sz*0.1));
    var x=Math.cos(a)*rr,y=Math.sin(a)*rr;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=D(c,0.35);ctx.lineWidth=Math.max(0.8,r*0.05);ctx.stroke();
  granules(ctx,r*1.5,c,5,sz*9);
}

/* ── star (stellate) — radiating arms ── */
function drawStar(ctx,sz,col){
  var r=sz*0.45,c=hx(col);
  halo(ctx,r);
  var g=ctx.createRadialGradient(0,0,0,0,0,r);
  g.addColorStop(0,L(c,0.4));g.addColorStop(1,D(c,0.3));
  ctx.fillStyle=g;ctx.beginPath();
  var arms=5;
  for(var i=0;i<arms*2;i++){
    var a=i/(arms*2)*Math.PI*2;
    var rr=(i%2===0)?r:r*0.4;
    var x=Math.cos(a)*rr,y=Math.sin(a)*rr;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.closePath();ctx.fill();
  ctx.strokeStyle=D(c,0.4);ctx.lineWidth=1;ctx.stroke();
  granules(ctx,r*1.2,c,3,sz*4);
}

/* ── shape → draw function ── */
var SF={
  'circle':drawCoccus,'rod':drawRod,'spiral':drawSpiral,'filament':drawFilament,
  'comma':drawComma,'colony':drawColony,'bell':drawBell,'oval':drawOval,
  'slipper':drawSlipper,'irregular':drawIrregular,'star':drawStar,
};

window.loadBioicons=function(){};
window.bioiconsReady=function(){return bioReady;};

window.drawBioicon=function(ctx,o,sz,sh){
  var col=(o.sp&&o.sp.color)?o.sp.color:'#80c060';
  if(!col||(!col.startsWith('#')&&col.indexOf('rgb')<0&&col.indexOf('rgba')<0))col='#80c060';
  if(col.indexOf('rgb')>=0){var m=col.match(/(\d+)/g);if(m&&m.length>=3){
    var hr=(+m[0]).toString(16);if(hr.length<2)hr='0'+hr;
    var hg=(+m[1]).toString(16);if(hg.length<2)hg='0'+hg;
    var hb=(+m[2]).toString(16);if(hb.length<2)hb='0'+hb;
    col='#'+hr+hg+hb;}}
  var drawSz=Math.max(2.2,Math.min(18,sz*1.15));
  var fn=SF[sh]||drawCoccus;
  ctx.save();ctx.translate(o.x,o.y);
  var ang=(typeof o.facing==='number'&&isFinite(o.facing))?o.facing:(typeof o.angle==='number'&&isFinite(o.angle))?o.angle:0;
  if(sh==='rod'||sh==='spiral'||sh==='filament'||sh==='comma'||sh==='slipper')ctx.rotate(ang);
  fn(ctx,drawSz,col);
  ctx.restore();
  /* infection ring */
  if(o.infectionT>0){
    ctx.save();ctx.strokeStyle='rgba(255,40,40,0.6)';ctx.lineWidth=2;
    ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.arc(o.x,o.y,drawSz*0.7,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);ctx.restore();
  }
  /* division glow */
  if(o.dividing){
    ctx.save();ctx.strokeStyle='rgba(100,255,100,0.5)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(o.x,o.y,drawSz*0.6,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  return true;
};

window.drawVirusBioicon=function(ctx,v){
  var ds=20;ctx.save();ctx.translate(v.x,v.y);ctx.rotate(v.angle||0);
  /* outer glow */
  ctx.fillStyle='rgba(255,60,60,0.12)';ctx.beginPath();ctx.arc(0,0,ds*0.8,0,Math.PI*2);ctx.fill();
  /* icosahedral head with phase halo */
  halo(ctx,ds*0.4);
  var g=ctx.createRadialGradient(-ds*0.1,-ds*0.1,0,0,0,ds*0.35);
  g.addColorStop(0,'#ffddd0');g.addColorStop(0.5,'#e44');g.addColorStop(1,'#800');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,0,ds*0.35,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#600';ctx.lineWidth=1;ctx.stroke();
  /* collar */
  ctx.fillStyle='#c33';ctx.beginPath();ctx.ellipse(0,ds*0.38,ds*0.12,ds*0.04,0,0,Math.PI*2);ctx.fill();
  /* tail sheath */
  ctx.strokeStyle='#b22';ctx.lineWidth=ds*0.1;
  ctx.beginPath();ctx.moveTo(0,ds*0.4);ctx.lineTo(0,ds*0.72);ctx.stroke();
  /* base plate */
  ctx.fillStyle='#900';ctx.beginPath();ctx.ellipse(0,ds*0.72,ds*0.1,ds*0.04,0,0,Math.PI*2);ctx.fill();
  /* tail fibers */
  ctx.strokeStyle='#a33';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(-ds*0.03,ds*0.72);ctx.lineTo(-ds*0.2,ds*0.88);
  ctx.moveTo(ds*0.03,ds*0.72);ctx.lineTo(ds*0.2,ds*0.88);
  ctx.moveTo(0,ds*0.74);ctx.lineTo(0,ds*0.92);ctx.stroke();
  ctx.restore();return true;
};

})();
