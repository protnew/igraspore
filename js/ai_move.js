// ai_move.js — movement helpers: ensureFacing, turnToward, thrust, moveOrg
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
  // Demo gallery: pinned organisms stay put (handled in updateDemoPinned)
  if(o.demoPinned && !o.isPlayer){
    o.vx=0; o.vy=0; return;
  }
  var sp=o.sp;
  // Respect species speed; tiny floor only so zero-speed never NaNs physics
  var _ss=(typeof settings!=='undefined' && settings.simSpeed)?settings.simSpeed:0.33;
  var speed=Math.max(sp.speed, 0.01)*SPD_SCALE*0.05*_ss/0.33;
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
      var thr = Math.max(speed, 1.2) * dt * 45;
      o.vx += ax * thr;
      o.vy += ay * thr;
      // Burst toward surface when holding up
      if(ay < 0){
        o.vy -= Math.max(1.2, thr * 0.6);
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
    if(!o.demoPinned) naturalAI(o, dt, speed);
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
