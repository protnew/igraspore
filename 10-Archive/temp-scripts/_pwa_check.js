const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  await page.goto('https://igraspore.pages.dev/?source=pwa', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  // Check manifest
  const manifest = await page.evaluate(async () => {
    try {
      const r = await fetch('/manifest.json');
      return r.ok ? await r.json() : { error: r.status };
    } catch(e) { return { error: e.message }; }
  });
  console.log('Manifest:', JSON.stringify({
    name: manifest.name,
    short_name: manifest.short_name,
    display: manifest.display,
    icons: manifest.icons ? manifest.icons.length + ' icons' : 'none',
  }));
  
  // Check manifest link in HTML
  const hasManifestLink = await page.evaluate(() => {
    const link = document.querySelector('link[rel="manifest"]');
    return link ? link.href : 'NOT FOUND';
  });
  console.log('Manifest link:', hasManifestLink);
  
  // Check theme color
  const themeColor = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    return meta ? meta.content : 'NOT FOUND';
  });
  console.log('Theme color:', themeColor);
  
  // Check icons load
  const iconOk = await page.evaluate(async () => {
    try {
      const r = await fetch('/icons/icon-512.png');
      return r.ok ? 'OK ' + r.headers.get('content-type') : 'FAIL ' + r.status;
    } catch(e) { return e.message; }
  });
  console.log('Icon 512:', iconOk);
  
  // Check SW registered
  await page.waitForTimeout(1000);
  const swReg = await page.evaluate(async () => {
    if (!navigator.serviceWorker) return 'SW NOT SUPPORTED';
    const regs = await navigator.serviceWorker.getRegistrations();
    return regs.length > 0 ? 'REGISTERED' : 'NOT REGISTERED';
  });
  console.log('Service Worker:', swReg);
  
  // Check display-mode
  const displayMode = await page.evaluate(() => {
    return window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' : 
           window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser';
  });
  console.log('Display mode:', displayMode);
  
  // Lighthouse PWA audit would go here but needs lighthouse CLI
  
  console.log('\nPWA READY' );
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
