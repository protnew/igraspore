// world.js — initWorld, clampToPuddle, virus helpers
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
  // Reset clock to morning every new game
  tod = 9.0;
  dayLight = 0.85;
  orgs=[];parts=[];viruses=[];speciesPop={};popHist=[];
  window.eventLog = [];
  stats={births:0,deaths:0,deathCauses:[0,0,0,0,0]};
  window.globalCatastrophe = {active: false, type: "", timer: 0};
  globalCO2 = 150; globalO2 = 100;
  gameStats={startTime:Date.now(),maxPop:0,maxPlayerSize:0,evoLvl:0};
  for(var i=0;i<SPECIES_DB.length;i++)speciesPop[i]={alive:0,born:0,deaths:[0,0,0,0,0]};
  for(var cat in INIT_N){
    var pool=SPECIES_DB.filter(function(s){return s.cat===cat && !(s.flags&&s.flags.noRandomSpawn) && (s.size||1)<12;});
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
         // UNIFORM distribution across entire basin
         var d, hw;
         if(cat==='producer'){
           // Phytoplankton: along entire surface
           d = rng(2, 80);
           hw = Math.max(40, halfW(d) - 20);
         } else if(cat==='decomposer'){
           // Decomposers: bottom dwellers
           d = rng(PD*0.4, PD*0.85);
           hw = Math.max(40, halfW(d) - 20);
         } else {
           // Predators/bacteria: uniform across depth
           d = rng(15, PD*0.75);
           hw = Math.max(40, halfW(d) - 20);
         }
         spawnOrg(sp, rng(-hw, hw), d);
       }
    }
  }
  nutrientClouds=[];for(var i=0;i<15;i++){var d=rng(PD*0.4,PD-20),hw=halfW(d)-20;nutrientClouds.push({x:rng(-hw,hw),y:d,r:rng(60,150),intensity:rng(0.4,0.9),vx:rng(-0.08,0.08),vy:rng(-0.02,0.02)});}
  shoreDecor=[];
  // Shore vegetation: SCATTERED clusters (not solid wall), varying depth/size
  // Each cluster has 2-5 plants grouped naturally with gaps between clusters
  var numClusters = 35; // Sparse clusters, not continuous
  for(var cl=0;cl<numClusters;cl++){
    var clDepth = rng(1, PD*0.12); // Some go deeper
    var clHalfW = halfW(clDepth);
    // Random cluster center — can be anywhere along shore, including center
    var clSide = Math.random();
    var clX;
    if(clSide < 0.4) clX = -clHalfW + rng(5, clHalfW*0.5); // Left
    else if(clSide < 0.8) clX = clHalfW - rng(5, clHalfW*0.5); // Right
    else clX = rng(-clHalfW*0.4, clHalfW*0.4); // Center shallows
    // Scatter 2-5 plants around cluster center with gaps
    var plantsInCluster = 2 + Math.floor(Math.random() * 4);
    for(var p=0; p<plantsInCluster; p++){
      var gap = rng(-25, 25); // Gap between plants
      var plantDepth = clDepth + rng(-5, 15);
      var plantType = Math.random();
      shoreDecor.push({
        x: clX + gap + rng(-8, 8),
        y: rng(-15, Math.max(2, plantDepth)),
        type: plantType < 0.5 ? 'grass' : (plantType < 0.75 ? 'pebble' : 'reed'),
        size: rng(4, 20),
        rot: rng(-0.3, 0.3),
        sway: rng(0, Math.PI * 2), // Sway phase for animation
        hasShadow: true // FIX 4: vegetation casts shadow
      });
    }
  }
  // Sparse deep algae — individual, scattered
  for(var da=0;da<35;da++){
    var dd=rng(PD*0.12,PD*0.55);
    var dhw=halfW(dd);
    shoreDecor.push({
      x:rng(-dhw*0.85,dhw*0.85),
      y:dd,
      type: Math.random()<0.7 ? 'algae' : 'grass',
      size:rng(4,14),
      rot:rng(-0.35,0.35),
      sway: rng(0, Math.PI*2),
      hasShadow: true
    });
  }
  // Floating surface algae mats (natural pond scum / Spirogyra mats)
  for(var fa=0; fa<8; fa++){
    var fhw = halfW(8);
    shoreDecor.push({
      x: rng(-fhw*0.9, fhw*0.9),
      y: rng(-6, 18),
      type: 'float',
      size: rng(1.2, 2.5), // tiny scum flakes, not pad-scale
      rot: rng(-0.2, 0.2),
      sway: rng(0, Math.PI*2),
      hasShadow: false
    });
  }
  window.sedimentClumps=[];for(var i=0;i<25;i++){var hw=halfW(PD)-15;window.sedimentClumps.push({x:rng(-hw,hw),y:PD-rng(0,8),w:rng(15,40),h:rng(4,10),rot:rng(-0.3,0.3)});}
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
  // Open surface at y≈0 (air-water interface). Soft bounce only above water.
  if(o.y < 1){ o.y = 1; if(o.vy<0) o.vy = -Math.abs(o.vy)*0.3; } // NEVER above surface
  if(o.y < 1){ o.y = 1; if(o.vy<0) o.vy*=-0.3; } /*SURFACE_HARD_CLAMP*/
  if(o.y > PD-8){ o.y = PD-8; if(o.vy>0) o.vy = -o.vy*0.3; }
  // Lily pad: small orgs get COVER (укрытие), large still bounce lightly
  o._lilyCover = false;
  if(o.y < 120 && window._lilyPads && o.y > -5){
    for(var li=0; li<window._lilyPads.length; li++){
      var lp=window._lilyPads[li];
      var dx=o.x-lp.x, dy=(o.y-lp.y)*2.2;
      var d2=dx*dx+dy*dy;
      var coverR = (lp.rx||20) * 1.15;
      if(d2 < coverR*coverR){
        // 5) Укрытие у кувшинок для мелких
        if((o.size||4) <= 5.5 || (o.sp && (o.sp.cat==='producer'||o.sp.cat==='consumer1'))){
          o._lilyCover = true;
          o.vx = (o.vx||0)*0.92;
          o.vy = (o.vy||0)*0.92;
        } else if(d2 < (lp.rx*0.55)*(lp.rx*0.55) && o.y < lp.y+18){
          o.y = Math.max(8, lp.y + 12) + Math.random()*5;
          if(o.vy<0) o.vy = Math.abs(o.vy)*0.3;
        }
      }
    }
  }
}













// === VIRUS INFECTION ===






