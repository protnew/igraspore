
const { test } = require('@playwright/test');
test('night loses mass day gains', async ({ page }) => {
  page.on('pageerror', e=>console.log('ERR '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(700);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(400);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  const r = await page.evaluate(() => {
    const sp = SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    // DAY
    const day = spawnOrg(sp, 0, PD*0.1, false);
    day.massFood = 5; day.energy = 60; day.alive = true;
    try{ dayLight = 1; }catch(e){}
    const dm0=day.massFood, de0=day.energy;
    for(let i=0;i<40;i++) updateOrg(day, 0.05);
    const dayR = {dMass:+(day.massFood-dm0).toFixed(3), dEn:+(day.energy-de0).toFixed(3)};

    // NIGHT
    const night = spawnOrg(sp, 0, PD*0.1, false);
    night.massFood = 5; night.energy = 60; night.alive = true;
    try{ dayLight = 0; }catch(e){}
    const nm0=night.massFood, ne0=night.energy;
    for(let i=0;i<40;i++) updateOrg(night, 0.05);
    const nightR = {dMass:+(night.massFood-nm0).toFixed(3), dEn:+(night.energy-ne0).toFixed(3)};

    return {
      day: dayR, night: nightR,
      dayGainsMass: dayR.dMass > 0,
      nightLosesMass: nightR.dMass < 0,
      nightLosesOrFlatEn: nightR.dEn <= 0
    };
  });
  console.log(JSON.stringify(r));
  console.log('DONE');
});
