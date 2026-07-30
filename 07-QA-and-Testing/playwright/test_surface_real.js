
const { test } = require('@playwright/test');
test('REAL surface reach', async ({ page }) => {
  page.on('pageerror', e=>console.log('PE '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(500);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(300);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  const y0 = await page.evaluate(()=>{
    freeCam=false; autoAI=false;
    player.x=0; player.y=120; player.vx=0; player.vy=0;
    cam.x=0; cam.y=120; zoom=1.5; tZoom=1.5;
    tod=11; dayLight=0.9;
    return player.y;
  });
  await page.keyboard.down('w');
  for(let i=0;i<50;i++) await page.waitForTimeout(40);
  await page.keyboard.up('w');
  const after = await page.evaluate(()=>({
    y:+player.y.toFixed(2),
    hasPads: typeof drawNaturalLilypads==='function',
    script:[...document.scripts].map(s=>s.src).find(s=>s.includes('render_effects'))||'',
  }));
  await page.evaluate(()=>{ freeCam=true; cam.x=0; cam.y=18; zoom=1.3; player.y=Math.min(player.y,20); tod=11; dayLight=0.9; });
  await page.waitForTimeout(500);
  await page.screenshot({path:'screenshots/FIX-surface-player.png'});
  await page.evaluate(()=>{ tod=18.5; dayLight=0.48; cam.y=-30; zoom=0.95; });
  await page.waitForTimeout(500);
  await page.screenshot({path:'screenshots/FIX-sunset-live.png'});
  console.log('START_Y '+y0);
  console.log('AFTER '+JSON.stringify(after));
  console.log('REACH '+(after.y < 30 ? 'OK' : 'FAIL y='+after.y));
  console.log('DONE');
});
