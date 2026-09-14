const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://igraspore.pages.dev', { waitUntil: 'domcontentloaded' });
  
  // Try fetching different JS files
  const results = await page.evaluate(async () => {
    var out = {};
    var files = [
      '04-Src/js/config.js?v=1786236023',
      '04-Src/js/render.js?v=1786236023',
      '04-Src/js/render_bioicons.js?v=1786236023',
      '04-Src/js/render_bioicons.js',
    ];
    for (var i = 0; i < files.length; i++) {
      try {
        var r = await fetch(files[i]);
        var t = await r.text();
        out[files[i]] = { status: r.status, len: t.length, isHTML: t.startsWith('<!DOCTYPE') || t.startsWith('<html'), first50: t.substring(0,50) };
      } catch(e) { out[files[i]] = { error: e.message }; }
    }
    return out;
  });
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
