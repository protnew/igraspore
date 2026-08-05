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
    energy:sp.energy*0.7+rng(0,10),age:0,
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
    generation:0,offspring:0,eaten:0, speedMult:1.0, sizeMult:1.0, tempOffset:0.0, o2Offset:0.0, acidResist:0.0, chemoSens:1.0, heatShock:0.0, cellWall:0.0, photoAdapt:0.0, asymDiv:0.5, stomach:[], inBiofilm:false, biofilmT:0,
    isPlayer:!!isPlayer,alive:true,_remove:false,
    gender: Math.random() < 0.5 ? 'M' : 'F', seekingMate: false,
    invuln:isPlayer?10:0
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

function finishDivide(o){
  o.dividing=false;
  var _ad = o.asymDiv !== undefined ? o.asymDiv : 0.55;
  o.energy = Math.max(40, (o.energy||0)*_ad); // TSK-BIO-007: asymmetric division
  // Parent becomes ~half size (clearly visible), then slowly regrows via normal growth
  var base = o.preDivSize || o.size || (o.sp.size||4);
  var half = Math.max(1.6, base * 0.5);
  o.size = half;
  // MUST re-accumulate mass/eats before next divide
  o.massFood = (o.massFood || 0) * 0.5;
  o.eatsSinceDiv = 0;
  o.birthSize = half;
  // Longer cooldown for predators — no spam divide
  var cd = (typeof DIV_COOLDOWN==='number' ? DIV_COOLDOWN : 6);
  if(o.sp && o.sp.cat && o.sp.cat.indexOf('consumer')===0) cd = Math.max(cd, 8);
  if(o.sp && (o.sp.cat==='consumer2'||o.sp.cat==='consumer3')) cd = Math.max(cd, 12);
  o.divCD = cd; o.invuln = Math.max(o.invuln||0, 5); // grace period
  try{ if(o===player||window.spectatorMode) window.playSound("divide"); }catch(_e){}
  // KEY FIX: push child AWAY with separation impulse + cooldown
  var pushAng=(typeof rng==='function'?rng(0,Math.PI*2):Math.random()*Math.PI*2);
  var sep = (typeof DIV_SEPARATION==='number'?DIV_SEPARATION:12);
  var cx=o.x+Math.cos(pushAng)*sep;
  var cy=o.y+Math.sin(pushAng)*sep;
  // Clamp child to puddle
  try{
    var hw=(typeof halfW==='function'?halfW(cy):500)-15;
    cx=clamp(cx,-hw,hw); cy=clamp(cy,5,(typeof PD==='number'?PD:1000)-10);
  }catch(_e){}
  var child=null;
  // Producer children stay near surface
  if(o.sp.cat==='producer' && cy > 120) cy = Math.min(cy, rng(2,120));
  try{ child=spawnOrg(o.sp,cx,cy,false,o.energy); }catch(_e){ child=null; }
  if(child){
    child.generation=o.generation+1;
    // TSK-BIO-004: Genetic drift — ±1% per generation even without mutation
    child.speedMult = (child.speedMult||1) * (1 + (Math.random()-0.5)*0.02);
    child.sizeMult = (child.sizeMult||1) * (1 + (Math.random()-0.5)*0.02);child.energy=o.energy*0.9;
    child.size=Math.max(1.6, base * 0.5 * rng(0.95,1.05));
    child.massFood=0; child.eatsSinceDiv=0; child.birthSize=child.size;
    var ccd = (typeof DIV_COOLDOWN==='number'?DIV_COOLDOWN:4);
    if(o.sp.cat && o.sp.cat.indexOf('consumer')===0) ccd=Math.max(ccd,8);
    child.divCD=ccd;
    child.flash=0.7; child.flashColor='#8ff';
    child.invuln = Math.max(child.invuln||0, 5); // child grace
    
    // Genetics & Mutations
    child.speedMult = o.speedMult;
    child.sizeMult = o.sizeMult;
    child.tempOffset = o.tempOffset;
    child.o2Offset = o.o2Offset;
    child.acidResist = o.acidResist;
    child.chemoSens = o.chemoSens || 1.0;
    child.heatShock = o.heatShock || 0.0;
    child.cellWall = o.cellWall || 0.0;
    child.photoAdapt = o.photoAdapt || 0.0;
    child.asymDiv = o.asymDiv !== undefined ? o.asymDiv : 0.5;

    if(Math.random() < 0.15) {
       var gene = Math.floor(Math.random()*5);
       if(gene===0) child.speedMult *= rng(0.9, 1.1);
       if(gene===1) child.sizeMult *= rng(0.9, 1.1);
       if(gene===2) child.tempOffset += rng(-2, 2);
       if(gene===3) child.o2Offset += rng(-10.0, 5.0); // TSK-BIO-009: allow deeper O2 adaptation
       if(gene===4) child.acidResist += rng(-0.2, 0.2);
       if(gene===5) child.chemoSens *= rng(0.9, 1.1);
       child.chemoSens = Math.max(0.5, Math.min(2.0, child.chemoSens||1.0));
       if(gene===9) child.asymDiv = Math.max(0.3, Math.min(0.7, (child.asymDiv||0.5) + rng(-0.05, 0.05)));
       if(gene===8) child.photoAdapt = Math.max(-0.5, Math.min(0.5, (child.photoAdapt||0) + rng(-0.1, 0.1)));
       if(gene===7) child.cellWall = Math.max(0, Math.min(1.0, (child.cellWall||0) + rng(-0.1, 0.1)));
       if(gene===6) child.heatShock = Math.max(0, Math.min(1.0, (child.heatShock||0) + rng(0, 0.15)));
       
       child.acidResist = Math.max(0, Math.min(1, child.acidResist));
       child.speedMult = Math.max(0.1, Math.min(5.0, child.speedMult));
    }

    // Push apart
    var pushForce=3*(o.divForce||1.0);
    o.vx+=Math.cos(pushAng)*pushForce;o.vy+=Math.sin(pushAng)*pushForce;
    child.vx-=Math.cos(pushAng)*pushForce;child.vy-=Math.sin(pushAng)*pushForce;
    o.offspring++;
  }
  o.flash=0.8;o.flashColor='#8ff';
  if(settings.particles)for(var i=0;i<3;i++)parts.push({x:o.x,y:o.y,vx:rng(-0.8,0.8),vy:rng(-0.8,0.8),life:0.6,maxL:0.6,size:rng(0.5,1.5),color:o.sp.color});
  if(o===player && window.showToast) window.showToast('Деление!', '#8ff');
  if (typeof window !== 'undefined' && state === 'menu' && window.focusTimer <= 0 && Math.random() < 0.2) { window.focusTarget = o; window.focusTimer = 2.0; }
}

