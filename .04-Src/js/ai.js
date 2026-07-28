"use strict";

window.getNearby = function(x, y, radius) {
   var res=[];
   if(!window.spatialGrid) return orgs;
   var CELL=400; // Must match world.js spatial grid cell size
   var r = Math.ceil(radius/CELL);
   var cx = Math.floor(x/CELL);
   var cy = Math.floor(y/CELL);
   for(var gx=cx-r; gx<=cx+r; gx++){
     for(var gy=cy-r; gy<=cy+r; gy++){
        var arr = window.spatialGrid[gx+','+gy];
        if(arr) {
            for(var i=0; i<arr.length; i++) res.push(arr[i]);
        }
     }
   }
   return res;
};



function moveOrg(o,dt){
  var sp=o.sp;
  var speed=Math.max(sp.speed,0.8)*SPD_SCALE*0.05;
  if(o.isPlayer&&!freeCam) speed*=3;
  if(o.speedMult) speed*=o.speedMult;

  // PLAYER manual
  if(o.isPlayer&&!freeCam&&!autoAI&&!o.cyst&&!o.dying){
    var ax=0,ay=0;
    if(keys['w']||keys['arrowup'])ay-=1;
    if(keys['s']||keys['arrowdown'])ay+=1;
    if(keys['a']||keys['arrowleft'])ax-=1;
    if(keys['d']||keys['arrowright'])ax+=1;
    if(o.parasiticInfection){ ax=-ax; ay=-ay; }
    if(ax||ay){
      var m=Math.sqrt(ax*ax+ay*ay); ax/=m; ay/=m;
      o.vx+=ax*speed*dt*16; o.vy+=ay*speed*dt*16;
      o.angle=Math.atan2(ay,ax);
      o.aiTarget=null; o.aiState='manual';
    }
    if(mouseDown&&!moveTarget){
      var wx=cam.x+(mx-cv.width/2)/zoom, wy=cam.y+(my-cv.height/2)/zoom;
      var dx=wx-o.x, dy=wy-o.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d>5){ o.vx+=dx/d*speed*dt*16; o.vy+=dy/d*speed*dt*16; o.angle=Math.atan2(dy,dx); }
    }
    if(moveTarget){
      var dx=moveTarget.x-o.x, dy=moveTarget.y-o.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d>10){ o.vx+=dx/d*speed*dt*16; o.vy+=dy/d*speed*dt*16; o.angle=Math.atan2(dy,dx); }
      else moveTarget=null;
    }
  }
  // PLAYER autopilot — dedicated clean seeker (not full NPC AI)
  else if(o.isPlayer&&autoAI&&!o.cyst&&!o.dying){
    playerAutoAI(o, dt, speed);
  }
  // NPC
  else if(!o.isPlayer&&!o.cyst&&!o.dying){
    aiOrg(o, dt, speed);
  }

  // Smooth damping (stronger = less twitch)
  var damp = (o.isPlayer&&!freeCam) ? 0.88 : 0.92;
  var dampDt=clamp(dt,0,0.05);
  o.vx*=Math.pow(damp,dampDt*60);
  o.vy*=Math.pow(damp,dampDt*60);

  // Soft depth bias for NPC producers/decomposers only (gentle, not oscillation)
  if(!o.isPlayer){
    if(o.sp.cat==='producer') o.vy -= 0.05*dt;
    if(o.sp.cat==='decomposer') o.vy += 0.08*dt;
  }

  // Currents: very weak drift only (no spin)
  if(settings.currents&&!o.dying){
    var globalVx = Math.sin(o.y * 0.001 + fc * 0.001) * 1.2;
    var globalVy = Math.sin(o.x * 0.0008 + fc * 0.0007) * 0.5;
    o.vx += globalVx * dt * 0.4;
    o.vy += globalVy * dt * 0.4;
    if(typeof currents!=='undefined' && currents && currents.length){
      for(var i=0;i<currents.length;i++){
        var c=currents[i];
        var dd=(o.x-c.x)*(o.x-c.x)+(o.y-c.y)*(o.y-c.y);
        if(dd<c.r*c.r){
          var inf=(1-Math.sqrt(dd)/c.r)*c.strength*0.25;
          o.vx += Math.cos(c.a||0)*inf*dt;
          o.vy += Math.sin(c.a||0)*inf*dt;
        }
      }
    }
  }

  if(o.cyst) o.vy += 10 * dt;
  // Integrate
  o.x += o.vx * dt * 60;
  o.y += o.vy * dt * 60;
  if(typeof clampToPuddle==='function') clampToPuddle(o);
  else {
    if(typeof PW!=='undefined'){
      if(o.x<20){o.x=20;o.vx=Math.abs(o.vx)*0.5;}
      if(o.x>PW-20){o.x=PW-20;o.vx=-Math.abs(o.vx)*0.5;}
    }
    if(typeof PD!=='undefined'){
      if(o.y<20){o.y=20;o.vy=Math.abs(o.vy)*0.5;}
      if(o.y>PD-20){o.y=PD-20;o.vy=-Math.abs(o.vy)*0.5;}
    }
  }
  o.wobble=(o.wobble||0)+dt*2;
  o.pulse=(o.pulse||0)+dt*1.5;
  o.flagPhase=(o.flagPhase||0)+dt*8;
  o.cilPhase=(o.cilPhase||0)+dt*14;
  if(!o.isPlayer||autoAI||freeCam){
    var vmag=Math.abs(o.vx)+Math.abs(o.vy);
    if(vmag>0.3) o.angle=lerp(o.angle||0, Math.atan2(o.vy,o.vx), 0.08);
  }
  if(o.divCD>0) o.divCD-=dt;
}

