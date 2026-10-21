"use strict";


function countCat(cat){
  if(cat==='virus') return (typeof VIRUS_SPECS!=='undefined')?VIRUS_SPECS.length:0;
  if(cat==='all') return SPECIES_DB.length;
  var n=0; for(var i=0;i<SPECIES_DB.length;i++){ if(SPECIES_DB[i]&&SPECIES_DB[i].cat===cat) n++; }
  return n;
}
function buildCatSel(){
  var cs=document.getElementById('catSel'); if(!cs) return; cs.innerHTML='';
  if(typeof renderPoolBanner==='function') renderPoolBanner();
  if(typeof renderFoodChain==='function') renderFoodChain();
  if(typeof selCat==='undefined' || !selCat) selCat='all';
  var cats=[['all',tt('all')],['producer',tt('producer')],['consumer1',tt('consumer1')],['consumer2',tt('consumer2')],['consumer3',tt('consumer3')],['decomposer',tt('decomposer')],['virus',tt('virus')]];
  for(var i=0;i<cats.length;i++){
    var key=cats[i][0], label=cats[i][1], n=countCat(key);
    var b=document.createElement('div');
    b.className='cb'+(selCat===key?' act':'');
    b.setAttribute('data-c', key);
    b.innerHTML=label+' <span style="opacity:.55;font-size:10px">('+n+')</span>';
    b.style.borderLeft='4px solid '+(key==='all'?'#456':(CC[key]||'#f44'));
    b.style.cursor='pointer';
    b.onclick=function(ev){
      var el=ev.currentTarget||ev.target;
      var c=el.getAttribute('data-c');
      if(!c && el.parentElement) c=el.parentElement.getAttribute('data-c');
      if(!c) return;
      selCat=c; try{window.selCat=c;}catch(e){}
      buildCatSel();
      buildSpeciesGrid();
      var sg=document.getElementById('spGrid'); if(sg) sg.scrollTop=0;
      if(typeof catRole==='function' && selCat && selCat!=='all' && window.showToast){
        var tip=catRole(selCat); if(tip) window.showToast(tip, CC[selCat]||'#8cf');
      }
    };
    cs.appendChild(b);
  }
}

