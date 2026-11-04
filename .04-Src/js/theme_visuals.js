/* theme_visuals.js — per-theme pond sky/sun/pads/postFX + bestiary sprite thumbs */
(function (w) {
  "use strict";
  var V5 = { "neon-bio": 1, "phase-contrast": 1, "engraving": 1, "cyberpunk-scanner": 1, "glass-lab": 1, "haeckel-watercolor": 1 };
  var BG = { "neon-bio": "neon-bio/neon_pond_bg.jpg?v=7", "phase-contrast": "phase-contrast/phase_pond_bg.jpg?v=8", "engraving": "engraving/engraving_pond_bg.jpg?v=8",
    "cyberpunk-scanner": "cyberpunk-scanner/cyber_pond_bg.jpg?v=8", "glass-lab": "glass-lab/glass_pond_bg.jpg?v=8", "haeckel-watercolor": "haeckel-watercolor/haeckel_pond_bg.jpg?v=8" };
  function isV5(id) { return !!V5[id]; }
  w.__igsThemeCover = V5; w.__igsPondBgs = w.__igsPondBgs || {};
  function tid() { return w.__igsThemePondId || "classic"; }
  function bid() { return w.__igsThemeBestiary || "classic"; }
  function wrapSky() {
    if (typeof renderSky !== "function" || renderSky.__igsThemeWrap) return;
    var orig = renderSky;
    function themedSky(vL, vR, vT) {
      var id = tid();
      if (id === "classic") return orig.apply(this, arguments);
      if (isV5(id)) { w._sunPos = null; return; }
      var h = -vT;
      if (vT >= 5) { if (id === "neon-bio" || id === "cyberpunk-scanner" || id === "phase-contrast" || id === "engraving") w._sunPos = null; return; }
      if (h < 1) return;
      if (id === "neon-bio") { w._sunPos = null; return; }
      if (id === "cyberpunk-scanner") {
        w._sunPos = null;
        ctx.fillStyle = "#050008";
        ctx.fillRect(vL - 20, vT - 2, (vR - vL) + 40, h + 4);
        ctx.save();
        for (var si = 0; si < 48; si++) {
          var sx = vL + ((si * 97) % Math.max(1, vR - vL));
          var sy = vT + 8 + ((si * 53) % Math.max(1, h * 0.7));
          ctx.globalAlpha = 0.3 + (si % 5) * 0.1;
          ctx.fillStyle = "#f0f";
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
      if (isV5(id)) return;
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
      if (isV5(id)) return;
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
      if (isV5(id)) {
        if (w.igsNeonDraw && typeof w.igsNeonDraw.drawCell === "function") {
          try {
            c.save();
            c.translate(o.x, o.y);
            if (typeof o.facing === "number") c.rotate(o.facing);
            w.igsNeonDraw.drawCell(c, o, ssz);
            c.restore();
            return;
          } catch (eN2) {}
        }
        c.save();
        var col = (o && o.sp && o.sp.color) || "#0ff";
        c.shadowColor = col; c.shadowBlur = Math.max(10, ssz * 2.5); c.globalAlpha = 0.95;
        orig(c, o, ssz, sh);
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
    if (!isV5(id) || typeof ctx === "undefined" || !cv) return;
    var W = cv.width, H = cv.height, FX = {
      "neon-bio": [0.18, null], "phase-contrast": [0.30, null], "engraving": [0.28, "rgba(120,90,50,0.05)"],
      "cyberpunk-scanner": [0.25, null], "glass-lab": [0.10, "rgba(255,255,255,0.03)"], "haeckel-watercolor": [0.14, "rgba(240,220,180,0.04)"]
    }[id];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    var vig = ctx.createRadialGradient(W / 2, H * 0.5, H * 0.2, W / 2, H * 0.5, H * 0.95);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0," + FX[0] + ")");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
    if (FX[1]) { ctx.fillStyle = FX[1]; ctx.fillRect(0, 0, W, H); }
    if (id === "cyberpunk-scanner") { /* faint scanline sweep */
      var sy = ((Date.now() / 18) % (H + 80)) - 40, sg = ctx.createLinearGradient(0, sy - 40, 0, sy + 40);
      sg.addColorStop(0, "rgba(0,246,255,0)"); sg.addColorStop(0.5, "rgba(0,246,255,0.07)"); sg.addColorStop(1, "rgba(0,246,255,0)");
      ctx.fillStyle = sg; ctx.fillRect(0, sy - 40, W, 80);
    }
    ctx.restore();
  }
  var _beds={};
  function bedState(key, src) {
    var st=_beds[key];
    if(!st){ st=_beds[key]={img:null,tried:false,fail:false}; }
    if(st.fail) return null;
    if(!st.img){
      if(!st.tried){
        st.tried=true;
        try{
          var im=new Image();
          im.onload=function(){ st.img=im; var tk=key.replace(/-v\d+$/,""); w.__igsPondBgs[tk]=im; if(tk==="neon-bio") w.__igsNeonPondBg=im; };
          im.onerror=function(){ st.fail=true; };
          im.src=src;
        }catch(e){ st.fail=true; }
      }
      return null;
    }
    var tk2=key.replace(/-v\d+$/,""); w.__igsPondBgs[tk2]=st.img; if(tk2==="neon-bio") w.__igsNeonPondBg=st.img;
    return st;
  }
  function drawThemePondBed(key, src, alpha) {
    var st=bedState(key, src); if(!st||typeof ctx==="undefined"||!cv) return;
    ctx.save();
    ctx.globalCompositeOperation="source-over";
    ctx.globalAlpha=alpha||0.4;
    ctx.drawImage(st.img,0,0,cv.width,cv.height);
    ctx.restore();
  }
  function drawThemePondBedScreen(key, src) {
    var st=bedState(key, src); if(!st||typeof ctx==="undefined"||!cv) return false;
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.globalCompositeOperation="source-over";
    ctx.globalAlpha=1;
    ctx.drawImage(st.img, 0, 0, cv.width, cv.height);
    ctx.restore();
    return true;
  }
  function wrapWater() {
    if (typeof renderWater !== "function" || renderWater.__igsThemeWrap) return;
    var orig = renderWater;
    function themedWater(vL, vR, vT, vB) {
      var id = tid();
      if (isV5(id)) { return; }
      return orig.apply(this, arguments);
    }
    themedWater.__igsThemeWrap = true;
    renderWater = themedWater;
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
      if (theme === "neon-bio" || theme === "phase-contrast" || theme === "engraving" || theme === "cyberpunk-scanner" || theme === "haeckel-watercolor" || theme === "glass-lab") {
        var idx = (sp && typeof sp.i === "number") ? sp.i : (sp && sp.idx);
        if (idx == null && typeof SPECIES_DB !== "undefined") {
          for (var zi = 0; zi < SPECIES_DB.length; zi++) {
            if (SPECIES_DB[zi] && SPECIES_DB[zi].name === name) { idx = zi; if (SPECIES_DB[zi].i != null) idx = SPECIES_DB[zi].i; break; }
          }
        }
        var pad = (idx != null) ? ("00" + idx).slice(-3) : null;
        var baseMap={"neon-bio":"assets/themes/neon-bio/sprites/","phase-contrast":"assets/themes/phase-contrast/sprites/","engraving":"assets/themes/engraving/sprites/","cyberpunk-scanner":"assets/themes/cyberpunk-scanner/sprites/","haeckel-watercolor":"assets/themes/haeckel-watercolor/sprites/","glass-lab":"assets/themes/glass-lab/sprites/"};
        var base = baseMap[theme] || ("assets/themes/"+theme+"/sprites/");
        img.src = pad ? (base + "species/" + pad + ".png") : (base + shape + ".png");
        img.onerror = function () {
          if (this.dataset.fb === "2") return;
          if (this.dataset.fb === "1") { this.dataset.fb = "2"; this.src = base + "circle.png"; return; }
          this.dataset.fb = "1"; this.src = base + shape + ".png";
        };
        var pth = (w.igsNeonDraw && w.igsNeonDraw.thumb) ? w.igsNeonDraw.thumb(sp, theme) : null;
        if (pth) { img.onerror = null; img.src = pth; }
        img.style.filter = "none";
        var cap = el.querySelector("b");
        if (cap && name) cap.textContent = name;
      } else {
        img.src = SPRITE_BASE + shape + ".png?v=2";
        img.onerror = function () { if (this.dataset.fb) return; this.dataset.fb = "1"; this.src = SPRITE_BASE + "circle.png?v=2"; };
        img.style.filter = thumbFilter(theme);
      }
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
  function ensureNeonDraw(cb) {
    if (w.igsNeonDraw) { if (cb) cb(); return; }
    var s = document.createElement("script");
    var base = (document.querySelector('script[src*="theme_visuals"]') || {}).src || "04-Src/js/theme_visuals.js";
    s.src = String(base).replace(/theme_visuals\.js.*/, "theme_neon_draw.js");
    s.onload = function () { if (cb) cb(); };
    document.head.appendChild(s);
  }
  function install() {
    ensureNeonDraw();
    wrapSky(); wrapSun(); wrapPads(); wrapSwiss(); wrapWater(); wrapShoreBubbles(); wrapBuildWiki();
    var id = tid();
    var dark = {"neon-bio":0.42,"cyberpunk-scanner":0.22,"phase-contrast":0.48,"engraving":0.55,"haeckel-watercolor":0.75,"glass-lab":0.9};
    if (dark[id] != null) w.__igsThemeDayLight = dark[id];
    else if (id === "classic") w.__igsThemeDayLight = null;
    if (isV5(id)) {
      try {
        if (typeof settings !== "undefined" && settings) { settings.renderMode = "swiss"; w._swissStrict = true; }
        bedState(id + "-v8", "assets/themes/" + BG[id]);
      } catch (eSw) {}
    }
  }
  function wrapShoreBubbles() {
    function skip(get, set) {
      var fn = get(); if (typeof fn !== "function" || fn.__igsThemeWrap) return;
      var orig = fn;
      var wrapped = function () { if (isV5(tid())) return; return orig.apply(this, arguments); };
      wrapped.__igsThemeWrap = true; set(wrapped);
    }
    skip(function () { return typeof renderShore === "function" ? renderShore : null; }, function (f) { renderShore = f; });
    skip(function () { return typeof renderBubbles === "function" ? renderBubbles : null; }, function (f) { renderBubbles = f; });
    skip(function () { return typeof renderSediment === "function" ? renderSediment : null; }, function (f) { renderSediment = f; });
    skip(function () { return typeof renderSunRays === "function" ? renderSunRays : null; }, function (f) { renderSunRays = f; });
  }
  w.igsThemeVisuals = { install: install, postFX: postFX, enhanceWiki: enhanceWiki };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
  setTimeout(install, 500);
  setTimeout(install, 2000);
})(typeof window !== "undefined" ? window : globalThis);
