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
  initWorld();
  player = null;
  cam.x = 0; cam.y = 20; state = 'playing'; gt = 0; fc = 0;
  document.getElementById('menuO').className='ov';
  document.getElementById('hud').style.display='block';
  document.getElementById('spdBar').style.display='flex';
  document.getElementById('todWrap').style.display='flex';
  document.getElementById('scaleW').style.display='block';
  var tw=document.getElementById('todWrap');
  tw.innerHTML='<input type="range" id="todR" min="0" max="24" step="0.05" value="'+tod+'"><span id="todL">12:00</span><span id="seasL">'+tt('season1')+'</span>';
  var sl=document.getElementById('todR');
  sl.addEventListener('input',function(){tod=parseFloat(sl.value);updateTodUI();});
  showSpeedBar(); /*SPEED_BAR_FORCE*/ try{var _sb=document.getElementById('spdBar');if(_sb){_sb.style.display='flex';_sb.style.zIndex='9999';}}catch(_e){} updateLegend(); updateEcoPanel();
};

window.focusTarget = null; window.focusTimer = 0; window.cinematicTime = 1;

function gameLoop(ts){
  try{
  if(!lastT)lastT=ts;
  if(state==='playing'&&!player){state='gameover';}
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
    if (state === 'playing') {
      updateHUD();updateTopRight();updateWeather();updateEcoPanel();updateLegend();
      if(typeof updateScaleBar === 'function') updateScaleBar();
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
      else if(autoAI){cm.innerHTML='<span style="color:#0f0;text-shadow:0 0 5px #0f0;font-weight:bold;font-size:12px;">АВТО-ПИЛОТ ВКЛ</span>';cm.className='';cm.style.display='block';}
      else cm.style.display='none';
      if(gt>15)document.getElementById('keyHint').style.opacity='0.3';
    } else {
      // Menu Aquarium Logic
      if (!focusTarget) {
         cam.x += 20 * realDt;
         if(cam.x > PW) cam.x = -PW;
      }
    }
  }else if(state==='gameover'){showDeadScreen();state='dead';}
if(state==='playing'||state==='menu')render();
  requestAnimationFrame(gameLoop);
  }catch(e){console.error('gameLoop:',e.message,e.stack);requestAnimationFrame(gameLoop);}
}


