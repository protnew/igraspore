
const { test } = require('@playwright/test');
test('sun lily v2', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(600);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(350);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // Day surface: camera straddles waterline so sky+pads both visible
  await page.evaluate(()=>{
    tod=11; dayLight=0.9;
    freeCam=true; autoAI=false;
    player.x=100; player.y=15;
    cam.x=100; cam.y=-40; // look at sky+surface
    zoom=0.85; tZoom=0.85;
    settings.renderMode='cartoon';
  });
  await page.waitForTimeout(500);
  await page.screenshot({path:'screenshots/NAT2-day-surface.png'});

  // Pad closeup
  await page.evaluate(()=>{
    // find a pad x near 200
    cam.x=200; cam.y=5; zoom=2.5; tZoom=2.5;
  });
  await page.waitForTimeout(400);
  await page.screenshot({path:'screenshots/NAT2-pad-close.png'});

  // Evening
  await page.evaluate(()=>{
    tod=18.5; dayLight=0.4;
    cam.x=0; cam.y=-55; zoom=0.9; tZoom=0.9;
  });
  await page.waitForTimeout(400);
  await page.screenshot({path:'screenshots/NAT2-evening.png'});

  // Realistic day
  await page.evaluate(()=>{
    tod=12; dayLight=0.95;
    settings.renderMode='realistic';
    cam.x=80; cam.y=-35; zoom=0.9; tZoom=0.9;
  });
  await page.waitForTimeout(400);
  await page.screenshot({path:'screenshots/NAT2-realistic.png'});

  const sun = await page.evaluate(()=>window._sunPos);
  console.log('SUN '+JSON.stringify(sun));
  console.log('ERR '+errors.length);
  errors.forEach(e=>console.log('E '+e));
  console.log('DONE');
});
