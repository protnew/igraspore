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
  var thr = speed * dt * (mul||12);
  o.vx += Math.cos(o.facing) * thr;
  o.vy += Math.sin(o.facing) * thr;
}

function moveOrg(o,dt){
  var sp=o.sp;
  var speed=Math.max(sp.speed, 0.5)*SPD_SCALE*0.05;
  if(o.isPlayer && !freeCam){
    // Players always swim at a usable pace (real microbes: active swimming)
    speed = Math.max(speed, 2.5) * 2.4;
  }
  if(o.speedMult) speed *= o.speedMult;
  ensureFacing(o);

  // ---- PLAYER MANUAL ----
  if(o.isPlayer && !freeCam && !autoAI && !o.cyst && !o.dying){
    var ax=0, ay=0;
    if(keys['w']||keys['arrowup']) ay-=1;
    if(keys['s']||keys['arrowdown']) ay+=1;
    if(keys['a']||keys['arrowleft']) ax-=1;
    if(keys['d']||keys['arrowright']) ax+=1;
    if(o.parasiticInfection){ ax=-ax; ay=-ay; }
    if(ax||ay){
      var m=Math.sqrt(ax*ax+ay*ay); ax/=m; ay/=m;
      turnToward(o, Math.atan2(ay,ax), dt, 10);
      thrustAlongFacing(o, speed, dt, 18);
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
  var damp = (o.isPlayer && !freeCam) ? 0.90 : 0.93;
  var dampDt = clamp(dt, 0, 0.05);
  o.vx *= Math.pow(damp, dampDt*60);
  o.vy *= Math.pow(damp, dampDt*60);

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
      if(o.y<20){o.y=20;o.vy=Math.abs(o.vy)*0.4;}
      if(o.y>PD-20){o.y=PD-20;o.vy=-Math.abs(o.vy)*0.4;}
    }
  }

  // Gentle visual wobble ONLY (does not affect heading used for locomotion)
  o.wobble = (o.wobble||0) + dt * 1.2;
  o.pulse = (o.pulse||0) + dt * 1.0;
  o.flagPhase = (o.flagPhase||0) + dt * 6;
  o.cilPhase = (o.cilPhase||0) + dt * 10;

  if(o.divCD>0) o.divCD -= dt;
}

// ============================================================
// PLAYER AUTOPILOT — always hunts edible targets
// ============================================================
function playerAutoAI(o, dt, speed){
  o.state = 'auto';

  // Retarget when missing/dead or timer expired
  if(o.aiRetargetT === undefined) o.aiRetargetT = 0;
  o.aiRetargetT -= dt;
  if(!o.aiTarget || !o.aiTarget.alive || o.aiRetargetT <= 0){
    o.aiTarget = findBestPrey(o, 1400, true);
    o.aiRetargetT = 0.7;
    if(o.aiTarget){
      // face prey immediately (snap-ish)
      turnToward(o, Math.atan2(o.aiTarget.y-o.y, o.aiTarget.x-o.x), dt, 14);
    }
  }

  if(o.aiTarget && o.aiTarget.alive){
    o.state = 'hunt';
    var dx = o.aiTarget.x - o.x;
    var dy = o.aiTarget.y - o.y;
    var d = Math.sqrt(dx*dx + dy*dy) || 1;
    turnToward(o, Math.atan2(dy, dx), dt, 9);
    var mul = 22;
    if(d < 140) mul = 30;
    thrustAlongFacing(o, speed, dt, mul);

    // Eat on contact (generous)
    if(d < (o.size + o.aiTarget.size + 28)){
      forceEat(o, o.aiTarget);
      o.aiTarget = null;
      o.aiRetargetT = 0.08;
    }
    return;
  }

  // No prey: run-and-tumble explore (natural)
  runAndTumble(o, dt, speed, 1.0);
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
    if(pred.isPlayer && window.showToast) window.showToast('АВТО: съел', '#8f8');
    return true;
  }
  // Fallback if eatOrg blocked
  if(prey.alive && prey.size <= pred.size * 1.2){
    var gain = Math.max(10, Math.min(45, (prey.energy||20)*0.55));
    pred.energy = Math.min(120, (pred.energy||0) + gain);
    pred.eaten = (pred.eaten||0) + 1;
    pred.flash = 1; pred.flashColor = '#8f8';
    if(typeof killOrg === 'function'){
      try { killOrg(prey, (typeof DCODE!=='undefined' && DCODE.EATEN) || 1); }
      catch(e){ prey.alive=false; prey._remove=true; }
    } else {
      prey.alive=false; prey._remove=true;
    }
    if(settings.particles){
      for(var k=0;k<8;k++) parts.push({x:pred.x,y:pred.y,vx:rng(-3,3),vy:rng(-3,3),life:rng(6,14),maxL:14,size:rng(2,4),color:'#8f8'});
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
  var best=null, bd=1e15;
  var near = window.getNearby ? window.getNearby(o.x, o.y, radius) : orgs;
  // Also hard-scan orgs if near is sparse (player must find food)
  if(forPlayer && (!near || near.length < 8)) near = orgs;

  for(var i=0;i<near.length;i++){
    var p = near[i];
    if(!p || !p.alive || p===o || p.cyst) continue;
    if(p.dying) continue;

    var ok=false;
    var inChain = foodCats.indexOf(p.sp.cat) >= 0;

    if(forPlayer){
      // Predators: prefer food chain; also anything smaller
      if(inChain && p.size < o.size * 1.25) ok = true;
      if(p.size < o.size * 0.98) ok = true;
      // Consumer with no smaller prey: still chase producers even if similar size
      if(inChain && p.sp.cat === 'producer') ok = true;
      // Never eat larger predators of own size class badly
      if(p.size > o.size * 1.35 && !inChain) ok = false;
    } else {
      if(!inChain) continue;
      if(p.size >= o.size * 0.95) continue;
      if(p.isPlayer && (gt - (p.spawnTime||0)) < 15) continue;
      ok = true;
    }
    if(!ok) continue;

    var d = dist2(o, p);
    // Prefer food-chain targets for predators (lower score)
    var score = d;
    if(forPlayer && inChain) score *= 0.55;
    if(forPlayer && p.sp.cat==='producer') score *= 0.75;
    if(score < bd && d < radius*radius){ bd = score; best = p; }
  }
  return best;
}

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

  // --- Hunt if hungry and has food chain ---
  var needFood = o.energy < 92;
  if(needFood && foodCats.length > 0){
    if(o.aiRetargetT === undefined) o.aiRetargetT = 0;
    o.aiRetargetT -= dt;
    if(!o.aiTarget || !o.aiTarget.alive || o.aiRetargetT <= 0){
      o.aiTarget = findBestPrey(o, 750, false);
      o.aiRetargetT = 0.8 + Math.random()*0.5;
    }
    if(o.aiTarget && o.aiTarget.alive){
      o.state='hunt';
      var dx=o.aiTarget.x-o.x, dy=o.aiTarget.y-o.y;
      var d=Math.sqrt(dx*dx+dy*dy)||1;
      turnToward(o, Math.atan2(dy,dx), dt, 6);
      thrustAlongFacing(o, speed, dt, 14);
      if(d < o.size + o.aiTarget.size + 10){
        forceEat(o, o.aiTarget);
        o.aiTarget=null;
        o.aiRetargetT=0.15;
      }
      return;
    }
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
