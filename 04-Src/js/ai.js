"use strict";

window.getNearby = function(x, y, radius) {
   var res=[];
   if(!window.spatialGrid) return orgs;
   var CELL=400;
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
   // Fallback: if grid empty / too sparse, scan all (still rare)
   if(res.length < 3 && orgs && orgs.length) {
     // also pull a few global candidates for hunters
     for(var i=0;i<orgs.length && res.length<40;i++){
       var o=orgs[i];
       if(!o||!o.alive) continue;
       var dx=o.x-x, dy=o.y-y;
       if(dx*dx+dy*dy <= radius*radius) res.push(o);
     }
   }
   return res;
};

function ensureFacing(o){
  if(typeof o.facing !== 'number' || !isFinite(o.facing)){
    o.facing = (typeof o.angle==='number' && isFinite(o.angle)) ? o.angle : (Math.random()*Math.PI*2);
  }
  // keep o.angle in sync for legacy code
  o.angle = o.facing;
}

/** Smooth heading toward desired direction (rad). No continuous spin. */
function turnToward(o, desired, dt, turnSpeed){
  ensureFacing(o);
  var da = desired - o.facing;
  while(da >  Math.PI) da -= Math.PI*2;
  while(da < -Math.PI) da += Math.PI*2;
  var maxTurn = (turnSpeed||2.8) * dt; // rad/sec
  if(da >  maxTurn) da =  maxTurn;
  if(da < -maxTurn) da = -maxTurn;
  o.facing += da;
  o.angle = o.facing;
}

function thrustAlongFacing(o, speed, dt, mul){
  ensureFacing(o);
  // Cap thrust: high mul near prey caused "teleport dashes"
  var m = Math.min(mul||12, o.isPlayer ? 16 : 12);
  var thr = speed * dt * m;
  o.vx += Math.cos(o.facing) * thr;
  o.vy += Math.sin(o.facing) * thr;
}

