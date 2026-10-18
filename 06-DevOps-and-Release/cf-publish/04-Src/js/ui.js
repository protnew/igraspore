"use strict";
function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
function showSpeedBar(){
  var sb=document.getElementById('spdBar');
  if(!sb) return;
  var speeds=[{v:0,l:'\u23f8'},{v:0.25,l:'0.25x'},{v:0.5,l:'0.5x'},{v:1,l:'1x'},{v:2,l:'2x'},{v:5,l:'5x'},{v:10,l:'10x'}];
  sb.innerHTML='';
  sb.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:9999;display:flex!important;gap:4px;padding:6px 10px;background:rgba(0,12,28,0.95);border:1px solid #3a6a95;border-radius:8px;pointer-events:auto;box-shadow:0 2px 12px rgba(0,0,0,0.5);';
  for(var i=0;i<speeds.length;i++){
    var b=document.createElement('button');
    b.type='button';
    b.className='sb'+(Math.abs(timeScale-speeds[i].v)<0.001?' act':'');
    b.textContent=speeds[i].l;
    b.setAttribute('data-ts',speeds[i].v);
    b.title=speeds[i].v===0?tt('paused'):(tt('simSpeed')+' '+speeds[i].l);
    b.style.cssText='padding:6px 12px;font-size:14px;min-width:44px;cursor:pointer;border-radius:5px;border:1px solid #345;background:'+(Math.abs(timeScale-speeds[i].v)<0.001?'#1a6a3a':'#012')+';color:#fff;font-family:inherit;';
    b.onclick=function(ev){
      var el=ev.currentTarget||ev.target;
      timeScale=parseFloat(el.getAttribute('data-ts'));
      if(window.showToast) window.showToast(tt('simSpeed')+': '+(timeScale===0?tt('paused'):timeScale+'x'),'#8cf');
      showSpeedBar();
    };
    sb.appendChild(b);
  }
}

var langNames = {
  ru: 'Русский', en: 'English', 'pt-BR': 'Português (Brasil)', id: 'Bahasa Indonesia',
  de: 'Deutsch', fr: 'Français', hi: 'हिन्दी', ja: '日本語', vi: 'Tiếng Việt',
  ko: '한국어', th: 'ไทย', it: 'Italiano', pl: 'Polski', uk: 'Українська',
  'zh-TW': '繁體中文', ms: 'Bahasa Melayu', bn: 'বাংলা',
  zh: '中文', es: 'Español', ar: 'العربية', pt: 'Português'
};







