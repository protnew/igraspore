
const { test } = require('@playwright/test');
test('sun lily v3', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(600);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(300);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // Keep freeCam and pin camera every frame via exposed hook
  await page.evaluate(()=>{
    freeCam=true; autoAI=false; tod=11; dayLight=0.92;
    player.x=150; player.y=12;
    settings.renderMode='cartoon';
    window.__pinCam = true;
    const _rs = window.render || null;
  });
  // pin via interval
  await page.evaluate(()=>{
    window.__pin = setInterval(()=>{
      if(!window.__pinCam) return;
      freeCam=true;
      cam.x=150; cam.y=-30;
      zoom=1.0; tZoom=1.0;
      tod=11; dayLight=0.92;
    }, 16);
  });
  await page.waitForTimeout(800);
  await page.screenshot({path:'screenshots/NAT3-day.png'});

  await page.evaluate(()=>{ tod=18.4; dayLight=0.42; cam.x=100; cam.y=-40; });
  await page.waitForTimeout(600);
  await page.screenshot({path:'screenshots/NAT3-evening.png'});

  await page.evaluate(()=>{ tod=11; dayLight=0.9; cam.x=250; cam.y=8; zoom=2.8; tZoom=2.8; });
  await page.waitForTimeout(600);
  await page.screenshot({path:'screenshots/NAT3-pad.png'});

  await page.evaluate(()=>{ settings.renderMode='realistic'; tod=12; dayLight=0.95; cam.x=150; cam.y=-25; zoom=1.0; tZoom=1.0; });
  await page.waitForTimeout(600);
  await page.screenshot({path:'screenshots/NAT3-real.png'});

  const info = await page.evaluate(()=>{
    // sample canvas colors
    const c=document.getElementById('cv')||document.querySelector('canvas');
    const g=c.getContext('2d');
    const top=g.getImageData(c.width/2, 20, 1, 1).data;
    const mid=g.getImageData(c.width/2, c.height*0.35, 1, 1).data;
    const bot=g.getImageData(c.width/2, c.height*0.7, 1, 1).data;
    return {
      sun: window._sunPos && {x:+_sunPos.x.toFixed(0), y:+_sunPos.y.toFixed(0), r:+_sunPos.r.toFixed(1)},
      topRGB:[top[0],top[1],top[2]],
      midRGB:[mid[0],mid[1],mid[2]],
      botRGB:[bot[0],bot[1],bot[2]]
    };
  });
  console.log('INFO '+JSON.stringify(info));
  await page.evaluate(()=>{ clearInterval(window.__pin); window.__pinCam=false; });
  console.log('ERR '+errors.length);
  errors.forEach(e=>console.log('E '+e));
  console.log('DONE');
});
