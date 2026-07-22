
const { test } = require('@playwright/test');

test('Autopilot check', async ({ page }) => {
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Check player before autopilot
  const before = await page.evaluate(() => {
    return JSON.stringify({
      state: player.state,
      energy: Math.round(player.energy),
      x: Math.round(player.x),
    });
  });
  console.log('BEFORE: ' + before);
  
  // Enable autopilot via Tab
  await page.keyboard.press('Tab');
  await page.waitForTimeout(5000);
  
  const after = await page.evaluate(() => {
    return JSON.stringify({
      autoAI: autoAI,
      state: player ? player.state : 'dead',
      energy: player ? Math.round(player.energy) : 0,
      eaten: player ? player.eaten : 0,
      vx: player ? player.vx.toFixed(3) : '0',
      alive: orgs.filter(o => o.alive).length,
    });
  });
  console.log('AFTER_5S: ' + after);
  console.log('ERRORS: ' + errors.length);
  if (errors.length > 0) console.log('ERR: ' + errors[0].substring(0, 200));
  console.log('DONE');
});