function buildSpeciesGrid(){
  var sg=document.getElementById('spGrid'); if(!sg) return; sg.innerHTML='';
  if(typeof selCat==='undefined' || !selCat) selCat='all';
  // Status line: what filter is active
  var shownN = (selCat==='virus') ? ((typeof VIRUS_SPECS!=='undefined')?VIRUS_SPECS.length:0)
              : (selCat==='all' ? SPECIES_DB.length : countCat(selCat));
  var st=document.createElement('div');
  st.id='spFilterStatus';
  st.style.cssText='width:100%;padding:8px 10px;margin:0 0 8px 0;font-size:13px;font-weight:700;color:#dff;background:linear-gradient(90deg,rgba(0,80,40,0.75),rgba(0,40,70,0.75));border-radius:8px;border:2px solid #4c8;box-shadow:0 0 12px rgba(60,180,100,0.35)';
  var catLabel = (selCat==='all') ? tt('all') : (typeof catName==='function'?catName(selCat):selCat);
  var colN = 0;
  if(selCat==='all'||selCat==='producer'){
    for(var ci=0;ci<SPECIES_DB.length;ci++){
      var sx=SPECIES_DB[ci]; if(sx&&(sx.shape==='colony'||(sx.bio&&sx.bio.colony))&&(selCat==='all'||sx.cat===selCat)) colN++;
    }
  }
  st.innerHTML = tt('filter')+': <span style="color:#8f8">'+catLabel+'</span> · '+tt('shown')+' <span style="color:#ff8">'+shownN+'</span> '+tt('speciesWord')
    +(colN?(' · <span style="color:#9f6">'+tt('colonies')+': '+colN+'</span> ('+tt('topOfList')+')'):'')
    +' <span style="opacity:.6;font-weight:400;font-size:11px">· '+tt('filterHint')+'</span>';
  sg.appendChild(st);
  if(selCat==='virus'){
    for(var vi=0;vi<VIRUS_SPECS.length;vi++){
      var vs=VIRUS_SPECS[vi];
      var c=document.createElement('div');c.className='sc'+(selSpecies===VIRUS_ID_START+vi?' sel':'');c.setAttribute('data-si',VIRUS_ID_START+vi);
      var vnum=(typeof vs.num==='number')?vs.num:(SPECIES_DB.length+1+vi);c.innerHTML='<div class="scN" style="color:'+vs.color+'"><span style="opacity:.7;font-size:10px;margin-right:4px">#'+vnum+'</span>'+vs.name+'</div><div class="scL">'+vs.size+'\u03bcm</div><div class="scC">\u2620 '+tt('spcard.virus')+'</div><div class="scP">-</div>';
      c.onclick=function(ev){selSpecies=parseInt(ev.currentTarget.getAttribute('data-si'));buildSpeciesGrid();};
      sg.appendChild(c);
    }
    return;
  }
  // Build index list, colonies first so they are visible without scrolling
  var idxs=[];
  for(var i=0;i<SPECIES_DB.length;i++){
    var sp0=SPECIES_DB[i]; if(!sp0) continue;
    if(selCat!=='all'&&sp0.cat!==selCat) continue;
    idxs.push(i);
  }
  idxs.sort(function(a,b){
    var ca=(SPECIES_DB[a].shape==='colony'||(SPECIES_DB[a].bio&&SPECIES_DB[a].bio.colony))?0:1;
    var cb=(SPECIES_DB[b].shape==='colony'||(SPECIES_DB[b].bio&&SPECIES_DB[b].bio.colony))?0:1;
    if(ca!==cb) return ca-cb;
    return a-b;
  });
  for(var ii=0;ii<idxs.length;ii++){
    var i=idxs[ii];
    var sp=SPECIES_DB[i];
    var c=document.createElement('div');c.className='sc'+(selSpecies===i?' sel':'');c.setAttribute('data-si',i);
    var pop=speciesPop[i]?speciesPop[i].alive:0;
    var eatInfo='';
    if(sp.cat==='producer'){ eatInfo='<span style="color:#8f8">\u{1F31E} '+tt('eatsLight')+'</span>'; }
    else if(sp.cat==='decomposer'){ eatInfo='<span style="color:#b96">\u{1F9F9} '+tt('eatsDead')+'</span>'; }
    else {
      var eatsCats = FOOD[sp.cat]||[];
      var parts=[];
      for(var ec=0;ec<eatsCats.length;ec++){
        var cn = (typeof catName==='function')?catName(eatsCats[ec]):eatsCats[ec];
        parts.push((typeof roleColor==='function'?'<span style="color:'+roleColor(eatsCats[ec])+'">':'<span>')+cn+'</span>');
      }
      eatInfo='<span style="font-size:8.5px">\u{1F5D1} '+tt('eats')+': '+parts.join(', ')+'</span>';
    }
    var roleShort='';
    if(typeof catName==='function'){ roleShort=catName(sp.cat); }
    var spNum=(typeof sp.num==='number')?sp.num:(i+1);
    var isCol=(sp.shape==='colony'||(sp.bio&&sp.bio.colony));
    var colonyTag=isCol?'':'';
    var colonyBadge=isCol?'<div style="background:#2a6;color:#efc;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;margin:2px auto;display:inline-block;letter-spacing:0.5px">⬡ '+tt('colonyBadge')+'</div>':'';
    if(isCol){c.style.boxShadow='inset 0 0 0 3px var(--success),0 0 14px var(--success-glow)';c.style.background='var(--success-bg)';c.style.order='-1';}
    c.innerHTML='<canvas class="scPrev" width="120" height="120" style="display:block;margin:2px auto;background:rgba(0,15,35,0.6);border-radius:4px"></canvas>'+colonyBadge+
      '<div class="scN" style="color:'+sp.color+';font-size:9px;line-height:1.2"><span style="opacity:.75;font-weight:700;margin-right:3px;color:#9cf">#'+spNum+'</span>'+sp.name+'</div>'+
      '<div class="scL">'+(Math.round(sp.size*10)/10)+'\u03bcm &middot; '+sp.shape+colonyTag+'</div>'+
      '<div class="scC">'+sp.locomotion+'</div>'+
      '<div style="font-size:8.5px;opacity:.75;margin-top:1px">'+roleShort+'</div>'+
      '<div style="font-size:8.5px;margin-top:1px;line-height:1.2">'+eatInfo+'</div>'+
      '<div class="scP">'+pop+' alive</div>';
    var pcv=c.querySelector('.scPrev'); try{ if(pcv&&typeof drawSpeciesPreview==='function') drawSpeciesPreview(pcv,sp,i); }catch(ePrev){ if(pcv){ var cxp=pcv.getContext('2d'); if(cxp){ cxp.fillStyle=sp.color||'#4c8'; cxp.beginPath(); cxp.arc(60,60,28,0,6.28); cxp.fill(); } } }
    c.onclick=function(ev){selSpecies=parseInt(ev.currentTarget.getAttribute('data-si'));buildSpeciesGrid();};
    sg.appendChild(c);
  }
  if(document.querySelectorAll('#spGrid .sc').length===0){
    var empty=document.createElement('div');
    empty.style.cssText='padding:12px;color:#f89;font-size:12px';
    empty.textContent=tt('noSpecies',{cat:(typeof catName==='function'?catName(selCat):selCat)});
    sg.appendChild(empty);
  }
}

