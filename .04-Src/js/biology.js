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
    size:sp.size*(0.85+rng(0,0.3)),
    currentSize: sp.size,
    spawnTime: gt,
    angle:rng(0,Math.PI*2),facing:rng(0,Math.PI*2),
    state:'idle',target:null,
    dividing:false,divT:0,cyst:false,cystT:0,
    divCD:0,
    infected:false,infectionT:0,
    dying:false,deathT:0,deathCause:-1,
    flash:0,flashColor:'#fff',
    wobble:rng(0,Math.PI*2),pulse:rng(0,Math.PI*2),
    flagPhase:rng(0,Math.PI*2),cilPhase:rng(0,Math.PI*2),
    glideTrail:[],
    generation:0,offspring:0,eaten:0, speedMult:1.0, sizeMult:1.0, tempOffset:0.0, o2Offset:0.0, acidResist:0.0, stomach:[], inBiofilm:false, biofilmT:0,
    isPlayer:!!isPlayer,alive:true,_remove:false,
    gender: Math.random() < 0.5 ? 'M' : 'F', seekingMate: false,
    invuln:isPlayer?10:0
  };
  o.organs=genOrgans(o);
  orgs.push(o);
  if(speciesPop[sp.id]){speciesPop[sp.id].alive++;speciesPop[sp.id].born++;}
  stats.births++;
  return o;
}

function doDivide(o){
  if(o.dividing||o.energy<o.sp.repEnergy||o.age<o.sp.minAge||o.divCD>0)return;
  o.dividing=true;o.divT=0;o.state='dividing';
  o.preDivSize=o.size; // Remember original size
}

