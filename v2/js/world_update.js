// world_update.js — updateWorld, updateCamera, updateTodUI, generateTempGrid
function updateWorld(dt){
  dt*=timeScale;
  var _ss=(typeof settings!=='undefined' && settings.simSpeed)?settings.simSpeed:0.33;
  dt*=_ss/0.33; // user speed multiplier (0.1..3.0)
  if(dt>0.5)dt=0.5; // PERF-015: Cap dt to prevent simulation explosion
  window.spatialGrid = {};
  window.spatialGridLarge = {};
  for(var i=0;i<orgs.length;i++) {
     var o=orgs[i];
     if(!o.alive) continue;
     if (o.size > 30) {
        var gxL = Math.floor(o.x / 1000);
        var gyL = Math.floor(o.y / 1000);
        var kL = gxL+','+gyL;
        if(!window.spatialGridLarge[kL]) window.spatialGridLarge[kL]=[];
        window.spatialGridLarge[kL].push(o);
     }
     var gx = Math.floor(o.x / 400);
     var gy = Math.floor(o.y / 400);
     var k = gx+','+gy;
     if(!window.spatialGrid[k]) window.spatialGrid[k]=[];
     window.spatialGrid[k].push(o);
  }

  for(var i=0;i<orgs.length;i++)updateOrg(orgs[i],dt);
  updateInfections(dt);
  updateViruses(dt);
  if(window.eventManager) window.eventManager.update(dt);
  for(var i=orgs.length-1;i>=0;i--){
    if(orgs[i]._remove){
      if(orgs[i].isPlayer&&state==='playing'){
        let found=false;
        let pId = player ? player.sp.id : orgs[i].sp.id;
        for(let j=0;j<orgs.length;j++){
          if(orgs[j].alive && orgs[j].sp.id===pId && orgs[j]!==orgs[i]){
            player=orgs[j]; 
            player.isPlayer=true; // FIX: Must set the new cell as player!
            found=true; 
            break;
          }
        }
        if(!found) state='gameover';
      }
      orgs.splice(i,1);
    }
  }
  
  if(window.skyClouds) {
     for(var i=0; i<window.skyClouds.length; i++) {
         var c = window.skyClouds[i];
         c.x += c.vx * dt * 40; // Sped up 2x
         if(c.x > PW + c.w) c.x = -PW - c.w;
     }
  }
  
  if(window.oceanSnow) {
      for(var i=0; i<window.oceanSnow.length; i++) {
          var s = window.oceanSnow[i];
          s.x += (s.vx + Math.sin(fc*0.01 + s.y)*0.2) * dt * 20;
          s.y += s.vy * dt * 40;
          if(s.y > PD) {
              s.y = 50;
              s.x = rng(cam.x-BW, cam.x+BW);
          }
      }
  }
  // Eco-Balance recovery (Atmosphere exchange)
  globalCO2 = Math.min(999, globalCO2 + dt * 3.0); // atmosphere always replenishes
  globalO2 = Math.min(999, globalO2 + dt * 2.0);


  spawnT+=dt;
  if(spawnT>2.5){
    spawnT=0;
    var catBm = {};
    for(var j=0;j<orgs.length;j++){
      var o=orgs[j];
      if(o.alive){
        var cat=o.sp.cat;
        catBm[cat] = (catBm[cat]||0) + o.sp.size * o.energy;
      }
    }
    // Density cap: cull excess producers (target ~≤70% of live pop feel; hard TGT)
    var nP=0, nAll=0;
    for(var j=0;j<orgs.length;j++){ if(orgs[j].alive){ nAll++; if(orgs[j].sp.cat==='producer') nP++; } }
    window._trophic = {nP:nP,nAll:nAll,pct:nAll?nP/nAll:0};
    if(nP > (TGT.producer||1800) * 1.08){
      var need = nP - Math.floor((TGT.producer||1800));
      if(need > 25) need = 25; // per spawn tick
      // kill weakest non-player producers (low energy first)
      var cands=[];
      for(var j=0;j<orgs.length;j++){
        var o=orgs[j];
        if(o.alive && !o.isPlayer && o.sp.cat==='producer') cands.push(o);
      }
      cands.sort(function(a,b){return (a.energy||0)-(b.energy||0);});
      for(var k=0;k<need && k<cands.length;k++){
        if(typeof killOrg==='function') killOrg(cands[k], (typeof DCODE!=='undefined'?DCODE.STARVE:0));
        else { cands[k].alive=false; cands[k].energy=0; }
      }
    }
    for(var cat in TGT){
      var pool=SPECIES_DB.filter(function(s){return s.cat===cat && !(s.flags&&s.flags.noRandomSpawn) && (s.size||1)<12;});
      var bm=catBm[cat]||0;
      var avgBm=0; for(var i=0;i<pool.length;i++) avgBm+=pool[i].size*(pool[i].energy*0.7+5);
      avgBm = pool.length ? avgBm/pool.length : 500;
      if(!window.demoMode && bm < TGT[cat]*avgBm*DIFF[difficulty].spawn*settings.density){
        var numToSpawn = (cat === 'producer') ? 15 : 1;
        for (var k=0; k<numToSpawn; k++) {
           if(pool.length>0){
             var sp=pool[Math.floor(Math.random()*pool.length)];
             var d, hw;
             if(cat==='producer'){ d=rng(2,80); hw=Math.max(40,halfW(d)-20); }
             else if(cat==='decomposer'){ d=rng(PD*0.4,PD*0.85); hw=Math.max(40,halfW(d)-20); }
             else { d=rng(15,PD*0.75); hw=Math.max(40,halfW(d)-20); }
             spawnOrg(sp,rng(-hw,hw),d);
           }
        }
      }
    }
  }
  // HARD surface clamp — nobody escapes water
  for(var _ci=0; _ci<orgs.length; _ci++){
    var _co=orgs[_ci];
    if(_co&&_co.alive&&_co.y<1){ _co.y=1; if(_co.vy<0) _co.vy=Math.abs(_co.vy)*0.3; }
  }
  if(settings.bubbles){
    if(Math.random()<0.08){var bd=rng(PD*0.5,PD-10),bhw=halfW(bd)-10;o2Bubbles.push({x:rng(-bhw,bhw),y:bd,vy:-rng(0.5,1.5),r:rng(2,5),life:1});}
    if(typeof o2Bubbles !== 'undefined'){
    for(var i=o2Bubbles.length-1;i>=0;i--){
       var b=o2Bubbles[i]; b.y+=b.vy*dt*60; b.life-=dt*0.5;
       if(b.life<=0 || b.y<=0) o2Bubbles.splice(i,1);
    }
  }

  // Chemotaxis update
  if(window.pheromones) {
     for(var i=window.pheromones.length-1; i>=0; i--) {
         window.pheromones[i].life -= dt * 0.1; // Fades in 10 seconds
         if(window.pheromones[i].life <= 0) window.pheromones.splice(i, 1);
     }
  }
  }
  
  if (window.toxicClouds) {
     for(var i=window.toxicClouds.length-1;i>=0;i--){
         var tc = window.toxicClouds[i];
         tc.x += tc.vx * dt; tc.y += tc.vy * dt; tc.r += dt*10; tc.life -= dt*0.05;
         if (tc.life <= 0) window.toxicClouds.splice(i,1);
         else {
             var nearby = window.getNearby(tc.x, tc.y, tc.r);
             for(var j=0; j<nearby.length; j++){
                 var o = nearby[j];
                 if(o.alive && !(o.sp.flags&&o.sp.flags.toxic) && dist2(o,tc) < tc.r*tc.r) {
                     var res = o.acidResist || 0;
                     o.energy -= dt*5 * Math.max(0, 1 - res); o.flash=0.5; o.flashColor='#0f0';
                     o.speedMult = 0.1 + 0.8 * res; // slows down less
                 }
             }
         }
     }
  }

  for(var i=parts.length-1;i>=0;i--){var p=parts[i];if(!p.maxL||!isFinite(p.maxL))p.maxL=0.6;p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vx*=0.95;p.vy*=0.95;p.life-=dt/p.maxL;if(p.life<=0||!isFinite(p.life))parts.splice(i,1);} if(parts.length>180) parts.splice(0, parts.length-180);
  for(var i=0;i<currents.length;i++){currents[i].x+=currents[i].vx*dt;currents[i].y+=currents[i].vy*dt;if(Math.abs(currents[i].x)>PW)currents[i].vx*=-1;if(currents[i].y<50||currents[i].y>PD-50)currents[i].vy*=-1;}
  tod+=dt/DAY_SEC*24;
  if(tod>=24){
      tod-=24;
      totalDays++;
      var ns=Math.floor(totalDays/SEASON_DAYS)%4;
      if(ns!==season){
          season=ns;
          generateTempGrid();
      }
  }
  updateTodUI();
  // Smooth day/night: bell curve from 5:00 to 19:00, night otherwise
  var dayProg;
  if(tod >= 5 && tod <= 19) {
    dayProg = Math.sin((tod - 5) / 14 * Math.PI);
  } else {
    dayProg = 0;
  }
  // Twilight ramp — longer beautiful dusk (planetarium sunset window)
  var twilight = 0;
  if(tod >= 4.5 && tod < 6.0) twilight = (tod - 4.5) / 1.5;
  else if(tod > 16.5 && tod <= 21.0){
    // Peak glow ~18.5, slow fade to night
    if(tod <= 18.8) twilight = 0.55 + 0.45*((tod-16.5)/2.3);
    else twilight = Math.max(0, 1.0 - (tod-18.8)/2.2);
  }
  dayLight=Math.max(0.02, Math.max(dayProg, twilight * 0.42)) * SEASONS[season].light * (1 - SEASONS[season].ice) * (window.eclipseMod || 1.0);
  rainTimer+=dt;
  if(rainTimer>25+Math.random()*40){rainTimer=0;isRaining=Math.random()<SEASONS[season].rain;if(isRaining){wind.strength=rng(0.3,0.8);wind.x=rng(-1,1)*wind.strength;wind.y=0;}else{wind.x=0;wind.y=0;}}
  if(isRaining&&settings.particles)for(var i=0;i<2;i++)rainDrops.push({x:cam.x+rng(-cv.width/2/zoom,cv.width/2/zoom),y:Math.min(cam.y-cv.height/2/zoom,-5),vy:rng(8,14),vx:wind.x*2,life:1});
  for(var i=rainDrops.length-1;i>=0;i--){var rd=rainDrops[i];rd.y+=rd.vy*dt*60;rd.x+=rd.vx*dt*60;rd.life-=dt*0.3;if(rd.life<=0||rd.y>0)rainDrops.splice(i,1);}
  updateCamera(dt);
  var curPop=0;for(var i=0;i<orgs.length;i++)if(orgs[i].alive)curPop++;
  if(curPop>gameStats.maxPop)gameStats.maxPop=curPop;
  if(player&&player.size>gameStats.maxPlayerSize)gameStats.maxPlayerSize=player.size;
  if(Math.random() < 0.0001*dt*60 && !window.globalCatastrophe.active) {
      window.globalCatastrophe.active = true;
      window.globalCatastrophe.type = Math.random() < 0.5 ? 'eclipse' : 'acid';
      window.globalCatastrophe.timer = 20 + Math.random()*20;
  }
  if(window.globalCatastrophe.active) {
      window.globalCatastrophe.timer -= dt;
      if(window.globalCatastrophe.timer <= 0) {
          window.globalCatastrophe.active = false;
      } else {
          if(window.globalCatastrophe.type === 'eclipse') {
              dayLight *= 0.1;
          } else if(window.globalCatastrophe.type === 'acid') {
              for(var j=0; j<orgs.length; j++){
                  if(orgs[j].alive && orgs[j].y < 50 && Math.random()<0.05) {
                      var dmgMult = orgs[j].inBiofilm ? 0.2 : 1.0;
                      orgs[j].energy -= 5*dt * Math.max(0, 1 - orgs[j].acidResist) * dmgMult;
                  }
              }
          }
      }
  }

  if(fc%90===0){var snap={};for(var cat in CC){var c=0;for(var j=0;j<orgs.length;j++)if(orgs[j].alive&&orgs[j].sp.cat===cat)c++;snap[cat]=c;}popHist.push(snap);if(popHist.length>100)popHist.shift();}
}

