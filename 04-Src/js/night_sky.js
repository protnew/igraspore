// night_sky.js — Photorealistic starfield + Milky Way for night sky
(function(){
  // Generate stable star field (deterministic)
  var _stars = null;
  function genStars(){
    var s = [];
    // ~300 background stars
    for(var i=0; i<300; i++){
      var sx = Math.random();
      var sy = Math.random() * 0.4; // top 40% of sky only
      var mag = Math.pow(Math.random(), 3); // bias toward dim
      var hue = 200 + Math.random()*60 - 30; // blue-white to white
      s.push({
        x: sx, y: sy, mag: mag,
        size: 0.4 + mag * 1.8,
        hue: hue,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpd: 0.5 + Math.random() * 2,
      });
    }
    // ~40 bright stars (named-star feel)
    for(var i=0; i<40; i++){
      var sx = Math.random();
      var sy = Math.random() * 0.25;
      s.push({
        x: sx, y: sy, mag: 1,
        size: 1.5 + Math.random() * 2.5,
        hue: Math.random() < 0.3 ? 30 : (Math.random() < 0.5 ? 200 : 0), // some orange, some blue, some white
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpd: 1 + Math.random() * 3,
        bright: true,
        spike: Math.random() < 0.5, // diffraction spikes on some
      });
    }
    return s;
  }

  // Milky Way band — dense star cloud along a diagonal
  var _milkyStars = null;
  function genMilkyWay(){
    var s = [];
    for(var i=0; i<500; i++){
      // Band goes from bottom-left to upper-right
      var t = Math.random();
      var bandX = t;
      // Gaussian scatter around the band center
      var bandY = 0.08 + t * 0.18 + (Math.random()-0.5) * 0.08;
      var mag = Math.pow(Math.random(), 2.5);
      s.push({
        x: bandX, y: bandY, mag: mag,
        size: 0.3 + mag * 1.2,
        hue: 180 + Math.random() * 80, // blue-ish
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpd: 0.3 + Math.random() * 1.5,
      });
    }
    // Add nebula clouds (pink/blue patches)
    var nebulae = [];
    for(var i=0; i<5; i++){
      nebulae.push({
        x: 0.1 + Math.random() * 0.8,
        y: 0.05 + Math.random() * 0.25,
        rx: 0.08 + Math.random() * 0.12,
        ry: 0.03 + Math.random() * 0.04,
        hue: Math.random() < 0.5 ? 300 : 200, // pink or blue
        intensity: 0.04 + Math.random() * 0.06,
      });
    }
    return { stars: s, nebulae: nebulae };
  }

  window.renderNightSky = function(ctx2, cv, dl, fc){
    // Only render at night (dayLight < 0.25)
    if(dl > 0.25) return;
    
    var nightFrac = Math.min(1, (0.25 - dl) / 0.20); // 0 at dl=0.25, 1 at dl=0.05
    if(nightFrac < 0.05) return;
    
    var waterY = (0 - cam.y) * zoom + cv.height/2;
    if(waterY < 10) return; // no sky visible
    
    if(!_stars) _stars = genStars();
    if(!_milkyStars) _milkyStars = genMilkyWay();
    
    ctx2.save();
    // Clip to sky band
    ctx2.beginPath();
    ctx2.rect(0, 0, cv.width, Math.max(0, waterY));
    ctx2.clip();
    
    // Milky Way nebulae (soft glows)
    var mw = _milkyStars;
    for(var n=0; n<mw.nebulae.length; n++){
      var neb = mw.nebulae[n];
      var nx = neb.x * cv.width;
      var ny = neb.y * waterY;
      var nrx = neb.rx * cv.width;
      var nry = neb.ry * waterY;
      var ng = ctx2.createRadialGradient(nx, ny, 0, nx, ny, Math.max(nrx, nry));
      var r, gC, b;
      if(neb.hue === 300){ r=180; gC=60; b=120; } // pink
      else { r=60; gC=80; b=140; } // blue
      ng.addColorStop(0, 'rgba('+r+','+gC+','+b+','+(neb.intensity*nightFrac)+')');
      ng.addColorStop(0.5, 'rgba('+r+','+gC+','+b+','+(neb.intensity*0.4*nightFrac)+')');
      ng.addColorStop(1, 'rgba('+r+','+gC+','+b+',0)');
      ctx2.fillStyle = ng;
      ctx2.fillRect(nx-nrx*2, ny-nry*2, nrx*4, nry*4);
    }
    
    // Milky Way stars (dense band)
    for(var i=0; i<mw.stars.length; i++){
      var st = mw.stars[i];
      var sx = st.x * cv.width;
      var sy = st.y * waterY;
      if(sy > waterY - 2) continue;
      var tw = 0.7 + Math.sin(fc * st.twinkleSpd * 0.05 + st.twinkle) * 0.3;
      var alpha = nightFrac * (0.3 + st.mag * 0.6) * tw;
      var hue = st.hue;
      var r = hue < 100 ? 255 : (hue < 280 ? 200 + (280-hue)*0.5 : 180);
      var g = hue < 100 ? 200 + hue*0.5 : (hue < 280 ? 220 : 200);
      var b = hue < 100 ? 150 + (100-hue)*0.5 : 255;
      ctx2.fillStyle = 'rgba('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+','+alpha+')';
      ctx2.fillRect(sx, sy, st.size, st.size);
    }
    
    // Background stars
    for(var i=0; i<_stars.length; i++){
      var st = _stars[i];
      var sx = st.x * cv.width;
      var sy = st.y * waterY;
      if(sy > waterY - 2) continue;
      var tw = 0.6 + Math.sin(fc * st.twinkleSpd * 0.05 + st.twinkle) * 0.4;
      var alpha = nightFrac * (0.2 + st.mag * 0.7) * tw;
      if(alpha < 0.02) continue;
      
      var hue = st.hue;
      var r, gC, b;
      if(hue < 60){ r=255; gC=180+hue; b=120; } // warm/orange
      else if(hue < 200){ r=255; gC=250; b=230; } // white
      else { r=200; gC=220; b=255; } // blue-white
      
      ctx2.fillStyle = 'rgba('+r+','+gC+','+b+','+alpha+')';
      
      if(st.bright && st.spike && alpha > 0.3){
        // Diffraction spikes (cross shape)
        ctx2.fillRect(sx-st.size*2, sy, st.size*5, st.size*0.5);
        ctx2.fillRect(sx, sy-st.size*2, st.size*0.5, st.size*5);
      }
      ctx2.fillRect(sx, sy, st.size, st.size);
      
      // Bright star glow
      if(st.bright && alpha > 0.4){
        var gg = ctx2.createRadialGradient(sx+st.size/2, sy+st.size/2, 0, sx+st.size/2, sy+st.size/2, st.size*4);
        gg.addColorStop(0, 'rgba('+r+','+gC+','+b+','+(alpha*0.3)+')');
        gg.addColorStop(1, 'rgba('+r+','+gC+','+b+',0)');
        ctx2.fillStyle = gg;
        ctx2.fillRect(sx-st.size*3, sy-st.size*3, st.size*7, st.size*7);
      }
    }
    
    ctx2.restore();
  };
})();