function finishDivide(o){
  o.dividing=false;o.energy*=0.5;
  // Parent becomes ~half size (clearly visible), then slowly regrows via normal growth
  var base = o.preDivSize || o.size;
  o.size = Math.max(2, base * 0.5);
  o.divCD=DIV_COOLDOWN; if(o===player||window.spectatorMode) window.playSound("divide");
  // KEY FIX: push child AWAY with separation impulse + cooldown
  var pushAng=rng(0,Math.PI*2);
  var cx=o.x+Math.cos(pushAng)*DIV_SEPARATION;
  var cy=o.y+Math.sin(pushAng)*DIV_SEPARATION;
  // Clamp child to puddle
  var hw=halfW(cy)-15;cx=clamp(cx,-hw,hw);cy=clamp(cy,5,PD-10);
  var child=spawnOrg(o.sp,cx,cy,false,o.energy);
  if(child){
    child.generation=o.generation+1;child.energy=o.energy*0.9;
    child.size=Math.max(2, base * 0.5 * rng(0.95,1.05));
    child.divCD=DIV_COOLDOWN;
    child.flash=0.7; child.flashColor='#8ff';
    
    // Genetics & Mutations
    child.speedMult = o.speedMult;
    child.sizeMult = o.sizeMult;
    child.tempOffset = o.tempOffset;
    child.o2Offset = o.o2Offset;
    child.acidResist = o.acidResist;

    if(Math.random() < 0.15) {
       var gene = Math.floor(Math.random()*5);
       if(gene===0) child.speedMult *= rng(0.9, 1.1);
       if(gene===1) child.sizeMult *= rng(0.9, 1.1);
       if(gene===2) child.tempOffset += rng(-2, 2);
       if(gene===3) child.o2Offset += rng(-5.0, 5.0);
       if(gene===4) child.acidResist += rng(-0.2, 0.2);
       
       child.acidResist = Math.max(0, Math.min(1, child.acidResist));
       child.speedMult = Math.max(0.1, Math.min(5.0, child.speedMult));
    }

    // Push apart
    var pushForce=3;
    o.vx+=Math.cos(pushAng)*pushForce;o.vy+=Math.sin(pushAng)*pushForce;
    child.vx-=Math.cos(pushAng)*pushForce;child.vy-=Math.sin(pushAng)*pushForce;
    o.offspring++;
  }
  o.divCD=DIV_COOLDOWN;
  o.flash=0.8;o.flashColor='#8ff';
  if(settings.particles)for(var i=0;i<18;i++)parts.push({x:o.x,y:o.y,vx:rng(-4,4),vy:rng(-4,4),life:1.2,maxL:1.2,size:rng(2,6),color:i%2?'#8ff':'#fff'});
  if(o===player && window.showToast) window.showToast('Деление!', '#8ff');
  if (typeof window !== 'undefined' && state === 'menu' && window.focusTimer <= 0 && Math.random() < 0.2) { window.focusTarget = o; window.focusTimer = 2.0; }
}

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
  
  // if(!window.dmgIndicators) window.dmgIndicators=[];
  var dmg = pred.size * 0.5;
  
  // Phytoplankton defenses
  if(prey.sp.flags) {
     if(prey.sp.flags.shell) dmg *= 0.2; // Silicon shell reduces damage
     if(prey.sp.flags.spikes) {
         var recoil = dmg * 0.4;
         pred.size -= recoil; // Takes damage back!
         // if(settings.particles) window.dmgIndicators.push({x:pred.x, y:pred.y, val:Math.round(recoil), life:1.0});
     }
     if(prey.sp.flags.toxic) {
         var res = pred.acidResist || 0;
         pred.speedMult = 0.1 + 0.8 * res; // Poisoned!
         pred.flashColor = '#0f0'; pred.flash = 0.8;
         pred.energy -= 10 * Math.max(0, 1 - res);
     }
  }
  
  if (prey.size < dmg) dmg = prey.size;
  prey.size -= dmg;
  // if(settings.particles) window.dmgIndicators.push({x:prey.x, y:prey.y, val:Math.round(dmg), life:1.0});
  
  var gain=prey.energy*0.55+prey.size*1.5;
  if(!pred.stomach) pred.stomach=[];
  
  pred.stomach.push({
    sp: prey.sp,
    t: prey.sp.cat,
    color: prey.sp.color,
    size: prey.size*0.5,
    energy: gain,
    x: rng(-pred.size*0.4, pred.size*0.4),
    y: rng(-pred.size*0.4, pred.size*0.4)
  });
  if(pred.stomach.length>5) pred.stomach.shift();
  
  if(pred === player) {
      if(typeof window.gameStats === 'undefined') window.gameStats = { dna: 0 };
      if(typeof window.gameStats.dna === 'undefined') window.gameStats.dna = 0;
      window.gameStats.dna += 1;
  }
  
  // Strong visual feedback always
  pred.eaten++;
  pred.flash=0.7; pred.flashColor='#ff8';
  prey.flash=0.9; prey.flashColor='#f44';
  
  if (typeof window !== 'undefined' && window.playSound) {
    if(player&&dist2(player,pred)<2500 || player&&dist2(player,prey)<2500) window.playSound("eat", prey.x, prey.y);
  }
  
  if (prey.size <= 2) {
      // Phagocytosis: prey is engulfed — food vacuole forms around it
      pred.phagoTimer = 0.5; // Brief pause for engulfment animation
      killOrg(prey,DCODE.EATEN);
      var gained = prey.sp.energy * 0.8;
      pred.energy += gained;
      if(pred.energy > 120) pred.energy = 120;
      // Big burst
      for(var i=0;i<20;i++){
          var pAng = rng(0, Math.PI*2);
          var spd = rng(2, 8);
          parts.push({x:prey.x,y:prey.y,vx:Math.cos(pAng)*spd,vy:Math.sin(pAng)*spd,life:1.2,maxL:1.2,size:rng(2,6),color:prey.sp.color||'#ff8'});
      }
      if(pred===player && window.showToast) window.showToast('+'+Math.round(gained)+' энергия', '#4f4');
      if (typeof window !== 'undefined' && state === 'menu' && (window.focusTimer||0) <= 0 && Math.random() < 0.15) { window.focusTarget = pred; window.focusTimer = 2.0; }
  } else {
      var gained2 = dmg * 0.5;
      pred.energy += gained2; // partial eat
      for(var i=0;i<12;i++){
          var pAng = rng(0, Math.PI*2);
          var spd = rng(1, 5);
          parts.push({x:prey.x,y:prey.y,vx:Math.cos(pAng)*spd,vy:Math.sin(pAng)*spd,life:0.9,maxL:0.9,size:rng(2,5),color:prey.sp.color||'#fa4'});
      }
      if(pred===player && window.showToast) window.showToast('Укус! +'+Math.round(gained2), '#fa4');
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
          for(var p=0;p<20;p++)parts.push({x:o.x,y:o.y,vx:rng(-6,6),vy:rng(-6,6),life:1.5,maxL:1.5,size:rng(2,6),color:p<10?'#f44':o.sp.color});
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

function updateOrg(o,dt){
  if (typeof cam !== 'undefined' && window.spatialGrid) {
    var dx = cam.x - o.x, dy = cam.y - o.y;
    var inGrid = window.spatialGrid[Math.floor(o.x/1000)+','+Math.floor(o.y/1000)];
    if (dx*dx + dy*dy > 25000000 && !inGrid) {
      o.skipTick = !o.skipTick;
      if (o.skipTick) return;
      dt *= 2;
    }
  }
  if(o.invuln>0)o.invuln-=dt;
  if(o.speedMult < 1.0) o.speedMult = Math.min(1.0, (o.speedMult||1.0) + dt*0.05);
  if(o.stomach && o.stomach.length>0){
    for(var stIdx=o.stomach.length-1; stIdx>=0; stIdx--){
      var st=o.stomach[stIdx];
      var digestSpeed=dt*15;
      if(digestSpeed>st.energy*0.1) digestSpeed=st.energy*0.1;
      if(st.energy<digestSpeed) digestSpeed=st.energy;
      st.energy-=digestSpeed; o.energy+=digestSpeed;
      st.size-=dt*1.5;
      if(st.energy<=0 || st.size<=0) {
         if(settings.particles) parts.push({x:o.x, y:o.y, vx:rng(-1,1), vy:rng(-1,1), life:rng(3,8), maxL:1, size:rng(2,4), color:'#864'});
         o.stomach.splice(stIdx, 1);
      }
    }
    if(o.energy>110) o.energy=110;
  }
  
  // Plant/vegetation collision — organisms navigate around solid plants
  if(shoreDecor && shoreDecor.length > 0 && o.y < PD*0.15 && !o.cyst){
    for(var pi=0; pi<shoreDecor.length; pi++){
      var plant=shoreDecor[pi];
      if(plant.type==='pebble') continue; // Only grass/reed are solid
      var pdx=o.x-plant.x, pdy=o.y-plant.y;
      var pdist2=pdx*pdx+pdy*pdy;
      var pradius=plant.size*0.8;
      if(pdist2 < pradius*pradius && pdist2 > 0.01){
        var pdist=Math.sqrt(pdist2);
        var push=(pradius-pdist)/pradius;
        o.vx += (pdx/pdist)*push*8*dt*60;
        o.vy += (pdy/pdist)*push*8*dt*60;
      }
    }
  }
  // Lilypad collision (they are physical objects now)
  if(o.y < 120 && o.y > -120) {
     var lpNearest = Math.round((o.x - 50) / 600) * 600 + 50;
     if(Math.abs(lpNearest) % 3 !== 0) {
         var dx = o.x - lpNearest;
         var dy = o.y - 0;
         var nx = dx / 250;
         var ny = dy / 40;
         var distSq = nx*nx + ny*ny;
         if(distSq < 1.0) {
             var dist = Math.sqrt(distSq) || 0.01;
             var overlap = 1.0 - dist;
             var force = overlap * 300 * dt;
             o.vx += (nx / dist) * force;
             o.vy += (ny / dist) * force * 5;
         }
     }
  }

  // O2 & Temp effects
  var band = Math.max(0, Math.min(19, Math.floor(o.y / (PD/20))));
  var isDay = (tod>6&&tod<18);
  if(o.sp.cat === 'producer' && isDay) O2_GRID[band] = Math.min(150, O2_GRID[band] + o.size*dt*0.8);
  else if(o.sp.isEuk || o.sp.cat==='consumer1') O2_GRID[band] -= o.size*dt*0.05;
  
  if(O2_GRID[band] < 15 && !o.cyst && o.sp.isEuk) { o.energy -= dt*5; o.flash=0.1; o.flashColor='#f00'; }
  let curT = window.getTempAt(o.x, o.y);
  if(!o.cyst && (curT < 2 || curT > 35)) doCyst(o);
  
  // #18 Fungal spores — sporangium produces spores
  if(o.sp.cat==='decomposer' && o.energy>80 && Math.random()<0.05*dt) {
      o.energy -= 20;
      o.sporeFlash=0.5; // Visual: sporangium release flash
      var sporeCount=Math.floor(rng(2,5));
      for(var sp=0;sp<sporeCount;sp++){
        var c = spawnOrg(o.sp, o.x + rng(-25,25), o.y - rng(15, 60));
        if(c) { c.size *= 0.3; c.energy = 20; c.cyst = true; c.cystT = 0; }
      }
  }
  if(o.attachedTo) {
      if(!o.attachedTo.alive || o.attachedTo.dying) {
         o.attachedTo = null;
         o.attachTime = 0;
      } else {
         o.attachTime = (o.attachTime || 0) + dt;
         var targetX = o.attachedTo.x + Math.cos(o.attachAng) * o.attachDist;
         var targetY = o.attachedTo.y + Math.sin(o.attachAng) * o.attachDist;
         o.x += (targetX - o.x) * 0.1;
         o.y += (targetY - o.y) * 0.1;
         o.vx = o.attachedTo.vx;
         o.vy = o.attachedTo.vy;
         
         o.attachedTo.energy += dt * 0.5;
         o.energy += dt * 0.5;
         
         if (o.attachTime > 60 && Math.random() < 0.01 * dt) {
             var host = o.attachedTo;
             if (!host.sp.isCustom) {
                 host.sp = Object.assign({}, host.sp);
                 host.sp.flags = Object.assign({}, host.sp.flags || {});
                 host.sp.bio = Object.assign({}, host.sp.bio || {});
                 host.sp.isCustom = true;
             }
             host.sp.bio = host.sp.bio || {};
             var orgType = Math.random() < 0.5 ? 'chloroplasts' : 'mitochondria';
             host.sp.bio[orgType] = (host.sp.bio[orgType] || 0) + 1;
             if (typeof genOrgans === 'function') host.organs = genOrgans(host);
             if (typeof DCODE !== 'undefined') killOrg(o, DCODE.AGE); else killOrg(o, 0);
             return;
         }
         
         if(Math.random() < 0.01 * dt) { o.attachedTo = null; o.attachTime = 0; }
         return;
      }
  }

  if(o.isPlayer && !o.alive && !o.dying){o.dying=true;o.deathT=0;o.deathCause='energy';}
  if(o.dying){o.deathT+=dt;o.size*=Math.pow(0.95,dt*60);if(o.deathT>1.2)o._remove=true;return;}
  if(!o.alive)return;
  o.age+=dt;
  // Reduced base metabolism and speed multiplier significantly to prevent fast infusoria from starving in 10s
  var baseMetab=(0.008 + o.sp.speed * o.speedMult * 0.003)*DIFF[difficulty].metab;
  var metabMult = o.inBiofilm ? 0.3 : 1.0;
  var metab = baseMetab * metabMult;
  if(metab*dt > 2) metab = 2/dt;
  if(o.parasite) {
     o.energy -= dt*(o.isPlayer?2.5:8); o.flash=0.1; o.flashColor='#f0f';
     if(Math.random()<0.02*dt) {
        var p = spawnOrg(o.parasite, o.x+rng(-10,10), o.y+rng(-10,10));
        if(p) { p.size*=0.5; p.energy=20; }
     }
  }
  
  var tempBand = Math.max(0, Math.min(19, Math.floor(o.y / (PD/20))));
  var curTemp = window.getTempAt(o.x, o.y);
  var tMin = o.sp.tempRange[0] + o.tempOffset - 5;
  var tMax = o.sp.tempRange[1] + o.tempOffset + 12;
  if(curTemp<tMin||curTemp>tMax){
      if(!o.isPlayer && !o.cyst && o.energy > 20) { o.cyst = true; o.energy -= 10; o.vx=0; o.vy=0; }
      if(o.isPlayer){ o.energy -= dt*0.4; } // mild stress only
      if(!o.cyst && o.energy<5&&Math.random()<0.0008*dt){killOrg(o,DCODE.TEMP);return;}
  } else {
      if(o.cyst && o.energy > 5 && !o.isPlayer) { o.cyst = false; }
  }
  
  if(o.lastTemp !== undefined && Math.abs(o.lastTemp - curTemp) > 12) {
      if(settings.particles) for(var k=0;k<5;k++) parts.push({x:o.x,y:o.y,vx:rng(-2,2),vy:rng(-2,2),life:rng(2,5),maxL:5,size:rng(1,3),color:o.sp.color});
      killOrg(o, DCODE.STARVE); return;
  }
  o.lastTemp = window.getTempAt(o.x, o.y);

  // Eco-Balance 2.0 and Respiration
  if(o.sp.cat==='producer'){
    var photo=lightAt(o.y)*0.95;
    // BIO-001 FIX: No photosynthesis at night (lightMul check)
    if(dayLight<0.05) photo=0;
    var nutr=0;
    // Photosynthesis requires CO2 and produces O2
    var co2Lim = Math.min(1.0, globalCO2 / 50.0);
    photo *= co2Lim;
    globalCO2 -= photo * dt * 0.1;
    globalO2 += photo * dt * 0.1;
    if(photo > 0.1 && Math.random() < 0.05 * dt * 60 && typeof o2Bubbles !== 'undefined') {
        o2Bubbles.push({x: o.x + (Math.random()*2-1)*o.size, y: o.y, vy: -(Math.random()*1.5+0.5), r: Math.random()*2+1, life: 1});
    }

    for(var n=0;n<nutrientClouds.length;n++){if(dist2(o,nutrientClouds[n])<nutrientClouds[n].r*nutrientClouds[n].r){nutr=nutrientClouds[n].intensity*0.5;break;}}
    o.energy+=(photo+nutr-metab)*dt*DIFF[difficulty].energy;
  }else{
    // Respiration: consumes O2, produces CO2
    var o2Lim = Math.min(1.0, Math.max(0, globalO2 + o.o2Offset) / 50.0);
    o.energy-=metab*dt*DIFF[difficulty].energy * (2.0 - o2Lim); // Starves faster if no O2
    globalO2 -= metab * dt * 0.05;
    globalCO2 += metab * dt * 0.05;
  }

  // Player energy floor/ceiling — never snap to weird negatives from stacked drains
  if(o.isPlayer){
    if(o.energy < 1) o.energy = 1; // keep controllable; death handled slowly below
    if(o.energy > 120) o.energy = 120;
    if(o.parasite && o.energy < 15){ o.parasite=null; if(window.showToast) window.showToast('Паразит сброшен','#fd8'); }
  }

  // Fluid Dynamics (Vortices/Trails)
  if (o.size > 20 && o.speedMult > 0.1 && (Math.abs(o.vx)>10 || Math.abs(o.vy)>10)) {
     if(Math.random() < 0.2) {
       parts.push({x:o.x-o.vx*0.1,y:o.y-o.vy*0.1,vx:-o.vy*0.1,vy:o.vx*0.1,life:rng(1,3),maxL:3,size:rng(2,4),color:'rgba(255,255,255,0.1)'});
     }
  }

  // Flocking AI for Colony species
  if (o.sp.flags && o.sp.flags.chain && !o.dying && o.state !== 'flee' && o.state !== 'hunt') {
    var cx=0, cy=0, cvx=0, cvy=0, count=0;
    for(var j=0; j<orgs.length; j++){
      var n = orgs[j];
      if (n !== o && n.sp.id === o.sp.id && dist2(o, n) < 25000) {
         cx += n.x; cy += n.y; cvx += n.vx; cvy += n.vy; count++;
         if (dist2(o, n) < (o.size + n.sp.size)*2) {
           o.vx -= (n.x - o.x)*0.01; o.vy -= (n.y - o.y)*0.01; // Separation
         }
      }
    }
    if (count > 0) {
       cx /= count; cy /= count; cvx /= count; cvy /= count;
       o.vx += (cx - o.x)*0.005; o.vy += (cy - o.y)*0.005; // Cohesion
       o.vx += cvx*0.01; o.vy += cvy*0.01; // Alignment
    }
  }

  if(o.cyst){o.energy-=0.015*dt;o.cystT=(o.cystT||0)+dt;if(o.cystT>25){o.cyst=false;o.cystT=0;}}
  else {
    // #22 Chemotaxis: move toward nearest nutrient cloud (for producers/decomposers)
    if((o.sp.cat==='producer'||o.sp.cat==='decomposer')&&nutrientClouds&&nutrientClouds.length>0){
      var bestCloud=null,bestD=Infinity;
      for(var nc=0;nc<nutrientClouds.length;nc++){
        var nd=dist2(o,nutrientClouds[nc]);
        if(nd<bestD&&nd<40000){bestD=nd;bestCloud=nutrientClouds[nc];}
      }
      if(bestCloud){
        var cdx=bestCloud.x-o.x,cdy=bestCloud.y-o.y;
        var cdist=Math.sqrt(cdx*cdx+cdy*cdy)||1;
        o.vx+=(cdx/cdist)*o.sp.speed*0.05;
        o.vy+=(cdy/cdist)*o.sp.speed*0.05;
      }
    }
    // #23 Phototaxis: producers move toward light (upward) during day
    if(o.sp.cat==='producer'&&dayLight>0.3){
      o.vy-=o.sp.speed*0.02*dayLight; // Swim upward toward sunlit zone
    }
    // #22 Chemotaxis for predators: move toward prey scent
    if((o.sp.cat==='consumer2'||o.sp.cat==='consumer3')&&!o.isPlayer){
      var foodCatsCh=FOOD[o.sp.cat]||[];
      if(foodCatsCh.length>0){
        for(var pc=0;pc<Math.min(orgs.length,200);pc++){
          var prey2=orgs[pc];
          if(!prey2.alive||prey2===o)continue;
          if(foodCatsCh.indexOf(prey2.sp.cat)<0)continue;
          var pd=dist2(o,prey2);
          if(pd<10000){
            var pdx=prey2.x-o.x,pdy=prey2.y-o.y;
            var plen=Math.sqrt(pdx*pdx+pdy*pdy)||1;
            o.vx+=(pdx/plen)*o.sp.speed*0.03;
            o.vy+=(pdy/plen)*o.sp.speed*0.03;
            break;
          }
        }
      }
    }
    moveOrg(o,dt);
    if(o.isPlayer && window.playerContactEat) window.playerContactEat(dt);
  }
  if(o.dividing){
    o.divT+=dt;
    // VISUAL: progressively shrink as it divides
    if(o.preDivSize){
      var prog=o.divT/1.3; // 0 to 1
      o.size=o.preDivSize*(1-prog*0.15); // Shrink 15% during division
    }
    if(o.divT>1.3)finishDivide(o);
  }
  if(!o.isPlayer&&!o.dividing&&!o.cyst&&o.energy>o.sp.repEnergy&&o.age>o.sp.minAge&&o.divCD<=0){
    if (o.sp.flags && o.sp.flags.gendered) {
        o.seekingMate = true;
        for(let j=0; j<orgs.length; j++) {
            let m = orgs[j];
            if (m !== o && m.alive && m.seekingMate && m.sp.id === o.sp.id && m.gender !== o.gender) {
                let d = Math.hypot(o.x - m.x, o.y - m.y);
                if (d < o.size + m.size + 15) {
                    o.energy -= o.sp.repEnergy * 0.5;
                    m.energy -= m.sp.repEnergy * 0.5;
                    o.seekingMate = false; m.seekingMate = false;
                    doDivide(o); doDivide(m);
                    break;
                } else if (d < 400) {
                    let ax = m.x - o.x; let ay = m.y - o.y;
                    let len = Math.hypot(ax, ay);
                    o.vx += (ax/len) * o.sp.speed * 0.1;
                    o.vy += (ay/len) * o.sp.speed * 0.1;
                }
            }
        }
    } else if (o.sp.cat === 'consumer1' && Math.random() < 0.001 * dt) {
        // #29 Bacterial conjugation: exchange plasmid via pilus
        for (var bj = 0; bj < orgs.length; bj++) {
          var bn = orgs[bj];
          if (bn !== o && bn.alive && bn.sp.id === o.sp.id && dist2(o, bn) < 400) {
            o.conjugating = 0.5; bn.conjugating = 0.5;
            // Exchange energy (plasmid transfer simulation)
            var avg = (o.energy + bn.energy) / 2;
            o.energy = avg; bn.energy = avg;
            o.conjugatePartner = bn; bn.conjugatePartner = o;
            break;
          }
        }
    } else {
        if(Math.random()<0.02*dt)doDivide(o);
    }
  }
  if(o.energy<=-5){killOrg(o,DCODE.STARVE);return;}
  if(o.sp.isEuk&&o.age>500){o.energy-=0.15*dt;if(o.energy<5&&Math.random()<0.004*dt){killOrg(o,DCODE.AGE);return;}}
  var tgtSz=o.sp.size*(o.sizeMult||1.0)*(0.5+clamp(o.energy/(o.sp.repEnergy||100),0,1)*1.2);
  o.size=lerp(o.size,tgtSz,1.5*dt);
  if(o.flash>0)o.flash=Math.max(0,o.flash-dt*2);
  // Easy mode auto-divide
  if(o.isPlayer && difficulty==='easy' && o.energy>o.sp.repEnergy && o.age>o.sp.minAge && o.divCD<=0) doDivide(o);
  // AUTO-EAT: ALL organisms eat prey on contact (not just player!)
  if(o.alive&&!o.dividing&&!o.cyst&&!o.dying){
    var foodCats=FOOD[o.sp.cat]||[];
    if(foodCats.length>0){
      // Use spatial grid for efficiency instead of looping all orgs
      var nearby = window.getNearby ? window.getNearby(o.x, o.y, o.size+50) : orgs;
      for(var ai=0;ai<nearby.length;ai++){
        var ap=nearby[ai];
        if(!ap.alive||ap===o||ap.cyst||ap.divCD>0||ap.invuln>0)continue;
        if (ap.isPlayer && (gt - (ap.spawnTime||0)) < 30) continue; // Grace period
        var isCan=(o.sp.flags&&o.sp.flags.cannibal&&o.energy<20&&ap.sp.id===o.sp.id);
        if(!isCan&&foodCats.indexOf(ap.sp.cat)<0)continue;
        if(ap.size>=o.size*0.88)continue;
        var dd=dist2(o,ap);
        if(dd<(o.size+ap.sp.size+15)*(o.size+ap.sp.size+15)){
          eatOrg(o,ap);
          break;
        }
      }
    }
  }
}

