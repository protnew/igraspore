const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.on('console', m => { if(m.type()==='error') console.log('[ERR]', m.text().substring(0,200)); });
  
  await page.goto('https://igraspore.pages.dev?v=fx' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  const ready = await page.evaluate(() => window.bioiconsReady());
  console.log('bioiconsReady:', ready);
  
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy'; startGame();
  });
  await page.waitForTimeout(3000);
  
  // Check virus movement
  const vCheck = await page.evaluate(() => {
    var v = viruses||[];
    return {
      count: v.length,
      moving: v.filter(x => Math.abs(x.vx) > 0.1 || Math.abs(x.vy) > 0.1).length,
      sample: v.length ? { vx: Math.round(v[0].vx*100)/100, vy: Math.round(v[0].vy*100)/100 } : null,
      infected: (orgs||[]).filter(o => o.infectionT > 0).length,
    };
  });
  console.log('Viruses:', JSON.stringify(vCheck));
  
  // Switch to bioicons and screenshot
  await page.evaluate(() => { settings.renderMode='bioicons'; applyRenderMode(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => { for(var i=0;i<30;i++) updateWorld(1/30); });
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/POSTFIX-BIO.png' });
  
  // Cartoon for comparison
  await page.evaluate(() => { settings.renderMode='cartoon'; applyRenderMode(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/POSTFIX-CARTOON.png' });
  
  console.log('done');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
