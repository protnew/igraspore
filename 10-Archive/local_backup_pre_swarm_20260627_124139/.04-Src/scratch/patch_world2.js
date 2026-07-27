const fs = require('fs');
let code = fs.readFileSync('js/world.js', 'utf8');

// 1. Add hydroVents and getTempAt
code = code.replace(/function initWorld\(\)\{/, `
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

function initWorld(){`);

code = code.replace(/sunRays=\[\];for\(var i=0;i<12;i\+\+\)sunRays\.push\(\{.*\}\);/, `sunRays=[];for(var i=0;i<12;i++)sunRays.push({x:rng(-PW*0.8,PW*0.8),w:rng(40,100),angle:rng(-0.15,0.15)});
  window.hydroVents = [];
  for(var i=0; i<4; i++) {
     window.hydroVents.push({
         x: rng(-PW*0.8, PW*0.8),
         y: PD,
         radius: rng(300, 700),
         temp: rng(50, 90)
     });
  }`);

// 2. Replace TEMP_GRID array access with getTempAt
code = code.replace(/if\(!o\.cyst && \(TEMP_GRID\[band\] < 2 \|\| TEMP_GRID\[band\] > 35\)\) doCyst\(o\);/, 
`let curT = window.getTempAt(o.x, o.y);
  if(!o.cyst && (curT < 2 || curT > 35)) doCyst(o);`);

code = code.replace(/var curTemp = TEMP_GRID\[tempBand\];/, `var curTemp = window.getTempAt(o.x, o.y);`);
code = code.replace(/o\.lastTemp = TEMP_GRID\[tempBand\];/, `o.lastTemp = window.getTempAt(o.x, o.y);`);

// 3. spawnOrg modifications (Sessile, Genders)
code = code.replace(/isPlayer:!!isPlayer,alive:true,_remove:false,/, 
`isPlayer:!!isPlayer,alive:true,_remove:false,
    gender: Math.random() < 0.5 ? 'M' : 'F', seekingMate: false,`);

code = code.replace(/var o=\{x:x,y:y,/, `if(sp.locomotion === 'sessile') y = PD - sp.size;
  var o={x:x,y:y,`);

// 4. Gender Reproduction Logic
code = code.replace(/if\(!o\.isPlayer&&!o\.dividing&&!o\.cyst&&o\.energy>o\.sp\.repEnergy&&o\.age>o\.sp\.minAge&&o\.divCD<=0\)\{\s*if\(Math\.random\(\)<0\.02\*dt\)doDivide\(o\);\s*\}/, 
`if(!o.isPlayer&&!o.dividing&&!o.cyst&&o.energy>o.sp.repEnergy&&o.age>o.sp.minAge&&o.divCD<=0){
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
    } else {
        if(Math.random()<0.02*dt)doDivide(o);
    }
  }`);

// 5. Inactivity Tracker & Observation Mode (Screensaver)
code = code.replace(/var moved=false;/, `var moved=false;`); // Keep
code = code.replace(/if\(window\.screensaverAutoCam && !moved\)\{([\s\S]*?)\}/, 
`if (moved) window.lastInteractionTime = Date.now();
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
    }`);

fs.writeFileSync('js/world.js', code, 'utf8');
console.log('world.js patched successfully!');
