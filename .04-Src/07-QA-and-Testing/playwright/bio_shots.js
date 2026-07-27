
const { test } = require('@playwright/test');

test('Bioluminescence test', async ({ page }) => {
  page.setDefaultTimeout(30000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(3000);
  
  // DAY with sun shafts
  await page.evaluate(() => { tod = 12; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/FINAL-09-day-v2.png' });
  
  // NIGHT with bioluminescence
  await page.evaluate(() => { tod = 1; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/FINAL-10-night-bio.png' });
  
  // SUNSET
  await page.evaluate(() => { tod = 19; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/FINAL-11-sunset-v2.png' });
  
  console.log('Done!');
});