function moveOrg(o,dt){
  var sp=o.sp;
  // Respect species speed; tiny floor only so zero-speed never NaNs physics
  var speed=Math.max(sp.speed, 0.01)*SPD_SCALE*0.05;
  if(o.isPlayer){
    // Soft hierarchy multipliers — NO hard floors that erase balance
    var cat = o.sp && o.sp.cat;
    if(cat==='producer'){
      speed *= 0.75; // еле плавает
    } else if(cat==='consumer1'){
      speed *= 1.0;
    } else if(cat==='consumer2'){
      speed *= 1.15;
    } else if(cat==='consumer3' || cat==='macrophage'){
      speed *= 1.35;
    } else {
      speed *= 0.95;
    }
  }
  if(o.speedMult) speed *= o.speedMult;
  ensureFacing(o);

  // ---- PLAYER MANUAL ----
  // Always controllable (even if freeCam) unless pure autoAI
  if(o.isPlayer && !autoAI && !o.cyst && !o.dying){
    var ax=0, ay=0;
    if(keys['w']||keys['arrowup']) ay-=1;
    if(keys['s']||keys['arrowdown']) ay+=1;
    if(keys['a']||keys['arrowleft']) ax-=1;
    if(keys['d']||keys['arrowright']) ax+=1;
    if(o.parasiticInfection){ ax=-ax; ay=-ay; }
    if(ax||ay){
      var m=Math.sqrt(ax*ax+ay*ay); ax/=m; ay/=m;
      // Strong direct swim (microbe games need snappy control)
      var thr = Math.max(speed, 1.2) * dt * 90;
      o.vx += ax * thr;
      o.vy += ay * thr;
      // Burst toward surface when holding up
      if(ay < 0){
        o.vy -= Math.max(2.5, thr * 1.2);
      }
      turnToward(o, Math.atan2(ay,ax), dt, 16);
      o.aiTarget=null; o.aiState='manual';
    }
    if(mouseDown && !moveTarget){
      var wx=cam.x+(mx-cv.width/2)/zoom, wy=cam.y+(my-cv.height/2)/zoom;
      var dx=wx-o.x, dy=wy-o.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d>8){
        turnToward(o, Math.atan2(dy,dx), dt, 10);
        thrustAlongFacing(o, speed, dt, 18);
      }
    }
    if(moveTarget){
      var dx=moveTarget.x-o.x, dy=moveTarget.y-o.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d>12){
        turnToward(o, Math.atan2(dy,dx), dt, 8);
        thrustAlongFacing(o, speed, dt, 18);
      } else moveTarget=null;
    }
  }
  // ---- PLAYER AUTOPILOT ----
  else if(o.isPlayer && autoAI && !o.cyst && !o.dying){
    playerAutoAI(o, dt, speed);
  }
  // ---- NPC: natural run-and-tumble ----
  else if(!o.isPlayer && !o.cyst && !o.dying){
    naturalAI(o, dt, speed);
  }

  // Linear damping (fluid drag) — no angular noise
  var damp = o.isPlayer ? 0.88 : 0.93;
  var dampDt = clamp(dt, 0, 0.05);
  o.vx *= Math.pow(damp, dampDt*60);
  o.vy *= Math.pow(damp, dampDt*60);

  // Hard speed ceiling — prevents rare "rocket" bursts (timeScale / stacked thrust)
  var maxSwim = (o.isPlayer ? 18 : 6.5) * (o.speedMult || 1) * Math.max(0.6, Math.min(1.4, (sp.speed||1)/2));
  if(o.state === 'flee') maxSwim *= 1.15;
  if(o.state === 'hunt' && (o.energy||0) < 40) maxSwim *= 0.7; // weak when starving
  var spNow = Math.sqrt(o.vx*o.vx + o.vy*o.vy);
  if(spNow > maxSwim && spNow > 1e-6){
    var sc = maxSwim / spNow;
    o.vx *= sc; o.vy *= sc;
  }

  // Kill sideways orbit: keep velocity mostly along facing when moving
  var spMag = Math.sqrt(o.vx*o.vx + o.vy*o.vy);
  if(spMag > 0.4 && (!o.isPlayer || autoAI || freeCam)){
    var fx=Math.cos(o.facing), fy=Math.sin(o.facing);
    var along = o.vx*fx + o.vy*fy;
    if(along < 0) along = 0; // don't reverse into spin
    // blend 85% along heading, 15% residual
    o.vx = o.vx*0.15 + fx * along * 0.85;
    o.vy = o.vy*0.15 + fy * along * 0.85;
  }

  // Very weak environmental drift (currents) — translation only, NO torque
  if(settings.currents && !o.dying && !o.cyst){
    var globalVx = Math.sin(o.y * 0.0008 + (fc||0) * 0.0005) * 0.6;
    var globalVy = Math.sin(o.x * 0.0006 + (fc||0) * 0.0004) * 0.25;
    o.vx += globalVx * dt * 0.35;
    o.vy += globalVy * dt * 0.35;
  }

  if(o.cyst) o.vy += 8 * dt;

  // Integrate position
  o.x += o.vx * dt * 60;
  o.y += o.vy * dt * 60;

  if(typeof clampToPuddle === 'function') clampToPuddle(o);
  else {
    if(typeof PW!=='undefined'){
      if(o.x<20){o.x=20;o.vx=Math.abs(o.vx)*0.4; turnToward(o, 0, 1, 20);}
      if(o.x>PW-20){o.x=PW-20;o.vx=-Math.abs(o.vx)*0.4; turnToward(o, Math.PI, 1, 20);}
    }
    if(typeof PD!=='undefined'){
      // Surface y≈0 reachable (sky only above -12)
      
  // SURFACE_REACH_BOOST: player can always swim up to waterline (y=0)
  if(o.isPlayer && o.y < 80){
    // if holding up / thrusting toward surface, don't damp vertical
    if(o.vy < -0.2) o.vy *= 1.15;
  }
  if(o.y < 1){ o.y = 1; if(o.vy<0) o.vy = Math.abs(o.vy)*0.3; } // NEVER above surface
      if(o.y > PD-12){ o.y = PD-12; if(o.vy>0) o.vy = -Math.abs(o.vy)*0.35; }
    }
  }

  // Gentle visual phase — slow at any zoom (organs must not "vibrate")
  o.wobble = (o.wobble||0) + dt * 0.35;
  o.pulse = (o.pulse||0) + dt * 0.45;
  o.flagPhase = (o.flagPhase||0) + dt * 2.2;
  o.cilPhase = (o.cilPhase||0) + dt * 3.5;

  if(o.divCD>0) o.divCD -= dt;
}