function eatOrg(pred,prey){
  if(!prey||!prey.alive)return;
  // Predation rate slider (user setting)
  var _pr=(typeof settings!=='undefined'&&settings.predation)?settings.predation:1.0;
  if(!pred.isPlayer && _pr<1.0 && Math.random()>_pr) return;
  // Eat cooldown — predators can't eat every frame (realistic digestion)
  if(!pred.isPlayer && (pred.eatCD||0) > 0){
    // Visual lunge even on cooldown — predator tried to bite
    pred.flash = Math.max(pred.flash||0, 0.3);
    pred.flashColor = '#f80';
    return;
  }
  // Player overrides soft locks on prey
  if(!(pred&&pred.isPlayer)){
    if(prey.divCD>0||prey.invuln>0)return;
  } else {
    if(prey.invuln>0.8)return;
  }
  // Set digestion cooldown (3-8 seconds depending on predator size)
  if(!pred.isPlayer){
    pred.eatCD = 1.0 + (pred.sp.size||4) * 0.3; // 2.5-4 sec between meals
  }
  if(prey.sp.cat==='consumer1' && Math.random()<0.15) {
     pred.parasite = prey.sp;
     pred.flashColor='#f0f'; pred.flash=0.5;
     killOrg(prey, DCODE.EATEN);
     return;
  }
  if (prey.sp.flags && prey.sp.flags.venom) {
     // TSK-BIO-008: Venom scales inversely with pred/prey size ratio
     var _vscale = Math.max(0.1, Math.min(1.0, prey.size / Math.max(1, pred.size)));
     pred.speedMult = Math.max(0.05, 1.0 - 0.95 * _vscale);
     pred.flashColor = '#0f0'; pred.flash = 0.8;
     pred.energy -= 20 * _vscale;
     pred.venomTimer = 5 * _vscale;
  }
  
  // Snapshot prey nutrition BEFORE damage (meal size must matter)
  var preySize0 = Math.max(0.4, prey.size || 1);
  var preyEn0 = Math.max(5, prey.energy || 10);

  // Defenses
  if(prey.sp.flags) {
     if(prey.sp.flags.spikes) {
         var recoil = Math.min(pred.size*0.15, preySize0*0.2);
         pred.size = Math.max(1, pred.size - recoil);
     }
     if(prey.sp.flags.toxic) {
         var res = pred.acidResist || 0;
         pred.speedMult = 0.1 + 0.8 * res;
         pred.flashColor = '#0f0'; pred.flash = 0.8;
         pred.energy -= 10 * Math.max(0, 1 - res);
     }
  }

  // Full swallow if prey is not bigger than predator; otherwise chip away
  var fullSwallow = preySize0 <= pred.size * 1.05;
  if(prey.sp.flags && prey.sp.flags.shell) fullSwallow = preySize0 <= pred.size * 0.7;
  var dmg, biteFrac;
  if(fullSwallow){
    dmg = prey.size;
    biteFrac = 1;
    prey.size = 0;
  } else {
    // Bigger target → bigger bite chunk (still less than full swallow)
    dmg = Math.max(pred.size * 0.55, preySize0 * 0.35);
    if(dmg > prey.size) dmg = prey.size;
    biteFrac = dmg / preySize0;
    prey.size -= dmg;
  }
  // TSK-RND-025: dmg indicators capped to 20
  if(settings.particles) {
      if(!window.dmgIndicators) window.dmgIndicators = [];
      if(window.dmgIndicators.length >= 20) window.dmgIndicators.shift();
      window.dmgIndicators.push({x:prey.x, y:prey.y, val:Math.round(dmg), life:1.0});
  }
  
  // Total nutrition from ORIGINAL prey size/energy × bite fraction
  var preyMass = preySize0;
  var preyEn = preyEn0;
  var totalNutri = (preyEn * 0.50 + preyMass * 3.2) * (biteFrac > 0 ? biteFrac : 1);
  // ~half energy (health), ~half mass — both grow every meal
  var energyGain = Math.max(2, totalNutri * 0.50);
  var massGain = Math.max(0.2, totalNutri * 0.50 * 0.14);

  // IMMEDIATE energy + mass (not only delayed stomach)
  var enBefore = pred.energy || 0;
  pred.energy = Math.min(120, enBefore + energyGain);
  // if capped, still count intended gain for toast
  var realEn = pred.energy - enBefore;
  pred.massFood = (pred.massFood || 0) + massGain;
  var adultCap = (pred.sp.size||4)*(pred.sizeMult||1.0)*1.40;
  pred.size = Math.min(adultCap, (pred.size||1) + massGain * 0.22);

  if(!pred.stomach) pred.stomach=[];
  pred.stomach.push({
    sp: prey.sp,
    t: prey.sp.cat,
    color: prey.sp.color,
    size: Math.max(0.2, prey.size*0.35),
    energy: energyGain * 0.2,
    x: rng(-pred.size*0.4, pred.size*0.4),
    y: rng(-pred.size*0.4, pred.size*0.4)
  });
  if(pred.stomach.length>5) pred.stomach.shift();

  if(pred === player) {
      if(typeof window.gameStats === 'undefined') window.gameStats = { dna: 0 };
      if(typeof window.gameStats.dna === 'undefined') window.gameStats.dna = 0;
      window.gameStats.dna += 1;
      if(window.showToast){
        window.showToast('+'+Math.round(energyGain)+' эн / +'+massGain.toFixed(1)+' масса', '#8f8');
      }
  }

  pred.eaten = (pred.eaten||0) + 1;
  pred.eatsSinceDiv = (pred.eatsSinceDiv||0) + 1; // stats only
  pred._lastEnGain = energyGain;
  pred._lastMassGain = massGain;
  // Readable combat beat: warm strike flash + brief size pulse
  pred.flash=0.55; pred.flashColor='#ffe066';
  prey.flash=0.75; prey.flashColor='#ff6644';
  pred._lungeT = 0.28;
  // Contrast crumbs (not rainbow firework): 4-6 tiny shards, prey hue + warm white
  if(typeof parts!=='undefined' && parts){
    var pc = (prey.sp && prey.sp.color) || '#8c8';
    var n = 4 + ((Math.random()*3)|0);
    for(var pi=0;pi<n;pi++){
      var ang = Math.random()*Math.PI*2;
      var sp = 0.4 + Math.random()*1.2;
      parts.push({
        x:prey.x, y:prey.y,
        vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp,
        life:0.35+Math.random()*0.35, maxLife:0.7,
        size:0.9+Math.random()*1.4,
        color: (pi%2===0)? pc : '#fff2aa',
        type:'debris'
      });
    }
  }
  
  if (typeof window !== 'undefined' && window.playSound) {
    if(player&&dist2(player,pred)<2500 || player&&dist2(player,prey)<2500) window.playSound("eat", prey.x, prey.y);
  }
  
  if (prey.size <= 2) {
      // Phagocytosis: prey is engulfed — food vacuole forms around it
      pred.phagoTimer = 0.5; // Brief pause for engulfment animation
      // Finish leftover meal fraction (already paid biteFrac above; add remainder once)
      var leftFrac = Math.max(0, 1 - (typeof biteFrac==='number' ? biteFrac : 1));
      if(leftFrac > 0.02){
        var rest = ((preyEn0||10)*0.50 + (preySize0||1)*3.2) * leftFrac;
        var restEn = rest * 0.50;
        var restMass = Math.max(0, rest * 0.50 * 0.14);
        pred.energy = Math.min(120, (pred.energy||0) + restEn);
        pred.massFood = (pred.massFood||0) + restMass;
        pred.size = Math.min((pred.sp.size||4)*(pred.sizeMult||1)*1.40, pred.size + restMass*0.22);
        pred._lastEnGain = (pred._lastEnGain||0) + restEn;
        pred._lastMassGain = (pred._lastMassGain||0) + restMass;
      }
      killOrg(prey,DCODE.EATEN);
      // Big burst
      for(var i=0;i<3;i++){var pAng=rng(0,Math.PI*2);var spd=rng(0.3,1.0);parts.push({x:prey.x,y:prey.y,vx:Math.cos(pAng)*spd,vy:Math.sin(pAng)*spd,life:1.0,maxL:1.0,size:rng(0.8,1.5),color:prey.sp.color||'#ccc'});}
      if(pred===player && window.showToast) window.showToast('+'+Math.round(pred._lastEnGain||0)+' эн / +'+((pred._lastMassGain||0).toFixed(1))+' масса', '#4f4');
      if (typeof window !== 'undefined' && state === 'menu' && (window.focusTimer||0) <= 0 && Math.random() < 0.15) { window.focusTarget = pred; window.focusTimer = 2.0; }
  } else {
      // partial nutrition already applied above via biteFrac — no second energy add
      for(var i=0;i<2;i++){var pAng=rng(0,Math.PI*2);var spd=rng(0.3,0.8);parts.push({x:prey.x,y:prey.y,vx:Math.cos(pAng)*spd,vy:Math.sin(pAng)*spd,life:0.8,maxL:0.8,size:rng(0.6,1.2),color:prey.sp.color||'#ccc'});}
      if(pred===player && window.showToast) window.showToast('Укус +'+Math.round(pred._lastEnGain||0)+' эн / +'+((pred._lastMassGain||0).toFixed(1))+' м', '#fa4');
  }
}
function killOrg(o,cause){
  if(!o.alive)return;
  o.alive=false;o.dying=true;o.deathT=0;o.deathCause=cause;
  
  // Chemotaxis (Danger Pheromone)
  if (!window.pheromones) window.pheromones = [];
  if (cause !== DCODE.EATEN) window.pheromones.push({x: o.x, y: o.y, type: 'danger', life: 1.0});

  // Toxic Clouds (Task 10)
  if(o.sp.flags && o.sp.flags.toxic && settings.particles) {
      if(!window.toxicClouds) window.toxicClouds = [];
      for(var k=0; k<5; k++) window.toxicClouds.push({
          x:o.x+rng(-10,10), y:o.y+rng(-10,10), r:rng(30,80), life:1.0, 
          vx:rng(-2,2), vy:rng(-2,2)
      });
  }
  
  // ALL dead organisms create detritus (organic matter for decomposers)
  if (cause !== DCODE.EATEN) {
     // Small orgs: 1 detritus particle. Large: multiple.
     var numFrags = Math.max(1, Math.floor(o.size / 4));
     var fragR = Math.max(8, o.size * 2.5);
     var fragInt = Math.max(0.3, o.size * 0.15);
     for(var f=0; f<numFrags; f++) {
        nutrientClouds.push({
          x: o.x + rng(-o.size, o.size),
          y: o.y + rng(-o.size, o.size),
          r: fragR,
          intensity: fragInt,
          vx: rng(-0.05, 0.05),
          vy: rng(0.01, 0.1)  // detritus slowly sinks
        });
     }
  }

  if(o.sp && speciesPop[o.sp.id]){
      speciesPop[o.sp.id].alive--;
      speciesPop[o.sp.id].deaths[cause]++;
      if (speciesPop[o.sp.id].alive === 0 && speciesPop[o.sp.id].born > 20) {
          if (window.logEvent) window.logEvent("Вид " + o.sp.name + " вымер!", "#f66");
      }
  }
  stats.deaths++;stats.deathCauses[cause]++;
}

