/* theme_engine.js — all approved visual themes bestiary+pond */
(function (w) {
  var LS_B = 'igs.theme.bestiary';
  var LS_P = 'igs.theme.pond';
  var LS_AB_B = 'igs.theme.ab.bestiary';
  var LS_AB_P = 'igs.theme.ab.pond';
  var THEMES = ["classic","phase-contrast","neon-bio","glass-lab","cyberpunk-scanner","haeckel-watercolor","engraving"];
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
  function syncShader(id) { var th = getTheme(id) || {}; w.__igsThemePondShader = th.shader || null; w.__igsThemePondId = id; var _dark={'neon-bio':0.42,'cyberpunk-scanner':0.28,'phase-contrast':0.55,'engraving':0.5,'haeckel-watercolor':0.75,'glass-lab':0.9,'classic':null}; w.__igsThemeDayLight=(_dark[id]!=null?_dark[id]:null); if (typeof w.igsThemeApplyWebGL === 'function') try { w.igsThemeApplyWebGL(th.shader || {}); } catch (e) {} }
  function applyThemeBestiary(id) { id = valid(id); var prev = lsGet(LS_B) || 'classic'; lsSet(LS_B, id); var wiki = document.getElementById('wikiO'); if (wiki) { wiki.setAttribute('data-theme-bestiary', id); applyVars(wiki, (getTheme(id) || {}).cssVars); } ['themeSelBestiary','themeSelBestiarySet'].forEach(function(sid){ var sel=document.getElementById(sid); if(sel&&sel.value!==id) sel.value=id; }); if (prev !== id && w.igsThemeAnalytics && w.igsThemeAnalytics.track) w.igsThemeAnalytics.track('theme_change', { screen: 'bestiary', from: prev, to: id }); w.__igsThemeBestiary = id; try{ if(typeof w.igsThemeWikiEnhance==='function') w.igsThemeWikiEnhance(); }catch(e){} return id; }
  function applyThemePond(id) { id = valid(id); var prev = lsGet(LS_P) || 'classic'; lsSet(LS_P, id); document.documentElement.setAttribute('data-theme-pond', id); applyVars(document.documentElement, (getTheme(id) || {}).cssVars); if (document.body) document.body.setAttribute('data-theme-pond', id); syncShader(id); ['themeSelPond','themeSelPondSet'].forEach(function(sid){ var sel=document.getElementById(sid); if(sel&&sel.value!==id) sel.value=id; }); if (prev !== id && w.igsThemeAnalytics && w.igsThemeAnalytics.track) w.igsThemeAnalytics.track('theme_change', { screen: 'pond', from: prev, to: id }); w.__igsThemePond = id; try{ if(id==='neon-bio'){ if(typeof settings!=='undefined'&&settings){ settings.renderMode='swiss'; window._swissStrict=true; } if(typeof cam!=='undefined'&&cam&&typeof PD==='number'){ if(cam.y<PD*0.28) cam.y=PD*0.42; } if(typeof tZoom==='number'&&tZoom>3.2){ tZoom=2.4; } if(typeof zoom==='number'&&zoom>3.2){ zoom=2.4; } } }catch(_z){} return id; }
  function currentBestiary() { return valid(lsGet(LS_B) || pickAb('bestiary')); }
  function currentPond() { return valid(lsGet(LS_P) || pickAb('pond')); }
  function themeLabel(tid) { var th = getTheme(tid) || {}; var lab = (typeof tt === 'function' && th.labelKey) ? tt(th.labelKey) : ''; if (!lab || lab === th.labelKey) return LABELS[tid] || tid; return lab; }
  function buildSelectHtml(id, screen, cur) { var label = screen === 'pond' ? (typeof tt === 'function' ? tt('theme.pond') : 'Pond style') : (typeof tt === 'function' ? tt('theme.bestiary') : 'Bestiary style'); var html = '<label class="theme-sel-wrap">'; html += '<span class="theme-sel-label">' + label + '</span>'; html += '<select id="' + id + '" data-theme-screen="' + screen + '" aria-label="' + label + '">'; THEMES.forEach(function (tid) { html += '<option value="' + tid + '"' + (tid === cur ? ' selected' : '') + '>' + themeLabel(tid) + '</option>'; }); html += '</select></label>'; return html; }
  function bindSelect(el) { if (!el || el.__igsThemeBound) return; el.__igsThemeBound = true; el.addEventListener('change', function () { var screen = el.getAttribute('data-theme-screen'); if (screen === 'pond') applyThemePond(el.value); else applyThemeBestiary(el.value); }); }
  function injectWikiSwitcher() { var wiki = document.getElementById('wikiO'); if (!wiki) return; if (!document.getElementById('themeSelBestiary')) { var wrap = document.createElement('div'); wrap.id = 'themeBestiaryBar'; wrap.innerHTML = buildSelectHtml('themeSelBestiary', 'bestiary', currentBestiary()); var ttEl = wiki.querySelector('.tt'); if (ttEl && ttEl.parentNode) ttEl.parentNode.insertBefore(wrap, ttEl.nextSibling); else wiki.insertBefore(wrap, wiki.firstChild); } else { var sel = document.getElementById('themeSelBestiary'); if (sel && sel.options.length !== THEMES.length) { var par = sel.parentNode; if (par) par.innerHTML = buildSelectHtml('themeSelBestiary', 'bestiary', currentBestiary()).replace(/^<label[^>]*>/,'').replace(/<\/label>$/,''); } } bindSelect(document.getElementById('themeSelBestiary')); applyThemeBestiary(currentBestiary()); }
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
  function initThemes() { try{ if(w.__IGS_FORCE_THEME__){ lsSet(LS_P,w.__IGS_FORCE_THEME__); lsSet(LS_B,w.__IGS_FORCE_THEME__); } }catch(_f){} ensureAnon(); readUrlThemes(); loadPresets(function(){ if(!lsGet(LS_B)) pickAb('bestiary'); if(!lsGet(LS_P)) pickAb('pond'); injectPondSwitcher(); applyThemePond(currentPond()); applyThemeBestiary(currentBestiary()); startFpsGate(); }); }
  w.igsThemeEngine = { listThemes:listThemes, getTheme:getTheme, applyThemeBestiary:applyThemeBestiary, applyThemePond:applyThemePond, currentBestiary:currentBestiary, currentPond:currentPond, injectWikiSwitcher:injectWikiSwitcher, settingsRowsHtml:settingsRowsHtml, bindSettingsSelects:bindSettingsSelects, initThemes:initThemes, startFpsGate:startFpsGate, THEMES:THEMES, WAVE1:THEMES, _cache:cache, seedCache:function(id,j){ cache[id]=j; } };
})(typeof window !== 'undefined' ? window : globalThis);
