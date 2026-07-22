
const { test } = require('@playwright/test');

test('Autopilot fixed', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  const startX = await page.evaluate(() => Math.round(player.x));
  
  await page.evaluate(() => { autoAI = true; });
  await page.waitForTimeout(8000);
  
  const after = await page.evaluate((sx) => {
    return {
      autoAI: autoAI,
      state: player ? player.state : 'null',
      energy: player ? Math.round(player.energy) : 0,
      eaten: player ? player.eaten : 0,
      x: player ? Math.round(player.x) : 0,
      vx: player ? player.vx.toFixed(3) : '0',
      moved: player ? Math.abs(Math.round(player.x) - sx) : 0,
      camDist: player ? Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)) : 9999,
      alive: orgs.filter(o => o.alive).length,
    };
  }, startX);
  
  console.log('RESULT: ' + JSON.stringify(after));
  console.log('DONE');
});