// ---- PLAYER AUTOPILOT: lock target, swim straight, eat on contact ----
function playerAutoAI(o, dt, speed){
  o.state = 'auto';
  // Retarget only every ~0.4s or if target dead/far
  if(!o.aiTarget || !o.aiTarget.alive || o.aiRetargetT===undefined || o.aiRetargetT<=0){
    o.aiRetargetT = 0.45;
    o.aiTarget = findBestPrey(o, 900, true);
    if(!o.aiTarget){
      // explore: pick a wander point ahead and stick to it
      if(!o.wanderPt || o.wanderT===undefined || o.wanderT<=0){
        var ang = (o.angle||0) + (Math.random()-0.5)*0.9;
        o.wanderPt = { x: o.x + Math.cos(ang)*220, y: clamp(o.y + Math.sin(ang)*140, 40, PD-40) };
        o.wanderT = 1.2;
      }
    }
  } else {
    o.aiRetargetT -= dt;
  }
  if(o.wanderT!==undefined) o.wanderT -= dt;

  var tx, ty, hunting=false;
  if(o.aiTarget && o.aiTarget.alive){
    tx = o.aiTarget.x; ty = o.aiTarget.y; hunting=true;
    o.state='hunt';
  } else if(o.wanderPt){
    tx = o.wanderPt.x; ty = o.wanderPt.y;
    o.state='wander';
  } else {
    return;
  }

  var dx=tx-o.x, dy=ty-o.y, d=Math.sqrt(dx*dx+dy*dy);
  if(d < 6){
    if(!hunting){ o.wanderPt=null; o.wanderT=0; }
    return;
  }

  // Smooth steering toward target (no sideways juke, no random dash)
  var desiredAng = Math.atan2(dy, dx);
  // Blend angle gently
  var ca = o.angle || desiredAng;
  var da = desiredAng - ca;
  while(da>Math.PI) da-=Math.PI*2;
  while(da<-Math.PI) da+=Math.PI*2;
  o.angle = ca + da * Math.min(1, dt*6);

  var thr = speed * dt * 20;
  // Slight speed-up when close to food
  if(hunting && d < 100) thr *= 1.5;
  o.vx += Math.cos(o.angle) * thr;
  o.vy += Math.sin(o.angle) * thr;

  // Auto-eat when in range
  if(hunting && d < (o.size + o.aiTarget.size + 18)){
    if(typeof eatOrg==='function'){
      eatOrg(o, o.aiTarget);
      if(window.showToast) window.showToast('АВТО: съел', '#8f8');
    }
    o.aiTarget = null;
    o.aiRetargetT = 0.15;
  }
}

function findBestPrey(o, radius, forPlayer){
  var foodCats = FOOD[o.sp.cat] || [];
  var best=null, bd=1e15;
  var near = (window.getNearby ? window.getNearby(o.x,o.y,radius) : orgs);
  for(var i=0;i<near.length;i++){
    var p=near[i];
    if(!p||!p.alive||p===o||p.cyst) continue;
    if(p.invuln>0) continue;
    // For player: eat anything smaller OR in food chain
    var ok = false;
    if(forPlayer){
      ok = (p.size < o.size * 0.95) || (foodCats.indexOf(p.sp.cat)>=0 && p.size < o.size*1.05);
      // Producers can "graze" other producers/debris-like smaller cells
      if(o.sp.cat==='producer' && p.size < o.size*0.9) ok=true;
    } else {
      if(foodCats.indexOf(p.sp.cat)<0) continue;
      if(p.size >= o.size*0.88) continue;
      ok=true;
      if(p.isPlayer && (gt - (p.spawnTime||0)) < 20) continue;
    }
    if(!ok) continue;
    var d=dist2(o,p);
    if(d<bd && d < radius*radius){ bd=d; best=p; }
  }
  return best;
}