function updateMenuTexts(){
  (function(){
    var poolN = 0;
    try {
      var dens = (typeof settings!=='undefined' && settings.density) ? settings.density : 1;
      if(typeof INIT_N==='object'){
        for(var k in INIT_N){ if(INIT_N.hasOwnProperty(k)) poolN += Math.round((INIT_N[k]||0)*dens); }
      }
      // difficulty can scale spawn
      if(typeof DIFF!=='undefined' && typeof difficulty!=='undefined' && DIFF[difficulty] && DIFF[difficulty].spawn)
        poolN = Math.round(poolN * DIFF[difficulty].spawn);
    } catch(e){ poolN = 1600; }
    if(!poolN) poolN = 1600;
    var el = document.getElementById('menuSub');
    if(el) el.innerHTML = tt('menuSub') +
      '<br><span style="color:#8cf;font-size:11px">\u{1F30A} '+tt('poolWill',{n:poolN,kinds:SPECIES_DB.length})+'</span>';
  })();
  document.getElementById('startBtn').textContent=tt('start');
  document.getElementById('helpBtn').textContent=tt('help');
  document.getElementById('setBtn2').textContent=tt('set');
  document.getElementById('wikiBtnMenu').textContent=tt('wiki');
  document.getElementById('resBtn').textContent=tt('resume');
  document.getElementById('pHelp').textContent=tt('help');document.getElementById('pSet').textContent=tt('set');document.getElementById('pWiki').textContent=tt('wiki');
  document.getElementById('pauseT').textContent=tt('paused');
  document.getElementById('restartBtn').textContent=tt('restart');document.getElementById('menuBtn').textContent=tt('menu');
  document.getElementById('helpT').textContent=tt('help');document.getElementById('helpClose').textContent=tt('close');
  var pLegend=document.getElementById('pLegend'); if(pLegend) pLegend.textContent=tt('legend');
  var pCam=document.getElementById('pCam'); if(pCam) pCam.textContent=tt('camFly');
  var pMap=document.getElementById('pMap'); if(pMap) pMap.textContent=tt('mapChart');
  var pMicro=document.getElementById('pMicro'); if(pMicro) pMicro.textContent=tt('microscope');
  var pPic=document.getElementById('pPic'); if(pPic) pPic.textContent=tt('picMode');
  var menuBtnPause=document.getElementById('menuBtnPause'); if(menuBtnPause) menuBtnPause.textContent=tt('exit');
  var demoBtn=document.getElementById('demoBtn'); if(demoBtn) demoBtn.textContent=tt('demo');
  function hudLabel(id, key, hk){
    var b=document.getElementById(id); if(!b) return;
    b.innerHTML='<span class="abt">'+tt(key)+'</span><span class="hk">'+hk+'</span>';
  }
  hudLabel('bEat','hud.btn.eat.short','E');
  hudLabel('bDiv','hud.btn.divide.short','Q');
  hudLabel('bCyst','hud.btn.cyst.short','R');
  hudLabel('bAuto','hud.btn.auto.short','Tab');
  var mapLabel=document.getElementById('mapLabel'); if(mapLabel) mapLabel.textContent=tt('map');
  var dnaClose=document.getElementById('dnaClose'); if(dnaClose) dnaClose.textContent=tt('close');
  var tutSkip=document.getElementById('tutSkip'); if(tutSkip) tutSkip.textContent=tt('skip');
  var dnaTitle=document.getElementById('dnaTitle'); if(dnaTitle) dnaTitle.textContent=tt('dnaTitle');
  var dnaPointsLabel=document.getElementById('dnaPointsLabel'); if(dnaPointsLabel) dnaPointsLabel.textContent=tt('dnaPoints');
  var dnaSpeed=document.getElementById('dnaSpeed'); if(dnaSpeed) dnaSpeed.textContent=tt('dnaSpeed');
  var dnaSize=document.getElementById('dnaSize'); if(dnaSize) dnaSize.textContent=tt('dnaSize');
  var dnaSpikes=document.getElementById('dnaSpikes'); if(dnaSpikes) dnaSpikes.textContent=tt('dnaSpikes');
  var dnaShell=document.getElementById('dnaShell'); if(dnaShell) dnaShell.textContent=tt('dnaShell');
  var tutNext=document.getElementById('tutNext'); if(tutNext) tutNext.textContent=tt('next');
  var popLabel=document.getElementById('popLabel'); if(popLabel) popLabel.textContent=tt('pop');
  var mm=document.getElementById('mm'); if(mm) mm.title=tt('mapTip');
  var pc=document.getElementById('pc'); if(pc) pc.title=tt('popTip');
  var pauseBtn=document.getElementById('bPause'); if(pauseBtn) pauseBtn.title=tt('paused');
  document.querySelectorAll('#starSelect option, #starSelectGame option').forEach(function(o){
    var k = o.getAttribute('data-k');
    if(k) o.textContent = tt(k);
  });
  document.querySelectorAll('[data-k-title]').forEach(function(o){o.title=tt(o.getAttribute('data-k-title'));});
  document.querySelectorAll('[data-k-aria]').forEach(function(o){o.setAttribute('aria-label',tt(o.getAttribute('data-k-aria')));});
  document.querySelectorAll('[data-k-ph]').forEach(function(o){o.setAttribute('placeholder',tt(o.getAttribute('data-k-ph')));});
  var aquaBtn=document.getElementById('screensaverBtn'); if(aquaBtn) aquaBtn.textContent=tt('aquarium');
  document.getElementById('setT').textContent=tt('settingsT');document.getElementById('setClose').textContent=tt('close');
  document.getElementById('wikiT').textContent=tt('wikiT');document.getElementById('wikiClose').textContent=tt('close');
  var hk=tt('x.wasdSwimLmbCursorRmbTargetWheel');
  if(typeof window.buildKeyHint==='function') window.buildKeyHint(hk);
  else { var _kh=document.getElementById('keyHint'); if(_kh) _kh.innerHTML=hk; }
  document.getElementById('helpBody').innerHTML=tt('help.body');
  buildDiff();buildCatSel();buildSpeciesGrid();
}

