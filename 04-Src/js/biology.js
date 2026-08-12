// biology.js — spawn, divide, eat, kill, cyst, viruses
"use strict";


function spawnOrg(sp,x,y,isPlayer,parentEnergy){
  // Task 11: Starvation mutations
  if(parentEnergy !== undefined && parentEnergy < sp.repEnergy * 0.1 && Math.random()<0.1) {
      if(!sp.isCustom) {
          sp = Object.assign({}, sp);
          sp.flags = Object.assign({}, sp.flags||{});
          sp.isCustom = true;
      }
      if(Math.random()<0.5) sp.speedMult = (sp.speedMult||1) + (Math.random()*0.6 - 0.2);
      else sp.color = '#'+Math.floor(Math.random()*16777215).toString(16);
  }
  if(orgs.length>=MAX_ORG)return null;
  if(sp.locomotion === 'sessile') y = PD - sp.size;
  var o={x:x,y:y,vx:0,vy:0,sp:sp,species:sp.id,
    energy:Math.max(55, sp.energy*0.85+rng(0,15)),age:0,
    size:Math.min(9, sp.size*(0.85+rng(0,0.3))),
    currentSize: Math.min(9, sp.size),
    spawnTime: gt,
    angle:rng(0,Math.PI*2),facing:rng(0,Math.PI*2),massFood:0,eatsSinceDiv:0,birthSize:0,
    state:'idle',target:null,
    dividing:false,divT:0,cyst:false,cystT:0,
    divCD:0,
    infected:false,infectionT:0,
    dying:false,deathT:0,deathCause:-1,
    flash:0,flashColor:'#fff',
    wobble:rng(0,Math.PI*2),pulse:rng(0,Math.PI*2),
    flagPhase:rng(0,Math.PI*2),cilPhase:rng(0,Math.PI*2),
    glideTrail:[],
    generation:0,offspring:0,eaten:0, speedMult:1.0, sizeMult:1.0, tempOffset:0.0, o2Offset:0.0, acidResist:0.0, chemoSens:1.0, heatShock:0.0, cellWall:0.0, photoAdapt:0.0, asymDiv:0.5, cystThreshold:5.0, biofilmGene:0.0, digestSpeed:1.0, divForce:1.0, stomach:[], inBiofilm:false, biofilmT:0,
    isPlayer:!!isPlayer,alive:true,_remove:false,
    gender: Math.random() < 0.5 ? 'M' : 'F', seekingMate: false,
    invuln:isPlayer?12:4
  };
  o.organs=genOrgans(o);
  orgs.push(o);
  if(speciesPop[sp.id]){speciesPop[sp.id].alive++;speciesPop[sp.id].born++;}
  stats.births++;
  if(o){ if(!o.birthSize) o.birthSize=o.size; o.massFood=o.massFood||0; o.eatsSinceDiv=o.eatsSinceDiv||0; }
  return o;
}

/** Can this cell divide? Needs energy + mature size + mass from feeding. */

function canDivide(o){
  if(!o || !o.alive || o.cyst || o.dying) return false;
  if(o.dividing) return false;
  if(o.divCD > 0) return false;
  if(o.age < (o.sp.minAge || 3)) return false;
  var repE = o.sp.repEnergy || 80;
  if(o.energy < repE) return false;
  var adult = (o.sp.size || 4) * (o.sizeMult || 1.0);
  var minSz = Math.max(adult * 0.80, 2.0); // Easier: 80% instead of 90%
  if(o.size < minSz) return false;
  // Producers divide via photosynthesis, not eating — lower mass threshold
  var needMass = o.sp.cat === 'producer' ? 0.5 : Math.max(adult * 0.50, 2.2);
  if(o.sp.cat && o.sp.cat.indexOf('consumer') === 0) needMass = Math.max(adult * 0.50, 1.5);
  if(o.sp.cat === 'consumer2' || o.sp.cat === 'consumer3' || o.sp.cat === 'macrophage')
    needMass = Math.max(adult * 0.60, 2.0);
  if((o.massFood || 0) < needMass) return false;
  return true;
}
window.canDivide = canDivide;

function divideBlockReason(o){
  if(!o) return 'нет клетки';
  if(o.dividing) return 'идёт деление...';
  if(o.divCD > 0) return 'перезарядка '+o.divCD.toFixed(1)+'с';
  if(o.age < (o.sp.minAge||3)) return 'слишком молода';
  var repE = o.sp.repEnergy || 80;
  if(o.energy < repE) return 'энергия '+Math.round(o.energy)+'/'+Math.round(repE);
  var adult = (o.sp.size||4)*(o.sizeMult||1);
  var minSz = Math.max(adult*0.90, 2.2);
  if(o.size < minSz) return 'размер '+o.size.toFixed(1)+'/'+minSz.toFixed(1)+' (расти!)';
  var needMass = Math.max(adult*0.50, 2.2);
  if(o.sp.cat && o.sp.cat.indexOf('consumer')===0) needMass = Math.max(adult*0.75, 3.0);
  if(o.sp.cat === 'consumer2' || o.sp.cat === 'consumer3' || o.sp.cat === 'macrophage')
    needMass = Math.max(adult*0.9, 4.0);
  if((o.massFood||0) < needMass) return 'масса '+((o.massFood||0).toFixed(1))+'/'+needMass.toFixed(1)+' (ешь/солнце!)';
  return '';
}
window.divideBlockReason = divideBlockReason;

function doDivide(o){
  if(!canDivide(o)) return false;
  // Reproduction rate slider (user setting)
  var _dr=(typeof settings!=='undefined'&&settings.divRate)?settings.divRate:1.0;
  if(_dr<1.0 && Math.random()>_dr) return false;
  o.dividing=true; o.divT=0; o.state='dividing';
  o.preDivSize=o.size;
  // Spend mass/eats immediately — cannot chain-divide mid-animation
  o.massFood = (o.massFood || 0) * 0.5;
  o.eatsSinceDiv = 0;
  return true;
}
