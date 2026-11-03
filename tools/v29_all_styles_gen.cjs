const fs = require('fs');
const path = require('path');

const THEMES = [
  'classic','phase-contrast','neon-bio','glass-lab','cyberpunk-scanner','haeckel-watercolor','engraving'
];

const presets = {
  classic: {
    id:'classic', labelKey:'theme.classic',
    cssVars:{'--theme-bg':'#020814','--theme-panel':'rgba(0,12,28,.92)','--theme-border':'#1a3a55','--theme-text':'#e8f4ff','--theme-muted':'#9bb','--theme-accent':'#4af','--theme-card':'rgba(0,15,35,.6)','--theme-title':'#4ef','--theme-entry-b':'#4df','--theme-font-ui':'system-ui,Arial,sans-serif','--theme-font-title':'system-ui,Arial,sans-serif'},
    shader:{surface:[0.12,0.50,0.45],mid:[0.05,0.25,0.28],deep:[0.01,0.06,0.10],caustic:[0.6,0.95,0.85],bloom:1,causticAmt:1.2,sat:1,vignette:0.35,fx:1,fallback:'low',
      rgbTop:[12,70,85],rgbMid:[8,30,55],rgbBot:[12,18,22]},
    fpsBudget:{target:30,lowDeviceMaxFx:0.5}, a11y:{minContrast:4.5,minTapPx:48}, wave:0
  },
  'phase-contrast': {
    id:'phase-contrast', labelKey:'theme.phaseContrast',
    cssVars:{'--theme-bg':'#0a1214','--theme-panel':'#dfe8ea','--theme-border':'#7a9aa0','--theme-text':'#1a2426','--theme-muted':'#4a6066','--theme-accent':'#2a6a72','--theme-card':'#f2f6f7','--theme-title':'#0d3a40','--theme-entry-b':'#1a5058','--theme-font-ui':'Georgia,Times New Roman,serif','--theme-font-title':'Georgia,serif'},
    shader:{surface:[0.75,0.82,0.80],mid:[0.45,0.55,0.52],deep:[0.12,0.18,0.16],caustic:[0.9,0.95,0.92],bloom:0.4,causticAmt:0.5,sat:0.55,vignette:0.25,fx:0.7,fallback:'low',
      rgbTop:[180,200,195],rgbMid:[90,110,105],rgbBot:[30,40,38]},
    fpsBudget:{target:30,lowDeviceMaxFx:0.4}, a11y:{minContrast:4.5,minTapPx:48}, wave:1
  },
  'neon-bio': {
    id:'neon-bio', labelKey:'theme.neonBio',
    cssVars:{'--theme-bg':'#000000','--theme-panel':'rgba(5,0,20,.94)','--theme-border':'#ff00aa','--theme-text':'#e8fffe','--theme-muted':'#a0ffe8','--theme-accent':'#00ffff','--theme-card':'rgba(10,0,30,.85)','--theme-title':'#00ffff','--theme-entry-b':'#ff66cc','--theme-font-ui':'system-ui,Arial,sans-serif','--theme-font-title':'system-ui,Arial,sans-serif'},
    shader:{surface:[0.02,0.35,0.45],mid:[0.02,0.08,0.18],deep:[0.0,0.0,0.02],caustic:[0.0,1.0,1.0],bloom:1.4,causticAmt:1.6,sat:1.35,vignette:0.45,fx:0.85,fallback:'low',
      rgbTop:[0,60,80],rgbMid:[5,15,40],rgbBot:[0,0,8]},
    fpsBudget:{target:30,lowDeviceMaxFx:0.35}, a11y:{minContrast:4.5,minTapPx:48}, wave:1
  },
  'glass-lab': {
    id:'glass-lab', labelKey:'theme.glassLab',
    cssVars:{'--theme-bg':'#d8e8f4','--theme-panel':'rgba(255,255,255,.72)','--theme-border':'rgba(255,255,255,.85)','--theme-text':'#1a2a3a','--theme-muted':'#4a6070','--theme-accent':'#3a8ad0','--theme-card':'rgba(255,255,255,.55)','--theme-title':'#0a3a6a','--theme-entry-b':'#1a5080','--theme-font-ui':'system-ui,Arial,sans-serif','--theme-font-title':'system-ui,Arial,sans-serif'},
    shader:{surface:[0.72,0.88,0.95],mid:[0.45,0.65,0.78],deep:[0.22,0.35,0.48],caustic:[0.85,0.95,1.0],bloom:0.8,causticAmt:0.9,sat:0.9,vignette:0.2,fx:0.8,fallback:'low',
      rgbTop:[160,210,230],rgbMid:[90,140,170],rgbBot:[40,70,100]},
    fpsBudget:{target:30,lowDeviceMaxFx:0.4}, a11y:{minContrast:4.5,minTapPx:48}, wave:2
  },
  'cyberpunk-scanner': {
    id:'cyberpunk-scanner', labelKey:'theme.cyberpunk',
    cssVars:{'--theme-bg':'#050010','--theme-panel':'rgba(10,0,25,.92)','--theme-border':'#00ff66','--theme-text':'#d0ffe0','--theme-muted':'#66aa88','--theme-accent':'#ff00aa','--theme-card':'rgba(0,20,10,.8)','--theme-title':'#00ff88','--theme-entry-b':'#ff33aa','--theme-font-ui':'Consolas,monospace','--theme-font-title':'Consolas,monospace'},
    shader:{surface:[0.05,0.4,0.15],mid:[0.08,0.05,0.2],deep:[0.02,0.0,0.05],caustic:[0.2,1.0,0.4],bloom:1.3,causticAmt:1.4,sat:1.4,vignette:0.5,fx:0.9,fallback:'low',
      rgbTop:[10,80,40],rgbMid:[20,10,50],rgbBot:[5,0,15]},
    fpsBudget:{target:30,lowDeviceMaxFx:0.35}, a11y:{minContrast:4.5,minTapPx:48}, wave:2
  },
  'haeckel-watercolor': {
    id:'haeckel-watercolor', labelKey:'theme.haeckel',
    cssVars:{'--theme-bg':'#f3e6d0','--theme-panel':'#faf3e6','--theme-border':'#c4a882','--theme-text':'#3a2a18','--theme-muted':'#7a6040','--theme-accent':'#8a4a2a','--theme-card':'#fff8ec','--theme-title':'#5a3018','--theme-entry-b':'#6a4020','--theme-font-ui':'Georgia,serif','--theme-font-title':'Georgia,serif'},
    shader:{surface:[0.55,0.62,0.48],mid:[0.35,0.42,0.38],deep:[0.22,0.25,0.2],caustic:[0.85,0.75,0.45],bloom:0.5,causticAmt:0.6,sat:0.85,vignette:0.3,fx:0.75,fallback:'low',
      rgbTop:[140,160,120],rgbMid:[80,100,90],rgbBot:[50,55,45]},
    fpsBudget:{target:30,lowDeviceMaxFx:0.4}, a11y:{minContrast:4.5,minTapPx:48}, wave:3
  },
  engraving: {
    id:'engraving', labelKey:'theme.engraving',
    cssVars:{'--theme-bg':'#e8e0d0','--theme-panel':'#f5f0e6','--theme-border':'#2a2a2a','--theme-text':'#111','--theme-muted':'#555','--theme-accent':'#222','--theme-card':'#fffef8','--theme-title':'#000','--theme-entry-b':'#111','--theme-font-ui':'Georgia,Times,serif','--theme-font-title':'Georgia,Times,serif'},
    shader:{surface:[0.7,0.7,0.65],mid:[0.45,0.45,0.42],deep:[0.15,0.15,0.14],caustic:[0.85,0.85,0.8],bloom:0.2,causticAmt:0.35,sat:0.2,vignette:0.4,fx:0.6,fallback:'low',
      rgbTop:[170,170,160],rgbMid:[100,100,95],rgbBot:[35,35,32]},
    fpsBudget:{target:30,lowDeviceMaxFx:0.35}, a11y:{minContrast:4.5,minTapPx:48}, wave:3
  }
};

