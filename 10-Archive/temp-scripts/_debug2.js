const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', m => console.log('[console]', m.text().substring(0,300)));
  page.on('pageerror', e => console.log('[pageerror]', e.message.substring(0,300)));
  await page.goto('https://igraspore.pages.dev?v=dbg2' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  const d = await page.evaluate(() => ({
    _bioDebug: window._bioDebug,
    bioiconsReady: typeof window.bioiconsReady === 'function' ? window.bioiconsReady() : 'N/A',
  }));
  console.log('Result:', JSON.stringify(d));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
