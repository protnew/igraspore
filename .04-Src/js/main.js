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
    if (state === 'playing') {
      updateHUD();updateTopRight();updateWeather();updateEcoPanel();updateLegend();
      if(typeof updateScaleBar === 'function') updateScaleBar();
      if(fc%5===0 && typeof renderMinimap==='function')renderMinimap();if(fc%10===0 && typeof renderPopGraph==='function')renderPopGraph();
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
     player.energy=100;player.facing=0;player.angle=0;player.aiTarget=null;cam.x=player.x;cam.y=player.y;
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
  state='playing';zoom=3.5;tZoom=3.5;gt=0;fc=0;lastT=0;
  document.getElementById('menuO').className='ov';
  document.getElementById('hud').style.display= isScreensaver ? 'none' : 'block';
  document.getElementById('topR').style.display='block';
  document.getElementById('weatherP').style.display='block';
  document.getElementById('actBar').style.display='flex';
  document.getElementById('renderModeBtn').style.display='block';
  if(settings.renderMode==='realistic'){var rb=document.getElementById('renderModeBtn');if(rb){rb.className='realistic';rb.innerHTML='🔬 РЕАЛИСТИЧНЫЙ';}}
  else{var rb2=document.getElementById('renderModeBtn');if(rb2){rb2.className='cartoon';rb2.innerHTML='🎨 МУЛЬТЯШНЫЙ';}}
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

// === EVENT LISTENERS ===
cv.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
cv.addEventListener('mousedown',function(e){e.preventDefault();var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;
  if(e.button===0)mouseDown=true;
  if(e.button===2){var wx=cam.x+(mx-cv.width/2)/zoom,wy=cam.y+(my-cv.height/2)/zoom;moveTarget={x:wx,y:wy};}});
cv.addEventListener('mouseup',function(e){if(e.button===0)mouseDown=false;});
cv.addEventListener('contextmenu',function(e){e.preventDefault();});
cv.addEventListener('wheel',function(e){e.preventDefault();tZoom=clamp(tZoom*(e.deltaY>0?0.85:1.15),0.05,50);},{passive:false});

var touchId=null;
cv.addEventListener('touchstart',function(e){e.preventDefault();var t=e.touches[0];var r=cv.getBoundingClientRect();mx=t.clientX-r.left;my=t.clientY-r.top;mouseDown=true;touchId=t.identifier;},{passive:false});
cv.addEventListener('touchmove',function(e){e.preventDefault();for(var i=0;i<e.touches.length;i++){var t=e.touches[i];if(t.identifier===touchId){var r=cv.getBoundingClientRect();mx=t.clientX-r.left;my=t.clientY-r.top;break;}}},{passive:false});
cv.addEventListener('touchend',function(e){mouseDown=false;if(e.touches.length===0)touchId=null;},{passive:false});

// Web Audio API MVP (Task 40)
var audioCtx = null;
window.playSound = function(type, x, y) {
    if(!settings.sound) return;
    if(!audioCtx) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if(AudioContext) audioCtx = new AudioContext();
    }
    if(!audioCtx) return;
    
    // Pan based on x position relative to cam
    var pan = 0;
    if (x !== undefined && cam) {
        pan = (x - cam.x) / (window.innerWidth / 2);
        pan = Math.max(-1, Math.min(1, pan));
    }
    
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    
    // Stereo panner if available
    var panner = null;
    if(audioCtx.createStereoPanner) {
        panner = audioCtx.createStereoPanner();
        panner.pan.value = pan;
        osc.connect(panner);
        panner.connect(gain);
    } else {
        osc.connect(gain);
    }
    gain.connect(audioCtx.destination);
    
    var now = audioCtx.currentTime;
    if (type === 'eat') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'hurt') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
};


