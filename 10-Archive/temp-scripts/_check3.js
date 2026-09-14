const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://igraspore.pages.dev', { waitUntil: 'networkidle', timeout: 30000 });
  const result = await page.evaluate(() => ({
    _bioDebug: window._bioDebug,
    bioiconsReady: typeof window.bioiconsReady === 'function' ? window.bioiconsReady() : 'N/A',
    htmlSize: document.documentElement.outerHTML.length,
  }));
  console.log('Result:', JSON.stringify(result));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
