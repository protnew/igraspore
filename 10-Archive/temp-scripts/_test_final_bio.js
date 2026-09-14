const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('console', msg => { if (msg.type() === 'error') console.log('[ERR]', msg.text().substring(0,200)); });
  await page.goto('https://igraspore.pages.dev?v=fb' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    startGame(); 
  });
  await page.waitForTimeout(2000);
  
  // Switch to bioicons
  await page.evaluate(() => {
    settings.renderMode = 'bioicons';
    if (typeof applyRenderMode === 'function') applyRenderMode();
  });
  await page.waitForTimeout(500);
  
  // Run game + screenshot
  await page.evaluate(() => { for(var i=0;i<60;i++) updateWorld(1/30); });
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIOICONS-FINAL.png' });
  
  // Also cartoon for comparison
  await page.evaluate(() => { settings.renderMode='cartoon'; applyRenderMode(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/CARTOON-FINAL.png' });
  
  console.log('done');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