// UI toast — short feedback for actions
window.showToast = function(msg, color){
  var el = document.getElementById('toast');
  if(!el){
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;top:22%;left:50%;transform:translateX(-50%);z-index:50;padding:12px 22px;border-radius:10px;font-size:20px;font-weight:800;color:#fff;background:rgba(0,20,40,.88);border:2px solid #4af;pointer-events:none;opacity:0;transition:opacity .15s;text-shadow:0 2px 6px #000;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.borderColor = color || '#4af';
  el.style.color = color || '#fff';
  el.style.opacity = '1';
  clearTimeout(window._toastT);
  window._toastT = setTimeout(function(){ el.style.opacity = '0'; }, 900);
};

window.tryPlayerEat = function(){
  if(!player){ if(window.showToast) window.showToast('Нет игрока','#faa'); return false; }
  if(player.cyst) player.cyst=false;
  if(player.dying){ player.dying=false; player.deathT=0; }
  if(!player.alive){ player.alive=true; }
  if(player.energy<8) player.energy=20;

  // Prefer shared finder
  var best = null;
  if(typeof findBestPrey==='function') best = findBestPrey(player, 160, true);
  if(!best && typeof findBestPrey==='function') best = findBestPrey(player, 420, true);

  // Manual scan fallback
  if(!best){
    var bd=1e15, range2=Math.pow(Math.max(100, player.size*5+80),2);
    for(var i=0;i<orgs.length;i++){
      var p=orgs[i];
      if(!p||!p.alive||p===player||p.cyst) continue;
      var d=dist2(player,p);
      if(d<bd && d<range2 && p.size < player.size*1.3){ bd=d; best=p; }
    }
  }

  if(best){
    var d = Math.sqrt(dist2(player,best));
    var range = Math.max(90, player.size*4 + 70);
    if(d <= range){
      if(typeof forceEat==='function') return forceEat(player, best);
      // legacy
      best.divCD=0; best.invuln=0;
      eatOrg(player, best);
      if(window.showToast) window.showToast('Съел! +энергия','#8f8');
      return true;
    }
    // Pull toward
    var dx=best.x-player.x, dy=best.y-player.y, dd=Math.sqrt(dx*dx+dy*dy)||1;
    player.vx += dx/dd*10; player.vy += dy/dd*10;
    if(window.showToast) window.showToast('Ближе к добыче…','#fd8');
    return false;
  }
  if(window.showToast) window.showToast('Рядом нет добычи — включи АВТО или подплыви','#faa');
  return false;
};

window._playerContactEatT = 0;
window.playerContactEat = function(dt){
  if(!player||!player.alive||player.cyst) return;
  window._playerContactEatT -= (dt||0.016);
  if(window._playerContactEatT>0) return;
  window._playerContactEatT = 0.10;
  var range = player.size + 18;
  var range2 = range*range;
  for(var i=0;i<orgs.length;i++){
    var p=orgs[i];
    if(!p||!p.alive||p===player||p.cyst) continue;
    if(p.size >= player.size*1.15) continue;
    if(dist2(player,p) <= range2){
      if(typeof forceEat==='function') forceEat(player, p);
      else { p.divCD=0;p.invuln=0; eatOrg(player,p); }
      return;
    }
  }
};


var keys={};
document.addEventListener('keydown',function(e){
  var k=e.key.toLowerCase();keys[k]=true;
  if(k==='w'||k==='a'||k==='s'||k==='d'){if(freeCam)camKeys[k]=true;e.preventDefault();if(autoAI)autoAI=false;}
  if(k==='tab'){e.preventDefault();if(player&&player.alive)autoAI=!autoAI;}
  if(k==='f'){freeCam=!freeCam;camKeys={w:false,a:false,s:false,d:false};}
  if(k==='v'){
    // V: Toggle camera follow player
    if(freeCam){
      // Detached -> reattach to player
      freeCam=false;
      if(player&&player.alive){cam.x=player.x;cam.y=player.y;}
    } else {
      // Attached -> detach (free camera)
      freeCam=true;
    }
    camKeys={w:false,a:false,s:false,d:false};
  }
  if(k==='m'){document.getElementById('bMicro').click();}
  if(k==='n'){document.getElementById('bRender').click();}
  if(k==='b'){var wo=document.getElementById('wikiO');if(wo.className==='ov show')wo.className='ov';else{buildWiki();wo.className='ov show';}}
  if(k==='e'||e.code==='KeyE'){ e.preventDefault(); window.tryPlayerEat && window.tryPlayerEat(); }
  if(k==='q'){ if(player&&player.alive){ var okDiv=doDivide(player); if(window.showToast){ if(okDiv||player.dividing) window.showToast('Деление...','#8ff'); else window.showToast((window.divideBlockReason&&window.divideBlockReason(player))||'Пока нельзя делиться','#faa'); } } }
  if(k==='r'){if(player&&player.alive)doCyst(player);}
  if(k==='p'){if(state==='playing'){state='paused';document.getElementById('pauseO').className='ov show';}else if(state==='paused'){state='playing';document.getElementById('pauseO').className='ov';}}
});
document.addEventListener('keyup',function(e){var k=e.key.toLowerCase();keys[k]=false;if(k==='w'||k==='a'||k==='s'||k==='d')camKeys[k]=false;});

mm.addEventListener('click',function(e){var r=mm.getBoundingClientRect();var cx=(e.clientX-r.left-5)/(110-10)*PW*2-PW;var cy=(e.clientY-r.top-5)/(80-10)*PD;cam.x=cx;cam.y=cy;freeCam=true;window.screensaverAutoCam=false;});

document.getElementById('bEat').onclick=function(){ window.tryPlayerEat && window.tryPlayerEat(); };
document.getElementById('bDiv').onclick=function(){if(player&&player.alive){var okDiv=doDivide(player);if(window.showToast){if(okDiv||player.dividing)window.showToast('Деление...','#8ff');else window.showToast((window.divideBlockReason&&window.divideBlockReason(player))||'Пока нельзя делиться','#faa');}}};
document.getElementById('bCyst').onclick=function(){if(player&&player.alive)doCyst(player);};
document.getElementById('bAuto').onclick=function(){if(player&&player.alive)autoAI=!autoAI;};
document.getElementById('bFree').onclick=function(){freeCam=!freeCam;camKeys={w:false,a:false,s:false,d:false};if(window.showToast)window.showToast(freeCam?'Камера: СВОБОДНО':'Камера: СЛЕДИТ','#4af');};

document.getElementById('bMicro').onclick=function(){
  settings.microscopeMode=!settings.microscopeMode;
  // M = optics only. NEVER switch renderMode / black water (that is N / realistic).
  if(settings.microscopeMode){
    // Keep current cartoon/realistic palette; just magnify
    tZoom=Math.max(tZoom, 6);
    if(settings.renderMode==='realistic'){
      // if user was in phase-contrast, still OK — but do not force it ON
    }
    document.getElementById('bMicro').style.background='#1a4a6a';
    document.getElementById('bMicro').style.borderColor='#4af';
    if(window.showToast) window.showToast('🔬 Микроскоп: вода остаётся, зум+сетка (не режим N)','#8cf');
  } else {
    document.getElementById('bMicro').style.background='#012';
    document.getElementById('bMicro').style.borderColor='#345';
    if(window.showToast) window.showToast('Микроскоп выкл','#aaa');
  }
};
document.getElementById('bRender').onclick=function(){ toggleRenderModeLarge(); };
function toggleRenderModeLarge(){
  settings.renderMode = settings.renderMode==='realistic' ? 'cartoon' : 'realistic';
  applyRenderMode();
  var btn=document.getElementById('renderModeBtn');
  var smBtn=document.getElementById('bRender');
  if(settings.renderMode==='realistic'){
    if(btn){btn.className='realistic';btn.innerHTML='🔬 РЕАЛИСТИЧНЫЙ';}
    if(smBtn){smBtn.style.background='#4a3a1a';smBtn.style.borderColor='#fa4';}
  } else {
    if(btn){btn.className='cartoon';btn.innerHTML='🎨 МУЛЬТЯШНЫЙ';}
    if(smBtn){smBtn.style.background='#012';smBtn.style.borderColor='#345';}
  }
}
document.getElementById('bFol').onclick=function(){freeCam=false;autoAI=false;if(player&&player.alive){cam.x=player.x;cam.y=player.y;}if(window.showToast)window.showToast('Камера: СЛЕДИТ','#4af');};
document.getElementById('bWiki').onclick=function(){buildWiki();document.getElementById('wikiO').className='ov show';};
document.getElementById('bPause').onclick=function(){if(state==='playing'){state='paused';document.getElementById('pauseO').className='ov show';}else if(state==='paused'){state='playing';document.getElementById('pauseO').className='ov';}};
document.getElementById('bZI').onclick=function(){tZoom=clamp(tZoom*1.3,0.01,100);};
document.getElementById('bZO').onclick=function(){tZoom=clamp(tZoom/1.3,0.01,100);};

document.getElementById('startBtn').onclick=()=>startGame(false);
document.getElementById('screensaverBtn').onclick=()=>startGame(true);
document.getElementById('resBtn').onclick=function(){document.getElementById('pauseO').className='ov';state='playing';zoom=1;tZoom=1;};
document.getElementById('helpBtn').onclick=function(){document.getElementById('helpO').className='ov show';};
document.getElementById('helpClose').onclick=function(){document.getElementById('helpO').className='ov';};
document.getElementById('setBtn2').onclick=function(){buildSettings();document.getElementById('setO').className='ov show';};
document.getElementById('setClose').onclick=function(){document.getElementById('setO').className='ov';};
document.getElementById('wikiBtnMenu').onclick=function(){buildWiki();document.getElementById('wikiO').className='ov show';};
document.getElementById('wikiClose').onclick=function(){document.getElementById('wikiO').className='ov';};
document.getElementById('wikiSearch').addEventListener('input',function(e){buildWiki(e.target.value);});
document.getElementById('resBtn').onclick=function(){state='playing';document.getElementById('pauseO').className='ov';};
document.getElementById('pHelp').onclick=function(){document.getElementById('helpO').className='ov show';};
document.getElementById('pSet').onclick=function(){buildSettings();document.getElementById('setO').className='ov show';};
document.getElementById('pWiki').onclick=function(){buildWiki();document.getElementById('wikiO').className='ov show';};
document.getElementById('restartBtn').onclick=function(){document.getElementById('deadO').className='ov';document.getElementById('menuO').className='ov show';state='menu';};
document.getElementById('menuBtn').onclick=function(){document.getElementById('deadO').className='ov';document.getElementById('menuO').className='ov show';state='menu';};

window.addEventListener('resize',resize);
window.addEventListener('mousemove', function(e){window.mouseX=e.clientX;window.mouseY=e.clientY;});

// === INIT ===
resize();buildLangBar();buildDiff();buildCatSel();
for(var i=0;i<SPECIES_DB.length;i++)speciesPop[i]={alive:0,born:0,deaths:[0,0,0,0,0]};
buildSpeciesGrid();updateMenuTexts();initWorld();
requestAnimationFrame(gameLoop);

// Event delegation backup for tutorial buttons (capture phase)
document.addEventListener('click', function(e){
  var t = e.target;
  if(!t || !window.tutorialActive) return;
  var next = t.id==='tutNext' || (t.closest && t.closest('#tutNext'));
  var skip = t.id==='tutSkip' || (t.closest && t.closest('#tutSkip'));
  if(!next && !skip) return;
  e.preventDefault(); e.stopPropagation();
  if(window._tutClickLock) return;
  window._tutClickLock = true;
  setTimeout(function(){ window._tutClickLock=false; }, 120);
  if(next) window.advanceTutorial && window.advanceTutorial();
  else window.skipTutorial && window.skipTutorial();
}, true);

// Hard rebind action buttons (eat must always work)
(function(){
  function rebindActions(){
    var be=document.getElementById('bEat');
    if(be){ be.onclick=function(ev){ if(ev){ev.preventDefault();ev.stopPropagation();} window.tryPlayerEat&&window.tryPlayerEat(); }; }
    var bd=document.getElementById('bDiv');
    if(bd){ bd.onclick=function(ev){ if(ev){ev.preventDefault();ev.stopPropagation();} if(player&&player.alive){ var ok=doDivide(player); if(window.showToast){ if(ok||player.dividing) window.showToast('Деление!','#8ff'); else window.showToast((window.divideBlockReason&&window.divideBlockReason(player))||'Пока нельзя','#faa'); } } }; }
    var ba=document.getElementById('bAuto');
    if(ba){ ba.onclick=function(ev){ if(ev){ev.preventDefault();ev.stopPropagation();} autoAI=!autoAI; ba.classList.toggle('on', !!autoAI); if(window.showToast) window.showToast(autoAI?'АВТО: вкл':'АВТО: выкл', autoAI?'#8f8':'#aaa'); }; }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', rebindActions);
  else rebindActions();
  window.rebindActions = rebindActions;
})();
