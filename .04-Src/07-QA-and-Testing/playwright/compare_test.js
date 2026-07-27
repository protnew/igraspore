
const { test } = require('@playwright/test');

test('Realistic vs Cartoon comparison', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Zoom in a bit
  await page.evaluate(() => { tZoom = 8; zoom = 8; });
  await page.waitForTimeout(1000);
  
  // CARTOON screenshot
  await page.evaluate(() => {
    if(settings.renderMode !== 'cartoon') toggleRenderModeLarge();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/COMPARE-cartoon.png' });
  console.log('CARTOON_DONE');
  
  // REALISTIC screenshot
  await page.evaluate(() => { toggleRenderModeLarge(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/COMPARE-realistic.png' });
  console.log('REALISTIC_DONE');
  
  // Check differences
  const diff = await page.evaluate(() => ({
    mode: settings.renderMode,
    renderBtnText: document.getElementById('renderModeBtn') ? document.getElementById('renderModeBtn').textContent.trim() : 'none',
    renderBtnClass: document.getElementById('renderModeBtn') ? document.getElementById('renderModeBtn').className : 'none',
  }));
  console.log('MODE: ' + JSON.stringify(diff));
  console.log('DONE');
});