// ============================================================
// PLAYER AUTOPILOT — always hunts edible targets
// ============================================================
function playerAutoAI(o, dt, speed){
  o.state = 'auto';
  var en = (typeof o.energy === 'number') ? o.energy : 50;

  // Critical energy: stop long chases, only contact food
  if(en < 25){
    o.aiTarget = null;
    runAndTumble(o, dt, speed * 0.5, 0.45);
    o.state = 'rest';
    return;
  }

  // Retarget when missing/dead or timer expired
  if(o.aiRetargetT === undefined) o.aiRetargetT = 0;
  if(o.huntT === undefined) o.huntT = 0;
  o.aiRetargetT -= dt;
  var isCilP = o.sp && o.sp.cat==='consumer2';
  // Infusoria: short cruise to bacterial soup; predators may hunt farther
  var pRange = isCilP ? (en < 40 ? 100 : 180) : (en < 40 ? 280 : 900);
  if(!o.aiTarget || !o.aiTarget.alive || o.aiRetargetT <= 0){
    o.aiTarget = findBestPrey(o, pRange, true);
    o.aiRetargetT = isCilP ? 1.1 : 0.75;
    o.huntT = 0;
    if(o.aiTarget){
      turnToward(o, Math.atan2(o.aiTarget.y-o.y, o.aiTarget.x-o.x), dt, isCilP?5:10);
    }
  }

  if(o.aiTarget && o.aiTarget.alive){
    var dx = o.aiTarget.x - o.x;
    var dy = o.aiTarget.y - o.y;
    var d = Math.sqrt(dx*dx + dy*dy) || 1;
    o.huntT += dt;
    if(d > pRange * 1.3 || o.huntT > (isCilP?5:8)){
      o.aiTarget = null; o.huntT = 0; o.aiRetargetT = 1.0;
      runAndTumble(o, dt, speed * 0.55, 0.7);
      o.state = 'wander';
      return;
    }
    o.state = isCilP ? 'filter' : 'hunt';
    turnToward(o, Math.atan2(dy, dx), dt, isCilP?4:8);
    var mul = isCilP ? 5 : (en < 40 ? 10 : 14);
    if(!isCilP && d < 100 && en >= 40) mul = 16;
    thrustAlongFacing(o, speed * (isCilP?0.5:1), dt, mul);
    // Ciliate: filterFeedPull already swallows; predator bites on contact
    if(d < (o.size + o.aiTarget.size + (isCilP?26:28))){
      forceEat(o, o.aiTarget);
      o.aiTarget = null;
      o.aiRetargetT = 0.12;
      o.huntT = 0;
    }
    return;
  }

  runAndTumble(o, dt, speed * (isCilP?0.65:1), en < 50 ? 0.7 : 1.0);
  o.state = 'wander';
}

/** Force a successful eat for player/AI when possible. */
function forceEat(pred, prey){
  if(!pred || !prey || !prey.alive) return false;
  if(prey === pred) return false;
  prey.divCD = 0;
  prey.invuln = 0;
  var before = pred.eaten || 0;
  if(typeof eatOrg === 'function') eatOrg(pred, prey);
  if((pred.eaten||0) > before){
    if(pred.isPlayer && window.showToast){
      var msg = (pred.sp&&pred.sp.cat==='consumer2') ? 'Фильтр: затянул добычу' : 'АВТО: съел';
      window.showToast(msg, '#8f8');
    }
    return true;
  }
  // Fallback if eatOrg blocked
  if(prey.alive && prey.size <= pred.size * 1.2){
    var preyMass = Math.max(0.5, prey.size||1);
    var preyEn = Math.max(5, prey.energy||10);
    var totalNutri = preyEn*0.50 + preyMass*3.2;
    var energyGain = Math.max(4, totalNutri*0.50);
    var mg = Math.max(0.35, totalNutri*0.50*0.12);
    pred.energy = Math.min(120, (pred.energy||0) + energyGain);
    pred.eaten = (pred.eaten||0) + 1;
    pred.eatsSinceDiv = (pred.eatsSinceDiv||0) + 1;
    pred.massFood = (pred.massFood||0) + mg;
    pred.size = Math.min((pred.sp.size||4)*(pred.sizeMult||1)*1.40, pred.size + mg*0.22);
    pred.flash = 1; pred.flashColor = '#8f8';
    if(pred.isPlayer && window.showToast)
      window.showToast('+'+Math.round(energyGain)+' эн / +'+mg.toFixed(1)+' масса', '#8f8');
    if(typeof killOrg === 'function'){
      try { killOrg(prey, (typeof DCODE!=='undefined' && DCODE.EATEN) || 1); }
      catch(e){ prey.alive=false; prey._remove=true; }
    } else {
      prey.alive=false; prey._remove=true;
    }
    if(settings.particles){
      parts.push({x:pred.x,y:pred.y,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),life:0.5,maxL:0.5,size:0.8,color:pred.sp.color});
    }
    if(pred.isPlayer && window.showToast) window.showToast('АВТО: +'+Math.round(gain)+' энергия', '#8f8');
    return true;
  }
  return false;
}

