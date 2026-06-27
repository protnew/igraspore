"use strict";

class EventManager {
    constructor() {
        this.currentEvent = null;
        this.timer = Math.random() * 60 + 30; // 30-90 seconds until first event
        this.eventDuration = 0;
        
        this.events = [
            { id: 'acid_rain', name: 'Кислотный дождь', duration: 15, onStart: () => { window.basePH = window.gamePH || 7.0; window.gamePH = 2.0; }, onEnd: () => { window.gamePH = window.basePH; } },
            { id: 'eclipse', name: 'Солнечное затмение', duration: 20, onStart: () => { window.eclipseMod = 0.1; }, onEnd: () => { window.eclipseMod = 1.0; } }
        ];
        window.eclipseMod = 1.0;
    }
    
    update(dt) {
        if (this.currentEvent) {
            this.eventDuration -= dt;
            if (this.eventDuration <= 0) {
                if(this.currentEvent.onEnd) this.currentEvent.onEnd();
                if(window.addMessage) window.addMessage(this.currentEvent.name + " закончился", '#aaffaa');
                this.currentEvent = null;
                this.timer = Math.random() * 60 + 60; // next event in 1-2 mins
            }
        } else {
            this.timer -= dt;
            if (this.timer <= 0) {
                this.startRandomEvent();
            }
        }
    }
    
    startRandomEvent() {
        this.currentEvent = this.events[Math.floor(Math.random() * this.events.length)];
        this.eventDuration = this.currentEvent.duration;
        if(this.currentEvent.onStart) this.currentEvent.onStart();
        if(window.addMessage) window.addMessage("ВНИМАНИЕ: " + this.currentEvent.name + "!", '#ffaaaa');
    }
    
    draw(ctx, w, h) {
        if(!this.currentEvent) return;
        ctx.save();
        if(this.currentEvent.id === 'acid_rain') {
            ctx.fillStyle = 'rgba(100, 255, 100, 0.1)';
            ctx.fillRect(0, 0, w, h);
            // Draw rain lines
            ctx.strokeStyle = 'rgba(100, 255, 100, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(var i=0; i<50; i++) {
                var rx = Math.random() * w;
                var ry = Math.random() * h;
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 10, ry + 20);
            }
            ctx.stroke();
        } else if(this.currentEvent.id === 'eclipse') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, w, h);
        }
        ctx.restore();
    }
}
window.eventManager = new EventManager();

var O2_GRID = new Array(20).fill(100);
var TEMP_GRID = new Array(20).fill(20);
var SEASON_LEN=120; // 2 mins per season
var TOTAL_ORGS=800;
var globalCO2 = 100, globalO2 = 100;

window.logEvent = function(msg, col) {
    if(!window.eventLog) window.eventLog = [];
    window.eventLog.push({text: msg, color: col||'#fff', life: 10.0});
    if(window.eventLog.length > 5) window.eventLog.shift();
};

window.getTempAt = function(x, y) {
    let band = Math.min(19, Math.max(0, Math.floor(y / (PD/20))));
    let t = TEMP_GRID[band];
    if (window.hydroVents) {
        for(let i=0; i<window.hydroVents.length; i++) {
            let v = window.hydroVents[i];
            let d = Math.hypot(x - v.x, y - v.y);
            if (d < v.radius) {
                let f = 1 - (d / v.radius);
                t += (v.temp - t) * (f * f);
            }
        }
    }
    return t;
};

