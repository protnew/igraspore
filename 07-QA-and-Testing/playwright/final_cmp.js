
const { test } = require('@playwright/test');

test('Final comparison', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Zoom in
  await page.evaluate(() => { tZoom = 6; zoom = 6; });
  await page.waitForTimeout(1000);
  
  // CARTOON screenshot
  await page.screenshot({ path: 'screenshots/FINAL-cartoon.png' });
  console.log('CARTOON_OK');
  
  // Switch to realistic
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(1000);
  
  // REALISTIC screenshot
  await page.screenshot({ path: 'screenshots/FINAL-realistic.png' });
  console.log('REALISTIC_OK');
  
  // Verify mode
  const mode = await page.evaluate(() => settings.renderMode);
  console.log('MODE=' + mode);
  console.log('DONE');
});
