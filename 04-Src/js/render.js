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














var shoreCache = null;
function initShoreCache() {
  shoreCache = document.createElement('canvas');
  shoreCache.width = shoreDecor.length * 50; shoreCache.height = 50;
  var c = shoreCache.getContext('2d');
  for(var i=0;i<shoreDecor.length;i++){
    var d=shoreDecor[i]; c.save(); c.translate(i*50 + 25, 25); c.rotate(d.rot);
    // Shadow first (below plant)
    if(d.hasShadow!==false){
      c.fillStyle='rgba(0,0,0,0.15)';
      c.beginPath(); c.ellipse(2, 3, d.size*0.8, d.size*0.3, 0, 0, Math.PI*2); c.fill();
    }
    if(d.type==='grass' || d.type==='algae'){
      // Natural filamentous algae / pond grass — green blades with midrib
      for(var b=0;b<6;b++){
        var baseX = b*2.2-6;
        var sway=Math.sin(b*1.3+d.rot)*5;
        var h = d.size*(0.7+ (b%3)*0.15);
        var grd = c.createLinearGradient(baseX, d.size*0.3, baseX+sway, -h);
        grd.addColorStop(0,'rgba(20,55,18,0.85)');
        grd.addColorStop(0.5,'rgba(40,110,35,0.8)');
        grd.addColorStop(1,'rgba(70,150,50,0.55)');
        c.strokeStyle=grd; c.lineWidth=2.2; c.lineCap='round';
        c.beginPath(); c.moveTo(baseX,d.size*0.35);
        c.quadraticCurveTo(baseX+sway*0.5, d.size*0.05, baseX+sway, -h);
        c.stroke();
        // lighter edge
        c.strokeStyle='rgba(120,190,80,0.35)'; c.lineWidth=0.8;
        c.beginPath(); c.moveTo(baseX+0.6,d.size*0.3);
        c.quadraticCurveTo(baseX+sway*0.5,0, baseX+sway*0.9, -h*0.85);
        c.stroke();
      }
    } else if(d.type==='reed'){
      // Tall reed with leaves
      c.strokeStyle='rgba(45,95,28,0.85)'; c.lineWidth=2.8; c.lineCap='round';
      c.beginPath(); c.moveTo(0,d.size*0.35); c.quadraticCurveTo(3,-d.size*0.4, 1,-d.size*1.25); c.stroke();
      c.fillStyle='rgba(55,120,30,0.7)';
      for(var lf=0;lf<4;lf++){
        var ly=-d.size*0.25-lf*d.size*0.28;
        c.save(); c.translate(0,ly); c.rotate((lf%2? -1:1)*(0.4+lf*0.12));
        c.beginPath(); c.ellipse(d.size*0.32,0,d.size*0.32,d.size*0.07,0,0,Math.PI*2); c.fill();
        c.restore();
      }
      // tip
      c.fillStyle='rgba(90,140,40,0.6)';
      c.beginPath(); c.ellipse(1,-d.size*1.28,3,5,0,0,Math.PI*2); c.fill();
    } else if(d.type==='float'){
      // Floating surface algae mat (Spirogyra / pond scum — clumpy, not solid blob)
      c.fillStyle='rgba(35,90,30,0.35)';
      c.beginPath(); c.ellipse(2,2,d.size*1.15,d.size*0.4,0,0,Math.PI*2); c.fill();
      for(var mi=0;mi<5;mi++){
        var mx=Math.sin(mi*1.7+d.sway)*d.size*0.45;
        var my=Math.cos(mi*1.3)*d.size*0.12;
        var ms=d.size*(0.25+mi*0.08);
        var mg=c.createRadialGradient(mx,my,0,mx,my,ms);
        mg.addColorStop(0,'rgba(90,150,55,0.55)');
        mg.addColorStop(0.7,'rgba(40,100,35,0.4)');
        mg.addColorStop(1,'rgba(20,60,25,0)');
        c.fillStyle=mg;
        c.beginPath(); c.ellipse(mx,my,ms*1.2,ms*0.45,mi*0.4,0,Math.PI*2); c.fill();
      }
      // bubble holes
      c.fillStyle='rgba(30,80,90,0.15)';
      c.beginPath(); c.ellipse(-d.size*0.15,0,d.size*0.12,d.size*0.06,0,0,Math.PI*2); c.fill();
    } else {
      // Pebble
      c.fillStyle='rgba(100,85,60,0.7)'; c.beginPath(); c.ellipse(0,0,d.size,d.size*0.7,0,0,Math.PI*2); c.fill();
      c.fillStyle='rgba(120,105,75,0.4)'; c.beginPath(); c.ellipse(-d.size*0.2,-d.size*0.15,d.size*0.4,d.size*0.3,0,0,Math.PI*2); c.fill();
    }
    c.restore();
  }
}
window.addEventListener('resize', function(){ shoreCache = null; });
function renderShore(vL,vR,vT) {
  if(shoreDecor.length===0) return;
  if(!shoreCache || shoreCache.width !== shoreDecor.length*50) initShoreCache();
  for(var i=0;i<shoreDecor.length;i++){
    var d=shoreDecor[i];
    if(d.x<vL-30||d.x>vR+30||d.y<vT-30||d.y>vT+200) continue;
    // Draw shadow on main canvas (dark ellipse below plant)
    if(d.hasShadow!==false){
      ctx.fillStyle='rgba(0,0,0,0.1)';
      ctx.beginPath(); ctx.ellipse(d.x+2, d.y+d.size*0.5, d.size*0.7, d.size*0.2, 0, 0, Math.PI*2); ctx.fill();
    }
    ctx.drawImage(shoreCache, i*50, 0, 50, 50, d.x-25, d.y-25, 50, 50);
  }
}

