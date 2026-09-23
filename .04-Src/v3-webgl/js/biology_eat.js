"use strict";

function eatOrg(pred,prey){
  if(!prey||!prey.alive)return;
  // Player overrides soft locks on prey
  if(!(pred&&pred.isPlayer)){
    if(prey.divCD>0||prey.invuln>0)return;
  } else {
    if(prey.invuln>0.8)return;
  }
  if(prey.sp.cat==='consumer1' && Math.random()<0.15) {
     pred.parasite = prey.sp;
     pred.flashColor='#f0f'; pred.flash=0.5;
     killOrg(prey, DCODE.EATEN);
     return;
  }
  if (prey.sp.flags && prey.sp.flags.venom) {
     // Venom: paralyzes predator for several seconds
     pred.speedMult = 0.05; // Almost paralyzed
     pred.flashColor = '#0f0'; pred.flash = 0.8;
     pred.energy -= 20; // Venom damage
     pred.venomTimer = 5; // 5 seconds of venom effect
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
  // if(settings.particles) window.dmgIndicators.push({x:prey.x, y:prey.y, val:Math.round(dmg), life:1.0});
  
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
  pred.flash=0.7; pred.flashColor='#ff8';
  prey.flash=0.9; prey.flashColor='#f44';
  
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
      for(var i=0;i<20;i++){
          var pAng = rng(0, Math.PI*2);
          var spd = rng(2, 8);
          parts.push({x:prey.x,y:prey.y,vx:Math.cos(pAng)*spd,vy:Math.sin(pAng)*spd,life:1.2,maxL:1.2,size:rng(2,6),color:prey.sp.color||'#ff8'});
      }
      if(pred===player && window.showToast) window.showToast('+'+Math.round(pred._lastEnGain||0)+' эн / +'+((pred._lastMassGain||0).toFixed(1))+' масса', '#4f4');
      if (typeof window !== 'undefined' && state === 'menu' && (window.focusTimer||0) <= 0 && Math.random() < 0.15) { window.focusTarget = pred; window.focusTimer = 2.0; }
  } else {
      // partial nutrition already applied above via biteFrac — no second energy add
      for(var i=0;i<12;i++){
          var pAng = rng(0, Math.PI*2);
          var spd = rng(1, 5);
          parts.push({x:prey.x,y:prey.y,vx:Math.cos(pAng)*spd,vy:Math.sin(pAng)*spd,life:0.9,maxL:0.9,size:rng(2,5),color:prey.sp.color||'#fa4'});
      }
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
  
  // Gore & Fragments: Spawn detritus/meat chunks if the organism was large
  if (cause !== DCODE.EATEN && o.size > 20) {
     var numFrags = Math.floor(o.size / 10);
     for(var f=0; f<numFrags; f++) {
        nutrientClouds.push({x: o.x + rng(-o.size, o.size), y: o.y + rng(-o.size, o.size), r: rng(10, 20), intensity: rng(0.5, 1.5)});
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
