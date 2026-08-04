// demo.js — Demo gallery: free camera, numbered groups, click possess/release
// No tutorial. Organisms float in place by trophic group.

window.demoMode = false;
window.demoPossessed = null;

var DEMO_GROUPS = [
  { key: 'producer',   ru: '1. Продуценты',    en: '1. Producers',    color: '#4c4' },
  { key: 'consumer1',  ru: '2. Консументы I',  en: '2. Consumers I',  color: '#4af' },
  { key: 'consumer2',  ru: '3. Консументы II', en: '3. Consumers II', color: '#f80' },
  { key: 'consumer3',  ru: '4. Консументы III',en: '4. Consumers III',color: '#c4f' },
  { key: 'decomposer', ru: '5. Редуценты',     en: '5. Decomposers',  color: '#a84' }
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
      o.demoIndex = i + 1;
      o.vx = 0; o.vy = 0;
      o.energy = 90;
      o.facing = 0;
      o.angle = 0;
      o.aiTarget = null;
      o.state = 'idle';
      // gentle idle wobble only (no travel)
      o.demoBobPhase = Math.random() * Math.PI * 2;
      o.demoHomeX = x;
      o.demoHomeY = yy;
    }
  }

  // Camera overview
  cam.x = 0;
  cam.y = rowY0 + (DEMO_GROUPS.length - 1) * rowGap * 0.45;
  zoom = 0.75;
  tZoom = 0.75;
  window.lastInteractionTime = Date.now();
  window.screensaverAutoCam = false;
  window.focusTarget = null;
  gt = 0;

  state = 'playing';
  try {
    document.getElementById('menuO').className = 'ov';
    var p = document.getElementById('pauseO'); if (p) p.className = 'ov';
  } catch (e) {}

  // HUD: free-cam controls tip
  try {
    var tip = document.getElementById('demoTip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'demoTip';
      tip.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:50;max-width:340px;' +
        'background:rgba(0,12,28,0.82);color:#cfe;border:1px solid #4af;border-radius:8px;' +
        'padding:10px 12px;font:13px/1.35 system-ui,sans-serif;pointer-events:none';
      document.body.appendChild(tip);
    }
    tip.style.display = 'block';
    tip.innerHTML = (curLang === 'en'
      ? '<b>DEMO</b> · WASD/arrows camera · wheel zoom · <b>click</b> possess · click again / Esc release · F free cam'
      : '<b>ДЕМО</b> · WASD/стрелки камера · колёсико зум · <b>клик</b> взять · ещё клик / Esc отпустить · F свободная камера');
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
  o.demoPinned = false; // allow movement while possessed
  o.energy = Math.max(o.energy, 80);
  player = o;
  window.demoPossessed = o;
  window.spectatorMode = false;
  freeCam = false;
  cam.x = o.x;
  cam.y = o.y;
  tZoom = Math.max(zoom, 1.2);
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
    var r = (o.size || 8) * 1.15 + 6 / Math.max(0.5, zoom);
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
    if (!o || !o.alive || !o.demoPinned) continue;
    // Stay home with tiny bob — no travel, no AI drift
    o.demoBobPhase = (o.demoBobPhase || 0) + dt * 1.2;
    o.x = o.demoHomeX;
    o.y = o.demoHomeY + Math.sin(o.demoBobPhase) * 2.2;
    o.vx = 0;
    o.vy = 0;
    o.energy = Math.min(100, (o.energy || 80) + dt * 2); // keep alive
    o.state = 'idle';
    o.aiTarget = null;
  }
}

function renderDemoLabels() {
  if (!window.demoMode) return;
  ctx.save();
  // Group banners + per-organism index
  var drawnGroup = {};
  for (var i = 0; i < orgs.length; i++) {
    var o = orgs[i];
    if (!o || !o.alive) continue;
    var scx = (o.x - cam.x) * zoom + cv.width / 2;
    var scy = (o.y - cam.y) * zoom + cv.height / 2;
    if (scx < -40 || scx > cv.width + 40 || scy < -40 || scy > cv.height + 40) continue;

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
      var num = String(o.demoGroup || '') + '.' + String(o.demoIndex);
      ctx.font = 'bold ' + Math.max(10, Math.min(14, 11 * Math.sqrt(zoom))) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillText(num, scx + 1, scy + (o.size || 8) * zoom + 5);
      ctx.fillStyle = (o.isPlayer ? '#4ff' : '#def');
      ctx.fillText(num, scx, scy + (o.size || 8) * zoom + 4);
    }

    // Possessed: simple thin ring (not the "lens" spam)
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
function updateDemoCamera(dt) {
  if (!window.demoMode) return;
  if (!freeCam && player && player.alive) return; // follow player while possessed
  var spd = 220 / Math.max(0.35, zoom);
  if (typeof keys !== 'undefined') {
    if (keys['w'] || keys['arrowup']) cam.y -= spd * dt;
    if (keys['s'] || keys['arrowdown']) cam.y += spd * dt;
    if (keys['a'] || keys['arrowleft']) cam.x -= spd * dt;
    if (keys['d'] || keys['arrowright']) cam.x += spd * dt;
  }
  // Soft bounds
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
