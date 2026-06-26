const fs = require('fs');

function patchFile(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  let newContent = replacer(content);
  if(content !== newContent) {
    fs.writeFileSync(path, newContent, 'utf8');
    console.log(`Patched ${path}`);
  } else {
    console.log(`No changes made to ${path}`);
  }
}

// 1. Patch config.js
patchFile('js/config.js', txt => {
  // Balance TGT
  txt = txt.replace('producer:220,consumer1:110,consumer2:70,consumer3:35,decomposer:55', 'producer:500,consumer1:100,consumer2:30,consumer3:10,decomposer:20');
  // Balance INIT_N
  txt = txt.replace('producer:110,consumer1:55,consumer2:35,consumer3:15,decomposer:25', 'producer:300,consumer1:60,consumer2:15,consumer3:5,decomposer:10');
  // Ciliate food
  txt = txt.replace('consumer2:["producer","consumer1"]', 'consumer2:["producer","consumer1","consumer2"]');
  // Producer speed
  txt = txt.replace("mkSp(PN,'producer',3,7,0.8,2.2)", "mkSp(PN,'producer',3,7,0.05,0.2)");
  // Producer color
  txt = txt.replace("color:CC[cat]", "color:(cat==='producer' ? 'hsl('+((100+i*15)%160)+', 90%, '+(40+i%3*10)+'%)' : CC[cat])");
  return txt;
});

// 2. Patch index.html
patchFile('index.html', txt => {
  // Fonts to !important white
  txt = txt.replace('.scN{color:#fff;text-shadow:1px 1px 2px #000;font-size:10px;', '.scN{color:#fff !important;text-shadow:1px 1px 3px #000 !important;font-size:10px;');
  txt = txt.replace('.scL{color:#fff;text-shadow:1px 1px 2px #000;font-size:8px;', '.scL{color:#fff !important;text-shadow:1px 1px 3px #000 !important;font-size:8px;');
  txt = txt.replace('.scC{font-size:7px;color:#89a;margin-top:1px}', '.scC{font-size:7px;color:#fff !important;text-shadow:1px 1px 2px #000 !important;margin-top:1px}');
  txt = txt.replace('.scP{font-size:8px;font-weight:bold;color:#4e8;margin-top:1px}', '.scP{font-size:8px;font-weight:bold;color:#aef !important;text-shadow:1px 1px 2px #000 !important;margin-top:1px}');
  
  // Menu overflow
  txt = txt.replace('#menuO{background:rgba(0,5,15,.97)}', '#menuO{background:rgba(0,5,15,.97);overflow-y:auto;padding:20px 0;justify-content:flex-start;}');
  // Scrollbox flex
  txt = txt.replace('.scrollbox{max-height:420px;overflow-y:auto;max-width:900px}', '.scrollbox{flex:1;min-height:0;max-height:60vh;overflow-y:auto;max-width:900px;padding:5px;}');
  return txt;
});

// 3. Patch render.js
patchFile('js/render.js', txt => {
  txt = txt.replace("ctx.fillStyle='#000814';", "var grad=ctx.createLinearGradient(0,-PD*0.2,0,PD);grad.addColorStop(0,'#0a2a4a');grad.addColorStop(1,'#000814');ctx.fillStyle=grad;");
  return txt;
});

// 4. Patch world.js
patchFile('js/world.js', txt => {
  // Gameover logic
  let oldGO = "if(orgs[i]._remove){if(orgs[i].isPlayer&&state==='playing')state='gameover';orgs.splice(i,1);}";
  let newGO = `if(orgs[i]._remove){
      if(orgs[i].isPlayer&&state==='playing'){
        let found=false;
        for(let j=0;j<orgs.length;j++){
          if(orgs[j].alive && orgs[j].sp.id===player.sp.id && orgs[j]!==orgs[i]){
            player=orgs[j]; found=true; break;
          }
        }
        if(!found) state='gameover';
      }
      orgs.splice(i,1);
    }`;
  txt = txt.replace(oldGO, newGO);
  
  // Phototaxis
  let oldAI = "if(o.age>o.sp.minAge&&o.energy>o.sp.repEnergy&&o.divCD<=0){doDivide(o);}";
  let newAI = `if(o.sp.cat==='producer' && o.y>20){o.vy-=Math.min(0.5, o.sp.speed)*dt;}
      if(o.age>o.sp.minAge&&o.energy>o.sp.repEnergy&&o.divCD<=0){doDivide(o);}`;
  txt = txt.replace(oldAI, newAI);
  
  // Easy mode auto-divide
  let oldEat = "// AUTO-EAT: player automatically eats prey on contact (like AI does)";
  let newEat = `// Easy mode auto-divide
  if(o.isPlayer && difficulty==='easy' && o.energy>o.sp.repEnergy && o.age>o.sp.minAge && o.divCD<=0) doDivide(o);
  // AUTO-EAT: player automatically eats prey on contact (like AI does)`;
  txt = txt.replace(oldEat, newEat);
  
  return txt;
});

// 5. Patch main.js (Auto AI visibility)
patchFile('js/main.js', txt => {
  txt = txt.replace("cm.textContent=tt('autoOn');cm.className='';", "cm.innerHTML='<span style=\"color:#0f0;text-shadow:0 0 5px #0f0;font-weight:bold;font-size:12px;\">АВТО-ПИЛОТ ВКЛ</span>';cm.className='';");
  return txt;
});