function initWorld(){
  orgs=[];parts=[];viruses=[];speciesPop={};popHist=[];
  window.eventLog = [];
  stats={births:0,deaths:0,deathCauses:[0,0,0,0,0]};
  window.globalCatastrophe = {active: false, type: "", timer: 0};
  globalCO2 = 150; globalO2 = 100;
  gameStats={startTime:Date.now(),maxPop:0,maxPlayerSize:0,evoLvl:0};
  for(var i=0;i<SPECIES_DB.length;i++)speciesPop[i]={alive:0,born:0,deaths:[0,0,0,0,0]};
  for(var cat in INIT_N){
    var pool=SPECIES_DB.filter(function(s){return s.cat===cat;});
    // Pick 1 to 3 distinct species from this category to populate initially
    var selectedSpecies = [];
    for(var k=0; k<Math.min(pool.length, 3); k++) {
       selectedSpecies.push(pool[Math.floor(Math.random()*pool.length)]);
    }
    // Spawn at least 15 of each selected species to avoid quick extinction
    for(var s=0; s<selectedSpecies.length; s++) {
       var sp = selectedSpecies[s];
       var baseCnt = Math.round((INIT_N[cat]/3 + 10) * settings.density);
       for(var i=0;i<baseCnt;i++){
         var d=rng(20,PD-30);var hw=halfW(d)-30;
         spawnOrg(sp,rng(-hw,hw),d);
       }
    }
  }
  nutrientClouds=[];for(var i=0;i<15;i++){var d=rng(PD*0.4,PD-20),hw=halfW(d)-20;nutrientClouds.push({x:rng(-hw,hw),y:d,r:rng(60,150),intensity:rng(0.4,0.9),vx:rng(-0.08,0.08),vy:rng(-0.02,0.02)});}
  shoreDecor=[];for(var i=0;i<30;i++){var side=i<15?-1:1;var d=rng(0,40),hw=halfW(d);shoreDecor.push({x:side*(hw+rng(5,40)),y:rng(-15,d),type:Math.random()<0.5?'grass':'pebble',size:rng(6,18),rot:rng(0,Math.PI*2)});}
  sedimentClumps=[];for(var i=0;i<25;i++){var hw=halfW(PD)-15;sedimentClumps.push({x:rng(-hw,hw),y:PD-rng(0,8),w:rng(15,40),h:rng(4,10),rot:rng(-0.3,0.3)});}
  sunRays=[];for(var i=0;i<12;i++)sunRays.push({x:rng(-PW*0.8,PW*0.8),w:rng(40,100),angle:rng(-0.15,0.15)});
  window.hydroVents = [];
  for(var i=0; i<4; i++) {
     window.hydroVents.push({
         x: rng(-PW*0.8, PW*0.8),
         y: PD,
         radius: rng(300, 700),
         temp: rng(50, 90)
     });
  }
  
  window.skyClouds = [];
  for(var i=0; i<4; i++) {
     window.skyClouds.push({x: rng(-PW, PW), y: rng(-150, -50), w: rng(300, 600), h: rng(60, 150), vx: rng(0.5, 1.5)});
  }
  
  window.oceanSnow = [];
  for(var i=0; i<80; i++) {
     window.oceanSnow.push({x: rng(-PW, PW), y: rng(50, PD), r: rng(0.5, 2.5), vy: rng(0.1, 0.4), vx: rng(-0.1, 0.1)});
  }
  
  currents = [];
  if (settings.currents) {
     for(var i=0; i<15; i++) {
        currents.push({
           x: rng(-PW*0.9, PW*0.9),
           y: rng(100, PD-100),
           r: rng(150, 500),
           vx: rng(-1.5, 1.5),
           vy: rng(-0.5, 0.5),
           strength: rng(0.5, 2.5)
        });
     }
  }
}





function clampToPuddle(o){
  var hw=halfW(o.y);
  var dX = BW - PW; var dY = PD;
  var len = Math.sqrt(dX*dX + dY*dY);
  var nRx = -dY / len; var nRy = dX / len; 
  var nLx = dY / len; var nLy = dX / len;
  
  if(o.x<-hw){
     o.x=-hw;
     var dot=o.vx*nLx+o.vy*nLy;
     if(dot<0){o.vx-=dot*nLx;o.vy-=dot*nLy;o.vx*=0.85;o.vy*=0.85;}
  }
  if(o.x>hw){
     o.x=hw;
     var dot2=o.vx*nRx+o.vy*nRy;
     if(dot2<0){o.vx-=dot2*nRx;o.vy-=dot2*nRy;o.vx*=0.85;o.vy*=0.85;}
  }
  if(o.y<3){o.y=3;if(o.vy<0)o.vy=-o.vy*0.4;}
  if(o.y>PD-8){o.y=PD-8;if(o.vy>0)o.vy=-o.vy*0.3;}
}













