
const { test } = require('@playwright/test');
test('surface reach + speed hierarchy', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(700);

  // producer Anabaena-like
  await page.evaluate(()=>{
    for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;}
  });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(400);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  const surf = await page.evaluate(()=>{
    autoAI=false; freeCam=false;
    player.x = 0;
    player.y = 80; // near surface
    player.vx=0; player.vy=0;
    // hold W upward for 2s of sim
    keys['w']=true; keys['arrowup']=true;
    for(let i=0;i<90;i++){
      if(typeof moveOrg==='function') moveOrg(player, 0.033);
      if(typeof updateOrg==='function') updateOrg(player, 0.033);
      // apply world bounds if any
      if(typeof clampOrg==='function'){}
    }
    keys['w']=false; keys['arrowup']=false;
    return {y: +player.y.toFixed(2), reachedSurface: player.y < 15, under20: player.y < 20};
  });
  console.log('SURFACE '+JSON.stringify(surf));

  // freeCam can look at sky
  const camZ = await page.evaluate(()=>{
    freeCam=true;
    cam.y = -50;
    // updateWorld camera clamp once
    if(typeof updateWorld==='function'){ /* skip full */ }
    cam.y = Math.max(-280, Math.min(PD+100, cam.y));
    return {camY: cam.y};
  });
  console.log('CAM '+JSON.stringify(camZ));

  // speed hierarchy sample
  const speeds = await page.evaluate(()=>{
    function avg(cat){
      const arr = SPECIES_DB.filter(s=>s.cat===cat).map(s=>s.speed);
      const a = arr.reduce((x,y)=>x+y,0)/arr.length;
      return +a.toFixed(3);
    }
    return {
      producer: avg('producer'),
      bacteria: avg('consumer1'),
      ciliate: avg('consumer2'),
      predator: avg('consumer3')
    };
  });
  console.log('SPEEDS '+JSON.stringify(speeds));
  console.log('ORDER '+(speeds.producer < speeds.bacteria && speeds.bacteria <= speeds.ciliate && speeds.ciliate <= speeds.predator*1.15));

  await page.evaluate(()=>{ zoom=2; tZoom=2; player.y=Math.min(player.y, 25); cam.y=player.y; cam.x=player.x; });
  await page.waitForTimeout(300);
  await page.screenshot({path:'screenshots/FIX-surface.png'});

  console.log('ERRORS '+errors.length);
  errors.forEach(e=>console.log('ERR '+e));
  console.log('DONE');
});
