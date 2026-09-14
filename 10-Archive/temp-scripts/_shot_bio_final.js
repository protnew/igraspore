const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  
  await page.goto('https://igraspore.pages.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy'; startGame();
  });
  await page.waitForTimeout(2000);
  
  // Bioicons mode
  await page.evaluate(() => { settings.renderMode='bioicons'; applyRenderMode(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => { for(var i=0;i<30;i++) updateWorld(1/30); });
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/FINAL-BIO-MOBILE.png' });
  
  // Cartoon mode
  await page.evaluate(() => { settings.renderMode='cartoon'; applyRenderMode(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/FINAL-CARTOON-MOBILE.png' });
  
  console.log('done');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
