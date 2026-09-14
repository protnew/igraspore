/* iGraSpore Mobile Touch Layer v3.0 — fixed joy zone, menu, taps */
(function(){
  'use strict';

  var MOBILE = window.matchMedia('(max-width: 900px)').matches ||
               window.matchMedia('(pointer: coarse)').matches ||
               ('ontouchstart' in window && window.innerWidth < 900) ||
               (location.search.indexOf('source=apk') >= 0) ||
               (location.search.indexOf('source=twa') >= 0) ||
               (location.search.indexOf('source=pwa') >= 0);
  if (!MOBILE) { console.log('[Mobile] Desktop detected, skipping'); return; }

  document.documentElement.classList.add('is-mobile');
  document.body.classList.add('is-mobile');

  // ---- 1. CSS ----
  var css = document.createElement('style');
  css.id = 'mobileCSS';
  css.textContent = [
    '.is-mobile #actBar{display:none!important}',
    '.is-mobile #keyHint{display:none!important}',
    '.is-mobile #spdBar{display:none!important}',
    '.is-mobile #sandboxTools{display:none!important}',
    '.is-mobile #leaderboardO{display:none!important}',
    '.is-mobile #leftContainer{display:none!important}',
    '.is-mobile #renderModeBtn{font-size:10px!important;padding:3px 6px!important;top:2px!important;right:4px!important;max-width:90px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;z-index:60!important}',
    '.is-mobile #mmWrap{width:64px!important;bottom:4px!important;right:4px!important;opacity:0.75!important}.is-mobile #mm{width:64px!important;height:44px!important}',
    '.is-mobile #pcWrap{width:64px!important;bottom:52px!important;right:4px!important;opacity:0.75!important}.is-mobile #pc{width:64px!important;height:32px!important}',
    '.is-mobile #hud{font-size:9px!important;padding:2px 4px!important}',
    '.is-mobile #hud .p,.is-mobile #ecoP,.is-mobile #legP,.is-mobile #topR,.is-mobile #weatherP{font-size:9px!important;padding:2px 3px!important;max-width:140px!important}',
    '.is-mobile #topR{top:2px!important;right:4px!important}',
    '.is-mobile #weatherP{top:30px!important;right:4px!important}',
    '.is-mobile #scaleBar{font-size:9px!important;bottom:54px!important}',
    '.is-mobile #camM{font-size:9px!important;top:2px!important}',
    '.is-mobile #todWrap{font-size:9px!important;top:22px!important}',
    '.is-mobile #tip{font-size:11px!important;max-width:88vw!important;z-index:80!important;pointer-events:none!important}',
    '.is-mobile #hDivReady{font-size:9px!important;max-width:120px!important}',
    '.is-mobile .ov{width:94vw!important;max-width:94vw!important;padding:8px!important;max-height:92vh!important;overflow-y:auto!important;z-index:200!important}',
    '.is-mobile .tt{font-size:16px!important}',
    '.is-mobile .scrollbox{max-height:35vh!important}',
    '.is-mobile #spGrid{grid-template-columns:repeat(auto-fill,minmax(70px,1fr))!important;gap:3px!important}',
    '.is-mobile #spGrid>div{font-size:8px!important;padding:3px!important}',
    '.is-mobile .btn{font-size:13px!important;padding:8px 12px!important}',
    '.is-mobile #diffWrap{font-size:11px!important}',
    '.is-mobile #catSel{font-size:10px!important;gap:3px!important}',
    '.is-mobile #foodChainBar{font-size:7px!important;padding:3px!important}',
    '.is-mobile .sb2{flex-direction:column!important;gap:4px!important}',
    '.is-mobile #startBtn{font-size:15px!important;padding:10px 20px!important}',
    /* Joystick: ONLY small corner pad — does NOT block organism taps */
    '#mJoy{position:fixed;left:8px;bottom:8px;width:130px;height:130px;z-index:50;touch-action:none;border-radius:50%;background:rgba(0,30,50,0.12);border:1px solid rgba(100,180,255,0.12)}',
    '#mJoyB{position:fixed;width:80px;height:80px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.15);background:rgba(0,20,40,0.15);z-index:51;display:none;pointer-events:none;transform:translate(-50%,-50%)}',
    '#mJoyK{position:fixed;width:36px;height:36px;border-radius:50%;background:rgba(100,200,255,0.25);border:1.5px solid rgba(150,220,255,0.4);z-index:52;display:none;pointer-events:none;transform:translate(-50%,-50%)}',
    '#mActs{position:fixed;right:4px;bottom:4px;z-index:50;display:flex;flex-direction:column;gap:4px}',
    '#mActs .ma{width:48px;height:48px;border-radius:12px;background:rgba(0,25,50,0.65);border:1px solid rgba(100,180,255,0.35);color:rgba(180,220,255,0.95);font-size:18px;font-weight:bold;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation;backdrop-filter:blur(2px)}',
    '#mActs .ma:active{background:rgba(40,100,180,0.5);transform:scale(0.9)}',
    '#mTop{position:fixed;top:4px;left:4px;z-index:90;display:flex;gap:4px}',
    '#mTop .ma{width:auto;min-width:44px;height:40px;padding:0 10px;border-radius:10px;font-size:13px;font-weight:700;background:rgba(0,30,50,0.75);border:1px solid rgba(100,200,255,0.4);color:#cfefff}',
    '#mTop .ma.menu{background:rgba(20,60,90,0.85);border-color:rgba(120,220,255,0.55);color:#9fe8ff}',
    /* Hide mobile chrome when menu open */
    '.is-mobile.menu-open #mActs,.is-mobile.menu-open #mJoy,.is-mobile.menu-open #mTop{display:none!important}',
    '.is-mobile #menuO.show{display:block!important;z-index:300!important}'
  ].join('\n');
  document.head.appendChild(css);

  // ---- 2. Performance caps ----
  function capPerf() {
    if (typeof settings === 'undefined') return;
    var mem = navigator.deviceMemory || 4;
    var cores = navigator.hardwareConcurrency || 4;
    if (mem <= 3 || cores <= 4) settings.density = Math.min(settings.density || 1, 0.3);
    else if (mem <= 4) settings.density = Math.min(settings.density || 1, 0.45);
    else settings.density = Math.min(settings.density || 1, 0.55);
    if (typeof window.MAX_PARTICLES !== 'undefined') window.MAX_PARTICLES = 60;
  }
  try { capPerf(); } catch(e) {}

  // ---- 3. Create DOM ----
  var mJoy = document.createElement('div'); mJoy.id = 'mJoy'; document.body.appendChild(mJoy);
  var mJoyB = document.createElement('div'); mJoyB.id = 'mJoyB'; document.body.appendChild(mJoyB);
  var mJoyK = document.createElement('div'); mJoyK.id = 'mJoyK'; document.body.appendChild(mJoyK);

  var mActs = document.createElement('div'); mActs.id = 'mActs';
  var mTop = document.createElement('div'); mTop.id = 'mTop';

  function fireClick(id) {
    var el = document.getElementById(id);
    if (el) { el.click(); return true; }
    return false;
  }

  // Proper menu open/close for game
  window.openGameMenu = function(){
    try {
      var mo = document.getElementById('menuO');
      if (mo) mo.className = 'ov show';
      if (typeof state !== 'undefined') state = 'menu';
      try { window.state = 'menu'; } catch(e){}
      try { paused = true; } catch(e){ try{ window.paused = true; }catch(e2){} }
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
      // Hide HUD chrome
      try {
        var hud = document.getElementById('hud'); if (hud) hud.style.display = 'none';
        var ab = document.getElementById('actBar'); if (ab) ab.style.display = 'none';
      } catch(e){}
    } catch(e){ console.warn('openGameMenu', e); }
  };
  window.closeGameMenu = function(){
    try {
      var mo = document.getElementById('menuO');
      if (mo) mo.className = 'ov';
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
    } catch(e){}
  };
  window.toggleGameMenu = function(){
    try {
      var mo = document.getElementById('menuO');
      var open = mo && mo.classList.contains('show');
      if (open) {
        // If already in menu overlay during play, go back to play only if player exists
        if (typeof player !== 'undefined' && player && player.alive) {
          mo.className = 'ov';
          if (typeof state !== 'undefined') state = 'playing';
          try { window.state = 'playing'; } catch(e){}
          try { paused = false; window.paused = false; } catch(e){}
          document.documentElement.classList.remove('menu-open');
          document.body.classList.remove('menu-open');
          try { var hud = document.getElementById('hud'); if (hud) hud.style.display = 'block'; } catch(e){}
        }
      } else {
        window.openGameMenu();
      }
    } catch(e){ window.openGameMenu(); }
  };

  var actBtns = [
    {icon:'✎', title:'Eat', fn:function(){ fireClick('bEat'); }},
    {icon:'⊚', title:'Divide', fn:function(){ fireClick('bDiv'); }},
    {icon:'▶', title:'Auto', fn:function(){ fireClick('bAuto'); }},
    {icon:'⊕', title:'Zoom', fn:function(){
      try { tZoom = (tZoom < 0.5 ? 1.2 : (tZoom < 2 ? 3 : 0.15)); } catch(e){}
    }}
  ];
  actBtns.forEach(function(b){
    var el = document.createElement('div');
    el.className = 'ma'; el.textContent = b.icon; el.title = b.title;
    el.addEventListener('touchstart', function(e){ e.preventDefault(); e.stopPropagation(); b.fn(); }, {passive:false});
    el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); b.fn(); });
    mActs.appendChild(el);
  });

  var topBtns = [
    {icon:'⏸', title:'Pause', cls:'', fn:function(){
      try { paused = !paused; window.paused = paused; } catch(e){ try{ window.paused = !window.paused; }catch(e2){} }
    }},
    {icon:'☰ МЕНЮ', title:'Menu', cls:'menu', fn:function(){ window.toggleGameMenu(); }}
  ];
  topBtns.forEach(function(b){
    var el = document.createElement('div');
    el.className = 'ma' + (b.cls ? ' '+b.cls : '');
    el.textContent = b.icon; el.title = b.title;
    el.addEventListener('touchstart', function(e){ e.preventDefault(); e.stopPropagation(); b.fn(); }, {passive:false});
    el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); b.fn(); });
    mTop.appendChild(el);
  });

  document.body.appendChild(mActs);
  document.body.appendChild(mTop);

  // ---- 4. Virtual joystick (small pad only) ----
  var joyOn = false, joyId = null, jcx = 0, jcy = 0, jvx = 0, jvy = 0;

  mJoy.addEventListener('touchstart', function(e){
    if (joyOn) return;
    e.preventDefault(); e.stopPropagation();
    var t = e.changedTouches[0];
    joyOn = true; joyId = t.identifier;
    jcx = t.clientX; jcy = t.clientY;
    mJoyB.style.left = jcx+'px'; mJoyB.style.top = jcy+'px';
    mJoyK.style.left = jcx+'px'; mJoyK.style.top = jcy+'px';
    mJoyB.style.display = 'block'; mJoyK.style.display = 'block';
  }, {passive:false});

  mJoy.addEventListener('touchmove', function(e){
    if (!joyOn) return;
    e.preventDefault(); e.stopPropagation();
    for (var i=0; i<e.changedTouches.length; i++) {
      var t = e.changedTouches[i];
      if (t.identifier === joyId) {
        var dx = t.clientX - jcx, dy = t.clientY - jcy;
        var d = Math.sqrt(dx*dx + dy*dy);
        var maxR = 38;
        if (d > maxR) { dx = dx/d*maxR; dy = dy/d*maxR; }
        mJoyK.style.left = (jcx+dx)+'px'; mJoyK.style.top = (jcy+dy)+'px';
        jvx = dx/maxR; jvy = dy/maxR;
        break;
      }
    }
  }, {passive:false});

  function joyEnd(e){
    for (var i=0; i<e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joyId) {
        joyOn = false; joyId = null; jvx = 0; jvy = 0;
        mJoyB.style.display = 'none'; mJoyK.style.display = 'none';
        break;
      }
    }
  }
  mJoy.addEventListener('touchend', joyEnd, {passive:false});
  mJoy.addEventListener('touchcancel', joyEnd, {passive:false});

  function pollJoy(){
    if (typeof keys === 'undefined') window.keys = keys = {};
    if (jvy < -0.3) keys['w'] = true; else delete keys['w'];
    if (jvy > 0.3) keys['s'] = true; else delete keys['s'];
    if (jvx < -0.3) keys['a'] = true; else delete keys['a'];
    if (jvx > 0.3) keys['d'] = true; else delete keys['d'];
    requestAnimationFrame(pollJoy);
  }
  requestAnimationFrame(pollJoy);

  // ---- 5. Canvas tap: inspect organism + short drag move ----
  function screenToWorld(sx, sy){
    try {
      var cv = document.getElementById('c');
      var r = cv.getBoundingClientRect();
      var mx = sx - r.left, my = sy - r.top;
      // support canvas internal resolution vs CSS size
      var scaleX = cv.width / Math.max(1, r.width);
      var scaleY = cv.height / Math.max(1, r.height);
      mx *= scaleX; my *= scaleY;
      return {
        mx: mx, my: my,
        wx: cam.x + (mx - cv.width/2)/zoom,
        wy: cam.y + (my - cv.height/2)/zoom
      };
    } catch(e){ return null; }
  }

  function pickOrgAt(wx, wy){
    if (typeof orgs === 'undefined') return null;
    var best = null, bestD = 1e18;
    for (var i=0;i<orgs.length;i++){
      var o = orgs[i];
      if (!o || !o.alive) continue;
      var dx = o.x - wx, dy = o.y - wy;
      var d2 = dx*dx + dy*dy;
      var hitR = Math.max(12, (o.size||4) + 10);
      // Extra generous hit on mobile
      hitR *= 2.2;
      if (d2 < hitR*hitR && d2 < bestD){ best = o; bestD = d2; }
    }
    return best;
  }

  function showOrgTip(o){
    try {
      window.inspOrg = o;
      if (typeof inspOrg !== 'undefined') inspOrg = o;
      var tip = document.getElementById('tip');
      if (!tip || !o) return;
      var name = (o.sp && o.sp.name) ? o.sp.name : '?';
      var cat = (o.sp && o.sp.cat) ? o.sp.cat : '';
      var en = Math.round(o.energy||0);
      tip.style.display = 'block';
      tip.innerHTML = '<b>'+name+'</b> · '+cat+' · E='+en +
        (o.infected||o.infectionT>0 ? ' · 🦠 заражён' : '') +
        (o.isPlayer ? ' · ВЫ' : '');
      // auto-hide
      clearTimeout(window._tipHideT);
      window._tipHideT = setTimeout(function(){ try{ tip.style.display='none'; }catch(e){} }, 3500);
    } catch(e){}
  }

  var tapSx=0, tapSy=0, tapT=0, tapMoved=false, tapId=null;
  var cvEl = null;
  function bindCanvasTaps(){
    cvEl = document.getElementById('c');
    if (!cvEl || cvEl._mobTapBound) return;
    cvEl._mobTapBound = true;

    cvEl.addEventListener('touchstart', function(e){
      if (e.touches.length !== 1) return;
      // if over joystick rect, ignore (joystick handles it)
      var t = e.touches[0];
      var jr = mJoy.getBoundingClientRect();
      if (t.clientX >= jr.left && t.clientX <= jr.right && t.clientY >= jr.top && t.clientY <= jr.bottom) return;
      tapSx = t.clientX; tapSy = t.clientY; tapT = Date.now(); tapMoved = false; tapId = t.identifier;
      var p = screenToWorld(t.clientX, t.clientY);
      if (p){ try{ mx=p.mx; my=p.my; mouseDown=true; }catch(e2){} }
    }, {passive:true, capture:true});

    cvEl.addEventListener('touchmove', function(e){
      if (tapId===null) return;
      for (var i=0;i<e.touches.length;i++){
        var t=e.touches[i];
        if (t.identifier===tapId){
          var dx=t.clientX-tapSx, dy=t.clientY-tapSy;
          if (dx*dx+dy*dy > 100) tapMoved = true;
          var p = screenToWorld(t.clientX, t.clientY);
          if (p){ try{ mx=p.mx; my=p.my; }catch(e2){} }
          break;
        }
      }
    }, {passive:true, capture:true});

    cvEl.addEventListener('touchend', function(e){
      try{ mouseDown=false; }catch(e2){}
      if (tapId===null) return;
      var t=null;
      for (var i=0;i<e.changedTouches.length;i++){
        if (e.changedTouches[i].identifier===tapId){ t=e.changedTouches[i]; break; }
      }
      var wasTap = t && !tapMoved && (Date.now()-tapT)<350;
      tapId=null;
      if (!wasTap || !t) return;
      var p = screenToWorld(t.clientX, t.clientY);
      if (!p) return;
      var hit = pickOrgAt(p.wx, p.wy);
      if (hit){
        showOrgTip(hit);
        // light highlight
        hit.flashColor = '#8cf';
        hit.flash = 0.6;
        hit.flashT = 0.6;
      }
    }, {passive:true, capture:true});
  }
  // bind now and after start
  setTimeout(bindCanvasTaps, 200);
  setInterval(bindCanvasTaps, 2000);

  // ---- 6. Pinch zoom ----
  var pd0 = 0, pz0 = 0;
  document.addEventListener('touchstart', function(e){
    if (e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      pd0 = Math.sqrt(dx*dx + dy*dy); pz0 = (typeof tZoom !== 'undefined') ? tZoom : 1;
      e.preventDefault();
    }
  }, {passive:false});
  document.addEventListener('touchmove', function(e){
    if (e.touches.length === 2 && pd0 > 0) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var d = Math.sqrt(dx*dx + dy*dy);
      try { tZoom = clamp(pz0 * d/pd0, 0.05, 50); } catch(e2){}
      e.preventDefault();
    }
  }, {passive:false});
  document.addEventListener('touchend', function(e){
    if (e.touches.length < 2) pd0 = 0;
  }, {passive:false});

  // ---- 7. Prevent double-tap zoom + context menu ----
  var lt = 0;
  document.addEventListener('touchend', function(e){
    var n = Date.now();
    if (n - lt < 300) e.preventDefault();
    lt = n;
  }, {passive:false});
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });

  // ---- 8. Hardware back / Escape → menu ----
  window.addEventListener('keydown', function(e){
    if (e.key === 'Escape' || e.keyCode === 27) {
      e.preventDefault();
      window.toggleGameMenu();
    }
  });
  // Android WebView back bridge
  window.onAndroidBack = function(){
    window.toggleGameMenu();
    return true;
  };

  // ---- 9. Force-hide desktop elements ----
  function purgeDesktop() {
    var ids = ['actBar','keyHint','spdBar'];
    for (var i=0; i<ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.style.display !== 'none') {
        el.style.setProperty('display', 'none', 'important');
      }
    }
    var lc = document.getElementById('leftContainer');
    if (lc && lc.style.display !== 'none') {
      lc.style.setProperty('display', 'none', 'important');
    }
  }
  setInterval(purgeDesktop, 500);
  purgeDesktop();

  try { capPerf(); } catch(e){}
  console.log('[Mobile v3] Active. Screen=' + window.innerWidth + 'x' + window.innerHeight);
})();
