
const { test } = require('@playwright/test');

test('Clean realistic screenshot', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  // Set realistic BEFORE starting game
  await page.evaluate(() => { settings.renderMode = 'realistic'; });
  
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Zoom in
  await page.evaluate(() => { tZoom = 8; zoom = 8; });
  await page.waitForTimeout(2000);
  
  // Verify mode
  const mode = await page.evaluate(() => settings.renderMode);
  console.log('MODE=' + mode);
  
  await page.screenshot({ path: 'screenshots/REALISTIC-clean.png' });
  console.log('DONE');
});
