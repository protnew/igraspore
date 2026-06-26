const fs = require('fs');

let world = fs.readFileSync('js/world.js', 'utf8');

// 1. Oxygen and Temperature Gradients
let globals = `var O2_GRID = new Array(20).fill(100);
var TEMP_GRID = new Array(20).fill(20);`;
world = world.replace("var state='menu';", "var state='menu';\n" + globals);

let updateWorldStart = `function updateWorld(dt){
  if(state!=='playing'&&state!=='gameover')return;
  // Stratification
  var baseTemp = SEASONS[season].temp;
  var isDay = (tod>6&&tod<18);
  for(var i=0;i<20;i++){
    TEMP_GRID[i] = baseTemp - (i)*1.0;
    O2_GRID[i] = lerp(O2_GRID[i], 100 - i*3, 0.02*dt);
  }`;
world = world.replace(/function updateWorld\(dt\)\{\s*if\(state!=='playing'&&state!=='gameover'\)return;/, updateWorldStart);

// Toxins recovery in updateOrg
world = world.replace("if(o.invuln>0)o.invuln-=dt;",
`if(o.invuln>0)o.invuln-=dt;
  if(o.speedMult < 1.0) o.speedMult = Math.min(1.0, o.speedMult + dt*0.05);`);

// 2. Digestion Waste & O2 logic in updateOrg
let o2logic = `if(o.stomach && o.stomach.length>0){
    for(var stIdx=o.stomach.length-1; stIdx>=0; stIdx--){
      var st=o.stomach[stIdx];
      var digestSpeed=dt*15;
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
  
  // O2 & Temp effects
  var band = Math.max(0, Math.min(19, Math.floor(o.y / (PD/20))));
  if(o.sp.cat === 'producer' && isDay) O2_GRID[band] = Math.min(150, O2_GRID[band] + o.size*dt*0.8);
  else if(o.sp.isEuk || o.sp.cat==='consumer1') O2_GRID[band] -= o.size*dt*0.05;
  
  if(O2_GRID[band] < 15 && !o.cyst && o.sp.isEuk) { o.energy -= dt*5; o.flash=0.1; o.flashColor='#f00'; }
  if(!o.cyst && (TEMP_GRID[band] < 2 || TEMP_GRID[band] > 35)) doCyst(o);
  
  // Fungal spores
  if(o.sp.cat==='decomposer' && o.energy>80 && Math.random()<0.05*dt) {
      o.energy -= 20;
      var c = spawnOrg(o.sp, o.x + rng(-20,20), o.y - rng(20, 50));
      if(c) { c.size *= 0.3; c.energy = 20; c.cyst = true; c.cystT = 0; }
  }`;

world = world.replace(/if\(o\.stomach && o\.stomach\.length>0\)\{[\s\S]*?if\(o\.energy>110\) o\.energy=110;\s*\}/, o2logic);

// 3. Toxins in eatOrg
world = world.replace("pred.stomach.push({color:prey.sp.color",
`if(prey.sp.cat==='producer' && prey.sp.id < 8) pred.speedMult = 0.3;
  pred.stomach.push({color:prey.sp.color`);

// 4. Circadian Rhythm & Conjugation in updateAI
let aiChanges = `if(cat==='producer' && !(tod>6&&tod<18)) return;
  if(cat==='consumer2' && o.energy>60 && o.age>30 && Math.random()<0.1){
    for(var j=0; j<orgs.length; j++){
      var p=orgs[j];
      if(p!==o && p.alive && p.sp.id===o.sp.id && p.age>30 && dist2(o,p)<(o.size+p.size)*(o.size+p.size)){
         var avgSp = (o.speedMult + p.speedMult)/2;
         var avgSz = (o.sizeMult + p.sizeMult)/2;
         o.speedMult=avgSp; p.speedMult=avgSp; o.sizeMult=avgSz; p.sizeMult=avgSz;
         o.energy-=10; p.energy-=10;
         if(settings.particles) parts.push({x:o.x, y:o.y, vx:rng(-1,1), vy:rng(-1,1), life:1, maxL:1, size:5, color:'#f8f'});
      }
    }
  }`;
world = world.replace("var cat=o.sp.cat;", "var cat=o.sp.cat;\n" + aiChanges);

fs.writeFileSync('js/world.js', world);

// 5. Bioluminescence in render.js
let render = fs.readFileSync('js/render.js', 'utf8');

let biolum = `if(settings.particles) {
    for(var i=0;i<parts.length;i++){
      var p=parts[i];ctx.fillStyle=p.color;
      ctx.globalAlpha=p.life/p.maxL;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
    }
  }
  ctx.globalAlpha=1;
  // Bioluminescence
  var isDay=(tod>6&&tod<18);
  if(!isDay){
     ctx.globalCompositeOperation = 'screen';
     for(var i=0; i<orgs.length; i++){
        var o=orgs[i];
        if(o.alive && o.sp.bio && o.sp.bio.biolum){
           var rad = o.size * 5;
           var grd = ctx.createRadialGradient(o.x, o.y, o.size, o.x, o.y, rad);
           grd.addColorStop(0, 'rgba(100, 200, 255, 0.4)');
           grd.addColorStop(1, 'rgba(100, 200, 255, 0)');
           ctx.fillStyle = grd;
           ctx.beginPath(); ctx.arc(o.x, o.y, rad, 0, Math.PI*2); ctx.fill();
        }
     }
     ctx.globalCompositeOperation = 'source-over';
  }`;
render = render.replace(/if\(settings\.particles\) \{[\s\S]*?ctx\.globalAlpha=1;/m, biolum);

fs.writeFileSync('js/render.js', render);

// 6. UI Versioning
let index = fs.readFileSync('index.html', 'utf8');
index = index.replace('<div class="tt">iGraSpore</div>', '<div class="tt">iGraSpore <span style="font-size:12px;color:#789">v1.4.0 (a7b9c2)</span></div>');
fs.writeFileSync('index.html', index);

console.log('Patched V4 Biology (O2, Temp, Biolum, Toxins, Conjugation)!');