// === keyHint drawer (UI-RESTORE-2026-09-22): chip above actBar, LS persistence, 60s auto-collapse ===
window._keyHintLSKey = 'igraspore.keyHintCollapsed';
window._keyHintAutoMs = 60 * 1000; // auto-collapse 60s after last manual expand
function _khReadLS(){
  try {
    var v = localStorage.getItem(window._keyHintLSKey);
    return (v === '0' || v === '1') ? v : null;
  } catch(e){ return null; }
}
function _khWriteLS(val){
  try { localStorage.setItem(window._keyHintLSKey, val); } catch(e){}
}
function _khIsMobile(){
  try {
    return (typeof window.matchMedia === 'function') &&
      (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 900px)').matches);
  } catch(e){ return false; }
}
// init: LS wins; mobile gets collapsed as a session default (no LS write)
window._keyHintCollapsed = (_khReadLS() === null) ? true : (_khReadLS() !== '0');
if(_khIsMobile()) window._keyHintCollapsed = true;
window._keyHintStart = 0;
window._keyHintLastExpand = 0;
window._keyHintHtml = '';

window.buildKeyHint = function(hkHtml){
  var kh=document.getElementById('keyHint'); if(!kh) return;
  var ru = (typeof curLang==='undefined' || curLang==='ru');
  if(hkHtml) window._keyHintHtml = hkHtml;
  if(!window._keyHintHtml){
    // unique movement keys only; button hotkeys live on the buttons (.hk) — one compact summary line here
    window._keyHintHtml = tt('x.wasdSwimLmbCursorRmbTargetWheel2');
  }
  var collapsed = !!window._keyHintCollapsed;
  var btn = collapsed ? tt('kh.keys') : tt('kh.hide');
  kh.innerHTML = '<button type="button" id="khToggle" aria-expanded="'+(!collapsed)+'" aria-controls="khKeys">'+btn+'</button>' +
    '<div class="kh-keys" id="khKeys"' + (collapsed ? ' hidden aria-hidden="true"' : '') + '>'+window._keyHintHtml+'</div>';
  kh.className = 'p' + (collapsed ? ' collapsed' : '');
  // visible only in an active game frame; menu keeps it hidden
  var inGame = (typeof state !== 'undefined' && state === 'playing');
  kh.style.display = inGame ? 'flex' : 'none';
  var b=document.getElementById('khToggle');
  if(b) b.onclick=function(ev){
    if(ev){ ev.preventDefault(); ev.stopPropagation(); }
    window.setKeyHintCollapsed(!window._keyHintCollapsed, { persist: true, manual: true });
  };
  if(!window._keyHintStart) window._keyHintStart = Date.now();
};
window.setKeyHintCollapsed = function(collapsed, opts){
  opts = opts || {};
  window._keyHintCollapsed = !!collapsed;
  if(opts.persist) _khWriteLS(collapsed ? '1' : '0');
  if(!collapsed && (opts.manual || opts.persist)) window._keyHintLastExpand = Date.now();
  window.buildKeyHint();
};
// session start (startGame / return to game): LS state, restart auto-collapse timer
window.startKeyHintSession = function(){
  var v = _khReadLS();
  window._keyHintCollapsed = (v === null) ? true : (v !== '0');
  if(_khIsMobile()) window._keyHintCollapsed = true; // mobile: collapsed-only default (session)
  window._keyHintLastExpand = Date.now();
  window._keyHintStart = Date.now();
  window.buildKeyHint();
};
// demo exit etc.: re-read LS without writing it
window.restoreKeyHintFromLS = function(){
  var v = _khReadLS();
  window._keyHintCollapsed = (v === null) ? true : (v !== '0');
  window.buildKeyHint();
};
window.tickKeyHint = function(){
  // self-healing --actbar-h (every ~0.5s of play; rAF loop is not timer-throttled like setInterval)
  window._khTickCount = (window._khTickCount || 0) + 1;
  if(window._khTickCount % 30 === 0 && typeof window.measureActbarH === 'function'){
    try { window.measureActbarH(); } catch(e){}
  }
  if(window._keyHintCollapsed) return;             // already collapsed — no LS writes
  if(!window._keyHintLastExpand) window._keyHintLastExpand = window._keyHintStart || Date.now();
  if((Date.now() - window._keyHintLastExpand) > window._keyHintAutoMs){
    window.setKeyHintCollapsed(true, { persist: true }); // persist once, at the moment of collapsing
  }
};

