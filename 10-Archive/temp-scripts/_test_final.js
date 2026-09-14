const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,200)));
  await page.goto('https://igraspore.pages.dev?v=fin' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  // Track decomposers + viruses + all categories every 5s for 30s
  for (let t = 0; t <= 30; t += 5) {
    if (t > 0) await page.evaluate((steps) => { for(var i=0;i<steps;i++) updateWorld(1/30); }, 5*30);
    const s = await page.evaluate(() => {
      var decs = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
      var vir = (typeof viruses !== 'undefined') ? viruses.length : 0;
      var inf = (orgs||[]).filter(function(o){return o.alive && o.infected}).length;
      var cats = {};
      (orgs||[]).forEach(function(o){if(o&&o.alive&&o.sp){cats[o.sp.cat]=(cats[o.sp.cat]||0)+1}});
      return {
        alive: (orgs||[]).filter(function(o){return o&&o.alive}).length,
        viruses: vir, infected: inf, species: Object.keys((function(){var s={};(orgs||[]).forEach(function(o){if(o&&o.alive&&o.sp){s[o.sp.name]=1}});return s})()).length,
        decomposers: decs.length,
        decEnergy: decs.length ? Math.round(decs.reduce(function(s,o){return s+o.energy},0)/decs.length) : 0,
        cats: cats
      };
    });
    console.log('t=' + t + ' alive=' + s.alive + ' sp=' + s.species + ' vir=' + s.viruses + ' inf=' + s.infected + ' dec=' + s.decomposers + ' decE=' + s.decEnergy + ' cats=' + JSON.stringify(s.cats));
  }
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/FINAL-30s.png' });
  console.log('ERRORS:', errors.length);
  if (errors.length) console.log('  e[0]:', errors[0]);
  await browser.close();
  console.log('DONE');
})().catch(function(e){console.error(e);process.exit(1)});
