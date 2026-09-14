const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://igraspore.pages.dev', { waitUntil: 'domcontentloaded' });
  
  // Fetch the ACTUAL served file
  const result = await page.evaluate(async () => {
    var r = await fetch('04-Src/js/render_bio_v2.js?v=' + Date.now());
    var t = await r.text();
    return {
      status: r.status,
      len: t.length,
      isHTML: t.startsWith('<!DOCTYPE'),
      hasBioReady: t.indexOf('bioReady') >= 0,
      first100: t.substring(0, 100),
    };
  });
  console.log(JSON.stringify(result, null, 2));
  
  // Also check if IIFE runs
  const iife = await page.evaluate(() => {
    return {
      loadBioicons: typeof window.loadBioicons,
      bioiconsReady: typeof window.bioiconsReady,
      drawBioicon: typeof window.drawBioicon,
    };
  });
  console.log('Globals:', JSON.stringify(iife));
  
  // If the functions exist, try calling bioiconsReady
  if (iife.bioiconsReady === 'function') {
    const result2 = await page.evaluate(() => {
      try { return { val: window.bioiconsReady(), error: null }; }
      catch(e) { return { val: null, error: e.message }; }
    });
    console.log('bioiconsReady():', JSON.stringify(result2));
  }
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
