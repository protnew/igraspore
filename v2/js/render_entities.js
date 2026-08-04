// render_entities.js — drawBody, renderOrg
"use strict";

function drawBody(o,sz,fc2,fd, batched){
  var sh=o.sp.shape;
  // Compute detail level locally (zoom-dependent)
  var _dtBase=(settings.microscopeMode?0.15:(settings.renderMode==="realistic"?0.35:0.55));
  var detail=(typeof zoom==="number"&&zoom>(2.8*_dtBase)?2:(zoom>(1.2*_dtBase)?1:0));
  if(settings.microscopeMode) detail=Math.max(detail,2);
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
      var memRipple=(settings.renderMode==='realistic'?0.008:0.025)*Math.min(1, 4/Math.max(zoom,1));
      for(var i=0; i<=32; i++) {
          var a = (i/32) * Math.PI * 2;
          var r = sz + Math.sin(a*6-o.pulse*1.2)*(Math.min(vmag,4)*0.12) + Math.sin(a*12+o.pulse*1.5)*sz*memRipple;
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
      // Colonial microbes are REAL (Volvox / Gloeocapsa / Microcystis) — show anatomy
      var colType=(o.sp.bio&&o.sp.bio.chain)?'chain':'sphere';
      var nm=(o.sp.name||'').toLowerCase();
      if(colType==='chain' || nm.indexOf('anabaena')>=0 || nm.indexOf('nostoc')>=0){
        // Filament / chain of cells with heterocysts
        for(var cc=-3;cc<=3;cc++){
          var isHet=(cc===-1||cc===2);
          ctx.fillStyle=isHet?'rgba(40,90,50,0.85)':'rgba(70,160,70,0.75)';
          ctx.beginPath();ctx.ellipse(cc*sz*0.55,0,sz*(isHet?0.28:0.32),sz*(isHet?0.28:0.26),0,0,Math.PI*2);ctx.fill();
          ctx.strokeStyle='rgba(20,60,30,0.45)';ctx.lineWidth=Math.max(0.4,sz*0.04);
          ctx.stroke();
        }
      } else {
        // Hollow gelatinous sphere — cells on SURFACE (Volvox-style), not a solid death-ball
        // 1) translucent mucilage envelope
        var muc=ctx.createRadialGradient(0,0,sz*0.15,0,0,sz);
        muc.addColorStop(0,'rgba(180,230,160,0.12)');
        muc.addColorStop(0.7,'rgba(90,170,80,0.22)');
        muc.addColorStop(1,'rgba(40,110,50,0.35)');
        ctx.fillStyle=muc;
        ctx.beginPath();ctx.arc(0,0,sz,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='rgba(60,140,70,0.55)';ctx.lineWidth=Math.max(0.8,sz*0.06);
        ctx.stroke();
        // 2) somatic cells dotted on sphere surface
        var nCell=Math.min(22, 8+Math.floor(sz*1.6));
        for(var ci2=0;ci2<nCell;ci2++){
          var ca=ci2/nCell*Math.PI*2 + (o.pulse||0)*0.2;
          var cr=sz*0.78;
          var cx=Math.cos(ca)*cr, cy=Math.sin(ca)*cr*0.85;
          ctx.fillStyle='rgba(50,140,55,0.9)';
          ctx.beginPath();ctx.arc(cx,cy,Math.max(0.7,sz*0.09),0,Math.PI*2);ctx.fill();
          // tiny flagella hint on outer cells
          if(detail>=1 && ci2%3===0){
            ctx.strokeStyle='rgba(120,200,130,0.35)';ctx.lineWidth=0.6;
            ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx*1.18,cy*1.18);ctx.stroke();
          }
        }
        // 3) daughter colonies inside (Volvox gonidia) — real internal structure
        if(detail>=0){
          var nd=sz>4?3:2;
          for(var dc=0;dc<nd;dc++){
            var da=dc/nd*Math.PI*2+(o.wobble||0);
            var dx=Math.cos(da)*sz*0.28, dy=Math.sin(da)*sz*0.22;
            var dr=sz*(0.16+dc*0.03);
            var dg=ctx.createRadialGradient(dx,dy,0,dx,dy,dr);
            dg.addColorStop(0,'rgba(140,210,120,0.55)');
            dg.addColorStop(1,'rgba(60,130,60,0.25)');
            ctx.fillStyle=dg;
            ctx.beginPath();ctx.arc(dx,dy,dr,0,Math.PI*2);ctx.fill();
            ctx.strokeStyle='rgba(40,100,50,0.4)';ctx.lineWidth=0.7;ctx.stroke();
          }
        }
        // toxic Microcystis: denser packed cells + slight yellow tinge label via flash only
        if(o.sp.flags&&o.sp.flags.toxic){
          ctx.strokeStyle='rgba(200,180,40,0.35)';
          ctx.setLineDash([2,2]);
          ctx.beginPath();ctx.arc(0,0,sz*1.05,0,Math.PI*2);ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      return;
    }
  }
  else if(sh==='star'){var pts=12;for(var i=0;i<=pts*2;i++){var a=i/(pts*2)*Math.PI*2,r=i%2===0?sz*1.3:sz*0.6;if(i===0)ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}}
  else if(sh==='slipper'){ctx.moveTo(sz,0);ctx.bezierCurveTo(sz,-sz*0.65,-sz*0.8,-sz*0.65,-sz,0);ctx.bezierCurveTo(-sz*0.8,sz*0.65,sz,sz*0.65,sz,0);}
  else if(sh==='bell'){ctx.moveTo(0,-sz);ctx.bezierCurveTo(sz*0.8,-sz*0.9,sz*0.9,sz*0.3,0,sz*0.5);ctx.bezierCurveTo(-sz*0.9,sz*0.3,-sz*0.8,-sz*0.9,0,-sz);}
  else if(sh==='oval'){
    // Soft elongated cell (ciliate-ish) — not a dumb capsule
    if(batched){
      ctx.moveTo(sz*1.15,0);
      ctx.ellipse(0,0,sz*1.15,sz*0.68,0,0,Math.PI*2);
    } else {
      ctx.moveTo(sz*1.2, 0);
      ctx.bezierCurveTo(sz*1.15, -sz*0.72, -sz*0.55, -sz*0.75, -sz*1.05, -sz*0.15);
      ctx.bezierCurveTo(-sz*1.2, 0, -sz*1.05, sz*0.15, -sz*0.55, sz*0.75);
      ctx.bezierCurveTo(sz*1.15, sz*0.72, sz*1.2, 0, sz*1.2, 0);
    }
  }
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
        var r=sz+Math.sin(a*lobes+o.wobble)*sz*0.10+Math.sin(a*3+o.pulse)*sz*0.04;
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
    // Ciliate texture: oral groove + contractile vacuole hint on oval/slipper
    if((sh==='oval'||sh==='slipper')&&!batched){
      ctx.strokeStyle='rgba(0,0,0,0.18)';ctx.lineWidth=Math.max(0.8,sz*0.04);
      ctx.beginPath();ctx.moveTo(sz*0.15,-sz*0.15);ctx.quadraticCurveTo(sz*0.55,0,sz*0.15,sz*0.2);ctx.stroke();
      // contractile vacuole
      ctx.fillStyle='rgba(180,220,255,0.35)';
      ctx.beginPath();ctx.arc(-sz*0.35,-sz*0.15,sz*0.16,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(120,180,220,0.45)';ctx.lineWidth=0.7;
      ctx.beginPath();ctx.arc(-sz*0.35,-sz*0.15,sz*0.16,0,Math.PI*2);ctx.stroke();
      // food vacuoles
      ctx.fillStyle='rgba(255,200,80,0.35)';
      ctx.beginPath();ctx.arc(sz*0.2,sz*0.1,sz*0.1,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(-sz*0.05,sz*0.28,sz*0.07,0,Math.PI*2);ctx.fill();
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
  var isReal=settings.renderMode==='realistic';
  var sz=o.size;
  // Lunge squash BEFORE body (readable eat beat)
  if(o._lungeT>0){
    var lt=o._lungeT;
    o._lungeT = lt - 0.05; // ~0.28s at 60fps-ish; clamped
    if(o._lungeT<0) o._lungeT=0;
    var s=1+lt*0.4;
    ctx.scale(s, 1/Math.max(0.72, s*0.88));
  }
  
  // Bioluminescence at night for producers (gradient, NOT shadow — 50x faster)
  if(dayLight < 0.35 && o.sp.cat === 'producer' && o.alive) {
     var pulseR = sz * (2.5 + Math.sin(fc*0.1 + o.pulse)*0.5);
     if(!isFinite(pulseR)||pulseR<=0)pulseR=sz*1.35;var glowG = ctx.createRadialGradient(0,0,0, 0,0,pulseR);
     glowG.addColorStop(0, 'rgba(100,255,200,0.12)');
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
  if(settings.renderMode==='cartoon'){tint*=1.1;}
  // REALISTIC: phase contrast = luminance only (no color)
  // Reference photos show white/gray organisms, not colored
  if(settings.renderMode==='realistic'){
    // Phase-contrast-ish: muted luminance + keep 35% species hue (not corpse-gray icons)
    var g2=rgb[0]*0.299+rgb[1]*0.587+rgb[2]*0.114;
    var keep=0.35;
    rgb=[Math.round(g2*(1-keep)+rgb[0]*keep),
         Math.round(g2*(1-keep)+rgb[1]*keep),
         Math.round(g2*(1-keep)+rgb[2]*keep)];
    // Lift midtones so cells read on teal water
    rgb[0]=Math.min(220, rgb[0]+28); rgb[1]=Math.min(220, rgb[1]+28); rgb[2]=Math.min(220, rgb[2]+22);
    tint=1.05;
  }
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
    if(!skipBody)drawBody(o,sz*(1-dp*0.45),bc,bd);
    drawOrgans(o,sz*(1-dp*0.45));ctx.restore();
    // Right daughter cell
    ctx.save();ctx.translate(sep,0);
    if(!skipBody)drawBody(o,sz*(1-dp*0.45),bc,bd);
    drawOrgans(o,sz*(1-dp*0.45));ctx.restore();
    ctx.restore();return;}
  ctx.rotate(((typeof o.facing==='number')?o.facing:o.angle||0)+Math.sin(o.wobble)*0.012);
  if(isReal&&!skipBody){
    // PHASE CONTRAST: bright organisms, clearly visible on dark bg
    var pr=rgb[0],pg=rgb[1],pb=rgb[2];
    // Phase contrast: compress to gray range 110-175 (medium gray)
    var rawLum=Math.round(pr*0.3+pg*0.59+pb*0.11);
    var lum=110+Math.round(rawLum*0.25); // 110-175 range
    // Body: bright, semi-transparent
    // Phase contrast: translucent body with light/dark phase shift
    // Phase contrast: bright center → dark edge (Hale-effect)
    var pcr=ctx.createRadialGradient(-sz*0.15,-sz*0.15,sz*0.1,0,0,sz*1.15);
    pcr.addColorStop(0,'rgba('+(lum+25)+','+(lum+25)+','+(lum+20)+',0.7)');
    pcr.addColorStop(0.35,'rgba('+(lum+5)+','+(lum+5)+','+lum+',0.6)');
    pcr.addColorStop(0.7,'rgba('+lum+','+lum+','+Math.max(0,lum-5)+',0.55)');
    pcr.addColorStop(1,'rgba('+(lum-25)+','+(lum-25)+','+Math.max(0,lum-30)+',0.45)');
    ctx.fillStyle=pcr;
    ctx.beginPath();
    // Draw same shape as body
    var sh2=o.sp.shape;
    if(sh2==='circle'||sh2==='colony'){ctx.arc(0,0,sz,0,Math.PI*2);}
    else if(sh2==='rod'||sh2==='filament'){ctx.ellipse(0,0,sz*1.3,sz*0.6,0,0,Math.PI*2);}
    else if(sh2==='oval'){ctx.ellipse(0,0,sz*1.1,sz*0.7,0,0,Math.PI*2);}
    else if(sh2==='slipper'){ctx.moveTo(sz,0);ctx.bezierCurveTo(sz,-sz*0.65,-sz*0.8,-sz*0.65,-sz,0);ctx.bezierCurveTo(-sz*0.8,sz*0.65,sz,sz*0.65,sz,0);}
    else if(sh2==='bell'){ctx.moveTo(0,-sz);ctx.bezierCurveTo(sz*0.8,-sz*0.9,sz*0.9,sz*0.3,0,sz*0.5);ctx.bezierCurveTo(-sz*0.9,sz*0.3,-sz*0.8,-sz*0.9,0,-sz);}
    else if(sh2==='star'){for(var st=0;st<=24;st++){var sa=st/24*Math.PI*2,sr=st%2===0?sz*1.3:sz*0.6;if(st===0)ctx.moveTo(Math.cos(sa)*sr,Math.sin(sa)*sr);else ctx.lineTo(Math.cos(sa)*sr,Math.sin(sa)*sr);}}
    else if(sh2==='irregular'){for(var il=0;il<=40;il++){var ia=il/40*Math.PI*2,ir=sz+Math.sin(ia*5+o.wobble)*sz*0.10;if(il===0)ctx.moveTo(Math.cos(ia)*ir,Math.sin(ia)*ir);else ctx.lineTo(Math.cos(ia)*ir,Math.sin(ia)*ir);}}
    else{ctx.arc(0,0,sz,0,Math.PI*2);}
    ctx.fill();
    // Bright halo edge
    // Phase contrast dark ring (diffraction edge)
    ctx.strokeStyle='rgba(40,40,30,0.5)';
    ctx.lineWidth=Math.max(0.5,sz*0.04);
    ctx.stroke();
    // Subtle inner bright ring (phase shift)
    ctx.strokeStyle='rgba(220,220,200,0.25)';
    ctx.lineWidth=Math.max(0.3,sz*0.02);
    ctx.beginPath();ctx.arc(0,0,sz*0.85,0,Math.PI*2);ctx.stroke();
  }
  else if(!skipBody)drawBody(o,sz,bc,bd);
  // Organs ALWAYS visible in play — not only at extreme zoom
  var organZoom=settings.microscopeMode?0.3:(settings.renderMode==='realistic'?0.55:0.75);
  if(zoom>organZoom || o.isPlayer || settings.microscopeMode) drawOrgans(o,sz);
  var appZoom=settings.microscopeMode?0.3:(settings.renderMode==='realistic'?0.5:0.7);
  if(zoom>appZoom || o.isPlayer || settings.microscopeMode) drawAppendages(o,sz);
  if(o.flash>0){
    // Combat-readable flash: strike = warm ring, damage = red ring (no rainbow fireworks)
    var fc2=o.flashColor||'#ff8';
    var isStrike = (fc2==='#f80'||fc2==='#8f8'||fc2==='#ffe066'||fc2==='#ff8'||fc2==='#ffaa44');
    var isDmg = (fc2==='#f44'||fc2==='#f00'||fc2==='#ff6644'||fc2==='#ff4444');
    if(isStrike){
      ctx.globalAlpha=Math.min(1,o.flash*0.85);
      ctx.strokeStyle='rgba(255,230,100,'+(0.55+o.flash*0.4)+')';
      ctx.lineWidth=Math.max(1.5,sz*0.14);
      ctx.beginPath();ctx.arc(0,0,sz*(1.15+o.flash*0.35),0,Math.PI*2);ctx.stroke();
      ctx.globalAlpha=o.flash*0.35;
      ctx.fillStyle='rgba(255,240,160,0.35)';
      ctx.beginPath();ctx.arc(0,0,sz*(1.05+o.flash*0.2),0,Math.PI*2);ctx.fill();
    } else if(isDmg){
      ctx.globalAlpha=Math.min(1,o.flash*0.8);
      ctx.strokeStyle='rgba(255,90,70,'+(0.5+o.flash*0.4)+')';
      ctx.lineWidth=Math.max(1.2,sz*0.12);
      ctx.beginPath();ctx.arc(0,0,sz*(1.1+o.flash*0.3),0,Math.PI*2);ctx.stroke();
    } else {
      ctx.globalAlpha=o.flash*0.35;
      ctx.fillStyle='rgba(220,220,200,'+o.flash*0.25+')';
      ctx.beginPath();ctx.arc(0,0,sz,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  if(false&&o.isPlayer&&state==='playing'&&!window.demoMode){ctx.globalAlpha=0.5+Math.sin(fc*0.1)*0.3;ctx.strokeStyle='#4ff';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,sz+4,0,Math.PI*2);ctx.stroke();}
  // Realistic mode: scientific label at high zoom
  if(settings.renderMode==='realistic'&&zoom>5&&!o.dying){
    ctx.save();
    ctx.scale(1/zoom,1/zoom);
    ctx.fillStyle='rgba(200,200,180,0.7)';
    ctx.font='10px monospace';
    ctx.textAlign='center';
    var labelY=-sz*zoom-15;
    ctx.fillText(o.sp.name.substring(0,25),0,labelY);
    if(o.sp.bio&&o.sp.bio.nucleus){ctx.fillText('eukaryote',0,labelY-12);}
    else if(o.sp.bio&&o.sp.bio.nucleoid){ctx.fillText('prokaryote',0,labelY-12);}
    ctx.restore();
  }
  // UI-003: Highlight edible prey with green ring
  if(false&&!o.isPlayer&&o.alive&&player&&player.alive&&state==='playing'&&zoom>3&&!window.demoMode){
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