function updateHUD(){
  if(!player||!player.alive){document.getElementById('hud').style.display='none';return;}
  var h=document.getElementById('hud');h.style.display='block';
  // UI-RESTORE §3.7 — product decision (A) display-only clamp: player.energy logic (can exceed 100) untouched
  var displayE = Math.min(100, Math.max(0, Math.round(player.energy)));
  var eRatio=clamp(displayE/100,0,1);
  var eColor = eRatio>0.6?'#4f4':eRatio>0.3?'#ff4':'#f44';
  // 8) Запах еды — понятная полоска для новичка
  var scent = (typeof foodScentStrength==='function') ? foodScentStrength(player) : 0;
  var sColor = scent>0.55?'#4f4':scent>0.25?'#fc4':'#678';
  var sLabel = curLang==='ru' ? 'Запах еды' : 'Food scent';
  var cover = player._lilyCover ? (curLang==='ru'?' · укрытие':' · cover') : '';
  var cyst = player.cyst ? (curLang==='ru'?' · ЦИСТА':' · CYST') : '';
  var role = (typeof catName==='function') ? catName(player.sp.cat) : '';
  // SIMPLE CLEAN HUD: only essential stats
  h.innerHTML = 
    '<div style="font-size:15px;font-weight:bold;color:#fff;margin-bottom:2px;">'+player.sp.name+'</div>'+
    '<div style="font-size:12px;color:#89f;margin-bottom:6px;">'+role+' · Gen '+player.generation+' · '+player.size.toFixed(1)+'\u03bcm'+cover+cyst+'</div>'+
    '<div id="energyBar" style="background:#012;border:1px solid #234;border-radius:4px;height:18px;overflow:hidden;margin-bottom:4px;">'+
      '<div style="width:'+(eRatio*100)+'%;background:'+eColor+';height:100%;transition:width .3s;"></div>'+
    '</div>'+
    '<div style="font-size:11px;color:#9ab;margin:0 0 2px 0">'+sLabel+'</div>'+
    '<div style="background:#012;border:1px solid #234;border-radius:4px;height:12px;overflow:hidden;margin-bottom:6px;">'+
      '<div style="width:'+(scent*100)+'%;background:'+sColor+';height:100%;transition:width .2s;"></div>'+
    '</div>'+
    '<div style="font-size:13px;line-height:1.6;">'+
      '<span style="color:#8af;font-weight:bold;">'+tt('energy')+':</span> <span style="color:#fff;font-weight:bold;">'+displayE+'/100</span><br>'+
      '<span style="color:#8af;font-weight:bold;">'+tt('age')+':</span> <span id="ageBar" style="color:#fff;">'+Math.round(player.age)+'s</span><br>'+
      '<span style="color:#8af;font-weight:bold;">'+tt('divs')+':</span> <span style="color:#fff;">'+player.offspring+'</span>'+
    '</div>'+
    '<div style="font-size:11px;color:#cde;line-height:1.45">'+
      '<span id="fpsL">'+tt('fps')+': '+(typeof fps!=='undefined'?fps:'')+'</span> \u00b7 <span id="lightL">'+tt('light')+': '+Math.round((typeof dayLight==='number'?dayLight:0)*100)+'%</span><br>'+
      '<span id="tempL">'+tt('temp')+': '+(typeof SEASONS!=='undefined'&&typeof season!=='undefined'?SEASONS[season].temp:'')+'\u00b0C</span> \u00b7 <span id="daysL">'+tt('days')+': '+(typeof totalDays!=='undefined'?totalDays:0)+'</span> \u00b7 <span id="popC">'+tt('pop')+'</span>'+
    '</div>'+
    (player.infected?'<div style="color:#f44;font-size:12px;margin-top:4px;">\u2620 '+(curLang==='ru'?'\u0417\u0430\u0440\u0430\u0436\u0435\u043d!':'Infected!')+'</div>':'');
}
function updateTopRight(){
  var t=document.getElementById('topR');var pop=0;for(var i=0;i<orgs.length;i++)if(orgs[i].alive)pop++;
  var s=SEASONS[season];
  t.innerHTML='<div class="rw">'+tt('pop')+': <b style="color:#4df">'+pop+'</b></div>'+
    '<div class="rw">'+tt('fps')+': '+fps+' \u00b7 '+tt('light')+': '+Math.round(dayLight*100)+'%</div>'+
    '<div class="rw">'+tt('temp')+': '+s.temp+'\u00b0C \u00b7 '+tt('days')+': '+totalDays+'</div>';
  t.style.display='block';
}
function updateWeather(){
  var w=document.getElementById('weatherP');
  w.innerHTML='<div>'+(isRaining?'\u2614 '+tt('rainy')+'\u00a0\u00a0':'\u2600 '+tt('clear'))+'</div>'+
    '<div style="color:#678;font-size:8px;margin-top:1px">'+(curLang==='ru'?'\u0412\u0435\u0442\u0435\u0440':'Wind')+': '+Math.round(wind.strength*10)/10+'</div>';
  w.style.display='block';
}

