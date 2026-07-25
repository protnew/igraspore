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
      if(fc%5===0)renderMinimap();if(fc%10===0)renderPopGraph();
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

function startGame(isScreensaver){
  window.initAudio();
  initWorld();var sp;
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
     var dY = 100;
     var hw = halfW(dY);
     player=spawnOrg(sp, hw * 0.8, dY, true);
     if(!player)player=spawnOrg(sp,0,PD*0.3,true);
     player.energy=100;cam.x=player.x;cam.y=player.y;zoom=3;tZoom=3;
  }
  
  state='playing';gt=0;fc=0;lastT=0;
  document.getElementById('menuO').className='ov';
  document.getElementById('hud').style.display= isScreensaver ? 'none' : 'block';
  document.getElementById('topR').style.display='block';
  document.getElementById('weatherP').style.display='block';
  document.getElementById('actBar').style.display='flex';
  document.getElementById('renderModeBtn').style.display='block';
  if(settings.renderMode==='realistic'){var rb=document.getElementById('renderModeBtn');if(rb){rb.className='realistic';rb.innerHTML='🔬 РЕАЛИСТИЧНЫЙ';}}
  else{var rb2=document.getElementById('renderModeBtn');if(rb2){rb2.className='cartoon';rb2.innerHTML='🎨 МУЛЬТЯШНЫЙ';}}
  var kh=document.getElementById('keyHint');
  kh.innerHTML='<div style="font-size:11px;line-height:1.6">'+
    '<b>WASD</b> — движение | <b>Мышь</b> — направление | <b>E</b> — есть | <b>Q</b> — делиться<br>'+
    '<b>R</b> — циста | <b>Tab</b> — автопилот | <b>F</b> — своб.камера | <b>M</b> — микроскоп | <b>N</b> — режим<br>'+
    '<b>V</b> — следовать | <b>B</b> — вики | <b>P</b> — пауза | Колесо — зум</div>';
  kh.style.display='flex';
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
  if(k==='e'){if(player&&player.alive&&!player.dying){var best=null,bd=99999;var fc2=FOOD[player.sp.cat]||[];
    for(var i=0;i<orgs.length;i++){var p=orgs[i];if(!p.alive||p===player||p.cyst||p.divCD>0)continue;
      if(fc2.indexOf(p.sp.cat)<0)continue;if(p.size>=player.size*0.88)continue;var d=dist2(player,p);if(d<bd){bd=d;best=p;}}
    if(best&&bd<(player.size+best.sp.size+40)*(player.size+best.sp.size+40))eatOrg(player,best);}}
  if(k==='q'){if(player&&player.alive)doDivide(player);}
  if(k==='r'){if(player&&player.alive)doCyst(player);}
  if(k==='p'){if(state==='playing'){state='paused';document.getElementById('pauseO').className='ov show';}else if(state==='paused'){state='playing';document.getElementById('pauseO').className='ov';}}
});
document.addEventListener('keyup',function(e){var k=e.key.toLowerCase();keys[k]=false;if(k==='w'||k==='a'||k==='s'||k==='d')camKeys[k]=false;});

mm.addEventListener('click',function(e){var r=mm.getBoundingClientRect();var cx=(e.clientX-r.left-5)/(110-10)*PW*2-PW;var cy=(e.clientY-r.top-5)/(80-10)*PD;cam.x=cx;cam.y=cy;freeCam=true;window.screensaverAutoCam=false;});

document.getElementById('bEat').onclick=function(){if(player&&player.alive){var best=null,bd=99999;var fc2=FOOD[player.sp.cat]||[];
  for(var i=0;i<orgs.length;i++){var p=orgs[i];if(!p.alive||p===player||p.cyst||p.divCD>0)continue;if(fc2.indexOf(p.sp.cat)<0)continue;if(p.size>=player.size*0.88)continue;var d=dist2(player,p);if(d<bd){bd=d;best=p;}}
  if(best&&bd<(player.size+best.sp.size+40)*(player.size+best.sp.size+40))eatOrg(player,best);}};
document.getElementById('bDiv').onclick=function(){if(player&&player.alive)doDivide(player);};
document.getElementById('bCyst').onclick=function(){if(player&&player.alive)doCyst(player);};
document.getElementById('bAuto').onclick=function(){if(player&&player.alive)autoAI=!autoAI;};
document.getElementById('bFree').onclick=function(){freeCam=!freeCam;camKeys={w:false,a:false,s:false,d:false};};

document.getElementById('bMicro').onclick=function(){
  settings.microscopeMode=!settings.microscopeMode;
  applyRenderMode();
  if(settings.microscopeMode){
    tZoom=Math.max(tZoom,8); // Zoom in for microscope view
    document.getElementById('bMicro').style.background='#1a4a6a';
    document.getElementById('bMicro').style.borderColor='#4af';
  } else {
    document.getElementById('bMicro').style.background='#012';
    document.getElementById('bMicro').style.borderColor='#345';
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
document.getElementById('bFol').onclick=function(){freeCam=false;autoAI=false;};
document.getElementById('bWiki').onclick=function(){buildWiki();document.getElementById('wikiO').className='ov show';};
document.getElementById('bPause').onclick=function(){if(state==='playing'){state='paused';document.getElementById('pauseO').className='ov show';}else if(state==='paused'){state='playing';document.getElementById('pauseO').className='ov';}};
document.getElementById('bZI').onclick=function(){tZoom=clamp(tZoom*1.3,0.01,100);};
document.getElementById('bZO').onclick=function(){tZoom=clamp(tZoom/1.3,0.01,100);};

document.getElementById('startBtn').onclick=()=>startGame(false);
document.getElementById('screensaverBtn').onclick=()=>startGame(true);
document.getElementById('resBtn').onclick=function(){document.getElementById('pauseO').className='ov';state='playing';};
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
