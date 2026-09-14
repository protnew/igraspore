const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://igraspore.pages.dev', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    var r = await fetch('04-Src/js/render_bioicons.js?v=' + Date.now());
    var t = await r.text();
    return { status: r.status, len: t.length, isHTML: t.startsWith('<!DOCTYPE'), first50: t.substring(0,50) };
  });
  console.log(JSON.stringify(result));
  
  // Also check if loadBioicons is defined now
  await page.goto('https://igraspore.pages.dev?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const globals = await page.evaluate(() => ({ loadBioicons: typeof window.loadBioicons }));
  console.log('Globals:', JSON.stringify(globals));
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
