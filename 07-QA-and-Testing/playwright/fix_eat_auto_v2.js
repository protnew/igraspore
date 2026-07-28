
const { test } = require('@playwright/test');
test('eat + auto catch v2', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(900);
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(600);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // E test with guaranteed food
  let r1 = await page.evaluate(() => {
    player.energy=80; player.alive=true; player.dying=false; player.cyst=false; player.parasite=null;
    player.eaten=0; player.vx=0; player.vy=0;
    for(let i=0;i<6;i++){
      const fo=spawnOrg(SPECIES_DB[0], player.x+15+i*3, player.y, false);
      if(fo){ fo.size=player.size*0.35; fo.divCD=0; fo.invuln=0; fo.alive=true; }
    }
    const b=player.eaten;
    const ok=window.tryPlayerEat();
    return {ok, eaten:player.eaten, energy:player.energy, before:b, speed:player.sp.speed, cat:player.sp.cat};
  });
  console.log('E1: '+JSON.stringify(r1));
  await page.keyboard.press('e');
  await page.waitForTimeout(150);
  let r2 = await page.evaluate(()=>({eaten:player.eaten, energy:player.energy, toast:(document.getElementById('toast')||{}).textContent}));
  console.log('E2: '+JSON.stringify(r2));

  // Autopilot catch within 3s
  let auto = await page.evaluate(() => {
    autoAI=true;
    player.energy=90; player.alive=true; player.dying=false; player.parasite=null;
    player.vx=0; player.vy=0; player.aiTarget=null; player.aiRetargetT=0; player.angle=0;
    for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<600) o.alive=false; }
    const prey=spawnOrg(SPECIES_DB[0], player.x+100, player.y, false);
    prey.size=player.size*0.35; prey.vx=0; prey.vy=0; prey.divCD=0; prey.invuln=0;
    window.__prey=prey;
    window.__p0={x:player.x,y:player.y,eaten:player.eaten||0};
    return {px:player.x, preyX:prey.x};
  });
  console.log('AUTO_START: '+JSON.stringify(auto));
  await page.waitForTimeout(2500);
  let end = await page.evaluate(() => {
    const p0=window.__p0;
    const dx=player.x-p0.x, dy=player.y-p0.y;
    const path=[];
    return {
      moved:Math.hypot(dx,dy),
      dx, dy,
      eaten:(player.eaten||0)-p0.eaten,
      energy:player.energy,
      state:player.state,
      preyAlive: window.__prey? window.__prey.alive:null,
      distPrey: window.__prey? Math.hypot(window.__prey.x-player.x, window.__prey.y-player.y):null,
      angle:player.angle,
      autoAI
    };
  });
  console.log('AUTO_END: '+JSON.stringify(end));
  await page.screenshot({path:'screenshots/FIX-auto-v2.png'});
  await page.screenshot({path:'screenshots/FIX-eat-v2.png'});

  // path efficiency short sample
  await page.evaluate(()=>{ window.__path=[]; player.aiTarget=null; player.aiRetargetT=0;
    const prey=spawnOrg(SPECIES_DB[0], player.x+150, player.y+10, false);
    if(prey){prey.size=player.size*0.3;prey.divCD=0;prey.invuln=0;}
    autoAI=true;
  });
  for(let i=0;i<15;i++){
    await page.waitForTimeout(80);
    await page.evaluate(()=>window.__path.push({x:player.x,y:player.y}));
  }
  const eff = await page.evaluate(()=>{
    const p=window.__path; let dist=0;
    for(let i=1;i<p.length;i++) dist+=Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y);
    const net=Math.hypot(p[p.length-1].x-p[0].x,p[p.length-1].y-p[0].y);
    return {dist:Number(dist.toFixed(1)), net:Number(net.toFixed(1)), eff: dist>1?Number((net/dist).toFixed(3)):0, n:p.length};
  });
  console.log('EFF: '+JSON.stringify(eff));
  console.log('ERRORS: '+errors.length);
  errors.forEach(e=>console.log('ERR: '+e));
  console.log('DONE');
});
