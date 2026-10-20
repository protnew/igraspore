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
  cam.x = 0; cam.y = 0; state = 'playing'; gt = 0; fc = 0;
  document.getElementById('menuO').className='ov';
  document.getElementById('hud').style.display='block';
  document.getElementById('spdBar').style.display='flex';
  document.getElementById('todWrap').style.display='flex';
  document.getElementById('scaleW').style.display='block';
  var tw=document.getElementById('todWrap');
  tw.innerHTML='<input type="range" id="todR" min="0" max="24" step="0.05" value="'+tod+'"><span id="todL">12:00</span><span id="seasL">'+tt('season1')+'</span>';
  var sl=document.getElementById('todR');
  sl.addEventListener('input',function(){tod=parseFloat(sl.value);updateTodUI();});
  showSpeedBar(); updateLegend(); updateEcoPanel();
};

window.focusTarget = null; window.focusTimer = 0; window.cinematicTime = 1;

function gameLoop(ts){
  try{
  if(!lastT)lastT=ts;
  if(state==='playing'&&!player){ if(window.__igsDemo&&window.demoRespawn){window.demoRespawn();} else state='gameover'; }
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
      else if(autoAI){cm.innerHTML='<span style="color:#0f0;text-shadow:0 0 5px #0f0;font-weight:bold;font-size:12px;">'+tt('autoPilotOn')+'</span>';cm.className='';cm.style.display='block';}
      else cm.style.display='none';
      // FR-B4.4: в демо погибшую клетку замещает другая ≤2 с
      if(window.__igsDemo&&(!player||!player.alive)&&window.demoRespawn)window.demoRespawn();
      if(window.__igsDemo&&(fc%60===0)&&window.demoMaintain)window.demoMaintain();
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
  { title: function(){return tt('tut1t')}, body: function(){return tt('tut1b')} },
  { title: function(){return tt('tut2t')}, body: function(){return tt('tut2b')} },
  { title: function(){return tt('tut3t')}, body: function(){return tt('tut3b')} },
  { title: function(){return tt('tut4t')}, body: function(){return tt('tut4b')} },
  { title: function(){return tt('tut5t')}, body: function(){return tt('tut5b')} }
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
  title.textContent = (typeof s.title==='function')?s.title():s.title;
  body.textContent = (typeof s.body==='function')?s.body():s.body;
  counter.textContent = (window.tutorialStep+1) + ' / ' + window.TUTORIAL_STEPS.length;
  next.textContent = (window.tutorialStep === window.TUTORIAL_STEPS.length-1) ? tt('tutPlay') : tt('tutNext');
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
    if(window.showToast) window.showToast(tt('tutPassed'), '#4f4');
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
     // B4 (TZ v20): живое демо — клетка-игрок на автопилоте, камера следит с 1-го кадра
     window.__igsDemo = true;
     window.spectatorMode = false;
     freeCam = false;
     window.screensaverAutoCam = false;
     window.lastInteractionTime = 0;
     var demoPool = [];
     for(var dpi=0; dpi<SPECIES_DB.length; dpi++){
       if(SPECIES_DB[dpi].cat==='consumer1' && SPECIES_DB[dpi].shape!=='colony') demoPool.push(SPECIES_DB[dpi]);
     }
     if(!demoPool.length) demoPool=[SPECIES_DB[0]];
     var dsp = demoPool[Math.floor(rng(0, demoPool.length)) % demoPool.length];
     var dD = rng(PD*0.25, PD*0.5), dHw = halfW(dD)-30;
     player = spawnOrg(dsp, rng(-dHw*0.4, dHw*0.4), dD, true);
     if(player){
       player.energy=100; player.aiTarget=null; player.facing=0;
       cam.x=player.x; cam.y=player.y-10;
     }
     autoAI = true;
     // FR-B4.2: гарантируем ≥30 живых организмов рядом с камерой
     var _need=40, _have=0;
     for(var _hi=0;_hi<orgs.length;_hi++){ var _ho=orgs[_hi]; if(_ho&&_ho.alive&&Math.abs(_ho.x-cam.x)<380&&Math.abs(_ho.y-cam.y)<240)_have++; }
     window.demoBring(_need-_have);
     // B5: плашка DEMO + кнопка ×
     window.showDemoChrome && window.showDemoChrome(dsp);
  } else {
     window.spectatorMode = false;
     freeCam = false;
     // Always start near the surface (photosphere) — any species
     var dY = rng(18, 55);
     var hw0 = halfW(dY) - 30;
     var px = rng(-hw0*0.35, hw0*0.35);
     player=spawnOrg(sp, px, dY, true);
     if(!player)player=spawnOrg(sp,0,35,true);
     player.energy=100;player.facing=0;player.angle=0;player.aiTarget=null;cam.x=player.x;cam.y=player.y-20;
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
         if(window.showToast) window.showToast(tt('ciliateTip'), '#9cf');
       }, 900);
     }
  }
  
  // Start zoomed in enough to see neighbors (Spore/Agar feel)
  state='playing';zoom=1.2;tZoom=1.2;gt=0;fc=0;lastT=0;
  document.getElementById('menuO').className='ov';
  document.getElementById('hud').style.display= isScreensaver ? 'none' : 'block';
  if(isScreensaver){ // FR-B4.3: в демо левый HUD статов скрыт (кроме плашки DEMO)
    document.getElementById('topR').style.display='none';
    document.getElementById('weatherP').style.display='none';
  }
  document.getElementById('topR').style.display='block';
  document.getElementById('weatherP').style.display='block';
  document.getElementById('actBar').style.display='flex';
  document.getElementById('renderModeBtn').style.display='block';
  if(settings.renderMode==='realistic'){var rb=document.getElementById('renderModeBtn');if(rb){rb.className='realistic';rb.innerHTML=tt('modeReal');}}
  else{var rb2=document.getElementById('renderModeBtn');if(rb2){rb2.className='cartoon';rb2.innerHTML=tt('modeCartoon');}}
  var kh=document.getElementById('keyHint');
  kh.innerHTML='<div style="font-size:15px;font-weight:700;line-height:1.7;text-align:center">'+tt('khLine')+'</div>';
  kh.style.display='flex';
  // Large Russian labels on primary action buttons
  function labelBtn(id, text, hk){
    var b=document.getElementById(id); if(!b) return;
    b.innerHTML = text + '<span class="hk">'+hk+'</span>';
    b.style.minWidth='72px'; b.style.padding='12px 16px'; b.style.fontSize='15px';
  }
  labelBtn('bEat',tt('eatBtn'),'auto');
  labelBtn('bDiv',tt('divBtn'),'Q');
  labelBtn('bCyst',tt('cystBtn'),'R');
  labelBtn('bAuto',tt('autoBtn'),'Tab');
  labelBtn('bFree',tt('camBtn'),'F');
  labelBtn('bFol',tt('folBtn'),'V');
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
  if(!isScreensaver){
    var shown=window.showIntroCard(sp);
    setTimeout(function(){ if(!shown||document.getElementById('introO').className!=='ov show') window.startTutorial(false); }, 300);
  }
}

