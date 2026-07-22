"use strict";

function drawBody(o,sz,fc2,fd, batched){
  var sh=o.sp.shape;
  if(!batched){
    var cyto=ctx.createRadialGradient(-sz*0.25,-sz*0.25,0,0,0,sz*1.1);
    cyto.addColorStop(0,fc2);
    cyto.addColorStop(0.7,fc2);
    cyto.addColorStop(1,fd);
    ctx.fillStyle=cyto;ctx.strokeStyle=fd;ctx.lineWidth=(settings.renderMode==='realistic'?
    Math.max(0.3,sz*0.02):  // Realistic: very thin outline
    Math.max(1.5,sz*0.1)    // Cartoon: bold thick outline
  );ctx.beginPath();
  }
  if(sh==='circle'){
      var vmag = Math.sqrt(o.vx*o.vx + o.vy*o.vy);
      var stretch = Math.min(1.4, 1.0 + vmag * 0.08);
      var squish = Math.max(0.7, 1.0 - vmag * 0.04);
      // Membrane fluidity: subtle ripple on cell surface (lipid bilayer dynamics)
      var memRipple=settings.renderMode==='realistic'?0.01:0.04;
      for(var i=0; i<=32; i++) {
          var a = (i/32) * Math.PI * 2;
          var r = sz + Math.sin(a*6-o.pulse*2)*(vmag*0.3) + Math.sin(a*12+o.pulse*3)*sz*memRipple;
          var x = Math.cos(a) * r * stretch;
          var y = Math.sin(a) * r * squish;
          if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
  }
  else if(sh==='rod'){if(batched)ctx.moveTo(sz*1.3,0);ctx.ellipse(0,0,sz*1.3,sz*0.6,0,0,Math.PI*2);}
  else if(sh==='spiral'){for(var i=0;i<=30;i++){var t=i/30*Math.PI*3,r=sz*0.8;var px=Math.cos(t)*r*(1-t/12),py=Math.sin(t)*r*(1-t/12);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}}
  else if(sh==='filament'){if(batched)ctx.moveTo(sz*2,0);ctx.ellipse(0,0,sz*2,sz*0.3,0,0,Math.PI*2);}
  else if(sh==='colony'){if(batched)ctx.moveTo(sz,0);ctx.arc(0,0,sz,0,Math.PI*2);
    if(!batched){
      ctx.fill();ctx.stroke();
      // Colonial arrangement: sphere of cells (Volvox-like) or chain (Anabaena-like)
      var colType=o.sp.bio.chain?'chain':'sphere';
      if(colType==='chain'){
        // Linear chain of cells
        ctx.fillStyle='rgba(80,160,80,0.5)';
        for(var cc=-2;cc<=2;cc++){
          ctx.beginPath();ctx.ellipse(cc*sz*0.8,0,sz*0.3,sz*0.25,0,0,Math.PI*2);ctx.fill();
        }
      } else {
        // Sphere colony (Volvox-like)
        ctx.fillStyle='rgba(100,200,100,0.5)';
        for(var ci2=0;ci2<10;ci2++){
          var ca=ci2/10*Math.PI*2;
          var cr=sz*0.7;
          ctx.beginPath();ctx.arc(Math.cos(ca)*cr,Math.sin(ca)*cr,sz*0.12,0,Math.PI*2);ctx.fill();
        }
        // Daughter colonies inside (smaller spheres)
        if(detail>=1){ctx.fillStyle='rgba(120,220,120,0.3)';
        for(var dc=0;dc<3;dc++){
          var da=dc/3*Math.PI*2;
          ctx.beginPath();ctx.arc(Math.cos(da)*sz*0.3,Math.sin(da)*sz*0.3,sz*0.15,0,Math.PI*2);ctx.fill();
        }}
      }
      return;
    }
  }
  else if(sh==='star'){var pts=12;for(var i=0;i<=pts*2;i++){var a=i/(pts*2)*Math.PI*2,r=i%2===0?sz*1.3:sz*0.6;if(i===0)ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}}
  else if(sh==='slipper'){ctx.moveTo(sz,0);ctx.bezierCurveTo(sz,-sz*0.65,-sz*0.8,-sz*0.65,-sz,0);ctx.bezierCurveTo(-sz*0.8,sz*0.65,sz,sz*0.65,sz,0);}
  else if(sh==='bell'){ctx.moveTo(0,-sz);ctx.bezierCurveTo(sz*0.8,-sz*0.9,sz*0.9,sz*0.3,0,sz*0.5);ctx.bezierCurveTo(-sz*0.9,sz*0.3,-sz*0.8,-sz*0.9,0,-sz);}
  else if(sh==='oval'){if(batched)ctx.moveTo(sz*1.1,0);ctx.ellipse(0,0,sz*1.1,sz*0.7,0,0,Math.PI*2);}
  else if(sh==='frustule'){
    // Diatom frustule — two valves with ribbed pattern
    if(batched)ctx.moveTo(sz*1.2,0);
    ctx.ellipse(0,0,sz*1.2,sz*0.5,0,0,Math.PI*2);
    if(!batched){
      ctx.fill();ctx.stroke();
      // Raphe (central slit) and striae (ribbed pattern)
      ctx.strokeStyle='rgba(40,60,40,0.3)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(-sz*1.0,0);ctx.lineTo(sz*1.0,0);ctx.stroke();
      for(var fr=-sz*0.9;fr<=sz*0.9;fr+=sz*0.15){
        ctx.beginPath();ctx.moveTo(fr,-sz*0.4);ctx.lineTo(fr,sz*0.4);ctx.stroke();
      }
      return;
    }
  }
  else if(sh==='irregular'){
      // Amoeboid movement: body deforms in direction of motion, pseudopodia extend
      var lobes=5+Math.floor(o.wobble)%3;
      var vmag2=Math.sqrt(o.vx*o.vx+o.vy*o.vy);
      var vang2=Math.atan2(o.vy,o.vx);
      for(var i=0;i<=48;i++){
        var a=i/48*Math.PI*2;
        var r=sz+Math.sin(a*lobes+o.wobble)*sz*0.25+Math.sin(a*3+o.pulse)*sz*0.1;
        // Stretch in direction of movement (pseudopod extension)
        if(vmag2>0.5){
          var align=Math.cos(a-vang2);
          r+=align*vmag2*sz*0.2;
        }
        if(i===0)ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);
        else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
      }
    }
  else {if(batched)ctx.moveTo(sz,0);ctx.arc(0,0,sz,0,Math.PI*2);}
  
  if(!batched){
    ctx.fill();
    // Pellicle strips for ciliates
    if(o.sp.bio.pellicle&&zoom>5){ctx.strokeStyle='rgba(180,140,60,0.3)';ctx.lineWidth=1;
      for(var s=-sz*0.8;s<sz*0.8;s+=sz*0.15){ctx.beginPath();ctx.moveTo(s,-sz*0.5);ctx.lineTo(s,sz*0.5);ctx.stroke();}}
    // Spikes/defense structures (visible on shelled/spiked organisms)
    if(o.sp.flags&&o.sp.flags.spikes){
      ctx.strokeStyle='rgba(150,120,50,0.6)';ctx.lineWidth=Math.max(1,sz*0.05);
      var spikeCount=8;
      for(var sp=0;sp<spikeCount;sp++){
        var sa=sp/spikeCount*Math.PI*2+o.wobble*0.1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa)*sz,Math.sin(sa)*sz);
        ctx.lineTo(Math.cos(sa)*sz*1.4,Math.sin(sa)*sz*1.4);
        ctx.stroke();
      }
    }
    // Shell texture (diatoms, shelled organisms)
    if(o.sp.flags&&o.sp.flags.shell){
      ctx.strokeStyle='rgba(200,190,160,0.3)';ctx.lineWidth=0.5;
      for(var sh=-sz*0.6;sh<sz*0.6;sh+=sz*0.12){
        ctx.beginPath();ctx.moveTo(sh,-sz*0.4);ctx.lineTo(sh,sz*0.4);ctx.stroke();
      }
    }
    // Toxic glow (toxic species glow green-ish)
    if(o.sp.flags&&o.sp.flags.toxic){
      ctx.fillStyle='rgba(100,255,50,0.08)';
      ctx.beginPath();ctx.arc(0,0,sz*1.2,0,Math.PI*2);ctx.fill();
    }
    if(o.sp.bio.wall){
      // Double-layered cell wall (plants, fungi, bacteria)
      ctx.lineWidth=Math.max(2,sz*0.12);
      ctx.stroke();
      // Inner membrane (thin line inside)
      ctx.strokeStyle='rgba(100,80,50,0.3)';ctx.lineWidth=0.5;
      ctx.beginPath();
      // Re-trace the path slightly smaller
      ctx.save();ctx.scale(0.92,0.92);
      ctx.restore();
    } else {ctx.stroke();}
    if(o.sp.biolum&&dayLight<0.35){
      // Pulsing bioluminescence — concentric rings expanding outward
      var bpulse=(o.pulse%4)/4; // 0-1 cycle
      for(var br=0;br<3;br++){
        var bphase=(bpulse+br*0.33)%1;
        var brad=sz*(0.5+bphase*1.5);
        var balpha=(1-bphase)*0.2;
        ctx.fillStyle='rgba(100,255,200,'+balpha+')';
        ctx.beginPath();ctx.arc(0,0,brad,0,Math.PI*2);ctx.fill();
      }
    }
  }
}

