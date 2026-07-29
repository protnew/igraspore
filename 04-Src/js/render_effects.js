"use strict";

function renderSky(vL,vR,vT){
  // Sky only for the band above waterline (y < 0)
  if(vT >= -1) return;
  var skyBot = Math.min(0, (typeof arguments[3]==='number'?arguments[3]:0));
  // h = height of sky region in world units
  var h = -vT;
  if(h < 1) return;

  var dl = (typeof dayLight==='number') ? dayLight : 0.6;
  var t = (typeof tod==='number') ? tod : 12;
  var z = (typeof zoom==='number' && zoom>0) ? zoom : 1;

  // --- Sky gradient (always readable, never pitch black in daytime) ---
  var g = ctx.createLinearGradient(0, vT, 0, 0);
  if(t >= 5.5 && t < 8){
    // dawn
    g.addColorStop(0, '#1a2a5a');
    g.addColorStop(0.55, '#6a90c0');
    g.addColorStop(0.85, '#e8b888');
    g.addColorStop(1, '#ffd0a0');
  } else if(t >= 8 && t < 17){
    // day — clear blue
    g.addColorStop(0, '#0b1e4a');
    g.addColorStop(0.35, '#1e5aaa');
    g.addColorStop(0.7, '#4a9ad8');
    g.addColorStop(0.92, '#8ec8e8');
    g.addColorStop(1, '#b8dcf0');
  } else if(t >= 17 && t < 20){
    // dusk
    g.addColorStop(0, '#0c0e28');
    g.addColorStop(0.4, '#3a2860');
    g.addColorStop(0.7, '#c06040');
    g.addColorStop(1, '#f09050');
  } else {
    // night
    g.addColorStop(0, '#02040c');
    g.addColorStop(0.8, '#0a1228');
    g.addColorStop(1, '#121c38');
  }
  ctx.fillStyle = g;
  ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);

  // Horizon glow strip just above water
  if(dl > 0.12){
    var hg = ctx.createLinearGradient(0, -Math.min(h*0.4, 70), 0, 1);
    hg.addColorStop(0, 'rgba(200,220,240,0)');
    hg.addColorStop(0.7, 'rgba(220,235,250,' + (0.18*dl) + ')');
    hg.addColorStop(1, 'rgba(255,250,230,' + (0.28*dl) + ')');
    ctx.fillStyle = hg;
    ctx.fillRect(vL, -Math.min(h*0.4, 70), vR-vL, Math.min(h*0.4, 70)+2);
  }

  // Stars at night
  if(dl < 0.25){
    ctx.save();
    for(var si=0; si<40; si++){
      var sx = vL + ((si*97 + Math.floor(cam.x/100)*13) % Math.max(1, vR-vL));
      var sy = vT + 8 + ((si*53) % Math.max(1, h*0.85));
      ctx.globalAlpha = 0.3 + (si%5)*0.12;
      ctx.fillStyle = '#e8eeff';
      ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  // Soft cloud puffs (day only)
  if(dl > 0.3 && window.skyClouds){
    ctx.save();
    for(var i=0; i<window.skyClouds.length; i++){
      var c = window.skyClouds[i];
      if(c.x + c.w < vL - 40 || c.x - c.w > vR + 40) continue;
      var cy = Math.min(c.y, -18);
      if(cy > -8) continue;
      ctx.globalAlpha = 0.35 * dl;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(c.x, cy, c.w*0.45, c.h*0.35, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(c.x - c.w*0.2, cy+2, c.w*0.28, c.h*0.28, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(c.x + c.w*0.18, cy+1, c.w*0.25, c.h*0.26, 0, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  // ========== ONE SUN ==========
  window._sunPos = null;
  if(dl > 0.05 && t > 4.5 && t < 20.5){
    var dayProg = Math.max(0, Math.min(1, (t - 5) / 14));
    var elev = Math.sin(Math.PI * dayProg); // 0..1
    // Keep sun inside the visible sky rectangle
    var margin = 16;
    var sunX = cam.x + (dayProg - 0.5) * Math.min(Math.max(vR-vL, 200)*0.5, 520);
    // Near horizon at dawn/dusk, higher at noon — but always in sky band
    // Prefer sun in upper-middle of visible sky; if camera deep, keep sun near horizon film
    var sunY = -12 - elev * Math.min(h * 0.55, 140);
    if(typeof cam!=='undefined' && cam.y > 20){
      // keep sun close above waterline so it sits in frame with pads
      sunY = -18 - elev * 28;
    }
    if(sunY < vT + margin) sunY = vT + margin;
    if(sunY > -8) sunY = -8;
    if(sunX < vL + margin) sunX = vL + margin;
    if(sunX > vR - margin) sunX = vR - margin;

    // Warm colors: noon white-gold, low sun orange
    var warm = (t < 8 || t > 16.5) ? 1 : 0.45;
    // Disc radius in WORLD units — large enough to read at typical zoom
    var rSun = Math.max(14, (22 + elev * 10) / Math.max(0.55, Math.min(z, 2.0)));

    ctx.save();
    // Atmospheric bloom (single, soft)
    var bloomR = rSun * 7;
    var bloom = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, bloomR);
    bloom.addColorStop(0, 'rgba(255, 245, 200, ' + (0.55*dl) + ')');
    bloom.addColorStop(0.15, 'rgba(255, 210, 120, ' + (0.28*dl) + ')');
    bloom.addColorStop(0.4, 'rgba(255, 180, 80, ' + (0.1*dl) + ')');
    bloom.addColorStop(1, 'rgba(255, 160, 60, 0)');
    ctx.fillStyle = bloom;
    ctx.beginPath(); ctx.arc(sunX, sunY, bloomR, 0, Math.PI*2); ctx.fill();

    // Outer soft halo
    ctx.globalCompositeOperation = 'screen';
    var halo = ctx.createRadialGradient(sunX, sunY, rSun*0.2, sunX, sunY, rSun*3.2);
    halo.addColorStop(0, 'rgba(255, 255, 240, ' + (0.95*dl) + ')');
    halo.addColorStop(0.5, 'rgba(255, 220, 140, ' + (0.35*dl) + ')');
    halo.addColorStop(1, 'rgba(255, 180, 80, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(sunX, sunY, rSun*3.2, 0, Math.PI*2); ctx.fill();

    // Solid photosphere (ALWAYS opaque warm disc — never gray)
    ctx.globalCompositeOperation = 'source-over';
    var core = ctx.createRadialGradient(sunX - rSun*0.25, sunY - rSun*0.25, 0, sunX, sunY, rSun);
    core.addColorStop(0, '#fffef5');
    core.addColorStop(0.35, warm > 0.7 ? '#ffe08a' : '#fff2c0');
    core.addColorStop(0.75, warm > 0.7 ? '#ffb040' : '#ffd078');
    core.addColorStop(1, warm > 0.7 ? '#ff9020' : '#ffc060');
    ctx.fillStyle = core;
    ctx.shadowColor = 'rgba(255, 200, 80, 0.85)';
    ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.arc(sunX, sunY, rSun, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Short soft rays (few, subtle)
    if(dl > 0.3){
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.12 * dl;
      for(var ri=0; ri<5; ri++){
        var ang = -Math.PI/2 + (ri-2)*0.14;
        var len = rSun * (8 + ri);
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(ang);
        var rg = ctx.createLinearGradient(0, rSun, 0, len);
        rg.addColorStop(0, 'rgba(255,240,180,0.9)');
        rg.addColorStop(1, 'rgba(255,220,120,0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(-3, rSun);
        ctx.lineTo(3, rSun);
        ctx.lineTo(8, len);
        ctx.lineTo(-8, len);
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
    // Surface film — multi-frequency ripples (not a ruler line)
    ctx.strokeStyle = 'rgba(210,240,255,'+(0.45*dayLight)+')';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for(var sx=vL; sx<=vR; sx+=6){
      var sy = Math.sin(sx*0.035 + (gt||0)*1.1)*2.0
             + Math.sin(sx*0.11 + (gt||0)*1.7)*0.9
             + Math.sin(sx*0.02 + (gt||0)*0.4)*1.3;
      if(sx===vL) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    // Second softer highlight line
    ctx.strokeStyle = 'rgba(255,255,255,'+(0.15*dayLight)+')';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    for(var sx=vL; sx<=vR; sx+=8){
      var sy = Math.sin(sx*0.035 + (gt||0)*1.1)*2.0 + Math.sin(sx*0.11)*0.9 - 1.2;
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
  if(typeof renderSnellWindow==='function') renderSnellWindow(vL,vR,vT,vB);
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



/** Pond surface vegetation — looks different from below vs above water */
function drawOneLilypad(cx, cy, rx, ry, rot, seed, sun, fromBelow){
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot || 0);
  var notch = 0.4;

  if(fromBelow){
    // UNDERSIDE silhouette against bright surface (microbe looking up)
    // Soft shadow cast into water
    ctx.fillStyle = 'rgba(0, 15, 10, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 10, rx*1.05, Math.max(6, ry*2.2), 0, 0, Math.PI*2);
    ctx.fill();

    // Dark leaf underside — matte silhouette, NO neon rings
    var ug = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    ug.addColorStop(0, 'rgba(18, 42, 22, 0.92)');
    ug.addColorStop(0.55, 'rgba(10, 28, 14, 0.94)');
    ug.addColorStop(1, 'rgba(5, 16, 8, 0.88)');
    ctx.fillStyle = ug;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0, 0, 1, notch, Math.PI*2 - notch, false);
    ctx.closePath();
    ctx.save(); ctx.scale(rx, Math.max(ry, rx*0.38)); ctx.fill();
    // very soft edge only (not green neon)
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 0.04;
    ctx.stroke();
    ctx.restore();

    // Hanging rootlets — brown-olive, thin
    ctx.strokeStyle = 'rgba(45, 55, 30, 0.4)';
    ctx.lineWidth = 0.9;
    for(var k=0; k<5; k++){
      var a = -Math.PI/2 + (k-2)*0.35 + (seed%7)*0.02;
      var len = 12 + (k%3)*7 + (seed%5);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*rx*0.15, 2);
      ctx.quadraticCurveTo(
        Math.cos(a)*rx*0.1 + Math.sin(seed+k)*4,
        len*0.5,
        Math.cos(a)*rx*0.05 + Math.sin(seed*0.3+k)*6,
        len
      );
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // TOP / surface view — solid natural leaf
  ctx.fillStyle = 'rgba(0, 20, 12, 0.25)';
  ctx.beginPath(); ctx.ellipse(3, 5, rx*1.05, ry*1.2, 0, 0, Math.PI*2); ctx.fill();

  function leafPath(sc){
    ctx.beginPath();
    var steps = 40, a0 = notch, a1 = Math.PI*2 - notch;
    for(var i=0;i<=steps;i++){
      var a = a0 + (a1-a0)*(i/steps);
      var sca = 1 + Math.sin(a*5 + seed)*0.025;
      var px = Math.cos(a)*rx*sc*sca;
      var py = Math.sin(a)*ry*sc*sca;
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.lineTo(0,0);
    ctx.closePath();
  }
  leafPath(1);
  var lg = ctx.createRadialGradient(-rx*0.2, -ry*0.25, 2, 0, 0, rx);
  lg.addColorStop(0, '#5a9a48');
  lg.addColorStop(0.4, '#3d7a38');
  lg.addColorStop(0.8, '#2a5a28');
  lg.addColorStop(1, '#1a3a1c');
  ctx.fillStyle = lg;
  ctx.fill();
  ctx.strokeStyle = 'rgba(20,50,20,0.7)';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Soft veins (not wire grid)
  ctx.lineCap = 'round';
  for(var v=0; v<9; v++){
    var a = notch + (Math.PI*2 - 2*notch)*(v+0.5)/9;
    ctx.strokeStyle = 'rgba(30,70,30,' + (0.12 + (v%3===0?0.08:0)) + ')';
    ctx.lineWidth = v%3===0 ? 1.2 : 0.6;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a)*rx*0.08, Math.sin(a)*ry*0.08);
    ctx.quadraticCurveTo(Math.cos(a)*rx*0.5, Math.sin(a)*ry*0.5, Math.cos(a)*rx*0.88, Math.sin(a)*ry*0.88);
    ctx.stroke();
  }
  // Wet highlight
  var hg = ctx.createRadialGradient(-rx*0.25, -ry*0.3, 0, -rx*0.25, -ry*0.3, rx*0.5);
  hg.addColorStop(0, 'rgba(220,255,200,0.25)');
  hg.addColorStop(1, 'rgba(100,160,80,0)');
  ctx.fillStyle = hg;
  ctx.beginPath(); ctx.ellipse(-rx*0.25, -ry*0.3, rx*0.4, ry*0.3, 0, 0, Math.PI*2); ctx.fill();

  // Notch lips
  ctx.strokeStyle = 'rgba(15,40,18,0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0,0); ctx.lineTo(Math.cos(notch)*rx*0.95, Math.sin(notch)*ry*0.95);
  ctx.moveTo(0,0); ctx.lineTo(Math.cos(-notch)*rx*0.95, Math.sin(-notch)*ry*0.95);
  ctx.stroke();
  ctx.restore();
}

function drawDuckweed(cx, cy, n, seed){
  ctx.save();
  for(var i=0;i<n;i++){
    var ox = Math.sin(seed*1.3+i*2.1)*14 + Math.cos(i*0.9)*6;
    var oy = Math.cos(seed*0.8+i*1.7)*4;
    var s = 1.8 + (i%3)*0.5;
    ctx.fillStyle = (i%2===0) ? 'rgba(80,150,55,0.8)' : 'rgba(55,125,45,0.75)';
    ctx.beginPath(); ctx.ellipse(cx+ox, cy+oy, s*1.2, s*0.8, i*0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+ox+s*0.8, cy+oy+0.4, s, s*0.65, i*0.4+0.2, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawNaturalLilypads(vL, vR, surfW){
  var sun = window._sunPos;
  var t = (typeof gt==='number') ? gt : 0;
  // From below if camera is underwater looking up at surface
  var fromBelow = (typeof cam!=='undefined' && cam.y > 18);
  // Smaller pads — not continent-sized
  for(var lp = -surfW + 140; lp < surfW - 40; lp += 480){
    if(Math.abs(Math.floor(lp/480)) % 4 === 2) continue;
    var wy = Math.sin(lp*0.018 + t*0.04)*1.5;
    var rx = 38 + Math.abs(Math.sin(lp*0.01))*22; // was 95-150 — way too big
    var ry = rx * (fromBelow ? 0.42 : 0.34);
    var rot = Math.sin(lp*0.003)*0.45;
    var px = lp + Math.sin(lp*0.02)*24;
    if(px + rx < vL - 10 || px - rx > vR + 10) continue;
    drawOneLilypad(px, wy - 0.5, rx, ry, rot, Math.abs(Math.floor(lp)), sun, fromBelow);
    // smaller neighbor
    if(Math.abs(lp) % 5 !== 0){
      drawOneLilypad(px + rx*1.1, wy + 1, rx*0.5, ry*0.5, rot+0.7, Math.abs(Math.floor(lp))+2, sun, fromBelow);
    }
  }
  // Duckweed only when not deep below
  if(!fromBelow || cam.y < 40){
    for(var d = -surfW + 160; d < surfW; d += 560){
      if(Math.abs(Math.floor(d/100)) % 3 === 0) continue;
      if(d < vL - 20 || d > vR + 20) continue;
      drawDuckweed(d, Math.sin(d*0.02+t*0.05)*1.5, 6, d);
    }
  }
}

/** Caustics + sun glitter near surface (underwater light) */
function renderSunGlitter(vL, vR){
  var sun = window._sunPos;
  var dl = (typeof dayLight==='number') ? dayLight : 0.5;
  if(dl < 0.15) return;
  ctx.save();
  // Underwater: projected warm sun on the surface (so never "two gray moons")
  if(typeof cam!=='undefined' && cam.y > 15){
    var sx = sun ? sun.x : cam.x;
    var sr = sun ? Math.max(16, sun.r*1.3) : 22;
    var sg2 = ctx.createRadialGradient(sx, -2, 0, sx, -2, sr*4);
    sg2.addColorStop(0, 'rgba(255, 250, 220, ' + (0.85*dl) + ')');
    sg2.addColorStop(0.2, 'rgba(255, 220, 120, ' + (0.45*dl) + ')');
    sg2.addColorStop(0.55, 'rgba(255, 180, 60, ' + (0.12*dl) + ')');
    sg2.addColorStop(1, 'rgba(255, 160, 40, 0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = sg2;
    ctx.beginPath(); ctx.arc(sx, -2, sr*4, 0, Math.PI*2); ctx.fill();
    // solid warm core on film
    ctx.globalCompositeOperation = 'source-over';
    var core = ctx.createRadialGradient(sx, -1, 0, sx, -1, sr);
    core.addColorStop(0, '#fffef0');
    core.addColorStop(0.5, '#ffe08a');
    core.addColorStop(1, 'rgba(255,160,40,0.15)');
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(sx, -1, sr, 0, Math.PI*2); ctx.fill();
  }

  // Bright surface film
  var band = ctx.createLinearGradient(0, -6, 0, 50);
  band.addColorStop(0, 'rgba(200, 235, 255, ' + (0.14*dl) + ')');
  band.addColorStop(0.35, 'rgba(160, 220, 240, ' + (0.08*dl) + ')');
  band.addColorStop(1, 'rgba(80, 160, 180, 0)');
  ctx.fillStyle = band;
  ctx.fillRect(vL, -6, vR-vL, 56);

  // God rays into water from sun X (or center)
  var sx = sun ? sun.x : cam.x;
  ctx.globalCompositeOperation = 'screen';
  for(var i=0; i<6; i++){
    var ang = (i-2.5)*0.08;
    var gw = 18 + i*4;
    var gg = ctx.createLinearGradient(sx, 0, sx + ang*200, 220);
    gg.addColorStop(0, 'rgba(255, 250, 210, ' + (0.2*dl) + ')');
    gg.addColorStop(0.4, 'rgba(200, 230, 170, ' + (0.08*dl) + ')');
    gg.addColorStop(1, 'rgba(120, 180, 160, 0)');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.moveTo(sx - gw*0.3, 0);
    ctx.lineTo(sx + gw*0.3, 0);
    ctx.lineTo(sx + ang*200 + gw, 220);
    ctx.lineTo(sx + ang*200 - gw, 220);
    ctx.closePath();
    ctx.fill();
  }

  // Sparkles on surface
  if(sun){
    var tt = (typeof gt==='number') ? gt : 0;
    ctx.fillStyle = 'rgba(255,255,230,0.55)';
    for(var j=0; j<10; j++){
      var spx = sun.x + Math.sin(tt*1.4 + j*1.7)*55;
      var spy = Math.abs(Math.sin(tt*2.2 + j))*4;
      if(spx < vL || spx > vR) continue;
      ctx.globalAlpha = 0.25 + 0.5*Math.abs(Math.sin(tt*3+j));
      ctx.beginPath(); ctx.ellipse(spx, spy, 3.5, 1.1, 0, 0, Math.PI*2); ctx.fill();
    }
  }
  ctx.restore();
}

/** Snell's window — bright circle when looking up from underwater */
function renderSnellWindow(vL, vR, vT, vB){
  if(typeof cam==='undefined' || cam.y < 12) return;
  if(vT > 30 || vB < -5) return; // surface not in view
  var dl = (typeof dayLight==='number') ? dayLight : 0.5;
  if(dl < 0.08) return;
  var cx = cam.x;
  var cy = 0;
  // Angular size of Snell's window ~97° → large radius in world at depth
  var depth = Math.max(20, cam.y);
  var R = Math.min(depth * 1.35, (vR-vL)*0.55);

  ctx.save();
  // Dark TIR ring outside window (underwater looking up)
  // Bright circular window
  // Only a thin band just above water darkens (TIR), NOT the whole sky
  ctx.fillStyle = 'rgba(0, 12, 28, ' + (0.15*Math.min(1, cam.y/140)) + ')';
  ctx.fillRect(vL, -14, vR-vL, 16);
  // Bright circular window
  var sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  sg.addColorStop(0, 'rgba(200, 230, 255, ' + (0.42*dl) + ')');
  sg.addColorStop(0.4, 'rgba(150, 200, 240, ' + (0.22*dl) + ')');
  sg.addColorStop(0.75, 'rgba(80, 150, 210, ' + (0.1*dl) + ')');
  sg.addColorStop(1, 'rgba(20, 40, 60, 0)');
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = sg;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // no hard ring — Snell is soft glow only
  ctx.restore();
}
window.drawNaturalLilypads = drawNaturalLilypads;
window.renderSunGlitter = renderSunGlitter;
window.renderSnellWindow = renderSnellWindow;


function renderSunRays(vL,vR){
  if(dayLight<0.15)return;ctx.save();ctx.globalCompositeOperation='screen';
  for(var i=0;i<sunRays.length;i++){
    var sr=sunRays[i];if(sr.x<vL-100||sr.x>vR+100)continue;
    var opacity=dayLight*0.10;
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