function renderTrails(vL,vR,vT,vB){
  ctx.save();
  for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o.alive||!o.glideTrail||o.glideTrail.length<2)continue;
    ctx.strokeStyle='rgba(180,220,255,0.08)';ctx.lineWidth=1.5;ctx.beginPath();
    for(var j=0;j<o.glideTrail.length;j++){
      var t=o.glideTrail[j];
      if(j===0)ctx.moveTo(t.x,t.y);else ctx.lineTo(t.x,t.y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
function renderOrganisms(vL,vR,vT,vB){
  // Bioluminescence: organisms glow at night
  if(dayLight < 0.3) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for(var bi=0;bi<orgs.length;bi++){
      var bo=orgs[bi];
      if(!bo.alive) continue;
      if(bo.x<vL-20||bo.x>vR+20||bo.y<vT-20||bo.y>vB+20) continue;
      var glowR = bo.size * 2.5;
      var glowAlpha = (0.3 - dayLight) * 0.6;
      ctx.fillStyle = bo.sp.color.replace('rgb','rgba').replace(')',','+glowAlpha+')');
      if(bo.sp.color.startsWith('#')) {
        // Hex color: use a soft glow
        ctx.fillStyle = 'rgba(100,200,255,' + glowAlpha + ')';
      }
      ctx.beginPath();
      ctx.arc(bo.x, bo.y, glowR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  var batches = {};
  var isRealistic = settings.renderMode === 'realistic';
  // REALISTIC MODE: render each organism individually with phase contrast effect
  if(isRealistic){
    // PHASE CONTRAST / DARK FIELD: bright shapes on black (rods, cocci, filaments)
    for(var i=0;i<orgs.length;i++){
      var o=orgs[i];
      if(!o.alive)continue;
      if(o.x<vL-60||o.x>vR+60||o.y<vT-60||o.y>vB+60)continue;
      var sz=Math.max(o.size, 3.2);
      var sh=(o.sp && o.sp.shape) ? o.sp.shape : 'circle';
      // Use smoothed facing — NEVER raw atan2(vx,vy) (causes CW/CCW flicker)
      var ang = (typeof o.facing==='number' && isFinite(o.facing)) ? o.facing
              : (typeof o.angle==='number' && isFinite(o.angle)) ? o.angle : 0;
      // Soft scatter halo (ellipse-ish via scale)
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate(ang);
      var hx = (sh==='rod'||sh==='filament'||sh==='spiral') ? sz*2.8 : (sh==='oval'?sz*2.4:sz*2.2);
      var hy = (sh==='filament') ? sz*1.1 : (sh==='rod'||sh==='spiral') ? sz*1.5 : sz*2.2;
      var g=ctx.createRadialGradient(0,0,0,0,0,Math.max(hx,hy));
      g.addColorStop(0,'rgba(245,240,220,0.5)');
      g.addColorStop(0.5,'rgba(200,195,170,0.18)');
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.ellipse(0,0,hx,hy,0,0,Math.PI*2); ctx.fill();

      // Body gradient cream/white
      var body=ctx.createRadialGradient(-sz*0.25,-sz*0.2,0,0,0,sz*1.2);
      body.addColorStop(0,'rgba(255,255,245,1)');
      body.addColorStop(0.65,'rgba(230,225,200,0.95)');
      body.addColorStop(1,'rgba(170,165,140,0.75)');
      ctx.fillStyle=body;
      ctx.strokeStyle='rgba(255,255,235,0.95)';
      ctx.lineWidth=Math.max(0.9, sz*0.07);
      ctx.beginPath();
      if(sh==='rod'){
        // bacillus: rounded capsule
        var L=sz*1.55, R=sz*0.55;
        ctx.moveTo(-L+R,-R);
        ctx.lineTo(L-R,-R);
        ctx.arc(L-R,0,R,-Math.PI/2,Math.PI/2);
        ctx.lineTo(-L+R,R);
        ctx.arc(-L+R,0,R,Math.PI/2,-Math.PI/2);
        ctx.closePath();
      } else if(sh==='filament'){
        ctx.ellipse(0,0,sz*2.1,sz*0.32,0,0,Math.PI*2);
      } else if(sh==='spiral'){
        // elongated S-ish via ellipse + secondary
        ctx.ellipse(0,0,sz*1.7,sz*0.45,0,0,Math.PI*2);
      } else if(sh==='oval' || sh==='phage'){
        ctx.ellipse(0,0,sz*1.25,sz*0.75,0,0,Math.PI*2);
      } else if(sh==='colony'){
        ctx.arc(0,0,sz,0,Math.PI*2);
      } else if(sh==='star' || sh==='irregular'){
        for(var k=0;k<8;k++){
          var a2=k/8*Math.PI*2, rr=(k%2?sz*0.7:sz);
          var px=Math.cos(a2)*rr, py=Math.sin(a2)*rr;
          if(k===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.closePath();
      } else {
        // coccus / circle
        ctx.arc(0,0,sz,0,Math.PI*2);
      }
      ctx.fill(); ctx.stroke();

      // Internal density (nucleus / nucleoid) — semi-transparent dark
      if(sz*zoom > 3.5){
        ctx.fillStyle='rgba(70,60,45,0.55)';
        ctx.beginPath();
        if(sh==='rod'||sh==='filament'){
          ctx.ellipse(-sz*0.15,0,sz*0.55,sz*0.22,0,0,Math.PI*2);
        } else {
          ctx.arc(-sz*0.12,-sz*0.08,sz*0.28,0,Math.PI*2);
        }
        ctx.fill();
      }
      // Dividing pair hint
      if(o.dividing){
        ctx.strokeStyle='rgba(180,220,255,0.9)';
        ctx.lineWidth=Math.max(1,sz*0.08);
        ctx.beginPath(); ctx.moveTo(0,-sz*0.9); ctx.lineTo(0,sz*0.9); ctx.stroke();
      }
      // Flash highlight
      if(o.flash && o.flash>0){
        ctx.globalAlpha=Math.min(0.85, o.flash);
        ctx.strokeStyle=o.flashColor||'#fff';
        ctx.lineWidth=Math.max(1.5,sz*0.15);
        ctx.beginPath();
        if(sh==='rod'){ ctx.ellipse(0,0,sz*1.7,sz*0.75,0,0,Math.PI*2); }
        else ctx.arc(0,0,sz*1.25,0,Math.PI*2);
        ctx.stroke();
        ctx.globalAlpha=1;
      }
      // Player ring
      if(o.isPlayer){
        ctx.strokeStyle='rgba(80,255,200,0.95)';
        ctx.lineWidth=Math.max(1.6,sz*0.12);
        ctx.setLineDash([4,3]);
        ctx.beginPath(); ctx.arc(0,0,sz*1.55,0,Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    }
  } else {
  // CARTOON MODE: batch by color for performance
  for(var i=0;i<orgs.length;i++){
    var o=orgs[i];
    if(o.x<vL-40||o.x>vR+40||o.y<vT-40||o.y>vB+40)continue;
    var c=o.sp.color;
    if(!batches[c]) batches[c] = [];
    batches[c].push(o);
  }
  for(var c in batches){
    var arr = batches[c];
    ctx.fillStyle = c;
    ctx.beginPath();
    for(var i=0;i<arr.length;i++){
      var o = arr[i];
      if(o.size * zoom < 3) { ctx.fillRect(o.x - o.size, o.y - o.size, o.size*2, o.size*2); continue; }
      if(o.dividing || o.dying || o.cyst || o.infected || o.flash>0) continue; 
      ctx.save();ctx.translate(o.x,o.y);ctx.rotate(((typeof o.facing==='number')?o.facing:o.angle)||0);
      drawBody(o, o.size, c, c, true);
      // Mini internals even in batch — avoid "dumb ovals"
      if(zoom > 1.3 && o.size > 4){
        var s=o.size;
        ctx.fillStyle='rgba(120,60,140,0.55)';
        ctx.beginPath();ctx.ellipse(-s*0.15,-s*0.05,s*0.22,s*0.16,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,200,80,0.4)';
        ctx.beginPath();ctx.arc(s*0.2,s*0.1,s*0.1,0,Math.PI*2);ctx.fill();
        if(o.sp && o.sp.bio && o.sp.bio.cilia && zoom>1.6){
          ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.lineWidth=0.8;
          for(var ci=0;ci<10;ci++){
            var ca=ci/10*Math.PI*2 + (o.cilPhase||0)*0.5;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ca)*s*0.95, Math.sin(ca)*s*0.7);
            ctx.lineTo(Math.cos(ca)*s*1.25, Math.sin(ca)*s*0.95);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }
    ctx.fill();
      for(var i=0;i<arr.length;i++){
      var o = arr[i];
      if(o.size * zoom < 3) continue;
      if(o.dividing || o.dying || o.cyst || o.infected || o.flash>0) renderOrg(o, false);
      else renderOrg(o, true);
    }
  }
  } // end cartoon batch
}





function renderParticles(vL,vR,vT,vB){
  ctx.save();
  for(var i=0;i<parts.length;i++){var p=parts[i];
    ctx.globalAlpha=clamp(p.life,0,1);
    var col = p.color;
    if(p.life < p.maxL * 0.5 && (col==='#f44' || col==='#ff4444')) col = '#6b4c3a'; // Blood darkens to brown
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function renderTarget(){
  ctx.save();ctx.translate(moveTarget.x,moveTarget.y);var p=1+Math.sin(fc*0.15)*0.3;
  ctx.strokeStyle='rgba(100,255,200,0.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,8*p,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-12*p,0);ctx.lineTo(12*p,0);ctx.moveTo(0,-12*p);ctx.lineTo(0,12*p);ctx.stroke();ctx.restore();
}
function renderDayNight(){
  var dark=1-dayLight;if(dark>0.03){ctx.fillStyle='rgba(0,8,25,'+(dark*0.5)+')';ctx.fillRect(0,0,cv.width,cv.height);}
  if(settings.vignette){var g=ctx.createRadialGradient(cv.width/2,cv.height/2,Math.min(cv.width,cv.height)*0.3,cv.width/2,cv.height/2,Math.max(cv.width,cv.height)*0.7);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,12,24,'+(0.12+dark*0.08)+')');ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);}
}
function renderHealthBars(){
  ctx.save();
  for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o.alive||o.dying)continue;
    var scx=(o.x-cam.x)*zoom+cv.width/2,scy=(o.y-cam.y)*zoom+cv.height/2;
    if(scx<5||scx>cv.width-5||scy<5||scy>cv.height-5)continue;
    if(zoom<2&&!o.isPlayer)continue;if(zoom<1.5)continue;
    var bw=Math.max(14,o.size*zoom*1.1),bh=3,bx=scx-bw/2,by=scy-o.size*zoom-6;
    var er=clamp(o.energy/100,0,1);var col=er>0.6?'#4e4':(er>0.3?'#ee4':'#e44');
    ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(bx-1,by-1,bw+2,bh+2);
    ctx.fillStyle='#234';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle=col;ctx.fillRect(bx,by,bw*er,bh);
    // Infection indicator
    if(o.infected){ctx.fillStyle='#f44';ctx.beginPath();ctx.arc(scx+bw/2+3,by+1,2,0,Math.PI*2);ctx.fill();}
  }
  ctx.restore();
}
function renderTooltip(){
  if(mx>9000||state!=='playing')return;
  var wx=cam.x+(mx-cv.width/2)/zoom,wy=cam.y+(my-cv.height/2)/zoom;inspOrg=null;
  for(var i=orgs.length-1;i>=0;i--){var o=orgs[i];if(!o.alive)continue;if(dist2({x:wx,y:wy},o)<(o.size+5)*(o.size+5)){inspOrg=o;break;}}
  var tip=document.getElementById('tip');
  if(inspOrg){
    var o=inspOrg,st='';
    if(o.energy<25)st+=' \u26a0 '+(curLang==='ru'?'\u0413\u043e\u043b\u043e\u0434':'Starving');
    else if(o.energy>85)st+=' \u2714 '+(curLang==='ru'?'\u0417\u0434\u043e\u0440\u043e\u0432':'Healthy');
    if(o.dividing)st+=' \u21bb '+(curLang==='ru'?'\u0414\u0435\u043b\u0438\u0442\u0441\u044f':'Dividing');
    if(o.cyst)st+=' \u2a1d '+(curLang==='ru'?'\u0426\u0438\u0441\u0442\u0430':'Cyst');
    if(o.infected)st+=' \u2620 '+(curLang==='ru'?'\u0417\u0430\u0440\u0430\u0436\u0435\u043d':'Infected');
    var locTxt=o.sp.locomotion||'';
    tip.innerHTML='<b style="color:'+o.sp.color+'">'+o.sp.name+'</b>'+
      '<div style="color:#abc;font-size:9px;margin-top:2px">'+
      (curLang==='ru'?'\u042d\u043d':'E')+': '+Math.round(o.energy)+' '+
      (curLang==='ru'?'\u0412\u0437\u0440':'A')+': '+Math.round(o.age)+'s '+
      (curLang==='ru'?'\u0420\u0437\u043c':'S')+': '+o.size.toFixed(1)+'\u03bcm</div>'+
      '<div style="color:#678;font-size:8px">'+(curLang==='ru'?'\u0414\u0432\u0438\u0436\u0435\u043d\u0438\u0435':'Move')+': '+locTxt+'</div>'+
      (st?'<div style="color:#fc4;font-size:9px">'+st+'</div>':'')+
      (o.isPlayer?'<div style="color:#4ff;font-size:8px">\u2605 '+(curLang==='ru'?'\u042d\u0442\u043e \u0412\u044b':'You')+'</div>':'');
    tip.style.display='block';tip.style.left=clamp(mx+12,0,cv.width-260)+'px';tip.style.top=clamp(my+12,0,cv.height-80)+'px';
  }else tip.style.display='none';
}
var _mmCache=null,_mmFrame=0;
function renderMinimap(){
  mc.clearRect(0,0,110,80);mc.fillStyle='rgba(0,12,28,0.85)';mc.fillRect(0,0,110,80);
  var sx=100/(PW*2),sy=70/PD;mc.save();mc.translate(5,5);
  mc.fillStyle='rgba(20,50,60,0.5)';mc.beginPath();mc.moveTo(0,0);mc.lineTo(100,0);mc.lineTo(100-(PW-BW)*sx,70);mc.lineTo((PW-BW)*sx,70);mc.closePath();mc.fill();
  for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o.alive)continue;mc.fillStyle=o.sp.color;mc.beginPath();mc.arc((o.x+PW)*sx,o.y*sy,o.isPlayer?3:1,0,Math.PI*2);mc.fill();}
  mc.restore();
  var vw=cv.width/zoom,vh=cv.height/zoom;mc.strokeStyle='rgba(100,200,255,0.4)';mc.lineWidth=1;
  mc.strokeRect(5+(cam.x-vw/2+PW)*sx,5+(cam.y-vh/2)*sy,vw*sx,vh*sy);
}
function renderPopGraph(){
  pcc.clearRect(0,0,110,55);pcc.fillStyle='rgba(0,12,28,0.6)';pcc.fillRect(0,0,110,55);
  if(popHist.length<2)return;var maxP=1;
  for(var i=0;i<popHist.length;i++){var t=0;for(var c in popHist[i])t+=popHist[i][c];if(t>maxP)maxP=t;}
  var cats=['producer','consumer1','consumer2','consumer3','decomposer'];
  var cols={producer:'#2c2',consumer1:'#4af',consumer2:'#f80',consumer3:'#c4f',decomposer:'#a86'};
  for(var ci=0;ci<cats.length;ci++){pcc.strokeStyle=cols[cats[ci]];pcc.lineWidth=1.5;pcc.beginPath();
    for(var i=0;i<popHist.length;i++){var x=i/(popHist.length-1)*110;var y=55-(popHist[i][cats[ci]]||0)/maxP*52;if(i===0)pcc.moveTo(x,y);else pcc.lineTo(x,y);}pcc.stroke();}
}
}

function renderEventLogs(){}


// ============================================================
// EDUCATIONAL ORGANELLE LABELS — anatomy learning mode
// ============================================================
var ORGANELLE_INFO = {
  nucleus: {
    ru: 'Ядро', en: 'Nucleus',
    desc: 'Хранит ДНК. Управляет ростом, делением и синтезом белков. У бактерий настоящего ядра нет — ДНК в нуклеоиде.'
  },
  nucleoid: {
    ru: 'Нуклеоид', en: 'Nucleoid',
    desc: 'Зона с кольцевой ДНК у прокариот. Нет ядерной оболочки — геном свободно в цитоплазме.'
  },
  mito: {
    ru: 'Митохондрия', en: 'Mitochondrion',
    desc: '«Электростанция» клетки. Дыхание: сахар + O₂ → ATP (энергия). Своя ДНК — остаток древней бактерии.'
  },
  chloro: {
    ru: 'Хлоропласт', en: 'Chloroplast',
    desc: 'Фотосинтез: свет + CO₂ + H₂O → сахар + O₂. Зелёный из‑за хлорофилла. Есть у водорослей и растений.'
  },
  vacuole: {
    ru: 'Вакуоль', en: 'Vacuole',
    desc: 'Пузырёк с водой, запасными веществами или пищеварительными ферментами. У инфузорий — пищеварительные и сократительные вакуоли.'
  },
  cilia: {
    ru: 'Реснички', en: 'Cilia',
    desc: 'Короткие подвижные выросты. Создают ток воды: движение + фильтр-питание (затягивают бактерий и водоросли ко рту).'
  },
  flagella: {
    ru: 'Жгутик', en: 'Flagellum',
    desc: 'Длинный «мотор» для плавания. Вращается или изгибается — клетка плывёт к пище или от опасности (хемотаксис).'
  },
  membrane: {
    ru: 'Мембрана', en: 'Membrane',
    desc: 'Тонкая оболочка из липидов. Контролирует, что входит и выходит. У всех клеток есть мембрана.'
  },
  wall: {
    ru: 'Клеточная стенка', en: 'Cell wall',
    desc: 'Жёсткий каркас снаружи мембраны (пептидогликан у бактерий, целлюлоза у растений). Защита и форма.'
  },
  oral: {
    ru: 'Ротовая воронка', en: 'Oral groove',
    desc: 'У инфузорий — желобок, куда реснички сгоняют добычу. Отсюда пища попадает в пищеварительную вакуоль.'
  },
  cyto: {
    ru: 'Цитоплазма', en: 'Cytoplasm',
    desc: 'Внутренняя среда клетки: вода, белки, органеллы. Здесь идут тысячи биохимических реакций.'
  }
};

function organelleSetFor(o){
  if(!o || !o.sp) return [];
  var cat = o.sp.cat || '';
  var bio = o.sp.bio || {};
  var list = [{id:'membrane', x:0.0, y:0.75}];
  if(cat==='producer'){
    list.push({id:'chloro', x:-0.25, y:-0.1});
    list.push({id:'nucleoid', x:0.2, y:0.15});
    if(bio.flagella || o.sp.loco==='flagella') list.push({id:'flagella', x:0.7, y:0.0});
  } else if(cat==='consumer1'){
    list.push({id:'nucleoid', x:0.0, y:0.0});
    list.push({id:'wall', x:0.0, y:0.9});
    if(bio.flagella || (o.sp.loco&&String(o.sp.loco).indexOf('flag')>=0))
      list.push({id:'flagella', x:0.85, y:0.0});
  } else if(cat==='consumer2'){
    list.push({id:'nucleus', x:-0.15, y:-0.1});
    list.push({id:'vacuole', x:0.25, y:0.2});
    list.push({id:'cilia', x:0.0, y:-0.85});
    list.push({id:'oral', x:0.55, y:0.0});
    list.push({id:'mito', x:-0.35, y:0.25});
  } else if(cat==='consumer3' || cat==='macrophage'){
    list.push({id:'nucleus', x:0.0, y:-0.15});
    list.push({id:'mito', x:-0.3, y:0.2});
    list.push({id:'vacuole', x:0.3, y:0.15});
  } else {
    list.push({id:'cyto', x:0.0, y:0.0});
  }
  return list;
}

function renderOrganelleEdu(vL,vR,vT,vB){
  if(typeof player==='undefined' || !player || !player.alive) {
    var p0=document.getElementById('orgEduPanel'); if(p0) p0.style.display='none';
    return;
  }
  // Only in deep zoom — anatomy mode
  if(typeof zoom!=='number' || zoom < 3.2) {
    var pan0 = document.getElementById('orgEduPanel');
    if(pan0) pan0.style.display = 'none';
    return;
  }
  var o = player;
  // pick cell under cursor if free cam
  if(typeof mx==='number'){
    var wx0 = cam.x+(mx-cv.width/2)/zoom, wy0 = cam.y+(my-cv.height/2)/zoom;
    var best=null,bd=(o.size*1.2)*(o.size*1.2);
    // prefer player if mouse over player
    var pdx=player.x-wx0, pdy=player.y-wy0;
    if(pdx*pdx+pdy*pdy < (player.size*1.1)*(player.size*1.1)) best = player;
    if(!best && window.freeCam){
      bd = 40*40;
      for(var i=0;i<orgs.length;i++){
        var t=orgs[i]; if(!t||!t.alive) continue;
        var dd=(t.x-wx0)*(t.x-wx0)+(t.y-wy0)*(t.y-wy0);
        if(dd<bd && t.size*zoom>14){ bd=dd; best=t; }
      }
    }
    if(best) o = best;
  }
  // Must hover INSIDE the cell to show anatomy
  var mouseWX = (typeof mx==='number') ? cam.x+(mx-cv.width/2)/zoom : null;
  var mouseWY = (typeof my==='number') ? cam.y+(my-cv.height/2)/zoom : null;
  var inside = false;
  if(mouseWX!=null){
    var idx=mouseWX-o.x, idy=mouseWY-o.y;
    inside = (idx*idx+idy*idy) <= (o.size*1.05)*(o.size*1.05);
  }
  if(!inside){
    var panH = document.getElementById('orgEduPanel');
    if(panH) panH.style.display = 'none';
    return; // no permanent labels swimming around
  }

  var set = organelleSetFor(o);
  if(!set.length) return;

  var hovered = null;
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);

  for(var k=0;k<set.length;k++){
    var it = set[k];
    var info = ORGANELLE_INFO[it.id]; if(!info) continue;
    var wxp = o.x + it.x * o.size * 0.85;
    var wyp = o.y + it.y * o.size * 0.85;
    var sx = (wxp - cam.x)*zoom + cv.width/2;
    var sy = (wyp - cam.y)*zoom + cv.height/2;
    if(sx<-20||sy<-20||sx>cv.width+20||sy>cv.height+20) continue;

    var over = false;
    if(mouseWX!=null){
      var mdx = mouseWX - wxp, mdy = mouseWY - wyp;
      var hitR = Math.max(o.size*0.22, 6/zoom);
      if(mdx*mdx+mdy*mdy < hitR*hitR) over = true;
      // also screen-space comfort hit
      var sdx = mx - sx, sdy = my - sy;
      if(sdx*sdx+sdy*sdy < 16*16) over = true;
    }
    if(over) hovered = {id:it.id, info:info, sx:sx, sy:sy};

    // Quiet pins only (no text) — text solely on hover
    ctx.beginPath();
    ctx.fillStyle = over ? 'rgba(255,240,160,0.95)' : 'rgba(220,240,220,0.35)';
    ctx.strokeStyle = over ? 'rgba(255,220,100,0.9)' : 'rgba(120,180,140,0.35)';
    ctx.lineWidth = over ? 2 : 1;
    ctx.arc(sx, sy, over ? 5 : 3, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
  }

  // Hover label chip next to pin ONLY
  if(hovered){
    var lab = hovered.info.ru;
    ctx.font = 'bold 13px system-ui,sans-serif';
    var tw = ctx.measureText(lab).width;
    var lx = hovered.sx + 12, ly = hovered.sy - 16;
    ctx.fillStyle = 'rgba(6,16,12,0.92)';
    roundRect(ctx, lx-6, ly-12, tw+12, 22, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(180,220,160,0.5)';
    ctx.stroke();
    ctx.fillStyle = '#e8ffe0';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(lab, lx, ly);
  }
  ctx.restore();

  // Bottom panel only while inside cell
  ensureOrgEduPanel();
  var pan = document.getElementById('orgEduPanel');
  if(!pan) return;
  pan.style.display = 'block';
  var spn = (o.sp && o.sp.name) ? o.sp.name : 'клетка';
  var cat = (o.sp && o.sp.cat) ? o.sp.cat : '';
  var catRu = {producer:'водоросль',consumer1:'бактерия',consumer2:'инфузория',consumer3:'хищник',decomposer:'гриб'}[cat]||cat;
  var focus = hovered ? hovered.info : null;
  if(focus){
    pan.innerHTML = '<div style="font-size:11px;opacity:.7;margin-bottom:2px">🔬 Анатомия · '+spn+' <span style="opacity:.55">('+catRu+')</span></div>'+
      '<div style="font-size:15px;font-weight:700;color:#d4f5c8;margin:2px 0">'+focus.ru+
      (focus.en?' <span style="opacity:.5;font-weight:500;font-size:12px">'+focus.en+'</span>':'')+'</div>'+
      '<div style="font-size:12.5px;line-height:1.35;opacity:.92">'+focus.desc+'</div>';
  } else {
    pan.innerHTML = '<div style="font-size:11px;opacity:.7">🔬 Анатомия · '+spn+'</div>'+
      '<div style="font-size:13px;opacity:.85;margin-top:4px">Наведи на точку внутри клетки — название и роль органа</div>';
  }
}

function ensureOrgEduPanel(){
  if(document.getElementById('orgEduPanel')) return;
  var d = document.createElement('div');
  d.id = 'orgEduPanel';
  d.style.cssText = 'display:none;position:fixed;left:50%;transform:translateX(-50%);bottom:72px;z-index:60;'+
    'max-width:min(520px,92vw);padding:10px 14px;border-radius:10px;'+
    'background:rgba(4,16,22,0.88);border:1px solid rgba(100,180,140,0.45);'+
    'color:#eaf7f0;font-family:system-ui,sans-serif;pointer-events:none;'+
    'box-shadow:0 8px 28px rgba(0,0,0,0.45)';
  document.body.appendChild(d);
}
window.renderOrganelleEdu = renderOrganelleEdu;
window.ORGANELLE_INFO = ORGANELLE_INFO;

window.renderMinimap = renderMinimap;

window.renderPopGraph = typeof renderPopGraph!=="undefined" ? renderPopGraph : function(){};
