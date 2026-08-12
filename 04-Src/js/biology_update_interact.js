// biology_update_interact.js — division, cyst, filter-feeding (extracted from biology_update_core.js)
// Part of updateOrg — called AFTER metabolism/energy/movement in biology_update_core.js
window.updateOrgInteract = function(o, dt) {
  // division handled at top of updateOrg
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
    // 10) Голод → циста: NPC могут впадать多次 (realistic cryptobiosis)
    var maxCyst = (o.sp.cat === 'decomposer' || o.sp.cat === 'consumer2') ? 3 : 1;
    if(!o.cyst && (o._cystCount||0) < maxCyst){
      o._cystCount = (o._cystCount||0) + 1;
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
  if(o.energy<=-15){killOrg(o,DCODE.STARVE);return;}
  if(o.sp.isEuk&&o.sp.cat!=='decomposer'&&o.age>500){o.energy-=0.15*dt;if(o.energy<5&&Math.random()<0.004*dt){killOrg(o,DCODE.AGE);return;}}
  // Size from species baseline + mass bank (feeding), energy only mild factor
  var adult0 = o.sp.size*(o.sizeMult||1.0);
  // v2: Colonies in game are 3× bigger than bacteria (visible clusters, not green fog)
  if(o.sp && (o.sp.shape==='colony' || (o.sp.bio&&o.sp.bio.colony))){
    if(o.demoPinned || o.demoColony){ adult0 = Math.max(adult0, o.size||10); }
    else { adult0 = Math.max(adult0, 9); } // 3× bacteria size (~3μm → ~9μm display)
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
    if(isCiliate) range = o.size * 3.5 + (o.isPlayer ? 50 : 45);
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
};
