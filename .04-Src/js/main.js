// main.js — gameLoop, tutorial, startGame
"use strict";
window.audioCtx = null;
window.spectatorMode = false;
window.initAudio = function() {
  if (!window.audioCtx) {
    try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
  }
};
window.playSound = function(type, x, y) {
  if (!window.audioCtx) return;
  try {
    let t = window.audioCtx.currentTime;
    let osc = window.audioCtx.createOscillator();
    let gain = window.audioCtx.createGain();
    let panner = null;
    
    if (x !== undefined && window.audioCtx.createStereoPanner) {
       panner = window.audioCtx.createStereoPanner();
       let panVal = (x - cam.x) / (cv.width/2/zoom);
       panner.pan.value = Math.max(-1, Math.min(1, panVal));
       osc.connect(gain);
       gain.connect(panner);
       panner.connect(window.audioCtx.destination);
    } else {
       osc.connect(gain); gain.connect(window.audioCtx.destination);
    }
    
    if (type === 'eat') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'divide') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.start(t); osc.stop(t + 0.15);
    }
  } catch(e){}
};
window.startSpectator = function() {
  window.spectatorMode = true;
  window.initAudio();
  // Set _swissStrict BEFORE initWorld so spawn pool filter works
  window._swissStrict = (settings.renderMode==='swiss');
  initWorld();
  player = null;
  cam.x = 0; cam.y = 20; state = 'playing'; gt = 0; fc = 0;
  document.getElementById('menuO').className='ov';
  document.getElementById('hud').style.display='block';
  var _sb0=document.getElementById('spdBar'); if(_sb0) _sb0.style.display='none'; // P1: скорость живёт в настройках паузы
  document.getElementById('todWrap').style.display='flex';
  document.getElementById('scaleW').style.display='block';
  var tw=document.getElementById('todWrap');
  tw.innerHTML='<input type="range" id="todR" min="0" max="24" step="0.05" value="'+tod+'"><span id="todL">12:00</span><span id="seasL">'+tt('season1')+'</span>';
  var sl=document.getElementById('todR');
  sl.addEventListener('input',function(){tod=parseFloat(sl.value);updateTodUI();});
  updateLegend(); updateEcoPanel();
};

window.focusTarget = null; window.focusTimer = 0; window.cinematicTime = 1;

function gameLoop(ts){
  try{
  if(!lastT)lastT=ts;
  if(state==='playing'&&!player&&!window.demoMode&&!window.spectatorMode){state='gameover';}
  var dt=Math.min(0.05,(ts-lastT)/1000);lastT=ts;fc++;
  
  if (focusTimer > 0) {
    focusTimer -= dt;
    cinematicTime = 0.2; // Slow-mo
    if (focusTarget && focusTarget.alive) {
      cam.x += (focusTarget.x - cam.x) * 2 * dt;
      cam.y += (focusTarget.y - cam.y) * 2 * dt;
    }
  } else {
    cinematicTime = 1;
    focusTarget = null;
  }
  
  var realDt = dt * cinematicTime;
  gt+=realDt;
  
  fAcc+=dt;fCnt++;if(fAcc>=0.5){fps=Math.round(fCnt/fAcc);fAcc=0;fCnt=0;}
  
  if(state==='playing' || state==='menu'){
    updateWorld(realDt);
    if(window.demoMode&&typeof updateDemoPinned==="function") updateDemoPinned(realDt||dt||0.016);
    if(window.demoMode&&typeof updateDemoCamera==="function") updateDemoCamera(realDt||dt||0.016);
    if (state === 'playing') {
      updateHUD();updateTopRight();updateWeather();updateEcoPanel();updateLegend();
      if(typeof updateScaleBar === 'function') updateScaleBar();
      if(typeof updateDivReady === 'function') updateDivReady();
      if(fc%5===0 && typeof window.renderMinimap==='function')window.renderMinimap();if(fc%10===0 && typeof window.renderPopGraph==='function')window.renderPopGraph();
      if(fc%300===0) { // Every ~5 seconds
          try {
              var saved = JSON.parse(localStorage.getItem('igraspore_save') || '{"maxPop":0,"maxPlayerSize":0}');
              if(gameStats.maxPop > saved.maxPop || gameStats.maxPlayerSize > saved.maxPlayerSize) {
                  localStorage.setItem('igraspore_save', JSON.stringify({
                      maxPop: Math.max(gameStats.maxPop, saved.maxPop),
                      maxPlayerSize: Math.max(gameStats.maxPlayerSize, saved.maxPlayerSize)
                  }));
              }
          } catch(e) {}
      }
      var cm=document.getElementById('camM');
      if(freeCam){cm.textContent=tt('freeCam');cm.className='free';cm.style.display='block';}
      else if(autoAI){cm.innerHTML='<span style="color:#0f0;text-shadow:0 0 5px #0f0;font-weight:bold;font-size:12px;">'+tt('autoPilotOn')+'</span>';cm.className='';cm.style.display='block';}
      else cm.style.display='none';
      if(typeof window.tickKeyHint==='function') window.tickKeyHint();
    } else if (!window.demoMode) {
      // Menu Aquarium Logic (not in Demo gallery)
      if (!focusTarget) {
         cam.x += 20 * realDt;
         if(cam.x > PW) cam.x = -PW;
      }
    }
  }else if(state==='gameover'){showDeadScreen();state='dead';}
if(state==='playing'||state==='menu'||state==='paused')render();
  requestAnimationFrame(gameLoop);
  }catch(e){console.error('gameLoop:',e.message,e.stack);requestAnimationFrame(gameLoop);}
}