/**
 * findBestPrey
 * forPlayer=true: edible = food-chain match OR anything smaller (grazing)
 * Always ignore soft invuln/divCD for selection (eat path clears them)
 */
function findBestPrey(o, radius, forPlayer){
  var foodCats = (typeof FOOD!=='undefined' && FOOD[o.sp.cat]) ? FOOD[o.sp.cat] : [];
  var isCiliate = o.sp && o.sp.cat === 'consumer2';
  var best=null, bd=1e15;
  var near = window.getNearby ? window.getNearby(o.x, o.y, radius) : orgs;
  if(forPlayer && (!near || near.length < 8)) near = orgs;

  for(var i=0;i<near.length;i++){
    var p = near[i];
    if(!p || !p.alive || p===o || p.cyst) continue;
    if(p.dying) continue;

    var ok=false;
    var inChain = foodCats.indexOf(p.sp.cat) >= 0;

    // === INFUSORIA / CILIATES: filter-feeders, NOT predators ===
    // Only tiny bacteria & algae (and very small ciliates). Never dive on peers.
    if(isCiliate){
      if(!inChain) continue;
      // Prefer bacteria & algae; allow only much smaller other ciliates
      if(p.sp.cat === 'consumer2' && p.size >= o.size * 0.55) continue;
      if(p.size >= o.size * 0.70) continue; // never "hunt" large targets
      if(p.isPlayer && !forPlayer && (gt - (p.spawnTime||0)) < 20) continue;
      ok = true;
    } else if(forPlayer){
      if(inChain && p.size < o.size * 1.25) ok = true;
      if(p.size < o.size * 0.98) ok = true;
      if(inChain && p.sp.cat === 'producer') ok = true;
      if(p.size > o.size * 1.35 && !inChain) ok = false;
    } else {
      if(!inChain) continue;
      if(p.size >= o.size * 0.95) continue;
      if(p.isPlayer && (gt - (p.spawnTime||0)) < 15) continue;
      ok = true;
    }
    if(!ok) continue;

    var d = dist2(o, p);
    var score = d;
    if(isCiliate){
      // Prefer smallest nearby snacks (real filter feeding)
      score = d + p.size * p.size * 40;
      if(p.sp.cat === 'consumer1') score *= 0.55; // bacteria first
      if(p.sp.cat === 'producer') score *= 0.70;
    } else {
      if(forPlayer && inChain) score *= 0.55;
      if(forPlayer && p.sp.cat==='producer') score *= 0.75;
    }
    if(score < bd){ bd = score; best = p; }
  }
  return best;
}