function renderOrg(o, skipBody){
  ctx.save();ctx.translate(o.x,o.y);
  
  // Bioluminescence at night for producers (gradient, NOT shadow — 50x faster)
  if(dayLight < 0.35 && o.sp.cat === 'producer' && o.alive) {
     var pulseR = sz * (2.5 + Math.sin(fc*0.1 + o.pulse)*0.5);
     if(!isFinite(pulseR)||pulseR<=0)pulseR=sz*2;var glowG = ctx.createRadialGradient(0,0,0, 0,0,pulseR);
     glowG.addColorStop(0, 'rgba(100,255,200,0.3)');
     glowG.addColorStop(1, 'rgba(100,255,200,0)');
     ctx.fillStyle = glowG;
     ctx.beginPath();
     ctx.arc(0,0,pulseR,0,Math.PI*2);
     ctx.fill();
  }
  
  var sz=o.size;
  // Size by age: grow from 30% (spore) to 100% (adult) over first 20% of lifespan
  if(o.age<o.sp.minAge*0.5){var growthRatio=0.3+0.7*(o.age/(o.sp.minAge*0.5));sz*=growthRatio;}
  var rgb=hex2rgb(o.sp.color);
  // Color by status + render mode
  var healthRatio=o.energy/100;
  var tint=0.4+healthRatio*0.8;
  if(o.dying)tint*=0.5;
  if(o.infected)tint=0.6;
  // Realistic mode: desaturate (lower saturation = muddier, natural look)
  if(settings.renderMode==='realistic'){tint*=0.7;} // Muted, less vibrant
  // Cartoon mode: extra vibrant
  if(settings.renderMode==='cartoon'){tint*=1.1;}
  var bc=shadeRgb(rgb[0],rgb[1],rgb[2],tint),bd=shadeRgb(rgb[0],rgb[1],rgb[2],tint*0.5);
  if(o.dying)ctx.globalAlpha=clamp(1-o.deathT/1.2,0,1);
  if(o.cyst){ctx.fillStyle='rgba(180,160,80,0.35)';ctx.beginPath();ctx.arc(0,0,sz*1.4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(200,180,100,0.5)';ctx.lineWidth=2;ctx.stroke();}
  // Biofilm overlay
  if(o.inBiofilm){ctx.fillStyle=o.sp.color;ctx.globalAlpha=0.2;ctx.beginPath();ctx.arc(0,0,sz*1.8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1.0;}
  // Infected overlay
  if(o.infected){ctx.fillStyle='rgba(255,50,50,0.15)';ctx.beginPath();ctx.arc(0,0,sz*1.2,0,Math.PI*2);ctx.fill();}
  if(o.dividing){
    // Mitosis animation: nucleus divides first, then cytokinesis (cell splits)
    var dp=o.divT/1.3;
    var sep=sz*dp*0.5;
    // Furrow (cleavage) appears in the middle during late mitosis
    if(dp>0.3&&zoom>4){
      ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=sz*dp*0.15;
      ctx.beginPath();ctx.moveTo(0,-sz);ctx.lineTo(0,sz);ctx.stroke();
    }
    // Left daughter cell
    ctx.save();ctx.translate(-sep,0);
    if(!skipBody)drawBody(o,sz*(1-dp*0.15),bc,bd);
    drawOrgans(o,sz*(1-dp*0.15));ctx.restore();
    // Right daughter cell
    ctx.save();ctx.translate(sep,0);
    if(!skipBody)drawBody(o,sz*(1-dp*0.15),bc,bd);
    drawOrgans(o,sz*(1-dp*0.15));ctx.restore();
    ctx.restore();return;}
  ctx.rotate(o.angle+Math.sin(o.wobble)*0.04);
  if(!skipBody)drawBody(o,sz,bc,bd);
  var organZoom=settings.renderMode==='realistic'?2:3;
  if(zoom>organZoom)drawOrgans(o,sz);
  var appZoom=settings.renderMode==='realistic'?1.5:2;
  if(zoom>appZoom)drawAppendages(o,sz);
  if(o.flash>0){
    ctx.globalAlpha=o.flash;
    ctx.fillStyle=o.flashColor||'#ff8';
    ctx.beginPath();ctx.arc(0,0,sz,0,Math.PI*2);ctx.fill();
    // Combat ring: red ring when attacked
    if(o.flashColor==='#f44'||o.flashColor==='#f00'){
      ctx.globalAlpha=o.flash*0.5;ctx.strokeStyle='#f44';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(0,0,sz+4+o.flash*5,0,Math.PI*2);ctx.stroke();
    }
    ctx.globalAlpha=1;
  }
  if(o.isPlayer&&state==='playing'){ctx.globalAlpha=0.5+Math.sin(fc*0.1)*0.3;ctx.strokeStyle='#4ff';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,sz+4,0,Math.PI*2);ctx.stroke();}
  // UI-003: Highlight edible prey with green ring
  if(!o.isPlayer&&o.alive&&player&&player.alive&&state==='playing'&&zoom>3){
    var foodCats2=FOOD[player.sp.cat]||[];
    if(foodCats2.indexOf(o.sp.cat)>=0&&o.size<player.size*0.88){
      ctx.globalAlpha=0.3+Math.sin(fc*0.15)*0.2;
      ctx.strokeStyle='#4f4';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(0,0,sz+3,0,Math.PI*2);ctx.stroke();
      ctx.globalAlpha=1;
    }
  }
  // #18 Sporangium flash (fungal spore release)
  if(o.sporeFlash>0){
    ctx.globalAlpha=o.sporeFlash*0.5;
    ctx.fillStyle='rgba(200,180,100,0.5)';
    ctx.beginPath();ctx.arc(0,-sz*0.5,sz*0.4,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  }
  // #19/#29 Conjugation bridge (pilus between conjugating cells)
  if(o.conjugatePartner&&o.conjugatePartner.alive){
    var cpdx=o.conjugatePartner.x-o.x, cpdy=o.conjugatePartner.y-o.y;
    ctx.strokeStyle='rgba(255,200,100,'+o.conjugating+')';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(cpdx,cpdy);ctx.stroke();
  }
  ctx.restore();
}

function drawOrgans(o,sz){
  var org=o.organs;if(!org)return;
  var detailThreshold=settings.renderMode==='realistic'?0.6:1.0;
  var detail=zoom>(6*detailThreshold)?2:(zoom>(4*detailThreshold)?1:0);
  for(var i=0;i<org.length;i++){
    var g=org[i];ctx.save();
    if(g.t==='nuc'){
      // Organelle shadow (depth illusion)
      if(detail>=1){ctx.fillStyle='rgba(0,0,0,0.1)';ctx.beginPath();ctx.arc(g.x+g.r*0.1,g.y+g.r*0.15,g.r*1.05,0,Math.PI*2);ctx.fill();}
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
      // DNA double helix spiral (replaces random chromatin strands)
      if(detail>=1){
        var dnaPh=o.pulse*0.5;
        var dnaR=g.r*0.55;
        // Strand 1
        ctx.strokeStyle='rgba(100,180,255,0.5)';ctx.lineWidth=1;
        ctx.beginPath();
        for(var ds=0;ds<=40;ds++){
          var dt=ds/40;var da=dt*Math.PI*4+dnaPh;
          var dx=g.x+Math.cos(da)*dnaR*dt;
          var dy=g.y-g.r*0.4+dt*g.r*0.8;
          var dz=Math.sin(da)*dnaR*0.3;
          var px=dx+dz*0.5;
          if(ds===0)ctx.moveTo(px,dy);else ctx.lineTo(px,dy);
        }
        ctx.stroke();
        // Strand 2 (phase-shifted by PI)
        ctx.strokeStyle='rgba(255,120,120,0.5)';ctx.lineWidth=1;
        ctx.beginPath();
        for(var ds=0;ds<=40;ds++){
          var dt=ds/40;var da=dt*Math.PI*4+dnaPh+Math.PI;
          var dx=g.x+Math.cos(da)*dnaR*dt;
          var dy=g.y-g.r*0.4+dt*g.r*0.8;
          var dz=Math.sin(da)*dnaR*0.3;
          var px=dx+dz*0.5;
          if(ds===0)ctx.moveTo(px,dy);else ctx.lineTo(px,dy);
        }
        ctx.stroke();
        // Base pairs (rungs connecting strands)
        if(detail>=2){ctx.strokeStyle='rgba(200,150,255,0.3)';ctx.lineWidth=0.5;
        for(var bp=0;bp<8;bp++){
          var bt=bp/8;var ba=bt*Math.PI*4+dnaPh;
          var b1x=g.x+Math.cos(ba)*dnaR*bt+(Math.sin(ba)*dnaR*0.3)*0.5;
          var b2x=g.x+Math.cos(ba+Math.PI)*dnaR*bt+(Math.sin(ba+Math.PI)*dnaR*0.3)*0.5;
          ctx.beginPath();ctx.moveTo(b1x,g.y-g.r*0.4+bt*g.r*0.8);ctx.lineTo(b2x,g.y-g.r*0.4+bt*g.r*0.8);ctx.stroke();
        }}
      }
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
      // Chloroplast with cyclosis (cytoplasmic streaming) — orbits around cell center
      var cycloAngle=Math.atan2(g.y,g.x)+o.pulse*0.15;
      var cycloR=Math.sqrt(g.x*g.x+g.y*g.y);
      var cx2=Math.cos(cycloAngle)*cycloR,cy2=Math.sin(cycloAngle)*cycloR;
      ctx.save();ctx.translate(cx2,cy2);ctx.rotate(g.rot+o.pulse*0.2);
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
    else if(g.t==='golgi'){
      // Golgi apparatus — stacked cisternae (parallel arcs)
      ctx.strokeStyle='rgba(180,140,200,0.5)';ctx.lineWidth=Math.max(1,g.r*0.08);
      for(var gs=0;gs<5;gs++){
        var goff=(gs-2)*g.r*0.25;
        ctx.beginPath();ctx.ellipse(g.x,g.y+goff,g.r*(1-Math.abs(goff)/(g.r*2)),g.r*0.1,0,0,Math.PI*2);ctx.stroke();
      }
      // Vesicles budding off
      ctx.fillStyle='rgba(200,160,220,0.4)';
      ctx.beginPath();ctx.arc(g.x+g.r*0.8,g.y,g.r*0.1,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(g.x-g.r*0.8,g.y,g.r*0.1,0,Math.PI*2);ctx.fill();
    }
    else if(g.t==='golgiS'){ctx.fillStyle=g.c;ctx.globalAlpha=0.5;ctx.save();ctx.translate(g.x,g.y);ctx.beginPath();ctx.ellipse(0,0,g.rx,g.ry,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    else if(g.t==='er'){
      // Endoplasmic reticulum — network of curved tubules
      ctx.strokeStyle='rgba(180,140,120,0.4)';ctx.lineWidth=Math.max(1,sz*0.04);
      ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.rot);
      for(var et=0;et<4;et++){
        var eo=et*g.rx*0.2-g.rx*0.3;
        ctx.beginPath();
        ctx.moveTo(eo,-g.ry*0.5);
        ctx.quadraticCurveTo(eo+g.rx*0.1,-g.ry*0.2,eo+g.rx*0.05,g.ry*0.5);
        ctx.stroke();
      }
      // Ribosomes on rough ER (dark dots)
      if(detail>=1){ctx.fillStyle='rgba(80,60,40,0.6)';
      for(var rb=0;rb<6;rb++){
        ctx.beginPath();ctx.arc(rng(-g.rx*0.3,g.rx*0.3),rng(-g.ry*0.4,g.ry*0.4),sz*0.03,0,Math.PI*2);ctx.fill();
      }}
      ctx.restore();
    }
    else if(g.t==='vac'){ctx.fillStyle=g.c;ctx.globalAlpha=0.45;ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
      // Membrane outline
      ctx.strokeStyle='rgba(200,170,80,0.4)';ctx.lineWidth=0.5;ctx.stroke();}
        else if(g.t==='cv'){
      // Contractile vacuole: osmoregulation cycle (fill → contract → empty)
      var cvCycle=(o.pulse%6)/6; // 0-1 cycle
      var cvPhase=cvCycle<0.7?cvCycle/0.7:(1-cvCycle)/0.3; // ramp up then rapid contract
      var pr=g.r*(0.3+cvPhase*0.8);
      ctx.fillStyle=g.c;ctx.globalAlpha=0.5+cvPhase*0.2;
      ctx.beginPath();ctx.arc(g.x,g.y,pr,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(80,160,240,0.5)';ctx.lineWidth=0.5;ctx.stroke();
      // Auxiliary canals (radiating tubules visible during fill phase)
      if(detail>=1&&cvPhase>0.3){
        ctx.strokeStyle='rgba(80,160,240,0.2)';ctx.lineWidth=0.5;
        for(var cca=0;cca<6;cca++){
          var ang=cca/6*Math.PI*2;
          ctx.beginPath();ctx.moveTo(g.x+Math.cos(ang)*pr,g.y+Math.sin(ang)*pr);
          ctx.lineTo(g.x+Math.cos(ang)*pr*1.5,g.y+Math.sin(ang)*pr*1.5);ctx.stroke();
        }
      }
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
    else if(g.t==='trich'){
      // Trichocyst — resting state: small dart; firing state: long cross-striated filament
      var trichFire=o.trichFire||0; // 0=resting, 1=firing
      ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.atan2(g.y,g.x));
      if(trichFire>0.1){
        // Firing: long filament with cross-striations
        var tlen=sz*0.15+trichFire*sz*0.6;
        ctx.strokeStyle='rgba(200,220,255,0.5)';ctx.lineWidth=Math.max(0.5,sz*0.02);
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(tlen,0);ctx.stroke();
        // Cross-striations
        ctx.strokeStyle='rgba(180,200,240,0.3)';ctx.lineWidth=0.5;
        for(var ts=0;ts<8;ts++){var tx2=ts/8*tlen;ctx.beginPath();ctx.moveTo(tx2,-sz*0.03);ctx.lineTo(tx2,sz*0.03);ctx.stroke();}
      } else {
        // Resting: compact dart shape
        ctx.fillStyle='rgba(200,220,255,0.3)';
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(sz*0.12,0);ctx.lineTo(0,sz*0.02);ctx.closePath();ctx.fill();
      }
      ctx.restore();
    }
    else if(g.t==='oral'){ctx.fillStyle=g.c;ctx.globalAlpha=0.4;ctx.beginPath();ctx.ellipse(g.x,g.y,g.r,g.r*0.6,0,0,Math.PI*2);ctx.fill();}
    else if(g.t==='eye'){
      // Eyespot (stigma) — red/orange with photoreceptor
      ctx.fillStyle='#cc4400';ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ff7700';ctx.beginPath();ctx.arc(g.x-g.r*0.2,g.y-g.r*0.2,g.r*0.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ffaa00';ctx.beginPath();ctx.arc(g.x-g.r*0.3,g.y-g.r*0.3,g.r*0.25,0,Math.PI*2);ctx.fill();
    }
    else if(g.t==='lyso'){
      // Lysosome — dark granule with digestive enzymes
      ctx.fillStyle='rgba(100,70,30,0.7)';
      ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(140,100,50,0.5)';ctx.lineWidth=0.5;ctx.stroke();
      // Inner enzymatic granules
      if(detail>=1){ctx.fillStyle='rgba(180,140,80,0.4)';
      for(var lg=0;lg<3;lg++){ctx.beginPath();ctx.arc(g.x+rng(-g.r*0.4,g.r*0.4),g.y+rng(-g.r*0.4,g.r*0.4),g.r*0.15,0,Math.PI*2);ctx.fill();}}
    }
    else if(g.t==='perox'){
      // Peroxisome — small yellowish dot (oxidation reactions)
      ctx.fillStyle='rgba(200,180,80,0.6)';
      ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
      // Crystalline core (catalase)
      if(detail>=1){ctx.fillStyle='rgba(240,230,150,0.5)';
      ctx.beginPath();ctx.arc(g.x,g.y,g.r*0.3,0,Math.PI*2);ctx.fill();}
    }
    else if(g.t==='glyco'){
      // Glycogen granules — small white dots (energy storage)
      ctx.fillStyle='rgba(240,240,200,0.4)';
      ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
    }
    else if(g.t==='lipid'){
      // Lipid droplet — large translucent yellow sphere
      var lipo=ctx.createRadialGradient(g.x-g.r*0.2,g.y-g.r*0.2,0,g.x,g.y,g.r);
      lipo.addColorStop(0,'rgba(255,240,200,0.6)');lipo.addColorStop(1,'rgba(200,170,80,0.4)');
      ctx.fillStyle=lipo;
      ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
}

function drawAppendages(o,sz){
  var b=o.sp.bio;ctx.save();ctx.strokeStyle='rgba(200,220,255,0.35)';ctx.lineWidth=Math.max(1,sz*0.05);
  if(b.flag){var fn=b.chain?3:1;
    for(var f=0;f<fn;f++){
      // Flagellum with whip-tip: base thick, tip curls (euglena-style undulating motion)
      var sx=-sz*0.9+(f-fn/2)*sz*0.15;
      var wLen=24; // More segments for smoother wave
      var segs=[];
      for(var w=0;w<=wLen;w++){
        var t=w/wLen;
        var wx=sx-t*sz*2.2;
        // Whip motion: sinusoidal base, exponential amplitude toward tip
        var amp=sz*(0.08+t*t*0.6); // Quadratic tapering (whip effect)
        var wy=Math.sin(o.flagPhase+w*0.6+f*0.5)*amp;
        // Tip curl: last 30% bends more sharply
        if(t>0.7){var curl=(t-0.7)/0.3;wy+=Math.cos(o.flagPhase*1.5+w)*sz*0.15*curl;}
        segs.push({x:wx,y:wy});
      }
      // Draw with varying width (thick base, thin tip)
      for(var w=0;w<segs.length-1;w++){
        var t=w/wLen;
        ctx.lineWidth=Math.max(0.5,sz*(0.12-t*0.09)); // Tapering width
        ctx.strokeStyle='rgba(220,240,255,'+(0.7-t*0.3)+')'; // Fading alpha
        ctx.beginPath();ctx.moveTo(segs[w].x,segs[w].y);ctx.lineTo(segs[w+1].x,segs[w+1].y);ctx.stroke();
      }
    }
  }
  if(b.cilia){var cn=12+Math.floor(sz/2);
    // Each cilium has a phase offset creating metachronal wave (ciliary beating)
    var ciliaDir=o.cilReverse?-1:1; // Reversal behavior (avoidance reaction)
    for(var c=0;c<cn;c++){
      var a=c/cn*Math.PI*2;
      var phaseOffset=c*0.4; // Phase shift per cilium (metachronal coordination)
      var beat=Math.sin(o.cilPhase*ciliaDir+phaseOffset);
      var extension=0.5+beat*0.5; // 0=contracted, 1=extended
      var r1=sz*0.85,r2=sz*(1.0+extension*0.35);
      // Cilium curves during effective stroke, straight during recovery
      var midR=(r1+r2)/2;
      var curveOff=beat>0?sz*0.08:0; // Curve during power stroke
      ctx.strokeStyle='rgba(200,220,255,'+(0.3+extension*0.3)+')';
      ctx.lineWidth=Math.max(0.5,sz*0.04);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);
      ctx.quadraticCurveTo(
        Math.cos(a)*midR+Math.sin(a)*curveOff,Math.sin(a)*midR-Math.cos(a)*curveOff,
        Math.cos(a)*r2,Math.sin(a)*r2);
      ctx.stroke();
    }
    // Metachronal wave envelope (visible at high zoom)
    if(zoom>6){ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;ctx.beginPath();
      for(var c=0;c<=cn;c++){var a=c/cn*Math.PI*2;var beat=Math.sin(o.cilPhase*ciliaDir+c*0.4);var r=sz*(0.95+beat*0.2+0.2);
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

