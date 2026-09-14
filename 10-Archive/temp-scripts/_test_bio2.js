const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  
  page.on('console', msg => {
    console.log('[console]', msg.type(), msg.text().substring(0, 200));
  });
  
  await page.goto('https://igraspore.pages.dev?v=bi2' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  
  // Check what globals are available
  const globals = await page.evaluate(() => {
    return {
      loadBioicons: typeof window.loadBioicons,
      drawBioicon: typeof window.drawBioicon,
      drawVirusBioicon: typeof window.drawVirusBioicon,
      bioiconsReady: typeof window.bioiconsReady,
      settings: typeof settings,
      ctx: typeof ctx,
    };
  });
  console.log('Globals:', JSON.stringify(globals));
  
  // Check if render_bioicons.js was loaded
  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script')).map(function(s){return s.src}).filter(function(s){return s.indexOf('bioicons')>=0});
  });
  console.log('Bioicons scripts:', JSON.stringify(scripts));
  
  // Try to fetch the script directly
  const resp = await page.evaluate(async () => {
    try {
      const r = await fetch('04-Src/js/render_bioicons.js');
      const t = await r.text();
      return { status: r.status, length: t.length, first100: t.substring(0, 100) };
    } catch(e) { return { error: e.message }; }
  });
  console.log('Direct fetch:', JSON.stringify(resp));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
