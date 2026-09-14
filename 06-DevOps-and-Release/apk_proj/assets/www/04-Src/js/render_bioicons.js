/* bioicons render mode — uses real scientific SVG illustrations */
/* Source: bioicons.com (CC0, CC BY 3.0, CC BY 4.0) */
(function(){
'use strict';

// Pre-rasterized sprite cache
var bioSprites = {}; // key: shape → {canvas, w, h}
var bioLoading = false;
var bioReady = false;

// Shape → icon mapping
var SHAPE_TO_ICON = {
  'circle':   'bact_coccus',    // coccus-shaped bacteria
  'rod':      'bact_rod',       // bacillus
  'spiral':   'bact_spiral',    // spirillum
  'filament': 'bact_filament',  // filamentous
  'comma':    'bact_comma',     // vibrio
  'colony':   'bact_nostoc',    // colonial (Nostoc-like)
  'phage':    'phage',          // bacteriophage
  'bell':     'chlamy',         // ciliate/flagellate (Chlamydomonas-like)
  'oval':     'yeast',          // yeast/fungal
  'irregular':'mycelium',       // fungal irregular
  'star':     'conidia',        // spores
};

// Category-based overrides for more specific icons
var CAT_OVERRIDE = {
  'decomposer': 'yeast',        // fungi as decomposers
  'virus': 'phage',
};

var ICON_FILES = [
  'phage', 'bacteria_swim', 'generic_bact', 'yeast',
  'fission_yeast', 'conidia', 'mycelium',
  'bact_coccus', 'bact_rod', 'bact_spiral', 'bact_comma',
  'bact_nostoc', 'bact_trichormus', 'bact_filament',
  'chlamy', 'servier_bact', 'servier_bact_int',
  'bact_coccus1', 'bact_rod1',
];

// Load and rasterize an SVG to an offscreen canvas
function rasterizeSVG(svgText, maxSize) {
  maxSize = maxSize || 128;
  var blob = new Blob([svgText], { type: 'image/svg+xml' });
  var url = URL.createObjectURL(blob);
  // Synchronous rasterization is not possible; return a promise
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function() {
      var scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      var w = Math.max(1, Math.round(img.width * scale));
      var h = Math.max(1, Math.round(img.height * scale));
      var cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      var cx = cv.getContext('2d');
      cx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve({ canvas: cv, w: w, h: h });
    };
    img.onerror = function() { URL.revokeObjectURL(url); reject('load error'); };
    img.src = url;
  });
}

window.loadBioicons = function(basePath) {
  basePath = basePath || 'assets/bioicons/';
  if (bioLoading) return;
  bioLoading = true;
  var loaded = 0;
  var total = ICON_FILES.length;
  
  ICON_FILES.forEach(function(name) {
    fetch(basePath + name + '.svg')
      .then(function(r) { return r.text(); })
      .then(function(svg) {
        // Determine size based on complexity
        var maxSize = name.startsWith('bact_') ? 96 : 128;
        return rasterizeSVG(svg, maxSize);
      })
      .then(function(spr) {
        bioSprites[name] = spr;
        loaded++;
        if (loaded >= total) {
          bioReady = true;
          console.log('[bioicons] Loaded ' + loaded + ' sprites');
        }
      })
      .catch(function(err) {
        console.warn('[bioicons] Failed to load ' + name + ': ' + err);
        loaded++;
        if (loaded >= total) bioReady = true;
      });
  });
};

window.bioiconsReady = function() { return bioReady; };

// Draw a bioicon sprite for an organism
window.drawBioicon = function(ctx, o, sz, sh) {
  if (!bioReady) return false;
  
  // Determine icon name
  var iconName = null;
  if (o.sp && o.sp.cat && CAT_OVERRIDE[o.sp.cat]) {
    iconName = CAT_OVERRIDE[o.sp.cat];
  }
  if (!iconName && sh && SHAPE_TO_ICON[sh]) {
    iconName = SHAPE_TO_ICON[sh];
  }
  if (!iconName) iconName = 'generic_bact';
  
  var spr = bioSprites[iconName];
  if (!spr) return false;
  
  // Calculate draw size: 2x the organism size
  var drawW = Math.max(2.2, Math.min(18, sz * 1.15));
  var drawH = drawW;
  // Maintain aspect ratio from sprite
  var aspect = spr.w / spr.h;
  if (aspect > 1) { drawH = drawW / aspect; }
  else { drawW = drawH * aspect; }
  
  // Tint based on species color (overlay)
  ctx.save();
  ctx.translate(o.x, o.y);
  
  // Rotate for orientation
  var ang = (typeof o.facing === 'number' && isFinite(o.facing)) ? o.facing
          : (typeof o.angle === 'number' && isFinite(o.angle)) ? o.angle : 0;
  ctx.rotate(ang);
  
  // Draw sprite centered
  ctx.drawImage(spr.canvas, -drawW/2, -drawH/2, drawW, drawH);
  
  // Energy-based opacity overlay (sick = faded)
  if (o.energy < 30) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, 0, drawW/2, 0, Math.PI*2);
    ctx.fill();
  }
  
  // Division indicator: split glow
  if (o.dividing) {
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, drawW/2 + 2, 0, Math.PI*2);
    ctx.stroke();
  }
  
  ctx.restore();
  return true;
};

// Render viruses as bioicon phages
window.drawVirusBioicon = function(ctx, v) {
  if (!bioReady) return false;
  var spr = bioSprites['phage'];
  if (!spr) return false;
  
  var drawW = 24, drawH = 24;
  var aspect = spr.w / spr.h;
  if (aspect > 1) drawH = drawW / aspect;
  else drawW = drawH * aspect;
  
  ctx.save();
  ctx.translate(v.x, v.y);
  ctx.rotate(v.angle || 0);
  ctx.drawImage(spr.canvas, -drawW/2, -drawH/2, drawW, drawH);
  ctx.restore();
  return true;
};

})();
