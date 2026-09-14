const { chromium } = require('playwright');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,150)));
  await page.goto(URL + '?v=vfin' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => {
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof startGame === 'function') startGame();
  });
  await page.waitForTimeout(2000);

  // Initial
  var s0 = await page.evaluate(() => ({
    viruses: viruses.length, infected: orgs.filter(o=>o.infected).length, alive: orgs.filter(o=>o.alive).length,
    virusY: viruses.map(v=>Math.round(v.y)).slice(0,5),
  }));
  console.log('T=0:', JSON.stringify(s0));

  // 10s simulation, check every 2s
  for (var sec = 2; sec <= 30; sec += 2) {
    await page.evaluate(() => {
      for (var i = 0; i < 60; i++) updateWorld(1/30); // 2s
    });
    var st = await page.evaluate(() => ({
      viruses: viruses.length,
      infected: orgs.filter(o=>o.infected).length,
      alive: orgs.filter(o=>o.alive).length,
      maxInfT: Math.max.apply(null, orgs.filter(o=>o.infected).map(o=>o.infectionT).concat([0])).toFixed(1),
    }));
    console.log('T=' + sec + 's:', JSON.stringify(st));
    // Track lysis bursts
    if (st.viruses >= 70) console.log('  >>> LYSIS BURST!');
  }

  var fin = await page.evaluate(() => ({
    viruses: viruses.length, infected: orgs.filter(o=>o.infected).length,
    alive: orgs.filter(o=>o.alive).length,
  }));
  console.log('FINAL:', JSON.stringify(fin));
  console.log('errors:', errors.length);

  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/VIRUS-FINAL.png' });
  await browser.close();
})().catch(e=>{ console.error('FAIL', e.message); process.exit(1); });