// === --actbar-h measurement: ResizeObserver + orientation/viewport + polling fallback ===
(function(){
  function measureActbarH(){
    var ab = document.getElementById('actBar');
    if(!ab) return;
    var h = ab.offsetHeight;
    if(h > 0){
      // guard against transient mid-transition snapshots (e.g. a full column during demo start)
      var cap = Math.max(64, Math.round((window.innerHeight || 800) * 0.5));
      if(h > cap) h = cap;
      document.documentElement.style.setProperty('--actbar-h', Math.ceil(h) + 'px');
    }
  }
  window.measureActbarH = measureActbarH; // call sites that show/hide/wrap #actBar
  try {
    if(typeof ResizeObserver !== 'undefined'){
      var ab = document.getElementById('actBar');
      if(ab){
        var ro = new ResizeObserver(function(){ measureActbarH(); });
        ro.observe(ab);
      }
    }
  } catch(e){}
  window.addEventListener('resize', measureActbarH);
  window.addEventListener('orientationchange', function(){ setTimeout(measureActbarH, 250); });
  try {
    if(window.visualViewport) window.visualViewport.addEventListener('resize', measureActbarH);
  } catch(e){}
  // some embedded WebViews never deliver the initial RO notification — cheap poll keeps the var true
  setInterval(measureActbarH, 700);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', measureActbarH);
  else measureActbarH();
  setTimeout(measureActbarH, 500);
  setTimeout(measureActbarH, 1500);
})();

