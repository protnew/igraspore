/* theme_bestiary_v9.js — concept-style bestiary for v5 themes: header with real group filters, big card grid,
   large procedural creature renders (pond sprite baked big + organelles from sp.bio), style fields from real data, bottom bar.
   Visual only: reuses #wikiContent entries built by buildWiki(); buttons forward to existing controls. */
(function (w) {
  "use strict";
  var TITLE = { "engr": "SPECIES GALLERY", "haeckel": "Species Gallery", "cyber": "// SPECIES GALLERY", "neon": "", "phase": "iGraSpore", "glass": "iGraSpore" };
  var INK = { engr: "#2b1a0e", haeckel: "#5a3a1e", cyber: "#39ff88", neon: "#ffffff", phase: "#e8fff9", glass: "#ffffff" };
  var CAT = { virus: "Viruses", producer: "Greens", consumer1: "Small eaters", consumer2: "Mid eaters", consumer3: "Big hunters", decomposer: "Cleaners" };
  var CODE = { virus: "VR", producer: "PR", consumer1: "C1", consumer2: "C2", consumer3: "C3", decomposer: "DC" };
  var BIG = {};
  function st() { var D = w.igsNeonDraw, id = w.__igsThemePondId; return (D && w.__igsThemeCover && w.__igsThemeCover[id]) ? D.STYLE_OF[id] : null; }
  function hash(s) { var v = 0; s = String(s); for (var i = 0; i < s.length; i++) v = (v * 31 + s.charCodeAt(i)) | 0; return Math.abs(v); }
  function rnd(seed) { var x = seed % 2147483647 || 7; return function () { x = x * 16807 % 2147483647; return x / 2147483647; }; }
  /* extra organelle detail from the species' real bio flags */
  function detail(c, sp, s, px) {
    var b = sp.bio || {}, r = rnd(hash(sp.name)), k = px / 2, ink = INK[s];
    c.save(); c.translate(k, k); c.strokeStyle = ink; c.fillStyle = ink; c.lineWidth = Math.max(1, px / 220);
    c.globalAlpha = s === "engr" || s === "haeckel" ? 0.55 : 0.5;
    if (b.nucleus || b.macro) { c.beginPath(); c.ellipse(k * -0.05, 0, k * 0.11, k * 0.08, 0.3, 0, 6.283); c.stroke(); c.beginPath(); c.arc(k * -0.05, 0, k * 0.025, 0, 6.283); c.fill(); }
    if (b.contractile || b.vac) { c.beginPath(); c.arc(k * 0.2, k * -0.05, k * 0.05, 0, 6.283); c.stroke(); for (var i = 0; i < 6; i++) { var a = i * 1.047; c.beginPath(); c.moveTo(k * 0.2 + Math.cos(a) * k * 0.06, k * -0.05 + Math.sin(a) * k * 0.06); c.lineTo(k * 0.2 + Math.cos(a) * k * 0.1, k * -0.05 + Math.sin(a) * k * 0.1); c.stroke(); } }
    if (b.chloro || b.plastid || b.thylakoid) { for (var j = 0; j < 9; j++) { c.beginPath(); c.ellipse((r() - 0.5) * k * 0.5, (r() - 0.5) * k * 0.22, k * 0.03, k * 0.018, r() * 3, 0, 6.283); c.stroke(); } }
    if (b.mito || b.ribo) { for (var m = 0; m < 14; m++) { c.beginPath(); c.arc((r() - 0.5) * k * 0.55, (r() - 0.5) * k * 0.25, k * 0.008, 0, 6.283); c.fill(); } }
    if (b.oral) { c.beginPath(); c.moveTo(k * 0.28, k * 0.02); c.quadraticCurveTo(k * 0.1, k * 0.1, k * -0.05, k * 0.06); c.stroke(); }
    c.restore();
  }
  /* procedural phage for viruses (icosahedral head, collar, tail, fibres) */
  /* real morphology of the game's named phages: T4 Myoviridae (long contractile tail), Lambda Siphoviridae (long flexible
     non-contractile tail), T7 Podoviridae (short stub tail), Phi-6 Cystoviridae (enveloped, no tail), MS2 Leviviridae (tiny, no tail) */
  var MORPH = { "T4 Bacteriophage": "myo", "Lambda Phage": "sipho", "T7 Bacteriophage": "podo", "Phi-6 Phage": "cysto", "MS2 Phage": "levi" };
  function phage(c, px, ink, seed, nm) {
    var mo = MORPH[nm] || "myo", r = rnd(seed), k = px / 2, h = k * 0.32 * ({ podo: 0.62, cysto: 0.6, levi: 0.42 }[mo] || 1);
    if (mo === "cysto" || mo === "levi" || mo === "podo" || mo === "sipho") { c.save(); c.translate(k, mo === "sipho" ? k * 0.55 : k); c.strokeStyle = ink; c.fillStyle = ink; c.lineWidth = px / 110;
      var R = mo === "levi" ? h * 0.75 : h * 1.05, i, a;
      if (mo === "cysto") { c.beginPath(); c.arc(0, 0, R * 1.15, 0, 6.283); c.globalAlpha = 0.18; c.fill(); c.globalAlpha = 1; c.stroke();
        for (i = 0; i < 28; i++) { a = i * 0.2244; c.beginPath(); c.moveTo(Math.cos(a) * R * 1.15, Math.sin(a) * R * 1.15); c.lineTo(Math.cos(a) * R * 1.3, Math.sin(a) * R * 1.3); c.stroke(); } R *= 0.7; }
      c.beginPath(); for (i = 0; i < 6; i++) { a = i * 1.047 + 0.5236; c.lineTo(Math.cos(a) * R, Math.sin(a) * R); } c.closePath(); c.globalAlpha = 0.25; c.fill(); c.globalAlpha = 1; c.stroke();
      c.lineWidth = px / 220; c.beginPath(); for (i = 0; i < 3; i++) { a = i * 2.094 + 0.5236; c.moveTo(0, 0); c.lineTo(Math.cos(a) * R, Math.sin(a) * R); } c.stroke();
      if (mo === "podo") { c.lineWidth = px / 80; c.beginPath(); c.moveTo(0, R); c.lineTo(0, R * 1.35); c.stroke(); c.lineWidth = px / 160; [-1, 1].forEach(function (sg) { c.beginPath(); c.moveTo(0, R * 1.3); c.lineTo(sg * R * 0.45, R * 1.6); c.stroke(); }); }
      if (mo === "sipho") { c.lineWidth = px / 120; c.beginPath(); c.moveTo(0, R); for (i = 1; i <= 24; i++) c.lineTo(Math.sin(i * 0.35) * R * 0.12, R + i * R * 0.07); c.stroke(); c.beginPath(); c.moveTo(Math.sin(8.4) * R * 0.12, R * 2.68); c.lineTo(Math.sin(8.4) * R * 0.12, R * 2.9); c.stroke(); }
      c.restore(); return; } c.save(); c.translate(k, k * 0.7); c.strokeStyle = ink; c.fillStyle = ink; c.lineWidth = px / 90;
    c.beginPath(); for (var i = 0; i < 6; i++) { var a = i * 1.047 + 0.5236; c.lineTo(Math.cos(a) * h, Math.sin(a) * h); } c.closePath(); c.globalAlpha = 0.25; c.fill(); c.globalAlpha = 1; c.stroke();
    c.lineWidth = px / 200; c.beginPath(); c.moveTo(-h * 0.87, -h * 0.5); c.lineTo(0, 0); c.lineTo(h * 0.87, -h * 0.5); c.moveTo(0, 0); c.lineTo(0, h); c.stroke();
    c.globalAlpha = 0.6; for (var d = 0; d < 7; d++) { c.beginPath(); c.arc((r() - 0.5) * h, (r() - 0.6) * h, h * 0.06, 0, 6.283); c.fill(); } c.globalAlpha = 1;
    c.lineWidth = px / 70; c.strokeRect(-h * 0.18, h, h * 0.36, h * 0.12); c.lineWidth = px / 110;
    for (var t = 0; t < 6; t++) { var y = h * 1.14 + t * h * 0.16; c.beginPath(); c.moveTo(-h * 0.12, y); c.lineTo(h * 0.12, y); c.stroke(); }
    var by = h * 2.1; c.strokeRect(-h * 0.12, h * 1.12, h * 0.24, by - h * 1.12); c.beginPath(); c.moveTo(-h * 0.4, by); c.lineTo(h * 0.4, by); c.stroke();
    for (var f = 0; f < 3; f++) { var sx = (f - 1) * h * 0.3; [-1, 1].forEach(function (sg) { c.beginPath(); c.moveTo(sx, by); c.lineTo(sx + sg * h * 0.45, by + h * 0.35); c.lineTo(sx + sg * h * 0.6, by + h * 0.75); c.stroke(); }); }
    c.restore();
  }
  var PAL = { producer: [92, 140, 52], consumer1: [214, 146, 40], consumer2: [196, 102, 44], consumer3: [186, 70, 64], decomposer: [150, 104, 56], virus: [190, 72, 60] };
  /* engraving: light hatched linework; haeckel: translucent watercolour washes in ochre/sepia/olive */
  function restyle(cv, s, sp) {
    if (s === "glass") { var G = cv.getContext("2d"), M = cv.width, id = G.getImageData(0, 0, M, M), p = id.data, al = new Float32Array(M * M), tm = new Float32Array(M * M), R = 9, u, v;
      for (u = 0; u < M * M; u++) al[u] = p[u * 4 + 3] / 255;
      for (v = 0; v < M; v++) { var acc = 0; for (u = -R; u < M; u++) { if (u + R < M) acc += al[v * M + u + R]; if (u - R - 1 >= 0) acc -= al[v * M + u - R - 1]; if (u >= 0) tm[v * M + u] = acc / (2 * R + 1); } }
      for (u = 0; u < M; u++) { var ac2 = 0; for (v = -R; v < M; v++) { if (v + R < M) ac2 += tm[(v + R) * M + u]; if (v - R - 1 >= 0) ac2 -= tm[(v - R - 1) * M + u]; if (v >= 0) al[v * M + u] = ac2 / (2 * R + 1); } }
      for (u = 0; u < M * M; u++) { var aa = p[u * 4 + 3] / 255; if (aa < 0.02) continue; var dep = al[u], rim = Math.max(0, 1 - dep * 1.6);
        p[u * 4] = p[u * 4] * (1 - 0.45 * rim) + 40 * 0.45 * rim + (255 - p[u * 4]) * 0.35 * dep; p[u * 4 + 1] = p[u * 4 + 1] * (1 - 0.45 * rim) + 100 * 0.45 * rim + (255 - p[u * 4 + 1]) * 0.35 * dep; p[u * 4 + 2] = p[u * 4 + 2] * (1 - 0.45 * rim) + 160 * 0.45 * rim + (255 - p[u * 4 + 2]) * 0.35 * dep;
        p[u * 4 + 3] = Math.min(255, aa * 255 * (0.55 + 0.45 * rim)); }
      G.putImageData(id, 0, 0); }
    if (s === "glass") { var g = cv.getContext("2d"), N = cv.width, gr = g.createRadialGradient(N * 0.36, N * 0.3, 2, N * 0.42, N * 0.38, N * 0.42);
      g.save(); g.globalCompositeOperation = "source-atop"; gr.addColorStop(0, "rgba(255,255,255,.85)"); gr.addColorStop(0.35, "rgba(255,255,255,.2)"); gr.addColorStop(1, "rgba(70,130,190,.28)");
      g.fillStyle = gr; g.fillRect(0, 0, N, N); var lg = g.createLinearGradient(0, N, N, 0); lg.addColorStop(0, "rgba(40,110,170,.25)"); lg.addColorStop(0.5, "rgba(255,255,255,0)"); lg.addColorStop(1, "rgba(255,255,255,.25)");
      g.fillStyle = lg; g.fillRect(0, 0, N, N); g.globalCompositeOperation = "source-over"; g.restore(); return cv; }
    if (s !== "engr" && s !== "haeckel") return cv; var n = cv.width, x = cv.getContext("2d"), im = x.getImageData(0, 0, n, n), d = im.data, A = new Float32Array(n * n), L = new Float32Array(n * n);
    for (var i = 0; i < n * n; i++) { A[i] = d[i * 4 + 3] / 255; L[i] = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11) / 255; }
    var o = x.createImageData(n, n), q = o.data, pc = PAL[sp.cat] || PAL.consumer1, sep = [74, 46, 24], rr = rnd(hash(sp.name));
    for (var y = 1; y < n - 1; y++) for (var xx = 1; xx < n - 1; xx++) {
      var j = y * n + xx, a = A[j]; if (a < 0.03) continue;
      var ea = Math.abs(A[j - 1] - A[j + 1]) + Math.abs(A[j - n] - A[j + n]), el = (Math.abs(L[j - 1] - L[j + 1]) + Math.abs(L[j - n] - L[j + n])) * a, e = ea + el, dk = 1 - L[j], k = j * 4, al;
      if (s === "engr") { var hat = ((xx + y) % 7 === 0 ? 1 : 0) * (dk > 0.7 ? 1 : 0), eg = (ea > 0.5 ? 0.85 : ea > 0.25 ? 0.45 : 0) + (el > 0.6 ? 0.5 : 0);
        al = Math.min(0.9, eg + hat * 0.18 * a); q[k] = 43; q[k + 1] = 26; q[k + 2] = 14; q[k + 3] = al * 255; }
      else { var wsh = 0.5 + 0.35 * dk + (rr() - 0.5) * 0.1, ed = Math.min(1, e * 1.4), m = ed * 0.8;
        q[k] = pc[0] * (1 - m) + sep[0] * m; q[k + 1] = pc[1] * (1 - m) + sep[1] * m; q[k + 2] = pc[2] * (1 - m) + sep[2] * m; q[k + 3] = Math.min(0.92, a * wsh + ed * 0.6) * 255; }
    }
    x.putImageData(o, 0, 0); return cv;
  }
  /* filamentous cyanobacteria (producer, shape filament/trichormus): a curved trichome of real cells;
     trichormus (Nostoc) = bead-like cells with larger pale heterocysts, filament = short disc cells in a sheath */
  function chain(c, px, sp, s, col) {
    var bead = String(sp.shape) === "trichormus", r = rnd(hash(sp.name)), n = bead ? 16 : 22, ph = r() * 6, ink = INK[s], glow = s === "neon" || s === "cyber" || s === "phase";
    var pts = []; for (var i = 0; i < n; i++) { var t = i / (n - 1); pts.push([px * (0.08 + 0.84 * t), px * (0.5 + 0.2 * Math.sin(t * 5.2 + ph))]); }
    c.save(); c.lineWidth = px / 160; c.strokeStyle = s === "neon" ? col : ink; if (glow) { c.shadowColor = s === "neon" ? col : ink; c.shadowBlur = px / 40; }
    if (!bead) { c.globalAlpha = 0.35; c.lineWidth = px / 11; c.lineCap = "round"; c.beginPath(); pts.forEach(function (q, j) { if (j) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.strokeStyle = col; c.stroke(); c.globalAlpha = 1; c.lineWidth = px / 160; c.strokeStyle = s === "neon" ? col : ink; }
    for (var k = 0; k < n; k++) { var a = pts[Math.max(0, k - 1)], b2 = pts[Math.min(n - 1, k + 1)], ang = Math.atan2(b2[1] - a[1], b2[0] - a[0]), het = bead && k % 5 === 3;
      var rx = bead ? px * 0.05 * (het ? 1.2 : 1) : px * 0.018, ry = bead ? px * 0.045 * (het ? 1.2 : 1) : px * 0.04;
      c.save(); c.translate(pts[k][0], pts[k][1]); c.rotate(ang); c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, 6.283);
      c.globalAlpha = het ? 0.25 : 0.6; c.fillStyle = col; c.fill(); c.globalAlpha = 1; c.stroke();
      if (!het) { c.globalAlpha = 0.7; c.fillStyle = ink; for (var g = 0; g < 3; g++) { c.beginPath(); c.arc((r() - 0.5) * rx, (r() - 0.5) * ry, px * 0.005, 0, 6.283); c.fill(); } c.globalAlpha = 1; }
      else { c.beginPath(); c.arc(rx * 0.8, 0, px * 0.006, 0, 6.283); c.fillStyle = ink; c.fill(); }
      c.restore(); }
    c.restore();
  }
  function render(sp, s) {
    var key = s + "|" + sp.id; if (BIG[key]) return BIG[key];
    var D = w.igsNeonDraw, shape = sp.shape ? String(sp.shape) : D.shapeOf({ sp: sp }), col = D.colOf({ sp: sp }, s), px = 300;
    var fil = sp.cat === "producer" && (shape === "filament" || shape === "trichormus"), spr = sp.cat === "virus" || fil ? null : D.bake(shape, col, px, s, hash(sp.id || sp.name) % 4);
    var c = document.createElement("canvas"); c.width = c.height = px; var x = c.getContext("2d");
    if (fil) chain(x, px, sp, s, col); else if (spr) { x.drawImage(spr, 0, 0); detail(x, sp, s, px); } else phage(x, px, s === "cyber" || s === "neon" || s === "phase" ? (s === "cyber" ? "#ff3cf0" : "#e8fff9") : (s === "glass" ? "#5b7f9e" : "#5a3a1e"), hash(sp.name), sp.name);
    /* crop to the creature so it fills the card */
    try { var d = x.getImageData(0, 0, px, px).data, x0 = px, y0 = px, x1 = 0, y1 = 0;
      for (var yy = 0; yy < px; yy += 2) for (var xx = 0; xx < px; xx += 2) if (d[(yy * px + xx) * 4 + 3] > 24) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      if (x1 > x0 && sp.cat !== "virus") { var side = Math.max(x1 - x0, (y1 - y0) * 1.0) * 1.12, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, o2 = document.createElement("canvas"); o2.width = o2.height = 320;
        o2.getContext("2d").drawImage(c, cx - side / 2, cy - side / 2, side, side, 0, 0, 320, 320); c = o2; } c = restyle(c, s, sp); } catch (e) {}
    try { BIG[key] = c.toDataURL("image/png"); } catch (e) { return null; } return BIG[key];
  }
  /* first sentence, not cut at abbreviations like "E. coli", "sp.", "e.g." */
  var ABBR = /(^|\s)([A-Z]|sp|spp|e\.g|i\.e|cf|approx|ca|var|subsp|St|Dr|vs|etc|No|Fig)\.$/;
  function first(t) { var re = /[.!?](\s+|$)/g, m; while ((m = re.exec(t))) { var head = t.slice(0, m.index + 1); if (!ABBR.test(head) || !m[1]) return head; } return t; }
  function svg(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'; }
  var I = { pond: "M3 15c3-2 6 2 9 0s6-2 9 0M3 19c3-2 6 2 9 0s6-2 9 0M12 4a4 4 0 1 0 .1 0", gal: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", find: "M10 4a6 6 0 1 0 .1 0M14.5 14.5L20 20", help: "M12 3a9 9 0 1 0 .1 0M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.1", all: "M6 8h.1M12 6h.1M18 8h.1M8 13h.1M14 12h.1M17 16h.1M10 18h.1" };
  function fire(id) { var e = document.getElementById(id); if (e) e.click(); }
  var busy = false;
  function apply() {
    var s = st(), o = document.getElementById("wikiO"), wc = document.getElementById("wikiContent");
    if (!o || !wc) return;
    if (!s) { o.classList.remove("v9b"); return; }
    if (!/\bshow\b/.test(o.className)) return;
    o.classList.add("v9b"); o.setAttribute("data-v9", s);
    var hd = document.getElementById("v9bhead");
    if (!hd || hd.getAttribute("data-s") !== s) {
      if (hd) hd.remove(); if (document.getElementById("v9bbar")) document.getElementById("v9bbar").remove();
      hd = document.createElement("div"); hd.id = "v9bhead"; hd.setAttribute("data-s", s);
      hd.innerHTML = '<div class="v9t">' + (TITLE[s] || "") + '</div><div class="v9f"></div>';
      o.insertBefore(hd, o.firstChild);
      var bar = document.createElement("div"); bar.id = "v9bbar";
      [["pond", "POND", "wikiClose"], ["gal", "GALLERY", ""], ["find", "SEARCH", "@s"], ["help", "HELP", "@h"]].forEach(function (t, i) {
        var bt = document.createElement("button"); bt.type = "button"; bt.className = i === 1 ? "on" : ""; bt.innerHTML = svg(I[t[0]]) + "<span>" + t[1] + "</span>";
        bt.onclick = function () { if (t[2] === "@s") { var q = document.getElementById("wikiSearch"); if (q) q.focus(); } else if (t[2] === "@h") { fire("wikiClose"); fire("helpBtn"); } else if (t[2]) fire(t[2]); };
        bar.appendChild(bt); });
      o.appendChild(bar);
    }
    /* tag entries with their group, build filters from the real groups */
    var f = hd.querySelector(".v9f"), cats = wc.querySelectorAll(".wiki-cat");
    if (f.childNodes.length !== cats.length + 1 || f.getAttribute("data-n") !== String(wc.childNodes.length)) {
      f.innerHTML = ""; f.setAttribute("data-n", wc.childNodes.length);
      var mk = function (lbl, gi) { var b = document.createElement("button"); b.type = "button"; b.textContent = lbl; if (gi < 0) b.className = "on";
        b.onclick = function () { var bs = f.querySelectorAll("button"); for (var q = 0; q < bs.length; q++) bs[q].className = ""; b.className = "on"; o.setAttribute("data-g", gi);
          var es = wc.children, cg = -1; for (var e = 0; e < es.length; e++) { if (es[e].classList.contains("wiki-cat")) cg++; es[e].setAttribute("data-g", cg);
            if (gi < 0 || cg === gi) es[e].style.removeProperty("display"); else es[e].style.setProperty("display", "none", "important"); } }; f.appendChild(b); };
      mk("ALL", -1); var g = -1, kids = wc.children;
      for (var k = 0; k < kids.length; k++) { if (kids[k].classList.contains("wiki-cat")) { g++; mk(kids[k].textContent.replace(/\s*\(\d+\)\s*$/, ""), g); } kids[k].setAttribute("data-g", g); }
    }
    if (busy) return; busy = true;
    var es2 = wc.querySelectorAll(".wiki-entry:not([data-v9='" + s + "'])"), t0 = Date.now(), db = (typeof SPECIES_DB !== "undefined") ? SPECIES_DB : [];
    for (var n = 0; n < es2.length && Date.now() - t0 < 40; n++) {
      var en = es2[n], im = en.querySelector("img.wiki-thumb"), nm = im ? im.alt : (en.querySelector("b") || {}).textContent, sp = null;
      for (var z = 0; z < db.length; z++) if (db[z].name === nm) { sp = db[z]; break; }
      if (!sp && typeof VIRUS_SPECS !== "undefined") for (var vz = 0; vz < VIRUS_SPECS.length; vz++) if (VIRUS_SPECS[vz].name === nm) { sp = VIRUS_SPECS[vz]; break; }
      en.setAttribute("data-v9", s); if (!sp) continue;
      if (!im && sp.cat === "virus") { var tw = document.createElement("div"); tw.className = "wiki-thumb-wrap"; im = document.createElement("img"); im.className = "wiki-thumb"; im.alt = sp.name; tw.appendChild(im); var bb = en.querySelector("b"); en.insertBefore(tw, bb ? bb.nextSibling : en.firstChild); }
      var u = render(sp, s); if (u && im) { im.src = u; im.classList.add("v9big"); }
      var ex = en.querySelector(".v9x"); if (ex) ex.remove(); ex = document.createElement("div"); ex.className = "v9x";
      var grp = CAT[sp.cat] || sp.cat, desc = ((en.querySelector(".wa") || {}).textContent || "");
      desc = first(desc);
      if (s === "cyber") ex.innerHTML = '<span class="id">ID: ' + (CODE[sp.cat] || "SP") + "-" + ("00" + (sp.num || sp.id)).slice(-3) + '</span><span class="gp">GROUP: ' + grp.toUpperCase() + '</span><span class="sz">' + (sp.size || "") + 'μm · ' + String(sp.locomotion || "").toUpperCase() + '</span>';
      else if (s === "engr" || s === "haeckel") ex.innerHTML = '<span class="gp">(' + grp + ')</span><i>' + sp.name + '</i><span class="ds">' + desc + '</span>';
      else ex.innerHTML = '<span class="gp">' + grp + '</span>';
      en.appendChild(ex);
    }
    busy = false;
  }
  setInterval(function () { try { apply(); } catch (e) { busy = false; } }, 400);
  w.igsBestiaryV9 = { apply: apply, render: render };
})(window);