// ========== ONBOARDING TUTORIAL (5 steps, real "Далее" clicks) ==========
window.tutorialStep = 0;
window.tutorialActive = false;
window.TUTORIAL_STEPS = [
  { title: 'tut.s1.title', body: 'tut.s1.body' },
  { title: 'tut.s2.title', body: 'tut.s2.body' },
  { title: 'tut.s3.title', body: 'tut.s3.body' },
  { title: 'tut.s4.title', body: 'tut.s4.body' },
  { title: 'tut.s5.title', body: 'tut.s5.body' }
];
function tutText(field){
  return (typeof field === 'string' && field) ? tt(field) : '';
}

window.showTutorialStep = function(){
  var layer = document.getElementById('tutorialLayer');
  var title = document.getElementById('tutorialTitle');
  var body = document.getElementById('tutorialBody');
  var counter = document.getElementById('tutorialCounter');
  var next = document.getElementById('tutNext');
  var skip = document.getElementById('tutSkip');
  if(!layer || !next) return;
  if(!window.tutorialActive || window.tutorialStep >= window.TUTORIAL_STEPS.length){
    layer.style.display = 'none';
    window.tutorialActive = false;
    return;
  }
  var s = window.TUTORIAL_STEPS[window.tutorialStep];
  title.textContent = tutText(s.title);
  body.textContent = tutText(s.body);
  counter.textContent = (window.tutorialStep+1) + ' / ' + window.TUTORIAL_STEPS.length;
  next.textContent = (window.tutorialStep === window.TUTORIAL_STEPS.length-1) ? tt('play') : tt('next');
  layer.style.display = 'flex';
  layer.style.pointerEvents = 'none';
  next.style.pointerEvents = 'auto';
  if(skip) skip.style.pointerEvents = 'auto';
  // Re-bind every show (handlers must work even if DOM order changed)
  next.onclick = function(e){ if(e){ e.preventDefault(); e.stopPropagation(); } window.advanceTutorial(); };
  if(skip) skip.onclick = function(e){ if(e){ e.preventDefault(); e.stopPropagation(); } window.skipTutorial(); };
  // Also click on card shouldn't block, only buttons
  var card = document.getElementById('tutorialCard');
  if(card) card.style.pointerEvents = 'auto';
};

window.advanceTutorial = function(){
  if(!window.tutorialActive) return;
  window.tutorialStep++;
  if(window.tutorialStep >= window.TUTORIAL_STEPS.length){
    window.tutorialActive = false;
    var layer = document.getElementById('tutorialLayer');
    if(layer) layer.style.display = 'none';
    if(window.showToast) window.showToast(tt('tutDone'), '#4f4');
    try { localStorage.setItem('igraspore_tut_v2','1'); } catch(e){}
    return;
  }
  window.showTutorialStep();
};

