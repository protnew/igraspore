
const { test } = require('@playwright/test');
test('Simple load', async ({ page }) => {
  await page.goto('https://protnew.github.io/igraspore/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  
  const info = await page.evaluate(() => ({
    title: document.title,
    canvasExists: !!document.getElementById('c'),
    canvasVis: document.getElementById('c') ? document.getElementById('c').offsetParent !== null : false,
    startBtn: !!document.getElementById('startBtn'),
    startBtnVis: document.getElementById('startBtn') ? document.getElementById('startBtn').offsetParent !== null : false,
    speciesDefined: typeof SPECIES_DB !== 'undefined',
    scripts: document.querySelectorAll('script').length,
    bodyLen: document.body.innerHTML.length
  }));
  console.log('INFO:', JSON.stringify(info));
  await page.screenshot({ path: 'screenshots/CMP-simple-load.png' });
});
