
const { test } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';

test('Natural death by starvation', async ({ page }) => {
  await page.goto(GAME_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  await page.locator('#startBtn').click();
  await page.waitForTimeout(2000);
  
  // Skip tutorial
  await page.evaluate(() => { var b = document.getElementById('tutSkip'); if(b) b.click(); });
  await page.waitForTimeout(500);
  
  // Set speed to 100x to speed up death
  const btn100 = page.locator('text=100x');
  if (await btn100.isVisible({ timeout: 1000 }).catch(() => false)) {
    await btn100.click();
    await page.waitForTimeout(300);
  }
  
  // Drain energy continuously and wait for death
  await page.evaluate(() => {
    if (player) {
      player.energy = 1;
      player.size = 1; // Make player very small
    }
  });
  
  // Wait up to 30 seconds for death
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(500);
    const info = await page.evaluate(() => {
      var deadO = document.getElementById('deadO');
      return {
        state: typeof state !== 'undefined' ? state : 'unknown',
        playerExists: typeof player !== 'undefined' && player !== null,
        playerEnergy: (typeof player !== 'undefined' && player) ? player.energy : -1,
        playerAlive: (typeof player !== 'undefined' && player) ? player.alive : false,
        deadOClass: deadO ? deadO.className : 'no element',
        deadODisplay: deadO ? window.getComputedStyle(deadO).display : 'n/a'
      };
    });
    
    if (i % 5 === 0) console.log(`T+${i*500}ms:`, JSON.stringify(info));
    
    if (info.deadODisplay === 'flex') {
      console.log('DEATH SCREEN VISIBLE!');
      await page.screenshot({ path: 'screenshots/death-natural.png' });
      
      // Check buttons
      const btns = await page.evaluate(() => {
        var deadO = document.getElementById('deadO');
        var btns = deadO.querySelectorAll('button');
        return Array.from(btns).map(b => ({
          text: b.innerText.trim(),
          id: b.id,
          rect: b.getBoundingClientRect()
        }));
      });
      console.log('DEATH BUTTONS:', JSON.stringify(btns));
      return;
    }
    
    if (info.state === 'dead' && info.deadODisplay !== 'flex') {
      console.log('STATE=dead but deadO NOT visible! BUG!');
      await page.screenshot({ path: 'screenshots/death-bug.png' });
      return;
    }
  }
  
  console.log('TIMEOUT: player did not die in 30 seconds');
  await page.screenshot({ path: 'screenshots/death-timeout.png' });
});