// === UI-IMPROVE-2026-09-28 F4: clean start menu + keyboard focus on «НАЧАТЬ» ===
// Single observer on #menuO class: covers init, restart, menu button, back-from-demo.
window.syncMenuChrome = function(){
  try{
    var mo=document.getElementById('menuO'); if(!mo||!document.body) return;
    var shown=/\bshow\b/.test(mo.className||'');
    var was=document.body.classList.contains('in-menu');
    document.body.classList.toggle('in-menu', shown);
    if(shown && !was){
      var sb=document.getElementById('startBtn');
      var ae=document.activeElement;
      if(sb && (!ae || ae===document.body || !mo.contains(ae))){
        try{ sb.focus({preventScroll:true}); }catch(e){ try{ sb.focus(); }catch(_e){} }
      }
    }
  }catch(e){}
};
(function(){
  try{
    var init=function(){
      var mo=document.getElementById('menuO'); if(!mo) return;
      window.syncMenuChrome();
      if(typeof MutationObserver==='function'){
        new MutationObserver(function(){ window.syncMenuChrome(); }).observe(mo,{attributes:true,attributeFilter:['class']});
      }
    };
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  }catch(e){}
})();
// UI-IMPROVE-2026-09-28 F7: first-run pulse of the «Клавиши» chip — once per browser (LS igraspore.firstTip), <=2s, respects reduced motion
window.maybeFirstRunPulse = function(){
  try { if (localStorage.getItem('igraspore.firstTip')) return false; localStorage.setItem('igraspore.firstTip', '1'); } catch(e) { return false; }
  try { if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false; } catch(e) {}
  var b = document.getElementById('khToggle'); if (!b) return false;
  b.classList.add('kh-pulse');
  setTimeout(function(){ var x = document.getElementById('khToggle'); if (x) x.classList.remove('kh-pulse'); }, 2000);
  return true;
};
(function(){
  var orig = window.startKeyHintSession;
  if (typeof orig !== 'function') return;
  window.startKeyHintSession = function(){
    var r = orig.apply(this, arguments);
    try { window.maybeFirstRunPulse(); } catch(e) {}
    return r;
  };
})();