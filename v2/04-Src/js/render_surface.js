// render_surface.js — parallax, lilypads, glitter, snell, rays
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
    // No large shadow orb under leaf (was reading as gray bubbles)


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

  // TOP / surface view — realistic Nymphaea leaf
  // Contact shadow on water surface
  ctx.fillStyle = 'rgba(0, 15, 10, 0.15)';
  ctx.beginPath(); ctx.ellipse(4, 6, rx*1.08, ry*1.25, 0, 0, Math.PI*2); ctx.fill();

  // Organic leaf path with wavy margin
  function leafPath(sc){
    ctx.beginPath();
    var steps = 60, a0 = notch, a1 = Math.PI*2 - notch;
    for(var i2=0;i2<=steps;i2++){
      var a = a0 + (a1-a0)*(i2/steps);
      // Wavy edge — natural leaf margin
      var wave = 1 + Math.sin(a*7 + seed*0.3)*0.035 + Math.sin(a*13 + seed*0.7)*0.015;
      var px = Math.cos(a)*rx*sc*wave;
      var py = Math.sin(a)*ry*sc*wave;
      if(i2===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.lineTo(0,0);
    ctx.closePath();
  }

  // Base leaf fill — deep natural green (Nymphaea alba / lutea tones)
  leafPath(1);
  var lg = ctx.createRadialGradient(-rx*0.15, -ry*0.2, rx*0.05, 0, 0, rx*0.95);
  lg.addColorStop(0, '#5a8a42');
  lg.addColorStop(0.25, '#4a7538');
  lg.addColorStop(0.55, '#3a5e2c');
  lg.addColorStop(0.85, '#2a4622');
  lg.addColorStop(1, '#1a3018');
  ctx.fillStyle = lg;
  ctx.fill();

  // Rim — darker wet edge
  ctx.strokeStyle = 'rgba(15,40,15,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Palmate veins radiating from center — thicker primary, thin secondary
  ctx.lineCap = 'round';
  var nV = 11;
  for(var v=0; v<nV; v++){
    var va = notch + (Math.PI*2 - 2*notch)*(v+0.5)/nV;
    var isMajor = (v % 3 === 0);
    ctx.strokeStyle = isMajor ? 'rgba(20,55,20,0.45)' : 'rgba(30,65,28,0.22)';
    ctx.lineWidth = isMajor ? 1.8 : 0.8;
    ctx.beginPath();
    ctx.moveTo(Math.cos(va)*rx*0.06, Math.sin(va)*ry*0.06);
    ctx.quadraticCurveTo(
      Math.cos(va)*rx*0.45 + Math.sin(va+seed)*3,
      Math.sin(va)*ry*0.45,
      Math.cos(va)*rx*0.9,
      Math.sin(va)*ry*0.9
    );
    ctx.stroke();
  }

  // Water-repellent sheen — wet leaf glossy highlight
  var hg = ctx.createRadialGradient(-rx*0.2, -ry*0.28, 0, -rx*0.2, -ry*0.28, rx*0.55);
  hg.addColorStop(0, 'rgba(180,230,150,0.22)');
  hg.addColorStop(0.5, 'rgba(120,180,90,0.08)');
  hg.addColorStop(1, 'rgba(80,140,60,0)');
  ctx.fillStyle = hg;
  leafPath(0.85);
  ctx.fill();

  // Random age spots / blemishes for organic feel
  if(seed % 3 === 0){
    for(var sp=0; sp<3; sp++){
      var sa = sp*2.1 + seed*0.5;
      var sr = rx*(0.3 + (sp%2)*0.2);
      ctx.fillStyle = 'rgba(60,80,30,0.15)';
      ctx.beginPath();
      ctx.arc(Math.cos(sa)*sr, Math.sin(sa)*sr*0.8, rx*0.04, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // Notch cut — V-shape where stem connects
  ctx.strokeStyle = 'rgba(12,35,15,0.85)';
  ctx.lineWidth = 2.5;
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
  var dl = (typeof dayLight==='number') ? dayLight : 0.5;
  var fromBelow = (typeof cam!=='undefined' && cam.y > 18);
  // Chaotic scatter across the surface — natural pond coverage
  var pads = [];
  // Deterministic pseudo-random from world X for stable pads
  function padSeed(x){ var s=Math.sin(x*12.9898)*43758.5453; return s-Math.floor(s); }
  // CHAOTIC 2D SCATTER — natural pond coverage, not a line
  for(var lp = -surfW + 50; lp < surfW; lp += 320 + padSeed(lp)*300){ // bigger pads, wider spacing
    var skip = padSeed(lp*1.3);
    if(skip < 0.15) continue; // organic gaps
    // Y scatter: pads spread vertically across surface band
    var wy = Math.sin(lp*0.025 + t*0.03)*1.5 + (padSeed(lp*2.1)-0.5)*2.0; // surface only y≈0 ±2.5
    var rx = 50 + padSeed(lp*0.7)*114; // 50-164 (2x bigger)
    var ry = rx * (fromBelow ? 0.48 : 0.36);
    var rot = padSeed(lp*3.1)*Math.PI*2;
    var px = lp + (padSeed(lp*4.2)-0.5)*120; // horizontal jitter
    pads.push({x:px, y:wy, rx:rx, ry:ry, rot:rot, seed:Math.abs(Math.floor(lp*100))});
    // Secondary pad — overlapping cluster (natural)
    if(padSeed(lp*5.3) > 0.85){ // rare secondary
      var off = padSeed(lp*6.1);
      pads.push({x:px+rx*(0.5+off*0.5), y:wy+padSeed(lp*7.1)*30-15, rx:rx*(0.4+off*0.3), ry:ry*(0.4+off*0.3), rot:rot+padSeed(lp*8.1)*2, seed:Math.abs(Math.floor(lp*100))+2});
    }
    // Tertiary small pad for density
    if(padSeed(lp*9.1) > 0.92){ // rare tertiary
      pads.push({x:px-rx*0.6+padSeed(lp*10.1)*50, y:wy-3+padSeed(lp*11.1)*5, rx:rx*0.3, ry:ry*0.3, rot:padSeed(lp*12.1)*4, seed:Math.abs(Math.floor(lp*100))+3});
    }
  }for(var _pi=0;_pi<pads.length;_pi++){ if(pads[_pi].y < -1) pads[_pi].y = -1; if(pads[_pi].y > 4) pads[_pi].y = Math.min(pads[_pi].y, 3); }
  window._lilyPads = pads;
  // --- Pad shadows: ~50% of sunlight blocked (readable shade columns) ---
  if(dl > 0.08){
    ctx.save();
    // Light direction from sun (parallel, one way)
    var shAng = sun ? Math.max(-0.45, Math.min(0.45, (sun.x - cam.x) * 0.0008)) : 0;
    var shLen = 90 + dl * 60; // deep into water column
    for(var i=0;i<pads.length;i++){
      var p = pads[i];
      if(p.x+p.rx < vL-40 || p.x-p.rx > vR+40) continue;
      var topW = p.rx * 0.92;
      var botW = p.rx * 0.55;
      var shift = shAng * shLen;
      // 50% of sunlight → alpha ~0.50 at top of shade (daylight modulated)
      var alpha = 0.35 * Math.min(1, dl / 0.9);
      if(fromBelow) alpha *= 0.72;
      var sg = ctx.createLinearGradient(p.x, 1, p.x + shift, shLen);
      sg.addColorStop(0, 'rgba(0, 10, 14, ' + alpha + ')');
      sg.addColorStop(0.4, 'rgba(0, 14, 18, ' + (alpha * 0.55) + ')');
      sg.addColorStop(0.85, 'rgba(0, 18, 22, ' + (alpha * 0.18) + ')');
      sg.addColorStop(1, 'rgba(0, 20, 25, 0)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.moveTo(p.x - topW, 1);
      ctx.lineTo(p.x + topW, 1);
      ctx.lineTo(p.x + shift + botW, shLen);
      ctx.lineTo(p.x + shift - botW, shLen);
      ctx.closePath();
      ctx.fill();
      // Contact shade tight under leaf (~darker rim)
      ctx.fillStyle = 'rgba(0, 8, 10, ' + (alpha * 0.55) + ')';
      ctx.beginPath();
      ctx.ellipse(p.x, 4, p.rx * 0.9, Math.max(10, p.ry * 1.1), 0, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw pads
  for(var i=0;i<pads.length;i++){
    var p = pads[i];
    if(p.x+p.rx < vL-10 || p.x-p.rx > vR+10) continue;
    drawOneLilypad(p.x, p.y, p.rx, p.ry, p.rot, p.seed, sun, fromBelow);
  }
  // Duckweed
  if(!fromBelow || (typeof cam!=='undefined' && cam.y < 50)){
    for(var d = -surfW + 160; d < surfW; d += 520){
      if(Math.abs(Math.floor(d/100)) % 3 === 0) continue;
      if(d < vL - 20 || d > vR + 20) continue;
      drawDuckweed(d, 0.5, 10, d);
    }
  }
}

function renderSunGlitter(vL, vR){
  var sun = window._sunPos;
  // Use star preset colors (not hardcoded yellow)
  var _preset = (typeof window.getStarPreset==='function') ? window.getStarPreset() : null;
  var _star0 = _preset ? _preset.stars[0] : null;
  var dl = (typeof dayLight==='number') ? dayLight : 0.5;
  if(dl < 0.15) return;
  ctx.save();
  // Underwater: projected warm sun on the surface (so never "two gray moons")
  if(typeof cam!=='undefined' && cam.y > 15){
    var sx = sun ? sun.x : cam.x;
    var sr = sun ? Math.max(16, sun.r*1.3) : 22;
    var sg2 = ctx.createRadialGradient(sx, -2, 0, sx, -2, sr*4);
    _star0 ? (function(){ var s=_star0; return 'rgba('+parseInt(s.mid.slice(1,3),16)+','+parseInt(s.mid.slice(3,5),16)+','+parseInt(s.mid.slice(5,7),16)+','+(0.85*dl)+')'; })() : 'rgba(255, 250, 220, ' + (0.85*dl) + ')'
    _star0 ? (function(){ var s=_star0; sg2.addColorStop(0.2, 'rgba('+Math.round(parseInt(s.mid.slice(1,3),16)*0.86)+','+Math.round(parseInt(s.mid.slice(3,5),16)*0.86)+','+Math.round(parseInt(s.mid.slice(5,7),16)*0.74)+','+(0.45*dl)+')'); sg2.addColorStop(0.55, 'rgba('+Math.round(parseInt(s.edge.slice(1,3),16))+','+Math.round(parseInt(s.edge.slice(3,5),16))+','+Math.round(parseInt(s.edge.slice(5,7),16))+','+(0.12*dl)+')'); sg2.addColorStop(1, 'rgba(0,0,0,0)'); })() : (sg2.addColorStop(0.2, 'rgba(255, 220, 120, ' + (0.45*dl) + ')') || sg2.addColorStop(0.55, 'rgba(255, 180, 60, ' + (0.12*dl) + ')') || sg2.addColorStop(1, 'rgba(255, 160, 40, 0)'));
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = sg2;
    ctx.beginPath(); ctx.arc(sx, -2, sr*4, 0, Math.PI*2); ctx.fill();
    // solid warm core on film
    ctx.globalCompositeOperation = 'source-over';
    var core = ctx.createRadialGradient(sx, -1, 0, sx, -1, sr);
    _star0 ? (function(){ var s=_star0; core.addColorStop(0, s.core); core.addColorStop(0.5, s.mid); core.addColorStop(1, 'rgba(0,0,0,0)'); })() : (core.addColorStop(0, '#fffef0') || core.addColorStop(0.5, '#ffe08a') || core.addColorStop(1, 'rgba(255,160,40,0.15)'));
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
function renderSnellWindow(vL, vR, vT, vB){ return; /* giant bubbles */ 
  // disabled: looked like huge gray/blue bubbles
  return;
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
    var _ps=(typeof window.getStarPreset==='function')?window.getStarPreset():null;
    var _s0=_ps?_ps.stars[0]:null;
    var _r=_s0?parseInt(_s0.mid.slice(1,3),16):255,_g=_s0?parseInt(_s0.mid.slice(3,5),16):250,_b=_s0?parseInt(_s0.mid.slice(5,7),16):210;
    g.addColorStop(0,'rgba('+_r+','+_g+','+_b+','+(opacity*1.2)+')');g.addColorStop(0.35,'rgba('+Math.round(_r*0.8)+','+Math.round(_g*0.95)+','+Math.round(_b*0.7)+','+(opacity*0.55)+')');g.addColorStop(0.7,'rgba(120,200,160,'+(opacity*0.2)+')');g.addColorStop(1,'rgba(80,160,140,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sr.x-sr.w/2,0);ctx.lineTo(sr.x+sr.w/2,0);
    ctx.lineTo(sr.x+sr.w/2+sr.angle*PD*0.7+sr.w*0.3,PD*0.7);ctx.lineTo(sr.x-sr.w/2+sr.angle*PD*0.7-sr.w*0.3,PD*0.7);
    ctx.closePath();ctx.fill();
  }
  ctx.restore();
}

