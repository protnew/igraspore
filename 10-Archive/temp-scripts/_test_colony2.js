const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  // Force fresh load with cache bypass
  await page.goto('https://igraspore.pages.dev?v=col2' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);
  const state = await page.evaluate(() => {
    var colonies = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.shape === 'colony'});
    return { count: colonies.length, names: colonies.map(function(c){return c.sp.name}) };
  });
  console.log('Colonies at start:', JSON.stringify(state));
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
