const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('console', m => console.log('[console.'+m.type()+']', m.text().substring(0,200)));
  await page.goto('https://igraspore.pages.dev?v=verify' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  const ready = await page.evaluate(() => window.bioiconsReady());
  console.log('bioiconsReady():', ready);
  
  // Start + switch + screenshot
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy';
    startGame();
  });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { settings.renderMode='bioicons'; applyRenderMode(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => { zoom=2.5; tZoom=2.5; });
  await page.waitForTimeout(300);
  await page.evaluate(() => { for(var i=0;i<30;i++) updateWorld(1/30); });
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/AUDIT-BIO-V3.png' });
  console.log('screenshot done');
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
