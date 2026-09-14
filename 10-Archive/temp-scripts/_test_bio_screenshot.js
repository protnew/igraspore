const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  page.on('console', msg => { if (msg.type() === 'error') console.log('[ERR]', msg.text().substring(0,200)); });
  
  await page.goto('https://igraspore.pages.dev?v=bio' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);
  
  // Switch to bioicons mode
  await page.evaluate(() => {
    settings.renderMode = 'bioicons';
    if (typeof applyRenderMode === 'function') applyRenderMode();
    if (typeof window.loadBioicons === 'function' && !window.bioiconsReady()) {
      window.loadBioicons();
    }
  });
  
  // Wait for sprites to load
  await page.waitForTimeout(4000);
  
  // Check status
  const status = await page.evaluate(() => ({
    ready: window.bioiconsReady(),
    mode: settings.renderMode,
    orgs: (typeof orgs !== 'undefined') ? orgs.filter(function(o){return o.alive}).length : 0,
  }));
  console.log('Status:', JSON.stringify(status));
  
  // Run game loop a bit and take screenshot
  await page.evaluate(() => { for(var i=0;i<60;i++) updateWorld(1/30); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIOICONS-GAME.png' });
  console.log('screenshot done');
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
