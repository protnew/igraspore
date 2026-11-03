/* theme_visuals.js — per-theme pond sky/sun/pads/postFX + bestiary sprite thumbs */
(function (w) {
  "use strict";
  function tid() { return w.__igsThemePondId || "classic"; }
  function bid() { return w.__igsThemeBestiary || "classic"; }

  function wrapSky() {
    if (typeof renderSky !== "function" || renderSky.__igsThemeWrap) return;
    var orig = renderSky;
    function themedSky(vL, vR, vT) {
      var id = tid();
      if (id === "classic") return orig.apply(this, arguments);
      var h = -vT;
      if (vT >= 5) { if (id === "neon-bio" || id === "cyberpunk-scanner" || id === "phase-contrast" || id === "engraving") w._sunPos = null; return; }
      if (h < 1) return;
      if (id === "neon-bio" || id === "cyberpunk-scanner") {
        w._sunPos = null;
        ctx.fillStyle = id === "neon-bio" ? "#000004" : "#050008";
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
        ctx.save();
        for (var si = 0; si < 48; si++) {
          var sx = vL + ((si * 97) % Math.max(1, vR - vL));
          var sy = vT + 8 + ((si * 53) % Math.max(1, h * 0.7));
          ctx.globalAlpha = 0.3 + (si % 5) * 0.1;
          ctx.fillStyle = id === "neon-bio" ? "#7ff" : "#f0f";
          ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        return;
      }
      if (id === "phase-contrast") {
        w._sunPos = null;
        var g = ctx.createLinearGradient(0, vT, 0, 0);
        g.addColorStop(0, "#0c0e10"); g.addColorStop(0.55, "#4a5050"); g.addColorStop(1, "#a8b0b0");
        ctx.fillStyle = g;
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
        return;
      }
      if (id === "engraving") {
        w._sunPos = null;
        var ge = ctx.createLinearGradient(0, vT, 0, 0);
        ge.addColorStop(0, "#3a3020"); ge.addColorStop(0.45, "#a09070"); ge.addColorStop(1, "#e8dcc0");
        ctx.fillStyle = ge;
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
        var cx = (vL + vR) / 2, cy = vT + h * 0.35, rr = Math.min(28, h * 0.22);
        ctx.save();
        ctx.fillStyle = "rgba(40,30,18,0.55)";
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(30,22,12,0.35)"; ctx.lineWidth = 1;
        for (var ray = 0; ray < 16; ray++) {
          var a = (ray / 16) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * rr * 1.1, cy + Math.sin(a) * rr * 1.1);
          ctx.lineTo(cx + Math.cos(a) * rr * 2.2, cy + Math.sin(a) * rr * 2.2);
          ctx.stroke();
        }
        ctx.restore();
        return;
      }
      if (id === "haeckel-watercolor") {
        w._sunPos = { x: cam.x, y: cam.y - 80, r: 14, elev: 0.8, warm: 1, dl: 0.7, scrX: cv.width * 0.5, scrY: 40 };
        var gh = ctx.createLinearGradient(0, vT, 0, 0);
        gh.addColorStop(0, "#6a8a9a"); gh.addColorStop(0.5, "#b8c8a8"); gh.addColorStop(1, "#e8d8b0");
        ctx.fillStyle = gh;
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
        return;
      }
      if (id === "glass-lab") {
        var gg = ctx.createLinearGradient(0, vT, 0, 0);
        gg.addColorStop(0, "#4a6a88"); gg.addColorStop(0.5, "#8ab0c8"); gg.addColorStop(1, "#d8eef8");
        ctx.fillStyle = gg;
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
        w._sunPos = { x: cam.x, y: cam.y - 90, r: 16, elev: 0.9, warm: 0, dl: 0.85, scrX: cv.width * 0.5, scrY: 36 };
        return;
      }
      return orig.apply(this, arguments);
    }
    themedSky.__igsThemeWrap = true;
    renderSky = themedSky;
  }

  function wrapSun() {
    if (typeof renderSunOverlay !== "function" || renderSunOverlay.__igsThemeWrap) return;
    var orig = renderSunOverlay;
    function themedSun() {
      var id = tid();
      if (id === "neon-bio" || id === "cyberpunk-scanner" || id === "phase-contrast" || id === "engraving") return;
      if (id === "glass-lab" && w._sunPos) {
        var s = w._sunPos;
        ctx.save();
        ctx.globalAlpha = 0.85;
        var grd = ctx.createRadialGradient(s.scrX, s.scrY, 0, s.scrX, s.scrY, s.r * 4);
        grd.addColorStop(0, "rgba(255,255,255,0.95)");
        grd.addColorStop(0.4, "rgba(200,230,255,0.35)");
        grd.addColorStop(1, "rgba(180,210,240,0)");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(s.scrX, s.scrY, s.r * 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        return;
      }
      return orig.apply(this, arguments);
    }
    themedSun.__igsThemeWrap = true;
    renderSunOverlay = themedSun;
  }

  function wrapPads() {
    if (typeof drawNaturalLilypads !== "function" || drawNaturalLilypads.__igsThemeWrap) return;
    var orig = drawNaturalLilypads;
    function themedPads(vL, vR, surfW) {
      var id = tid();
      if (id === "neon-bio" || id === "cyberpunk-scanner" || id === "phase-contrast") return;
      if (id === "engraving") {
        ctx.save();
        try { ctx.filter = "grayscale(1) contrast(1.4) sepia(0.7) brightness(0.85)"; } catch (eP) {}
        orig(vL, vR, surfW);
        ctx.restore();
        return;
      }
      return orig.apply(this, arguments);
    }
    themedPads.__igsThemeWrap = true;
    drawNaturalLilypads = themedPads;
  }

  function wrapSwiss() {
    if (typeof w.drawSwissCell !== "function" || w.drawSwissCell.__igsThemeWrap) return;
    var orig = w.drawSwissCell;
    w.drawSwissCell = function (c, o, sz, sh) {
      var id = tid();
      var ssz = sz || 4;
      if (id === "neon-bio") {
        c.save();
        var col = (o && o.sp && o.sp.color) || "#0ff";
        c.shadowColor = col;
        c.shadowBlur = Math.max(28, ssz * 7);
        c.globalAlpha = 0.95;
        orig(c, o, ssz, sh);
        try {
          c.globalCompositeOperation = "lighter";
          c.shadowColor = "#fff";
          c.shadowBlur = Math.max(14, ssz * 3);
          c.globalAlpha = 0.65;
          orig(c, o, ssz * 1.05, sh);
          c.shadowColor = col;
          c.shadowBlur = Math.max(36, ssz * 8);
          c.globalAlpha = 0.4;
          orig(c, o, ssz, sh);
        } catch (eN) {}
        c.restore();
        return;
      }
      if (id === "phase-contrast") {
        c.save();
        try { c.filter = "grayscale(1) contrast(1.85) brightness(1.35)"; } catch (e) {}
        c.shadowColor = "rgba(255,255,255,0.95)";
        c.shadowBlur = Math.max(16, ssz * 4.5);
        orig(c, o, Math.max(ssz * 1.35, ssz + 2), sh);
        c.restore();
        c.save();
        try { c.filter = "grayscale(1) contrast(2.1) brightness(1.05)"; } catch (e3) {}
        c.shadowColor = "rgba(220,255,255,0.7)";
        c.shadowBlur = Math.max(8, ssz * 2);
        orig(c, o, Math.max(ssz * 1.25, ssz + 1.5), sh);
        c.restore();
        return;
      }
      if (id === "engraving") {
        c.save();
        try { c.filter = "grayscale(1) contrast(1.55) sepia(0.7) brightness(0.78)"; } catch (e) {}
        c.shadowColor = "rgba(20,12,4,0.55)";
        c.shadowBlur = 1.5;
        orig(c, o, ssz, sh);
        c.restore();
        try {
          c.save();
          c.globalCompositeOperation = "multiply";
          c.globalAlpha = 0.55;
          try { c.filter = "grayscale(1) contrast(2.2) brightness(0.35)"; } catch (e4) {}
          orig(c, o, ssz * 1.08, sh);
          c.restore();
        } catch (eInk) {}
        return;
      }
      if (id === "cyberpunk-scanner") {
        c.save();
        c.shadowColor = "#0f8";
        c.shadowBlur = 12;
        try { c.filter = "saturate(1.7) contrast(1.3) hue-rotate(40deg)"; } catch (e) {}
        orig(c, o, ssz, sh);
        c.restore();
        return;
      }
      if (id === "haeckel-watercolor") {
        c.save();
        try { c.filter = "sepia(0.3) saturate(0.95) contrast(1.05)"; } catch (e) {}
        orig(c, o, ssz, sh);
        c.restore();
        return;
      }
      if (id === "glass-lab") {
        c.save();
        try { c.filter = "saturate(0.7) brightness(1.12) contrast(1.08)"; } catch (e) {}
        c.shadowColor = "rgba(180,220,255,0.5)";
        c.shadowBlur = 8;
        orig(c, o, ssz, sh);
        c.restore();
        return;
      }
      return orig(c, o, ssz, sh);
    };
    w.drawSwissCell.__igsThemeWrap = true;
  }

  function postFX() {
    var id = tid();
    if (!id || id === "classic" || typeof ctx === "undefined" || !cv) return;
    var W = cv.width, H = cv.height;
    ctx.save();
    if (id === "neon-bio") {
      ctx.globalCompositeOperation = "source-over";
      var sky = ctx.createLinearGradient(0, 0, 0, H * 0.42);
      sky.addColorStop(0, "rgba(0,0,0,0.98)");
      sky.addColorStop(0.55, "rgba(0,0,10,0.72)");
      sky.addColorStop(1, "rgba(0,18,36,0)");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.48);
      var cx = W * 0.5, topY = H * 0.18, bot = H * 0.95;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      var ray = ctx.createLinearGradient(cx, topY, cx, bot);
      ray.addColorStop(0, "rgba(0,255,255,0.42)");
      ray.addColorStop(0.35, "rgba(0,200,255,0.18)");
      ray.addColorStop(1, "rgba(0,80,160,0)");
      ctx.fillStyle = ray;
      ctx.beginPath();
      ctx.moveTo(cx - 18, topY);
      ctx.lineTo(cx + 18, topY);
      ctx.lineTo(cx + W * 0.28, bot);
      ctx.lineTo(cx - W * 0.28, bot);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(cx - 40, topY + 8);
      ctx.lineTo(cx - 10, topY + 8);
      ctx.lineTo(cx - W * 0.08, bot);
      ctx.lineTo(cx - W * 0.32, bot);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 10, topY + 8);
      ctx.lineTo(cx + 40, topY + 8);
      ctx.lineTo(cx + W * 0.32, bot);
      ctx.lineTo(cx + W * 0.08, bot);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(0,200,220,0.08)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      var vig = ctx.createRadialGradient(W / 2, H * 0.55, H * 0.1, W / 2, H * 0.55, H * 0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.72)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
    } else if (id === "phase-contrast") {
      ctx.globalCompositeOperation = "saturation";
      ctx.fillStyle = "rgba(128,128,128,0.92)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(200,220,220,0.05)";
      ctx.fillRect(0, 0, W, H);
      var R = Math.min(W, H) * 0.48;
      var v2 = ctx.createRadialGradient(W / 2, H / 2, R * 0.55, W / 2, H / 2, R * 1.05);
      v2.addColorStop(0, "rgba(0,0,0,0)");
      v2.addColorStop(0.7, "rgba(0,0,0,0.25)");
      v2.addColorStop(1, "rgba(0,0,0,0.78)");
      ctx.fillStyle = v2; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      for (var di = 0; di < 30; di++) {
        var dx = ((di * 97) % W), dy = ((di * 53) % H);
        ctx.fillRect(dx, dy, 1.5, 1.5);
      }
    } else if (id === "engraving") {
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = "rgba(190,170,130,1)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle = "rgba(210,185,140,0.55)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(210,195,160,0.35)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(35,25,15,0.14)";
      ctx.lineWidth = 1;
      for (var y = 0; y < H; y += 2) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(35,25,15,0.10)";
      for (var x = -H; x < W; x += 4) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H, H); ctx.stroke();
      }
      for (var x2 = 0; x2 < W + H; x2 += 5) {
        ctx.beginPath(); ctx.moveTo(x2, 0); ctx.lineTo(x2 - H, H); ctx.stroke();
      }
      var ve = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75);
      ve.addColorStop(0, "rgba(0,0,0,0)");
      ve.addColorStop(1, "rgba(40,28,12,0.35)");
      ctx.fillStyle = ve; ctx.fillRect(0, 0, W, H);
    } else if (id === "cyberpunk-scanner") {
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(0,255,100,0.05)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      for (var sl = 0; sl < H; sl += 3) ctx.fillRect(0, sl, W, 1);
      ctx.strokeStyle = "rgba(0,255,140,0.14)";
      ctx.lineWidth = 1;
      var step = 40;
      for (var gx = 0; gx < W; gx += step) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (var gy = 0; gy < H; gy += step) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
      var top = ctx.createLinearGradient(0, 0, 0, H * 0.35);
      top.addColorStop(0, "rgba(5,0,20,0.9)");
      top.addColorStop(1, "rgba(5,0,20,0)");
      ctx.fillStyle = top; ctx.fillRect(0, 0, W, H * 0.4);
    } else if (id === "haeckel-watercolor") {
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle = "rgba(232,210,160,0.28)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    } else if (id === "glass-lab") {
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(180,220,240,0.10)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();
  }
  w.igsThemePondPostFX = postFX;

  var SPRITE_BASE = "assets/bioicons/swiss_sprites/";
  function shapeForSp(sp) {
    try {
      if (typeof w.pickShape === "function") return w.pickShape({ sp: sp }, "circle");
    } catch (e) {}
    return "circle";
  }
  function thumbFilter(theme) {
    var m = {
      "neon-bio": "drop-shadow(0 0 14px #0ff) drop-shadow(0 0 10px #f0f) drop-shadow(0 0 6px #0f8) saturate(2.6) brightness(1.4) contrast(1.15)",
      "phase-contrast": "grayscale(1) contrast(1.85) brightness(1.35) drop-shadow(0 0 8px #fff)",
      "haeckel-watercolor": "sepia(0.55) saturate(1.45) contrast(1.2) brightness(1.08)",
      "engraving": "grayscale(1) contrast(2.0) sepia(0.65) brightness(0.72)",
      "cyberpunk-scanner": "saturate(1.8) contrast(1.35) hue-rotate(50deg) drop-shadow(0 0 6px #0f8)",
      "glass-lab": "saturate(0.65) brightness(1.12) contrast(1.05)",
      classic: "none"
    };
    return m[theme] || "none";
  }
  function enhanceWiki() {
    var wiki = document.getElementById("wikiO");
    if (!wiki || !wiki.classList.contains("show")) return;
    var theme = wiki.getAttribute("data-theme-bestiary") || bid();
    wiki.classList.add("wiki-grid-mode");
    var content = document.getElementById("wikiContent");
    if (content) content.classList.add("wiki-grid-cards");
    var entries = wiki.querySelectorAll(".wiki-entry");
    for (var i = 0; i < entries.length; i++) {
      var el = entries[i];
      if (el.querySelector(".wiki-thumb")) continue;
      var b = el.querySelector("b");
      if (!b) continue;
      var name = (b.textContent || "").trim();
      if (!name) continue;
      var sp = { name: name, id: name };
      try {
        if (typeof SPECIES_DB !== "undefined") {
          for (var si = 0; si < SPECIES_DB.length; si++) {
            if (SPECIES_DB[si] && SPECIES_DB[si].name === name) { sp = SPECIES_DB[si]; break; }
          }
        }
      } catch (e) {}
      var shape = (sp && sp.shape) ? String(sp.shape) : shapeForSp(sp);
      if (!shape) shape = "circle";
      var wrap = document.createElement("div");
      wrap.className = "wiki-thumb-wrap";
      var img = document.createElement("img");
      img.className = "wiki-thumb";
      img.alt = name;
      img.loading = "lazy";
      img.src = SPRITE_BASE + shape + ".png?v=2";
      img.onerror = function () { if (this.dataset.fb) return; this.dataset.fb = "1"; this.src = SPRITE_BASE + "circle.png?v=2"; };
      img.style.filter = thumbFilter(theme);
      wrap.appendChild(img);
      el.insertBefore(wrap, el.firstChild);
      el.classList.add("wiki-entry-has-thumb");
    }
  }
  w.igsThemeWikiEnhance = enhanceWiki;

  function wrapBuildWiki() {
    if (typeof buildWiki !== "function" || buildWiki.__igsThemeWrap) return;
    var orig = buildWiki;
    buildWiki = function (filter) {
      orig(filter);
      try { enhanceWiki(); } catch (e) {}
    };
    buildWiki.__igsThemeWrap = true;
  }

  function install() {
    wrapSky(); wrapSun(); wrapPads(); wrapSwiss(); wrapBuildWiki();
    var id = tid();
    var dark = {"neon-bio":0.08,"cyberpunk-scanner":0.22,"phase-contrast":0.48,"engraving":0.55,"haeckel-watercolor":0.75,"glass-lab":0.9};
    if (dark[id] != null) w.__igsThemeDayLight = dark[id];
    else if (id === "classic") w.__igsThemeDayLight = null;
  }
  w.igsThemeVisuals = { install: install, postFX: postFX, enhanceWiki: enhanceWiki };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
  setTimeout(install, 500);
  setTimeout(install, 2000);
})(typeof window !== "undefined" ? window : globalThis);
