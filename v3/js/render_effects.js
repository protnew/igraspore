// render_effects.js — sky + water (extracted split)
"use strict";

function renderSky(vL,vR,vT){
  // === SUN POSITION (always calculated, even when sky not drawn) ===
  var _dl_sky = (typeof dayLight==='number') ? dayLight : 0.6;
  var _t_sky = (typeof tod==='number') ? tod : 12;
  var _z_sky = (typeof zoom==='number' && zoom>0) ? zoom : 1;
  window._sunPos = null;
  if((_dl_sky > 0.04 || (_t_sky>=16.5 && _t_sky<21.2)) && _t_sky > 4.5 && _t_sky < 21.2){
    var _dayProg = Math.max(0, Math.min(1, (_t_sky - 5) / 14));
    var _elev = Math.sin(Math.PI * _dayProg);
    var _scrW = cv.width, _scrH = cv.height;
    var _sunScrX = _scrW * (0.25 + _dayProg * 0.5);
    var _sunScrY = _scrH * (0.04 + (1.0 - _elev) * 0.08);
    var _rSun = Math.max(8, Math.min(22, 12 + _dl_sky * 10));
    var _warm = (_t_sky < 8 || _t_sky >= 17) ? 1 : 0;
    window._sunPos = {x:cam.x+(_sunScrX-_scrW/2)/_z_sky, y:cam.y+(_sunScrY-_scrH/2)/_z_sky, r:_rSun, elev:_elev, warm:_warm, dl:_dl_sky, scrX:_sunScrX, scrY:_sunScrY};
  }

  // Sky only for the band above waterline (y < 0)
  if(vT >= 5) return; // still draw thin sky band near surface
  var skyBot = Math.min(0, (typeof arguments[3]==='number'?arguments[3]:0));
  // h = height of sky region in world units
  var h = -vT;
  if(h < 1) return;

  var dl = _dl_sky;
  var t = _t_sky;
  var z = _z_sky;

  // --- SMOOTH sky: linear interpolation between palettes ---
  var _hx=function(h){var n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
  var _rs=function(c){return'rgb('+c[0]+','+c[1]+','+c[2]+')';};
  var _PAL={night:['#000005','#020610','#0a1430'],dawn:['#0a1028','#2a3a70','#ffd8a8'],day:['#0a1848','#1a58a8','#b8dcf0'],dusk:['#05010f','#4a1868','#ff9020']};
  var _bl={night:0,dawn:0,day:0,dusk:0};
  if(t<4.5||t>=21.5){_bl.night=1;}
  else if(t<5.5){_bl.night=(5.5-t);_bl.dawn=1-_bl.night;}
  else if(t<8){_bl.dawn=(8-t)/2.5;_bl.day=1-_bl.dawn;}
  else if(t<16.5){_bl.day=1;}
  else if(t<19){_bl.day=(19-t)/2.5;_bl.dusk=1-_bl.day;}
  else if(t<21.5){_bl.dusk=(21.5-t)/2.5;_bl.night=1-_bl.dusk;}
  var _blL=function(i){var r=0,g=0,b=0;for(var k in _bl){if(_bl[k]<0.01)continue;var c=_hx(_PAL[k][i]);r+=c[0]*_bl[k];g+=c[1]*_bl[k];b+=c[2]*_bl[k];}return'rgb('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+')';};
  var g=ctx.createLinearGradient(0,vT,0,0);
  g.addColorStop(0,_blL(0));g.addColorStop(0.5,_blL(1));g.addColorStop(1,_blL(2));
  ctx.fillStyle = g;
  ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);

  // Planetarium sunset extras: milky glow arc + secondary magenta band
  if(t >= 16.5 && t < 21.5){
    var duskK = 1;
    if(t < 17.2) duskK = (t-16.5)/0.7;
    else if(t > 20) duskK = Math.max(0, 1-(t-20)/1.5);
    // Wide warm bloom along horizon
    var hb = ctx.createRadialGradient(cam.x, 8, 0, cam.x, 8, Math.max(280, (vR-vL)*0.55));
    hb.addColorStop(0, 'rgba(255,140,40,'+(0.55*duskK)+')');
    hb.addColorStop(0.25, 'rgba(255,80,30,'+(0.28*duskK)+')');
    hb.addColorStop(0.55, 'rgba(180,40,90,'+(0.12*duskK)+')');
    hb.addColorStop(1, 'rgba(40,0,60,0)');
    ctx.fillStyle = hb;
    ctx.beginPath(); ctx.ellipse(cam.x, 4, Math.max(320,(vR-vL)*0.6), 70, 0, 0, Math.PI*2); ctx.fill();
    // Violet airglow higher up
    var vg = ctx.createLinearGradient(0, vT+h*0.2, 0, -20);
    vg.addColorStop(0, 'rgba(80,20,140,0)');
    vg.addColorStop(0.6, 'rgba(100,30,150,'+(0.12*duskK)+')');
    vg.addColorStop(1, 'rgba(40,10,80,0)');
    ctx.fillStyle = vg;
    ctx.fillRect(vL, vT, vR-vL, h);
  }

  // Horizon glow strip just above water
  if(dl > 0.12){
    var hg = ctx.createLinearGradient(0, -Math.min(h*0.4, 70), 0, 1);
    hg.addColorStop(0, 'rgba(200,220,240,0)');
    hg.addColorStop(0.7, 'rgba(220,235,250,' + (0.18*dl) + ')');
    hg.addColorStop(1, 'rgba(255,250,230,' + (0.28*dl) + ')');
    ctx.fillStyle = hg;
    ctx.fillRect(vL, -Math.min(h*0.4, 70), vR-vL, Math.min(h*0.4, 70)+2);
  }

  // Stars — planetarium field (dusk + night). Fade near bright horizon.
  if(dl < 0.55 || t >= 16.5 || t < 6){
    ctx.save();
    var nStars = (dl < 0.2) ? 120 : 70;
    var starA = (dl < 0.15) ? 0.95 : Math.max(0.25, 0.9 - dl*1.1);
    for(var si=0; si<nStars; si++){
      var sx = vL + ((si*97 + Math.floor((cam.x||0)/100)*13) % Math.max(1, vR-vL));
      var sy = vT + 6 + ((si*53 + 17) % Math.max(1, h*0.78));
      // fade stars near horizon during sunset
      var nearH = 1 - Math.max(0, Math.min(1, (sy + 40) / Math.max(40, h*0.5)));
      var a = starA * (0.35 + (si%7)*0.09) * (0.4 + 0.6*nearH);
      if(a < 0.05) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = (si%11===0) ? '#ffe6b0' : (si%5===0) ? '#c8d8ff' : '#eef2ff';
      var sr = (si%9===0) ? 1.6 : (si%4===0) ? 1.1 : 0.65;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
      // tiny cross sparkle on bright stars
      if(si%9===0 && a > 0.4){
        ctx.globalAlpha = a*0.5;
        ctx.fillRect(sx-sr*2.2, sy-0.4, sr*4.4, 0.8);
        ctx.fillRect(sx-0.4, sy-sr*2.2, 0.8, sr*4.4);
      }
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
  if((dl > 0.04 || (t>=16.5 && t<21.2)) && t > 4.5 && t < 21.2){
    var dayProg = Math.max(0, Math.min(1, (t - 5) / 14));
    var elev = Math.sin(Math.PI * dayProg); // 0..1
    // SUN IN SCREEN SPACE: pin to upper area of screen, convert to world coords
    // Screen X: 25-75% of width, moves with time of day (left=dawn, right=dusk)
    var scrW = cv.width, scrH = cv.height;
    var sunScrX = scrW * (0.25 + dayProg * 0.5); // dawn left → dusk right
    var sunScrY = scrH * (0.04 + (1.0 - elev) * 0.08); // higher at noon, lower at dawn/dusk
    // Convert screen coords to world coords
    var margin = 16;
    var sunX = cam.x + (sunScrX - scrW/2) / z;
    var sunY = cam.y + (sunScrY - scrH/2) / z;

    // Warm colors: noon white-gold, low sun orange
    var warm = (t < 8 || t > 16.0) ? 1.0 : 0.4;
    if(t >= 16.5) warm = 1.0;
    // FIXED angular size on SCREEN (px) — distance/zoom must NOT shrink the sun
    // Perspective: sun is infinitely far → constant pixel radius, parallel rays
    var rSunPx = 30 + elev * 6 + (t >= 16.5 || t < 8 ? 8 : 0);
    var rSun = rSunPx / z; // convert to world units so after zoom it stays ~rSunPx px

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
    core.addColorStop(0.25, (t>=17) ? '#fff0c0' : (warm > 0.7 ? '#ffe08a' : '#fff2c0'));
    core.addColorStop(0.55, (t>=17) ? '#ffb040' : (warm > 0.7 ? '#ffc050' : '#ffd078'));
    core.addColorStop(0.85, (t>=18) ? '#ff6020' : (warm > 0.7 ? '#ff9020' : '#ffc060'));
    core.addColorStop(1, (t>=18) ? 'rgba(255,40,10,0.2)' : 'rgba(255,160,40,0.15)');
    ctx.fillStyle = core;
    ctx.shadowColor = 'rgba(255, 200, 80, 0.85)';
    ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.arc(sunX, sunY, rSun, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

        // Soft atmospheric glow around sun — no harsh beam lines
    ctx.save();
    var glowR = rSun * 4.5;
    var glowG = ctx.createRadialGradient(sunX, sunY, rSun*0.5, sunX, sunY, glowR);
    if(warm > 0.7){
      glowG.addColorStop(0, 'rgba(255,200,120,0.35)');
      glowG.addColorStop(0.3, 'rgba(255,180,80,0.15)');
      glowG.addColorStop(0.7, 'rgba(255,160,60,0.04)');
      glowG.addColorStop(1, 'rgba(255,140,40,0)');
    } else {
      glowG.addColorStop(0, 'rgba(255,250,230,0.28)');
      glowG.addColorStop(0.3, 'rgba(255,240,200,0.10)');
      glowG.addColorStop(0.7, 'rgba(255,230,180,0.03)');
      glowG.addColorStop(1, 'rgba(255,220,160,0)');
    }
    ctx.fillStyle = glowG;
    ctx.beginPath(); ctx.arc(sunX, sunY, glowR, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.restore();

    window._sunPos = {x:sunX, y:sunY, r:rSun, elev:elev, warm:warm, dl:dl, scrX:sunScrX, scrY:sunScrY};
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
  // Dusk: warm planetarium reflection on water surface
  if(typeof tod==='number' && tod >= 16.5 && tod < 21){
    var dk = (tod < 18.5) ? (tod-16.5)/2 : Math.max(0, 1-(tod-18.5)/2.5);
    var wg = ctx.createLinearGradient(0, -4, 0, PD*0.25);
    wg.addColorStop(0, 'rgba(255,120,40,'+(0.22*dk)+')');
    wg.addColorStop(0.35, 'rgba(200,60,80,'+(0.12*dk)+')');
    wg.addColorStop(0.7, 'rgba(80,20,60,'+(0.05*dk)+')');
    wg.addColorStop(1, 'rgba(20,0,30,0)');
    ctx.fillStyle = wg;
    ctx.fillRect(vL, -4, vR-vL, PD*0.25);
  }
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

