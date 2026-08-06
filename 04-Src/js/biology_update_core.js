// biology_update.js — per-frame organism update (extracted from biology.js)

function updateOrg(o,dt){
  // 5) укрытие у кувшинок — каждый тик
  if(typeof updateLilyCover==='function') updateLilyCover(o);
  if (typeof cam !== 'undefined' && window.spatialGrid) {
    var dx = cam.x - o.x, dy = cam.y - o.y;
    var inGrid = window.spatialGrid[Math.floor(o.x/1000)+','+Math.floor(o.y/1000)];
    if (dx*dx + dy*dy > 25000000 && !inGrid) {
      o.skipTick = !o.skipTick;
      if (o.skipTick) return;
      dt *= 2;
    }
  }
  if(o.eatCD>0) o.eatCD -= dt;
  if(o.invuln>0){
    o.invuln-=dt;
    // Grace period: no energy drain — survive after division/spawn
    o.energy = Math.max(o.energy, 40);
    // DON'T return — organism still moves and behaves normally
  }
  // Protect freshly divided twin for a while, then become normal
  if(o._noCull>0){ o._noCull -= dt; if(o._noCull<=0) o._noCull=0; }
  if(o._fromDivide){
    o._divideAge = (o._divideAge||0) + dt;
    if(o._divideAge > 15 && (o.invuln||0)<=0 && (o._noCull||0)<=0){
      o._fromDivide = false; // now normal organism
    }
  }
  if(o.speedMult < 1.0) o.speedMult = Math.min(1.0, (o.speedMult||1.0) + dt*0.05);
  if(o.stomach && o.stomach.length>0){
    for(var stIdx=o.stomach.length-1; stIdx>=0; stIdx--){
      var st=o.stomach[stIdx];
      var _ds = (o.digestSpeed||1.0);
      var digestSpeed=dt*15*_ds;
      if(digestSpeed>st.energy*0.1) digestSpeed=st.energy*0.1;
      if(st.energy<digestSpeed) digestSpeed=st.energy;
      st.energy-=digestSpeed; o.energy+=digestSpeed;
      st.size-=dt*1.5;
      if(st.energy<=0 || st.size<=0) {
         if(settings.particles) parts.push({x:o.x, y:o.y, vx:rng(-0.3,0.3), vy:rng(-0.3,0.3), life:0.5, maxL:0.5, size:0.8, color:o.sp.color});
         o.stomach.splice(stIdx, 1);
      }
    }
    if(o.energy>110) o.energy=110;
  }
  
  // Plant/vegetation collision — organisms navigate around solid plants
  // Shore plants: decorative only near surface (never block player to waterline)
  if(shoreDecor && shoreDecor.length > 0 && o.y < PD*0.15 && o.y > 25 && !o.cyst && !o.isPlayer){
    for(var pi=0; pi<shoreDecor.length; pi++){
      var plant=shoreDecor[pi];
      if(plant.type==='pebble' || plant.type==='float') continue;
      var pdx=o.x-plant.x, pdy=o.y-plant.y;
      var pdist2=pdx*pdx+pdy*pdy;
      var pradius=plant.size*0.55;
      if(pdist2 < pradius*pradius && pdist2 > 0.01){
        var pdist=Math.sqrt(pdist2);
        var push=(pradius-pdist)/pradius;
        o.vx += (pdx/pdist)*push*4*dt*60;
        o.vy += (pdy/pdist)*push*2*dt*60;
      }
    }
  }
  // Lilypads: NO collision — swim freely to surface (y≈0)

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
  // Division progress FIRST — cannot be blocked by cyst/temp/move
  if(o.dividing){
    // Ensure visible progress even if sim dt is tiny / timeScale low
    var step = dt;
    if(!(step > 0)) step = 0.016;
    if(step < 0.01) step = 0.01;
    // ~0.6s wall-clock completion at 60fps
    o.divT = (o.divT||0) + Math.max(step, 0.02);
    if(o.preDivSize){
      var prog=Math.min(1, o.divT/0.55);
      o.size = Math.max(1.5, o.preDivSize * (1 - prog*0.5));
    }
    if(o.divT >= 0.55){
      try { finishDivide(o); }
      catch(err){
        o.dividing=false; o.divCD=8; o.massFood=0; o.eatsSinceDiv=0;
        o.size = Math.max(1.6, (o.preDivSize||o.size)*0.5);
      }
    }
    o.age += step;
    if(o.flash>0) o.flash=Math.max(0,o.flash-step*2);
    return;
  }
  o.age+=dt;
  // Reduced base metabolism and speed multiplier significantly to prevent fast infusoria from starving in 10s
  var baseMetab=(0.008 + o.sp.speed * o.speedMult * 0.003)*DIFF[difficulty].metab;
  // Хищники (consumer3): расход энергии x0.1 — живут ~в 10 раз дольше без еды
  if(o.sp && o.sp.cat === 'consumer3') baseMetab *= 0.10;
  // Средние едоки чуть экономнее
  if(o.sp && o.sp.cat === 'consumer2') baseMetab *= 0.55;
  // TSK-BIO-011: Flagella efficiency — high speed = exponential energy cost
  if(o.sp.locomotion==='flagella' || o.sp.locomotion==='cilia') baseMetab *= Math.pow(o.speedMult||1, 1.5);
  var metabMult = o.inBiofilm ? 0.3 : 1.0;
  // TSK-BIO-012: cellWall reduces speed, increases durability
  if(o.cellWall > 0) metabMult *= (1 + o.cellWall * 0.2); // thicker wall = more energy
  // TSK-BIO-005: Age-related metabolic degradation for Eukaryotes
  if(o.isEuk && o.age > 500) metabMult *= Math.pow(1.05, (o.age - 500) / 10);
  var metab = baseMetab * metabMult;
  if(metab*dt > 2) metab = 2/dt;
  if(o.parasite) {
     // TSK-BIO-023: drain scales with parasite/host size ratio
     var _psize = (o.parasite.size||4);
     var _pdrain = (_psize / Math.max(1, o.size||4)) * 15;
     o.energy -= dt*(o.isPlayer?Math.min(5,_pdrain*0.4):_pdrain); o.flash=0.1; o.flashColor='#f0f';
     if(Math.random()<0.02*dt) {
        var p = spawnOrg(o.parasite, o.x+rng(-10,10), o.y+rng(-10,10));
        if(p) { p.size*=0.5; p.energy=20; }
     }
  }
  
  var tempBand = Math.max(0, Math.min(19, Math.floor(o.y / (PD/20))));
  var curTemp = window.getTempAt(o.x, o.y);
  var _hs = o.heatShock || 0;
  var tMin = o.sp.tempRange[0] + o.tempOffset - 5 - _hs*5;
  var tMax = o.sp.tempRange[1] + o.tempOffset + 12 + _hs*5;
  if(curTemp<tMin||curTemp>tMax){
      if(!o.isPlayer && !o.cyst && o.energy > 20) { o.cyst = true; o.energy -= 10; o.vx=0; o.vy=0; }
      if(o.isPlayer){ o.energy -= dt*0.1; } // mild stress only
      if(!o.cyst && o.energy<5&&Math.random()<0.0008*dt){killOrg(o,DCODE.TEMP);return;}
  } else {
      if(o.cyst && o.energy > 5 && !o.isPlayer) { o.cyst = false; }
  }
  
  if(o.lastTemp !== undefined && Math.abs(o.lastTemp - curTemp) > 12) {
      if(settings.particles) parts.push({x:o.x,y:o.y,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),life:0.5,maxL:0.5,size:0.8,color:o.sp.color});
      killOrg(o, DCODE.STARVE); return;
  }
  o.lastTemp = window.getTempAt(o.x, o.y);

  // Eco-Balance 2.0 and Respiration
  // DECOMPOSER FEEDING: absorb dissolved organic matter (detritus/nutrient clouds)
  if(o.sp.cat==='decomposer'){
    var detrGain = 0;
    for(var dn=0; dn<nutrientClouds.length; dn++){
      var nc = nutrientClouds[dn];
      if(dist2(o, nc) < nc.r * nc.r){
        // Absorb detritus — decomposer gains energy, cloud depletes
        detrGain = nc.intensity * 0.8 * dt * DIFF[difficulty].energy;
        nc.intensity -= detrGain * 0.3; // cloud slowly depletes
        if(nc.intensity < 0.05) nutrientClouds.splice(dn, 1); // remove depleted cloud
        break;
      }
    }
    o.energy += detrGain;
    // Decomposers also gain mass from feeding
    if(detrGain > 0){
      o.massFood = (o.massFood||0) + detrGain * 0.3;
      o.size = Math.min((o.sp.size||4) * 1.3, o.size + detrGain * 0.01);
    }
  }
  if(o.sp.cat==='producer'){
    var _pa = o.photoAdapt || 0;
    var photo=lightAt(o.y - _pa*200)*1.4; // TSK-BIO-018: depth-adapted photosynthesis
    // BIO-001 FIX: No photosynthesis at night (lightMul check)
    if(dayLight<0.05) photo=0;
    var nutr=0;
    // Photosynthesis requires CO2 and produces O2
    // Atmosphere is effectively infinite — CO2 never limits photosynthesis in a puddle
    var co2Lim = 1.0;
    // globalCO2/O2 tracked for display but never bottleneck gameplay
    if(photo > 0.1 && Math.random() < 0.05 * dt * 60 && typeof o2Bubbles !== 'undefined') {
        o2Bubbles.push({x: o.x + (Math.random()*2-1)*o.size, y: o.y, vy: -(Math.random()*1.5+0.5), r: Math.random()*2+1, life: 1});
    }

    for(var n=0;n<nutrientClouds.length;n++){if(dist2(o,nutrientClouds[n])<nutrientClouds[n].r*nutrientClouds[n].r){nutr=nutrientClouds[n].intensity*0.5;break;}}
    // DAY: photosynthesis → energy + biomass. NIGHT: respiration → lose both (like real phyto)
    var sun = (photo + nutr) * dt * DIFF[difficulty].energy;
    var resp = metab * dt * DIFF[difficulty].energy;
    o.energy += sun - resp;

    var depthFrac = 1 - clamp((o.y||0) / (PD||10000), 0, 1);
    var dl = (typeof dayLight === 'number') ? dayLight : 1;
    if(dl >= 0.12 && sun > 0){
      // Daylight: net primary production → bank mass
      var sunMass = sun * 0.9 + dl * dt * 0.7;
      sunMass *= (0.55 + depthFrac * 0.9);
      o.massFood = (o.massFood||0) + sunMass;
      if(dl > 0.2){
        var adultCapP = (o.sp.size||4)*(o.sizeMult||1)*1.35;
        o.size = Math.min(adultCapP, o.size + sunMass * 0.08);
      }
    } else {
      // Night / deep dark: no mass gain — respiration burns reserves
      // Stronger loss in full night; milder in twilight
      var dark = clamp(1 - dl / 0.12, 0, 1);
      var burn = dt * (0.22 + dark * 0.45); // mass bleed
      o.massFood = Math.max(0, (o.massFood||0) - burn);
      // slight size shrink if starving at night and low energy
      if(o.energy < 35 && o.size > (o.sp.size||4)*0.55){
        o.size = Math.max((o.sp.size||4)*0.55, o.size - dt * 0.08 * dark);
      }
      // extra energy drain at night (no photo offset)
      if(o.isPlayer){o.energy -= resp*(0.10+dark*0.15);}else{o.energy -= resp*(0.20+dark*0.30);}
    }
  }else{
    // Respiration: consumes O2, produces CO2
    var o2Lim = Math.min(1.0, Math.max(0, globalO2 + o.o2Offset) / 50.0);
    var huntTax = 1.0;
    if(o.state === 'hunt'){
      // Short sprint cost — NOT a death spiral. Cap extra burn.
      huntTax = (o.energy < 40) ? 1.15 : 1.35;
    } else if(o.state === 'rest' || o.state === 'idle'){
      huntTax = 0.55; // conserve when resting
    } else if(o.state === 'wander' || o.state === 'run'){
      huntTax = 0.85;
    }
// Producers already handle their own energy via photosynthesis — skip general drain
    if(o.sp.cat !== 'producer'){
      o.energy-=metab*dt*DIFF[difficulty].energy * (2.0 - o2Lim) * huntTax;
    }
    // Soft floor for NPC predators: enter rest before zero-death
    if(!o.isPlayer && o.energy < 18 && o.energy > 0 && !o.cyst && !o.dying){
      o.state = 'rest';
      o.aiTarget = null;
      // tiny salvage from mass bank if any
      if((o.massFood||0) > 0.5){
        var tap = Math.min(o.massFood, dt * 1.2);
        o.massFood -= tap;
        o.energy += tap * 0.8;
      }
    }
  }

  // Player energy floor/ceiling
  // 10) Не держим floor=1 навсегда: при истощении → циста (один раз)
  if(o.isPlayer){
    if(o.energy < 1){
      if(!o.cyst && !o._starvedOnce){
        o._starvedOnce = true;
        o.cyst = true; o.energy = 10; o.vx=0; o.vy=0; o.aiTarget=null; o.state='rest';
        if(window.showToast) window.showToast('Голод: впал в цисту — найди еду и проснись', '#fc8');
      } else if(o.cyst){
        o.energy = Math.max(o.energy, 0);
      } else {
        // уже был cyst — можно умереть глубже
        o.energy = Math.max(o.energy, -15);
      }
    }
    if(o.energy > 120) o.energy = 120;
    if(o.parasite && o.energy < 15){ o.parasite=null; if(window.showToast) window.showToast('Паразит сброшен','#fd8'); }
  }

  // Fluid Dynamics (Vortices/Trails) — removed for realism

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

  // TSK-BIO-013: Bioluminescence energy drain + flash defense
  if(o.sp.biolum && !o.cyst){
    o.energy -= dt * 0.5;
    if(o._attackedBy){ o._attackedBy.speedMult *= 0.5; o._attackedBy._blinded = 2; o._attackedBy = null; }
  }
  // TSK-BIO-017: Biofilm formation — settle at bottom, -70% metab
  if((o.biofilmGene||0) > 0.5 && !o.cyst && o.y > (typeof PD!=='undefined'?PD:1000) - 50){
    o.inBiofilm = true; o.vx *= 0.3; o.vy *= 0.3;
  }
  if(o.cyst){o.energy-=0.015*dt;o.cystT=(o.cystT||0)+dt;var _cystMax=25+(o.generation||0)*2; if(o.cystT>_cystMax){o.cyst=false;o.cystT=0;}}
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
      o.vy-=Math.max(0.8, o.sp.speed*8)*0.015*dayLight; // phototaxis to surface
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
  // division handled at top of updateOrg
  if(!window.demoMode && !o.dividing&&!o.cyst&&canDivide(o)){
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
        var divP = o.isPlayer ? 0.5 : 0.02;
        if(!window.demoMode && Math.random()<divP*dt)doDivide(o);
    }
  }
  if(o.energy<=0){
    // 10) Голод → циста («заснул»), а не мгновенная смерть (1 раз)
    if(!o.cyst && !o._starvedOnce){
      o._starvedOnce = true;
      o.cyst = true; o.energy = 10; o.vx=0; o.vy=0; o.aiTarget=null; o.state='rest';
      if(o.isPlayer && window.showToast) window.showToast('Голод: впал в цисту — найди еду и проснись', '#fc8');
      return;
    }
  }
  // Циста игрока: можно «проснуться» если энергия подросла / рядом еда
  if(o.isPlayer && o.cyst && o.energy>=18){
    o.cyst=false; o.cystT=0;
    if(window.showToast) window.showToast('Проснулся из цисты', '#8f8');
  }
  if(o.energy<=-12){killOrg(o,DCODE.STARVE);return;}
  if(o.sp.isEuk&&o.age>500){o.energy-=0.15*dt;if(o.energy<5&&Math.random()<0.004*dt){killOrg(o,DCODE.AGE);return;}}
  // Size from species baseline + mass bank (feeding), energy only mild factor
  var adult0 = o.sp.size*(o.sizeMult||1.0);
  // Colonies stay compact in play — but demo gallery keeps enlarged showcase size
  if(o.sp && (o.sp.shape==='colony' || (o.sp.bio&&o.sp.bio.colony))){
    if(o.demoPinned || o.demoColony){ adult0 = Math.max(adult0, o.size||6.5); }
    else { adult0 = Math.min(adult0, 4.5); }
  }
  var massFactor = clamp((o.massFood||0) / Math.max(adult0*0.8, 2), 0, 1.2);
  var enFactor = 0.55 + clamp(o.energy/Math.max(o.sp.repEnergy||100,1), 0, 1)*0.45;
  // After divide, birthSize anchors the floor; grow toward adult as mass accrues
  var floorSz = Math.max(o.birthSize|| (adult0*0.45), adult0*0.4);
  var tgtSz = floorSz + (adult0*1.05 - floorSz) * Math.min(1, massFactor*0.85 + (enFactor-0.55)*0.4);
  // Consumers without food stay small; producers grow slowly via photo energy→mass trickle
  // Night mass handled in producer photo block (loss, not gain)

  if(!o.dividing){
    o.size = lerp(o.size, tgtSz, 0.9*dt);
    if(o.size < floorSz) o.size = lerp(o.size, floorSz, 2*dt);
  }
  if(o.flash>0)o.flash=Math.max(0,o.flash-dt*2);
  // Easy mode: gentle hint only — NEVER auto-spam divide
  // Division only via Q / button when canDivide() is true

  // AUTO-EAT on contact — player AND NPCs (no E key needed)
  // consumer2 (инфузории) = фильтр-питание: заглатывают бактерий/водоросли в зоне рта
  if(o.alive&&!o.dividing&&!o.cyst&&!o.dying){
    var foodCats=FOOD[o.sp.cat]||[];
    var isCiliate = (o.sp.cat==='consumer2');
    var range = o.size + (o.isPlayer ? 22 : 14);
    if(isCiliate) range = o.size * 2.8 + (o.isPlayer ? 42 : 30);
    var nearby = window.getNearby ? window.getNearby(o.x, o.y, range+55) : orgs;
    var ateThisFrame = false;
    for(var ai=0;ai<nearby.length;ai++){
      var ap=nearby[ai];
      if(!ap||!ap.alive||ap===o||ap.cyst||ap.dying) continue;
      if(!o.isPlayer){
        if(ap.divCD>0||ap.invuln>0) continue;
        if(ap.isPlayer && (gt - (ap.spawnTime||0)) < 20) continue;
      } else {
        if(ap.invuln>0.8) continue;
      }
      var inChain = foodCats.indexOf(ap.sp.cat) >= 0;
      var isCan=(o.sp.flags&&o.sp.flags.cannibal&&o.energy<25&&ap.sp.id===o.sp.id);
      var ok=false;
      if(inChain && ap.size < o.size*1.15) ok=true;
      if(ap.size < o.size*0.95) ok=true;
      if(isCan) ok=true;
      // Ciliates ONLY eat their food chain (bacteria + algae + small ciliates) — not random junk
      if(isCiliate){
        ok = inChain && ap.size < o.size * 1.2;
      }
      if(o.sp.cat==='producer' && !inChain){
        ok = ap.size < o.size*0.7 && (ap.sp.cat==='producer' || ap.sp.cat==='decomposer');
      }
      if(!ok) continue;
      if(ap.size >= o.size*1.25) continue;
      var dd=dist2(o,ap);
      // Contact for most; filter zone (larger) for ciliates on tiny prey
      var need = (o.size + ap.size + (o.isPlayer?18:10));
      if(isCiliate && ap.size < o.size*0.7) need = range;
      if(dd < need*need){
        if(o.isPlayer){
          if(typeof forceEat==='function') forceEat(o, ap);
          else { ap.divCD=0; ap.invuln=0; eatOrg(o,ap); }
          if(isCiliate && window.showToast && Math.random()<0.35)
            window.showToast('Фильтр: захватил добычу', '#9cf');
        } else {
          eatOrg(o, ap);
        }
        ateThisFrame = true;
        break;
      }
    }
    // Continuous filter siphon: even without full swallow, pull micro-nutrition
    // from ambient bacteria/algae density (real paramecium style)
    if(isCiliate && !ateThisFrame){
      o._filterT = (o._filterT||0) + (typeof dt==='number'?dt:0.016);
      if(o._filterT > 0.35){
        o._filterT = 0;
        var micro = 0;
        var nb2 = window.getNearby ? window.getNearby(o.x, o.y, range+20) : orgs;
        for(var fi=0; fi<nb2.length; fi++){
          var fp = nb2[fi];
          if(!fp||!fp.alive||fp===o) continue;
          if(foodCats.indexOf(fp.sp.cat)<0) continue;
          if(fp.size >= o.size*0.85) continue;
          var ddf = dist2(o,fp);
          if(ddf < range*range) micro++;
        }
        if(micro > 0){
          // Siphon one smallest nearby prey preferentially
          var best=null, bestS=1e9;
          for(var fj=0; fj<nb2.length; fj++){
            var fq=nb2[fj];
            if(!fq||!fq.alive||fq===o) continue;
            if(foodCats.indexOf(fq.sp.cat)<0) continue;
            if(fq.size >= o.size*0.85) continue;
            if(dist2(o,fq) > range*range) continue;
            if(fq.size < bestS){ bestS=fq.size; best=fq; }
          }
          if(best){
            if(o.isPlayer && typeof forceEat==='function') forceEat(o, best);
            else eatOrg(o, best);
            if(o.isPlayer && window.showToast && Math.random()<0.4)
              window.showToast('Реснички: фильтр-питание', '#9cf');
          } else {
            // Ambient organic soup if prey fled — tiny trickle only near food density
            var drip = Math.min(2.5, 0.4 + micro*0.35);
            o.energy = Math.min(120, (o.energy||0) + drip*0.5);
            o.massFood = (o.massFood||0) + drip*0.06;
          }
        }
      }
    }
  }
}
