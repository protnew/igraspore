
const { test } = require('@playwright/test');
test('final nature shots', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>console.log('PE '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(500);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(300);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); freeCam=true; autoAI=false; });

  async function pin(code, ms){
    await page.evaluate((c)=>{ freeCam=true; eval(c); window.__hold=setInterval(()=>{ freeCam=true; eval(c); }, 20); }, code);
    await page.waitForTimeout(ms);
    await page.evaluate(()=>{ clearInterval(window.__hold); });
  }

  await pin("tod=10.5; dayLight=0.9; cam.x=120; cam.y=-25; zoom=1.05; tZoom=1.05; settings.renderMode='cartoon';", 700);
  await page.screenshot({path:'screenshots/NATF-day.png'});

  await pin("tod=18.6; dayLight=0.38; cam.x=80; cam.y=-35; zoom=0.95; tZoom=0.95; settings.renderMode='cartoon';", 700);
  await page.screenshot({path:'screenshots/NATF-evening.png'});

  await pin("tod=11; dayLight=0.92; cam.x=200; cam.y=6; zoom=2.6; tZoom=2.6; settings.renderMode='cartoon';", 700);
  await page.screenshot({path:'screenshots/NATF-pads.png'});

  await pin("tod=12; dayLight=0.95; cam.x=100; cam.y=-20; zoom=1.0; tZoom=1.0; settings.renderMode='realistic';", 700);
  await page.screenshot({path:'screenshots/NATF-realistic.png'});

  const info = await page.evaluate(()=>{
    const c=document.getElementById('cv')||document.querySelector('canvas');
    const g=c.getContext('2d');
    const p=(x,y)=>Array.from(g.getImageData(x|0,y|0,1,1).data).slice(0,3);
    return {sun:window._sunPos&&{y:+_sunPos.y.toFixed(0),r:+_sunPos.r.toFixed(1)}, top:p(c.width/2,30), mid:p(c.width/2,c.height*0.4), bot:p(c.width/2,c.height*0.75)};
  });
  console.log('INFO '+JSON.stringify(info));
  console.log('DONE');
});
