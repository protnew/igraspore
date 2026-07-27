
const { test } = require('@playwright/test');
test('Screensaver', async ({ page }) => {
  await page.goto('https://protnew.github.io/igraspore/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.locator('#screensaverBtn').click();
  await page.waitForTimeout(2000);
  
  const info = await page.evaluate(() => ({ state: state, orgCount: orgs.length, fps: fps }));
  console.log('SS STATE:', JSON.stringify(info));
  
  // Take screenshot with timeout
  try {
    await page.screenshot({ path: 'screenshots/CMP-02-screensaver.png', timeout: 10000 });
    console.log('SS SCREENSHOT OK');
  } catch(e) {
    console.log('SS SCREENSHOT FAIL:', e.message.substring(0, 100));
    // Try again
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/CMP-02-screensaver.png' });
    console.log('SS SCREENSHOT RETRY OK');
  }
});