fs.mkdirSync('.04-Src/data/themes', { recursive: true });
for (const id of THEMES) {
  fs.writeFileSync(path.join('.04-Src/data/themes', id + '.json'), JSON.stringify(presets[id], null, 2) + '\n');
}
console.log('json', THEMES.length);

// --- theme_engine.js ---
const engine = `/* theme_engine.js — all approved visual themes bestiary+pond */
(function (w) {
  var LS_B = 'igs.theme.bestiary';
  var LS_P = 'igs.theme.pond';
  var LS_AB_B = 'igs.theme.ab.bestiary';
  var LS_AB_P = 'igs.theme.ab.pond';
  var THEMES = ${JSON.stringify(THEMES)};
  var LABELS = {classic:'Classic','phase-contrast':'Phase contrast','neon-bio':'Neon','glass-lab':'Glass lab','cyberpunk-scanner':'Cyberpunk','haeckel-watercolor':'Haeckel','engraving':'Engraving'};
  var cache = {};
  function lsGet(k) { try { return w.localStorage ? w.localStorage.getItem(k) : null; } catch (e) { return null; } }
  function lsSet(k, v) { try { if (w.localStorage) w.localStorage.setItem(k, v); } catch (e) {} }
  function hashAnon(s) { var h = 0, i; for (i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return Math.abs(h); }
  function ensureAnon() { var id = lsGet('igs.anon.id'); if (!id) { id = 'a' + Math.random().toString(36).slice(2) + Date.now().toString(36); lsSet('igs.anon.id', id); } return id; }
  function valid(id) { return id && THEMES.indexOf(id) >= 0 ? id : 'classic'; }
  function pickAb(screen) { var key = screen === 'pond' ? LS_AB_P : LS_AB_B; var existing = lsGet(key); if (existing && THEMES.indexOf(existing) >= 0) return existing; var anon = ensureAnon(); var th = THEMES[hashAnon(anon + ':' + screen) % THEMES.length]; lsSet(key, th); if (w.igsThemeAnalytics && w.igsThemeAnalytics.track) w.igsThemeAnalytics.track('theme_assign', { screen: screen, themeId: th, groupId: th }); return th; }
  function listThemes() { return THEMES.slice(); }
  function getTheme(id) { id = valid(id); return cache[id] || null; }
  function applyVars(el, vars) { if (!el || !vars) return; Object.keys(vars).forEach(function (k) { el.style.setProperty(k, vars[k]); }); }
  function syncShader(id) { var th = getTheme(id) || {}; w.__igsThemePondShader = th.shader || null; w.__igsThemePondId = id; if (typeof w.igsThemeApplyWebGL === 'function') try { w.igsThemeApplyWebGL(th.shader || {}); } catch (e) {} }
  function applyThemeBestiary(id) { id = valid(id); var prev = lsGet(LS_B) || 'classic'; lsSet(LS_B, id); var wiki = document.getElementById('wikiO'); if (wiki) { wiki.setAttribute('data-theme-bestiary', id); applyVars(wiki, (getTheme(id) || {}).cssVars); } ['themeSelBestiary','themeSelBestiarySet'].forEach(function(sid){ var sel=document.getElementById(sid); if(sel&&sel.value!==id) sel.value=id; }); if (prev !== id && w.igsThemeAnalytics && w.igsThemeAnalytics.track) w.igsThemeAnalytics.track('theme_change', { screen: 'bestiary', from: prev, to: id }); w.__igsThemeBestiary = id; return id; }
  function applyThemePond(id) { id = valid(id); var prev = lsGet(LS_P) || 'classic'; lsSet(LS_P, id); document.documentElement.setAttribute('data-theme-pond', id); applyVars(document.documentElement, (getTheme(id) || {}).cssVars); if (document.body) document.body.setAttribute('data-theme-pond', id); syncShader(id); ['themeSelPond','themeSelPondSet'].forEach(function(sid){ var sel=document.getElementById(sid); if(sel&&sel.value!==id) sel.value=id; }); if (prev !== id && w.igsThemeAnalytics && w.igsThemeAnalytics.track) w.igsThemeAnalytics.track('theme_change', { screen: 'pond', from: prev, to: id }); w.__igsThemePond = id; return id; }
  function currentBestiary() { return valid(lsGet(LS_B) || pickAb('bestiary')); }
  function currentPond() { return valid(lsGet(LS_P) || pickAb('pond')); }
  function themeLabel(tid) { var th = getTheme(tid) || {}; var lab = (typeof tt === 'function' && th.labelKey) ? tt(th.labelKey) : ''; if (!lab || lab === th.labelKey) return LABELS[tid] || tid; return lab; }
  function buildSelectHtml(id, screen, cur) { var label = screen === 'pond' ? (typeof tt === 'function' ? tt('theme.pond') : 'Pond style') : (typeof tt === 'function' ? tt('theme.bestiary') : 'Bestiary style'); var html = '<label class="theme-sel-wrap">'; html += '<span class="theme-sel-label">' + label + '</span>'; html += '<select id="' + id + '" data-theme-screen="' + screen + '" aria-label="' + label + '">'; THEMES.forEach(function (tid) { html += '<option value="' + tid + '"' + (tid === cur ? ' selected' : '') + '>' + themeLabel(tid) + '</option>'; }); html += '</select></label>'; return html; }
  function bindSelect(el) { if (!el || el.__igsThemeBound) return; el.__igsThemeBound = true; el.addEventListener('change', function () { var screen = el.getAttribute('data-theme-screen'); if (screen === 'pond') applyThemePond(el.value); else applyThemeBestiary(el.value); }); }
  function injectWikiSwitcher() { var wiki = document.getElementById('wikiO'); if (!wiki) return; if (!document.getElementById('themeSelBestiary')) { var wrap = document.createElement('div'); wrap.id = 'themeBestiaryBar'; wrap.innerHTML = buildSelectHtml('themeSelBestiary', 'bestiary', currentBestiary()); var ttEl = wiki.querySelector('.tt'); if (ttEl && ttEl.parentNode) ttEl.parentNode.insertBefore(wrap, ttEl.nextSibling); else wiki.insertBefore(wrap, wiki.firstChild); } else { var sel = document.getElementById('themeSelBestiary'); if (sel && sel.options.length !== THEMES.length) { var par = sel.parentNode; if (par) par.innerHTML = buildSelectHtml('themeSelBestiary', 'bestiary', currentBestiary()).replace(/^<label[^>]*>/,'').replace(/<\\/label>$/,''); } } bindSelect(document.getElementById('themeSelBestiary')); applyThemeBestiary(currentBestiary()); }
  function injectPondSwitcher() { var wrap = document.getElementById('themePondBar'); if (!wrap) { wrap = document.createElement('div'); wrap.id = 'themePondBar'; wrap.setAttribute('data-theme-pond-bar','1'); document.body.appendChild(wrap); } wrap.innerHTML = buildSelectHtml('themeSelPond', 'pond', currentPond()); bindSelect(document.getElementById('themeSelPond')); applyThemePond(currentPond()); }
  function settingsRowsHtml() { return '<div class="sr theme-set-row">' + buildSelectHtml('themeSelBestiarySet', 'bestiary', currentBestiary()) + '</div><div class="sr theme-set-row">' + buildSelectHtml('themeSelPondSet', 'pond', currentPond()) + '</div>'; }
  function bindSettingsSelects() { bindSelect(document.getElementById('themeSelBestiarySet')); bindSelect(document.getElementById('themeSelPondSet')); }
  function loadPresets(cb) { var left = THEMES.length; function doneOne(){ left--; if(!left && cb) cb(); } THEMES.forEach(function(id){ if(cache[id]){ doneOne(); return; } fetch('.04-Src/data/themes/' + id + '.json').then(function(r){ return r.json(); }).then(function(j){ cache[id]=j; doneOne(); }).catch(function(){ cache[id]={ id:id, labelKey:'theme.'+id, cssVars:{}, shader:{ fallback:'low' } }; doneOne(); }); }); }
  function readUrlThemes() { try { var q = new URLSearchParams(w.location.search); var p = q.get('themePond') || q.get('pondTheme') || q.get('theme'); var b = q.get('themeBestiary') || q.get('bestiaryTheme'); if (p && THEMES.indexOf(p) >= 0) lsSet(LS_P, p); if (b && THEMES.indexOf(b) >= 0) lsSet(LS_B, b); if (p && !b && THEMES.indexOf(p) >= 0) lsSet(LS_B, p); } catch (e) {} }
  var _fpsLowStreak = 0, _fpsWall = 0;
  function startFpsGate() {
    if (w.__igsThemeFpsGate) return; w.__igsThemeFpsGate = true; var last = performance.now();
    function tick(now) {
      var dt = now - last; last = now; var fps = 1000 / Math.max(dt, 0.001);
      var th = getTheme(currentPond()) || {}; var budget = (th.fpsBudget && th.fpsBudget.target) || 30; var maxFx = (th.fpsBudget && th.fpsBudget.lowDeviceMaxFx) || 0.4;
      if (fps < budget) { _fpsLowStreak++; _fpsWall += dt; } else { _fpsLowStreak = 0; _fpsWall = 0; }
      if (_fpsWall >= 3000) {
        var sh = Object.assign({}, th.shader || {}, { fallback: 'low', bloom: 0, causticAmt: 0, fx: maxFx });
        w.__igsThemePondShader = sh; if (typeof w.igsThemeApplyWebGL === 'function') w.igsThemeApplyWebGL(sh);
        _fpsLowStreak = 0; _fpsWall = 0;
        try { if (typeof toast === 'function') toast((typeof tt === 'function' ? tt('theme.fpsFallback') : 'Theme FX reduced')); } catch (e) {}
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function initThemes() { ensureAnon(); readUrlThemes(); loadPresets(function(){ if(!lsGet(LS_B)) pickAb('bestiary'); if(!lsGet(LS_P)) pickAb('pond'); injectPondSwitcher(); applyThemePond(currentPond()); applyThemeBestiary(currentBestiary()); startFpsGate(); }); }
  w.igsThemeEngine = { listThemes:listThemes, getTheme:getTheme, applyThemeBestiary:applyThemeBestiary, applyThemePond:applyThemePond, currentBestiary:currentBestiary, currentPond:currentPond, injectWikiSwitcher:injectWikiSwitcher, settingsRowsHtml:settingsRowsHtml, bindSettingsSelects:bindSettingsSelects, initThemes:initThemes, startFpsGate:startFpsGate, THEMES:THEMES, WAVE1:THEMES, _cache:cache, seedCache:function(id,j){ cache[id]=j; } };
})(typeof window !== 'undefined' ? window : globalThis);
`;
fs.writeFileSync('.04-Src/js/theme_engine.js', engine);
console.log('engine lines', engine.split(/\\n/).length);

console.log('presets+engine done');
