/* theme_neon_draw.js — dedicated neon-bio organism draw (procedural outlines+bloom). ≤500L */
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
    var key = shape + "|" + color + "|" + px;
    if (CACHE[key]) return CACHE[key];
    var c = document.createElement("canvas");
    c.width = c.height = px;
    var g = c.getContext("2d");
    var cx = px / 2, cy = px / 2, s = px * 0.38;
    function glowStroke(drawFn, w0) {
      g.save();
      for (var i = 6; i >= 1; i--) {
        g.shadowColor = color; g.shadowBlur = 6 + i * 5;
        g.strokeStyle = color; g.globalAlpha = 0.18 + i * 0.08;
        g.lineWidth = (w0 || 2) + i * 0.6;
        g.beginPath(); drawFn(); g.stroke();
      }
      g.shadowColor = "#fff"; g.shadowBlur = 8; g.globalAlpha = 0.95;
      g.strokeStyle = "#fff"; g.lineWidth = Math.max(1.2, (w0 || 2) * 0.7);
      g.beginPath(); drawFn(); g.stroke();
      g.restore();
    }
    function bodyFill(drawFn) {
      g.save(); g.globalAlpha = 0.22; g.fillStyle = color;
      g.beginPath(); drawFn(); g.fill(); g.restore();
    }
    if (shape === "rod" || shape === "filament" || shape === "clubrod" || shape === "trichormus" || shape === "rodtococcus") {
      var rw = s * (shape === "filament" ? 0.22 : 0.35), rh = s * 1.15;
      var path = function () { g.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2); };
      bodyFill(path); glowStroke(path, 2.2);
    } else if (shape === "spiral" || shape === "trypanosoma" || shape === "comma" || shape === "apicomplexa") {
      var pathS = function () {
        var n = shape === "comma" ? 28 : 60, amp = shape === "comma" ? 0.55 : 1;
        for (var i = 0; i < n; i++) {
          var t = i / 9, rr = 3 + i * 1.05 * amp;
          var x = cx + Math.cos(t) * rr, y = cy + Math.sin(t) * rr * 0.85;
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
      };
      glowStroke(pathS, 2.4);
    } else if (shape === "colony" || shape === "star" || shape === "volvox") {
      var n = shape === "star" ? 5 : 7;
      for (var i = 0; i < n; i++) {
        var ang = (i / n) * Math.PI * 2;
        var x = cx + Math.cos(ang) * s * 0.55, y = cy + Math.sin(ang) * s * 0.55;
        (function (xx, yy) {
          var p = function () { g.arc(xx, yy, s * 0.22, 0, Math.PI * 2); };
          bodyFill(p); glowStroke(p, 1.6);
        })(x, y);
      }
      var pc = function () { g.arc(cx, cy, s * 0.28, 0, Math.PI * 2); };
      bodyFill(pc); glowStroke(pc, 2);
    } else if (shape === "slipper" || shape === "hypotrich" || shape === "oval" || shape === "bell" || shape === "rotifer" || shape === "testate" || shape === "testate2" || shape === "flatworm") {
      var rx = s * (shape === "slipper" || shape === "hypotrich" ? 1.05 : 0.85);
      var ry = s * (shape === "slipper" || shape === "hypotrich" ? 0.45 : 0.65);
      var po = function () { g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); };
      bodyFill(po); glowStroke(po, 2);
      if (shape === "slipper" || shape === "hypotrich" || shape === "rotifer") {
        g.save(); g.strokeStyle = color; g.globalAlpha = 0.75; g.lineWidth = 1.4;
        for (var a = -0.7; a <= 0.7; a += 0.18) {
          g.beginPath();
          g.moveTo(cx + rx * 0.85, cy + Math.sin(a) * ry);
          g.lineTo(cx + rx * 1.35, cy + Math.sin(a) * ry * 1.35);
          g.stroke();
        }
        g.restore();
      }
    } else if (shape === "phage") {
      var ph = function () { g.ellipse(cx, cy - s * 0.35, s * 0.45, s * 0.35, 0, 0, Math.PI * 2); };
      bodyFill(ph); glowStroke(ph, 2);
      g.save(); g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = 10; g.lineWidth = 2.2;
      g.beginPath(); g.moveTo(cx, cy - s * 0.05); g.lineTo(cx, cy + s * 0.7); g.stroke();
      g.restore();
    } else if (shape === "diplococci") {
      var p1 = function () { g.arc(cx - s * 0.4, cy, s * 0.42, 0, Math.PI * 2); };
      var p2 = function () { g.arc(cx + s * 0.4, cy, s * 0.42, 0, Math.PI * 2); };
      bodyFill(p1); glowStroke(p1, 2); bodyFill(p2); glowStroke(p2, 2);
    } else {
      var pc0 = function () { g.arc(cx, cy, s * 0.72, 0, Math.PI * 2); };
      bodyFill(pc0); glowStroke(pc0, 2.4);
      g.save(); g.strokeStyle = color; g.globalAlpha = 0.7; g.lineWidth = 1.3;
      for (var a2 = 0; a2 < Math.PI * 2; a2 += Math.PI / 10) {
        g.beginPath();
        g.moveTo(cx + Math.cos(a2) * s * 0.75, cy + Math.sin(a2) * s * 0.75);
        g.lineTo(cx + Math.cos(a2) * s * 1.05, cy + Math.sin(a2) * s * 1.05);
        g.stroke();
      }
      g.fillStyle = "#fff"; g.globalAlpha = 0.85;
      g.beginPath(); g.arc(cx - s * 0.18, cy - s * 0.1, s * 0.1, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(cx + s * 0.2, cy + s * 0.12, s * 0.08, 0, Math.PI * 2); g.fill();
      g.restore();
    }
    CACHE[key] = c;
    if (Object.keys(CACHE).length > 64) {
      var k0 = Object.keys(CACHE)[0]; delete CACHE[k0];
    }
    return c;
  }
  function drawNeonCell(c, o, sz) {
    var shape = shapeOf(o);
    var color = colOf(o);
    var px = Math.max(48, Math.min(192, Math.round((sz || 4) * 22)));
    var spr = bake(shape, color, px);
    var s = (sz || 4) * 2.2;
    c.save();
    c.globalCompositeOperation = "lighter";
    c.drawImage(spr, -s, -s, s * 2, s * 2);
    c.restore();
  }
  var SPRITE_BASE = "assets/themes/neon-bio/sprites/";
  function wikiThumbSrc(shape) {
    return SPRITE_BASE + (shape || "circle") + ".png";
  }
  w.igsNeonDraw = { drawCell: drawNeonCell, bake: bake, wikiThumbSrc: wikiThumbSrc, shapeOf: shapeOf, colOf: colOf };
})(typeof window !== "undefined" ? window : globalThis);
