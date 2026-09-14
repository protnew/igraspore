const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Fetch the ACTUAL HTML being served
  const result = await page.evaluate(async () => {
    var r = await fetch('https://igraspore.pages.dev/?v=chk' + Date.now());
    var t = await r.text();
    return {
      hasBioDebug: t.indexOf('_bioDebug') >= 0,
      hasTryCatch: t.indexOf('BEFORE_IIFE') >= 0,
      hasBioiconsReady: t.indexOf('bioiconsReady') >= 0,
      totalLen: t.length,
    };
  });
  console.log('Served HTML:', JSON.stringify(result));
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
