
const { test } = require('@playwright/test');

test('Final visual', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // zoom=1
  await page.evaluate(() => { tZoom = 1; zoom = 1; });
  await page.waitForTimeout(1000);
  
  // CARTOON
  await page.screenshot({ path: 'screenshots/PHOTO-cartoon.png' });
  console.log('CARTOON_OK');
  
  // REALISTIC at z=1
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/PHOTO-realistic-z1.png' });
  console.log('REALISTIC_Z1');
  
  // REALISTIC at z=3
  await page.evaluate(() => { tZoom = 3; zoom = 3; });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/PHOTO-realistic-z3.png' });
  console.log('REALISTIC_Z3');
  
  // REALISTIC at z=8 (close-up)
  await page.evaluate(() => { tZoom = 8; zoom = 8; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/PHOTO-realistic-z8.png' });
  console.log('REALISTIC_Z8');
  
  console.log('ERRORS: ' + errors.length);
  console.log('DONE');
});