// Energy + mass progress (food/sun grow both; no eat-count gate)
// UI-IMPROVE-2026-09-28 F1: was a top-level block run once at load (player===null) -> widget dead.
// Now a per-frame function called from gameLoop (playing) and demo possession.
function divideProgress(n){
  if(!n) return 0;
  if(n.ok) return 100;
  if(n.reason==='cd'||n.reason==='busy'||n.reason==='none') return n.reason==='cd'? Math.max(0, 100-Math.round((n.cd||0)*4)) : 0;
  var parts=[];
  if(n.energy[1]) parts.push(n.energy[0]/n.energy[1]);
  if(n.mass[1]) parts.push(n.mass[0]/n.mass[1]);
  if(n.size[1]) parts.push(n.size[0]/n.size[1]);
  if(n.age[1]) parts.push(n.age[0]/n.age[1]);
  var m=parts.length?Math.min.apply(null, parts):0;
  return Math.max(0, Math.min(99, Math.round(m*100)));
}
function syncActButtons(){
  var who=(typeof player!=='undefined' && player) ? player : (window.demoPossessed||null);
  var eat=document.getElementById('bEat');
  var div=document.getElementById('bDiv');
  var cyst=document.getElementById('bCyst');
  var plant=!!(who && who.sp && who.sp.cat==='producer');
  if(eat){
    var abt=eat.querySelector('.abt');
    var label=plant ? (typeof igsText==='function'?igsText('hud.btn.light.short','СВЕТ'):'СВЕТ') : (typeof igsText==='function'?igsText('hud.btn.eat.short','ЕСТЬ'):'ЕСТЬ');
    if(plant) label='☀ '+label;
    if(abt && abt.textContent!==label) abt.textContent=label;
    eat.setAttribute('aria-label', plant?'Свет':'Есть (E)');
  }
  if(cyst && who) cyst.classList.toggle('is-on', !!who.cyst);
  var fol=document.getElementById('bFol');
  if(fol) fol.classList.toggle('is-needed', typeof freeCam!=='undefined' && !!freeCam);
  if(div && who && typeof divideNeeds==='function'){
    var n=divideNeeds(who);
    div.classList.toggle('is-ready', !!n.ok);
    div.classList.toggle('is-blocked', !n.ok);
    div.style.setProperty('--p', String(divideProgress(n)));
    var reason=document.getElementById('divReason');
    var why=n.ok?'':(typeof divideBlockReason==='function'?divideBlockReason(who):n.reason);
    if(reason && reason.textContent!==why) reason.textContent=why;
  }
}
window.syncActButtons=syncActButtons;
function updateDivReady(){
  try{
    var hd=document.getElementById('hDivReady')||document.getElementById('hDiv')||document.getElementById('divInfo');
    if(!hd) return;
    var who=(typeof player!=='undefined' && player) ? player : (window.demoPossessed||null);
    if(typeof state!=='undefined' && state!=='playing'){ hd.textContent=''; if(window.syncActButtons) window.syncActButtons(); return; }
    if(who && who.alive && who.sp){
      var n=(typeof divideNeeds==='function')?divideNeeds(who):null;
      var en=Math.max(0,Math.round(who.energy||0));
      var rep=n?Math.round(n.energy[1]):Math.round(who.sp.repEnergy||80);
      var m=who.massFood||0;
      var needM=n?n.mass[1]:0;
      var line=tt('energy')+' '+en+'/'+rep+' · '+tt('massWord')+' '+m.toFixed(1)+'/'+needM.toFixed(1);
      var txt;
      var ready=(typeof window.canDivide==='function')?window.canDivide(who):(n&&n.ok);
      if(ready) txt=line+' · '+tt('ready')+' (Q)';
      else if(window.divideBlockReason) txt=line+' · '+window.divideBlockReason(who);
      else txt=line;
      var goalN=(typeof window._divGoal==='number')?window._divGoal:0;
      var goal=typeof igsText==='function'?igsText('hud.goal','Поделись: {cur}/{need}'):'Поделись: {cur}/{need}';
      goal=goal.replace('{cur}', String(goalN)).replace('{need}', '3');
      txt=goal+' · '+txt;
      if(hd.textContent!==txt) hd.textContent=txt;
    } else hd.textContent='';
    if(window.syncActButtons) window.syncActButtons();
  }catch(e){}
}
window.updateDivReady = updateDivReady;
function bindPauseExtras(){
  function click(id){ var el=document.getElementById(id); if(el) el.click(); }
  var map={pLegend:'legToggle',pCam:'bFree',pMicro:'bMicro',pPic:'bRender',pFollow:'bFol'};
  Object.keys(map).forEach(function(id){
    var b=document.getElementById(id);
    if(!b||b._igs) return;
    b._igs=1;
    b.addEventListener('click', function(){ click(map[id]); });
  });
  var mapBtn=document.getElementById('pMap');
  if(mapBtn&&!mapBtn._igs){
    mapBtn._igs=1;
    mapBtn.addEventListener('click', function(){ document.body.classList.toggle('show-map'); });
  }
  var exit=document.getElementById('menuBtnPause');
  if(exit&&!exit._igs){
    exit._igs=1;
    exit.addEventListener('click', function(){
      try{ state='menu'; player=null; }catch(e){}
      var po=document.getElementById('pauseO'); if(po) po.className='ov';
      var mo=document.getElementById('menuO'); if(mo) mo.className='ov show';
      if(window.syncMenuChrome) window.syncMenuChrome();
    });
  }
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bindPauseExtras);
  else bindPauseExtras();
}
if(typeof location!=='undefined' && location.search && location.search.indexOf('debug=1')>=0 && document.body){
  document.body.classList.add('debug');
}

function updateEcoPanel(){
  // ECOSYSTEM PANEL REMOVED per user request — confusing numbers
  var ep=document.getElementById('ecoP');if(ep)ep.style.display='none';
  // UI-RESTORE v1.1 contract: #legP is owned by the legend collapse API — never touched here
  var dc=document.getElementById('deathP')||document.getElementById('deathCauses');
  if(dc) dc.style.display='none';
}

