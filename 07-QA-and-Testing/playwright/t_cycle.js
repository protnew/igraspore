
const { test } = require('@playwright/test');
test('Day/night cycle', async ({ page }) => {
  await page.goto('https://protnew.github.io/igraspore/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.locator('#startBtn').click();
  await page.waitForTimeout(2000);
  
  // Skip tutorial
  await page.evaluate(() => { var b = document.getElementById('tutSkip'); if(b) b.click(); });
  await page.waitForTimeout(500);
  
  // Set 100x speed
  await page.locator('text=100x').first().click().catch(() => {});
  await page.waitForTimeout(300);
  
  // Sample 12 times over 36 seconds
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(3000);
    const light = await page.evaluate(() => ({
      dp: dayProg.toFixed(3), dl: dayLight.toFixed(3),
      days: totalDays, night: dayLight < 0.3,
      fps: fps, orgs: orgs.length
    }));
    console.log(`C${i}:`, JSON.stringify(light));
    if ([1, 3, 5, 7, 9].includes(i))
      await page.screenshot({ path: `screenshots/CMP-cycle-${i}.png` });
  }
});
