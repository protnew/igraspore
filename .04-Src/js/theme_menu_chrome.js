/* theme_menu_chrome.js — v6 concept chrome for v5 menus: hero tank, side icon rail, bottom tab bar, stat chips.
   Pure UI: every button forwards a click to an existing control (start, wiki, settings, help, demo). No sim access. */
(function (w) {
  "use strict";
  var C = {
    "glass-lab": { hero: "glass-lab/glass_pond_bg.jpg", cls: "glass",
      stats: [["\u2697", "$sp", "SPECIES"], ["\u25ce", "$pool", "ORGANISMS"]],
      rail: [["\u25c9", "VIEW", "demoBtn"], ["\u2295", "ZOOM", "screensaverBtn"], ["\u2697", "SAMPLE", "wikiBtnMenu"], ["\u2234", "ANALYZE", "setBtn2"]],
      tabs: [["\u2618", "POND", "startBtn"], ["\u2687", "ORGANISMS", "wikiBtnMenu"], ["\u2234", "POPULATION", "demoBtn"], ["\u2591", "DATA", "setBtn2"]] },
    "cyberpunk-scanner": { hero: "cyberpunk-scanner/cyber_pond_bg.jpg", cls: "cyber",
      stats: [["\u2261", "", "MENU", "helpBtn"], ["\u2316", "", "SCAN", "demoBtn"]],
      rail: [["\u25ce", "", "demoBtn"], ["\u2735", "", "wikiBtnMenu"], ["\u2248", "", "screensaverBtn"], ["\u2726", "", "setBtn2"]],
      tabs: [["\u23fb", "POWER", "setBtn2"], ["\u2316", "SCAN", "startBtn"], ["\u25cd", "WORLD", "wikiBtnMenu"]] },
    "neon-bio": { hero: "neon-bio/neon_pond_bg.jpg", cls: "neon",
      stats: [["\u25c9", "", "", "helpBtn"], ["\u2766", "", "", "wikiBtnMenu"]], rail: [],
      tabs: [["\u2726", "POND", "startBtn"], ["\u274b", "LIFE", "wikiBtnMenu"], ["\u2699", "SETUP", "setBtn2"]] },
    "phase-contrast": { hero: "phase-contrast/phase_pond_bg.jpg", cls: "phase",
      stats: [["\u26a1", "", "", "demoBtn"], ["\u25f7", "", "", "screensaverBtn"]], rail: [],
      tabs: [["\u25d0", "OBSERVE", "startBtn"], ["\u25ce", "SPECIMENS", "wikiBtnMenu"], ["\u2699", "SETTINGS", "setBtn2"]] },
    "engraving": { hero: "engraving/engraving_pond_bg.jpg", cls: "engr",
      stats: [["\u2697", "$sp", "SPECIES"], ["\u2600", "$star", "LIGHT"]], rail: [],
      tabs: [["\u2766", "OBSERVE", "startBtn"], ["\u2698", "NURTURE", "demoBtn"], ["\u2315", "DISCOVER", "wikiBtnMenu"], ["\u0040", "ARCHIVE", "setBtn2"]] },
    "haeckel-watercolor": { hero: "haeckel-watercolor/haeckel_pond_bg.jpg", cls: "haeckel",
      stats: [], rail: [], tabs: [["\u2766", "OBSERVE", "startBtn"], ["\u2740", "", "wikiBtnMenu"], ["\u270e", "WIKI", "setBtn2"]] }
  };
  var ON = { "glass-lab": 1, "cyberpunk-scanner": 1, "neon-bio": 1, "phase-contrast": 1, "engraving": 1 };
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
    b.innerHTML = '<i>' + it[0] + '</i>' + (it[1] ? '<b' + (it[1].charAt(0) === "$" ? ' data-val="' + it[1] + '">' + val(it[1]) : '>' + it[1]) + '</b>' : '') + (it[2] && cls === "v6chip" ? '<s>' + it[2] + '</s>' : '');
    var tgt = cls === "v6chip" ? it[3] : it[2]; if (tgt) b.onclick = function () { fire(tgt); }; else b.disabled = true;
    return b;
  }
  function organisms(hero, st) {
    var D = w.igsNeonDraw, db = (typeof SPECIES_DB !== "undefined") ? SPECIES_DB : null; if (!D || !db) return;
    var pick = [7, 19, 33, 48, 61, 75], pos = [[18, 30], [62, 22], [38, 58], [74, 60], [12, 70], [52, 40]];
    for (var i = 0; i < pick.length; i++) {
      var sp = db[pick[i] % db.length], u = sp && D.thumb(sp, st); if (!u) continue;
      var im = document.createElement("img"); im.src = u; im.alt = ""; im.className = "v6org";
      im.style.left = pos[i][0] + "%"; im.style.top = pos[i][1] + "%"; im.style.animationDelay = (i * 0.7) + "s"; hero.appendChild(im);
      if (C[st] && C[st].cls === "cyber") { var lb = document.createElement("span"); lb.className = "v6tag"; lb.textContent = "#" + (sp.num || (pick[i] % db.length) + 1); lb.style.left = pos[i][0] + "%"; lb.style.top = "calc(" + pos[i][1] + "% - 14px)"; hero.appendChild(lb); }
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
