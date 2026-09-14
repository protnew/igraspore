const { chromium } = require('playwright');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,150)));
  page.on('console', msg => { if (msg.type()==='error') errors.push('console:'+msg.text().slice(0,150)); });

  await page.goto(URL + '?v=vtrace' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => {
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof settings !== 'undefined') { settings.virusRate = 3; }
    if (typeof startGame === 'function') startGame();
  });
  await page.waitForTimeout(2000);

  // Phase 1: Initial state
  var s0 = await page.evaluate(() => ({
    viruses: viruses ? viruses.length : -1,
    infected: orgs ? orgs.filter(o=>o.infected).length : -1,
    alive: orgs ? orgs.filter(o=>o.alive).length : -1,
    VIRUS_SPECS: typeof VIRUS_SPECS !== 'undefined' ? VIRUS_SPECS.length : 'undef',
    virusT: typeof virusT !== 'undefined' ? virusT : 'undef',
    settings_virusRate: typeof settings !== 'undefined' ? settings.virusRate : 'undef',
    diff_virus: typeof DIFF !== 'undefined' && difficulty ? DIFF[difficulty].virus : 'undef',
  }));
  console.log('T=0:', JSON.stringify(s0));

  // Phase 2: Run 5s of simulation, check every 1s
  for (var t = 1; t <= 5; t++) {
    await page.evaluate(() => {
      var dt = 1/30;
      for (var i = 0; i < 30; i++) { // 1s
        if (typeof updateWorld === 'function') updateWorld(dt);
      }
    });
    var st = await page.evaluate(() => ({
      t: t,
      viruses: viruses ? viruses.length : -1,
      infected: orgs ? orgs.filter(o=>o.infected).length : -1,
      alive: orgs ? orgs.filter(o=>o.alive).length : -1,
      virusT: typeof virusT !== 'undefined' ? Math.round(virusT*10)/10 : 'undef',
    }));
    console.log('T=' + t + 's:', JSON.stringify(st));
  }

  // Phase 3: Manually trigger an infection to see if lysis works
  var infectResult = await page.evaluate(() => {
    // Find a bacterium and manually infect it
    var target = orgs.find(o => o.alive && !o.infected && o.sp && (o.sp.cat === 'producer' || o.sp.cat === 'consumer1'));
    if (!target) return { error: 'no target found' };
    target.infected = true;
    target.infectionT = 0;
    target.virusType = VIRUS_SPECS[0];
    return { targetName: target.sp.name, targetX: Math.round(target.x), targetY: Math.round(target.y) };
  });
  console.log('Manual infection:', JSON.stringify(infectResult));

  // Run 15s to see lysis
  for (var t = 1; t <= 15; t++) {
    await page.evaluate(() => {
      var dt = 1/30;
      for (var i = 0; i < 30; i++) updateWorld(dt);
    });
    var st = await page.evaluate(() => ({
      t: t,
      viruses: viruses.length,
      infected: orgs.filter(o=>o.infected).length,
      infectionT: orgs.filter(o=>o.infected).map(o=>Math.round(o.infectionT*10)/10).slice(0,3),
    }));
    console.log('Lysis T=' + t + ':', JSON.stringify(st));
    if (st.viruses > 50) { console.log('VIRUS EXPLOSION DETECTED'); break; }
  }

  // Final check
  var final = await page.evaluate(() => ({
    viruses: viruses.length,
    infected: orgs.filter(o=>o.infected).length,
    alive: orgs.filter(o=>o.alive).length,
  }));
  console.log('FINAL:', JSON.stringify(final));
  console.log('errors:', errors.length);
  if (errors.length) console.log('errors:', errors.slice(0,3));

  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/VIRUS-TEST.png' });
  await browser.close();
})().catch(e=>{ console.error('FAIL', e); process.exit(1); });
