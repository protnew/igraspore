const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', m => console.log('[console]', m.text().substring(0,300)));
  page.on('pageerror', e => console.log('[pageerror]', e.message.substring(0,300)));
  await page.goto('https://igraspore.pages.dev?v=dbg' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  
  const debug = await page.evaluate(() => ({
    _bioDebug: window._bioDebug,
    _bioReadyDebug: window._bioReadyDebug,
    bioiconsReady: typeof window.bioiconsReady,
    bioiconsReadyVal: typeof window.bioiconsReady === 'function' ? window.bioiconsReady() : 'N/A',
    drawBioicon: typeof window.drawBioicon,
  }));
  console.log('Debug:', JSON.stringify(debug, null, 2));
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
