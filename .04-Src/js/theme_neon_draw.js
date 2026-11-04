/* theme_neon_draw.js — v5 procedural organisms for 6 pond styles (neon, phase, engraving, cyber, glass, haeckel). ≤500L */
(function (w) {
  "use strict";
  var CACHE = {}, THUMBS = {};
  var STYLE_OF = { "neon-bio": "neon", "phase-contrast": "phase", "engraving": "engr", "cyberpunk-scanner": "cyber", "glass-lab": "glass", "haeckel-watercolor": "haeckel" };
  var PALS = {
    neon:    { prod: ["#00e8ff", "#7dff5a", "#00ffd0", "#ff3cd2"], dec: ["#b05cff", "#d24bff", "#b05cff", "#ffd84a"], rest: ["#00f0ff", "#ff2bd6", "#3fd0ff", "#ff4fe0", "#00ffd5", "#d24bff", "#00c8ff", "#ff3cae"] },
    phase:   { prod: ["#cfd6d8"], dec: ["#cfd6d8"], rest: ["#cfd6d8"] },
    engr:    { prod: ["#2b1a0e"], dec: ["#2b1a0e"], rest: ["#2b1a0e"] },
    cyber:   { prod: ["#39ffb0"], dec: ["#ff2bd6"], rest: ["#00f6ff", "#ff2bd6", "#00f6ff", "#ff4fe0"] },
    glass:   { prod: ["#b6ffc8", "#c8ffb0"], dec: ["#e0c8ff"], rest: ["#9fe8ff", "#c9b8ff", "#ffc2e6", "#a8f0ff"] },
    haeckel: { prod: ["#6f9e4a", "#8aa648"], dec: ["#b0843a", "#8c6a3a"], rest: ["#c0573a", "#2f7d8c", "#7a4f8e", "#3d6fa8", "#b2464f", "#3f8f7a"] }
  };
  function styleNow() { return STYLE_OF[w.__igsThemePondId] || "neon"; }
  function hashStr(n) { var h = 0; n = String(n); for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) | 0; return Math.abs(h); }
  function colOf(o, st) {
    var sp = (o && o.sp) || o || {};
    var P = PALS[st || styleNow()] || PALS.neon;
    var arr = sp.cat === "producer" ? P.prod : sp.cat === "decomposer" ? P.dec : P.rest;
    return arr[hashStr(sp.id || sp.name || "x") % arr.length];
  }
  function shapeOf(o) {
    try {
      if (o && o.sp && o.sp.shape) return String(o.sp.shape);
      if (typeof w.pickShape === "function") return w.pickShape(o, "circle");
    } catch (e) {}
    return "circle";
  }
  function drawSzOf(sz) {
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
  /* geometry kit shared by all styles */
  function kit(g, shape, px) {
    var cx = px / 2, cy = px / 2, s = px * 0.26;
    var b = bodyOf(shape), rx = s * b[0], ry = s * b[1], kind = b[2];
    var seed = hashStr(shape) | 1;
    var K = { g: g, px: px, cx: cx, cy: cy, s: s, rx: rx, ry: ry, kind: kind };
    K.rnd = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    K.path = function () {
      g.beginPath();
      if (kind === "dip") { g.arc(cx - rx * 0.95, cy, rx, 0, 6.2832); g.moveTo(cx + rx * 1.95, cy); g.arc(cx + rx * 0.95, cy, rx, 0, 6.2832); return; }
      if (kind === "sp") {
        for (var t = 0; t <= 1.0001; t += 0.04) { var x = cx + (t - 0.5) * rx * 2, y = cy + Math.sin(t * 9.42) * ry * 0.9 - ry * 0.45; t === 0 ? g.moveTo(x, y) : g.lineTo(x, y); }
        for (var t2 = 1; t2 >= -0.0001; t2 -= 0.04) { g.lineTo(cx + (t2 - 0.5) * rx * 2, cy + Math.sin(t2 * 9.42) * ry * 0.9 + ry * 0.45); }
        g.closePath(); return;
      }
      if (kind === "ph") { g.ellipse(cx, cy - s * 0.4, rx, ry, 0, 0, 6.2832); return; }
      g.ellipse(cx, cy, rx, ry, 0, 0, 6.2832);
    };
    K.bcy = kind === "ph" ? cy - s * 0.4 : cy;
    /* hair: cilia fringe or flagella; dens=multiplier, len=multiplier */
    K.hair = function (stroke, lw, dens, len, blur, straight) {
      g.save(); g.strokeStyle = stroke; g.lineCap = "round"; g.lineWidth = lw;
      if (blur) { g.shadowColor = stroke; g.shadowBlur = blur; }
      if (kind === "cil" || kind === "dip") {
        var n = Math.round(46 * dens * Math.max(rx, ry) / s); g.beginPath();
        for (var i = 0; i < n; i++) {
          var a = i / n * 6.2832, ex = cx + Math.cos(a) * rx, ey = cy + Math.sin(a) * ry, nx = Math.cos(a) * ry, ny = Math.sin(a) * rx;
          if (kind === "dip") { ex = cx + (Math.cos(a) > 0 ? rx * 0.95 : -rx * 0.95) + Math.cos(a) * rx; ey = cy + Math.sin(a) * rx; nx = Math.cos(a); ny = Math.sin(a); }
          var nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
          var L = s * (0.16 + K.rnd() * 0.09) * len, bend = straight ? 0 : (K.rnd() - 0.5) * 0.7;
          g.moveTo(ex, ey);
          g.quadraticCurveTo(ex + nx * L * 0.6 - ny * L * bend, ey + ny * L * 0.6 + nx * L * bend, ex + nx * L, ey + ny * L);
        }
        g.stroke();
      } else {
        var nf = kind === "fl" ? 3 : 1; g.lineWidth = lw * 1.4;
        for (var f = 0; f < nf; f++) {
          var sx = kind === "ph" ? cx : cx + rx * 0.98, sy = kind === "ph" ? cy - s * 0.4 + ry : cy + (f - (nf - 1) / 2) * ry * 0.5;
          g.beginPath(); g.moveTo(sx, sy);
          for (var k = 1; k <= 16; k++) {
            var tt = k / 16;
            if (kind === "ph") g.lineTo(sx + Math.sin(tt * 12) * s * 0.06, sy + tt * s * 0.9);
            else g.lineTo(sx + tt * s * 0.95 * len, sy + Math.sin(tt * 9 + f) * s * 0.14 * tt);
          }
          g.stroke();
        }
        if (kind === "ph") { for (var lg = -1; lg <= 1; lg += 2) { g.beginPath(); g.moveTo(cx, cy - s * 0.4 + ry + s * 0.9); g.lineTo(cx + lg * s * 0.4, cy + s * 0.75); g.stroke(); } }
        if (kind === "fl" || kind === "sp") { /* short side pili so rods read furry too */
          var np = kind === "sp" ? 0 : Math.round(18 * dens); g.lineWidth = lw * 0.7; g.beginPath();
          for (var p = 0; p < np; p++) { var pa = p / np * 6.2832, px0 = cx + Math.cos(pa) * rx, py0 = cy + Math.sin(pa) * ry;
            g.moveTo(px0, py0); g.lineTo(px0 + Math.cos(pa) * s * 0.1 * len, py0 + Math.sin(pa) * s * 0.1 * len); }
          g.stroke();
        }
      }
      g.restore();
    };
    K.dots = function (n, colFn, rMul) {
      g.save(); K.path(); g.clip();
      for (var d = 0; d < n; d++) {
        var da = K.rnd() * 6.2832, dr = Math.sqrt(K.rnd()) * 0.8;
        var dx = cx + Math.cos(da) * rx * dr * (kind === "dip" ? 2 : 1), dy = K.bcy + Math.sin(da) * ry * dr;
        g.fillStyle = colFn(K.rnd()); g.beginPath(); g.arc(dx, dy, px * (0.006 + K.rnd() * 0.012) * (rMul || 1), 0, 6.2832); g.fill();
      }
      g.restore();
    };
    K.nuc = function (fill, stroke, blur) {
      if (kind === "sp" || kind === "ph") return;
      g.save(); if (blur) { g.shadowColor = fill; g.shadowBlur = blur; }
      g.beginPath(); g.ellipse(cx + rx * 0.1, cy, Math.min(rx, ry) * 0.24, Math.min(rx, ry) * 0.2, 0, 0, 6.2832);
      if (fill) { g.fillStyle = fill; g.fill(); }
      if (stroke) { g.shadowBlur = 0; g.strokeStyle = stroke; g.lineWidth = Math.max(1, px * 0.01); g.stroke(); }
      g.restore();
    };
    K.hatch = function (ink, step, ang, alpha) {
      g.save(); K.path(); g.clip(); g.strokeStyle = ink; g.globalAlpha = alpha; g.lineWidth = Math.max(0.8, px * 0.007);
      g.translate(cx, cy); g.rotate(ang);
      for (var y = -px; y < px; y += step) { g.beginPath(); g.moveTo(-px, y); g.lineTo(px, y); g.stroke(); }
      g.restore();
    };
    return K;
  }
  var STYLES = {
    neon: function (K, col) {
      var g = K.g, px = K.px;
      g.save(); g.shadowColor = col; g.shadowBlur = px * 0.14;
      var gr = g.createRadialGradient(K.cx - K.rx * 0.2, K.cy - K.ry * 0.2, 0, K.cx, K.cy, Math.max(K.rx, K.ry) * 1.1);
      gr.addColorStop(0, rgba(col, 0.6)); gr.addColorStop(0.6, rgba(col, 0.32)); gr.addColorStop(1, rgba(col, 0.14));
      g.fillStyle = gr; K.path(); g.fill(); g.restore();
      K.hair(rgba(col, 0.95), Math.max(1, px * 0.01), 2.8, 1.0, px * 0.05);
      g.save(); g.lineJoin = "round"; g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = px * 0.1; g.lineWidth = Math.max(1.6, px * 0.026);
      K.path(); g.stroke(); g.shadowBlur = 0; g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = Math.max(0.8, px * 0.008); K.path(); g.stroke(); g.restore();
      K.dots(28, function (r) { return r < 0.35 ? "rgba(255,255,255,0.9)" : rgba(col, 0.95); });
      K.nuc("rgba(255,255,255,0.85)", null, px * 0.04);
    },
    phase: function (K) {
      var g = K.g, px = K.px;
      /* bright halo (phase-contrast artifact) */
      g.save(); g.shadowColor = "rgba(255,255,255,0.95)"; g.shadowBlur = px * 0.09; g.strokeStyle = "rgba(245,250,255,0.9)"; g.lineWidth = px * 0.035; K.path(); g.stroke(); g.restore();
      g.save(); var gr = g.createRadialGradient(K.cx, K.cy, 0, K.cx, K.cy, Math.max(K.rx, K.ry));
      gr.addColorStop(0, "rgba(150,160,160,0.16)"); gr.addColorStop(0.7, "rgba(110,120,122,0.26)"); gr.addColorStop(1, "rgba(40,46,48,0.55)");
      g.fillStyle = gr; K.path(); g.fill(); g.restore();
      K.hair("rgba(225,232,236,0.75)", Math.max(0.8, px * 0.008), 1.6, 1, px * 0.02);
      g.save(); g.strokeStyle = "rgba(30,34,38,0.9)"; g.lineWidth = Math.max(1, px * 0.012); K.path(); g.stroke(); g.restore();
      K.dots(30, function (r) { return r < 0.6 ? "rgba(40,46,48,0.55)" : "rgba(250,252,252,0.9)"; }, 1.2);
      K.nuc("rgba(40,44,48,0.75)", "rgba(240,245,248,0.9)", 0);
    },
    engr: function (K) {
      var g = K.g, px = K.px, ink = "#2b1a0e";
      g.save(); g.fillStyle = "rgba(242,232,208,0.9)"; K.path(); g.fill(); g.restore();
      K.hatch(ink, Math.max(2.2, px * 0.028), -0.7, 0.7);
      g.save(); K.path(); g.clip(); g.beginPath(); g.ellipse(K.cx + K.rx * 0.45, K.bcy + K.ry * 0.45, K.rx * 0.9, K.ry * 0.9, 0, 0, 6.2832); g.clip();
      K.hatch(ink, Math.max(2.2, px * 0.03), 0.7, 0.5); g.restore();
      K.hair(ink, Math.max(0.9, px * 0.009), 1.5, 1, 0, true);
      g.save(); g.strokeStyle = ink; g.lineWidth = Math.max(1.8, px * 0.03); g.lineJoin = "round"; K.path(); g.stroke(); g.restore();
      K.dots(30, function () { return "rgba(43,26,14,0.85)"; }, 0.7);
      K.nuc("rgba(238,224,196,0.9)", ink, 0);
    },
    cyber: function (K, col) {
      var g = K.g, px = K.px, alt = col === "#00f6ff" ? "#ff2bd6" : "#00f6ff";
      g.save(); g.fillStyle = rgba(col, 0.1); K.path(); g.fill(); g.restore();
      /* wireframe meridians */
      g.save(); K.path(); g.clip(); g.strokeStyle = rgba(col, 0.55); g.lineWidth = Math.max(0.8, px * 0.007);
      for (var m = 1; m <= 3; m++) { g.beginPath(); g.ellipse(K.cx, K.bcy, K.rx * m / 4, K.ry, 0, 0, 6.2832); g.stroke(); }
      for (var l = -2; l <= 2; l++) { g.beginPath(); g.moveTo(K.cx - K.rx * 1.2, K.bcy + l * K.ry * 0.38); g.lineTo(K.cx + K.rx * 1.2, K.bcy + l * K.ry * 0.38); g.stroke(); }
      g.restore();
      K.hair(rgba(col, 0.85), Math.max(0.8, px * 0.008), 1.2, 0.8, px * 0.02, true);
      g.save(); g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = px * 0.06; g.lineWidth = Math.max(1.4, px * 0.018); K.path(); g.stroke(); g.restore();
      /* scanner brackets + id tick */
      var bx = K.cx - K.rx * 1.25, by = K.bcy - K.ry * 1.35, bw = K.rx * 2.5, bh = K.ry * 2.7, t = Math.min(bw, bh) * 0.22;
      g.save(); g.strokeStyle = alt; g.lineWidth = Math.max(1, px * 0.012); g.shadowColor = alt; g.shadowBlur = px * 0.03;
      [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(function (c) {
        g.beginPath(); g.moveTo(c[0] + c[2] * t, c[1]); g.lineTo(c[0], c[1]); g.lineTo(c[0], c[1] + c[3] * t); g.stroke(); });
      g.fillStyle = alt; g.fillRect(bx, by - px * 0.035, bw * 0.4, px * 0.018);
      g.restore();
      K.dots(10, function () { return rgba(col, 0.9); }, 0.8);
      K.nuc(null, col, 0);
    },
    glass: function (K, col) {
      var g = K.g, px = K.px;
      g.save(); var gr = g.createLinearGradient(K.cx - K.rx, K.bcy - K.ry, K.cx + K.rx, K.bcy + K.ry);
      gr.addColorStop(0, "rgba(255,255,255,0.35)"); gr.addColorStop(0.5, rgba(col, 0.18)); gr.addColorStop(1, rgba(col, 0.38));
      g.fillStyle = gr; K.path(); g.fill(); g.restore();
      K.hair("rgba(255,255,255,0.55)", Math.max(0.8, px * 0.007), 1.4, 1, 0);
      g.save(); K.path(); g.clip();
      g.strokeStyle = rgba(col, 0.75); g.lineWidth = px * 0.05; K.path(); g.stroke();   /* thick inner rim = refraction */
      g.fillStyle = "rgba(255,255,255,0.8)"; g.shadowColor = "#fff"; g.shadowBlur = px * 0.04;
      g.beginPath(); g.ellipse(K.cx - K.rx * 0.38, K.bcy - K.ry * 0.45, K.rx * 0.32, K.ry * 0.16, -0.3, 0, 6.2832); g.fill();
      g.beginPath(); g.arc(K.cx + K.rx * 0.45, K.bcy + K.ry * 0.4, Math.max(1, px * 0.012), 0, 6.2832); g.fill();
      g.restore();
      g.save(); g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = Math.max(1, px * 0.012); K.path(); g.stroke(); g.restore();
      for (var b = 0; b < 5; b++) { var a = K.rnd() * 6.28, r = Math.sqrt(K.rnd()) * 0.55;
        g.save(); g.strokeStyle = "rgba(255,255,255,0.55)"; g.fillStyle = rgba(col, 0.25); g.lineWidth = Math.max(0.7, px * 0.006);
        g.beginPath(); g.arc(K.cx + Math.cos(a) * K.rx * r, K.bcy + Math.sin(a) * K.ry * r, px * (0.015 + K.rnd() * 0.02), 0, 6.2832); g.fill(); g.stroke(); g.restore(); }
      K.nuc(rgba(col, 0.35), "rgba(255,255,255,0.7)", 0);
    },
    haeckel: function (K, col) {
      var g = K.g, px = K.px;
      for (var p = 0; p < 4; p++) { g.save(); g.translate((K.rnd() - 0.5) * px * 0.025, (K.rnd() - 0.5) * px * 0.025);
        g.fillStyle = rgba(col, 0.2); K.path(); g.fill(); g.restore(); }
      g.save(); K.path(); g.clip(); g.strokeStyle = rgba(col, 0.45); g.lineWidth = px * 0.05; g.filter = "blur(" + (px * 0.012).toFixed(1) + "px)"; K.path(); g.stroke(); g.restore();
      K.hair("rgba(70,48,32,0.7)", Math.max(0.7, px * 0.006), 1.5, 1, 0);
      g.save(); g.strokeStyle = "rgba(60,40,28,0.9)"; g.lineWidth = Math.max(0.8, px * 0.009); K.path(); g.stroke(); g.restore();
      K.dots(18, function (r) { return r < 0.5 ? rgba(col, 0.85) : "rgba(70,48,32,0.6)"; });
      K.nuc(rgba(col, 0.55), "rgba(60,40,28,0.8)", 0);
    }
  };
  function bake(shape, color, px, st) {
    st = st || styleNow();
    var key = st + "|" + shape + "|" + color + "|" + px + "|v6";
    if (CACHE[key]) return CACHE[key];
    var c = document.createElement("canvas"); c.width = px; c.height = px;
    var K = kit(c.getContext("2d"), shape, px);
    (STYLES[st] || STYLES.neon)(K, color);
    CACHE[key] = c;
    var ks = Object.keys(CACHE); if (ks.length > 240) delete CACHE[ks[0]];
    return c;
  }
  function drawCell(c, o, sz) {
    var st = styleNow(), drawSz = drawSzOf(sz);
    var big = (typeof cv !== "undefined" && cv && cv.width > 900) ? 1.9 : 1;
    var k = drawSz * 2.2 * big;
    var px = k > 70 ? 160 : k > 40 ? 112 : 72;
    var spr = bake(shapeOf(o), colOf(o, st), px, st);
    c.save(); c.globalAlpha = 0.96; c.drawImage(spr, -k / 2, -k / 2, k, k); c.restore();
  }
  /* bestiary thumbs: same procedural body as in the pond */
  function thumb(sp, theme) {
    var st = STYLE_OF[theme] || "neon", shape = (sp && sp.shape) ? String(sp.shape) : shapeOf({ sp: sp });
    var col = colOf({ sp: sp }, st), key = st + "|" + shape + "|" + col;
    if (!THUMBS[key]) { try { THUMBS[key] = bake(shape, col, 160, st).toDataURL("image/png"); } catch (e) { return null; } }
    return THUMBS[key];
  }
  w.igsNeonDraw = { drawCell: drawCell, bake: bake, thumb: thumb, shapeOf: shapeOf, colOf: colOf, STYLE_OF: STYLE_OF };
})(typeof window !== "undefined" ? window : globalThis);
