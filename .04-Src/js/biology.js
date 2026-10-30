// biology.js — spawn, divide, eat, kill, cyst, viruses
"use strict";


function spawnOrg(sp,x,y,isPlayer,parentEnergy){
  // Task 11: Starvation mutations
  // Division daughters keep the parent species object (no recolor / morph drift).
  if(window._divSpawnParent) parentEnergy = undefined;
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
  if(sp.locomotion === 'sessile' && !window.demoMode) y = 200 + Math.random()*(Math.max(400,PD*0.55)); // v24z7: перитрихи — на субстрате в толще (критик 1 v21: на дне y=PD сидели без еды; их пища — толща)
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

function divideThresholds(o){
  var sp=o.sp||{};
  var adult=(sp.size||4)*(o.sizeMult||1);
  var minSz=Math.max(adult*0.80, 2.0);
  var needMass=sp.cat==='producer' ? 0.5 : Math.max(adult*0.50, 2.2);
  if(sp.cat && sp.cat.indexOf('consumer')===0) needMass=Math.max(adult*0.50, 1.5);
  if(sp.cat==='consumer2'||sp.cat==='consumer3'||sp.cat==='macrophage') needMass=Math.max(adult*0.60, 2.0);
  var minA=(typeof lifecycleMinAge==='function') ? lifecycleMinAge(sp, o.generation) : (sp.minAge||3);
  return {repE: sp.repEnergy||80, minSz: minSz, needMass: needMass, minA: minA};
}
function divideNeeds(o){
  if(!o||!o.sp) return {ok:false, energy:[0,0], mass:[0,0], size:[0,0], age:[0,0], cd:0, reason:'none'};
  var th=divideThresholds(o);
  var out={
    ok:false,
    energy:[o.energy||0, th.repE],
    mass:[o.massFood||0, th.needMass],
    size:[o.size||0, th.minSz],
    age:[o.age||0, th.minA],
    cd:o.divCD||0,
    reason:''
  };
  if(!o.alive||o.cyst||o.dying){ out.reason='none'; return out; }
  if(o.dividing){ out.reason='busy'; return out; }
  if(o.divCD>0){ out.reason='cd'; return out; }
  if(o.age<th.minA){ out.reason='age'; return out; }
  if(o.energy<th.repE){ out.reason='energy'; return out; }
  if(o.size<th.minSz){ out.reason='size'; return out; }
  if((o.massFood||0)<th.needMass){ out.reason='mass'; return out; }
  out.ok=true;
  return out;
}
window.divideNeeds=divideNeeds;
function canDivide(o){ return divideNeeds(o).ok; }
window.canDivide=canDivide;
function divideBlockReason(o){
  var n=divideNeeds(o);
  if(n.ok) return '';
  var num=(typeof igsNum==='function')?igsNum:function(v,d){ return d?Number(v).toFixed(d):String(Math.round(v)); };
  if(n.reason==='energy') return tt('hud.divide.reason.energy',{cur:num(n.energy[0],0),need:num(n.energy[1],0)});
  if(n.reason==='mass') return tt('hud.divide.reason.mass',{cur:num(n.mass[0],1),need:num(n.mass[1],1)});
  if(n.reason==='size') return tt('hud.divide.reason.size',{cur:num(n.size[0],1),need:num(n.size[1],1)});
  if(n.reason==='cd') return tt('hud.divide.reason.cd',{sec:num(n.cd,0)});
  if(n.reason==='age') return tt('hud.divide.reason.age');
  if(n.reason==='busy') return tt('hud.divide.reason.busy');
  return tt('hud.divide.reason.none');
}
window.divideBlockReason=divideBlockReason;

function doDivide(o){
  if(!canDivide(o)) return false;
  var _dr=(typeof settings!=='undefined'&&settings.divRate)?settings.divRate:1.0;
  if(!o.isPlayer && _dr<1.0 && Math.random()>_dr) return false;
  o.dividing=true; o.divT=0; o.state='dividing';
  o.preDivSize=o.size;
  // Spend mass/eats immediately — cannot chain-divide mid-animation
  o.massFood = (o.massFood || 0) * 0.5;
  o.eatsSinceDiv = 0;
  return true;
}
