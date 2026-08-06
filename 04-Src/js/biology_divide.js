// biology.js — spawn, divide, eat, kill, cyst, viruses
"use strict";


function finishDivide(o){
  // Snapshot BEFORE mutating parent
  var base = o.preDivSize || o.size || (o.sp && o.sp.size) || 4;
  var parentEnergy = o.energy || 80;
  var parentGen = (typeof o.generation === 'number' && isFinite(o.generation)) ? o.generation : 0;
  var sp = o.sp;
  var px = o.x, py = o.y;
  var pushAng = (typeof o.facing === 'number') ? o.facing : ((typeof rng==='function')?rng(0,Math.PI*2):Math.random()*Math.PI*2);
  // Always spawn to the SIDE so player clearly sees two cells
  if(o.isPlayer) pushAng = (typeof o.facing==='number' ? o.facing : 0) + Math.PI/2;

  o.dividing = false;
  var _ad = (o.asymDiv !== undefined && isFinite(o.asymDiv)) ? o.asymDiv : 0.55;
  o.energy = Math.max(40, parentEnergy * _ad);
  var half = Math.max(2.0, base * 0.5);
  o.size = half;
  o.massFood = (o.massFood || 0) * 0.5;
  o.eatsSinceDiv = 0;
  o.birthSize = half;
  if(typeof o.generation !== 'number' || !isFinite(o.generation)) o.generation = 0;

  var cd = (typeof DIV_COOLDOWN === 'number' ? DIV_COOLDOWN : 6);
  if(sp && sp.cat && sp.cat.indexOf('consumer') === 0) cd = Math.max(cd, 8);
  if(sp && (sp.cat === 'consumer2' || sp.cat === 'consumer3')) cd = Math.max(cd, 12);
  o.divCD = cd;
  o.invuln = Math.max(o.invuln || 0, 8);
  o._noCull = Math.max(o._noCull||0, 12);
  o.flash = 0.9;
  o.flashColor = '#8ff';

  // Separation large enough to see two distinct cells
  var sep = (typeof DIV_SEPARATION === 'number' ? DIV_SEPARATION : 36);
  if(o.isPlayer) sep = Math.max(sep, 40);
  var cx = px + Math.cos(pushAng) * sep;
  var cy = py + Math.sin(pushAng) * sep;
  try {
    var hw = (typeof halfW === 'function' ? halfW(cy) : 500) - 15;
    if(typeof clamp === 'function'){ cx = clamp(cx, -hw, hw); cy = clamp(cy, 5, (typeof PD==='number'?PD:1000)-10); }
  } catch(_e) {}
  // Keep producer children near surface, but never far from parent X
  if(sp && sp.cat === 'producer' && cy > 100) cy = Math.min(cy, Math.max(5, py + 8));

  var child = null;
  try {
    child = spawnOrg(sp, cx, cy, false, parentEnergy * (1 - _ad));
  } catch(err) {
    console.error('finishDivide spawnOrg failed', err);
    child = null;
  }

  // HARD FALLBACK: if spawn failed, force-create minimal child
  if(!child){
    try {
      if(orgs.length < (typeof MAX_ORG==='number'?MAX_ORG:8000)){
        child = {
          x:cx, y:cy, vx:0, vy:0, sp:sp, species:sp.id,
          energy: Math.max(35, parentEnergy * 0.45),
          age:0, size: Math.max(2.0, base * 0.55),
          currentSize: Math.max(2.0, base * 0.55),
          angle: pushAng + Math.PI, facing: pushAng + Math.PI,
          massFood:0, eatsSinceDiv:0, birthSize: Math.max(2.0, base * 0.55),
          state:'idle', target:null, dividing:false, divT:0,
          cyst:false, cystT:0, divCD: cd, infected:false,
          dying:false, deathT:0, deathCause:-1,
          flash:1.2, flashColor:'#8ff', invuln:6,
          alive:true, isPlayer:false, generation: parentGen + 1,
          speedMult: o.speedMult || 1, sizeMult: o.sizeMult || 1,
          wobble:0, pulse:0, flagPhase:0, cilPhase:0, glideTrail:[],
          organs: (typeof genOrgans==='function'?genOrgans({sp:sp,size:base*0.55}):[]),
          offspring:0, _fromDivide:true
        };
        orgs.push(child);
        if(speciesPop[sp.id]){ speciesPop[sp.id].alive = (speciesPop[sp.id].alive||0)+1; }
      }
    } catch(err2){ console.error('finishDivide fallback failed', err2); child = null; }
  }

  if(child){
    child.alive = true;
    child.generation = parentGen + 1;
    child._fromDivide = true;
    child._parentRef = o;
    child.energy = Math.max(35, parentEnergy * (1 - _ad));
    child.size = Math.max(2.0, base * 0.55);
    child.birthSize = child.size;
    child.massFood = 0;
    child.eatsSinceDiv = 0;
    child.divCD = cd;
    child.flash = 1.4;
    child.flashColor = '#8ff';
    child.invuln = Math.max(child.invuln || 0, 14); // long grace — do not disappear
    child._noCull = 20; // seconds protected from density cull
    child._fromDivide = true;
    child._divideAge = 0;
    // Give enough energy so child doesn't starve immediately
    child.energy = Math.max(70, child.energy || 0);
    child.speedMult = o.speedMult || 1;
    child.sizeMult = o.sizeMult || 1;
    child.tempOffset = o.tempOffset || 0;
    child.o2Offset = o.o2Offset || 0;
    child.acidResist = o.acidResist || 0;
    child.chemoSens = o.chemoSens || 1.0;
    child.heatShock = o.heatShock || 0;
    child.cellWall = o.cellWall || 0;
    child.photoAdapt = o.photoAdapt || 0;
    child.asymDiv = o.asymDiv !== undefined ? o.asymDiv : 0.5;
    child.cystThreshold = o.cystThreshold;
    child.biofilmGene = o.biofilmGene;
    child.digestSpeed = o.digestSpeed;
    child.divForce = o.divForce || 1;

    // Light mutation chance
    if(Math.random() < 0.12){
      var gene = Math.floor(Math.random()*5);
      if(gene===0) child.speedMult *= (0.92 + Math.random()*0.16);
      if(gene===1) child.sizeMult *= (0.92 + Math.random()*0.16);
      if(gene===2) child.tempOffset = (child.tempOffset||0) + (Math.random()*4-2);
    }

    var pushForce = 4.5 * (o.divForce || 1.0);
    o.vx = (o.vx||0) + Math.cos(pushAng) * pushForce;
    o.vy = (o.vy||0) + Math.sin(pushAng) * pushForce;
    child.vx = (child.vx||0) - Math.cos(pushAng) * pushForce;
    child.vy = (child.vy||0) - Math.sin(pushAng) * pushForce;
    o.offspring = (o.offspring || 0) + 1;

    // Camera nudge: keep both cells on screen after player divide
    if(o.isPlayer || o === player){
      try {
        if(typeof cam !== 'undefined'){
          cam.x = (px + cx) * 0.5;
          cam.y = (py + cy) * 0.5;
        }
        if(window.showToast) window.showToast('✌️ Разделился! Вторая клетка рядом', '#8f8');
        if(window.playSound) window.playSound('divide');
      } catch(_e){}
    }
  } else {
    if((o.isPlayer || o === player) && window.showToast) window.showToast('Деление: вторая клетка не создалась', '#f88');
  }

  try {
    if(settings && settings.particles && typeof parts !== 'undefined'){
      for(var i=0;i<5;i++) parts.push({x:px,y:py,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,life:0.7,maxL:0.7,size:1+Math.random(),color:(sp&&sp.color)||'#8ff'});
    }
  } catch(_e){}
}
