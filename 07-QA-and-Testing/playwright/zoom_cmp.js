
const { test } = require('@playwright/test');

test('Zoom comparison screenshots', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Set zoom to 1 (see many organisms)
  await page.evaluate(() => { tZoom = 1; zoom = 1; });
  await page.waitForTimeout(1000);
  
  // CARTOON at zoom=1
  await page.screenshot({ path: 'screenshots/CMP-cartoon-z1.png' });
  console.log('CARTOON_Z1');
  
  // Switch to realistic
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/CMP-realistic-z1.png' });
  console.log('REALISTIC_Z1');
  
  // Zoom in to 5
  await page.evaluate(() => { tZoom = 5; zoom = 5; });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/CMP-realistic-z5.png' });
  console.log('REALISTIC_Z5');
  
  // Back to cartoon at z5
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/CMP-cartoon-z5.png' });
  console.log('CARTOON_Z5');
  
  console.log('DONE');
});
