
const { test } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';

test('Death screen: test all buttons', async ({ page }) => {
  await page.goto(GAME_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  await page.locator('#startBtn').click();
  await page.waitForTimeout(2000);
  
  // Skip tutorial
  await page.evaluate(() => { var b = document.getElementById('tutSkip'); if(b) b.click(); });
  await page.waitForTimeout(500);
  
  // Kill player
  await page.evaluate(() => {
    if (typeof player !== 'undefined' && player) {
      player.energy = 0; player.alive = false;
      player.dying = true; player.deathT = 0; player._remove = true;
    }
  });
  await page.waitForTimeout(3000);
  
  // Screenshot death screen
  await page.screenshot({ path: 'screenshots/death-screen-test.png' });
  
  // Check death screen buttons
  const buttons = await page.evaluate(() => {
    var deadO = document.getElementById('deadO');
    if (!deadO) return { visible: false };
    var cs = window.getComputedStyle(deadO);
    var btns = deadO.querySelectorAll('button, [onclick], .btn');
    var btnInfo = [];
    btns.forEach(b => {
      var r = b.getBoundingClientRect();
      btnInfo.push({
        text: b.innerText.trim().substring(0, 30),
        id: b.id,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        visible: r.width > 0 && r.height > 0,
        clickable: b.onclick !== null || b.id
      });
    });
    return {
      visible: cs.display !== 'none',
      display: cs.display,
      buttons: btnInfo
    };
  });
  console.log('DEATH SCREEN:', JSON.stringify(buttons, null, 2));
  
  // Try clicking "ЗАНОВО" (restart)
  const restartBtn = page.locator('#restartBtn, text=ЗАНОВО');
  const restartVisible = await restartBtn.isVisible({ timeout: 2000 }).catch(() => false);
  console.log('RESTART BUTTON VISIBLE:', restartVisible);
  
  if (restartVisible) {
    await restartBtn.first().click({ timeout: 3000 }).catch(e => console.log('RESTART CLICK FAILED:', e.message.substring(0, 100)));
    await page.waitForTimeout(1000);
    
    const state = await page.evaluate(() => typeof state !== 'undefined' ? state : 'unknown');
    console.log('STATE AFTER RESTART:', state);
    await page.screenshot({ path: 'screenshots/death-after-restart.png' });
  }
});
