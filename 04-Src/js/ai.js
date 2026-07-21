"use strict";

window.getNearby = function(x, y, radius) {
   var res=[];
   if(!window.spatialGrid) return orgs;
   var r = Math.ceil(radius/1000);
   var cx = Math.floor(x/1000);
   var cy = Math.floor(y/1000);
   for(var gx=cx-r; gx<=cx+r; gx++){
     for(var gy=cy-r; gy<=cy+r; gy++){
        var arr = window.spatialGrid[gx+','+gy];
        if(arr) {
            for(var i=0; i<arr.length; i++) res.push(arr[i]);
        }
     }
   }
   return res;
};


function moveOrg(o,dt){
  var sp=o.sp;
  var speed=Math.max(sp.speed,0.8)*SPD_SCALE*0.15;
  if(o.isPlayer&&!freeCam&&!autoAI&&!o.cyst&&!o.dying){
    var ax=0,ay=0;
    if(keys['w']||keys['arrowup'])ay-=1;
    if(keys['s']||keys['arrowdown'])ay+=1;
    if(keys['a']||keys['arrowleft'])ax-=1;
    if(keys['d']||keys['arrowright'])ax+=1;
    if(o.parasiticInfection) { ax = -ax; ay = -ay; }
    if(ax||ay){var m=Math.sqrt(ax*ax+ay*ay);ax/=m;ay/=m;o.vx+=ax*speed*dt*16;o.vy+=ay*speed*dt*16;o.angle=Math.atan2(ay,ax);}
    if(mouseDown&&!moveTarget){
      var wx=cam.x+(mx-cv.width/2)/zoom,wy=cam.y+(my-cv.height/2)/zoom;
      var dx=wx-o.x,dy=wy-o.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d>5){o.vx+=dx/d*speed*dt*16;o.vy+=dy/d*speed*dt*16;o.angle=Math.atan2(dy,dx);}
    }
    if(moveTarget){
      var dx=moveTarget.x-o.x,dy=moveTarget.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d>10){o.vx+=dx/d*speed*dt*16;o.vy+=dy/d*speed*dt*16;o.angle=Math.atan2(dy,dx);}
      else moveTarget=null;
    }
  }else if(!o.isPlayer&&!o.cyst&&!o.dying){aiOrg(o,dt,speed);}
  else if(o.isPlayer&&autoAI&&!o.cyst&&!o.dying){aiOrg(o,dt,speed);}
  var damp=o.isPlayer&&!freeCam?0.86:0.93;
  o.vx*=Math.pow(damp,dt*60);o.vy*=Math.pow(damp,dt*60);
  if(!o.isPlayer){
    if(o.sp.cat==='producer'){o.vy-=0.15*dt;}
    if(o.sp.cat==='decomposer'){o.vy+=0.2*dt;}
  }
  if(settings.currents&&!o.dying){
    var globalVx = Math.sin(o.y * 0.01 + fc * 0.02) * 20;
    var globalVy = Math.cos(o.x * 0.01 + fc * 0.01) * 5;
    o.vx += globalVx * dt;
    o.vy += globalVy * dt;
    for(var i=0;i<currents.length;i++){
      var c=currents[i];var dd=(o.x-c.x)*(o.x-c.x)+(o.y-c.y)*(o.y-c.y);
      if(dd<c.r*c.r){var inf=(1-Math.sqrt(dd)/c.r)*c.strength;o.vx+=c.vx*inf*dt;o.vy+=c.vy*inf*dt;}
    }
  }
  if(o.cyst) o.vy += 10 * dt;
  o.x+=o.vx*dt*60;o.y+=o.vy*dt*60;
  clampToPuddle(o);
  // Glide trail removed due to graphical glitches
  o.wobble+=dt*2;o.pulse+=dt*1.5;o.flagPhase+=dt*8;o.cilPhase+=dt*14;
  if(!o.isPlayer||autoAI||freeCam){
    var vmag=Math.abs(o.vx)+Math.abs(o.vy);
    if(vmag>0.3)o.angle=lerp(o.angle,Math.atan2(o.vy,o.vx),0.08);
  }
  if(o.divCD>0)o.divCD-=dt;
}

