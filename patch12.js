const fs = require('fs');

let config = fs.readFileSync('js/config.js', 'utf8');

// Update FOOD
let newFood = `var FOOD={consumer1:["producer"],consumer2:["producer","consumer1","consumer2"],consumer3:["producer","consumer1","consumer2"],decomposer:[]};`;
config = config.replace(/var FOOD=\{[\s\S]*?\};/, newFood);

// Update VIRUS_SPECS targets
let virusLoop = `for(var vi=0;vi<VN.length;vi++){
  var tgts = ['consumer1','producer','consumer2','consumer1','consumer3'];
  VIRUS_SPECS.push({id:100+vi,name:VN[vi],cat:'virus',shape:'phage',color:'#f44',size:3+vi*0.5,speed:0.5+vi*0.2,energy:20,target:tgts[vi]});
}`;
config = config.replace(/for\(var vi=0;vi<VN\.length;vi\+\+\)\{VIRUS_SPECS\.push\(\{[\s\S]*?\}\);?\}/, virusLoop);

fs.writeFileSync('js/config.js', config);


let world = fs.readFileSync('js/world.js', 'utf8');

// Mitosis size reduction
let oldDivide = `c.energy=o.energy;c.generation=o.generation+1;
    o.offspring++;`;
let newDivide = `c.energy=o.energy;c.generation=o.generation+1;
    o.offspring++;
    o.size *= 0.7; c.size *= 0.7; // Law of Conservation of Mass`;
world = world.replace(oldDivide, newDivide);

