// camera_follow.js — sticky aquarium follow (no empty-frame oscillation)
"use strict";

/**
 * One damped camera step.
 * Sticky target: a larger creature elsewhere cannot steal the lock.
 * When the target leaves the frame, keep gliding toward it briefly,
 * then pick the nearest living organism once and hold that choice.
 */
function aquariumFollowStep(s){
  s = s || {};
  var dt = (typeof s.dt === 'number' && s.dt > 0) ? Math.min(s.dt, 0.05) : 0.016;
  var camX = s.camX || 0, camY = s.camY || 0;
  var vx = s.vx || 0, vy = s.vy || 0;
  var orgs = s.orgs || [];
  var z = (s.zoom > 0) ? s.zoom : 1;
  var hw = (s.viewW || 800) / (2 * z);
  var hh = (s.viewH || 600) / (2 * z);
  var now = (typeof s.now === 'number') ? s.now : 0;
  var targetId = (s.targetId === undefined) ? null : s.targetId;
  var offSince = s.offSince || 0;
  var lockUntil = s.lockUntil || 0;
  var wasInView = !!s.wasInView;
  var switched = false;

  function findId(id){
    if(id === null || id === undefined) return null;
    for(var i = 0; i < orgs.length; i++){
      var o = orgs[i];
      if(o && o.alive && o.id === id) return o;
    }
    return null;
  }
  function inView(o, margin){
    var m = margin || 0;
    return o.x >= camX - hw - m && o.x <= camX + hw + m &&
           o.y >= camY - hh - m && o.y <= camY + hh + m;
  }
  function pickNearest(skipId){
    var best = null, bestD = Infinity;
    for(var i = 0; i < orgs.length; i++){
      var o = orgs[i];
      if(!o || !o.alive) continue;
      if(skipId !== null && skipId !== undefined && o.id === skipId) continue;
      var dx = o.x - camX, dy = o.y - camY;
      var d = dx * dx + dy * dy;
      if(inView(o, 24)) d *= 0.35;
      if(d < bestD){ bestD = d; best = o; }
    }
    return best;
  }

  var target = findId(targetId);
  var replace = !target;
  // Only abandon a target that was on screen and then left.
  // A target picked while the frame is empty is followed until it enters — no ping-pong.
  if(target && !inView(target, 0)){
    if(wasInView){
      if(!offSince) offSince = now;
      if((now - offSince) >= 1.15 && now >= lockUntil) replace = true;
    }
  } else if(target){
    offSince = 0;
    wasInView = true;
  }
  if(replace){
    var skip = (target && !inView(target, 0)) ? target.id : null;
    var best = pickNearest(skip) || target;
    if(best && (!target || best.id !== target.id)){
      target = best;
      targetId = best.id;
      wasInView = inView(best, 0);
      offSince = 0;
      lockUntil = now + 2.6;
      switched = true;
    } else if(best){
      target = best;
      targetId = best.id;
      wasInView = inView(best, 0);
    } else {
      target = null;
      targetId = null;
      wasInView = false;
    }
  }

  var desVx = 0, desVy = 0;
  if(target){
    var dx = target.x - camX, dy = target.y - camY;
    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
    var on = inView(target, 0);
    var nx = Math.abs(dx) / Math.max(1, hw);
    var ny = Math.abs(dy) / Math.max(1, hh);
    var maxSp = on ? 48 : 95;
    if(on && nx < 0.38 && ny < 0.38) maxSp = 0;
    else if(on){
      var edge = Math.max(0, Math.max(nx, ny) - 0.38) / 0.62;
      maxSp = 48 * Math.min(1, edge);
    }
    desVx = (dx / dist) * maxSp;
    desVy = (dy / dist) * maxSp;
  }
  var k = Math.min(0.22, dt * 3.2);
  vx = vx + (desVx - vx) * k;
  vy = vy + (desVy - vy) * k;
  var sp = Math.sqrt(vx * vx + vy * vy);
  var cap = 110;
  if(sp > cap){ vx = vx / sp * cap; vy = vy / sp * cap; }
  camX += vx * dt;
  camY += vy * dt;

  return {
    camX: camX, camY: camY, vx: vx, vy: vy,
    targetId: target ? target.id : null,
    offSince: offSince, lockUntil: lockUntil, wasInView: wasInView, switched: switched
  };
}

function stepAquariumCamera(dtc){
  if(typeof cam === 'undefined' || typeof orgs === 'undefined') return;
  var z = (typeof zoom === 'number' && zoom > 0) ? zoom : 1;
  var vw = (typeof cv !== 'undefined' && cv && cv.width) ? cv.width : 800;
  var vh = (typeof cv !== 'undefined' && cv && cv.height) ? cv.height : 600;
  var tagged = [];
  for(var i = 0; i < orgs.length; i++){
    var o = orgs[i];
    if(!o) continue;
    if(o._aqId === undefined || o._aqId === null){
      o._aqId = (window._aqSeq = (window._aqSeq || 1) + 1);
    }
    tagged.push({ id: o._aqId, x: o.x, y: o.y, alive: !!o.alive, size: o.size || 1 });
  }
  var st = window._aqFollow || {};
  var now = (st.now || 0) + (dtc || 0.016);
  var step = aquariumFollowStep({
    camX: cam.x, camY: cam.y, vx: st.vx || 0, vy: st.vy || 0,
    orgs: tagged, zoom: z, viewW: vw, viewH: vh,
    targetId: st.targetId, offSince: st.offSince || 0, lockUntil: st.lockUntil || 0,
    wasInView: !!st.wasInView, now: now, dt: dtc || 0.016
  });
  cam.x = step.camX;
  cam.y = step.camY;
  window._aqFollow = {
    vx: step.vx, vy: step.vy, targetId: step.targetId,
    offSince: step.offSince, lockUntil: step.lockUntil, wasInView: step.wasInView, now: now
  };
}

if(typeof window !== 'undefined'){
  window.aquariumFollowStep = aquariumFollowStep;
  window.stepAquariumCamera = stepAquariumCamera;
}
