const fs = require('fs');

let world = fs.readFileSync('js/world.js', 'utf8');

// 1. Multicellularity & Parasitism & Aging in updateAI/updateOrg
let colonyLogic = `if(o.dying||o.dividing)return;
  // Aging
  if(o.generation > 20 && Math.random()<0.02*dt) { killOrg(o, DCODE.STARVE); return; }
  
  // Colony logic
  if(o.leader && !o.leader.alive) o.leader = null;
  if(o.leader) {
     var dx = o.leader.x - o.x; var dy = o.leader.y - o.y;
     o.vx += dx*dt*0.5; o.vy += dy*dt*0.5;
     o.x += o.vx*dt; o.y += o.vy*dt;
     o.vx *= 0.9; o.vy *= 0.9;
     return;
  }
  if(cat==='producer' && o.generation > 2 && o.energy > 80 && Math.random()<0.05) {
     for(var j=0;j<orgs.length;j++) {
        var p=orgs[j];
        if(p!==o && p.alive && !p.leader && p.sp.id===o.sp.id && dist2(o,p)<200*200){
           p.leader = o; o.energy-=10; break;
        }
     }
  }`;

world = world.replace("if(o.dying||o.dividing)return;", colonyLogic);

// Parasitism in eatOrg
world = world.replace("if(!prey.alive||prey.divCD>0||prey.invuln>0)return;", 
`if(!prey.alive||prey.divCD>0||prey.invuln>0)return;
  if(prey.sp.cat==='consumer1' && Math.random()<0.15) {
     pred.parasite = prey.sp;
     pred.flashColor='#f0f'; pred.flash=0.5;
     killOrg(prey, DCODE.EATEN);
     return;
  }`);

// Parasite damage & Osmotic Pressure in updateOrg
world = world.replace("var metab=(0.02 + o.sp.speed * o.speedMult * 0.03)*DIFF[difficulty].metab;",
`var metab=(0.02 + o.sp.speed * o.speedMult * 0.03)*DIFF[difficulty].metab;
  if(o.parasite) {
     o.energy -= dt*8; o.flash=0.1; o.flashColor='#f0f';
     if(Math.random()<0.02*dt) {
        var p = spawnOrg(o.parasite, o.x+rng(-10,10), o.y+rng(-10,10));
        if(p) { p.size*=0.5; p.energy=20; }
     }
  }
  
  var tempBand = Math.max(0, Math.min(19, Math.floor(o.y / (PD/20))));
  if(o.lastTemp !== undefined && Math.abs(o.lastTemp - TEMP_GRID[tempBand]) > 12) {
      if(settings.particles) for(var k=0;k<5;k++) parts.push({x:o.x,y:o.y,vx:rng(-2,2),vy:rng(-2,2),life:rng(2,5),maxL:5,size:rng(1,3),color:o.sp.color});
      killOrg(o, DCODE.STARVE); return;
  }
  o.lastTemp = TEMP_GRID[tempBand];`);


// Winter, Whirlpools, Drought, Electrotaxis in updateWorld
let globalEvents = `var isDay = (tod>6&&tod<18);
  
  // Drought
  if(PD > 600) PD -= dt*0.2;
  
  // Season & Winter Ice
  var isWinter = (season === 3);
  
  for(var i=0;i<20;i++){
    TEMP_GRID[i] = baseTemp - (i)*1.0;
    if(isWinter && i===0) O2_GRID[i] = lerp(O2_GRID[i], 10, 0.01*dt); // Ice blocks O2
    else O2_GRID[i] = lerp(O2_GRID[i], 100 - i*3, 0.02*dt);
  }`;
world = world.replace(/var isDay = \(tod>6&&tod<18\);\s*for\(var i=0;i<20;i\+\)\{\s*TEMP_GRID\[i\] = baseTemp - \(i\)\*1\.0;\s*O2_GRID\[i\] = lerp\(O2_GRID\[i\], 100 - i\*3, 0\.02\*dt\);\s*\}/, globalEvents);

let currentLogic = `for(var i=0;i<currents.length;i++){
    var c=currents[i];c.x+=c.vx*dt*60;c.y+=c.vy*dt*60;
    if(c.x<-PW)c.x=PW;if(c.x>PW)c.x=-PW;if(c.y<0)c.y=PD;if(c.y>PD)c.y=0;
  }
  // Whirlpools & Electrotaxis
  var isStorm = (Math.random() < 0.001);`;
world = world.replace(/for\(var i=0;i<currents\.length;i\+\)\{[\s\S]*?if\(c\.y>PD\)c\.y=0;\s*\}/, currentLogic);

let orgCurrents = `for(var i=0;i<currents.length;i++){
    var c=currents[i];var d2=dist2(o,c);
    if(d2<c.r*c.r){
      var f=(1-Math.sqrt(d2)/c.r)*c.strength;
      o.vx+=c.vx*f*dt*60;o.vy+=c.vy*f*dt*60;
      // Whirlpool force
      if(i%2===0) { o.vx -= (o.y - c.y)*f*0.01; o.vy += (o.x - c.x)*f*0.01; }
    }
  }
  if(isStorm) { o.vx += rng(-20,20); o.vy += rng(-20,20); }`;
world = world.replace(/for\(var i=0;i<currents\.length;i\+\)\{\s*var c=currents\[i\];var d2=dist2\(o,c\);\s*if\(d2<c\.r\*c\.r\)\{\s*var f=\(1-Math\.sqrt\(d2\)\/c\.r\)\*c\.strength;\s*o\.vx\+=c\.vx\*f\*dt\*60;o\.vy\+=c\.vy\*f\*dt\*60;\s*\}\s*\}/, orgCurrents);

fs.writeFileSync('js/world.js', world);


// DNA Scanner in render.js
let render = fs.readFileSync('js/render.js', 'utf8');

let scanner = `if(isWinter) {
    ctx.fillStyle = 'rgba(200,255,255,0.3)';
    ctx.fillRect(-PW, 0, PW*2, 20);
  }
  
  ctx.restore(); // end camera
  
  // UI Hover Scanner
  if(typeof window !== 'undefined' && window.mouseX) {
     var mx = (window.mouseX - innerWidth/2)/cam.z + cam.x;
     var my = (window.mouseY - innerHeight/2)/cam.z + cam.y;
     for(var i=0; i<orgs.length; i++){
        var o = orgs[i];
        if(o.alive && dist2({x:mx,y:my}, o) < o.size*o.size) {
           ctx.fillStyle='#fff'; ctx.font='10px Arial';
           ctx.fillText('Spd: x'+o.speedMult.toFixed(2), window.mouseX+10, window.mouseY);
           ctx.fillText('Sz: x'+o.sizeMult.toFixed(2), window.mouseX+10, window.mouseY+12);
           if(o.parasite) ctx.fillText('INFECTED', window.mouseX+10, window.mouseY+24);
           break;
        }
     }
  }`;
render = render.replace(/ctx\.restore\(\);\s*\}$/m, scanner + "\n}");
fs.writeFileSync('js/render.js', render);

// UI Tracking in main.js
let main = fs.readFileSync('js/main.js', 'utf8');
main = main.replace("window.addEventListener('resize',resize);", "window.addEventListener('resize',resize);\nwindow.addEventListener('mousemove', function(e){window.mouseX=e.clientX;window.mouseY=e.clientY;});");
fs.writeFileSync('js/main.js', main);

console.log('Patched V5 Biology (Multicell, Parasites, Osmosis, Scanner, Storms)!');