function aiOrg(o,dt,speed){
  var cat=o.sp.cat,foodCats=FOOD[cat]||[];
  o.state='idle';
  // Skip eating during division cooldown
  if(o.divCD>0)return;
  var prey=null,pd2=999999;
  if(foodCats.length>0&&o.energy<85){
    var near1 = window.getNearby(o.x, o.y, 2000);
    for(var i=0;i<near1.length;i++){
      var p=near1[i];
      if(!p.alive||p===o||p.cyst||p.divCD>0||p.invuln>0)continue;
      if (p.isPlayer && (gt - p.spawnTime) < 30) continue; // GRACE PERIOD
      if(foodCats.indexOf(p.sp.cat)<0)continue;
      if(p.size>=o.size*0.88)continue;
      var d=dist2(o,p);if(d<pd2){pd2=d;prey=p;}
    }
  }
  if(prey&&pd2<350*350){
    o.state='hunt';
    var dx=prey.x-o.x,dy=prey.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d>1){
        var dashMul = 1;
        if(d<150 && o.energy>40 && Math.random()<0.1) { dashMul = 4; o.energy-=0.5; }
        
        // Swarm AI: Potential Fields (Task 39)
        var vx = dx/d;
        var vy = dy/d;
        
        if (o.sp.cat === 'C') {
           var alliesX = 0, alliesY = 0, alliesC = 0;
           for(var i=0; i<near1.length; i++) {
              var peer = near1[i];
              if (peer.sp.id === o.sp.id && peer !== o) {
                  var pDist = Math.sqrt(dist2(o, peer));
                  if (pDist > 0 && pDist < 80) {
                      alliesX += (o.x - peer.x) / pDist; // repulsion
                      alliesY += (o.y - peer.y) / pDist;
                      alliesC++;
                  }
              }
           }
           if (alliesC > 0) {
              vx += (alliesX / alliesC) * 0.9;
              vy += (alliesY / alliesC) * 0.9;
              var len = Math.sqrt(vx*vx + vy*vy);
              vx /= len; vy /= len;
           }
        }
        
        o.vx += vx * speed * dashMul * dt * 12;
        o.vy += vy * speed * dashMul * dt * 12;
        o.angle = Math.atan2(vy, vx);
    }
    return;
  }
  
  // HERD PANIC: Run away from predators
  var predatorNear = null;
  var panicDist2 = 250*250;
  var near2 = window.getNearby(o.x, o.y, 500);
  for(var i=0;i<near2.length;i++){
     var q=near2[i];
     if(!q.alive || q===o || q.size<=o.size*1.2) continue;
     var fcq = FOOD[q.sp.cat]||[];
     if(fcq.indexOf(o.sp.cat)>=0) {
        var d2=dist2(o,q);
        if(d2 < panicDist2) { panicDist2=d2; predatorNear=q; }
     }
  }
  if (predatorNear) {
     o.state='panic';
     var dx=o.x-predatorNear.x, dy=o.y-predatorNear.y, d=Math.sqrt(dx*dx+dy*dy);
     if(d>1){
        if(!o.jukeDir) o.jukeDir = Math.random() > 0.5 ? 0.8 : -0.8;
        var fx = dx/d - (dy/d)*o.jukeDir;
        var fy = dy/d + (dx/d)*o.jukeDir;
        o.vx+=fx*speed*dt*15; o.vy+=fy*speed*dt*15;
        o.angle=Math.atan2(fy,fx);
     }
     return;
  }
  
  // Chemotaxis: avoid danger pheromones
  if(window.pheromones && window.pheromones.length > 0) {
     var dForceX = 0, dForceY = 0, dangerCount = 0;
     for(var j=0; j<window.pheromones.length; j++) {
        var ph = window.pheromones[j];
        if (ph.type !== 'danger') continue;
        var d2 = (o.x - ph.x)*(o.x - ph.x) + (o.y - ph.y)*(o.y - ph.y);
        if(d2 < 20000) {
           var d = Math.sqrt(d2);
           if (d > 1) {
              dForceX += (o.x - ph.x) / d;
              dForceY += (o.y - ph.y) / d;
              dangerCount++;
           }
        }
     }
     if (dangerCount > 0) {
        o.state='flee';
        o.vx += (dForceX / dangerCount) * speed * dt * 10;
        o.vy += (dForceY / dangerCount) * speed * dt * 10;
        o.angle = Math.atan2(dForceY, dForceX);
        return;
     }
  }

  // Temperature migration (Task 35)
  if (o.sp.tempRange) {
      var curTemp = window.getTempAt(o.x, o.y);
      var tMin = o.sp.tempRange[0] + (o.tempOffset||0) - 2;
      var tMax = o.sp.tempRange[1] + (o.tempOffset||0) + 5;
      
      if (curTemp < tMin || curTemp > tMax) {
          var tempUp = window.getTempAt(o.x, o.y - 150);
          var tempDown = window.getTempAt(o.x, o.y + 150);
          var optT = (tMin + tMax) / 2;
          
          var dCur = Math.abs(curTemp - optT);
          var dUp = Math.abs(tempUp - optT);
          var dDown = Math.abs(tempDown - optT);
          
          if (dUp < dCur && dUp <= dDown) {
              o.vy -= speed * dt * 12; // swim up
              o.state = 'migrate';
          } else if (dDown < dCur && dDown < dUp) {
              o.vy += speed * dt * 12; // swim down
              o.state = 'migrate';
          }
      }
  }

  var near3 = window.getNearby(o.x, o.y, 500);
  for(var i=0;i<near3.length;i++){
    var q=near3[i];
    if(!q.alive||q===o)continue;
    if(FOOD[q.sp.cat]&&FOOD[q.sp.cat].indexOf(cat)>=0&&q.size>o.size*0.88){
      // Symbiosis check: small consumer1 attaches to large consumer3 instead of fleeing, if lucky
      if (cat === 'consumer1' && q.sp.cat === 'consumer3' && Math.random() < 0.05 && q.size > o.size * 3) {
         o.attachedTo = q;
         o.attachAng = Math.random() * Math.PI * 2;
         o.attachDist = q.size + o.size;
         return;
      }
      var d=dist2(o,q);
      if(d<180*180){
        o.state='flee';var dx=o.x-q.x,dy=o.y-q.y,dd=Math.sqrt(dx*dx+dy*dy);
        if(dd>1){o.vx+=dx/dd*speed*dt*14;o.vy+=dy/dd*speed*dt*14;o.angle=Math.atan2(dy,dx);}
        return;
      }
    }
  }
  
  // Biofilm clustering (Task 2)
  if(!o.inBiofilm) {
      if(o.biofilmT) o.biofilmT -= dt;
      if(!o.biofilmT || o.biofilmT < 0) o.biofilmT = 0;
  }
  if(cat === 'producer' || cat === 'decomposer' || cat === 'consumer1') {
      if(o.biofilmT < 5) {
          var kinCount = 0;
          for(var i=0; i<near3.length; i++) {
              if(near3[i].sp.id === o.sp.id && dist2(o, near3[i]) < 150*150) kinCount++;
          }
          if(kinCount >= 5 && Math.random() < 0.1) {
              o.inBiofilm = true;
              o.biofilmT = 15; // stay in biofilm for at least 15s
          }
      }
  }
  
  if (o.inBiofilm) {
      o.state = 'biofilm';
      o.vx *= Math.pow(0.5, dt*60); 
      o.vy *= Math.pow(0.5, dt*60);
      o.biofilmT -= dt;
      if (o.biofilmT <= 0 && Math.random() < 0.05) o.inBiofilm = false;
      return; // Do not wander
  }
    if(cat==='producer'){
    if(o.y>50) o.vy -= speed*dt*15; // Constant upward pull towards surface
    
    // Spread out randomly to avoid clumping
    if(Math.random()<0.05) { o.vx += rng(-speed, speed)*dt*10; }
  } else if(cat==='macrophage') {
      var bestD = 99999, bestV = null;
      for(var v=0; v<viruses.length; v++) {
          var dist = dist2(o, viruses[v]);
          if(dist < bestD) { bestD = dist; bestV = viruses[v]; }
      }
      if(bestV && bestD < 400*400) {
          var dx = bestV.x - o.x, dy = bestV.y - o.y, d = Math.sqrt(bestD);
          if(d > 1) { o.vx += (dx/d)*speed*dt*10; o.vy += (dy/d)*speed*dt*10; }
          if(d < o.size + 5) {
              var idx = viruses.indexOf(bestV);
              if(idx > -1) {
                  viruses.splice(idx, 1);
                  o.energy += 10; o.flash = 0.5; o.flashColor = '#fff';
                  if(settings.particles) for(var k=0; k<3; k++) parts.push({x:o.x, y:o.y, vx:rng(-1,1), vy:rng(-1,1), life:1, maxL:1, size:2, color:'#fff'});
              }
          }
      } else {
          o.vx += rng(-speed, speed)*dt*2; o.vy += rng(-speed, speed)*dt*2;
      }
  } else if(cat === 'consumer3') {
      var scx = 0, scy = 0, swarmCount = 0;
      var near4 = window.getNearby(o.x, o.y, 400);
      for(var j=0; j<near4.length; j++){
          var q = near4[j];
          if(!q.alive || q===o || q.sp.cat !== 'consumer3' || q.cyst) continue;
          var dx=o.x-q.x, dy=o.y-q.y;
          if(dx*dx+dy*dy < 90000) { scx += q.x; scy += q.y; swarmCount++; }
      }
      if(swarmCount > 0) {
          scx /= swarmCount; scy /= swarmCount;
          var sdx = scx - o.x, sdy = scy - o.y, sd = Math.sqrt(sdx*sdx+sdy*sdy);
          if(sd > 30) { o.vx += (sdx/sd)*speed*dt*5; o.vy += (sdy/sd)*speed*dt*5; }
      }
      o.vx+=rng(-0.4,0.4)*speed*dt*6;o.vy+=rng(-0.3,0.3)*speed*dt*6;
  } else if(cat!=='decomposer'&&!o.isPlayer){
    o.vx+=rng(-0.4,0.4)*speed*dt*6;o.vy+=rng(-0.3,0.3)*speed*dt*6;
  }
}