// ---- NPC AI: lock target, swim straight, rare retarget ----
function aiOrg(o,dt,speed){
  var cat=o.sp.cat, foodCats=FOOD[cat]||[];
  if(o.divCD>0){ o.state='idle'; return; }

  // Target lock timer
  if(o.aiRetargetT===undefined) o.aiRetargetT=0;
  o.aiRetargetT -= dt;

  // 1) Hunt with locked prey
  var needFood = o.energy < 90;
  if(needFood && foodCats.length>0){
    var prey = o.aiTarget;
    if(!prey || !prey.alive || o.aiRetargetT<=0 || o.aiMode!=='hunt'){
      prey = findBestPrey(o, 700, false);
      o.aiTarget = prey;
      o.aiRetargetT = 0.6 + Math.random()*0.4; // stick 0.6–1.0s
      o.aiMode = prey ? 'hunt' : 'wander';
    }
    if(prey && prey.alive){
      o.state='hunt';
      steerToward(o, prey.x, prey.y, speed, dt, 12);
      var d=Math.sqrt(dist2(o,prey));
      if(d < o.size+prey.size+8){
        if(typeof eatOrg==='function') eatOrg(o, prey);
        o.aiTarget=null; o.aiRetargetT=0.2;
      }
      return;
    }
  }

  // 2) Flee once from nearest larger predator (straight line, NO juke spiral)
  var near2 = window.getNearby ? window.getNearby(o.x,o.y,280) : orgs;
  var predator=null, pbd=1e15;
  for(var i=0;i<near2.length;i++){
    var q=near2[i];
    if(!q.alive||q===o||q.size<=o.size*1.15) continue;
    var fcq=FOOD[q.sp.cat]||[];
    if(fcq.indexOf(cat)<0) continue;
    var d2=dist2(o,q);
    if(d2<pbd){ pbd=d2; predator=q; }
  }
  if(predator && pbd < 220*220){
    o.state='flee';
    o.aiMode='flee';
    // Straight away — no perpendicular juke (that caused circling)
    var dx=o.x-predator.x, dy=o.y-predator.y, d=Math.sqrt(dx*dx+dy*dy)||1;
    o.vx += (dx/d)*speed*dt*14;
    o.vy += (dy/d)*speed*dt*14;
    o.angle = Math.atan2(dy,dx);
    return;
  }

  // 3) Purposeful wander: pick a point, go there, then pick new
  if(!o.wanderPt || o.wanderT===undefined || o.wanderT<=0){
    var baseAng = o.angle || (Math.random()*Math.PI*2);
    // Small course change, not full random spin
    var ang = baseAng + (Math.random()-0.5)*1.2;
    var dist = 140 + Math.random()*200;
    o.wanderPt = {
      x: clamp(o.x + Math.cos(ang)*dist, 40, PW-40),
      y: clamp(o.y + Math.sin(ang)*dist, 40, PD-40)
    };
    o.wanderT = 1.5 + Math.random()*1.5;
    o.aiMode='wander';
  }
  o.wanderT -= dt;
  o.state='wander';
  var wdx=o.wanderPt.x-o.x, wdy=o.wanderPt.y-o.y, wd=Math.sqrt(wdx*wdx+wdy*wdy);
  if(wd < 18){ o.wanderT=0; return; }
  steerToward(o, o.wanderPt.x, o.wanderPt.y, speed, dt, 8);
}

function steerToward(o, tx, ty, speed, dt, mul){
  var dx=tx-o.x, dy=ty-o.y, d=Math.sqrt(dx*dx+dy*dy)||1;
  var desired = Math.atan2(dy, dx);
  var ca = (typeof o.angle==='number' && isFinite(o.angle)) ? o.angle : desired;
  var da = desired - ca;
  while(da>Math.PI) da-=Math.PI*2;
  while(da<-Math.PI) da+=Math.PI*2;
  // Smooth turn — prevents spinning in place
  var turnRate = 4.5; // rad/sec-ish blend
  o.angle = ca + da * Math.min(1, dt*turnRate);
  var thr = speed * dt * (mul||10);
  o.vx += Math.cos(o.angle) * thr;
  o.vy += Math.sin(o.angle) * thr;
}
