/* theme_menu_chrome.js — v6 concept chrome for v5 menus: hero tank, side icon rail, bottom tab bar, stat chips.
   Pure UI: every button forwards a click to an existing control (start, wiki, settings, help, demo). No sim access. */
(function (w) {
  "use strict";
  var C = {
    "glass-lab": { hero: "glass-lab/glass_pond_bg.jpg", cls: "glass",
      stats: [["@flask", "$sp", "SPECIES"], ["@cell", "$pool", "ORGANISMS"]],
      rail: [["@eye", "VIEW", "demoBtn"], ["@zoom", "ZOOM", "screensaverBtn"], ["@pipette", "SAMPLE", "wikiBtnMenu"], ["@flask", "ANALYZE", "setBtn2"]],
      tabs: [["@lotus", "POND", "startBtn"], ["@cell", "ORGANISMS", "wikiBtnMenu"], ["@dots", "POPULATION", "demoBtn"], ["@bars", "DATA", "setBtn2"]] },
    "cyberpunk-scanner": { hero: "cyberpunk-scanner/cyber_pond_bg.jpg", cls: "cyber",
      stats: [["@menu", "", "MENU", "helpBtn"], ["@target", "", "SCAN", "demoBtn"]],
      rail: [["@target", "", "demoBtn"], ["@virus", "", "wikiBtnMenu"], ["@waves", "", "screensaverBtn"], ["@spark", "", "setBtn2"]],
      tabs: [["@power", "POWER", "setBtn2"], ["@cross", "SCAN", "startBtn"], ["@globe", "WORLD", "wikiBtnMenu"]] },
    "neon-bio": { hero: "neon-bio/neon_pond_bg.jpg", cls: "neon",
      stats: [["@target", "", "", "helpBtn"], ["@leaf", "", "", "wikiBtnMenu"]], rail: [],
      tabs: [["@spark", "POND", "startBtn"], ["@cell", "LIFE", "wikiBtnMenu"], ["@gear", "SETUP", "setBtn2"]] },
    "phase-contrast": { hero: "phase-contrast/phase_pond_bg.jpg", cls: "phase",
      stats: [["@bolt", "", "", "demoBtn"], ["@clock", "", "", "screensaverBtn"]], rail: [],
      tabs: [["@eye", "OBSERVE", "startBtn"], ["@cell", "SPECIMENS", "wikiBtnMenu"], ["@gear", "SETTINGS", "setBtn2"]] },
    "engraving": { hero: "engraving/engraving_pond_bg.jpg", cls: "engr",
      stats: [["@flask", "$sp", "SPECIES"], ["@sun", "$star", "LIGHT"]], hub: ["@menu", "", "helpBtn"], rail: [],
      tabs: [["@leaf", "OBSERVE", "startBtn"], ["@branch", "NURTURE", "demoBtn"], ["@zoom", "DISCOVER", "wikiBtnMenu"], ["@shell", "ARCHIVE", "setBtn2"]] },
    "haeckel-watercolor": { hero: "haeckel-watercolor/haeckel_pond_bg.jpg", cls: "haeckel",
      stats: [["@flask", "$sp", "SPECIES"], ["@cell", "$pool", "ORGANISMS"]], rail: [], tabs: [["@zoom", "HOW TO PLAY", "helpBtn"], ["@lotus", "OBSERVE", "startBtn"], ["@leaf", "WIKI", "wikiBtnMenu"]] }
  };
  var P = {
    lotus: "M4 15c4 3 12 3 16 0M12 14c-2-3-2-6 0-9 2 3 2 6 0 9zM12 14c-3-1-5-3-6-6 3 0 5 2 6 6zM12 14c3-1 5-3 6-6-3 0-5 2-6 6z",
    cell: "M5 12c0-4 3-6 7-6s7 2 7 6-3 6-7 6-7-2-7-6zM10 11a1.5 1.5 0 1 0 .1 0M14 14a1 1 0 1 0 .1 0M3 9l2 1M3 15l2-1M21 9l-2 1M21 15l-2-1",
    dots: "M6 8h.1M12 6h.1M18 8h.1M8 13h.1M14 12h.1M17 16h.1M10 18h.1M5 17h.1",
    bars: "M5 19V11M10 19V6M15 19V9M20 19V13M3 20h18",
    eye: "M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12zM12 9a3 3 0 1 0 .1 0",
    zoom: "M10 4a6 6 0 1 0 .1 0M14.5 14.5L20 20M10 7v6M7 10h6",
    pipette: "M14 4l6 6M16 6l-9 9-2 4 4-2 9-9M5 19h.1",
    flask: "M9 3h6M10 3v6l-5 9c-.5 1 0 3 2 3h10c2 0 2.5-2 2-3l-5-9V3M7 15h10",
    menu: "M5 7h14M5 12h14M5 17h14",
    target: "M12 4a8 8 0 1 0 .1 0M12 8a4 4 0 1 0 .1 0M12 11.5v1",
    virus: "M12 7a5 5 0 1 0 .1 0M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
    waves: "M3 8c3-2 6 2 9 0s6-2 9 0M3 13c3-2 6 2 9 0s6-2 9 0M3 18c3-2 6 2 9 0s6-2 9 0",
    spark: "M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z",
    power: "M12 3v8M7 6a8 8 0 1 0 10 0",
    cross: "M12 5a7 7 0 1 0 .1 0M12 2v6M12 16v6M2 12h6M16 12h6M12 11.5v1",
    globe: "M12 3a9 9 0 1 0 .1 0M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18",
    leaf: "M5 19C5 10 11 5 20 4c-1 9-6 15-15 15zM5 19l9-9M10 14H7M13 11V8",
    gear: "M12 9a3 3 0 1 0 .1 0M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
    bolt: "M13 2L5 14h6l-1 8 8-12h-6z",
    clock: "M12 3a9 9 0 1 0 .1 0M12 7v5l3 2",
    sun: "M12 8a4 4 0 1 0 .1 0M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5",
    branch: "M12 21V8M12 14l-5-4M12 11l5-4M7 10c-2 0-3-2-3-3 2 0 3 1 3 3zM17 7c2 0 3-2 3-3-2 0-3 1-3 3zM12 8c-1-2 0-4 0-5 1 1 1 3 0 5z",
    shell: "M12 20c-5 0-8-3-8-7s3-7 7-7 6 2 6 5-2 4-4 4-3-1-3-2.5S11 10 12 10M4 13h3M5 9l2 1M8 6l1 2"
  };
  function ico(k) { if (k.charAt(0) !== "@") return k; return '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + (P[k.slice(1)] || "") + '"/></svg>'; }
  var ON = { "glass-lab": 1, "cyberpunk-scanner": 1, "neon-bio": 1, "phase-contrast": 1, "engraving": 1, "haeckel-watercolor": 1 };
  function val(t) {
    if (t === "$sp") return String((typeof SPECIES_DB !== "undefined") ? SPECIES_DB.length : "");
    if (t === "$pool") { try { return "~" + getPoolCount(); } catch (e) { return ""; } }
    if (t === "$star") { var s = document.getElementById("starSelect"); return s && s.selectedIndex >= 0 ? s.options[s.selectedIndex].text.replace(/^\W+/, "") : ""; }
    return t;
  }
  function refresh() { var bs = document.querySelectorAll("#v6chrome [data-val]"); for (var i = 0; i < bs.length; i++) { var v = val(bs[i].getAttribute("data-val")); if (bs[i].textContent !== v) bs[i].textContent = v; } }
  function fire(id) { var b = document.getElementById(id); if (b) b.click(); }
  function btn(cls, it) {
    var b = document.createElement("button"); b.type = "button"; b.className = cls;
    b.innerHTML = '<i>' + ico(it[0]) + '</i>' + (it[1] ? '<b' + (it[1].charAt(0) === "$" ? ' data-val="' + it[1] + '">' + val(it[1]) : '>' + it[1]) + '</b>' : '') + (it[2] && cls === "v6chip" ? '<s>' + it[2] + '</s>' : '');
    var tgt = cls === "v6chip" ? it[3] : it[2]; if (tgt) b.onclick = function () { fire(tgt); }; else b.disabled = true;
    return b;
  }
  function organisms(hero, st) {
    var D = w.igsNeonDraw, db = (typeof SPECIES_DB !== "undefined") ? SPECIES_DB : null; if (!D || !db) return;
    var cls = C[st] && C[st].cls, pick = [7, 19, 33, 48, 61, 75], pos = [[18, 30], [62, 22], [38, 58], [74, 60], [12, 70], [52, 40]];
    if (cls === "engr") { pick = [3, 9, 14, 22, 27, 35, 41, 52, 58, 66, 71, 83]; pos = [[14, 50], [30, 58], [48, 52], [66, 56], [80, 62], [20, 70], [40, 74], [58, 68], [74, 78], [26, 84], [50, 86], [68, 88]]; }
    for (var i = 0; i < pick.length; i++) {
      var sp = db[pick[i] % db.length], u = sp && D.thumb(sp, st); if (!u) continue;
      var im = document.createElement("img"); im.src = u; im.alt = ""; im.className = "v6org" + (cls === "engr" && i > 3 ? " sm" : "");
      im.style.left = pos[i][0] + "%"; im.style.top = pos[i][1] + "%"; im.style.animationDelay = (i * 0.7) + "s"; hero.appendChild(im);
      if (C[st] && C[st].cls === "cyber") { var lb = document.createElement("span"); lb.className = "v6tag"; var nm = String(sp.name || sp.id || "").split(/\s+/); lb.textContent = (nm[0] || "").slice(0, 4).toUpperCase() + (nm[1] ? "." + nm[1].charAt(0).toUpperCase() : "") + "-" + (sp.num || (pick[i] % db.length) + 1); lb.style.left = pos[i][0] + "%"; lb.style.top = "calc(" + pos[i][1] + "% - 14px)"; hero.appendChild(lb); }
    }
  }
  function build(id) {
    var m = document.getElementById("menuO"), c = C[id]; if (!m || !c) return;
    var old = document.getElementById("v6chrome"); if (old && old.getAttribute("data-t") === id) return; if (old) old.remove();
    var root = document.createElement("div"); root.id = "v6chrome"; root.setAttribute("data-t", id); root.className = "v6 v6-" + c.cls;
    var hero = document.createElement("div"); hero.className = "v6hero"; hero.style.backgroundImage = 'url("assets/themes/' + c.hero + '")';
    var tank = document.createElement("div"); tank.className = "v6tank"; hero.appendChild(tank);
    organisms(hero, id);
    if (c.stats.length) { var sb = document.createElement("div"); sb.className = "v6stats"; c.stats.forEach(function (s) { sb.appendChild(btn("v6chip", s)); }); hero.appendChild(sb); }
    if (c.rail.length) { var rl = document.createElement("div"); rl.className = "v6rail"; c.rail.forEach(function (s) { rl.appendChild(btn("v6rb", s)); }); hero.appendChild(rl); }
    root.appendChild(hero);
    var tb = document.createElement("div"); tb.className = "v6tabs"; c.tabs.forEach(function (s, i) { var b = btn("v6tab" + (i === 0 ? " on" : ""), s); tb.appendChild(b); }); root.appendChild(tb);
    if (c.hub) { var hb = btn("v6hub", c.hub); root.appendChild(hb); }
    var tt = m.querySelector(".tt"), sub = document.getElementById("menuSub"), after = sub || tt;
    if (after && after.parentNode) after.parentNode.insertBefore(root, after.nextSibling); else m.insertBefore(root, m.firstChild);
    document.body.classList.add("v6on");
  }
  function tick() {
    var id = w.__igsThemePondId, m = document.getElementById("menuO");
    var want = !!(ON[id] && w.__igsThemeCover && w.__igsThemeCover[id] && m);
    if (!want) { var o = document.getElementById("v6chrome"); if (o) o.remove(); document.body.classList.remove("v6on"); return; }
    try { build(id); refresh(); } catch (e) {}
  }
  setInterval(tick, 1200); setTimeout(tick, 300);
  w.igsMenuChrome = { tick: tick, C: C, ON: ON };
})(window);
