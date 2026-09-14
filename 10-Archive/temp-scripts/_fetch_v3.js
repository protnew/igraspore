const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://igraspore.pages.dev', { waitUntil: 'domcontentloaded' });
  
  // Fetch the actual file
  const result = await page.evaluate(async () => {
    var r = await fetch('04-Src/js/render_bio_v3.js?v=' + Date.now());
    var t = await r.text();
    return {
      status: r.status,
      len: t.length,
      isHTML: t.startsWith('<!DOCTYPE'),
      hasBioDebug: t.indexOf('_bioDebug') >= 0,
      hasBioReady: t.indexOf('bioReady') >= 0,
      first200: t.substring(0, 200),
    };
  });
  console.log(JSON.stringify(result, null, 2));
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
