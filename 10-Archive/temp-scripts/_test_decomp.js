const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=dc' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  for (let t = 0; t <= 20; t += 4) {
    if (t > 0) await page.evaluate((steps) => { for(var i=0;i<steps;i++) updateWorld(1/30); }, 4*30);
    const s = await page.evaluate(() => {
      var decs = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
      var clouds = typeof nutrientClouds !== 'undefined' ? nutrientClouds : [];
      return {
        decomposers: decs.length,
        decEnergy: decs.length ? Math.round(decs.reduce(function(s,o){return s+o.energy},0)/decs.length) : 0,
        decY: decs.length ? Math.round(decs.reduce(function(s,o){return s+o.y},0)/decs.length) : 0,
        clouds: clouds.length,
      };
    });
    console.log('t=' + t + ' ' + JSON.stringify(s));
  }
  await browser.close();
  console.log('DONE');
})().catch(function(e){console.error(e);process.exit(1)});
