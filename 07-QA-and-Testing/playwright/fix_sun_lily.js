
const { test } = require('@playwright/test');
test('sun lily natural', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(700);
  await page.evaluate(()=>{
    for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;}
  });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(400);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // Place near surface, day noon-ish, cartoon then realistic
  await page.evaluate(()=>{
    tod = 10.5;
    dayLight = 0.85;
    player.x = 0; player.y = 25;
    cam.x = 0; cam.y = 10;
    zoom = 1.2; tZoom = 1.2;
    freeCam = true;
    autoAI = false;
    settings.renderMode = 'cartoon';
  });
  // run a few frames so sky renders
  await page.waitForTimeout(500);
  await page.screenshot({path:'screenshots/NAT-sun-lily-cartoon.png'});

  await page.evaluate(()=>{ settings.renderMode='realistic'; cam.y = 5; zoom=1.0; tZoom=1.0; });
  await page.waitForTimeout(400);
  await page.screenshot({path:'screenshots/NAT-sun-lily-realistic.png'});

  // Zoomed pad detail
  await page.evaluate(()=>{
    settings.renderMode='cartoon';
    cam.x = 200; cam.y = 5; zoom=2.2; tZoom=2.2;
  });
  await page.waitForTimeout(350);
  await page.screenshot({path:'screenshots/NAT-lilypad-detail.png'});

  // Evening sun
  await page.evaluate(()=>{ tod=18.2; dayLight=0.45; cam.x=0; cam.y=8; zoom=1.1; tZoom=1.1; });
  await page.waitForTimeout(350);
  await page.screenshot({path:'screenshots/NAT-sun-evening.png'});

  const info = await page.evaluate(()=>({
    sun: window._sunPos ? {x:+_sunPos.x.toFixed(1), y:+_sunPos.y.toFixed(1), r:+_sunPos.r.toFixed(1)} : null,
    hasDraw: typeof drawNaturalLilypads === 'function',
    hasGlitter: typeof renderSunGlitter === 'function',
    errors: 0
  }));
  console.log('INFO '+JSON.stringify(info));
  console.log('ERR '+errors.length);
  errors.forEach(e=>console.log('E '+e));
  console.log('DONE');
});