// === Legend collapse (UI-RESTORE §5.3) ===
window._legendLSKey = 'igraspore.legendCollapsed';
(function(){
  var v = null;
  try { v = localStorage.getItem(window._legendLSKey); } catch(e){}
  window._legendCollapsed = (v === '0') ? false : true; // default: collapsed
})();
window.setLegendCollapsed = function(collapsed, opts){
  opts = opts || {};
  window._legendCollapsed = !!collapsed;
  if(opts.persist){ try { localStorage.setItem(window._legendLSKey, collapsed ? '1' : '0'); } catch(e){} }
  if(typeof window.initLegendUI === 'function') window.initLegendUI();
};
// builds toggle text/aria/binding + collapse class; content itself lives in #legBody via updateLegend()
window.initLegendUI = function(){
  var lg = document.getElementById('legP');
  var body = document.getElementById('legBody');
  var toggle = document.getElementById('legToggle');
  if(!lg || !body || !toggle) return;
  var collapsed = !!window._legendCollapsed;
  var ru = (typeof curLang === 'undefined' || curLang === 'ru');
  toggle.textContent = tt('legend') + (collapsed ? ' ▾' : ' ▴');
  toggle.setAttribute('aria-expanded', String(!collapsed));
  toggle.setAttribute('aria-controls', 'legBody');
  if(collapsed) body.setAttribute('hidden', '');
  else body.removeAttribute('hidden');
  lg.className = 'p' + (collapsed ? ' collapsed' : '');
  if(!toggle._igrBound){
    toggle._igrBound = true;
    toggle.onclick = function(ev){
      if(ev){ ev.preventDefault(); ev.stopPropagation(); }
      window.setLegendCollapsed(!window._legendCollapsed, { persist: true });
    };
  }
};
function updateLegend(){
  var lg=document.getElementById('legP');
  if(!lg)return;
  var body=document.getElementById('legBody');
  var ru=(typeof curLang==='undefined'||curLang==='ru');
  // Compact legend — colors + localized species/type names (RU intact; EN when lang=en)
  var items= ru ? [
    ['#2c2','Водоросли'],
    ['#4af','Бактерии'],
    ['#dd44cc','Крупные охотники'],
    ['#c4f','Крупные'],
    ['#a86','Разлагатели'],
    ['#f44','Вирусы']
  ] : [
    ['#2c2','Algae'],
    ['#4af','Bacteria'],
    ['#dd44cc','Apex hunters'],
    ['#c4f','Large'],
    ['#a86','Decomposers'],
    ['#f44','Viruses']
  ];
  if(body){
    var head = tt('legend');
    var sig = head + '|' + items.map(function(it){return it[1];}).join(',');
    if(lg.getAttribute('data-sig') !== sig){
      var html='<div style="color:#bcd;font-size:13px;font-weight:bold;margin-bottom:4px;">'+head+'</div>';
      for(var i=0;i<items.length;i++){
        html+='<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin:3px 0;color:#dde;">'+
          '<span style="width:10px;height:10px;border-radius:50%;background:'+items[i][0]+';display:inline-block;"></span>'+
          items[i][1]+'</div>';
      }
      body.innerHTML=html;
      lg.setAttribute('data-sig', sig);
      if(typeof window.initLegendUI==='function') window.initLegendUI();
    }
  }
  lg.style.display='block';
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ if(typeof window.initLegendUI==='function') window.initLegendUI(); });
else window.initLegendUI();






// UI-IMPROVE-2026-09-28 F2: #scaleW was empty (no #scaleL ever created) -> 0x0 widget.
// Canon: #scaleW builds its own content on first call: label "100 µm" + line #scaleL (width = 100*zoom).
function ensureScaleBarContent(sw){
  var sl = document.getElementById('scaleL');
  if(sl && sw.contains(sl)) return sl;
  sw.innerHTML = '';
  sw.setAttribute('aria-label','Масштаб: 100 мкм');
  var lab = document.createElement('div');
  lab.id = 'scaleT';
  lab.textContent = '100 µm';
  lab.style.cssText = 'font:700 10px/1.2 system-ui,sans-serif;color:rgba(200,230,255,0.95);text-shadow:0 1px 2px #000;text-align:center;margin-bottom:2px;pointer-events:none';
  sl = document.createElement('div');
  sl.id = 'scaleL';
  sl.style.cssText = 'height:3px;background:rgba(200,230,255,0.9);border-left:2px solid #fff;border-right:2px solid #fff;box-shadow:0 1px 2px #000;width:100px;margin:0 auto;pointer-events:none';
  sw.appendChild(lab); sw.appendChild(sl);
  return sl;
}
function updateScaleBar() {
   var sw = document.getElementById('scaleW');
   if(!sw) return;
   if(state !== 'playing') { sw.style.display = 'none'; return; }
   sw.style.display = 'block';
   var sl = ensureScaleBarContent(sw);
   // 100 micrometers
   var z = (typeof zoom === 'number' && isFinite(zoom)) ? zoom : 1;
   var pixels = Math.round(Math.max(10, Math.min(260, 100 * z)));
   var w = pixels + 'px';
   if(sl.style.width !== w) sl.style.width = w;
}
window.updateScaleBar = updateScaleBar;

