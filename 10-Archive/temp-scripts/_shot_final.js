const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('https://igraspore.pages.dev?v=sh' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/FINAL-PROD.png' });
  console.log('screenshot done');
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