/** Ciliate filter current: gently pull tiny prey toward oral groove + eat in zone */
function filterFeedPull(o, dt){
  if(!o || !o.alive || !o.sp || o.sp.cat !== 'consumer2') return;
  var foodCats = (typeof FOOD!=='undefined' && FOOD[o.sp.cat]) ? FOOD[o.sp.cat] : ['producer','consumer1'];
  var zone = o.size * 3.2 + (o.isPlayer ? 36 : 22);
  var near = window.getNearby ? window.getNearby(o.x, o.y, zone + 40) : orgs;
  var facing = (typeof o.facing==='number') ? o.facing : 0;
  // Oral groove slightly in front of cell
  var mouthX = o.x + Math.cos(facing) * o.size * 0.55;
  var mouthY = o.y + Math.sin(facing) * o.size * 0.55;
  var pulled = 0;
  for(var i=0;i<near.length;i++){
    var p = near[i];
    if(!p || !p.alive || p===o || p.cyst || p.dying) continue;
    if(foodCats.indexOf(p.sp.cat) < 0) continue;
    if(p.size >= o.size * 0.70) continue; // only micro-prey
    var dx = mouthX - p.x, dy = mouthY - p.y;
    var d = Math.sqrt(dx*dx+dy*dy) || 1;
    if(d > zone) continue;
    // Stronger pull when closer (cilia current)
    var strength = (1 - d/zone) * (o.isPlayer ? 42 : 28) * (dt || 0.016);
    p.x += (dx/d) * strength;
    p.y += (dy/d) * strength;
    // slight visual trail particle
    if(typeof parts!=='undefined' && parts && Math.random()<0.12){
      parts.push({x:p.x,y:p.y,vx:(dx/d)*-8,vy:(dy/d)*-8,life:0.35,maxL:0.35,size:1.2,color:p.sp.color||'#8c8'});
    }
    pulled++;
    // Swallow if inside oral zone
    if(d < o.size * 1.15 + p.size){
      if(o.isPlayer && typeof forceEat==='function') forceEat(o, p);
      else if(typeof eatOrg==='function') eatOrg(o, p);
    }
  }
  o._filterPullN = pulled;
}
window.filterFeedPull = filterFeedPull;


// ============================================================
// NATURAL AI — bacterial run-and-tumble + hunt
// Nature: swim straight (run), occasional reorient (tumble), bias to food
// NO continuous clockwise/counterclockwise spinning
// ============================================================
function naturalAI(o, dt, speed){
  var cat = o.sp.cat;
  var foodCats = (typeof FOOD!=='undefined' && FOOD[cat]) ? FOOD[cat] : [];

  if(o.divCD > 0.05){ o.state='idle'; return; }

  // --- Flee straight away from much larger predator (no orbit) ---
  var nearThreat = window.getNearby ? window.getNearby(o.x, o.y, 240) : orgs;
  var predator=null, pbd=1e15;
  for(var i=0;i<nearThreat.length;i++){
    var q=nearThreat[i];
    if(!q.alive || q===o || q.size <= o.size*1.2) continue;
    var fcq = (FOOD && FOOD[q.sp.cat]) || [];
    if(fcq.indexOf(cat) < 0) continue;
    var d2=dist2(o,q);
    if(d2 < pbd){ pbd=d2; predator=q; }
  }
  if(predator && pbd < 200*200){
    o.state='flee';
    var dx=o.x-predator.x, dy=o.y-predator.y;
    turnToward(o, Math.atan2(dy,dx), dt, 8);
    thrustAlongFacing(o, speed, dt, 16);
    // cancel hunt lock while fleeing
    o.aiTarget=null;
    return;
  }

  // --- Energy gates: never hunt to death ---
  // <22: rest/cyst attempt; 22-38: only eat contact prey; 38-72: short hunts; >72: optional
  var en = (typeof o.energy === 'number') ? o.energy : 50;
  if(en < 22){
    o.state = 'rest';
    o.aiTarget = null;
    // try cyst if not player (biology also handles temp); here soft rest
    o.vx *= Math.pow(0.8, dt*60); o.vy *= Math.pow(0.8, dt*60);
    if(!o.isPlayer && !o.cyst && en > 8 && Math.random() < 0.02*dt){
      o.cyst = true; o.vx=0; o.vy=0;
    }
    return;
  }

  // --- Hunt if hungry and has food chain ---
  var isCil = o.sp && o.sp.cat==='consumer2';
  // Ciliates filter nearby — only "seek" when hungry and food not in zone
  var needFood = isCil ? (en < 85) : (en < 72);
  if(needFood && foodCats.length > 0){
    if(o.aiRetargetT === undefined) o.aiRetargetT = 0;
    if(o.huntT === undefined) o.huntT = 0;
    o.aiRetargetT -= dt;

    // Ciliates: short range cruise toward soup, not long predator dives
    var huntRange = isCil ? (en < 40 ? 90 : 160)
                  : (en < 38 ? 120 : (en < 55 ? 380 : 650));
    var maxHuntTime = en < 40 ? 3.5 : 7.0;

    if(!o.aiTarget || !o.aiTarget.alive || o.aiRetargetT <= 0){
      o.aiTarget = findBestPrey(o, huntRange, false);
      o.aiRetargetT = 0.9 + Math.random()*0.6;
      o.huntT = 0;
    }
    if(o.aiTarget && o.aiTarget.alive){
      var dx=o.aiTarget.x-o.x, dy=o.aiTarget.y-o.y;
      var d=Math.sqrt(dx*dx+dy*dy)||1;
      // Give up: too far or chase too long without catch
      if(d > huntRange * 1.25 || o.huntT > maxHuntTime){
        o.aiTarget = null;
        o.aiRetargetT = 1.2 + Math.random();
        o.huntT = 0;
        o.state = 'wander';
        runAndTumble(o, dt, speed * 0.55, 0.6);
        return;
      }
      o.state='hunt';
      o.huntT += dt;
      // Ciliates cruise gently; true predators pursue harder
      var huntMul = isCil ? 4.5 : (en < 40 ? 7 : (en < 55 ? 10 : 12));
      turnToward(o, Math.atan2(dy,dx), dt, isCil ? 3 : (en < 40 ? 4 : 6));
      thrustAlongFacing(o, speed * (isCil ? 0.55 : 1), dt, huntMul);
      // Filter current does the catching for ciliates; predators bite on contact
      if(d < o.size + o.aiTarget.size + (isCil ? 22 : 10)){
        forceEat(o, o.aiTarget);
        o.aiTarget=null;
        o.aiRetargetT=0.25;
        o.huntT = 0;
      }
      return;
    }
  } else {
    // Satiated: clear hunt lock, rest thrust
    o.aiTarget = null;
    o.huntT = 0;
  }

  // --- Default: run-and-tumble (like real flagellated microbes) ---
  runAndTumble(o, dt, speed, 1.0);
  o.state = o.runState || 'run';
}

