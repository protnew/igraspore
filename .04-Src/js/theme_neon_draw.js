/* theme_neon_draw.js — neon-bio organisms: species PNG + contour glow. ≤500L */
(function (w) {
  "use strict";
  var CACHE = {};
  var SP_IMG = {};
  var SP_TRY = {};
  var PAL = ["#00ffff", "#ff00c8", "#78ff50", "#b464ff", "#ffdc50", "#50b4ff", "#ff50a0", "#28ffb4"];
  function colOf(o) {
    if (o && o.sp && o.sp.color) return o.sp.color;
    var n = (o && o.sp && (o.sp.id || o.sp.name)) || "x";
    var h = 0; for (var i = 0; i < String(n).length; i++) h = (h * 31 + String(n).charCodeAt(i)) | 0;
    return PAL[Math.abs(h) % PAL.length];
  }
  function shapeOf(o) {
    try {
      if (o && o.sp && o.sp.shape) return String(o.sp.shape);
      if (typeof w.pickShape === "function") return w.pickShape(o, "circle");
    } catch (e) {}
    return "circle";
  }
  function spIdx(o) {
    if (!o || !o.sp) return null;
    if (typeof o.sp.i === "number") return o.sp.i;
    if (typeof o.sp.idx === "number") return o.sp.idx;
    /* species PNG files are 000-based array index; sp.num is 1-based */
    if (typeof o.sp.num === "number") return Math.max(0, o.sp.num - 1);
    try {
      if (typeof SPECIES_DB !== "undefined" && o.sp.name) {
        for (var i = 0; i < SPECIES_DB.length; i++) {
          if (SPECIES_DB[i] && SPECIES_DB[i].name === o.sp.name) return i;
        }
      }
    } catch (e2) {}
    return null;
  }
  function loadSp(idx) {
    if (idx == null) return null;
    var k = String(idx);
    if (SP_IMG[k]) return SP_IMG[k];
    if (SP_TRY[k]) return null;
    SP_TRY[k] = true;
    try {
      var im = new Image();
      var pad = ("00" + idx).slice(-3);
      im.onload = function () { SP_IMG[k] = im; };
      im.onerror = function () { /* keep tried */ };
      im.src = "assets/themes/neon-bio/sprites/species/" + pad + ".png?v=3";
    } catch (e3) {}
    return null;
  }
  function neonDrawSz(sz) {
    /* Readable game scale (cilia/nucleus visible) without half-screen giants */
    if (w.demoMode) return Math.max(18, Math.min(34, (sz || 4) * 5));
    return Math.max(6.5, Math.min(28, (sz || 4) * 2.9));
  }
  function bake(shape, color, px) {
    var key = shape + "|" + color + "|" + px + "|v4";
    if (CACHE[key]) return CACHE[key];
    var c = document.createElement("canvas");
    c.width = px; c.height = px;
    var g = c.getContext("2d");
    var cx = px / 2, cy = px / 2, s = px * 0.28;
    function faintFill(pathFn) {
      g.save();
      g.globalAlpha = 0.16;
      g.fillStyle = color;
      g.beginPath(); pathFn(); g.fill();
      g.restore();
    }
    function strokeContour(pathFn, lw) {
      g.save();
      g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = Math.max(6, px * 0.08);
      g.lineWidth = lw || 2.2; g.lineJoin = "round"; g.lineCap = "round";
      g.beginPath(); pathFn(); g.stroke();
      g.shadowBlur = 0; g.strokeStyle = "#fff"; g.globalAlpha = 0.85; g.lineWidth = Math.max(1, (lw || 2.2) * 0.45);
      g.beginPath(); pathFn(); g.stroke();
      g.restore();
    }
    function nucleus() {
      g.save(); g.fillStyle = "#fff"; g.globalAlpha = 0.92; g.shadowBlur = 0;
      g.beginPath(); g.arc(cx - s * 0.18, cy - s * 0.08, s * 0.11, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(cx + s * 0.22, cy + s * 0.14, s * 0.08, 0, Math.PI * 2); g.fill();
      g.restore();
    }
    function cilia(rx, ry, n) {
      g.save(); g.strokeStyle = color; g.globalAlpha = 0.9; g.lineWidth = Math.max(1, px * 0.012);
      g.shadowColor = color; g.shadowBlur = 4;
      for (var a = 0; a < Math.PI * 2; a += (Math.PI * 2) / n) {
        g.beginPath();
        g.moveTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
        g.lineTo(cx + Math.cos(a) * rx * 1.38, cy + Math.sin(a) * ry * 1.38);
        g.stroke();
      }
      g.restore();
    }
    if (shape === "rod" || shape === "bacillus" || shape === "filament" || shape === "clubrod" || shape === "trichormus") {
      var rr = function () { g.ellipse(cx, cy, s * 1.15, s * 0.42, 0, 0, Math.PI * 2); };
      faintFill(rr); strokeContour(rr, 2.2); nucleus();
      g.save(); g.strokeStyle = color; g.globalAlpha = 0.85; g.lineWidth = 1.3; g.shadowColor = color; g.shadowBlur = 4;
      for (var i = 0; i < 8; i++) {
        var yy = cy - s * 0.35 + (i / 7) * s * 0.7;
        g.beginPath(); g.moveTo(cx - s * 1.15, yy); g.lineTo(cx - s * 1.45, yy); g.stroke();
        g.beginPath(); g.moveTo(cx + s * 1.15, yy); g.lineTo(cx + s * 1.45, yy); g.stroke();
      }
      g.restore();
    } else if (shape === "spiral" || shape === "spirillum" || shape === "comma" || shape === "vibrio") {
      g.save(); g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = 8; g.lineWidth = 3.2; g.lineCap = "round";
      g.beginPath();
      for (var t = 0; t <= 1.001; t += 0.02) {
        var xx = cx + (t - 0.5) * s * 2.2;
        var yy = cy + Math.sin(t * Math.PI * 3) * s * 0.45;
        if (t === 0) g.moveTo(xx, yy); else g.lineTo(xx, yy);
      }
      g.stroke(); g.restore();
      faintFill(function () { g.ellipse(cx, cy, s * 0.9, s * 0.35, 0, 0, Math.PI * 2); });
      nucleus();
    } else if (shape === "phage") {
      var ph = function () { g.ellipse(cx, cy - s * 0.35, s * 0.45, s * 0.35, 0, 0, Math.PI * 2); };
      faintFill(ph); strokeContour(ph, 2.2);
      g.save(); g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = 8; g.lineWidth = 2.2;
      g.beginPath(); g.moveTo(cx, cy - s * 0.05); g.lineTo(cx, cy + s * 0.7); g.stroke();
      g.restore();
    } else if (shape === "diplococci") {
      var p1 = function () { g.arc(cx - s * 0.4, cy, s * 0.4, 0, Math.PI * 2); };
      var p2 = function () { g.arc(cx + s * 0.4, cy, s * 0.4, 0, Math.PI * 2); };
      faintFill(p1); strokeContour(p1, 2.1); faintFill(p2); strokeContour(p2, 2.1); nucleus();
    } else {
      var pc0 = function () { g.arc(cx, cy, s * 0.72, 0, Math.PI * 2); };
      faintFill(pc0); strokeContour(pc0, 2.5); cilia(s * 0.74, s * 0.74, 16); nucleus();
    }
    CACHE[key] = c;
    if (Object.keys(CACHE).length > 64) { var k0 = Object.keys(CACHE)[0]; delete CACHE[k0]; }
    return c;
  }
  function drawNeonCell(c, o, sz) {
    var drawSz = neonDrawSz(sz);
    var shape = shapeOf(o);
    var color = colOf(o);
    var idx = spIdx(o);
    var sp = loadSp(idx);
    function glowDraw(img, x, y, w, h) {
      /* single-pass glow — keep FPS ≥ classic at 1400 */
      c.save();
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = 1;
      c.shadowColor = color;
      c.shadowBlur = Math.max(4, Math.min(14, drawSz * 0.55));
      c.drawImage(img, x, y, w, h);
      c.restore();
    }
    if (sp && (sp.naturalWidth || sp.width) > 1) {
      var iw = sp.naturalWidth || sp.width;
      var ih = sp.naturalHeight || sp.height;
      var aspect = iw / Math.max(1, ih);
      var dw, dh;
      if (aspect >= 1) { dw = drawSz; dh = drawSz / aspect; }
      else { dh = drawSz; dw = drawSz * aspect; }
      glowDraw(sp, -dw / 2, -dh / 2, dw, dh);
      return;
    }
    var px = Math.max(48, Math.min(128, Math.round(drawSz * 10)));
    var spr = bake(shape, color, px);
    glowDraw(spr, -drawSz, -drawSz, drawSz * 2, drawSz * 2);
  }
  var SPRITE_BASE = "assets/themes/neon-bio/sprites/";
  function wikiThumbSrc(shape) { return SPRITE_BASE + (shape || "circle") + ".png"; }
  w.igsNeonDraw = { drawCell: drawNeonCell, bake: bake, wikiThumbSrc: wikiThumbSrc, shapeOf: shapeOf, colOf: colOf };
})(typeof window !== "undefined" ? window : globalThis);
