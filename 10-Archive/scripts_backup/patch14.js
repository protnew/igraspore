const fs = require('fs');

let world = fs.readFileSync('js/world.js', 'utf8');

// Cap genetic mutations
let divGenetics = `c.speedMult = clamp(o.speedMult * rng(0.95, 1.05), 0.3, 3.0);
    c.sizeMult = clamp(o.sizeMult * rng(0.95, 1.05), 0.3, 3.0);
    o.speedMult = clamp(o.speedMult * rng(0.95, 1.05), 0.3, 3.0);
    o.sizeMult = clamp(o.sizeMult * rng(0.95, 1.05), 0.3, 3.0);`;
world = world.replace(/c\.speedMult = o\.speedMult \* rng\(0\.95, 1\.05\);[\s\S]*?o\.sizeMult = o\.sizeMult \* rng\(0\.95, 1\.05\);/, divGenetics);

// Fix AI Decomposer cyst wakeup (add parts check)
let cystWake = `if(cat==='decomposer'||cat==='consumer1'){
          for(let n=0;n<nutrientClouds.length;n++)if(dist2(o,nutrientClouds[n])<100*100){foodNear=true;break;}
          if(!foodNear && cat==='decomposer'){
             for(let p=0;p<parts.length;p++)if(dist2(o,parts[p])<150*150){foodNear=true;break;}
          }
       }`;
world = world.replace(/if\(cat==='decomposer'\|\|cat==='consumer1'\)\{\s*for\(let n=0;n<nutrientClouds\.length;n\+\+\)if\(dist2\(o,nutrientClouds\[n\]\)<100\*100\)\{foodNear=true;break;\}\s*\}/, cystWake);

fs.writeFileSync('js/world.js', world);
console.log('Patched V3 Edge Cases (Genetics cap, Decomposer parts wakeup)!');
