// demo.js — Demo gallery: free camera, numbered groups, click possess/release
// No tutorial. Organisms float in place by trophic group.

window.demoMode = false;
window.demoPossessed = null;

// Demo species labels — on unless the player explicitly stored "0"
window._demoLabels = (function(){
  try {
    var stored = localStorage.getItem('igraspore.demoLabels');
    if(typeof demoLabelsDefault === 'function') return demoLabelsDefault(stored);
    return stored !== '0';
  } catch(e){ return true; }
})();
window.setDemoLabels = function(on){
  window._demoLabels = !!on;
  try { localStorage.setItem('igraspore.demoLabels', on ? '1' : '0'); } catch(e){}
};

var DEMO_GROUPS = [
  { key: 'producer',   ru: '1. Продуценты',    en: '1. Producers',    color: '#4c4' },
  { key: 'consumer1',  ru: '2. Консументы I',  en: '2. Consumers I',  color: '#4af' },
  { key: 'consumer2',  ru: '3. Консументы II', en: '3. Consumers II', color: '#f80' },
  { key: 'consumer3',  ru: '4. Консументы III',en: '4. Consumers III',color: '#c4f' },
  { key: 'decomposer', ru: '5. Редуценты',     en: '5. Decomposers',  color: '#a84' },
  { key: 'virus',      ru: '6. Вирусы',        en: '6. Viruses',      color: '#f66' }
];

