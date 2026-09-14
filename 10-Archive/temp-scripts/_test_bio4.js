const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  
  // Capture ALL console output
  page.on('console', msg => console.log('[console.' + msg.type() + ']', msg.text().substring(0,300)));
  page.on('pageerror', err => console.log('[pageerror]', err.message.substring(0,300)));
  
  // Capture network requests for bioicons
  page.on('response', resp => {
    if (resp.url().includes('bioicons')) {
      console.log('[response]', resp.status(), resp.url());
    }
  });
  
  await page.goto('https://igraspore.pages.dev?v=bi4' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  
  // Check: was the script executed?
  const result = await page.evaluate(() => {
    // Check multiple possible global names
    return {
      loadBioicons: typeof window.loadBioicons,
      drawBioicon: typeof window.drawBioicon,
      bioiconsReady: typeof window.bioiconsReady,
      // Check if the IIFE ran by testing for any of its side effects
      _bioTest: typeof window._bioTest,
    };
  });
  console.log('Result:', JSON.stringify(result));
  
  // Try to directly eval the script
  const resp = await page.evaluate(async () => {
    try {
      const r = await fetch('04-Src/js/render_bioicons.js?v=1786236023');
      const t = await r.text();
      if (t.startsWith('<!DOCTYPE')) return { error: 'got HTML, not JS', len: t.length };
      // Try to eval it
      eval(t);
      return { 
        status: r.status, 
        len: t.length,
        loadBioicons: typeof window.loadBioicons,
      };
    } catch(e) { return { error: e.message }; }
  });
  console.log('Direct eval:', JSON.stringify(resp));
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