function initTooltips() {
  var tip = document.getElementById('globalTooltip');
  if(!tip) return;
  var tooltips = {
    'popC': 'tip.popC',
    'fpsL': 'tip.fpsL',
    'lightL': 'tip.lightL',
    'tempL': 'tip.tempL',
    'daysL': 'tip.daysL',
    'energyBar': 'tip.energyBar',
    'ageBar': 'tip.ageBar'
  };

  document.addEventListener('mousemove', function(e) {
    var tgt = e.target;
    var tipText = '';
    while(tgt && tgt !== document.body) {
      if(tgt.id && tooltips[tgt.id]) { tipText = tt(tooltips[tgt.id]); break; }
      if(tgt.className && typeof tgt.className === 'string' && tgt.className.includes('cb')) { tipText = tt('tip.cbFilter'); break; }
      if(tgt.id === 'langSelWrap') { tipText = tt('tip.lang'); break; }
      tgt = tgt.parentElement;
    }
    
    if(tipText) {
      tip.innerHTML = tipText;
      tip.style.display = 'block';
      tip.style.left = (e.clientX + 15) + 'px';
      tip.style.top = (e.clientY + 15) + 'px';
    } else {
      tip.style.display = 'none';
    }
  });
}
// initTooltips is called once
setTimeout(initTooltips, 500);

window.openDNAEditor = function() {
    if(state !== 'playing' || !player || !player.alive) return;
    document.getElementById('dnaModal').style.display='block';
    document.getElementById('dnaPts').innerText = Math.floor(gameStats.dna || 0);
    window.lastTimeScale = timeScale;
    timeScale = 0; // Pause
};
window.closeDNAEditor = function() {
    document.getElementById('dnaModal').style.display='none';
    timeScale = window.lastTimeScale || 0.5;
};
window.buyMutation = function(type) {
    if(!player || !player.alive) return;
    if(!gameStats.dna) gameStats.dna = 0;
    var costs = {speed: 5, size: 8, spikes: 15, shell: 20};
    if(gameStats.dna >= costs[type]) {
        if(!player.sp.isCustom) {
            player.sp = Object.assign({}, player.sp);
            player.sp.flags = Object.assign({}, player.sp.flags || {});
            player.sp.isCustom = true;
        }
        if(type==='speed') { player.speedMult = (player.speedMult||1) + 0.5; player.sp.locomotion='flagella'; }
        if(type==='size') { player.size += 5; player.sp.size += 5; }
        if(type==='spikes') { player.sp.flags.spikes=true; player.sp.shape='spiky'; }
        if(type==='shell') { player.sp.flags.shell=true; }
        gameStats.dna -= costs[type];
        document.getElementById('dnaPts').innerText = Math.floor(gameStats.dna);
        if(settings.particles) for(var k=0;k<3;k++) parts.push({x:player.x,y:player.y,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),life:0.6,maxL:0.6,size:1,color:'#0ff'});
        if(typeof updateHUD === 'function') updateHUD();
    }
};

window.exportDNA = function() {
    if(!player || !player.sp) return;
    var str = btoa(JSON.stringify(player.sp));
    document.getElementById('dnaString').value = str;
};

window.importDNA = function() {
    if(!player) return;
    var str = document.getElementById('dnaString').value;
    try {
        var sp = JSON.parse(atob(str));
        sp.isCustom = true;
        player.sp = sp;
        player.color = sp.color;
        player.size = sp.size;
        if(settings.particles) for(var k=0;k<3;k++) parts.push({x:player.x,y:player.y,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),life:0.6,maxL:0.6,size:1,color:'#f0f'});
        document.getElementById('dnaString').value = 'DNA Imported Successfully!';
    } catch(e) {
        document.getElementById('dnaString').value = 'Invalid DNA String!';
    }
};

