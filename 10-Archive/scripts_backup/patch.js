const fs = require('fs');

function patchFile(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  let newContent = replacer(content);
  fs.writeFileSync(path, newContent, 'utf8');
  console.log(`Patched ${path}`);
}

// 1. Patch main.js (Spectator & AudioContext)
patchFile('js/main.js', txt => {
  // Add global audioCtx and playSound
  txt = txt.replace('"use strict";', `"use strict";
window.audioCtx = null;
window.spectatorMode = false;
window.initAudio = function() {
  if (!window.audioCtx) {
    try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
  }
};
window.playSound = function(type) {
  if (!window.audioCtx) return;
  try {
    let t = window.audioCtx.currentTime;
    let osc = window.audioCtx.createOscillator();
    let gain = window.audioCtx.createGain();
    osc.connect(gain); gain.connect(window.audioCtx.destination);
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
`);
  // Hook initAudio into startGame
  txt = txt.replace('function startGame(){', 'function startGame(){\n  window.spectatorMode = false;\n  window.initAudio();');
  return txt;
});

// 2. Patch world.js (Temp penalty, Spectator Camera, Audio hooks)
patchFile('js/world.js', txt => {
  // Add temp penalty to energy calculation
  // Wait, the previous AI already added temp penalty! I'll just leave it.
  
  // Add playSound to divide
  txt = txt.replace('o.energy*=0.5;', 'o.energy*=0.5; if(o===player||window.spectatorMode) window.playSound("divide");');
  
  // Add playSound to eat
  txt = txt.replace('tgt.energy=0;tgt.dying=true;', 'tgt.energy=0;tgt.dying=true; if(o===player||window.spectatorMode) window.playSound("eat");');

  // Spectator mode camera update
  txt = txt.replace('if(player&&!freeCam){', `
  if (window.spectatorMode && !freeCam && orgs.length > 0) {
    let biggest = null; let bSz = 0;
    for(let i=0; i<orgs.length; i++){
      if(orgs[i].alive && orgs[i].size > bSz){ bSz = orgs[i].size; biggest = orgs[i]; }
    }
    if(biggest) {
      cam.x += (biggest.x - cam.x)*dt*2;
      cam.y += (biggest.y - cam.y)*dt*2;
    }
  } else if(player&&!freeCam){`);
  return txt;
});

// 3. Patch index.html (Add Spectator Button)
patchFile('index.html', txt => {
  txt = txt.replace('<button id="startBtn" class="btn" style="margin-top:15px">START</button>', 
    '<button id="startBtn" class="btn" style="margin-top:15px">START</button><br><button id="specBtn" class="btn" style="margin-top:5px;background:#1a3a55;border-color:#4af">Watch Simulation (AI)</button>');
  return txt;
});

// 4. Patch ui.js (Attach Spectator Button event, modify Wiki)
patchFile('js/ui.js', txt => {
  // Attach event
  txt = txt.replace("document.getElementById('menuBtn').onclick", "document.getElementById('specBtn').onclick=window.startSpectator;\n  document.getElementById('menuBtn').onclick");
  
  // HUD Update for Temp + Spectator Name
  txt = txt.replace("h.innerHTML='<div class=\"nm\">'+player.sp.name+'</div><div class=\"la\">'+tt(player.sp.cat)+'</div>'+", 
    "var pName = window.spectatorMode ? 'AI Spectator' : player.sp.name; var pCat = window.spectatorMode ? 'observer' : tt(player.sp.cat); h.innerHTML='<div class=\"nm\">'+pName+'</div><div class=\"la\">'+pCat+'</div>'+");
  
  // Display temp in HUD
  // Find player.age.toFixed
  txt = txt.replace("+'<div class=\"st\">'+tt('age')+': '+Math.floor(player.age)+' / '+player.sp.minAge*3", 
    "+'<div class=\"st\">'+tt('age')+': '+Math.floor(player.age)+' / '+player.sp.minAge*3+'</div><div class=\"st\">'+tt('temp')+': '+(window.spectatorMode ? s.temp.toFixed(1) : s.temp.toFixed(1))+' &deg;C'");
  
  return txt;
});
