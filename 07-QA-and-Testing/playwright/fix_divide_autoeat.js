
const { test } = require('@playwright/test');
test('autoeat + divide gates', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(String(e.message||e)));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(900);

  // predator species
  await page.evaluate(() => {
    let idx=0;
    for(let i=0;i<SPECIES_DB.length;i++){ if(SPECIES_DB[i].cat==='consumer1'){ idx=i; break; } }
    selSpecies=idx;
  });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(600);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // 1) Tiny cell cannot divide even with full energy
  const gate1 = await page.evaluate(() => {
    player.energy = 200;
    player.age = 100;
    player.divCD = 0;
    player.dividing = false;
    player.size = 1.5; // tiny
    player.massFood = 0;
    player.eatsSinceDiv = 0;
    const ok = doDivide(player);
    return {ok, reason: window.divideBlockReason(player), can: window.canDivide(player)};
  });
  console.log('GATE_TINY: '+JSON.stringify(gate1));

  // 2) Full energy but no mass/eats — still blocked
  const gate2 = await page.evaluate(() => {
    player.size = player.sp.size * 1.0;
    player.energy = player.sp.repEnergy + 50;
    player.massFood = 0;
    player.eatsSinceDiv = 0;
    player.divCD = 0; player.dividing=false;
    return {ok: doDivide(player), reason: window.divideBlockReason(player), can: window.canDivide(player)};
  });
  console.log('GATE_NOMASS: '+JSON.stringify(gate2));

  // 3) Auto-eat WITHOUT pressing E — contact only
  const autoEat = await page.evaluate(() => {
    autoAI = false; // manual mode, no E
    player.eaten = 0; player.massFood = 0; player.eatsSinceDiv = 0;
    player.energy = 60; player.alive=true; player.dying=false; player.cyst=false; player.parasite=null;
    // clear near
    for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<300) o.alive=false; }
    const sp = SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    // place 5 food ON player
    for(let i=0;i<5;i++){
      const fo=spawnOrg(sp, player.x+(i-2)*3, player.y, false);
      if(fo){ fo.size=player.size*0.35; fo.divCD=0; fo.invuln=0; fo.vx=0; fo.vy=0; }
    }
    return {e0: player.eaten};
  });
  // wait for updateOrg auto-eat ticks
  await page.waitForTimeout(800);
  const afterContact = await page.evaluate(() => ({
    eaten: player.eaten,
    mass: player.massFood,
    eatsDiv: player.eatsSinceDiv,
    size: player.size,
    energy: player.energy
  }));
  console.log('CONTACT_EAT: '+JSON.stringify({autoEat, afterContact}));

  // 4) After enough food + size, can divide
  const gate3 = await page.evaluate(() => {
    // simulate well-fed adult
    player.divCD=0; player.dividing=false;
    player.energy = player.sp.repEnergy + 40;
    player.age = 50;
    player.size = player.sp.size * 1.05;
    player.massFood = Math.max(20, player.sp.size * 2);
    player.eatsSinceDiv = 5;
    const can = window.canDivide(player);
    const ok = doDivide(player);
    return {can, ok, reason: window.divideBlockReason(player), dividing: player.dividing};
  });
  console.log('GATE_READY: '+JSON.stringify(gate3));

  // finish divide if started
  await page.waitForTimeout(1500);
  const afterDiv = await page.evaluate(() => ({
    dividing: player.dividing,
    size: player.size,
    mass: player.massFood,
    eatsDiv: player.eatsSinceDiv,
    divCD: player.divCD,
    canAgain: window.canDivide(player),
    reason: window.divideBlockReason(player)
  }));
  console.log('AFTER_DIV: '+JSON.stringify(afterDiv));

  // 5) Spam Q should not infinite divide
  const spam = await page.evaluate(() => {
    let n=0;
    player.energy=999; player.age=99;
    for(let i=0;i<10;i++){
      player.divCD=0; // even if we cheat CD
      // but mass/size after first div should block
      if(doDivide(player)) n++;
    }
    return {divStarts:n, size:player.size, mass:player.massFood, can:window.canDivide(player)};
  });
  console.log('SPAM: '+JSON.stringify(spam));

  await page.screenshot({path:'screenshots/DIV-gates.png'});
  console.log('ERRORS: '+errors.length);
  errors.forEach(e=>console.log('ERR: '+e));
  console.log('DONE');
});
