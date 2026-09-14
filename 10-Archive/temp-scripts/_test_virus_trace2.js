const { chromium } = require('playwright');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,150)));

  await page.goto(URL + '?v=vt2' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => {
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof settings !== 'undefined') settings.virusRate = 3;
    if (typeof startGame === 'function') startGame();
  });
  await page.waitForTimeout(2000);

  // Phase 1
  var s0 = await page.evaluate(() => ({
    viruses: viruses.length, infected: orgs.filter(o=>o.infected).length,
    alive: orgs.filter(o=>o.alive).length, VIRUS_SPECS: VIRUS_SPECS.length,
    virusT: Math.round(virusT*100)/100,
    spawnInterval: typeof DIFF!=='undefined' ? (3/(settings.virusRate*DIFF[difficulty].virus)) : 'undef',
  }));
  console.log('T=0:', JSON.stringify(s0));

  // Phase 2: 5s simulation
  for (var sec = 1; sec <= 5; sec++) {
    await page.evaluate(() => {
      for (var i = 0; i < 30; i++) updateWorld(1/30);
    });
    var st = await page.evaluate(() => ({
      viruses: viruses.length, infected: orgs.filter(o=>o.infected).length,
      virusT: Math.round(virusT*100)/100,
    }));
    console.log('T=' + sec + 's:', JSON.stringify(st));
  }

  // Phase 3: Manual infection + lysis
  var infect = await page.evaluate(() => {
    var target = orgs.find(o => o.alive && !o.infected);
    if (!target) return 'no target';
    target.infected = true; target.infectionT = 0;
    target.virusType = VIRUS_SPECS[0];
    return target.sp.name + ' @ (' + Math.round(target.x) + ',' + Math.round(target.y) + ')';
  });
  console.log('Infected:', infect);

  for (var sec = 1; sec <= 20; sec++) {
    await page.evaluate(() => {
      for (var i = 0; i < 30; i++) updateWorld(1/30);
    });
    var st = await page.evaluate(() => ({
      viruses: viruses.length,
      infected: orgs.filter(o=>o.infected).length,
      maxInfectionT: Math.max.apply(null, orgs.filter(o=>o.infected).map(o=>o.infectionT).concat([0])).toFixed(1),
    }));
    console.log('Lysis+' + sec + 's:', JSON.stringify(st));
    if (st.viruses > 50) { console.log('>>> LYSIS BURST! viruses jumped to ' + st.viruses); break; }
  }

  var fin = await page.evaluate(() => ({
    viruses: viruses.length, infected: orgs.filter(o=>o.infected).length,
    alive: orgs.filter(o=>o.alive).length,
  }));
  console.log('FINAL:', JSON.stringify(fin));
  console.log('errors:', errors.length);
  if (errors.length) console.log('errs:', errors.slice(0,3));
  await browser.close();
})().catch(e=>{ console.error('FAIL', e.message); process.exit(1); });