function updateCamera(dt){
  // Clamp dt to prevent camera jumps on frame drops
  var dtc=clamp(dt,0,0.05);
  zoom=lerp(zoom,tZoom,clamp(dtc*5,0,0.15));
  if(!isFinite(zoom)||zoom<=0)zoom=0.4;
  
  // Player-follow camera — DIRECT lock (no dead zone, no drift)
  if(!freeCam&&player&&player.alive){
    var tx=player.x,ty=player.y;
    if(!isFinite(tx)||!isFinite(ty)){tx=0;ty=PD*0.3;}
    // Surface bias: if player is near surface and zoomed in, keep a sky band (magnify UX).
    // If player dives (y large), follow normally — sun leaves when sky leaves viewport.
    if(typeof zoom==='number' && zoom>2.5 && ty < 90){
      var h2 = (typeof cv!=='undefined' && cv && cv.height) ? cv.height*0.5 : 400;
      var maxCamY = Math.max(10, (h2 - 100)/zoom); // keep ~100px sky while near surface
      ty = Math.min(ty - 12, maxCamY + 20);
    } else {
      ty = ty - 18;
    }
    var followFactor=clamp(dtc*8,0,0.35);
    cam.x=lerp(cam.x,tx,followFactor);
    cam.y=lerp(cam.y,ty,followFactor);
  }
  
  if(!isFinite(cam.x))cam.x=0;
  if(!isFinite(cam.y))cam.y=PD*0.3;
  
  if(freeCam){
    var cs=300/zoom*dtc*60;
    var moved=false;
    if(camKeys.w){cam.y-=cs;moved=true;}if(camKeys.s){cam.y+=cs;moved=true;}
    if(camKeys.a){cam.x-=cs;moved=true;}if(camKeys.d){cam.x+=cs;moved=true;}
    if(moved) window.screensaverAutoCam=false;
    
    if (moved) window.lastInteractionTime = Date.now();
    if (!window.lastInteractionTime) window.lastInteractionTime = Date.now();
    
    if (Date.now() - window.lastInteractionTime > 15000) {
        window.screensaverAutoCam = true;
    } else {
        window.screensaverAutoCam = false;
    }

    if(window.screensaverAutoCam && !moved && !window.demoMode){
      var _scTarget=null,_scMaxSize=0;
      for(var _i=0;_i<orgs.length;_i++){
        var _o=orgs[_i];
        if(_o.alive&&_o.size>_scMaxSize){_scMaxSize=_o.size;_scTarget=_o;}
      }
      if (_scTarget) {
          // Smooth slow follow for screensaver
          cam.x += (_scTarget.x - cam.x) * 0.3 * dtc;
          cam.y += (_scTarget.y - cam.y) * 0.3 * dtc;
      }
    }
    
    cam.x=clamp(cam.x,-PW-200,PW+200);cam.y=clamp(cam.y,-280,PD+100); // sky + surface
  }
}
function updateTodUI(){
  if(!sliderDragging){var sl=document.getElementById('todR');if(sl)sl.value=tod;}
  var lbl=document.getElementById('todL');if(lbl){var h=Math.floor(tod),m=Math.floor((tod-h)*60);
    // Sun/moon icon based on time of day
    var icon = (tod>=5 && tod<=19) ? '☀️' : '🌙';
    lbl.textContent=icon+' '+(h<10?'0':'')+h+':'+(m<10?'0':'')+m;}
  var sl=document.getElementById('seasL');if(sl)sl.textContent=tt('season'+season);
}

function generateTempGrid(){
  var s = SEASONS[season];
  for(var i=0; i<20; i++) {
     var depthFactor = i/19;
     var surfaceT = s.temp;
     var bottomT = 15;
     TEMP_GRID[i] = surfaceT + (bottomT - surfaceT) * (depthFactor * 0.8);
  }
}
