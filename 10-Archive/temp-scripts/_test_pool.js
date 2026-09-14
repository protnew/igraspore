const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=pl' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  const result = await page.evaluate(() => {
    // Simulate the pool filter from initWorld
    var pool = SPECIES_DB.filter(function(s){
      return s.cat === 'producer' && !(s.flags && s.flags.noRandomSpawn) && (s.size||1) < 16;
    });
    return {
      poolSize: pool.length,
      poolNames: pool.map(function(s){return s.name}),
      coloniesInPool: pool.filter(function(s){return s.shape === 'colony'}).map(function(s){return s.name}),
      allProducers: SPECIES_DB.filter(function(s){return s.cat === 'producer'}).length,
      colonyProducers: SPECIES_DB.filter(function(s){return s.cat === 'producer' && s.shape === 'colony'}).map(function(s){return s.name}),
    };
  });
  console.log(JSON.stringify(result, null, 2));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
