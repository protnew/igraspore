
const { test } = require('@playwright/test');

test('Lighting fix screenshots', async ({ page }) => {
  page.setDefaultTimeout(30000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(3000);
  
  // DAY with sun shafts
  await page.evaluate(() => { tod = 12; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/FINAL-07-day-shafts.png' });
  
  // NIGHT with moon
  await page.evaluate(() => { tod = 1; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/FINAL-08-night-glow.png' });
  
  // Check sun/moon icon
  const todLabel = await page.evaluate(() => {
    var el = document.getElementById('todL');
    return el ? el.textContent : 'not found';
  });
  console.log('TOD label:', todLabel);
  
  console.log('Done!');
});
