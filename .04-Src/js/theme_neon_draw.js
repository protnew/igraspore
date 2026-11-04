/* theme_neon_draw.js — neon-bio organisms: contour glow only (no soft circular halo plates). ≤500L */
(function (w) {
  "use strict";
  var CACHE = {};
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
  function bake(shape, color, px) {
    var key = shape + "|" + color + "|" + px + "|v2";
    if (CACHE[key]) return CACHE[key];
    var c = document.createElement("canvas");
    c.width = c.height = px;
    var g = c.getContext("2d");
    var cx = px / 2, cy = px / 2, s = px * 0.36;
    function strokeContour(drawFn, w0) {
      g.save();
      // outer soft contour (tight)
      g.shadowColor = color; g.shadowBlur = 8; g.globalAlpha = 0.55;
      g.strokeStyle = color; g.lineWidth = (w0 || 2) + 1.2;
      g.beginPath(); drawFn(); g.stroke();
      // bright rim
      g.shadowBlur = 4; g.globalAlpha = 0.95;
      g.strokeStyle = color; g.lineWidth = w0 || 2;
      g.beginPath(); drawFn(); g.stroke();
      // white core line
      g.shadowColor = "#fff"; g.shadowBlur = 3; g.globalAlpha = 0.9;
      g.strokeStyle = "#fff"; g.lineWidth = Math.max(1, (w0 || 2) * 0.55);
      g.beginPath(); drawFn(); g.stroke();
      g.restore();
    }
    function faintFill(drawFn) {
      g.save(); g.globalAlpha = 0.08; g.fillStyle = color;
      g.beginPath(); drawFn(); g.fill(); g.restore();
    }
    if (shape === "rod" || shape === "filament" || shape === "clubrod" || shape === "trichormus" || shape === "rodtococcus") {
      var rw = s * (shape === "filament" ? 0.2 : 0.32), rh = s * 1.15;
      var path = function () { g.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2); };
      faintFill(path); strokeContour(path, 2.1);
    } else if (shape === "spiral" || shape === "trypanosoma" || shape === "comma" || shape === "apicomplexa") {
      var pathS = function () {
        var n = shape === "comma" ? 28 : 60, amp = shape === "comma" ? 0.55 : 1;
        for (var i = 0; i < n; i++) {
          var t = i / 9, rr = 3 + i * 1.05 * amp;
          var x = cx + Math.cos(t) * rr, y = cy + Math.sin(t) * rr * 0.85;
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
      };
      strokeContour(pathS, 2.3);
    } else if (shape === "colony" || shape === "star" || shape === "volvox") {
      var n = shape === "star" ? 5 : 7;
      for (var i = 0; i < n; i++) {
        var ang = (i / n) * Math.PI * 2;
        var x = cx + Math.cos(ang) * s * 0.55, y = cy + Math.sin(ang) * s * 0.55;
        (function (xx, yy) {
          var p = function () { g.arc(xx, yy, s * 0.2, 0, Math.PI * 2); };
          faintFill(p); strokeContour(p, 1.5);
        })(x, y);
      }
      var pc = function () { g.arc(cx, cy, s * 0.26, 0, Math.PI * 2); };
      faintFill(pc); strokeContour(pc, 1.9);
    } else if (shape === "slipper" || shape === "hypotrich" || shape === "oval" || shape === "bell" || shape === "rotifer" || shape === "testate" || shape === "testate2" || shape === "flatworm") {
      var rx = s * (shape === "slipper" || shape === "hypotrich" ? 1.05 : 0.85);
      var ry = s * (shape === "slipper" || shape === "hypotrich" ? 0.45 : 0.65);
      var po = function () { g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); };
      faintFill(po); strokeContour(po, 2);
      if (shape === "slipper" || shape === "hypotrich" || shape === "rotifer") {
        g.save(); g.strokeStyle = color; g.globalAlpha = 0.8; g.lineWidth = 1.2; g.shadowColor = color; g.shadowBlur = 4;
        for (var a = -0.7; a <= 0.7; a += 0.2) {
          g.beginPath();
          g.moveTo(cx + rx * 0.85, cy + Math.sin(a) * ry);
          g.lineTo(cx + rx * 1.3, cy + Math.sin(a) * ry * 1.3);
          g.stroke();
        }
        g.restore();
      }
    } else if (shape === "phage") {
      var ph = function () { g.ellipse(cx, cy - s * 0.35, s * 0.45, s * 0.35, 0, 0, Math.PI * 2); };
      faintFill(ph); strokeContour(ph, 2);
      g.save(); g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = 6; g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx, cy - s * 0.05); g.lineTo(cx, cy + s * 0.7); g.stroke();
      g.restore();
    } else if (shape === "diplococci") {
      var p1 = function () { g.arc(cx - s * 0.4, cy, s * 0.4, 0, Math.PI * 2); };
      var p2 = function () { g.arc(cx + s * 0.4, cy, s * 0.4, 0, Math.PI * 2); };
      faintFill(p1); strokeContour(p1, 1.9); faintFill(p2); strokeContour(p2, 1.9);
    } else {
      var pc0 = function () { g.arc(cx, cy, s * 0.7, 0, Math.PI * 2); };
      faintFill(pc0); strokeContour(pc0, 2.2);
      g.save(); g.strokeStyle = color; g.globalAlpha = 0.75; g.lineWidth = 1.2; g.shadowColor = color; g.shadowBlur = 3;
      for (var a2 = 0; a2 < Math.PI * 2; a2 += Math.PI / 10) {
        g.beginPath();
        g.moveTo(cx + Math.cos(a2) * s * 0.72, cy + Math.sin(a2) * s * 0.72);
        g.lineTo(cx + Math.cos(a2) * s * 1.02, cy + Math.sin(a2) * s * 1.02);
        g.stroke();
      }
      g.fillStyle = "#fff"; g.globalAlpha = 0.9; g.shadowBlur = 0;
      g.beginPath(); g.arc(cx - s * 0.18, cy - s * 0.1, s * 0.08, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(cx + s * 0.2, cy + s * 0.12, s * 0.07, 0, Math.PI * 2); g.fill();
      g.restore();
    }
    CACHE[key] = c;
    if (Object.keys(CACHE).length > 64) { var k0 = Object.keys(CACHE)[0]; delete CACHE[k0]; }
    return c;
  }
  function drawNeonCell(c, o, sz) {
    var shape = shapeOf(o);
    var color = colOf(o);
    var px = Math.max(48, Math.min(192, Math.round((sz || 4) * 22)));
    var spr = bake(shape, color, px);
    var s = (sz || 4) * 2.0;
    c.save();
    c.globalCompositeOperation = "source-over";
    c.globalAlpha = 1;
    c.drawImage(spr, -s, -s, s * 2, s * 2);
    c.restore();
  }
  var SPRITE_BASE = "assets/themes/neon-bio/sprites/";
  function wikiThumbSrc(shape) { return SPRITE_BASE + (shape || "circle") + ".png"; }
  w.igsNeonDraw = { drawCell: drawNeonCell, bake: bake, wikiThumbSrc: wikiThumbSrc, shapeOf: shapeOf, colOf: colOf };
})(typeof window !== "undefined" ? window : globalThis);