function startDemoMode() {
  window.demoMode = true;
  window.demoPossessed = null;
  window.spectatorMode = true;
  window.screensaverAutoCam = false;
  freeCam = true;
  autoAI = false;

  try { window.initAudio && window.initAudio(); } catch (e) {}

  // Clean world without normal startGame tutorial path
  initWorld();
  tod = 10.5;
  season = 1;
  dayLight = 0.95;
  try { if (typeof updateTodUI === 'function') updateTodUI(); } catch (e) {}

  // Wipe random spawns — rebuild gallery layout
  orgs = [];
  viruses = [];
  parts = [];
  player = null;

  var rowY0 = 30;
  var rowGap = 110;
  var colGap = 55;
  var maxPerRow = 13;

  for (var g = 0; g < DEMO_GROUPS.length; g++) {
    var grp = DEMO_GROUPS[g];
    var pool = [];
    for (var si = 0; si < SPECIES_DB.length; si++) {
      var sp = SPECIES_DB[si];
      if (!sp || sp.cat !== grp.key) continue;
      // Include ALL species — even colonies (Volvox, Pandorina etc are playable in demo)
      pool.push(sp);
    }
    // At least one placeholder if pool empty
    if (!pool.length) {
      for (var sj = 0; sj < SPECIES_DB.length; sj++) {
        if (SPECIES_DB[sj].cat === grp.key) { pool.push(SPECIES_DB[sj]); break; }
      }
    }
    // Show ALL species in gallery (not capped at 10)
    // maxPerRow used for row wrapping only
    var displayPool = pool;

    var displayCount = pool.length;
    if (!displayCount) continue; // viruses are pinned separately
    // If too many, use two sub-rows
    var perSubRow = Math.min(displayCount, maxPerRow);
    var subRows = Math.ceil(displayCount / perSubRow);

    for (var i = 0; i < displayCount; i++) {
      var subRow = Math.floor(i / perSubRow);
      var colInRow = i % perSubRow;
      var subRowOffset = subRow * 35;
      var y = rowY0 + g * rowGap + subRowOffset;
      var totalW = (Math.min(displayCount - subRow * perSubRow, perSubRow) - 1) * colGap;
      var x0 = -totalW / 2;
      var x = x0 + colInRow * colGap;
      // slight vertical jitter so row isn't a perfect line of "shadows"
      var yy = y + ((i % 3) - 1) * 8;
      var o = spawnOrg(pool[i], x, yy, false);
      if (!o) continue;
      o.demoPinned = true;
      o.demoGroup = g + 1;
      o.demoGroupKey = grp.key;
      o.demoLabel = (curLang === 'en' ? grp.en : grp.ru);
      // Continuous species number (same as menu #N), not per-row index
      o.demoIndex = (pool[i] && typeof pool[i].num === 'number') ? pool[i].num : (i + 1);
      o.demoSpNum = o.demoIndex;
      // Colonies must be obviously visible in gallery (use o.sp — not outer-loop sp)
      if(o.sp && (o.sp.shape==='colony' || (o.sp.bio && o.sp.bio.colony))){
        o.size = Math.max(o.size||0, 10);
        o.birthSize = o.size;
        o.sizeMult = 1;
        o.demoColony = true;
      }
      o.vx = 0; o.vy = 0;
      o.energy = 90;
      o.facing = 0;
      o.angle = 0;
      o.aiTarget = null;
      o.state = 'idle';
      // gentle idle wobble only (no travel)
      o.demoBobPhase = Math.random() * Math.PI * 2;
      o.x = x; o.y = yy;
      o.demoHomeX = x;
      o.demoHomeY = yy;
      o.sessileHome = {x:x, y:yy};
      o.invuln = 9999;
    }
  }

  // Camera overview
  cam.x = 0;
  cam.y = rowY0 + (DEMO_GROUPS.length - 1) * rowGap * 0.45;
  zoom = 1.05;
  tZoom = 1.05;
  window._demoFly = null;
  freeCam = true;
  window.lastInteractionTime = Date.now();
  window.screensaverAutoCam = false;
  window.focusTarget = null;
  gt = 0;
  try { if(typeof placeDemoViruses === 'function') placeDemoViruses(); } catch(_dv){}

  state = 'playing';
  try {
    document.getElementById('menuO').className = 'ov';
    var p = document.getElementById('pauseO'); if (p) p.className = 'ov';
    // Show action bar + render mode controls (same as startGame)
    var ab = document.getElementById('actBar'); if(ab) ab.style.display='flex';
    if (typeof window.measureActbarH === 'function') { window.measureActbarH(); setTimeout(window.measureActbarH, 120); }
    var rb = document.getElementById('renderModeBtn'); if(rb) rb.style.display='block';
    var tr = document.getElementById('topR'); if(tr) tr.style.display='block';
    var wp = document.getElementById('weatherP'); if(wp) wp.style.display='block';
    // Apply current render mode button label
    if (typeof applyRenderMode === 'function') applyRenderMode();
    // keyHint: session-only collapsed override — LS untouched (restored on demo exit)
    try {
      window._keyHintCollapsed = true;
      if (typeof window.buildKeyHint === 'function') window.buildKeyHint();
    } catch (e2) {}
    document.body.classList.add('demo-on');
  } catch (e) {}

  // HUD: free-cam controls tip (positioned by CSS above the actBar band)
  try {
    var tip = document.getElementById('demoTip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'demoTip';
      tip.style.cssText = 'background:rgba(0,12,28,0.82);color:#cfe;border:1px solid #4af;border-radius:8px;' +
        'padding:10px 12px;font:13px/1.35 system-ui,sans-serif;pointer-events:none';
      document.body.appendChild(tip);
    }
    tip.style.pointerEvents = 'auto';
    tip.style.display = 'block';
    var ru = (typeof curLang === 'undefined' || curLang !== 'en');
    var nav = '';
    for (var gi = 0; gi < DEMO_GROUPS.length; gi++) {
      nav += '<button type="button" data-dg="'+(gi+1)+'" style="margin:2px 2px 0 0;padding:3px 7px;font:11px/1.2 system-ui;background:#123;color:#cfe;border:1px solid #4af;border-radius:5px;cursor:pointer">'+(gi+1)+'</button>';
    }
    var labelsBtn = '<button type="button" id="demoLabelsBtn" aria-pressed="'+(window._demoLabels?'true':'false')+'" style="margin:2px 0 0 2px;padding:3px 9px;font:700 11px/1.2 system-ui;background:'+(window._demoLabels?'#1a4':'#123')+';color:'+(window._demoLabels?'#fff':'#cfe')+';border:1px solid '+(window._demoLabels?'#4f8':'#4af')+';border-radius:5px;cursor:pointer">'+(ru?'Метки':'Labels')+'</button>';
    tip.innerHTML = (ru
      ? '<b>\u0414\u0415\u041c\u041e</b> \u00b7 WASD/mouse fly \u00b7 1-5 group \u00b7 click = take<br>'
      : '<b>DEMO</b> \u00b7 WASD/mouse fly \u00b7 1-5 jump group \u00b7 click = possess<br>') + nav + labelsBtn;
    tip.onclick = function(ev){
      var b = ev.target;
      if(!b || !b.getAttribute) return;
      if (b.id === 'demoLabelsBtn') {
        window.setDemoLabels(!window._demoLabels);
        b.setAttribute('aria-pressed', window._demoLabels ? 'true' : 'false');
        b.textContent = ru ? 'Метки' : 'Labels';
        b.style.background = window._demoLabels ? '#1a4' : '#123';
        b.style.color = window._demoLabels ? '#fff' : '#cfe';
        b.style.borderColor = window._demoLabels ? '#4f8' : '#4af';
        return;
      }
      var g = parseInt(b.getAttribute('data-dg'),10);
      if(g) demoFlyToGroup(g);
    };
    // measured height → --demohud-h, so #hDivReady sits strictly above the demo HUD
    try {
      document.documentElement.style.setProperty('--demohud-h', Math.ceil(tip.offsetHeight || 54) + 'px');
    } catch (e2) {}
  } catch (e) {}

  // Never start tutorial in demo
  try {
    localStorage.setItem('igraspore_tut_v2', '1');
  } catch (e) {}
}

