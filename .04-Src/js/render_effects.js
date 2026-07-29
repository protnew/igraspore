"use strict";

function renderSky(vL,vR,vT){
  if(vT>=0)return;
  var h = -vT;
  if(h < 2) return;
  var dl = (typeof dayLight==='number')?dayLight:0.5;
  var t = (typeof tod==='number')?tod:12;
  var g=ctx.createLinearGradient(0,vT,0,Math.min(0,vT+h));

  // Atmospheric sky: zenith darker, horizon pale/warm
  if(t >= 5 && t < 8){
    g.addColorStop(0,'#152a55');
    g.addColorStop(0.4,'#3d6aa8');
    g.addColorStop(0.7,'#8eb0d0');
    g.addColorStop(0.88,'#e0b888');
    g.addColorStop(1,'#f0c898');
  } else if(t >= 8 && t < 16.5){
    g.addColorStop(0,'#0a1a3a');
    g.addColorStop(0.35,'#1a4a8a');
    g.addColorStop(0.7,'#4a8ec8');
    g.addColorStop(0.9,'#7ab0d8');
    g.addColorStop(1,'#a8cce0');
  } else if(t >= 16.5 && t < 20){
    g.addColorStop(0,'#0c1028');
    g.addColorStop(0.35,'#2a2858');
    g.addColorStop(0.65,'#a05040');
    g.addColorStop(0.85,'#e07840');
    g.addColorStop(1,'#f0a060');
  } else {
    g.addColorStop(0,'#010208');
    g.addColorStop(0.7,'#060a18');
    g.addColorStop(1,'#0c1830');
  }
  ctx.fillStyle=g;
  ctx.fillRect(vL, vT, vR-vL, h);

  // Horizon haze band
  if(dl > 0.15){
    var hg = ctx.createLinearGradient(0, -Math.min(h*0.35, 80), 0, 2);
    hg.addColorStop(0,'rgba(200,220,240,0)');
    hg.addColorStop(0.6,'rgba(210,225,235,'+(0.12*dl)+')');
    hg.addColorStop(1,'rgba(230,235,240,'+(0.22*dl)+')');
    ctx.fillStyle=hg;
    ctx.fillRect(vL, -Math.min(h*0.35,80), vR-vL, Math.min(h*0.35,80)+2);
  }

  // Stars
  if(dl < 0.28){
    ctx.save();
    var seed = Math.floor((cam.x||0)/180);
    for(var si=0; si<55; si++){
      var sx = vL + ((si*97+seed*13)%Math.max(1,vR-vL));
      var sy = vT + ((si*53+21)%Math.max(1,h*0.9));
      ctx.globalAlpha = 0.25 + (si%6)*0.1;
      ctx.fillStyle = (si%7===0) ? '#ffe9c0' : '#e8eeff';
      ctx.beginPath(); ctx.arc(sx,sy,(si%4===0)?1.5:0.7,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  // ---- SUN (natural disc + atmospheric bloom + crepuscular hint) ----
  window._sunPos = null;
  if(dl>0.04 && t > 4.2 && t < 20.2){
    var dayProg = (t-5)/14;
    dayProg = Math.max(0, Math.min(1, dayProg));
    var elev = Math.sin(Math.PI * dayProg); // 0 dawn/dusk → 1 noon
    // Sun always in the visible sky ABOVE water (y<0), relative to camera
    var skyBot = 0;
    var skyTop = Math.min(vT, -20);
    var skyH = Math.max(40, skyBot - skyTop);
    // Keep sun inside the intersection of sky and current view
    var viewSkyTop = Math.max(skyTop, vT + 8);
    var viewSkyBot = skyBot - 6; // waterline
    if(viewSkyBot <= viewSkyTop) { viewSkyTop = vT + 8; viewSkyBot = Math.min(0, vT + h*0.5); }
    var viewSkyH = Math.max(30, viewSkyBot - viewSkyTop);
    // elev=1 noon → higher in sky band; elev=0 → near horizon
    var sunY = viewSkyBot - viewSkyH * (0.22 + elev * 0.62);
    var sunX = cam.x + (dayProg - 0.5) * Math.min(700, Math.max(200, (vR-vL)*0.45));
    if(!isFinite(sunX)) sunX = cam.x;
    if(!isFinite(sunY)) sunY = viewSkyTop + viewSkyH*0.4;
    // Disc size scales gently with zoom so it stays readable
    var z = (typeof zoom==='number' && zoom>0) ? zoom : 1;

    var warm = (t<8 || t>16.5) ? 1.0 : 0.55;
    // Color shifts: noon white-gold, morning/evening orange
    var coreR = 255, coreG = Math.round(245 - warm*40), coreB = Math.round(220 - warm*90);
    var rSun = (18 + elev*14) / Math.max(0.5, Math.min(z, 2.2)); // readable disc
    if(rSun < 10) rSun = 10;

    ctx.save();
    // Huge atmospheric scatter (god-haze)
    var big = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 380 + elev*80);
    big.addColorStop(0, 'rgba('+coreR+','+coreG+','+coreB+','+(0.55*dl)+')');
    big.addColorStop(0.08, 'rgba(255,'+Math.round(220-warm*30)+','+Math.round(140-warm*40)+','+(0.28*dl)+')');
    big.addColorStop(0.22, 'rgba(255,'+Math.round(200-warm*20)+',120,'+(0.12*dl)+')');
    big.addColorStop(0.5, 'rgba(180,200,255,'+(0.05*dl)+')');
    big.addColorStop(1, 'rgba(100,140,200,0)');
    ctx.fillStyle = big;
    ctx.beginPath(); ctx.arc(sunX, sunY, 380+elev*80, 0, Math.PI*2); ctx.fill();

    // Soft outer corona
    var mid = ctx.createRadialGradient(sunX, sunY, rSun*0.3, sunX, sunY, rSun*6);
    mid.addColorStop(0, 'rgba(255,252,240,'+(0.9*dl)+')');
    mid.addColorStop(0.35, 'rgba(255,'+Math.round(230-warm*25)+','+Math.round(160-warm*50)+','+(0.45*dl)+')');
    mid.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = mid;
    ctx.beginPath(); ctx.arc(sunX, sunY, rSun*6, 0, Math.PI*2); ctx.fill();

    // Photosphere disc
    ctx.globalCompositeOperation = 'source-over';
    var disc = ctx.createRadialGradient(sunX - rSun*0.25, sunY - rSun*0.25, 0, sunX, sunY, rSun);
    disc.addColorStop(0, '#fffef8');
    disc.addColorStop(0.45, 'rgb('+coreR+','+coreG+','+coreB+')');
    disc.addColorStop(0.85, 'rgb(255,'+Math.round(200-warm*40)+','+Math.round(120-warm*30)+')');
    disc.addColorStop(1, 'rgba(255,160,60,0.15)');
    ctx.fillStyle = disc;
    ctx.shadowColor = 'rgba(255,220,120,'+(0.65*dl)+')';
    ctx.shadowBlur = 28 + elev*18;
    ctx.beginPath(); ctx.arc(sunX, sunY, rSun, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Subtle limb darkening ring
    ctx.strokeStyle = 'rgba(255,200,100,'+(0.25*dl)+')';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(sunX, sunY, rSun*1.05, 0, Math.PI*2); ctx.stroke();

    // Short crepuscular rays (from sun, soft)
    if(dl > 0.25){
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.08 * dl;
      for(var ri=0; ri<7; ri++){
        var ang = -Math.PI/2 + (ri-3)*0.11 + Math.sin((gt||0)*0.05+ri)*0.02;
        var len = 180 + ri*25 + elev*40;
        var rw = 6 + ri*1.5;
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(ang);
        var rg = ctx.createLinearGradient(0,0,0,len);
        rg.addColorStop(0,'rgba(255,245,200,0.9)');
        rg.addColorStop(0.4,'rgba(255,230,160,0.25)');
        rg.addColorStop(1,'rgba(255,220,140,0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(-rw, rSun*0.8);
        ctx.lineTo(rw, rSun*0.8);
        ctx.lineTo(rw*2.5, len);
        ctx.lineTo(-rw*2.5, len);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();

    window._sunPos = {x:sunX, y:sunY, r:rSun, elev:elev, warm:warm, dl:dl};
  }

  // Volumetric-ish soft clouds (multi-blob, shaded)
  if(window.skyClouds && dl>0.18) {
    ctx.save();
    for(var i=0; i<window.skyClouds.length; i++) {
      var c = window.skyClouds[i];
      if(c.x+c.w < vL-50 || c.x-c.w > vR+50) continue;
      var cy = Math.min(c.y, -12);
      var baseA = 0.28 + 0.35*dl;
      // underside shade
      ctx.fillStyle = 'rgba(160,175,195,'+(baseA*0.45)+')';
      ctx.beginPath(); ctx.ellipse(c.x+4, cy+c.h*0.12, c.w*0.48, c.h*0.38, 0, 0, Math.PI*2); ctx.fill();
      // main body
      ctx.fillStyle = 'rgba(255,255,255,'+baseA+')';
      ctx.beginPath(); ctx.ellipse(c.x, cy, c.w*0.5, c.h*0.42, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(c.x-c.w*0.22, cy+2, c.w*0.3, c.h*0.32, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(c.x+c.w*0.2, cy+1, c.w*0.28, c.h*0.3, 0, 0, Math.PI*2); ctx.fill();
      // lit top edge
      ctx.fillStyle = 'rgba(255,255,255,'+(baseA*0.5)+')';
      ctx.beginPath(); ctx.ellipse(c.x-c.w*0.05, cy-c.h*0.12, c.w*0.22, c.h*0.14, 0, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
}


function renderWater(vL,vR,vT,vB){
  ctx.save();
  var realMode=settings.renderMode==='realistic';
  var realMul=realMode?0.85:1.0;
  var grad = ctx.createLinearGradient(0, 0, 0, PD);
  var lightTop = lightAt(0)*realMul, lightMid = lightAt(PD*0.5)*realMul, lightBot = lightAt(PD)*realMul;
  
  // Natural pond: green-blue photic zone → deep teal → dark benthos
  var lt=lightTop, lm=lightMid, lb=lightBot;
  grad.addColorStop(0, 'rgb('+Math.round(12+lt*28)+','+Math.round(70+lt*65)+','+Math.round(85+lt*55)+')');
  grad.addColorStop(0.12, 'rgb('+Math.round(10+lt*20)+','+Math.round(55+lt*48)+','+Math.round(75+lt*50)+')');
  grad.addColorStop(0.45, 'rgb('+Math.round(8+lm*12)+','+Math.round(30+lm*28)+','+Math.round(55+lm*35)+')');
  grad.addColorStop(0.75, 'rgb('+Math.round(10+lb*8)+','+Math.round(22+lb*14)+','+Math.round(40+lb*22)+')');
  grad.addColorStop(1, 'rgb('+Math.round(12+lb*6)+','+Math.round(18+lb*8)+','+Math.round(22+lb*10)+')');
  if(season===3) grad.addColorStop(0, 'rgba(180,195,210,0.75)');
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-halfW(0), 0);
  for(var dd=10; dd<=PD; dd+=10) ctx.lineTo(-halfW(dd), dd);
  for(var dd=PD; dd>=0; dd-=10) ctx.lineTo(halfW(dd), dd);
  ctx.closePath();
  ctx.fill();
  // SURFACE_SHIMMER — sunlit surface film + soft caustics near top
  if(dayLight > 0.2){
    ctx.save();
    var sh = ctx.createLinearGradient(0, -2, 0, PD*0.18);
    sh.addColorStop(0, 'rgba(180,230,255,'+(0.18*dayLight)+')');
    sh.addColorStop(0.35, 'rgba(120,200,180,'+(0.08*dayLight)+')');
    sh.addColorStop(1, 'rgba(80,160,140,0)');
    ctx.fillStyle = sh;
    ctx.fillRect(vL, -4, vR-vL, PD*0.18);
    // Surface line (meniscus)
    ctx.strokeStyle = 'rgba(200,240,255,'+(0.35*dayLight)+')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for(var sx=vL; sx<=vR; sx+=14){
      var sy = Math.sin(sx*0.04 + (gt||0)*1.2)*1.2;
      if(sx===vL) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    // Caustic blobs
    ctx.globalAlpha = 0.12*dayLight;
    ctx.fillStyle = '#cfe';
    for(var ci=0; ci<8; ci++){
      var cx = cam.x + Math.sin(ci*1.7+(gt||0)*0.4)*180;
      var cy = 20 + (ci%4)*18 + Math.cos(ci+(gt||0)*0.5)*6;
      ctx.beginPath(); ctx.ellipse(cx, cy, 28+ci*3, 6, ci*0.2, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
  
  // Volumetric Shadows from Clouds
  var isDay = (tod>6 && tod<18);
  if (isDay && window.skyClouds && dayLight > 0.3) {
      ctx.save();
      for(var i=0; i<window.skyClouds.length; i++) {
          var c = window.skyClouds[i];
          if(c.x+c.w < vL || c.x-c.w > vR) continue;
          var sg = ctx.createLinearGradient(0, 0, 0, PD);
          sg.addColorStop(0, 'rgba(0, 5, 15, 0.4)');
          sg.addColorStop(1, 'rgba(0, 5, 15, 0)');
          ctx.fillStyle = sg;
          ctx.beginPath();
          var sx1 = c.x - c.w*0.4;
          var sx2 = c.x + c.w*0.4;
          var sunAngle = (tod - 12) / 6; // -1 to 1
          var spread = 300;
          ctx.moveTo(sx1, 0); ctx.lineTo(sx2, 0);
          ctx.lineTo(sx2 + sunAngle*spread, PD); ctx.lineTo(sx1 + sunAngle*spread, PD);
          ctx.fill();
      }
      ctx.restore();
  }
  
  // Ocean snow
  if(window.oceanSnow && zoom>1.5) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      for(var i=0; i<window.oceanSnow.length; i++) {
          var s = window.oceanSnow[i];
          if(s.x < vL || s.x > vR || s.y < vT || s.y > vB) continue;
          ctx.moveTo(s.x, s.y);
          ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      }
      ctx.fill();
  }
  
  ctx.restore();
  // Surface light glow when sun is shining (gradient cached)
  if(dayLight>0.2){ctx.save();ctx.globalCompositeOperation='screen';
    if(!window._surfGlowCache){
      window._surfGlowCache=ctx.createLinearGradient(0,-5,0,30);
      window._surfGlowCache.addColorStop(0,'rgba(255,240,200,0.2)');
      window._surfGlowCache.addColorStop(1,'rgba(255,240,200,0)');
    }
    ctx.globalAlpha=dayLight;
    ctx.fillStyle=window._surfGlowCache;ctx.fillRect(-halfW(0),-5,halfW(0)*2,35);
    ctx.restore();}
  // Sun shafts penetrating deep water — visible from any depth
  if(dayLight > 0.15) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    var shaftAlpha = dayLight * 0.15;
    var shaftColor = 'rgba(255,245,200,';
    ctx.fillStyle = shaftColor + shaftAlpha + ')';
    ctx.beginPath();
    var surfW = halfW(0);
    var sunPos = (tod - 5) / 14; // 0 to 1 across daytime
    if(sunPos < 0) sunPos = 0;
    if(sunPos > 1) sunPos = 1;
    // 5 light shafts from surface going down
    for(var s = 0; s < 5; s++) {
      var sx = -surfW*0.7 + (surfW*1.4) * (s/4) + (sunPos-0.5)*200;
      var w1 = 80, w2 = 200;
      ctx.moveTo(sx - w1/2, 0);
      ctx.lineTo(sx + w1/2, 0);
      ctx.lineTo(sx + w2/2 + (sunPos-0.5)*1000, PD);
      ctx.lineTo(sx - w2/2 + (sunPos-0.5)*1000, PD);
      ctx.closePath();
    }
    ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle='rgba(140,200,240,'+(0.3+dayLight*0.3)+')';ctx.lineWidth=2;ctx.beginPath();
  var surfW=halfW(0);
  for(var x=-surfW;x<=surfW;x+=8){var wave=Math.sin(x*0.02+fc*0.05)*2;if(x===-surfW)ctx.moveTo(x,wave);else ctx.lineTo(x,wave);}
  ctx.stroke();
  
  // Natural lily pads (Nymphaea) + duckweed clusters on surface
  ctx.save();
  drawNaturalLilypads(vL, vR, surfW);
  ctx.restore();
  
  // Ice layer
  if(SEASONS[season].ice > 0) {
      ctx.save();
      var iceAlpha = SEASONS[season].ice * 0.7;
      ctx.fillStyle = 'rgba(210, 240, 255, '+iceAlpha+')';
      ctx.beginPath();
      for(var x=-surfW;x<=surfW;x+=10){var wave=Math.sin(x*0.02+fc*0.05)*0.5;if(x===-surfW)ctx.moveTo(x,wave);else ctx.lineTo(x,wave);}
      ctx.lineTo(surfW, SEASONS[season].ice * 30);
      ctx.lineTo(-surfW, SEASONS[season].ice * 30);
      ctx.closePath();
      ctx.fill();
      
      // Ice bottom jagged edge
      ctx.strokeStyle = 'rgba(230, 250, 255, '+(iceAlpha+0.2)+')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(var x=-surfW;x<=surfW;x+=15){
          var bot = SEASONS[season].ice * 30 + Math.sin(x*0.1 + fc*0.01)*3 + Math.cos(x*0.05)*4;
          if(x===-surfW) ctx.moveTo(x, bot); else ctx.lineTo(x, bot);
      }
      ctx.stroke();
      ctx.restore();
  }
  
  if(dayLight>0.3){ctx.fillStyle='rgba(200,230,255,'+(dayLight*0.06)+')';ctx.beginPath();
    for(var x=-surfW;x<=surfW;x+=10){var wave=Math.sin(x*0.02+fc*0.05)*2;if(x===-surfW)ctx.moveTo(x,wave);else ctx.lineTo(x,wave);}
    ctx.lineTo(surfW,5);ctx.lineTo(-surfW,5);ctx.closePath();ctx.fill();}
  // Solid Dirt/Rock Walls outside the pond
  ctx.fillStyle='#0f0c08'; // very dark brown
  // Left wall
  ctx.beginPath();
  ctx.moveTo(vL-500, 0);
  for(var dd=0;dd<=PD;dd+=10) ctx.lineTo(-halfW(dd), dd);
  ctx.lineTo(-halfW(PD), vB+500);
  ctx.lineTo(vL-500, vB+500);
  ctx.closePath(); ctx.fill();
  
  // Right wall
  ctx.beginPath();
  ctx.moveTo(vR+500, 0);
  for(var dd=0;dd<=PD;dd+=10) ctx.lineTo(halfW(dd), dd);
  ctx.lineTo(halfW(PD), vB+500);
  ctx.lineTo(vR+500, vB+500);
  ctx.closePath(); ctx.fill();

  // Left shore edge
  ctx.strokeStyle='rgba(80,65,40,0.8)';ctx.lineWidth=5;ctx.beginPath();
  for(var dd=0;dd<=PD;dd+=10) ctx.lineTo(-halfW(dd),dd);
  ctx.stroke();
  // Right shore edge
  ctx.beginPath();
  for(var dd=0;dd<=PD;dd+=10) ctx.lineTo(halfW(dd),dd);
  ctx.stroke();
  // Shore highlight (lighter top edge)
  ctx.strokeStyle='rgba(120,100,60,0.3)';ctx.lineWidth=3;
  ctx.beginPath();
  for(var dd=0;dd<=PD*0.3;dd+=10){ctx.lineTo(-halfW(dd)+3,dd);}
  ctx.stroke();
  ctx.beginPath();
  for(var dd=0;dd<=PD*0.3;dd+=10){ctx.lineTo(halfW(dd)-3,dd);}
  ctx.stroke();

  if(typeof isWinter !== 'undefined' && isWinter) {
    ctx.fillStyle = 'rgba(200,255,255,0.3)';
    ctx.fillRect(-PW, 0, PW*2, 20);
  }

  // Abyss boundary
  ctx.fillStyle = 'rgba(0, 5, 12, 0.95)';
  ctx.fillRect(-PW*2, PD, PW*4, 4000);
  ctx.strokeStyle = 'rgba(20, 40, 60, 0.8)';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 15]);
  ctx.beginPath(); ctx.moveTo(-PW*2, PD); ctx.lineTo(PW*2, PD); ctx.stroke();
  ctx.setLineDash([]);
}

function renderParallax(vL,vR,vT,vB){
  // 3 Layers of dust/plankton moving at different speeds
  ctx.save();
  var pLayers = [
     {speed: 0.1, count: 50, size: 1, color: 'rgba(200,255,200,0.1)'},
     {speed: 0.3, count: 40, size: 2, color: 'rgba(150,255,150,0.15)'},
     {speed: 0.6, count: 30, size: 3, color: 'rgba(100,255,100,0.2)'}
  ];
  for (var l=0; l<pLayers.length; l++) {
     var layer = pLayers[l];
     ctx.fillStyle = layer.color;
     for (var i=0; i<layer.count; i++) {
        // pseudo-random but deterministic placement based on layer and index
        var x = (((i*173 + l*91) * 13) % (PW*4)) - PW*2;
        var y = (((i*311 + l*17) * 7) % (PD*1.5)) - PD*0.2;
        
        // apply parallax shift based on camera
        x += cam.x * (1 - layer.speed);
        y += cam.y * (1 - layer.speed);
        
        // wrap around
        var pWidth = PW*2;
        x = ((x + PW) % pWidth);
        if(x < 0) x += pWidth;
        x -= PW;

        if (x > vL && x < vR && y > vT && y < vB) {
           ctx.beginPath();
           ctx.arc(x, y, layer.size, 0, Math.PI*2);
           ctx.fill();
        }
     }
  }
  ctx.restore();
}


/** Natural lily pad: round leaf with characteristic V-notch + veins + rim */
function drawOneLilypad(cx, cy, rx, ry, rot, seed, sun){
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot || 0);
  var notch = 0.42; // V-cleft half-angle (classic Nymphaea)

  // Underwater contact shadow
  ctx.fillStyle = 'rgba(5,25,20,0.28)';
  ctx.beginPath();
  ctx.ellipse(4, 6, rx*1.08, ry*1.25, 0, 0, Math.PI*2);
  ctx.fill();

  // Build leaf path in local unit circle then scale via transform
  function leafPath(scaleR){
    ctx.beginPath();
    ctx.moveTo(Math.cos(notch)*rx*scaleR*0.05, Math.sin(notch)*ry*scaleR*0.05);
    // outer rim with gentle scallops
    var steps = 48;
    var a0 = notch, a1 = Math.PI*2 - notch;
    for(var i=0;i<=steps;i++){
      var a = a0 + (a1-a0)*(i/steps);
      var scallop = 1 + Math.sin(a*6 + seed)*0.03 + Math.sin(a*3.5)*0.02;
      var px = Math.cos(a)*rx*scaleR*scallop;
      var py = Math.sin(a)*ry*scaleR*scallop;
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    // back to center along notch edges
    ctx.lineTo(0,0);
    ctx.closePath();
  }

  // Solid body fill
  leafPath(1);
  var lg = ctx.createRadialGradient(-rx*0.2, -ry*0.25, rx*0.05, 0, 0, rx);
  var g0 = 95 + (seed%7)*3, g1 = 70 + (seed%5)*2, g2 = 48;
  lg.addColorStop(0, 'rgb('+(g0-10)+','+(g0+25)+','+(g0-40)+')');
  lg.addColorStop(0.4, 'rgb('+(g1-15)+','+(g1+20)+','+(g1-30)+')');
  lg.addColorStop(0.78, 'rgb('+(g2)+','+(g2+22)+','+(g2-10)+')');
  lg.addColorStop(1, 'rgb(28,58,30)');
  ctx.fillStyle = lg;
  ctx.globalAlpha = 0.96;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Darker rim
  leafPath(1);
  ctx.strokeStyle = 'rgba(18,48,20,0.75)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Thin growth rings (very subtle)
  ctx.strokeStyle = 'rgba(20,55,25,0.1)';
  ctx.lineWidth = 0.9;
  for(var ring=0.4; ring<=0.85; ring+=0.22){
    ctx.beginPath();
    var steps=36, a0=notch, a1=Math.PI*2-notch;
    for(var i=0;i<=steps;i++){
      var a=a0+(a1-a0)*(i/steps);
      var px=Math.cos(a)*rx*ring, py=Math.sin(a)*ry*ring;
      if(i===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.stroke();
  }

  // Veins — soft, not wireframe grid
  ctx.lineCap = 'round';
  var veins = 11;
  for(var v=0; v<veins; v++){
    var a = notch + (Math.PI*2 - 2*notch) * (v+0.5)/veins;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(25,70,30,'+(0.14 + (v%3===0?0.08:0))+')';
    ctx.lineWidth = (v%3===0) ? 1.3 : 0.7;
    ctx.moveTo(Math.cos(a)*rx*0.06, Math.sin(a)*ry*0.06);
    ctx.quadraticCurveTo(
      Math.cos(a)*rx*0.5 + Math.sin(a)*rx*0.05,
      Math.sin(a)*ry*0.5 - Math.cos(a)*ry*0.05,
      Math.cos(a)*rx*0.9,
      Math.sin(a)*ry*0.9
    );
    ctx.stroke();
  }

  // Wet specular highlight
  var hx = -rx*0.28, hy = -ry*0.32;
  if(sun){
    var sdx = sun.x - cx, sdy = sun.y - cy;
    var sd = Math.sqrt(sdx*sdx+sdy*sdy)||1;
    hx = -(sdx/sd) * rx * 0.3;
    hy = -(sdy/sd) * ry * 0.3;
  }
  var hg2 = ctx.createRadialGradient(hx, hy, 0, hx, hy, rx*0.5);
  hg2.addColorStop(0, 'rgba(230,255,210,0.28)');
  hg2.addColorStop(0.45, 'rgba(180,230,150,0.1)');
  hg2.addColorStop(1, 'rgba(100,160,80,0)');
  ctx.fillStyle = hg2;
  ctx.beginPath(); ctx.ellipse(hx, hy, rx*0.42, ry*0.32, 0, 0, Math.PI*2); ctx.fill();

  // Notch (cleft) darker lips
  ctx.strokeStyle = 'rgba(12,40,16,0.8)';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(notch)*rx*0.98, Math.sin(notch)*ry*0.98);
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(-notch)*rx*0.98, Math.sin(-notch)*ry*0.98);
  ctx.stroke();
  // petiole hint at center
  ctx.fillStyle = 'rgba(40,70,35,0.85)';
  ctx.beginPath(); ctx.arc(0,0, Math.max(2, rx*0.04), 0, Math.PI*2); ctx.fill();

  // Edge age spots
  ctx.fillStyle = 'rgba(70,55,30,0.22)';
  for(var sp=0; sp<3; sp++){
    var sa = seed*0.5 + sp*2.1 + 1.2;
    if(sa > Math.PI*2 - notch || sa < notch) sa = notch + 0.5 + sp;
    ctx.beginPath();
    ctx.ellipse(Math.cos(sa)*rx*0.72, Math.sin(sa)*ry*0.68, 3+sp, 1.6, sa, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

function drawDuckweed(cx, cy, n, seed){
  ctx.save();
  for(var i=0;i<n;i++){
    var ox = Math.sin(seed*1.3+i*2.1)*18 + Math.cos(i*0.9)*8;
    var oy = Math.cos(seed*0.8+i*1.7)*6 + Math.sin(i*1.1)*3;
    var s = 2.2 + (i%3)*0.7;
    ctx.fillStyle = (i%2===0) ? 'rgba(70,140,50,0.85)' : 'rgba(50,120,40,0.8)';
    ctx.beginPath(); ctx.ellipse(cx+ox, cy+oy, s*1.3, s*0.9, i*0.5, 0, Math.PI*2); ctx.fill();
    // second lobe of Lemna
    ctx.beginPath(); ctx.ellipse(cx+ox+s*0.9, cy+oy+0.5, s*1.1, s*0.75, i*0.5+0.3, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawNaturalLilypads(vL, vR, surfW){
  var sun = window._sunPos;
  var t = (typeof gt==='number')?gt:0;
  // Deterministic pads across pond width
  var pads = [];
  for(var lp=-surfW+100; lp<surfW-40; lp+=380) {
    // skip some for sparsity
    var skip = Math.abs(Math.floor(lp/420)) % 5 === 2;
    if(skip) continue;
    var wy = Math.sin(lp*0.018 + t*0.04)*1.8;
    var rx = 95 + Math.abs(Math.sin(lp*0.01))*55; // leaf radius (world units)
    var ry = rx * (0.32 + Math.abs(Math.cos(lp*0.007))*0.1); // flattened perspective near surface
    var rot = Math.sin(lp*0.003)*0.5 + 0.2;
    pads.push({x:lp + Math.sin(lp*0.02)*30, y:wy - 1, rx:rx, ry:ry, rot:rot, seed:Math.abs(Math.floor(lp))});
    // occasional smaller pad nearby
    if(Math.abs(lp) % 7 !== 0){
      pads.push({
        x: lp + 70 + Math.cos(lp)*20,
        y: wy + Math.sin(lp*0.05)*2,
        rx: rx*0.55, ry: ry*0.55,
        rot: rot + 0.8,
        seed: Math.abs(Math.floor(lp))+3
      });
    }
  }
  // Draw only visible
  for(var i=0;i<pads.length;i++){
    var p = pads[i];
    if(p.x+p.rx < vL-20 || p.x-p.rx > vR+20) continue;
    drawOneLilypad(p.x, p.y, p.rx, p.ry, p.rot, p.seed, sun);
  }
  // Duckweed patches between pads
  for(var d=-surfW+150; d<surfW; d+=520){
    if(Math.abs(Math.floor(d/100))%3===0) continue;
    var dy = Math.sin(d*0.02+t*0.05)*2;
    if(d < vL-30 || d > vR+30) continue;
    drawDuckweed(d, dy, 7 + (Math.abs(Math.floor(d))%5), d);
  }
}

/** Sun glitter path on water surface (call from water/surface render) */
function renderSunGlitter(vL, vR){
  var sun = window._sunPos;
  if(!sun || sun.dl < 0.2) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  // Specular column from sun down to surface
  var gx = sun.x;
  var gtop = Math.min(0, sun.y + 20);
  var gg = ctx.createLinearGradient(gx, gtop, gx, 90);
  gg.addColorStop(0, 'rgba(255,250,220,0)');
  gg.addColorStop(0.3, 'rgba(255,245,200,'+(0.08*sun.dl)+')');
  gg.addColorStop(0.85, 'rgba(255,240,180,'+(0.18*sun.dl)+')');
  gg.addColorStop(1, 'rgba(255,230,150,0)');
  ctx.fillStyle = gg;
  ctx.beginPath();
  ctx.moveTo(gx - 8, gtop);
  ctx.lineTo(gx + 8, gtop);
  ctx.lineTo(gx + 55, 70);
  ctx.lineTo(gx - 55, 70);
  ctx.closePath();
  ctx.fill();
  // Sparkles on surface
  var t = (typeof gt==='number')?gt:0;
  ctx.fillStyle = 'rgba(255,255,230,'+(0.35*sun.dl)+')';
  for(var i=0;i<12;i++){
    var sx = gx + Math.sin(t*1.3 + i*1.7)*70 + Math.cos(i*2.1)*20;
    var sy = 2 + Math.abs(Math.sin(t*2+i))*6;
    if(sx<vL||sx>vR) continue;
    var sr = 1.2 + (i%3)*0.8;
    ctx.globalAlpha = 0.3 + 0.5*Math.abs(Math.sin(t*3+i));
    ctx.beginPath(); ctx.ellipse(sx, sy, sr*2.5, sr*0.6, 0, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}
window.drawNaturalLilypads = drawNaturalLilypads;
window.renderSunGlitter = renderSunGlitter;

function renderSunRays(vL,vR){
  if(dayLight<0.15)return;ctx.save();ctx.globalCompositeOperation='screen';
  for(var i=0;i<sunRays.length;i++){
    var sr=sunRays[i];if(sr.x<vL-100||sr.x>vR+100)continue;
    var opacity=dayLight*0.25;
    var g=ctx.createLinearGradient(sr.x,0,sr.x+sr.angle*300,PD*0.7);
    g.addColorStop(0,'rgba(255,250,210,'+(opacity*1.2)+')');g.addColorStop(0.35,'rgba(200,240,180,'+(opacity*0.55)+')');g.addColorStop(0.7,'rgba(120,200,160,'+(opacity*0.2)+')');g.addColorStop(1,'rgba(80,160,140,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sr.x-sr.w/2,0);ctx.lineTo(sr.x+sr.w/2,0);
    ctx.lineTo(sr.x+sr.w/2+sr.angle*PD*0.7+sr.w*0.3,PD*0.7);ctx.lineTo(sr.x-sr.w/2+sr.angle*PD*0.7-sr.w*0.3,PD*0.7);
    ctx.closePath();ctx.fill();
  }
  ctx.restore();
}

function renderSediment(vL,vR,vB){
  // Organic curved bottom — multiple layers of sediment
  var sx0=Math.max(vL-50,-PW),sx1=Math.min(vR+50,PW);
  // Deep mud layer
  ctx.fillStyle='#2a1d0e';ctx.beginPath();
  ctx.moveTo(sx0,PD+50);
  for(var x=sx0;x<=sx1;x+=10){
    var hw=halfW(PD);
    if(Math.abs(x)>hw){continue;}
    var bump=Math.sin(x*0.015)*8+Math.sin(x*0.04+2)*5+Math.sin(x*0.08+1)*3;
    var mudY=PD-15+bump;
    ctx.lineTo(x,mudY);
  }
  ctx.lineTo(sx1,PD+50);ctx.closePath();ctx.fill();
  // Lighter sediment layer on top
  ctx.fillStyle='#3d2a15';ctx.beginPath();
  for(var x=sx0;x<=sx1;x+=8){
    var hw=halfW(PD);
    if(Math.abs(x)>hw)continue;
    var bump=Math.sin(x*0.02+1)*5+Math.sin(x*0.06)*3;
    ctx.lineTo(x,PD-8+bump);
  }
  ctx.lineTo(sx1,PD+20);ctx.lineTo(sx0,PD+20);ctx.closePath();ctx.fill();
  // Sand/silt specks
  ctx.fillStyle='rgba(90,70,40,0.5)';
  for(var x=sx0;x<=sx1;x+=6){
    var hw=halfW(PD);
    if(Math.abs(x)>hw)continue;
    var bump=Math.sin(x*0.015)*8+Math.sin(x*0.04+2)*5;
    var yy=PD-12+bump+rng(-2,2);
    ctx.beginPath();ctx.ellipse(x,yy,rng(3,8),rng(1,3),0,0,Math.PI*2);ctx.fill();
  }
  // Decaying leaves/organic matter
  for(var i=0;i<sedimentClumps.length;i++){var sc=sedimentClumps[i];if(sc.x<vL-30||sc.x>vR+30)continue;
    ctx.save();ctx.translate(sc.x,sc.y);ctx.rotate(sc.rot);
    ctx.fillStyle='rgba(50,35,15,0.8)';ctx.beginPath();ctx.ellipse(0,0,sc.w,sc.h,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(70,50,25,0.5)';ctx.beginPath();ctx.ellipse(-sc.w*0.3,-sc.h*0.2,sc.w*0.4,sc.h*0.3,0,0,Math.PI*2);ctx.fill();
    ctx.restore();}
  // Small rocks
  ctx.fillStyle='rgba(60,55,50,0.6)';
  for(var i=0;i<15;i++){
    var seed=i*7919;var rx=((seed%2000)/2000-0.5)*BW*1.5;
    var bump=Math.sin(rx*0.015)*8;var ry=PD-10+bump+rng(-1,3);
    if(rx<vL-20||rx>vR+20)continue;
    ctx.beginPath();ctx.ellipse(rx,ry,rng(4,10),rng(3,6),rng(0,3),0,Math.PI*2);ctx.fill();
  }
}

function renderNutrients(vL,vR,vT,vB){
  for(var i=0;i<nutrientClouds.length;i++){var nc=nutrientClouds[i];
    if(nc.x<vL-nc.r||nc.x>vR+nc.r||nc.y<vT-nc.r||nc.y>vB+nc.r)continue;
    var g=ctx.createRadialGradient(nc.x,nc.y,0,nc.x,nc.y,nc.r);
    g.addColorStop(0,'rgba(100,140,70,'+(nc.intensity*0.1)+')');g.addColorStop(1,'rgba(100,140,70,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(nc.x,nc.y,nc.r,0,Math.PI*2);ctx.fill();}
    
  if (window.toxicClouds) {
      for(var i=0;i<window.toxicClouds.length;i++){
          var tc=window.toxicClouds[i];
          if(tc.x<vL-tc.r||tc.x>vR+tc.r||tc.y<vT-tc.r||tc.y>vB+tc.r)continue;
          var tg=ctx.createRadialGradient(tc.x,tc.y,0,tc.x,tc.y,tc.r);
          tg.addColorStop(0,'rgba(50,255,50,'+(Math.max(0, tc.life*0.5))+')');
          tg.addColorStop(1,'rgba(50,255,50,0)');
          ctx.fillStyle=tg;ctx.beginPath();ctx.arc(tc.x,tc.y,tc.r,0,Math.PI*2);ctx.fill();
      }
  }
}

function renderShadows(vL,vR,vT,vB){
  // Microorganism shadows disabled — not convincing at microscopic scale.
  // Light scattering in water doesn't produce sharp directional shadows.
  return;
}

function renderBubbles(vL,vR,vT,vB){
  ctx.save();ctx.strokeStyle='rgba(180,230,255,0.35)';ctx.lineWidth=1;
  for(var i=0;i<o2Bubbles.length;i++){var b=o2Bubbles[i];
    if(b.x<vL||b.x>vR||b.y<vT||b.y>vB)continue;
    ctx.globalAlpha=b.life*0.5;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

function renderRain(vL,vR,vT){
  ctx.save();ctx.strokeStyle='rgba(150,180,220,0.35)';ctx.lineWidth=1;
  for(var i=0;i<rainDrops.length;i++){var r=rainDrops[i];if(r.x<vL||r.x>vR||r.y<vT)continue;
    ctx.globalAlpha=r.life*0.5;ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-r.vx*2,r.y-r.vy*2);ctx.stroke();}
  ctx.restore();
}

