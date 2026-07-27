
const { test, expect } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';

test('Tutorial: click Next through all 5 steps', async ({ page }) => {
  await page.goto(GAME_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  
  // Click start
  await page.locator('#startBtn').click();
  await page.waitForTimeout(2000);
  
  // Take screenshot step 1
  await page.screenshot({ path: 'screenshots/tut-step1.png' });
  console.log('Step 1 screenshot taken');
  
  // Get current tutorial counter
  let counter = await page.locator('#tutorialCounter').textContent();
  console.log('COUNTER:', counter);
  
  // Click "Далее" 5 times (5 steps)
  for (let i = 2; i <= 6; i++) {
    const nextBtn = page.locator('#tutNext');
    const isVisible = await nextBtn.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Step ${i-1}: tutNext visible = ${isVisible}`);
    
    if (isVisible) {
      // Use evaluate to click directly (bypass Playwright's visibility checks)
      await page.evaluate(() => {
        var btn = document.getElementById('tutNext');
        if (btn) btn.click();
      });
      await page.waitForTimeout(1000);
      
      // Check counter
      const newCounter = await page.evaluate(() => {
        var el = document.getElementById('tutorialCounter');
        return el ? el.textContent : 'not found';
      });
      console.log(`After click ${i-1}: counter = ${newCounter}`);
      
      await page.screenshot({ path: `screenshots/tut-step${i}.png` });
    } else {
      console.log(`Step ${i-1}: tutorial ended or button not visible`);
      break;
    }
  }
  
  // Final state
  await page.screenshot({ path: 'screenshots/tut-final.png' });
  
  // Check game state
  const gameState = await page.evaluate(() => ({
    state: typeof state !== 'undefined' ? state : 'unknown',
    playerExists: typeof player !== 'undefined' && player !== null,
    orgCount: typeof orgs !== 'undefined' ? orgs.length : 0,
  }));
  console.log('GAME STATE:', JSON.stringify(gameState));
});