function exitDemoPossess() {
  if (!window.demoMode) return;
  if (player) {
    player.isPlayer = false;
    player.demoPinned = true;
    player.invuln = 9999;
    player.vx = 0; player.vy = 0;
    if (player.demoHomeX != null) { player.x = player.demoHomeX; player.y = player.demoHomeY; }
  }
  player = null;
  window.demoPossessed = null;
  window.spectatorMode = true;
  freeCam = true;
  autoAI = false;
}

function demoPossessOrg(o) {
  if (!window.demoMode || !o || !o.alive) return;
  // Release previous
  if (player && player !== o) {
    player.isPlayer = false;
    player.demoPinned = true;
    player.vx = 0; player.vy = 0;
    if (player.demoHomeX != null) {
      player.x = player.demoHomeX;
      player.y = player.demoHomeY;
    }
  }
  // Toggle off if same
  if (window.demoPossessed === o) {
    exitDemoPossess();
    return;
  }
  o.isPlayer = true;
  o.demoPinned = false;
  o.energy = Math.max(o.energy, 85);
  o.invuln = 9999;
  if(o.demoHomeX != null) o.sessileHome = {x:o.demoHomeX, y:o.demoHomeY};
  if(o.y > 800 && o.demoHomeY != null) { o.x = o.demoHomeX; o.y = o.demoHomeY; }
  o.cyst = false; o.cystT = 0; // clear any dormant state
  o.vx = 0; o.vy = 0;
  player = o;
  window.demoPossessed = o;
  window.spectatorMode = false;
  freeCam = false;
  autoAI = false;
  try{ camKeys={w:false,a:false,s:false,d:false}; }catch(_e){}
  try{ if(typeof keys==='object'){ for(var _k in keys) keys[_k]=false; } }catch(_e){}
  cam.x = o.x;
  cam.y = o.y - 10;
  tZoom = Math.max(zoom, 1.2);
  if(window.showToast) window.showToast('Управление: WASD / мышь · ЕСТЬ (E) · ДЕЛИТЬ (Q)','#4cf');
}

function demoPickAtScreen(sx, sy) {
  // Convert screen → world
  var wx = cam.x + (sx - cv.width / 2) / zoom;
  var wy = cam.y + (sy - cv.height / 2) / zoom;
  var best = null, bestD = 1e18;
  for (var i = 0; i < orgs.length; i++) {
    var o = orgs[i];
    if (!o || !o.alive) continue;
    var dx = o.x - wx, dy = o.y - wy;
    var r = (o.size || 8) * 2.5 + 16 / Math.max(0.5, zoom);
    var d2 = dx * dx + dy * dy;
    if (d2 < r * r && d2 < bestD) { bestD = d2; best = o; }
  }
  return best;
}

