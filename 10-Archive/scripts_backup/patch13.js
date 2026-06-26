const fs = require('fs');

let world = fs.readFileSync('js/world.js', 'utf8');

// 1. Genetics in spawnOrg
world = world.replace("o.generation=0;", "o.generation=0; o.speedMult=1.0; o.sizeMult=1.0; o.stomach=[];");

// 2. Mitosis inheritance in finishDivide
world = world.replace("o.size *= 0.7; c.size *= 0.7; // Law of Conservation of Mass",
`o.size *= 0.7; c.size *= 0.7;
    c.speedMult = o.speedMult * rng(0.95, 1.05);
    c.sizeMult = o.sizeMult * rng(0.95, 1.05);
    o.speedMult = o.speedMult * rng(0.95, 1.05);
    o.sizeMult = o.sizeMult * rng(0.95, 1.05);
    c.stomach = []; o.stomach = [];`);

// 3. updateOrg size and speed overrides
world = world.replace("var tgtSz=o.sp.size*(0.65+clamp(o.energy/75,0,1)*0.55);",
"var tgtSz=o.sp.size*o.sizeMult*(0.65+clamp(o.energy/75,0,1)*0.55);");

world = world.replace("var metab=(0.02 + o.sp.speed * 0.03)*DIFF[difficulty].metab;",
"var metab=(0.02 + o.sp.speed * o.speedMult * 0.03)*DIFF[difficulty].metab;");

// 4. Digestion logic inside updateOrg
world = world.replace("if(o.invuln>0)o.invuln-=dt;",
`if(o.invuln>0)o.invuln-=dt;
  if(o.stomach && o.stomach.length>0){
    for(var stIdx=o.stomach.length-1; stIdx>=0; stIdx--){
      var st=o.stomach[stIdx];
      var digestSpeed=dt*15;
      if(st.energy<digestSpeed) digestSpeed=st.energy;
      st.energy-=digestSpeed; o.energy+=digestSpeed;
      st.size-=dt*1.5;
      if(st.energy<=0 || st.size<=0) o.stomach.splice(stIdx, 1);
    }
    if(o.energy>110) o.energy=110;
  }`);

// 5. eatOrg modification for Phagocytosis
world = world.replace(/var gain=prey\.energy\*0\.55\+prey\.size\*1\.5;\s+pred\.energy=Math\.min\(110,pred\.energy\+gain\);/,
`var gain=prey.energy*0.55+prey.size*1.5;
  if(!pred.stomach) pred.stomach=[];
  pred.stomach.push({color:prey.sp.color, size:prey.size*0.5, energy:gain, x:rng(-pred.size*0.4, pred.size*0.4), y:rng(-pred.size*0.4, pred.size*0.4)});`);

// 6. AI Cysts logic
let newAIStart = `function updateAI(o,dt){
  if(o.dying||o.dividing)return;
  if(o.cyst){
     // AI Cyst Wakeup Logic
     if(!o.isPlayer){
       var foodNear=false;
       var cat=o.sp.cat;
       if(cat==='decomposer'||cat==='consumer1'){
          for(let n=0;n<nutrientClouds.length;n++)if(dist2(o,nutrientClouds[n])<100*100){foodNear=true;break;}
       } else if(FOOD[cat]){
          for(var i=0;i<orgs.length;i++){
             var p=orgs[i];
             if(p.alive&&FOOD[cat].indexOf(p.sp.cat)>=0&&dist2(o,p)<150*150&&p.size<o.size){foodNear=true;break;}
          }
       }
       if(foodNear){doCyst(o);}
     }
     return;
  }
  var speed=Math.max(o.sp.speed,0.8)*o.speedMult*SPD_SCALE*0.05;
  var cat=o.sp.cat;
  
  if(!o.isPlayer && o.energy<15 && cat!=='producer' && cat!=='virus'){
     doCyst(o); return;
  }`;

world = world.replace(/function updateAI\(o,dt\)\{\s*if\(o\.cyst\|\|o\.dying\|\|o\.dividing\)return;\s*var speed=Math\.max\(o\.sp\.speed,0\.8\)\*SPD_SCALE\*0\.05;\s*var cat=o\.sp\.cat;/, newAIStart);

fs.writeFileSync('js/world.js', world);


// 7. Render stomach in render.js
let render = fs.readFileSync('js/render.js', 'utf8');

let newDrawOrg = `if(o.stomach && o.stomach.length>0){
    ctx.lineWidth=1;
    for(var k=0;k<o.stomach.length;k++){
      var st=o.stomach[k];
      ctx.fillStyle=st.color; ctx.globalAlpha=0.6;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.size, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  ctx.restore();`;

render = render.replace(/ctx\.restore\(\);\s*\}$/m, newDrawOrg + "\n}");

fs.writeFileSync('js/render.js', render);
console.log('Patched V3 Biology (Phagocytosis, Genetics, AI Cysts)!');
