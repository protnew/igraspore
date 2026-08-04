// render.js — main render() pipeline (helpers extracted to render_helpers.js)
var renderMinimap = function(){}; // stub — real one defined below
"use strict";
function render(){
  if(!isFinite(cam.x))cam.x=0;
  if(!isFinite(cam.y))cam.y=PD*0.3;
  if(!isFinite(zoom)||zoom<=0)zoom=1;
  if(!isFinite(dayLight))dayLight=0.5;
  if(!isFinite(tod))tod=12;
  // minimap early-return removed
  
  var isReal=settings.renderMode==='realistic';
  var vw=cv.width/zoom,vh=cv.height/zoom;
  var vL=cam.x-vw/2,vR=cam.x+vw/2,vT=cam.y-vh/2,vB=cam.y+vh/2;
  
  // === STEP 1: BACKGROUND ===
  // Split: sky-ish upper screen, water lower — so free-cam above surface isn't a blue void
  {
    var skyFrac = 0;
    if(typeof cam!=='undefined' && typeof zoom==='number' && zoom>0){
      // fraction of screen above waterline y=0
      var halfH = cv.height/(2*zoom);
      var topW = cam.y - halfH, botW = cam.y + halfH;
      if(botW > 0 && topW < 0) skyFrac = (-topW) / (botW - topW);
      else if(botW <= 0) skyFrac = 1;
      skyFrac = Math.max(0, Math.min(1, skyFrac));
    }
    var split = cv.height * skyFrac;
    if(split > 2){
      var sgrad=ctx.createLinearGradient(0,0,0,split);
      sgrad.addColorStop(0, isReal?'#0a1840':'#0b1e48');
      sgrad.addColorStop(1, isReal?'#3a6a9a':'#4a8ec8');
      ctx.fillStyle=sgrad;
      ctx.fillRect(0,0,cv.width,split);
    }
    var wgrad=ctx.createLinearGradient(0,split,0,cv.height);
    if(isReal){
      wgrad.addColorStop(0,'#0a2838');
      wgrad.addColorStop(0.4,'#0c3040');
      wgrad.addColorStop(1,'#061820');
    } else {
      wgrad.addColorStop(0,'#0d3a5c');
      wgrad.addColorStop(0.45,'#0a4a62');
      wgrad.addColorStop(1,'#063848');
    }
    ctx.fillStyle=wgrad;
    ctx.fillRect(0,split,cv.width,cv.height-split);
  }
  
  // === STEP 2: WORLD TRANSFORM ===
  ctx.save();
  ctx.translate(cv.width/2,cv.height/2);
  ctx.scale(zoom,zoom);
  ctx.translate(-cam.x,-cam.y);
  
  // === STEP 3: ENVIRONMENT — water/sky/algae ALWAYS (fix black water) ===
  {
    renderSky(vL,vR,vT);
    renderWater(vL,vR,vT,vB);
    renderSunRays(vL,vR);
    renderSediment(vL,vR,vB);
    if(!isReal) renderNutrients(vL,vR,vT,vB);
    renderShore(vL,vR,vT);
    if(settings.shadows && !isReal) renderShadows(vL,vR,vT,vB);
    if(settings.bubbles) renderBubbles(vL,vR,vT,vB);
    if(!isReal){ renderParallax(vL,vR,vT,vB); renderTrails(vL,vR,vT,vB); }
  }
  
  // === STEP 4: ORGANISMS (both modes) ===
  renderOrganisms(vL,vR,vT,vB);
  // Educational anatomy labels when zoomed in
  if(typeof renderOrganelleEdu==='function'){/* drawn after world in screen space below */}
  renderViruses(vL,vR,vT,vB);
  
  // === STEP 5: EFFECTS ===
  {
    renderParticles(vL,vR,vT,vB);
    if(!isReal && isRaining) renderRain(vL,vR,vT);
  }
  if(moveTarget)renderTarget();
  
  // World-space organelle pins (still in world transform)
  if(typeof renderOrganelleEdu==='function'){ /* panel is screen-space; pins need dual */ }

  ctx.restore(); // End world transform
  
  // === STEP 6: SCREEN-SPACE OVERLAYS ===
  if(typeof renderOrganelleEdu==='function') renderOrganelleEdu(vL,vR,vT,vB);
  if(!isReal){
    renderDayNight();
    if(settings.healthBars)renderHealthBars();
  }
  renderTooltip();
  // Re-draw sun ON TOP of particles (prevents green halo from phytoplankton)
  if(typeof renderSunOverlay==='function') renderSunOverlay();
  
  // === STEP 7: REALISTIC POST-PROCESSING ===
  if(isReal){
    var mw=cv.width,mh=cv.height,mcx=mw/2,mcy=mh/2;
    var mradius=Math.min(mw,mh)*0.48;
    
    // Soft eyepiece ring — CENTER stays clear so water/algae stay visible
    ctx.save();
    var fov=ctx.createRadialGradient(mcx,mcy,mradius*0.72,mcx,mcy,mradius*1.12);
    fov.addColorStop(0,'rgba(0,0,0,0)');
    fov.addColorStop(0.55,'rgba(0,15,25,0.05)');
    fov.addColorStop(0.82,'rgba(0,10,18,0.40)');
    fov.addColorStop(1,'rgba(0,8,14,0.82)');
    ctx.fillStyle=fov;
    ctx.fillRect(0,0,mw,mh);
    
    // Light amber glass tint (subtle)
    ctx.fillStyle='rgba(90,75,30,0.06)';
    ctx.fillRect(0,0,mw,mh);
    
    // Scan lines
    ctx.globalAlpha=0.05;ctx.fillStyle='#000';
    for(var sl=0;sl<mh;sl+=2)ctx.fillRect(0,sl,mw,1);
    ctx.globalAlpha=1;
    
    // Crosshair
    ctx.strokeStyle='rgba(200,200,170,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(mcx-mradius*0.5,mcy);ctx.lineTo(mcx+mradius*0.5,mcy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(mcx,mcy-mradius*0.5);ctx.lineTo(mcx,mcy+mradius*0.5);ctx.stroke();
    for(var tk=-4;tk<=4;tk++){var tx=mcx+tk*mradius*0.1;ctx.beginPath();ctx.moveTo(tx,mcy-3);ctx.lineTo(tx,mcy+3);ctx.stroke();}
    
    // Scale bar
    ctx.fillStyle='rgba(200,200,170,0.4)';ctx.font='bold 10px monospace';ctx.textAlign='center';
    var sbs=mcx-mradius*0.25,sbe=mcx+mradius*0.25;
    ctx.fillRect(sbs,mcy+mradius*0.4,sbe-sbs,2);
    ctx.fillText(Math.round((sbe-sbs)/zoom*10)/10+' µm',mcx,mcy+mradius*0.4+14);
    
    ctx.restore();
  }
  
  // === STEP 8: MICROSCOPE OVERLAY (M) — optics ON water, never black fill ===
  if(settings.microscopeMode && !isReal){
    var mw=cv.width, mh=cv.height, mcx=mw/2, mcy=mh/2;
    var mradius=Math.min(mw,mh)*0.48;
    ctx.save();
    // Soft ring only outside the eyepiece — center stays teal water
    var fov=ctx.createRadialGradient(mcx,mcy,mradius*0.72,mcx,mcy,mradius*1.08);
    fov.addColorStop(0,'rgba(0,0,0,0)');
    fov.addColorStop(0.55,'rgba(0,20,30,0.08)');
    fov.addColorStop(0.85,'rgba(0,10,20,0.45)');
    fov.addColorStop(1,'rgba(0,8,16,0.78)');
    ctx.fillStyle=fov;
    ctx.fillRect(0,0,mw,mh);
    // Eyepiece brass rim
    ctx.strokeStyle='rgba(180,160,100,0.35)';
    ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(mcx,mcy,mradius,0,Math.PI*2); ctx.stroke();
    // Fine grid (µm reticle)
    ctx.strokeStyle='rgba(200,220,230,0.12)';
    ctx.lineWidth=1;
    var step=Math.max(24, 40);
    for(var gx=mcx-mradius; gx<mcx+mradius; gx+=step){
      ctx.beginPath(); ctx.moveTo(gx, mcy-mradius); ctx.lineTo(gx, mcy+mradius); ctx.stroke();
    }
    for(var gy=mcy-mradius; gy<mcy+mradius; gy+=step){
      ctx.beginPath(); ctx.moveTo(mcx-mradius, gy); ctx.lineTo(mcx+mradius, gy); ctx.stroke();
    }
    // Crosshair
    ctx.strokeStyle='rgba(220,240,255,0.28)';
    ctx.beginPath(); ctx.moveTo(mcx-mradius*0.55,mcy); ctx.lineTo(mcx+mradius*0.55,mcy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mcx,mcy-mradius*0.55); ctx.lineTo(mcx,mcy+mradius*0.55); ctx.stroke();
    // Scale bar
    var barW = Math.min(160, mradius*0.45);
    var um = Math.round((barW/zoom)*10)/10;
    ctx.fillStyle='rgba(230,240,255,0.75)';
    ctx.fillRect(mcx-barW/2, mcy+mradius*0.62, barW, 3);
    ctx.font='bold 13px monospace'; ctx.textAlign='center';
    ctx.fillText(um+' µm', mcx, mcy+mradius*0.62+18);
    ctx.fillText('MICROSCOPE ×'+Math.round(zoom*10)/10, mcx, mcy-mradius*0.78);
    ctx.restore();
  }

  if(window.eventManager) window.eventManager.draw(ctx, cv.width, cv.height);
  /* renderEventLogs removed */
  
  // Damage indicators REMOVED














}
