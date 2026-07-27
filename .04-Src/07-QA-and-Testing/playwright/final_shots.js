
const { test } = require('@playwright/test');

test('Final screenshots', async ({ page }) => {
  page.setDefaultTimeout(30000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
  
  // MENU
  await page.screenshot({ path: 'screenshots/FINAL-01-menu.png' });
  
  // SCREENSAVER
  await page.evaluate(() => { document.getElementById('screensaverBtn').click(); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/FINAL-02-screensaver.png' });
  
  // GAME at zoom 0.4
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/FINAL-03-game.png' });
  
  // DAY
  await page.evaluate(() => { tod = 12; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/FINAL-04-day.png' });
  
  // NIGHT with moon
  await page.evaluate(() => { tod = 1; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/FINAL-05-night.png' });
  
  // SUNSET
  await page.evaluate(() => { tod = 18.5; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/FINAL-06-sunset.png' });
  
  console.log('All final screenshots done!');
});
