"use strict";

function drawBody(o,sz,fc2,fd, batched){
  var sh=o.sp.shape;
  if(!batched){
    var cyto=ctx.createRadialGradient(-sz*0.25,-sz*0.25,0,0,0,sz*1.1);
    cyto.addColorStop(0,fc2);
    cyto.addColorStop(0.7,fc2);
    cyto.addColorStop(1,fd);
    ctx.fillStyle=cyto;ctx.strokeStyle=fd;ctx.lineWidth=Math.max(1,sz*0.08);ctx.beginPath();
  }
  if(sh==='circle'){
      var vmag = Math.sqrt(o.vx*o.vx + o.vy*o.vy);
      var stretch = Math.min(1.4, 1.0 + vmag * 0.08);
      var squish = Math.max(0.7, 1.0 - vmag * 0.04);
      for(var i=0; i<=24; i++) {
          var a = (i/24) * Math.PI * 2;
          var r = sz + Math.sin(a * 6 - o.pulse * 2) * (vmag * 0.3);
          var x = Math.cos(a) * r * stretch;
          var y = Math.sin(a) * r * squish;
          if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
  }
  else if(sh==='rod'){if(batched)ctx.moveTo(sz*1.3,0);ctx.ellipse(0,0,sz*1.3,sz*0.6,0,0,Math.PI*2);}
  else if(sh==='spiral'){for(var i=0;i<=30;i++){var t=i/30*Math.PI*3,r=sz*0.8;var px=Math.cos(t)*r*(1-t/12),py=Math.sin(t)*r*(1-t/12);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}}
  else if(sh==='filament'){if(batched)ctx.moveTo(sz*2,0);ctx.ellipse(0,0,sz*2,sz*0.3,0,0,Math.PI*2);}
  else if(sh==='colony'){if(batched)ctx.moveTo(sz,0);ctx.arc(0,0,sz,0,Math.PI*2);
    if(!batched){ctx.fill();ctx.stroke();ctx.fillStyle='rgba(100,200,100,0.5)';
    for(var i=0;i<8;i++){var a=i/8*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(a)*sz*0.7,Math.sin(a)*sz*0.7,sz*0.15,0,Math.PI*2);ctx.fill();}return;}
  }
  else if(sh==='star'){var pts=12;for(var i=0;i<=pts*2;i++){var a=i/(pts*2)*Math.PI*2,r=i%2===0?sz*1.3:sz*0.6;if(i===0)ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}}
  else if(sh==='slipper'){ctx.moveTo(sz,0);ctx.bezierCurveTo(sz,-sz*0.65,-sz*0.8,-sz*0.65,-sz,0);ctx.bezierCurveTo(-sz*0.8,sz*0.65,sz,sz*0.65,sz,0);}
  else if(sh==='bell'){ctx.moveTo(0,-sz);ctx.bezierCurveTo(sz*0.8,-sz*0.9,sz*0.9,sz*0.3,0,sz*0.5);ctx.bezierCurveTo(-sz*0.9,sz*0.3,-sz*0.8,-sz*0.9,0,-sz);}
  else if(sh==='oval'){if(batched)ctx.moveTo(sz*1.1,0);ctx.ellipse(0,0,sz*1.1,sz*0.7,0,0,Math.PI*2);}
  else if(sh==='irregular'){var lobes=5+Math.floor(o.wobble)%3;
    for(var i=0;i<=40;i++){var a=i/40*Math.PI*2;var r=sz+Math.sin(a*lobes+o.wobble)*sz*0.25+Math.sin(a*3+o.pulse)*sz*0.1;if(i===0)ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}}
  else {if(batched)ctx.moveTo(sz,0);ctx.arc(0,0,sz,0,Math.PI*2);}
  
  if(!batched){
    ctx.fill();
    // Pellicle strips for ciliates
    if(o.sp.bio.pellicle&&zoom>5){ctx.strokeStyle='rgba(180,140,60,0.3)';ctx.lineWidth=1;
      for(var s=-sz*0.8;s<sz*0.8;s+=sz*0.15){ctx.beginPath();ctx.moveTo(s,-sz*0.5);ctx.lineTo(s,sz*0.5);ctx.stroke();}}
    if(o.sp.bio.wall)ctx.lineWidth=Math.max(2,sz*0.12);
    ctx.stroke();
    if(o.sp.biolum&&dayLight<0.35){ctx.shadowColor=o.sp.color;ctx.shadowBlur=sz*2;ctx.fillStyle='rgba(100,255,200,0.25)';ctx.beginPath();ctx.arc(0,0,sz*0.6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
  }
}

function renderOrg(o, skipBody){
  ctx.save();ctx.translate(o.x,o.y);
  
  // Bioluminescence at night for producers
  if(dayLight < 0.35 && o.sp.cat === 'producer' && o.alive) {
     ctx.shadowColor = o.sp.color;
     ctx.shadowBlur = 10 + Math.sin(fc*0.1 + o.pulse)*5;
  }
  
  var sz=o.size,rgb=hex2rgb(o.sp.color);
  var tint=o.energy<25?0.5:(o.energy>90?1.2:1);
  var bc=shadeRgb(rgb[0],rgb[1],rgb[2],tint),bd=shadeRgb(rgb[0],rgb[1],rgb[2],tint*0.5);
  if(o.dying)ctx.globalAlpha=clamp(1-o.deathT/1.2,0,1);
  if(o.cyst){ctx.fillStyle='rgba(180,160,80,0.35)';ctx.beginPath();ctx.arc(0,0,sz*1.4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(200,180,100,0.5)';ctx.lineWidth=2;ctx.stroke();}
  // Biofilm overlay
  if(o.inBiofilm){ctx.fillStyle=o.sp.color;ctx.globalAlpha=0.2;ctx.beginPath();ctx.arc(0,0,sz*1.8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1.0;}
  // Infected overlay
  if(o.infected){ctx.fillStyle='rgba(255,50,50,0.15)';ctx.beginPath();ctx.arc(0,0,sz*1.2,0,Math.PI*2);ctx.fill();}
  if(o.dividing){
    var dp=o.divT/1.3;
    ctx.save();ctx.translate(-sz*dp*0.3,0);
    if(!skipBody)drawBody(o,sz*(1-dp*0.15),bc,bd);
    drawOrgans(o,sz*(1-dp*0.15));ctx.restore();
    ctx.save();ctx.translate(sz*dp*0.3,0);
    if(!skipBody)drawBody(o,sz*(1-dp*0.15),bc,bd);
    drawOrgans(o,sz*(1-dp*0.15));ctx.restore();
    ctx.restore();return;}
  ctx.rotate(o.angle+Math.sin(o.wobble)*0.04);
  if(!skipBody)drawBody(o,sz,bc,bd);
  if(zoom>3)drawOrgans(o,sz);
  if(zoom>2)drawAppendages(o,sz);
  if(o.flash>0){ctx.globalAlpha=o.flash;ctx.fillStyle=o.flashColor;ctx.beginPath();ctx.arc(0,0,sz,0,Math.PI*2);ctx.fill();}
  if(o.isPlayer&&state==='playing'){ctx.globalAlpha=0.5+Math.sin(fc*0.1)*0.3;ctx.strokeStyle='#4ff';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,sz+4,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

function drawOrgans(o,sz){
  var org=o.organs;if(!org)return;
  var detail=zoom>6?2:(zoom>4?1:0);
  for(var i=0;i<org.length;i++){
    var g=org[i];ctx.save();
    if(g.t==='nuc'){
      // Nucleus with nuclear envelope (double membrane look)
      var ng = ctx.createRadialGradient(g.x-g.r*0.2, g.y-g.r*0.2, 0, g.x, g.y, g.r);
      ng.addColorStop(0, 'rgba(180,120,200,0.9)');
      ng.addColorStop(0.7, 'rgba(130,70,150,0.85)');
      ng.addColorStop(1, 'rgba(80,30,100,0.95)');
      ctx.fillStyle=ng;
      ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
      // Nuclear pores (dots on envelope)
      if(detail>=1){ctx.fillStyle='rgba(220,180,240,0.7)';
        for(var p=0;p<8;p++){var pa=p/8*Math.PI*2;ctx.beginPath();ctx.arc(g.x+Math.cos(pa)*g.r*0.9,g.y+Math.sin(pa)*g.r*0.9,g.r*0.06,0,Math.PI*2);ctx.fill();}}
      // Chromatin strands inside
      if(detail>=1){ctx.strokeStyle='rgba(210,150,230,0.6)';ctx.lineWidth=0.8;
        for(var s=0;s<6;s++){ctx.beginPath();var a=s/6*Math.PI*2;ctx.moveTo(g.x,g.y);ctx.quadraticCurveTo(g.x+Math.cos(a)*g.r*0.6,g.y+Math.sin(a)*g.r*0.6,g.x+Math.cos(a+1)*g.r*0.8,g.y+Math.sin(a+1)*g.r*0.8);ctx.stroke();}}
      // Nucleolus
      var ncg = ctx.createRadialGradient(g.x+g.r*0.1,g.y+g.r*0.1,0,g.x+g.r*0.2,g.y+g.r*0.1,g.r*0.4);
      ncg.addColorStop(0, 'rgba(230,150,230,1)'); ncg.addColorStop(1, 'rgba(150,50,150,0.9)');
      ctx.fillStyle=ncg;ctx.beginPath();ctx.arc(g.x+g.r*0.2,g.y+g.r*0.1,g.r*0.4,0,Math.PI*2);ctx.fill();
    }
    else if(g.t==='nuc2'){ctx.fillStyle=g.c;ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();}
    else if(g.t==='mac'){
      // Macronucleus — bean/elongated shape with chromatin
      ctx.fillStyle='rgba(160,80,160,0.8)';ctx.beginPath();ctx.ellipse(g.x,g.y,g.r,g.r*0.6,0,0,Math.PI*2);ctx.fill();
      if(detail>=1){ctx.fillStyle='rgba(190,110,190,0.4)';
        for(var m=0;m<5;m++){ctx.beginPath();ctx.arc(g.x+rng(-g.r*0.6,g.r*0.6),g.y+rng(-g.r*0.3,g.r*0.3),g.r*0.08,0,Math.PI*2);ctx.fill();}}
    }
    else if(g.t==='mic'){ctx.fillStyle=g.c;ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();}
    else if(g.t==='chl'||g.t==='plastid'){
      // Chloroplast — green disc with thylakoid stacks (grana)
      ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.rot+o.pulse*0.1);
      var cg=ctx.createRadialGradient(0,0,0,0,0,g.rx);
      cg.addColorStop(0,'#5fd45f');cg.addColorStop(0.7,'#2a8a2a');cg.addColorStop(1,'#1a5a1a');
      ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(0,0,g.rx,g.ry,0,0,Math.PI*2);ctx.fill();
      // Thylakoid stacks (grana — dark green dots)
      if(detail>=1){ctx.fillStyle='rgba(15,60,15,0.6)';
        for(var gr=0;gr<4;gr++){ctx.beginPath();ctx.ellipse(-g.rx*0.4+gr*g.rx*0.25,rng(-g.ry*0.3,g.ry*0.3),g.rx*0.12,g.ry*0.15,0,0,Math.PI*2);ctx.fill();}}
      ctx.strokeStyle='rgba(20,80,20,0.4)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(-g.rx*0.7,0);ctx.lineTo(g.rx*0.7,0);ctx.stroke();
      ctx.restore();
    }
    else if(g.t==='mito'){
      // Mitochondrion — red sausage with cristae (inner folds)
      ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.rot);
      var mg=ctx.createLinearGradient(0,-g.ry,0,g.ry);
      mg.addColorStop(0,'rgba(230,110,110,0.8)');mg.addColorStop(1,'rgba(180,50,50,0.8)');
      ctx.fillStyle=mg;ctx.beginPath();ctx.ellipse(0,0,g.rx,g.ry,0,0,Math.PI*2);ctx.fill();
      // Cristae — inner membrane folds
      if(detail>=1){ctx.strokeStyle='rgba(140,30,30,0.6)';ctx.lineWidth=0.5;
        for(var ci=0;ci<5;ci++){var cx2=-g.rx*0.7+ci*g.rx*0.3;ctx.beginPath();ctx.moveTo(cx2,-g.ry*0.5);ctx.quadraticCurveTo(cx2+g.rx*0.08,0,cx2,g.ry*0.5);ctx.stroke();}}
      ctx.strokeStyle='rgba(120,30,30,0.5)';ctx.lineWidth=0.5;ctx.beginPath();ctx.ellipse(0,0,g.rx,g.ry,0,0,Math.PI*2);ctx.stroke();
      ctx.restore();
    }
    else if(g.t==='golgi'){ctx.fillStyle=g.c;ctx.globalAlpha=0.4;ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();}
    else if(g.t==='golgiS'){ctx.fillStyle=g.c;ctx.globalAlpha=0.5;ctx.save();ctx.translate(g.x,g.y);ctx.beginPath();ctx.ellipse(0,0,g.rx,g.ry,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    else if(g.t==='er'){ctx.fillStyle=g.c;ctx.globalAlpha=0.3;ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.rot);ctx.beginPath();ctx.ellipse(0,0,g.rx,g.ry,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    else if(g.t==='vac'){ctx.fillStyle=g.c;ctx.globalAlpha=0.45;ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
      // Membrane outline
      ctx.strokeStyle='rgba(200,170,80,0.4)';ctx.lineWidth=0.5;ctx.stroke();}
        else if(g.t==='cv'){
      var pr=g.r+Math.sin(o.pulse*2)*g.r*0.3;
      ctx.fillStyle=g.c;ctx.globalAlpha=0.6;
      ctx.beginPath();
      for(var j=0;j<10;j++){
        var a=j/10*Math.PI*2; var rr=(j%2===0)?pr:pr*0.5;
        var vx=g.x+Math.cos(a)*rr, vy=g.y+Math.sin(a)*rr;
        if(j===0) ctx.moveTo(vx,vy); else ctx.lineTo(vx,vy);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(80,160,240,0.5)';ctx.lineWidth=0.5;ctx.stroke();
    }
    else if(g.t==='nucleoid'){
      ctx.strokeStyle='rgba(140,160,255,0.7)'; ctx.lineWidth=1; ctx.beginPath();
      for(var k=0;k<16;k++){
         var a=k/16*Math.PI*2; var rr=g.r*(0.5+Math.sin(k*134)*0.5);
         var px=g.x+Math.cos(a)*rr, py=g.y+Math.sin(a)*rr;
         if(k===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath(); ctx.stroke();
    }
    else if(g.t==='thylakoid'){
      ctx.strokeStyle='rgba(30,120,60,0.4)'; ctx.lineWidth=1;
      for(var k=1;k<=3;k++){
         ctx.beginPath(); ctx.arc(g.x, g.y, g.r*(k/3), 0, Math.PI*2); ctx.stroke();
      }
    }
    else if(g.t==='ribo'){ctx.fillStyle=g.c;ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();}
    else if(g.t==='trich'){ctx.fillStyle=g.c;ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.atan2(g.y,g.x));ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(sz*0.15,0);ctx.lineTo(0,sz*0.02);ctx.closePath();ctx.fill();ctx.restore();}
    else if(g.t==='oral'){ctx.fillStyle=g.c;ctx.globalAlpha=0.4;ctx.beginPath();ctx.ellipse(g.x,g.y,g.r,g.r*0.6,0,0,Math.PI*2);ctx.fill();}
    else if(g.t==='eye'){
      // Eyespot (stigma) — red/orange with photoreceptor
      ctx.fillStyle='#cc4400';ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ff7700';ctx.beginPath();ctx.arc(g.x-g.r*0.2,g.y-g.r*0.2,g.r*0.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ffaa00';ctx.beginPath();ctx.arc(g.x-g.r*0.3,g.y-g.r*0.3,g.r*0.25,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
}

function drawAppendages(o,sz){
  var b=o.sp.bio;ctx.save();ctx.strokeStyle='rgba(200,220,255,0.35)';ctx.lineWidth=Math.max(1,sz*0.05);
  if(b.flag){var fn=b.chain?3:1;
    for(var f=0;f<fn;f++){
      ctx.beginPath();
      var sx=-sz*0.9+(f-fn/2)*sz*0.15;
      ctx.moveTo(sx,0);
      var wLen = 15;
      for(var w=0;w<=wLen;w++){
        var t=w/wLen;
        var wx=sx-t*sz*1.8;
        var wy=Math.sin(o.flagPhase+w*0.8+f)*sz*(0.1+t*0.4); // Tapering wave
        ctx.lineTo(wx,wy);
      }
      ctx.lineWidth=Math.max(1, sz*0.08); // Thicker base
      ctx.strokeStyle='rgba(220,240,255,0.6)';
      ctx.stroke();
    }
  }
  if(b.cilia){var cn=10+Math.floor(sz/3);
    for(var c=0;c<cn;c++){var a=c/cn*Math.PI*2;var wave=Math.sin(o.cilPhase+c*0.5)*sz*0.15;var r1=sz*0.9,r2=sz*1.15+wave;
      ctx.beginPath();ctx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);ctx.stroke();}
    // Metachronal wave (cilia beat pattern)
    if(zoom>6){ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.beginPath();
      for(var c=0;c<cn;c++){var a=c/cn*Math.PI*2;var beat=Math.sin(o.cilPhase+c*0.3)*0.5+0.5;var r=sz*(0.95+beat*0.2);
        if(c===0)ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
      ctx.closePath();ctx.stroke();}}
  if(b.pseudo){var pn=5;
    for(var p=0;p<pn;p++){var a=p/pn*Math.PI*2+Math.sin(o.wobble)*0.3;var ext=sz*0.4+Math.sin(o.pulse+p*1.5)*sz*0.35;
      ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(a)*sz*0.7,Math.sin(a)*sz*0.7,Math.cos(a)*(sz+ext),Math.sin(a)*(sz+ext));
      ctx.lineWidth=Math.max(2,sz*0.12);ctx.strokeStyle='rgba(200,220,255,0.15)';ctx.stroke();}}
  if(b.stalk){ctx.strokeStyle='rgba(150,130,80,0.4)';ctx.lineWidth=Math.max(1,sz*0.06);
    ctx.beginPath();ctx.moveTo(0,sz*0.5);
    for(var s=0;s<32;s++){var t=s/32;ctx.lineTo(Math.sin(t*5*Math.PI*2)*sz*0.3,sz*0.5+t*sz*2);}ctx.stroke();}
  ctx.restore();
}

function renderViruses(vL,vR,vT,vB){
  ctx.save();
  for(var i=0;i<viruses.length;i++){
    var v=viruses[i];if(v.x<vL-20||v.x>vR+20||v.y<vT-20||v.y>vB+20)continue;
    ctx.save();ctx.translate(v.x,v.y);ctx.rotate(v.angle+Math.sin(v.wobble)*0.1);
    ctx.fillStyle='#f44';ctx.strokeStyle='#a00';ctx.lineWidth=0.5;
    // Head (icosahedron look)
    ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();ctx.stroke();
    // Tail
    ctx.strokeStyle='#f44';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,3);ctx.lineTo(0,8);ctx.stroke();
    // Tail fibers
    ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(-2,11);ctx.moveTo(0,8);ctx.lineTo(2,11);ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

