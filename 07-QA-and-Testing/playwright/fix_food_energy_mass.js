
const { test } = require('@playwright/test');
test('food scales energy+mass; no 3-eat gate; sun mass', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(800);

  // predator
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer1'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // 1) single SMALL food
  const small = await page.evaluate(() => {
    autoAI=false;
    player.energy=40; player.massFood=0; player.eaten=0; player.size=player.sp.size;
    for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<300) o.alive=false; }
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    const fo=spawnOrg(sp, player.x, player.y, false);
    fo.size=0.8; fo.energy=15; fo.divCD=0; fo.invuln=0;
    const e0=player.energy, m0=player.massFood;
    forceEat(player, fo);
    return {dEn: player.energy-e0, dMass: player.massFood-m0, en:player.energy, mass:player.massFood};
  });
  console.log('SMALL: '+JSON.stringify(small));

  // 2) single LARGE food — should give MORE energy and mass
  const large = await page.evaluate(() => {
    player.energy=40; player.massFood=0;
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    const fo=spawnOrg(sp, player.x, player.y, false);
    fo.size=player.size*0.7; fo.energy=80; fo.divCD=0; fo.invuln=0;
    const e0=player.energy, m0=player.massFood, s0=player.size;
    forceEat(player, fo);
    return {dEn: player.energy-e0, dMass: player.massFood-m0, dSize: player.size-s0};
  });
  console.log('LARGE: '+JSON.stringify(large));
  console.log('SCALE_OK: '+(large.dEn>small.dEn && large.dMass>small.dMass));

  // 3) canDivide with 1 eat if mass+energy+size enough (no 3-eat gate)
  const oneEat = await page.evaluate(() => {
    player.eatsSinceDiv = 1; // only 1
    player.energy = player.sp.repEnergy + 20;
    player.age = 50;
    player.divCD = 0; player.dividing=false;
    player.size = player.sp.size * 1.05;
    player.massFood = Math.max(20, player.sp.size * 2);
    return {can: window.canDivide(player), reason: window.divideBlockReason(player), eats: player.eatsSinceDiv};
  });
  console.log('ONE_EAT_DIV: '+JSON.stringify(oneEat));

  // 4) producer + sun mass
  const sun = await page.evaluate(() => {
    // find producer species and respawn as player briefly via swap
    let pIdx=0; for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){pIdx=i;break;}
    // just spawn a producer NPC and simulate update with dayLight
    const sp=SPECIES_DB[pIdx];
    const o=spawnOrg(sp, player.x+30, Math.min(player.y, PD*0.15), false);
    o.massFood=0; o.energy=50; o.alive=true;
    const dayL0 = dayLight;
    // force bright day
    // dayLight is often derived — set if possible
    try{ dayLight = 1; }catch(e){}
    const m0=o.massFood, e0=o.energy;
    for(let i=0;i<30;i++) updateOrg(o, 0.05);
    return {
      dMass: o.massFood-m0,
      dEn: o.energy-e0,
      dayLight: typeof dayLight!=='undefined'?dayLight:null,
      y:o.y
    };
  });
  console.log('SUN: '+JSON.stringify(sun));

  console.log('ERRORS: '+errors.length);
  errors.forEach(e=>console.log('ERR: '+e));
  console.log('DONE');
});
