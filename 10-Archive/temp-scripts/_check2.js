const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const result = await page.evaluate(async () => {
    var r = await fetch('https://igraspore.pages.dev/?cache=' + Date.now());
    var t = await r.text();
    return {
      len: t.length,
      hasBioDebug: t.indexOf('_bioDebug') >= 0,
      hasBioiconsReady: t.indexOf('bioiconsReady') >= 0,
    };
  });
  console.log('Served:', JSON.stringify(result));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