// === B4/B5 (TZ v20): демо-хром и выход из демо ===
window.showDemoChrome = function(sp){
  var b=document.getElementById('demoBadge'), x=document.getElementById('demoExit');
  if(b){ b.textContent=tt('demoBadge')+' · '+(sp?sp.name:''); b.style.display='block'; }
  if(x){ x.title=tt('demoExitTip'); x.setAttribute('aria-label',tt('demoExitTip')); x.style.display='flex'; }
};
window.exitDemoCleanup = function(){
  var b=document.getElementById('demoBadge'), x=document.getElementById('demoExit');
  if(b) b.style.display='none';
  if(x) x.style.display='none';
};
window.exitDemo = function(){
  if(!window.__igsDemo) return;
  window.__igsDemo=false;
  window.spectatorMode=false; freeCam=false; autoAI=false;
  window.exitDemoCleanup();
  player=null; state='menu';
  document.getElementById('menuO').className='ov show';
  hideGameHud();
};
// FR-B4.2: досев переносом дальних организмов в зону камеры (spawnOrg упирается в MAX_ORG)
window.demoBring = function(n){
  if(!(n>0)) return;
  var far=[];
  for(var k=0;k<orgs.length;k++){var o=orgs[k];
    if(o&&o.alive&&!o.isPlayer&&o.sp.cat!=='virus'&&(Math.abs(o.x-cam.x)>700||Math.abs(o.y-cam.y)>500))far.push(o);}
  for(var q=0;q<n&&q<far.length;q++){
    var mv=far[Math.floor(Math.random()*far.length)];
    if(!mv||!mv.alive)continue;
    mv.x=cam.x+rng(-380,380); mv.y=clamp(cam.y+rng(-240,240),6,PD-6);
    mv.aiTarget=null;
  }
};
window.demoMaintain = function(){
  if(!window.__igsDemo || state!=='playing') return;
  var vL=cam.x-cv.width/2/zoom, vR=cam.x+cv.width/2/zoom, vT=cam.y-cv.height/2/zoom, vB=cam.y+cv.height/2/zoom;
  var vis=0; for(var k=0;k<orgs.length;k++){var o=orgs[k]; if(o&&o.alive&&o.x>vL&&o.x<vR&&o.y>vT&&o.y<vB)vis++;}
  if(vis<40) window.demoBring(Math.min(20, 44-vis));
};
window.demoRespawn = function(){
  if(!window.__igsDemo) return;
  var pool=[];
  for(var i=0;i<orgs.length;i++){ var o=orgs[i]; if(o&&o.alive&&o.sp.cat==='consumer1'&&o.sp.shape!=='colony') pool.push(o); }
  if(!pool.length) return;
  var pick=pool[Math.floor(Math.random()*pool.length)];
  if(player&&player.alive) return;
  pick.isPlayer=true; pick.energy=100; pick.invuln=3;
  player=pick; autoAI=true; freeCam=false;
  var b=document.getElementById('demoBadge');
  if(b) b.textContent=tt('demoBadge')+' · '+pick.sp.name;
};

// === B6 (TZ v20): карточка «Кто ты» — один раз на вид, игра на паузе ===
window.showIntroCard = function(sp){
  var el=document.getElementById('introO'); if(!el) return false;
  var seen=false; try{ seen=localStorage.getItem('igs.intro.'+sp.id)==='1'; }catch(e){}
  if(seen) return false;
  var eats=(FOOD&&FOOD[sp.cat])||[];
  var eatsTxt=eats.length?eats.map(function(c){return tt(c)}).join(', '):(sp.cat==='producer'?tt('producer'):tt('consumer1'));
  document.getElementById('introTitle').textContent=tt('whoYouAre')+': '+sp.name;
  document.getElementById('introBody').innerHTML='<b>'+tt('youEat')+':</b> '+eatsTxt+' · <b>'+tt('energy')+':</b> 100';
  document.getElementById('introOk').textContent=tt('gotIt');
  el.className='ov show';
  state='paused';
  return true;
};
window.closeIntroCard = function(){
  var el=document.getElementById('introO'); if(!el) return;
  el.className='ov';
  if(player&&player.sp){ try{ localStorage.setItem('igs.intro.'+player.sp.id,'1'); }catch(e){} }
  if(state==='paused') state='playing';
};
