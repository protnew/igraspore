
const { test } = require('@playwright/test');
test('meal scale + no eat gate + sun', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(800);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer1'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  const meals = await page.evaluate(() => {
    autoAI=false;
    function oneMeal(sz, en){
      player.energy=30; player.massFood=0; player.size=player.sp.size;
      for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<250) o.alive=false; }
      const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
      const fo=spawnOrg(sp, player.x, player.y, false);
      fo.size=sz; fo.energy=en; fo.divCD=0; fo.invuln=0; fo.alive=true;
      const e0=player.energy, m0=player.massFood;
      // call eatOrg directly for clean measure
      if(typeof eatOrg==='function') eatOrg(player, fo);
      else forceEat(player, fo);
      return {
        dEn: +(player.energy-e0).toFixed(2),
        dMass: +(player.massFood-m0).toFixed(3),
        lastEn: player._lastEnGain, lastM: player._lastMassGain
      };
    }
    const s = oneMeal(0.7, 12);
    const m = oneMeal(2.0, 40);
    const l = oneMeal(4.0, 90);
    return {s,m,l, scaleEn: l.dEn>s.dEn && m.dEn>=s.dEn, scaleMass: l.dMass>s.dMass && m.dMass>s.dMass};
  });
  console.log('MEALS: '+JSON.stringify(meals));

  const gate = await page.evaluate(() => {
    player.eatsSinceDiv = 1;
    player.energy = player.sp.repEnergy + 30;
    player.age=80; player.divCD=0; player.dividing=false;
    player.size = player.sp.size * 1.05;
    player.massFood = 25;
    return {can:canDivide(player), reason:divideBlockReason(player)};
  });
  console.log('GATE: '+JSON.stringify(gate));

  const sun = await page.evaluate(() => {
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    const o=spawnOrg(sp, 0, PD*0.12, false);
    o.massFood=0; o.energy=40;
    try{ dayLight=1; }catch(e){}
    const m0=o.massFood, e0=o.energy;
    for(let i=0;i<40;i++) updateOrg(o, 0.05);
    return {dMass:+(o.massFood-m0).toFixed(3), dEn:+(o.energy-e0).toFixed(3)};
  });
  console.log('SUN: '+JSON.stringify(sun));
  console.log('ERRORS: '+errors.length);
  errors.forEach(e=>console.log('ERR '+e));
  console.log('DONE');
});