// ========== ONBOARDING TUTORIAL (5 steps, real "Далее" clicks) ==========
window.tutorialStep = 0;
window.tutorialActive = false;
window.TUTORIAL_STEPS = [
  { title: 'Добро пожаловать', body: 'Вы — микроорганизм в луже. Цель: есть, расти, делиться. Нажмите «Далее».' },
  { title: 'Движение', body: 'WASD — плыть. Мышь задаёт направление. Попробуйте сдвинуться, затем «Далее».' },
  { title: 'Питание', body: 'Подойдите к меньшей клетке и нажмите ЕСТЬ (E). Должны появиться вспышка и «+энергия».' },
  { title: 'Деление', body: 'При полной энергии нажмите ДЕЛИТЬ (Q). Клетка станет заметно меньше — это нормально.' },
  { title: 'Готово', body: 'Камера: СЛЕДИТЬ / КАМЕРА. Режим: кнопка РЕАЛИСТИЧНЫЙ. Удачи в эволюции!' }
];

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
  title.textContent = s.title;
  body.textContent = s.body;
  counter.textContent = (window.tutorialStep+1) + ' / ' + window.TUTORIAL_STEPS.length;
  next.textContent = (window.tutorialStep === window.TUTORIAL_STEPS.length-1) ? 'Играть' : 'Далее';
  layer.style.display = 'flex';
  layer.style.pointerEvents = 'auto';
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
    if(window.showToast) window.showToast('Туториал пройден', '#4f4');
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
  if(selSpecies>=VIRUS_ID_START){sp=SPECIES_DB[0];selSpecies=0;}
  else sp=SPECIES_DB[selSpecies];
  // Never start as colony (Volvox/Gloeocapsa/Microcystis) — looks like green death-ball
  if(sp.shape==='colony'){
    for(var ci=0; ci<SPECIES_DB.length; ci++){
      if(SPECIES_DB[ci].cat==='consumer1' && SPECIES_DB[ci].shape!=='colony'){ selSpecies=ci; sp=SPECIES_DB[ci]; break; }
    }
  }
  var d=rng(PD*0.2,PD*0.5),hw=halfW(d)-20;
  
  if (isScreensaver) {
     window.spectatorMode = true;
     freeCam = true;
     window.screensaverAutoCam = true;
     player = null;
     cam.x = 0; cam.y = PD * 0.3;
  } else {
     window.spectatorMode = false;
     freeCam = false;
     // Always start near the surface (photosphere) — any species
     var dY = rng(18, 55);
     var hw0 = halfW(dY) - 30;
     var px = rng(-hw0*0.35, hw0*0.35);
     player=spawnOrg(sp, px, dY, true);
     if(!player)player=spawnOrg(sp,0,35,true);
     player.energy=100;player.facing=0;player.angle=0;player.aiTarget=null;cam.x=player.x;cam.y=player.y-20;player.acidResist=1.0;


     // Seed nearby food cluster so player sees action immediately
     var foodCats = FOOD[sp.cat] || ['producer','consumer1'];
     var foodPool = [];
     for(var si=0; si<SPECIES_DB.length; si++){
       if(foodCats.indexOf(SPECIES_DB[si].cat)>=0) foodPool.push(SPECIES_DB[si]);
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
         if(window.showToast) window.showToast('Инфузория: подплыви к бактериям/водорослям — реснички фильтруют сами', '#9cf');
       }, 900);
     }
  }
  
  // Start zoomed in enough to see neighbors (Spore/Agar feel)
  state='playing';zoom=1.8;tZoom=1.8;gt=0;fc=0;lastT=0;
  // Always start cartoon (user default). Realistic is opt-in via button only.
  try {
    if(!window._rmodeUserPicked){
      settings.renderMode = 'cartoon';
      if(typeof applyRenderMode==='function') applyRenderMode();
    }
  } catch(e){}
  
  document.getElementById('menuO').className='ov';
  document.getElementById('hud').style.display= isScreensaver ? 'none' : 'block';
  document.getElementById('topR').style.display='block';
  document.getElementById('weatherP').style.display='block';
  document.getElementById('actBar').style.display='flex';
  document.getElementById('renderModeBtn').style.display='block';
  if(settings.renderMode==='realistic'){var rb=document.getElementById('renderModeBtn');if(rb){rb.className='realistic';rb.innerHTML='🔬 РЕАЛИСТИЧНЫЙ';rb.title='Сейчас: реалистичный. Клик → мультяшный';}}
  else{var rb2=document.getElementById('renderModeBtn');if(rb2){rb2.className='cartoon';rb2.innerHTML='🎨 МУЛЬТЯШНЫЙ';rb2.title='Сейчас: мультяшный. Клик → реалистичный';}}
  var kh=document.getElementById('keyHint');
  kh.innerHTML='<div style="font-size:15px;font-weight:700;line-height:1.7;text-align:center">'+
    '<b>WASD</b> движение · <b>E</b> ЕСТЬ · <b>Q</b> ДЕЛИТЬ · <b>Tab</b> АВТО · <b>V</b> камера</div>';
  kh.style.display='flex';
  // Large Russian labels on primary action buttons
  function labelBtn(id, text, hk){
    var b=document.getElementById(id); if(!b) return;
    b.innerHTML = text + '<span class="hk">'+hk+'</span>';
    b.style.minWidth='72px'; b.style.padding='12px 16px'; b.style.fontSize='15px';
  }
  labelBtn('bEat','ЕСТЬ','авто');
  labelBtn('bDiv','ДЕЛИТЬ','Q');
  labelBtn('bCyst','ЦИСТА','R');
  labelBtn('bAuto','АВТО','Tab');
  labelBtn('bFree','КАМЕРА','F');
  labelBtn('bFol','СЛЕДИТЬ','V');
  document.getElementById('scaleW').style.display='block';
  var tw=document.getElementById('todWrap');
  tw.innerHTML='<input type="range" id="todR" min="0" max="24" step="0.05" value="'+tod+'"><span id="todL">12:00</span><span id="seasL">'+tt('season1')+'</span>';
  var sl=document.getElementById('todR');
  sl.addEventListener('mousedown',function(){sliderDragging=true;});
  sl.addEventListener('mouseup',function(){sliderDragging=false;tod=parseFloat(sl.value);});
  sl.addEventListener('input',function(){tod=parseFloat(sl.value);updateTodUI();});
  sl.addEventListener('touchstart',function(){sliderDragging=true;});
  sl.addEventListener('touchend',function(){sliderDragging=false;tod=parseFloat(sl.value);});
  showSpeedBar();updateLegend();updateEcoPanel();
  if(!isScreensaver){ setTimeout(function(){ window.startTutorial(false); }, 300); }
}