function updateDemoPinned(dt) {
  if (!window.demoMode) return;
  // Lock daytime — demo is always noon (no night starvation)
  dayLight = 0.95;
  tod = 12;
  // Remove any non-gallery organisms that slipped in
  for (var k = orgs.length - 1; k >= 0; k--) {
    var ok = orgs[k];
    if (ok && !ok.demoGroup && !ok.isPlayer) {
      ok.alive = false;
      orgs.splice(k, 1);
    }
  }
  for (var i = 0; i < orgs.length; i++) {
    var o = orgs[i];
    if (!o || !o.alive) continue;
    if (o.demoGroup) o.invuln = 9999;
    if (!o.demoPinned) continue;
    // Stay home with tiny bob — no travel, no AI drift
    o.demoBobPhase = (o.demoBobPhase || 0) + dt * 1.2;
    o.x = o.demoHomeX;
    o.y = o.demoHomeY + Math.sin(o.demoBobPhase) * 2.2;
    o.vx = 0;
    o.vy = 0;
    if(o.demoColony || (o.sp && o.sp.shape==='colony')){
      o.size = Math.max(o.size||0, 10);
      o.demoColony = true;
    }
    o.energy = Math.min(100, (o.energy || 80) + dt * 2); // keep alive
    o.state = 'idle';
    o.aiTarget = null;
  }
}

