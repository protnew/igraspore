
const { test } = require('@playwright/test');
test('pads shadows sunset', async ({ page }) => {
  page.on('pageerror', e=>console.log('PE '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(500);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(300);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); freeCam=true; autoAI=false; });

  async function pin(code, ms, shot){
    await page.evaluate((c)=>{ freeCam=true; eval(c); window.__hold=setInterval(()=>{ freeCam=true; eval(c); }, 20); }, code);
    await page.waitForTimeout(ms);
    await page.screenshot({path:'screenshots/'+shot});
    await page.evaluate(()=>clearInterval(window.__hold));
  }

  // Day: surface from slightly below — large pads + shadows
  await pin("tod=11; dayLight=0.95; settings.renderMode='cartoon'; cam.x=0; cam.y=55; zoom=1.1; tZoom=1.1; player.x=0; player.y=50;", 800, 'PAD-day-shadows.png');

  // Close pad
  await pin("tod=11; dayLight=0.95; cam.x=200; cam.y=40; zoom=1.8; tZoom=1.8;", 700, 'PAD-close.png');

  // Planetarium sunset
  await pin("tod=18.6; dayLight=0.45; cam.x=0; cam.y=-30; zoom=0.9; tZoom=0.9; settings.renderMode='cartoon';", 800, 'PAD-sunset.png');

  // Late dusk with stars
  await pin("tod=19.8; dayLight=0.22; cam.x=50; cam.y=-40; zoom=0.85; tZoom=0.85;", 800, 'PAD-planetarium.png');

  // Night
  await pin("tod=22.5; dayLight=0.05; cam.x=0; cam.y=-35; zoom=0.9; tZoom=0.9;", 700, 'PAD-night.png');

  const info = await page.evaluate(()=>{
    const c=document.querySelector('canvas');
    const g=c.getContext('2d');
    const p=(x,y)=>Array.from(g.getImageData(x|0,y|0,1,1).data).slice(0,3);
    return {
      sun: window._sunPos && {y:+_sunPos.y.toFixed(0), r:+_sunPos.r.toFixed(1)},
      top: p(c.width/2, 25),
      horizon: p(c.width/2, c.height*0.35),
      water: p(c.width/2, c.height*0.7)
    };
  });
  console.log('INFO '+JSON.stringify(info));
  console.log('DONE');
});
