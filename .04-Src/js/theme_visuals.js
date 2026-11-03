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
        ctx.fillStyle = id === "neon-bio" ? "#000006" : "#050008";
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
        ctx.save();
        for (var si = 0; si < 40; si++) {
          var sx = vL + ((si * 97) % Math.max(1, vR - vL));
          var sy = vT + 8 + ((si * 53) % Math.max(1, h * 0.7));
          ctx.globalAlpha = 0.25 + (si % 5) * 0.08;
          ctx.fillStyle = id === "neon-bio" ? "#6ff" : "#f0f";
          ctx.beginPath(); ctx.arc(sx, sy, 0.7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        return;
      }
      if (id === "phase-contrast") {
        w._sunPos = null;
        var g = ctx.createLinearGradient(0, vT, 0, 0);
        g.addColorStop(0, "#0e1212"); g.addColorStop(0.55, "#3a4545"); g.addColorStop(1, "#7a8888");
        ctx.fillStyle = g;
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
        return;
      }
      if (id === "engraving") {
        w._sunPos = null;
        var ge = ctx.createLinearGradient(0, vT, 0, 0);
        ge.addColorStop(0, "#2a2218"); ge.addColorStop(0.5, "#8a7a60"); ge.addColorStop(1, "#d8c8a8");
        ctx.fillStyle = ge;
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
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
      if (id === "neon-bio") {
        c.save();
        var col = (o && o.sp && o.sp.color) || "#0ff";
        c.shadowColor = col;
        c.shadowBlur = Math.max(28, (sz || 4) * 6.5);
        orig(c, o, sz, sh);
        try {
          c.globalCompositeOperation = "screen";
          c.shadowColor = "#ff00aa";
          c.shadowBlur = Math.max(20, (sz || 4) * 5);
          c.globalAlpha = 0.45;
          orig(c, o, sz, sh);
          c.shadowColor = "#00ffaa";
          c.globalAlpha = 0.35;
          orig(c, o, sz, sh);
        } catch (eN) {}
        c.restore();
        return;
      }
      if (id === "phase-contrast") {
        c.save();
        try { c.filter = "grayscale(1) contrast(1.7) brightness(1.2)"; } catch (e) {}
        orig(c, o, sz, sh);
        c.restore();
        try {
          var x = o.x, y = o.y, r = Math.max(7, (sz || 4) * 1.55);
          c.save();
          c.strokeStyle = "rgba(255,255,255,0.75)";
          c.lineWidth = 2.2;
          c.shadowColor = "rgba(220,255,255,0.85)";
          c.shadowBlur = 10;
          c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
          c.strokeStyle = "rgba(180,220,220,0.35)";
          c.lineWidth = 4;
          c.beginPath(); c.arc(x, y, r + 3, 0, Math.PI * 2); c.stroke();
          c.restore();
        } catch (e2) {}
        return;
      }
      if (id === "engraving") {
        c.save();
        try { c.filter = "grayscale(1) contrast(1.45) sepia(0.7) brightness(0.95)"; } catch (e) {}
        orig(c, o, sz, sh);
        c.restore();
        try {
          var xe = o.x, ye = o.y, re = Math.max(6, (sz || 4) * 1.35);
          c.save();
          c.strokeStyle = "rgba(40,28,16,0.75)";
          c.lineWidth = 1.4;
          c.beginPath(); c.arc(xe, ye, re, 0, Math.PI * 2); c.stroke();
          c.restore();
        } catch (eE) {}
        return;
      }
      if (id === "cyberpunk-scanner") {
        c.save();
        c.shadowColor = "#0f8";
        c.shadowBlur = 14;
        try { c.filter = "saturate(1.8) contrast(1.3) hue-rotate(40deg)"; } catch (e) {}
        orig(c, o, sz, sh);
        c.restore();
        return;
      }
      if (id === "haeckel-watercolor") {
        c.save();
        try { c.filter = "sepia(0.3) saturate(1.05) contrast(0.98) brightness(1.05)"; } catch (e) {}
        orig(c, o, sz, sh);
        c.restore();
        return;
      }
      if (id === "glass-lab") {
        c.save();
        try { c.filter = "saturate(0.7) brightness(1.1) contrast(1.05)"; } catch (e) {}
        orig(c, o, sz, sh);
        c.restore();
        return;
      }
      return orig(c, o, sz, sh);
    };
    w.drawSwissCell.__igsThemeWrap = true;
  }

  function drawGodRays(W, H, color, strength) {
    var cx = W * 0.5, cy = H * 0.02;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (var i = -7; i <= 7; i++) {
      var ang = (i / 7) * 0.55;
      var len = H * 0.85;
      var grd = ctx.createLinearGradient(cx, cy, cx + Math.sin(ang) * len * 0.35, cy + len);
      grd.addColorStop(0, color.replace("ALP", String(0.55 * strength)));
      grd.addColorStop(0.45, color.replace("ALP", String(0.18 * strength)));
      grd.addColorStop(1, color.replace("ALP", "0"));
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + Math.sin(ang) * len * 0.35 - 28, cy + len);
      ctx.lineTo(cx + Math.sin(ang) * len * 0.35 + 28, cy + len);
      ctx.lineTo(cx + 8, cy);
      ctx.closePath();
      ctx.fill();
    }
    var core = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * 0.35);
    core.addColorStop(0, color.replace("ALP", String(0.7 * strength)));
    core.addColorStop(1, color.replace("ALP", "0"));
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, W, H * 0.55);
    ctx.restore();
  }

  function postFX() {
    var id = tid();
    if (!id || id === "classic" || typeof ctx === "undefined" || !cv) return;
    var W = cv.width, H = cv.height;
    ctx.save();
    if (id === "neon-bio") {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.88)";
      ctx.fillRect(0, 0, W, Math.max(1, H * 0.32));
      var g = ctx.createLinearGradient(0, 0, 0, H * 0.5);
      g.addColorStop(0, "rgba(0,0,0,0.95)");
      g.addColorStop(0.35, "rgba(0,0,18,0.55)");
      g.addColorStop(1, "rgba(0,30,50,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * 0.5);
      drawGodRays(W, H, "rgba(0,220,255,ALP)", 1.15);
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(0,200,220,0.12)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      var vig = ctx.createRadialGradient(W / 2, H * 0.55, H * 0.1, W / 2, H * 0.55, H * 0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
    } else if (id === "phase-contrast") {
      ctx.globalCompositeOperation = "saturation";
      ctx.fillStyle = "rgba(128,128,128,0.92)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(180,210,210,0.07)";
      ctx.fillRect(0, 0, W, H);
      var v2 = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.22, W / 2, H / 2, Math.min(W, H) * 0.68);
      v2.addColorStop(0, "rgba(0,0,0,0)");
      v2.addColorStop(0.7, "rgba(0,0,0,0.25)");
      v2.addColorStop(1, "rgba(0,0,0,0.72)");
      ctx.fillStyle = v2; ctx.fillRect(0, 0, W, H);
    } else if (id === "engraving") {
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle = "rgba(190,160,110,0.42)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(40,30,20,0.12)";
      ctx.lineWidth = 1;
      for (var y = 0; y < H; y += 2) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(40,30,20,0.06)";
      for (var x = 0; x < W; x += 5) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H * 0.15, H); ctx.stroke(); }
    } else if (id === "cyberpunk-scanner") {
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(0,255,100,0.06)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      for (var sl = 0; sl < H; sl += 3) ctx.fillRect(0, sl, W, 1);
      ctx.strokeStyle = "rgba(0,255,140,0.18)";
      ctx.lineWidth = 1;
      var step = 36;
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
      "phase-contrast": "grayscale(1) contrast(1.65) brightness(1.25) drop-shadow(0 0 6px #fff)",
      "haeckel-watercolor": "sepia(0.45) saturate(1.55) contrast(1.2) brightness(1.08)",
      "engraving": "grayscale(1) contrast(1.5) sepia(0.65) brightness(0.98)",
      "cyberpunk-scanner": "saturate(1.85) contrast(1.35) hue-rotate(45deg) drop-shadow(0 0 8px #0f8)",
      "glass-lab": "saturate(0.65) brightness(1.12) contrast(1.05)",
      classic: "none"
    };
    return m[theme] || "none";
  }
  function enhanceWiki() {
    var wiki = document.getElementById("wikiO");
    if (!wiki || !wiki.classList.contains("show")) return;
    var theme = wiki.getAttribute("data-theme-bestiary") || bid();
    var wc = document.getElementById("wikiContent");
    if (wc && theme && theme !== "classic") wc.classList.add("wiki-grid-cards");
    else if (wc) wc.classList.remove("wiki-grid-cards");
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
    var dark = { "neon-bio": 0.18, "cyberpunk-scanner": 0.28, "phase-contrast": 0.42, "engraving": 0.55, "haeckel-watercolor": 0.75, "glass-lab": 0.9 };
    if (dark[id] != null) w.__igsThemeDayLight = dark[id];
    else if (id === "classic") w.__igsThemeDayLight = null;
  }
  w.igsThemeVisuals = { install: install, postFX: postFX, enhanceWiki: enhanceWiki };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
  setTimeout(install, 500);
  setTimeout(install, 2000);
})(typeof window !== "undefined" ? window : globalThis);
