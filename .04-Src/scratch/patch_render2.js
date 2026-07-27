const fs = require('fs');
let code = fs.readFileSync('js/render.js', 'utf8');

// 1. Add renderSurfaceFlora and renderSun
code = code.replace(/function renderWorld\(\)\{/, 
`function renderSun(ctx, cam) {
    if (window.globalCatastrophe && window.globalCatastrophe.type === 'eclipse') return;
    var sunX = PW/2 - cam.x * 0.05;
    var sunY = -200; 
    var grad = ctx.createRadialGradient(sunX, sunY, 50, sunX, sunY, 500);
    grad.addColorStop(0, 'rgba(255, 255, 220, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 220, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(sunX, sunY, 500, 0, Math.PI*2); ctx.fill();
    
    ctx.globalCompositeOperation = 'screen';
    for(var i=0; i<sunRays.length; i++) {
        var r = sunRays[i];
        var rayX = r.x - cam.x * 0.1;
        ctx.beginPath();
        ctx.moveTo(rayX - r.w, 0);
        ctx.lineTo(rayX + r.w, 0);
        ctx.lineTo(rayX + r.w + Math.tan(r.angle)*PD, PD);
        ctx.lineTo(rayX - r.w + Math.tan(r.angle)*PD, PD);
        var rgrad = ctx.createLinearGradient(0, 0, 0, PD);
        rgrad.addColorStop(0, 'rgba(255, 255, 220, 0.15)');
        rgrad.addColorStop(1, 'rgba(255, 255, 220, 0)');
        ctx.fillStyle = rgrad; ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
}

function renderSurfaceFlora(ctx, cam, zoom) {
    for (var i = -10; i < PW/300 + 10; i++) {
        var lx = (i * 300) + Math.sin(i * 123.45) * 150;
        var sz = 80 + Math.cos(i * 98.7) * 40;
        if(lx < cam.x - canvas.width/(2*zoom) - sz || lx > cam.x + canvas.width/(2*zoom) + sz) continue;
        
        ctx.fillStyle = '#1e401b';
        ctx.beginPath();
        ctx.arc(lx, 0, sz, 0.3, Math.PI * 2 - 0.3);
        ctx.lineTo(lx, 0);
        ctx.fill();
        
        // Dynamic shadow from lily (cast down)
        if (settings.shadows) {
           ctx.fillStyle = 'rgba(0,0,0,0.3)';
           ctx.beginPath();
           ctx.ellipse(lx + (lx - (PW/2 - cam.x*0.05))*0.1, PD, sz*1.5, sz*0.3, 0, 0, Math.PI*2);
           ctx.fill();
        }
    }
}

function renderWorld(){`);

// 2. Call renderSun and renderSurfaceFlora in renderWorld
// The sun should be drawn in the background, surface flora at the top
code = code.replace(/if\(settings\.shadows\)\{/, 
`renderSun(ctx, cam);
  if(settings.shadows){`);

code = code.replace(/ctx\.restore\(\);\s*\/\/\s*HUD/, 
`renderSurfaceFlora(ctx, cam, zoom);
  ctx.restore();
  // Chromatic Aberration at high depth or high zoom
  if (zoom > 3.0 || cam.y > PD * 0.7) {
      canvas.style.filter = "drop-shadow(2px 0 0 rgba(255,0,0,0.5)) drop-shadow(-2px 0 0 rgba(0,255,255,0.5))";
  } else {
      canvas.style.filter = "none";
  }
  // HUD`);

// 3. Draw Flagellum in drawBody
code = code.replace(/ctx\.fill\(\);/, 
`ctx.fill();
  if (o.sp.locomotion === 'flagella' && vmag > 0.5) {
      ctx.beginPath();
      let a = Math.atan2(o.vy, o.vx);
      let tX = -Math.cos(a) * sz;
      let tY = -Math.sin(a) * sz;
      ctx.moveTo(tX, tY);
      for(let w=1; w<=4; w++) {
          let dist = sz + w * sz * 0.4;
          let wave = Math.sin(o.pulse * 10 - w * 1.5) * sz * 0.4;
          ctx.lineTo(-Math.cos(a)*dist - Math.sin(a)*wave, -Math.sin(a)*dist + Math.cos(a)*wave);
      }
      ctx.strokeStyle = fd; ctx.lineWidth = sz*0.1; ctx.stroke();
  }`);

// 4. Draw Damage Decals in drawBody
code = code.replace(/ctx\.stroke\(\);/, 
`ctx.stroke();
  if (o.energy < o.sp.repEnergy * 0.2 && o.sp.cat !== 'virus') {
      ctx.beginPath();
      ctx.moveTo(-sz*0.5, sz*0.5); ctx.lineTo(-sz*0.2, 0);
      ctx.lineTo(sz*0.3, sz*0.3); ctx.lineTo(sz*0.6, -sz*0.4);
      ctx.strokeStyle = '#f00'; ctx.lineWidth = Math.max(1, sz*0.1); ctx.stroke();
  }`);

fs.writeFileSync('js/render.js', code, 'utf8');
console.log('render.js patched successfully!');
