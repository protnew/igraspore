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
  st.innerHTML = 'Фильтр: <span style="color:#8f8">'+catLabel+'</span> · показано <span style="color:#ff8">'+shownN+'</span> видов'
    +(colN?(' · <span style="color:#9f6">колоний: '+colN+'</span> (вверху списка)'):'')
    +' <span style="opacity:.6;font-weight:400;font-size:11px">· нажми другую кнопку чтобы сменить</span>';
  sg.appendChild(st);
  if(selCat==='virus'){
    for(var vi=0;vi<VIRUS_SPECS.length;vi++){
      var vs=VIRUS_SPECS[vi];
      var c=document.createElement('div');c.className='sc'+(selSpecies===VIRUS_ID_START+vi?' sel':'');c.setAttribute('data-si',VIRUS_ID_START+vi);
      var vnum=(typeof vs.num==='number')?vs.num:(SPECIES_DB.length+1+vi);c.innerHTML='<div class="scN" style="color:'+vs.color+'"><span style="opacity:.7;font-size:10px;margin-right:4px">#'+vnum+'</span>'+vs.name+'</div><div class="scL">'+vs.size+'\u03bcm</div><div class="scC">\u2620 \u0412\u0438\u0440\u0443\u0441</div><div class="scP">-</div>';
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
    if(sp.cat==='producer'){ eatInfo='<span style="color:#8f8">\u{1F31E} ест свет</span>'; }
    else if(sp.cat==='decomposer'){ eatInfo='<span style="color:#b96">\u{1F9F9} ест мёртвое</span>'; }
    else {
      var eatsCats = FOOD[sp.cat]||[];
      var parts=[];
      for(var ec=0;ec<eatsCats.length;ec++){
        var cn = (typeof catName==='function')?catName(eatsCats[ec]):eatsCats[ec];
        parts.push((typeof roleColor==='function'?'<span style="color:'+roleColor(eatsCats[ec])+'">':'<span>')+cn+'</span>');
      }
      eatInfo='<span style="font-size:8.5px">\u{1F5D1} ест: '+parts.join(', ')+'</span>';
    }
    var roleShort='';
    if(typeof catName==='function'){ roleShort=catName(sp.cat); }
    var spNum=(typeof sp.num==='number')?sp.num:(i+1);
    var isCol=(sp.shape==='colony'||(sp.bio&&sp.bio.colony));
    var colonyTag=isCol?'':'';
    var colonyBadge=isCol?'<div style="background:#2a6;color:#efc;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;margin:2px auto;display:inline-block;letter-spacing:0.5px">⬡ КОЛОНИЯ · куча клеток</div>':'';
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
    empty.textContent='Нет видов в категории «'+(typeof catName==='function'?catName(selCat):selCat)+'». Нажмите «Все».';
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
      '<br><span style="color:#8cf;font-size:11px">\u{1F30A} В бассейне будет: <b style="color:#fff">~'+poolN+'</b> организмов · '+SPECIES_DB.length+' видов</span>';
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
  document.getElementById('setT').textContent=tt('settingsT');document.getElementById('setClose').textContent=tt('close');
  document.getElementById('wikiT').textContent=tt('wikiT');document.getElementById('wikiClose').textContent=tt('close');
  var hk=curLang==='ru'?'<span><kbd>WASD</kbd> \u041f\u043b\u044b\u0432\u0430\u0442\u044c</span><span><kbd>\u041b\u041a\u041c</kbd> \u041a \u043a\u0443\u0440\u0441\u043e\u0440\u0443</span><span><kbd>\u041f\u043a\u041c</kbd> \u0426\u0435\u043b\u044c</span><span><kbd>\u041a\u043e\u043b\u0435\u0441\u043e</kbd> \u0417\u0443\u043c</span><span class="kh-sum">\u041a\u043d\u043e\u043f\u043a\u0438: E Q R Space Tab F M N V B P</span>'
    :'<span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span>';
  if(typeof window.buildKeyHint==='function') window.buildKeyHint(hk);
  else { var _kh=document.getElementById('keyHint'); if(_kh) _kh.innerHTML=hk; }
  document.getElementById('helpBody').innerHTML=curLang==='ru'?
    '<p><b style="color:#4df">Управление:</b> WASD — плавание. Вверх = поверхность, вниз = дно. ЛКМ — плыть к курсору. Пробел — укус.</p>'+
    '<p><b style="color:#8f8">Кто кого ест (просто):</b></p>'+
    '<p style="line-height:1.45">🌱 <b>Зелёные</b> — не охотятся. Кормятся светом (как растения). Это основной корм пруда.<br>'+
    '🔵 <b>Мелкие едоки</b> — бактерии. Грызут зелёных.<br>'+
    '🟠 <b>Средние едоки</b> — инфузории. Фильтруют воду: затягивают бактерий и зелёных. Не прыгают на гигантов.<br>'+
    '🟣 <b>Крупные охотники</b> — едят зелёных, бактерий и средних. Можно кусать и чуть более крупных (опасно). Без еды живут долго.</p>'+
    '<p><b style="color:#4df">Камера:</b> F — свободный полёт. V — вернуться к клетке. Колесо — зум.</p>'+
    '<p><b style="color:#4df">Деление:</b> Наелся и вырос — делишься на двоих. Q — вручную.</p>'
    :'<p><b style="color:#4df">Controls:</b> WASD swim. Space = bite. LMB = swim to cursor.</p>'+
    '<p><b style="color:#8f8">Who eats whom:</b></p>'+
    '<p>🌱 Greens eat light. 🔵 Small eaters eat greens. 🟠 Mid eaters filter bacteria+greens. 🟣 Big hunters eat greens, bacteria and mid-eaters — and can bite slightly larger prey.</p>'+
    '<p><b style="color:#4df">Camera:</b> F free cam, V back to cell. Wheel = zoom.</p>'+
    '<p><b style="color:#4df">Division:</b> Eat, grow, split. Q = manual.</p>';
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
    window._keyHintHtml = ru
      ? '<span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> К курсору</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span>'
      : '<span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span>';
  }
  var collapsed = !!window._keyHintCollapsed;
  var btn = ru ? (collapsed ? 'Клавиши' : 'Свернуть') : (collapsed ? 'Keys' : 'Hide keys');
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