// Chemotaxis and Decomposer logic
let aiFunc = `function updateAI(o,dt){
  if(o.cyst||o.dying||o.dividing)return;
  var speed=Math.max(o.sp.speed,0.8)*SPD_SCALE*0.05;
  var cat=o.sp.cat;
  
  // Chemotaxis for bacteria & decomposers
  if(cat==='consumer1' || cat==='decomposer'){
    var bestCloud=null;var bestCD=999999;
    for(var n=0;n<nutrientClouds.length;n++){
       var nc=nutrientClouds[n];var cd=dist2(o,nc);
       if(cd<bestCD && cd<400*400) {bestCD=cd;bestCloud=nc;}
    }
    if(bestCloud){
       var dx=bestCloud.x-o.x,dy=bestCloud.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
       if(d>1){o.vx+=dx/d*speed*dt*6;o.vy+=dy/d*speed*dt*6;o.angle=Math.atan2(dy,dx);}
       if(cat==='decomposer' && d < bestCloud.r*0.8){
           // Eat nutrient cloud!
           o.energy += dt*bestCloud.intensity*20;
           bestCloud.intensity -= dt*0.05;
           if(bestCloud.intensity <= 0) nutrientClouds.splice(nutrientClouds.indexOf(bestCloud),1);
           o.flash=0.1; o.flashColor='#8f8';
       }
    }
    // Decomposers also hunt for DETRITUS (parts)
    if(cat==='decomposer'){
      var bestPart=null;var bestPD=999999;
      for(var p=0;p<parts.length;p++){
         var pt=parts[p];var pd=dist2(o,pt);
         if(pd<bestPD && pd<300*300) {bestPD=pd;bestPart=pt;}
      }
      if(bestPart){
         var dx=bestPart.x-o.x,dy=bestPart.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
         if(d>1){o.vx+=dx/d*speed*dt*10;o.vy+=dy/d*speed*dt*10;o.angle=Math.atan2(dy,dx);}
         if(d < o.size){
             // Eat detritus!
             o.energy += 10;
             parts.splice(parts.indexOf(bestPart),1);
             o.flash=0.3; o.flashColor='#ff8';
         }
      }
      // Return early because decomposers don't hunt prey!
      if(!bestPart && !bestCloud) {
         o.vx+=rng(-0.4,0.4)*speed*dt*6;o.vy+=rng(-0.3,0.3)*speed*dt*6;
      }
      return;
    }
  }

  // Regular AI (Flee / Hunt)
  var prey=null;var pd2=999999;
  var foodCats=FOOD[cat]||[];
  if(foodCats.length>0&&o.energy<85){
    for(var i=0;i<orgs.length;i++){
      var p=orgs[i];
      if(!p.alive||p===o||p.cyst||p.divCD>0||p.invuln>0)continue;
      if(foodCats.indexOf(p.sp.cat)<0)continue;
      if(p.size>=o.size*0.88 && cat!=='consumer3')continue; // Only Amoeba ignores size if needed, wait, amoeba can be smaller? No, keep it.
      if(p.size>=o.size*0.88)continue;
      var d=dist2(o,p);if(d<pd2){pd2=d;prey=p;}
    }
  }
  if(prey&&pd2<(o.size+prey.sp.size+30)*(o.size+prey.sp.size+30)){eatOrg(o,prey);return;}
  if(prey&&pd2<350*350){
    o.state='hunt';
    var dx=prey.x-o.x,dy=prey.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d>1){o.vx+=dx/d*speed*dt*12;o.vy+=dy/d*speed*dt*12;o.angle=Math.atan2(dy,dx);}
    return;
  }
  for(var i=0;i<orgs.length;i++){
    var q=orgs[i];
    if(!q.alive||q===o)continue;
    if(FOOD[q.sp.cat]&&FOOD[q.sp.cat].indexOf(cat)>=0&&q.size>o.size*0.88){
      var d=dist2(o,q);
      if(d<180*180){
        o.state='flee';var dx=o.x-q.x,dy=o.y-q.y,dd=Math.sqrt(dx*dx+dy*dy);
        if(dd>1){o.vx+=dx/dd*speed*dt*14;o.vy+=dy/dd*speed*dt*14;o.angle=Math.atan2(dy,dx);}
        return;
      }
    }
  }
  if(cat==='producer'){
    var lightHere=lightAt(o.y);
    if(lightHere<0.3&&o.y>200)o.vy-=speed*dt*6;
    if(sunRays.length>0){
      var bestDx=9999;
      for(var r=0;r<sunRays.length;r++){
        var rx=sunRays[r].x+o.y*sunRays[r].angle;var dx=rx-o.x;
        if(Math.abs(dx)<Math.abs(bestDx))bestDx=dx;
      }
      if(Math.abs(bestDx)>10&&Math.abs(bestDx)<400)o.vx+=Math.sign(bestDx)*speed*dt*8;
    }
    o.vx+=rng(-0.3,0.3)*speed*dt*5;o.vy+=rng(-0.2,0.2)*speed*dt*5;
    if(o.vx||o.vy)o.angle=Math.atan2(o.vy,o.vx);
    return;
  }
  o.vx+=rng(-0.4,0.4)*speed*dt*6;o.vy+=rng(-0.3,0.3)*speed*dt*6;
}`;

world = world.replace(/function updateAI\([\s\S]*?\n\}\n/m, aiFunc + '\n');

// Virus spawn targeting fix
let virusSpawn = `if(Math.random()<settings.virusRate*dt*0.5){
    var vs=VIRUS_SPECS[Math.floor(Math.random()*VIRUS_SPECS.length)];
    var tgts=[];for(var k=0;k<orgs.length;k++)if(orgs[k].alive&&orgs[k].sp.cat===vs.target)tgts.push(orgs[k]);
    if(tgts.length>10){
      var t=tgts[Math.floor(Math.random()*tgts.length)];
      spawnVirus(vs,t.x+rng(-50,50),t.y-rng(100,200));
    }
  }`;
world = world.replace(/if\(Math\.random\(\)<settings\.virusRate[\s\S]*?\}\n  \}/m, virusSpawn);

// Virus logic update
let virusLogic = `if(!v.target||!v.target.alive){
      v.target=null;
      for(var j=0;j<orgs.length;j++){
        var o=orgs[j];
        if(o.alive&&!o.infected&&o.sp.cat===v.sp.target&&dist2(v,o)<300*300){v.target=o;break;}
      }
    }`;
world = world.replace(/if\(!v\.target\|\|!v\.target\.alive\)[\s\S]*?\}\n    \}/m, virusLogic);

fs.writeFileSync('js/world.js', world);
console.log('Patched V2 Biology (Mitosis, Chemotaxis, Decomposers, Viruses)!');
