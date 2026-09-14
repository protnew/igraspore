const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=tr' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  // Track decomposers every 2 seconds: energy, y, count, AND check if mass death event
  for (let t = 0; t <= 30; t += 2) {
    if (t > 0) await page.evaluate((s) => { for(var i=0;i<s;i++) updateWorld(1/30); }, 2*30);
    const s = await page.evaluate(() => {
      var decs = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
      var dying = (orgs||[]).filter(function(o){return o.sp && o.sp.cat === 'decomposer' && o.dying});
      var totalDec = (orgs||[]).filter(function(o){return o.sp && o.sp.cat === 'decomposer'});
      var energyBuckets = { '0-10':0, '10-30':0, '30-50':0, '50+':0 };
      decs.forEach(function(d){
        if(d.energy < 10) energyBuckets['0-10']++;
        else if(d.energy < 30) energyBuckets['10-30']++;
        else if(d.energy < 50) energyBuckets['30-50']++;
        else energyBuckets['50+']++;
      });
      return {
        alive: decs.length,
        dying: dying.length,
        total: totalDec.length,
        avgE: decs.length ? Math.round(decs.reduce(function(s,o){return s+o.energy},0)/decs.length) : 0,
        avgY: decs.length ? Math.round(decs.reduce(function(s,o){return s+o.y},0)/decs.length) : 0,
        buckets: energyBuckets,
        totalOrgs: (orgs||[]).filter(function(o){return o&&o.alive}).length,
      };
    });
    console.log('t=' + t + ' dec=' + s.alive + '/' + s.total + ' E=' + s.avgE + ' y=' + s.avgY + ' buckets=' + JSON.stringify(s.buckets) + ' totalOrgs=' + s.totalOrgs);
  }
  await browser.close();
  console.log('DONE');
})().catch(function(e){console.error(e);process.exit(1)});