function doCyst(o){
  // Cyst: dormant resting stage with thick protective wall
  o.cyst=!o.cyst;o.cystT=0;
  if(o.cyst){
    o.cystDur=rng(10,30); // Duration of dormancy
    o.speedMult=0; // Frozen metabolism
    o.vx=0;o.vy=0;
  } else {
    o.speedMult=1; // Reactivate
  }
}

function updateInfections(dt){
  for(var i=0;i<orgs.length;i++){
    var o=orgs[i];
    if(o.infected&&o.alive&&!o.dying){
      o.infectionT+=dt;
      o.flash=Math.max(o.flash,0.15);o.flashColor='#f44';
      // Lysis after 15-25 seconds
      if(o.infectionT>15+rng(0,10)){
        // #21 Virus lysis: cell bursts, releasing phages (dramatic visual)
        var numNew=4+Math.floor(Math.random()*4);
        for(var v=0;v<numNew;v++){
          viruses.push({x:o.x+rng(-5,5),y:o.y+rng(-5,5),vx:rng(-3,3),vy:rng(-3,3),
            sp:VIRUS_SPECS[Math.floor(Math.random()*VIRUS_SPECS.length)],
            target:null,age:0,angle:rng(0,Math.PI*2),wobble:rng(0,Math.PI*2)});
        }
        killOrg(o,DCODE.LYSIS);
        // Burst particles: cell debris + viral particles
        if(settings.particles){
          for(var p=0;p<4;p++)parts.push({x:o.x,y:o.y,vx:rng(-1,1),vy:rng(-1,1),life:0.8,maxL:0.8,size:rng(0.5,1.5),color:o.sp.color});
        }
      }
    }
  }
}