/**
 * Run-and-tumble:
 *  - RUN: keep facing, thrust forward for runT seconds
 *  - TUMBLE: briefly pick a new random facing (one-shot), not continuous rotation
 * Chemotaxis bias: if food nearby, tumble angle biased toward food
 */
function runAndTumble(o, dt, speed, vigor){
  ensureFacing(o);
  if(o.runT === undefined || o.runState === undefined){
    o.runState = 'run';
    o.runT = 1.2 + Math.random()*2.0; // straight swim 1.2–3.2s
  }
  o.runT -= dt;

  if(o.runState === 'run'){
    thrustAlongFacing(o, speed, dt, 10 * (vigor||1));
    // tiny heading noise ONLY (Brownian) — max ~6 deg/s, not spin
    o.facing += (Math.random()-0.5) * 0.12 * dt;
    o.angle = o.facing;

    if(o.runT <= 0){
      o.runState = 'tumble';
      o.runT = 0.12 + Math.random()*0.12; // short tumble 0.12–0.24s
      // Choose new direction ONCE
      var bias = 0;
      var food = findBestPrey(o, 420, false);
      if(food){
        // chemotaxis: 70% chance to bias tumble toward food
        if(Math.random() < 0.7){
          bias = Math.atan2(food.y-o.y, food.x-o.x);
          o.facing = bias + (Math.random()-0.5)*0.8;
        } else {
          o.facing += (Math.random()-0.5)*2.2;
        }
      } else {
        // random reorientation ± ~60–120 deg, not full 360 spin animation
        o.facing += (Math.random()-0.5) * 2.4;
      }
      o.angle = o.facing;
    }
  } else {
    // Tumble: almost no thrust, wait out short pause (cell "reorients")
    o.vx *= Math.pow(0.85, dt*60);
    o.vy *= Math.pow(0.85, dt*60);
    if(o.runT <= 0){
      o.runState = 'run';
      o.runT = 1.0 + Math.random()*2.2;
    }
  }
}

// Legacy name used elsewhere
function aiOrg(o,dt,speed){ naturalAI(o,dt,speed); }
function steerToward(o, tx, ty, speed, dt, mul){
  turnToward(o, Math.atan2(ty-o.y, tx-o.x), dt, 5);
  thrustAlongFacing(o, speed, dt, mul||12);
}

// Export helpers
window.forceEat = forceEat;
window.findBestPrey = findBestPrey;
window.playerAutoAI = playerAutoAI;
window.naturalAI = naturalAI;