// === VIRUS INFECTION ===






function updateWorld(dt){
  dt*=timeScale;
  window.spatialGrid = {};
  for(var i=0;i<orgs.length;i++) {
     var o=orgs[i];
     if(!o.alive) continue;
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
  if (globalCO2 < 100) globalCO2 += dt * 0.5;
  if (globalO2 < 100) globalO2 += dt * 0.5;


  spawnT+=dt;
  if(spawnT>2.5){
    spawnT=0;
    for(var cat in TGT){
      var cnt=0;for(var j=0;j<orgs.length;j++)if(orgs[j].alive&&orgs[j].sp.cat===cat)cnt++;
      if(cnt<TGT[cat]*DIFF[difficulty].spawn*settings.density){
        var pool=SPECIES_DB.filter(function(s){return s.cat===cat;});
        var numToSpawn = (cat === 'producer') ? 15 : 1;
        for (var k=0; k<numToSpawn; k++) {
           if(pool.length>0){var sp=pool[Math.floor(Math.random()*pool.length)];var d=rng(20,PD-30),hw=halfW(d)-25;spawnOrg(sp,rng(-hw,hw),d);}
        }
      }
    }
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
                     o.energy -= dt*15; o.flash=0.5; o.flashColor='#0f0';
                     o.speedMult = 0.5; // slows down
                 }
             }
         }
     }
  }

  var vw=cv.width/zoom, vh=cv.height/zoom;
  var vL=cam.x-vw/2-50, vR=cam.x+vw/2+50, vT=cam.y-vh/2-50, vB=cam.y+vh/2+50;
  for(var i=parts.length-1;i>=0;i--){
    var p=parts[i];
    if(p.x<vL||p.x>vR||p.y<vT||p.y>vB){parts.splice(i,1);continue;}
    p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vx*=0.95;p.vy*=0.95;p.life-=dt/p.maxL;
    if(p.life<=0)parts.splice(i,1);
  }
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
  var dayProg = (tod > 6 && tod < 18) ? (tod - 6)/12 : 0;
  dayLight=Math.max(0.02, Math.sin(dayProg * Math.PI)) * SEASONS[season].light * (1 - SEASONS[season].ice) * (window.eclipseMod || 1.0);
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
  zoom=lerp(zoom,tZoom,clamp(dt*8,0,1));
  if(!freeCam&&player&&player.alive){cam.x=lerp(cam.x,player.x,clamp(dt*4,0,1));cam.y=lerp(cam.y,player.y,clamp(dt*4,0,1));}
  else if(freeCam){
    var cs=400/zoom*dt*60;
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

    if(window.screensaverAutoCam && !moved){
      let target = orgs.reduce((prev, curr) => {
          if (!curr.alive) return prev;
          if (!prev) return curr;
          return (curr.size > prev.size) ? curr : prev;
      }, null);
      if (target) {
          cam.x += (target.x - cam.x) * 0.5 * dt;
          cam.y += (target.y - cam.y) * 0.5 * dt;
          zoom += (2.0 - zoom) * 0.5 * dt;
      }
    }
    
    cam.x=clamp(cam.x,-PW-200,PW+200);cam.y=clamp(cam.y,-100,PD+100);
  }
}
function updateTodUI(){
  if(!sliderDragging){var sl=document.getElementById('todR');if(sl)sl.value=tod;}
  var lbl=document.getElementById('todL');if(lbl){var h=Math.floor(tod),m=Math.floor((tod-h)*60);lbl.textContent=(h<10?'0':'')+h+':'+(m<10?'0':'')+m;}
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