function updateViruses(dt){
  var vr=settings.virusRate*DIFF[difficulty].virus;
  virusT+=dt;
  if(virusT>8/vr){virusT=0;spawnVirus();}
  for(var i=viruses.length-1;i>=0;i--){
    var v=viruses[i];v.age+=dt;
    v.wobble+=dt*3;
    // Find target bacteria
    if(!v.target||!v.target.alive){
      v.target=null;
      for(var j=0;j<orgs.length;j++){
        var o=orgs[j];
        var isTarget = (v.sp.type === 'parasite') ? o.isPlayer : (v.sp.target ? o.sp.cat===v.sp.target : true);
        if(o.alive&&!o.infected&&isTarget&&dist2(v,o)<300*300){v.target=o;break;}
      }
    }
    if(v.target&&v.target.alive){
      var dx=v.target.x-v.x,dy=v.target.y-v.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<15){
          if(Math.random() > (v.target.virusResist || 0)){
            if(!v.target.cyst){v.target.infected=true;}
            v.target.infectionT=0;
            if(v.sp.type === 'parasite') v.target.parasiticInfection = true;
          }
          viruses.splice(i,1);continue;
      }
      v.vx+=dx/d*0.5*dt*60;v.vy+=dy/d*0.5*dt*60;
    }
    v.vx*=0.95;v.vy*=0.95;
    v.x+=v.vx*dt*60;v.y+=v.vy*dt*60;
    v.angle=Math.atan2(v.vy,v.vx);
    // Remove old viruses
    if(v.age>60)viruses.splice(i,1);
  }
}





function spawnVirus(){
  if(viruses.length>30)return;
  var vi=Math.floor(Math.random()*VIRUS_SPECS.length);
  var vs=VIRUS_SPECS[vi];
  var d=rng(50,PD-50),hw=halfW(d)-20;
  viruses.push({x:rng(-hw,hw),y:d,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),
    sp:vs,target:null,age:0,angle:rng(0,Math.PI*2),wobble:rng(0,Math.PI*2)});
}

