
const { test } = require('@playwright/test');
test('infusoria filter + morning + env', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(800);

  // pick ciliate/infusoria
  await page.evaluate(()=>{
    for(let i=0;i<SPECIES_DB.length;i++){
      if(SPECIES_DB[i].cat==='consumer2'){ selSpecies=i; break; }
    }
  });
  const spName = await page.evaluate(()=>SPECIES_DB[selSpecies].name);
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(600);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  const morning = await page.evaluate(()=>({
    tod: +tod.toFixed(2),
    dayLight: +dayLight.toFixed(2),
    cat: player.sp.cat,
    name: player.sp.name
  }));
  console.log('MORNING '+JSON.stringify(morning));

  // Wait for filter auto-eat
  await page.evaluate(()=>{ autoAI = true; });
  await page.waitForTimeout(3500);
  const fed = await page.evaluate(()=>({
    eaten: player.eaten||0,
    mass: +(player.massFood||0).toFixed(2),
    energy: +player.energy.toFixed(1),
    foodNearby: orgs.filter(o=>o.alive && o!==player && Math.hypot(o.x-player.x,o.y-player.y)<120 && (o.sp.cat==='producer'||o.sp.cat==='consumer1')).length
  }));
  console.log('FED '+JSON.stringify(fed));

  // Force filter by placing tiny bacteria on mouth
  const forced = await page.evaluate(()=>{
    autoAI=false;
    const before = player.eaten||0;
    const m0 = player.massFood||0;
    const sp = SPECIES_DB.find(s=>s.cat==='producer') || SPECIES_DB.find(s=>s.cat==='consumer1');
    for(let i=0;i<6;i++){
      const fo = spawnOrg(sp, player.x + (i-2.5)*3, player.y, false);
      if(fo){ fo.size = Math.max(0.6, player.size*0.25); fo.energy=30; fo.divCD=0; fo.invuln=0; }
    }
    // tick update a few times
    for(let t=0;t<20;t++){
      if(typeof updateOrg==='function') updateOrg(player, 0.05);
    }
    return {dEaten:(player.eaten||0)-before, dMass:+((player.massFood||0)-m0).toFixed(2), eaten:player.eaten};
  });
  console.log('FORCED '+JSON.stringify(forced));

  // Screenshots
  await page.screenshot({path:'screenshots/INF-morning-env.png', fullPage:false});
  // zoom out to see sky
  await page.evaluate(()=>{ zoom=1.2; tZoom=1.2; if(player){ cam.y = Math.min(cam.y, PD*0.12); } });
  await page.waitForTimeout(400);
  await page.screenshot({path:'screenshots/INF-sky-water.png', fullPage:false});
  await page.evaluate(()=>{ settings.renderMode='realistic'; });
  await page.waitForTimeout(300);
  await page.screenshot({path:'screenshots/INF-realistic-env.png', fullPage:false});

  console.log('ERRORS '+errors.length);
  errors.slice(0,8).forEach(e=>console.log('ERR '+e));
  console.log('SP '+spName);
  console.log('DONE');
});