function renderDemoLabels() {
  if (!window.demoMode) return;
  ctx.save();
  var showLabels = !!window._demoLabels;
  // Group banners + per-organism index — only when labels are toggled ON (UI-RESTORE §5.4)
  var drawnGroup = {};
  for (var i = 0; i < orgs.length; i++) {
    var o = orgs[i];
    if (!o || !o.alive) continue;
    var scx = (o.x - cam.x) * zoom + cv.width / 2;
    var scy = (o.y - cam.y) * zoom + cv.height / 2;
    if (scx < -40 || scx > cv.width + 40 || scy < -40 || scy > cv.height + 40) continue;

    if (showLabels) {
      // Group header once per group near leftmost of group
      var g = o.demoGroup || 0;
      if (g && !drawnGroup[g]) {
        drawnGroup[g] = true;
        // find leftmost of this group for label anchor
        var minX = o.x, anchorY = o.y;
        for (var j = 0; j < orgs.length; j++) {
          var o2 = orgs[j];
          if (o2 && o2.alive && o2.demoGroup === g && o2.x < minX) {
            minX = o2.x; anchorY = o2.y;
          }
        }
        var hx = (minX - cam.x) * zoom + cv.width / 2 - 20;
        var hy = (anchorY - cam.y) * zoom + cv.height / 2 - Math.max(28, (o.size || 8) * zoom + 18);
        var label = o.demoLabel || ('#' + g);
        var col = (DEMO_GROUPS[g - 1] && DEMO_GROUPS[g - 1].color) || '#8ef';
        ctx.font = 'bold ' + Math.max(12, Math.min(18, 14 * Math.sqrt(zoom))) + 'px system-ui,sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = 'rgba(0,10,20,0.7)';
        var tw = ctx.measureText(label).width + 12;
        ctx.fillRect(hx - 4, hy - 18, tw, 22);
        ctx.fillStyle = col;
        ctx.fillText(label, hx, hy);
      }

      // Small index under each cell
      if (o.demoIndex) {
        // сквозной номер вида: #12
        var num = '#' + String(o.demoSpNum || o.demoIndex);
        ctx.font = 'bold ' + Math.max(10, Math.min(15, 12 * Math.sqrt(zoom))) + 'px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        var ty = scy + (o.size || 8) * zoom + 4;
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillText(num, scx + 1, ty + 1);
        ctx.fillStyle = (o.isPlayer ? '#4ff' : '#e8fff0');
        ctx.fillText(num, scx, ty);
        // short name under number (+ КОЛОНИЯ tag)
        if (zoom >= 0.7 && o.sp && o.sp.name) {
          var short = o.sp.name.split(' ')[0];
          if(o.demoColony || o.sp.shape==='colony') short = '⬡КОЛОНИЯ ' + short;
          ctx.font = Math.max(8, Math.min(11, 9 * Math.sqrt(zoom))) + 'px system-ui,sans-serif';
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.fillText(short, scx + 1, ty + 14);
          ctx.fillStyle = (o.demoColony||o.sp.shape==='colony') ? '#8f8' : 'rgba(200,230,255,0.85)';
          ctx.fillText(short, scx, ty + 13);
        }
      }
    }

    // Possessed: simple thin ring (not the "lens" spam) — drawn even with labels off
    if (o.isPlayer) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(80,255,255,0.85)';
      ctx.lineWidth = 2;
      ctx.arc(scx, scy, (o.size || 8) * zoom + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// Free-cam movement in demo (even without player)
function demoFlyToGroup(g) {
  if (!window.demoMode) return;
  g = parseInt(g, 10);
  if (!(g >= 1 && g <= DEMO_GROUPS.length)) return;
  var sx = 0, sy = 0, n = 0;
  for (var i = 0; i < orgs.length; i++) {
    var o = orgs[i];
    if (o && o.alive && o.demoGroup === g) { sx += o.x; sy += o.y; n++; }
  }
  if (typeof viruses !== 'undefined') {
    for (var vi = 0; vi < viruses.length; vi++) {
      var vv = viruses[vi];
      if (vv && vv.demoGroup === g) { sx += vv.x; sy += vv.y; n++; }
    }
  }
  if (!n) return;
  if (typeof exitDemoPossess === 'function' && window.demoPossessed) exitDemoPossess();
  freeCam = true;
  window._demoFly = { x: sx / n, y: sy / n, t: 0 };
  if (window.showToast) window.showToast((DEMO_GROUPS[g-1] && (curLang==='en'?DEMO_GROUPS[g-1].en:DEMO_GROUPS[g-1].ru)) || ('#'+g), '#8cf');
}

function updateDemoCamera(dt) {
  if (!window.demoMode) return;
  var fly = window._demoFly;
  if (fly) {
    fly.t += dt || 0.016;
    var k = Math.min(1, fly.t * 3.2);
    cam.x += (fly.x - cam.x) * k;
    cam.y += (fly.y - cam.y) * k;
    if (k >= 1 || (Math.abs(cam.x - fly.x) < 3 && Math.abs(cam.y - fly.y) < 3)) window._demoFly = null;
    return;
  }
  if (!freeCam && player && player.alive) return;
  var spd = 280 / Math.max(0.35, zoom);
  var kk = (typeof keys !== 'undefined') ? keys : {};
  var ck = (typeof camKeys !== 'undefined') ? camKeys : {};
  if (kk['w'] || kk['arrowup'] || ck.w) cam.y -= spd * dt;
  if (kk['s'] || kk['arrowdown'] || ck.s) cam.y += spd * dt;
  if (kk['a'] || kk['arrowleft'] || ck.a) cam.x -= spd * dt;
  if (kk['d'] || kk['arrowright'] || ck.d) cam.x += spd * dt;
  if (typeof clamp === 'function') {
    cam.y = clamp(cam.y, -80, (typeof PD === 'number' ? PD : 2000) * 0.85);
    cam.x = clamp(cam.x, -((typeof PW === 'number' ? PW : 5000) * 0.6), (typeof PW === 'number' ? PW : 5000) * 0.6);
  }
}

window.startDemoMode = startDemoMode;
window.exitDemoPossess = exitDemoPossess;
window.demoPossessOrg = demoPossessOrg;
window.demoPickAtScreen = demoPickAtScreen;
window.updateDemoPinned = updateDemoPinned;
window.renderDemoLabels = renderDemoLabels;
window.updateDemoCamera = updateDemoCamera;
window.demoFlyToGroup = demoFlyToGroup;


function bindDemoButton(){
  var b = document.getElementById('demoBtn');
  if(!b) return;
  b.onclick = function(){ startDemoMode(); };
  // RU/EN label
  try {
    b.textContent = (typeof curLang!=='undefined' && curLang==='en') ? 'DEMO / Gallery' : 'ДЕМО / Галерея';
  } catch(e){}
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', bindDemoButton);
} else {
  bindDemoButton();
}
// Late bind (main_events may overwrite later)
setTimeout(bindDemoButton, 0);
setTimeout(bindDemoButton, 500);
window.bindDemoButton = bindDemoButton;
