
const { test } = require('@playwright/test');
test('user-like pond', async ({ page }) => {
  page.on('pageerror', e=>console.log('PE '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(500);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if((SPECIES_DB[i].name||'').includes('Anabaena')){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(300);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  await page.evaluate(()=>{
    freeCam=true; autoAI=false; settings.renderMode='cartoon';
    if(settings.vignette!=null) settings.vignette=false;
    window.__hold=setInterval(()=>{
      freeCam=true; tod=9.2; dayLight=0.92;
      player.x=0; player.y=40;
      cam.x=0; cam.y=42; zoom=1.5; tZoom=1.5;
    },16);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({path:'screenshots/POND-userlike.png'});
  const info = await page.evaluate(()=>{
    const c=document.querySelector('canvas');
    const g=c.getContext('2d');
    const row = (y)=>{
      const arr=[];
      for(let i=0;i<5;i++){
        const x = c.width*(0.2+i*0.15);
        arr.push(Array.from(g.getImageData(x|0,y|0,1,1).data).slice(0,3));
      }
      return arr;
    };
    return {
      sun: window._sunPos,
      y0: row(c.height*0.15),
      y1: row(c.height*0.35),
      y2: row(c.height*0.7)
    };
  });
  console.log('INFO '+JSON.stringify(info));
  await page.evaluate(()=>clearInterval(window.__hold));
  console.log('DONE');
});
