const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('console', m => console.log('[console.'+m.type()+']', m.text().substring(0,300)));
  page.on('pageerror', e => console.log('[pageerror]', e.message.substring(0,300)));

  await page.goto('https://igraspore.pages.dev?v=bioaudit' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  // Check if drawBioicon exists and what it does
  const check = await page.evaluate(() => {
    return {
      drawBioicon: typeof window.drawBioicon,
      bioiconsReady: typeof window.bioiconsReady,
      bioiconsReadyResult: typeof window.bioiconsReady === 'function' ? window.bioiconsReady() : 'N/A',
      renderMode: settings.renderMode,
    };
  });
  console.log('Bioicons check:', JSON.stringify(check));

  // Start game
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy';
    startGame();
  });
  await page.waitForTimeout(2000);

  // Switch to bioicons
  await page.evaluate(() => {
    settings.renderMode = 'bioicons';
    applyRenderMode();
  });
  await page.waitForTimeout(500);

  // Check again
  const check2 = await page.evaluate(() => ({
    drawBioicon: typeof window.drawBioicon,
    bioiconsReady: typeof window.bioiconsReady === 'function' ? window.bioiconsReady() : 'N/A',
    renderMode: settings.renderMode,
  }));
  console.log('After switch:', JSON.stringify(check2));

  // Zoom in and take a high-detail screenshot
  await page.evaluate(() => {
    zoom = 3.0; // zoom in to see details
    tZoom = 3.0;
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => { for(var i=0;i<30;i++) updateWorld(1/30); });
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/AUDIT-BIO-ZOOM.png' });

  // Also zoom in on cartoon
  await page.evaluate(() => {
    settings.renderMode = 'cartoon';
    applyRenderMode();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/AUDIT-CARTOON-ZOOM.png' });

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