window.skipTutorial = function(){
  window.tutorialActive = false;
  window.tutorialStep = 999;
  var layer = document.getElementById('tutorialLayer');
  if(layer) layer.style.display = 'none';
  try { localStorage.setItem('igraspore_tut_v2','1'); } catch(e){}
};

window.startTutorial = function(force){
  var seen = false;
  try { seen = localStorage.getItem('igraspore_tut_v2') === '1'; } catch(e){}
  if(seen && !force){ window.tutorialActive=false; return; }
  window.tutorialActive = true;
  window.tutorialStep = 0;
  window.showTutorialStep();
};

function startGame(isScreensaver){
  window.demoMode = false;
  window.demoPossessed = null;
  try{ var dt=document.getElementById("demoTip"); if(dt) dt.style.display="none"; }catch(_e){}
  window.initAudio();
  window._swissStrict = (settings.renderMode==='swiss');
  initWorld();
  // Always start in the MORNING (clear light, sun up)
  tod = 9.0;
  season = 1; // spring-ish light
  dayLight = 0.85;
  try{
    if(typeof updateTodUI==='function') updateTodUI();
    var sl=document.getElementById('todR'); if(sl) sl.value=tod;
  }catch(_e){}
  var sp;
  var _isVirusPick=(selSpecies>=VIRUS_ID_START);
  if(_isVirusPick){
    var _vi2=selSpecies-VIRUS_ID_START;
    window.virusPlayerSpec=VIRUS_SPECS[_vi2]||VIRUS_SPECS[0];
    window.virusPlayer=true;
    try{cv.style.cursor='crosshair';}catch(_e){}
    sp=null;
  } else {
    window.virusPlayer=false; window.virusPlayerSpec=null;
    sp=SPECIES_DB[selSpecies];
  }
  // Colony species (Volvox/Gloeocapsa/Microcystis) — playable as-is, no silent override
  if(sp&&sp.shape==='colony'){
    if(window.showToast) window.showToast(tt('colonyKind')+': '+sp.name,'#8cf');
  }
  var d=rng(PD*0.2,PD*0.5),hw=halfW(d)-20;
  
  if(window.virusPlayer){
    // VIRUS SPECTATOR MODE — phages are non-motile, player controls infection spread
    window.spectatorMode=true; freeCam=true; autoAI=false;
    window.screensaverAutoCam=false;
    player=null;
    cam.x=0; cam.y=PD*0.35;
    // Spawn extra viruses near bacteria so player sees them
    var _vspec=window.virusPlayerSpec;
    for(var _vsi=0;_vsi<8&&viruses.length<20;_vsi++){
      var _vd=rng(20,150),_vhw=Math.max(60,halfW(_vd)-20);
      viruses.push({x:rng(-_vhw,_vhw),y:_vd,vx:rng(-0.15,0.15),vy:rng(-0.15,0.15),
        sp:_vspec,target:null,age:0,angle:rng(0,6.28),wobble:rng(0,6.28)});
    }
  } else if (isScreensaver) {
     window.spectatorMode = true;
     freeCam = true;
     window.screensaverAutoCam = true;
     player = null;
     cam.x = 0; cam.y = PD * 0.3;
    // Snap camera to nearest bacteria so player can immediately interact
    var _nearestBact=null,_nearestD=1e9;
    for(var _nb=0;_nb<orgs.length;_nb++){
      var _bo=orgs[_nb];
      if(!_bo.alive||_bo.sp.isEuk) continue;
      if(_bo.sp.cat!=='producer'&&_bo.sp.cat!=='consumer1') continue;
      var _bd=Math.hypot(_bo.x-cam.x,_bo.y-cam.y);
      if(_bd<_nearestD){_nearestD=_bd;_nearestBact=_bo;}
    }
    if(_nearestBact){cam.x=_nearestBact.x;cam.y=_nearestBact.y-30;tZoom=1.5;zoom=1.5;}
  } else if(!window.virusPlayer) {
     cv.style.cursor='default';
     window.spectatorMode = false;
     freeCam = false;
     autoAI = false;
     try{ camKeys={w:false,a:false,s:false,d:false}; }catch(_e){}
     try{ if(typeof keys==='object'){ for(var _k in keys) keys[_k]=false; } }catch(_e){}
     // Always start near the surface (photosphere) — any species
     var dY = rng(18, 55);
     var hw0 = halfW(dY) - 30;
     var px = rng(-hw0*0.35, hw0*0.35);
     player=spawnOrg(sp, px, dY, true);
     if(!player)player=spawnOrg(sp,0,35,true);
     player.energy=100;player.facing=0;player.angle=0;player.aiTarget=null;cam.x=player.x;cam.y=player.y-20;player.acidResist=1.0;


     if(!window.virusPlayer){
     // Seed nearby food cluster so player sees action immediately
     var foodCats = FOOD[sp.cat] || ['producer','consumer1'];
     var foodPool = [];
     for(var si=0; si<SPECIES_DB.length; si++){
       var _s=SPECIES_DB[si];
       if(foodCats.indexOf(_s.cat)>=0 && !(_s.flags&&_s.flags.noRandomSpawn)) foodPool.push(_s);
     }
     if(!foodPool.length) foodPool = [SPECIES_DB[0]];
     // Prefer rods/filaments so player sees non-circle shapes immediately
     var shaped = foodPool.filter(function(s){ return s.shape==='rod'||s.shape==='filament'||s.shape==='spiral'; });
     var seedN = (sp.cat==='consumer2') ? 28 : 16; // инфузории — больше бактерий/водорослей вокруг
     for(var fi=0; fi<seedN; fi++){
       var fsp;
       if(shaped.length && fi%2===0) fsp = shaped[fi % shaped.length];
       else fsp = foodPool[fi % foodPool.length];
       // Prefer producer/consumer1 for ciliates
       if(sp.cat==='consumer2' && foodPool.length){
         var pref = foodPool.filter(function(s){ return s.cat==='producer' || s.cat==='consumer1'; });
         if(pref.length) fsp = pref[fi % pref.length];
       }
       var ang = rng(0, Math.PI*2), rr = rng(14, (sp.cat==='consumer2')?130:100);
       var fx = player.x + Math.cos(ang)*rr;
       var fy = clamp(player.y + Math.sin(ang)*rr*0.65, 0, PD-8);
       var fo = spawnOrg(fsp, fx, fy, false);
       if(fo){
         // Tiny food for filter feeders
         var maxFood = (sp.cat==='consumer2') ? player.size*0.45 : player.size*0.55;
         fo.size = Math.min(fo.size, Math.max(0.7, maxFood));
         fo.energy = 50; fo.divCD=0; fo.invuln=0; fo.alive=true;
       }
     }
     if(sp.cat==='consumer2'){
       setTimeout(function(){
         if(window.showToast) window.showToast(tt('midEaterTip'), '#9cf');
       }, 900);
     }
     } // end !virusPlayer food seed
     // 1) Карточка «ты кто / кого ешь»
     if(!isScreensaver && !window.virusPlayer && typeof showRoleCard==='function'){
       try{ showRoleCard(sp); }catch(_e){}
     }
  }
  
  // Start zoomed in enough to see neighbors (Spore/Agar feel)
  state='playing';zoom=1.8;tZoom=1.8;gt=0;fc=0;lastT=0;
  if(!isScreensaver && !window.virusPlayer){
    state='paused';
    window._pendingTutorial=true;
  }
  // Aquarium: modestly closer than play-start (was the same 1.8, organisms read far)
  if(isScreensaver){
    window._aquariumLock = true;
    window.screensaverAutoCam = true;
    window._aqFollow = null;
    zoom = 2.25;
    tZoom = 2.25;
  } else {
    window._aquariumLock = false;
  }
  // Always start cartoon (user default). Realistic is opt-in via button only.
  try {
    if(settings.renderMode==='bioicons' || settings.renderMode==='realistic') settings.renderMode='cartoon';
    if(!window._rmodeUserPicked){
      settings.renderMode = 'cartoon';
      if(typeof applyRenderMode==='function') applyRenderMode();
    }
  } catch(e){}
  
  // Прячем меню на следующем кадре. Если спрятать кнопку «Начать» внутри её же клика,
  // проверка клика не видит кнопку и ждёт до таймаута — за это время клетка успевает погибнуть.
  var _menuEl = document.getElementById('menuO');
  setTimeout(function(){ if(_menuEl) _menuEl.className = 'ov'; }, 0);
  // UI-IMPROVE-2026-09-28 F5: close stale overlays from the previous page session
  ['wikiO','helpO','setO','pauseO','leaderboardO'].forEach(function(id){ var o=document.getElementById(id); if(o) o.className='ov'; });
  document.getElementById('hud').style.display= isScreensaver ? 'none' : 'block';
  document.getElementById('topR').style.display='block';
  document.getElementById('weatherP').style.display='block';
  document.getElementById('actBar').style.display=(window.demoMode||isScreensaver)?'none':'flex';
  if(typeof window.measureActbarH==='function'){ window.measureActbarH(); setTimeout(window.measureActbarH,120); }
  document.getElementById('renderModeBtn').style.display='block';
  if(settings.renderMode==='swiss'){var rb4=document.getElementById('renderModeBtn');if(rb4){rb4.className='swiss';rb4.innerHTML=tt('mode.swissLbl');rb4.title=tt('swissNow');}}
  else if(settings.renderMode==='webgl'){var rb5=document.getElementById('renderModeBtn');if(rb5){rb5.className='webgl';rb5.innerHTML=tt('mode.webglLbl');rb5.title=tt('webglNow');}}
  else{var rb2=document.getElementById('renderModeBtn');if(rb2){rb2.className='cartoon';rb2.innerHTML='🎨 '+tt('cartoon');rb2.title=tt('cartoonNow');}}
  var kh=document.getElementById('keyHint');
  window._keyHintStart=Date.now();
  // UI-RESTORE §5.1: default collapsed; LS decides (no forced open)
  if(typeof window.startKeyHintSession==='function') window.startKeyHintSession();
  else if(kh){ kh.style.display='flex'; }
  // Large Russian labels on primary action buttons
  function labelBtn(id, text, hk, ico, keep){
    var b=document.getElementById(id); if(!b) return;
    // UI-IMPROVE F6: text in .abt so mobile can show icon+hk only (text kept on ЕСТЬ/ДЕЛИТЬ/АВТО)
    b.innerHTML = '<span class="abt">' + text + '</span><span class="hk">'+hk+'</span>';
    if(ico) b.setAttribute('data-ico', ico);
    if(keep) b.classList.add('ab-keep');
    b.style.minWidth='72px'; b.style.padding='12px 16px'; b.style.fontSize='15px';
  }
  labelBtn('bEat',tt('hud.btn.eat.short'),'E','🍴',true);
  labelBtn('bDiv',tt('hud.btn.divide.short'),'Q','➗',true);
  labelBtn('bCyst',tt('hud.btn.cyst.short'),'R','🛡',true);
  labelBtn('bAuto',tt('hud.btn.auto.short'),'Tab','🤖',true);
  labelBtn('bFree',tt('flight'),'F','🕊');
  labelBtn('bFol',tt('follow'),'V','🎯');
  document.getElementById('scaleW').style.display='block';
  var tw=document.getElementById('todWrap');
  tw.innerHTML='<input type="range" id="todR" min="0" max="24" step="0.05" value="'+tod+'"><span id="todL">12:00</span><span id="seasL">'+tt('season1')+'</span>';
  var sl=document.getElementById('todR');
  sl.addEventListener('mousedown',function(){sliderDragging=true;});
  sl.addEventListener('mouseup',function(){sliderDragging=false;tod=parseFloat(sl.value);});
  sl.addEventListener('input',function(){tod=parseFloat(sl.value);updateTodUI();});
  sl.addEventListener('touchstart',function(){sliderDragging=true;});
  sl.addEventListener('touchend',function(){sliderDragging=false;tod=parseFloat(sl.value);});
  updateLegend();updateEcoPanel(); // P1: spdBar убран из HUD (скорость — в настройках паузы)
  if(window.virusPlayer){
    // Virus spectator banner
    setTimeout(function(){
      if(window.showToast){
        var _vn=(window.virusPlayerSpec&&window.virusPlayerSpec.name)?window.virusPlayerSpec.name:'Phage';
        window.showToast('\u2620 '+tt('virusMode',{name:_vn}),'#f66',6000);
      }
    }, 800);
  } else if(!isScreensaver){ window._pendingTutorial=true; }
}

