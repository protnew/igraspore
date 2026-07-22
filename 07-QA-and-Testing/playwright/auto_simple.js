
const { test } = require('@playwright/test');

test('Autopilot simple', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  await page.evaluate(() => { autoAI = true; });
  await page.waitForTimeout(8000);
  
  const result = await page.evaluate(() => {
    return JSON.stringify({
      autoAI: autoAI,
      state: player ? player.state : 'null',
      energy: player ? Math.round(player.energy) : 0,
      eaten: player ? player.eaten : 0,
      vx: player ? player.vx.toFixed(3) : '0',
      alive: orgs.filter(o => o.alive).length,
      dead: orgs.filter(o => !o.alive).length,
    });
  });
  console.log('RESULT: ' + result);
  console.log('DONE');
});
