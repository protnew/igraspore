const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  page.on('console', msg => { if (msg.type() === 'error') console.log('[ERR]', msg.text().substring(0,200)); });
  await page.goto('https://igraspore.pages.dev?v=bf' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  const g = await page.evaluate(() => ({
    loadBioicons: typeof window.loadBioicons,
    drawBioicon: typeof window.drawBioicon,
    bioiconsReady: typeof window.bioiconsReady,
  }));
  console.log('Globals:', JSON.stringify(g));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
