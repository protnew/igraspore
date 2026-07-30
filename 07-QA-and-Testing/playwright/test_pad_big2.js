
const { test } = require('@playwright/test');
test('shot', async ({ page }) => {
  page.on('pageerror', e=>console.log('PE '+e.message.slice(0,120)));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'domcontentloaded', timeout:60000});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.waitForFunction(()=>typeof startGame==='function' && typeof SPECIES_DB!=='undefined', null, {timeout:30000});
  await page.evaluate(()=>{
    for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer1'){selSpecies=i;break;}
    startGame(false);
    if(window.skipTutorial) skipTutorial();
  });
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ freeCam=true; cam.y=6; cam.x=0; zoom=0.28; tZoom=0.28; tod=11; dayLight=0.95; });
  await page.waitForTimeout(300);
  await page.screenshot({path:'screenshots/PAD-BIG-day.png'});
  await page.evaluate(()=>{ cam.y=40; zoom=0.45; tZoom=0.45; });
  await page.waitForTimeout(200);
  await page.screenshot({path:'screenshots/PAD-BIG-shadow.png'});
  await page.evaluate(()=>{
    let c=orgs.find(o=>o&&o.alive&&o.sp&&o.sp.shape==='colony') || orgs.find(o=>o&&o.alive&&o.sp&&o.sp.cat==='producer');
    if(c){cam.x=c.x;cam.y=c.y;zoom=7;tZoom=7;}
  });
  await page.waitForTimeout(250);
  await page.screenshot({path:'screenshots/PAD-BIG-colony.png'});
  const info = await page.evaluate(()=>({
    col: SPECIES_DB.filter(s=>s.shape==='colony').slice(0,6).map(s=>s.name+'@'+s.size),
    playerY: player&&player.y
  }));
  console.log('INFO '+JSON.stringify(info));
  console.log('DONE');
});
