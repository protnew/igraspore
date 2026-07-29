
const { test } = require('@playwright/test');
test('pond surface from below', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>console.log('PE '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(500);
  await page.evaluate(()=>{
    for(let i=0;i<SPECIES_DB.length;i++) if((SPECIES_DB[i].name||'').includes('Anabaena')){selSpecies=i;break;}
    if(selSpecies==null) for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;}
  });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(300);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // Match user shot: underwater looking UP at surface, morning, cartoon
  await page.evaluate(()=>{
    freeCam = true; autoAI = false;
    settings.renderMode = 'cartoon';
    if(settings.vignette!=null) settings.vignette = false;
    tod = 9.5; dayLight = 0.92;
    player.x = 0; player.y = 55;
    window.__hold = setInterval(()=>{
      freeCam=true;
      tod=9.5; dayLight=0.92;
      cam.x = 0; cam.y = 48;
      zoom = 1.35; tZoom = 1.35;
    }, 16);
  });
  await page.waitForTimeout(900);
  await page.screenshot({path:'screenshots/POND-from-below.png', fullPage:false});

  // Above surface day
  await page.evaluate(()=>{
    clearInterval(window.__hold);
    window.__hold = setInterval(()=>{
      freeCam=true; tod=11; dayLight=0.95;
      cam.x=0; cam.y=-20; zoom=1.0; tZoom=1.0;
    }, 16);
  });
  await page.waitForTimeout(700);
  await page.screenshot({path:'screenshots/POND-above.png'});

  // Pad close from below
  await page.evaluate(()=>{
    clearInterval(window.__hold);
    window.__hold = setInterval(()=>{
      freeCam=true; tod=10; dayLight=0.9;
      cam.x=200; cam.y=35; zoom=2.2; tZoom=2.2;
    }, 16);
  });
  await page.waitForTimeout(700);
  await page.screenshot({path:'screenshots/POND-pad-below.png'});

  await page.evaluate(()=>clearInterval(window.__hold));
  const info = await page.evaluate(()=>{
    const c=document.querySelector('canvas');
    const g=c.getContext('2d');
    const p=(x,y)=>Array.from(g.getImageData(x|0,y|0,1,1).data).slice(0,3);
    return {
      sun: window._sunPos && {x:+_sunPos.x.toFixed(0), y:+_sunPos.y.toFixed(0), r:+_sunPos.r.toFixed(1), dl:+_sunPos.dl.toFixed(2)},
      top: p(c.width/2, 40),
      nearSurf: p(c.width/2, c.height*0.35),
      deep: p(c.width/2, c.height*0.75),
      hasSnell: typeof renderSnellWindow
    };
  });
  console.log('INFO '+JSON.stringify(info));
  console.log('ERR '+errors.length);
  errors.forEach(e=>console.log('E '+e));
  console.log('DONE');
});
