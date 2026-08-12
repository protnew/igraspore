
// ai.js — playerAutoAI, forceEat, findBestPrey, filterFeed, naturalAI, aiOrg
function playerAutoAI(o, dt, speed){
  if(o.sp && o.sp.locomotion==='sessile') return;

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
  // Fresh divide children cannot be eaten (grace period)
  if((prey.invuln||0) > 0 || prey._fromDivide || prey._noCull){
    if(!(pred && pred.isPlayer && (prey.invuln||0) < 0.3 && !prey._fromDivide)){
      return false;
    }
  }
  // Only player intentional bite may soften short locks — never wipe fresh twins
  if(pred && pred.isPlayer && !prey._fromDivide && (prey.invuln||0) < 0.5){
    prey.divCD = 0;
  }
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
      // Игрок: можно есть зелёных всегда (в цепочке) + кусать крупнее себя (укус, не глоток)
      if(inChain && p.sp.cat === 'producer') ok = true;
      if(inChain && p.size < o.size * 1.55) ok = true;
      if(p.size < o.size * 1.05) ok = true; // мельче себя — почти всегда
      if(p.size > o.size * 1.7 && !inChain) ok = false;
      if(!inChain && p.size >= o.size * 1.05) ok = false;
    } else {
      // Охотники: едят по FOOD (у consumer3 есть зелёные/фито)
      if(!inChain) continue;
      var maxPrey = (o.sp && o.sp.cat === 'consumer3')
        ? ((o.energy||0) < 35 ? o.size * 1.55 : o.size * 1.25)
        : o.size * 0.95;
      if(p.size >= maxPrey) continue;
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
      // Зелёные — нормальная еда охотника (особенно когда голоден)
      if(p.sp.cat==='producer') score *= ((o.energy||100) < 45 ? 0.35 : 0.55);
      if(p.sp.cat==='consumer1') score *= 0.65;
      if(p.size > o.size) score *= 1.45; // крупнее себя — можно, но менее желанно
      if(p._lilyCover) score *= 2.8; // добыча под кувшинкой — почти не видим
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
  if(o.sp && o.sp.locomotion==='sessile') return; // stalked ciliates don't move

  if(!(dt>0)) dt = 0.016;
  if(!(speed>0)) speed = (o && o.sp && o.sp.speed) ? o.sp.speed : ((o && o.speed)||1);
  if(!o || !o.sp) return;
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
    // 7) Стая мелких: если рядом много своих — отбиваемся (толкаем хищника)
    if(cat==='consumer1' || cat==='producer'){
      var allies=0;
      for(var ai2=0; ai2<nearThreat.length; ai2++){
        var a=nearThreat[ai2];
        if(!a||!a.alive||a===o) continue;
        if(a.sp.cat!==cat) continue;
        if(dist2(o,a) < 55*55) allies++;
      }
      if(allies >= 6){
        // коллективный «укус/толчок»
        predator.vx = (predator.vx||0) - dx*0.002;
        predator.vy = (predator.vy||0) - dy*0.002;
        predator.flash = Math.max(predator.flash||0, 0.2);
        predator.flashColor = '#8cf';
        if(allies >= 10 && Math.random() < 0.15*dt){
          predator.energy = Math.max(1, (predator.energy||0) - 0.8);
          predator.aiTarget = null; // сбить фокус
        }
        // в стае бежим чуть медленнее, но держимся кучно
        turnToward(o, Math.atan2(dy,dx), dt, 5);
        thrustAlongFacing(o, speed*0.7, dt, 10);
        o.aiTarget=null;
        return;
      }
    }
    turnToward(o, Math.atan2(dy,dx), dt, 8);
    thrustAlongFacing(o, speed, dt, 16);
    // cancel hunt lock while fleeing
    o.aiTarget=null;
    return;
  }

    // TSK-AI-005: Gradual scent decay — flee from danger pheromones, weaker for older ones
  if(typeof window.pheromones!=='undefined' && window.pheromones && window.pheromones.length>0){
    var bestPh=null, bestInt=0;
    for(var pi=0; pi<window.pheromones.length; pi++){
      var ph=window.pheromones[pi];
      if(ph.type!=='danger') continue;
      var pdx=o.x-ph.x, pdy=o.y-ph.y, pd2=pdx*pdx+pdy*pdy;
      var detR=150*(o.chemoSens||1.0);
      if(pd2 < detR*detR){
        var pdist=Math.sqrt(pd2);
        var intensity=(ph.life||0.5)*(1-pdist/detR);
        if(intensity>bestInt){ bestInt=intensity; bestPh=ph; }
      }
    }
    if(bestPh && bestInt>0.15){
      o.state='flee';
      var fdx=o.x-bestPh.x, fdy=o.y-bestPh.y;
      turnToward(o, Math.atan2(fdy,fdx), dt, 6);
      thrustAlongFacing(o, speed*0.8, dt, 8*bestInt);
    }
  }

    // TSK-AI-006: Mutualistic resource sharing
  if(o.attachedTo && o.energy > 50){
    var host = null;
    for(var hi=0; hi<orgs.length; hi++){
      if(orgs[hi].id === o.attachedTo && orgs[hi].alive){ host = orgs[hi]; break; }
    }
    if(host && host.energy < 40){
      var transfer = Math.min(5 * dt, o.energy - 30);
      if(transfer > 0){ o.energy -= transfer; host.energy += transfer * 0.9; }
    }
  }

// TSK-AI-007: Thermotaxis — gradient search toward optimal temp
  if(typeof window.getTempAt === 'function' && !o.cyst){
    var curT = window.getTempAt(o.x, o.y);
    var tr = o.sp.tempRange || [10,30];
    var tOpt = ((tr[0]+tr[1])/2) + (o.tempOffset||0);
    if(Math.abs(curT - tOpt) > 5){
      var bestDir=null, bestDelta=999;
      for(var ang=0; ang<Math.PI*2; ang+=Math.PI/2){
        var nt = window.getTempAt(o.x+Math.cos(ang)*30, o.y+Math.sin(ang)*30);
        var delta = Math.abs(nt - tOpt);
        if(delta < bestDelta){ bestDelta = delta; bestDir = ang; }
      }
      if(bestDir !== null) steerToward(o, o.x+Math.cos(bestDir)*50, o.y+Math.sin(bestDir)*50, speed*0.6, dt, 5);
    }
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
      // TSK-AI-008: Adaptive aggression — desperate sprint when starving
      if(!isCil && en > 0 && en < 30){ huntMul *= 1.35; o.energy -= dt * 0.03; } // x10 softer hunger-sprint
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
