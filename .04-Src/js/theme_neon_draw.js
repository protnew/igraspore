/* theme_neon_draw.js — neon-bio organisms: procedural body: glow fill, contour, cilia/flagella, speckles. ≤500L */
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
      im.src = "assets/themes/neon-bio/sprites/species/" + pad + ".png?v=6";
    } catch (e3) {}
    return null;
  }
  function neonDrawSz(sz) {
    /* ~2x prior — concept shows 3–5 large neon organisms */
    if (w.demoMode) return Math.max(28, Math.min(52, (sz || 4) * 8));
    return Math.max(5, Math.min(40, (sz || 4) * 3.4));
  }
  /* shape -> body: rx,ry (rel. to s), kind: cil=cilia fringe, fl=flagella, sp=spiral, dip=pair, ph=phage */
  function bodyOf(shape) {
    var m = {
      rod:[1.15,0.42,"fl"], bacillus:[1.15,0.42,"fl"], clubrod:[1.1,0.45,"fl"], trichormus:[1.3,0.32,"fl"], filament:[1.35,0.28,"fl"],
      rodtococcus:[0.9,0.5,"fl"], comma:[1.0,0.38,"sp"], vibrio:[1.0,0.38,"sp"], spiral:[1.2,0.3,"sp"], spirillum:[1.2,0.3,"sp"],
      slipper:[1.1,0.55,"cil"], hypotrich:[1.0,0.6,"cil"], oval:[0.95,0.6,"cil"], rotifer:[0.8,0.55,"cil"], bell:[0.75,0.7,"cil"],
      flatworm:[1.2,0.45,"cil"], apicomplexa:[1.0,0.45,"fl"], diplococci:[0.42,0.42,"dip"], phage:[0.45,0.38,"ph"],
      coccus:[0.7,0.7,"cil"], circle:[0.72,0.72,"cil"], cluster:[0.75,0.7,"cil"], colony:[0.8,0.75,"cil"], chain:[1.2,0.35,"fl"],
      archaea:[0.8,0.6,"fl"], mollicutes:[0.7,0.6,"cil"], irregular:[0.8,0.65,"cil"]
    };
    return m[shape] || [0.95, 0.58, "cil"];
  }
  function rgba(hex, a) {
    var h = String(hex).replace("#", ""); if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var n = parseInt(h, 16) || 0xffffff; return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }
  function bake(shape, color, px) {
    var key = shape + "|" + color + "|" + px + "|v5";
    if (CACHE[key]) return CACHE[key];
    var c = document.createElement("canvas");
    c.width = px; c.height = px;
    var g = c.getContext("2d");
    var cx = px / 2, cy = px / 2, s = px * 0.26;
    var b = bodyOf(shape), rx = s * b[0], ry = s * b[1], kind = b[2];
    var seed = 0; for (var q = 0; q < shape.length; q++) seed = (seed * 31 + shape.charCodeAt(q)) | 0;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function bodyPath() {
      if (kind === "dip") { g.arc(cx - rx * 0.95, cy, rx, 0, 6.2832); g.moveTo(cx + rx * 1.95, cy); g.arc(cx + rx * 0.95, cy, rx, 0, 6.2832); return; }
      if (kind === "sp") {
        for (var t = 0; t <= 1.0001; t += 0.04) { var x = cx + (t - 0.5) * rx * 2, y = cy + Math.sin(t * 9.42) * ry * 0.9 - ry * 0.45; t === 0 ? g.moveTo(x, y) : g.lineTo(x, y); }
        for (var t2 = 1; t2 >= -0.0001; t2 -= 0.04) { g.lineTo(cx + (t2 - 0.5) * rx * 2, cy + Math.sin(t2 * 9.42) * ry * 0.9 + ry * 0.45); }
        g.closePath(); return;
      }
      if (kind === "ph") { g.ellipse(cx, cy - s * 0.4, rx, ry, 0, 0, 6.2832); return; }
      g.ellipse(cx, cy, rx, ry, 0, 0, 6.2832);
    }
    function edge(a) { return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; }
    /* 1 translucent glowing fill */
    g.save(); g.shadowColor = color; g.shadowBlur = px * 0.12;
    var gr = g.createRadialGradient(cx - rx * 0.2, cy - ry * 0.2, 0, cx, cy, Math.max(rx, ry) * 1.1);
    gr.addColorStop(0, rgba(color, 0.55)); gr.addColorStop(0.6, rgba(color, 0.3)); gr.addColorStop(1, rgba(color, 0.12));
    g.fillStyle = gr; g.beginPath(); bodyPath(); g.fill(); g.restore();
    /* 2 cilia / flagella */
    g.save(); g.strokeStyle = rgba(color, 0.9); g.shadowColor = color; g.shadowBlur = px * 0.04; g.lineCap = "round";
    g.lineWidth = Math.max(1, px * 0.011);
    if (kind === "cil" || kind === "dip") {
      var n = Math.round(46 * Math.max(rx, ry) / s);
      for (var i = 0; i < n; i++) {
        var a = i / n * 6.2832, e0 = edge(a), L = s * (0.16 + rnd() * 0.08), nx = Math.cos(a) * ry, ny = Math.sin(a) * rx, nl = Math.hypot(nx, ny) || 1;
        if (kind === "dip") { e0 = [cx + (Math.cos(a) > 0 ? rx * 0.95 : -rx * 0.95) + Math.cos(a) * rx, cy + Math.sin(a) * rx]; nx = Math.cos(a); ny = Math.sin(a); nl = 1; }
        var bend = (rnd() - 0.5) * 0.6;
        g.beginPath(); g.moveTo(e0[0], e0[1]);
        g.quadraticCurveTo(e0[0] + nx / nl * L * 0.6 - ny / nl * L * bend, e0[1] + ny / nl * L * 0.6 + nx / nl * L * bend, e0[0] + nx / nl * L, e0[1] + ny / nl * L);
        g.stroke();
      }
    } else {
      var nf = kind === "fl" ? 3 : 1; g.lineWidth = Math.max(1.2, px * 0.016);
      for (var f = 0; f < nf; f++) {
        var sx = kind === "ph" ? cx : cx + rx * 0.98, sy = kind === "ph" ? cy - s * 0.4 + ry : cy + (f - (nf - 1) / 2) * ry * 0.5;
        g.beginPath(); g.moveTo(sx, sy);
        for (var k = 1; k <= 14; k++) {
          var tt = k / 14;
          if (kind === "ph") g.lineTo(sx + Math.sin(tt * 12) * s * 0.06, sy + tt * s * 0.9);
          else g.lineTo(sx + tt * s * 0.95, sy + Math.sin(tt * 9 + f) * s * 0.14 * tt);
        }
        g.stroke();
      }
      if (kind === "ph") { for (var lg = -1; lg <= 1; lg += 2) { g.beginPath(); g.moveTo(cx, cy - s * 0.4 + ry + s * 0.9); g.lineTo(cx + lg * s * 0.4, cy + s * 0.75); g.stroke(); } }
    }
    g.restore();
    /* 3 bright contour + white hot core line */
    g.save(); g.lineJoin = "round";
    g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = px * 0.09; g.lineWidth = Math.max(1.6, px * 0.024);
    g.beginPath(); bodyPath(); g.stroke();
    g.shadowBlur = 0; g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = Math.max(0.8, px * 0.008);
    g.beginPath(); bodyPath(); g.stroke(); g.restore();
    /* 4 inner speckles + nucleus */
    g.save(); g.beginPath(); bodyPath(); g.clip();
    for (var d = 0; d < 26; d++) {
      var da = rnd() * 6.2832, dr = Math.sqrt(rnd()) * 0.8;
      var dx = cx + Math.cos(da) * rx * dr * (kind === "dip" ? 2 : 1), dy = cy + Math.sin(da) * ry * dr - (kind === "ph" ? s * 0.4 : 0);
      g.fillStyle = rnd() < 0.35 ? "rgba(255,255,255,0.9)" : rgba(color, 0.95);
      g.beginPath(); g.arc(dx, dy, px * (0.006 + rnd() * 0.012), 0, 6.2832); g.fill();
    }
    if (kind !== "sp" && kind !== "ph") {
      g.shadowColor = "#fff"; g.shadowBlur = px * 0.04; g.fillStyle = "rgba(255,255,255,0.85)";
      g.beginPath(); g.ellipse(cx + rx * 0.1, cy, Math.min(rx, ry) * 0.22, Math.min(rx, ry) * 0.18, 0, 0, 6.2832); g.fill();
    }
    g.restore();
    CACHE[key] = c;
    var ks = Object.keys(CACHE); if (ks.length > 160) delete CACHE[ks[0]];
    return c;
  }
  function drawNeonCell(c, o, sz) {
    var drawSz = neonDrawSz(sz);
    var color = colOf(o), shape = shapeOf(o);
    var px = drawSz > 34 ? 160 : drawSz > 20 ? 112 : 72;
    var spr = bake(shape, color, px);
    var k = drawSz * 2.2;
    c.save(); c.globalAlpha = 0.95;
    c.drawImage(spr, -k / 2, -k / 2, k, k);
    c.restore();
  }
  var SPRITE_BASE = "assets/themes/neon-bio/sprites/";
  function wikiThumbSrc(shape) { return SPRITE_BASE + (shape || "circle") + ".png"; }
  w.igsNeonDraw = { drawCell: drawNeonCell, bake: bake, wikiThumbSrc: wikiThumbSrc, shapeOf: shapeOf, colOf: colOf };
})(typeof window !== "undefined" ? window : globalThis);
