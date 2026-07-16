
const { test } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';

test('Death screen deep debug', async ({ page }) => {
  await page.goto(GAME_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  await page.locator('#startBtn').click();
  await page.waitForTimeout(2000);
  
  // Skip tutorial
  await page.evaluate(() => { var b = document.getElementById('tutSkip'); if(b) b.click(); });
  await page.waitForTimeout(500);
  
  // Check initial state
  const before = await page.evaluate(() => ({
    state: state, playerAlive: player ? player.alive : 'no player',
    orgCount: orgs.length, deadOClass: document.getElementById('deadO').className
  }));
  console.log('BEFORE:', JSON.stringify(before));
  
  // Kill player properly — set energy to 0, let the game handle it
  await page.evaluate(() => {
    if (player) {
      player.energy = 0;
      // Don't set alive=false directly — let the biology system handle it
    }
  });
  
  // Wait and check every 500ms
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(500);
    const state_info = await page.evaluate(() => ({
      state: state,
      playerAlive: player ? player.alive : 'null',
      playerDying: player ? player.dying : 'null',
      playerRemove: player ? player._remove : 'null',
      orgCount: orgs.length,
      deadOClass: document.getElementById('deadO') ? document.getElementById('deadO').className : 'no element',
      deadODisplay: document.getElementById('deadO') ? window.getComputedStyle(document.getElementById('deadO')).display : 'n/a'
    }));
    console.log(`T+${(i+1)*500}ms:`, JSON.stringify(state_info));
    
    if (state_info.state === 'dead' || state_info.state === 'gameover') {
      console.log('DEATH TRIGGERED!');
      await page.screenshot({ path: 'screenshots/death-debug.png' });
      break;
    }
  }
});
