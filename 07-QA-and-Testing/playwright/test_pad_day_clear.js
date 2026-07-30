
const { test } = require('@playwright/test');
test('day pads clear', async ({ page }) => {
  page.on('pageerror', e=>console.log('PE '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(400);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(250);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  await page.evaluate(()=>{
    freeCam=true; autoAI=false; settings.renderMode='cartoon';
    if(settings.vignette!=null) settings.vignette=false;
    window.__hold=setInterval(()=>{
      freeCam=true; tod=10.5; dayLight=0.92;
      cam.x=180; cam.y=28; zoom=1.4; tZoom=1.4;
      player.x=180; player.y=40;
    },16);
  });
  await page.waitForTimeout(900);
  await page.screenshot({path:'screenshots/PAD-day-clear.png'});
  await page.evaluate(()=>{
    clearInterval(window.__hold);
    window.__hold=setInterval(()=>{
      freeCam=true; tod=18.4; dayLight=0.5;
      cam.x=100; cam.y=-28; zoom=0.95; tZoom=0.95;
    },16);
  });
  await page.waitForTimeout(800);
  await page.screenshot({path:'screenshots/PAD-sunset2.png'});
  await page.evaluate(()=>clearInterval(window.__hold));
  console.log('DONE');
});
