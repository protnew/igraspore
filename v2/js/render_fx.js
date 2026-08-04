// render_fx.js — sediment, nutrients, shadows, bubbles, rain, sun overlay
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
  // Organism-scale shadows off (muddy). Pad volumetric shadows drawn in drawNaturalLilypads.
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



// Sun overlay — draws sun disc + glow ON TOP of particles (no green halo)
function renderSunOverlay(){
  // Sun is a SKY object (screen-space). Never draw below waterline.
  // Soft fade when sky band shrinks (zoom/perspective) — no pop, no underwater disk.
  if(typeof dayLight==='number' && dayLight < 0.05) return;
  if(!window._sunPos) return;
  var sun = window._sunPos;
  var waterScreenY = (0 - cam.y) * zoom + cv.height/2; // y=0 waterline → screen
  // hysteresis: hide only when sky fully gone; fade while shrinking
  if(waterScreenY < 4) return;
  var dl = sun.dl || dayLight || 0.5;
  // Screen radius independent of world zoom (perspective: sun size stable in sky)
  var elev = (typeof sun.elev==='number') ? sun.elev : 0.7;
  var r = 14 + elev * 22; // 14..36 px
  if(r > waterScreenY * 0.45) r = Math.max(6, waterScreenY * 0.45);
  // Place sun INSIDE remaining sky band (not world→screen drift)
  var sx = (typeof sun.scrX==='number') ? sun.scrX : (cv.width * (0.25 + elev * 0.35));
  var skyFrac = 0.12 + (1 - elev) * 0.18; // higher at noon
  var sy = Math.max(r + 4, waterScreenY * skyFrac);
  // Hard clip: entire disk above waterline
  if(sy + r > waterScreenY - 2) sy = waterScreenY - r - 2;
  if(sy < r * 0.3) return;
  // Fade alpha by sky band height (smooth). Keep visible while sky >= ~1.2*r
  var fade = waterScreenY / (r * 2.2 + 18);
  if(fade > 1) fade = 1;
  if(fade < 0.08) return;
  if(sx < -r*3 || sx > cv.width + r*3) return;

  // Delegate to custom star renderer (supports binary/multi-star presets)
  if (typeof window.renderStarsCustom === 'function') {
    window.renderStarsCustom(sun, fade, dl);
  } else {
    // Fallback: basic sun
    ctx.save();
    ctx.globalAlpha = fade * Math.min(1, dl + 0.25);
    var g2 = ctx.createRadialGradient(sx-r*0.2, sy-r*0.2, 0, sx, sy, r);
    g2.addColorStop(0, '#fffef5');
    g2.addColorStop(0.7, '#ffd078');
    g2.addColorStop(1, '#ffc060');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}
