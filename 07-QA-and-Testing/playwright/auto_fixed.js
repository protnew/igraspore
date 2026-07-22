
const { test } = require('@playwright/test');

test('Autopilot fixed test', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Enable autopilot
  await page.evaluate(() => { autoAI = true; });
  await page.waitForTimeout(500);
  
  const before = await page.evaluate(() => ({
    state: player ? player.state : 'null',
    energy: player ? Math.round(player.energy) : 0,
    x: player ? Math.round(player.x) : 0,
    vx: player ? player.vx.toFixed(3) : '0',
  }));
  console.log('BEFORE: ' + JSON.stringify(before));
  
  // Run 8 seconds
  await page.waitForTimeout(8000);
  
  const after = await page.evaluate(() => ({
    autoAI: autoAI,
    state: player ? player.state : 'null',
    energy: player ? Math.round(player.energy) : 0,
    eaten: player ? player.eaten : 0,
    x: player ? Math.round(player.x) : 0,
    y: player ? Math.round(player.y) : 0,
    vx: player ? player.vx.toFixed(3) : '0',
    vy: player ? player.vy.toFixed(3) : '0',
    moved: player ? Math.abs(player.x - before.x) : 0,
    camDist: player ? Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)) : 9999,
    alive: orgs.filter(o => o.alive).length,
  }));
  console.log('AFTER_8S: ' + JSON.stringify(after));
  
  await page.screenshot({ path: 'screenshots/AUTO-fixed.png' });
  
  // Success criteria
  console.log('PLAYER_MOVING: ' + (after.moved > 5));
  console.log('PLAYER_HUNTING: ' + (after.state === 'hunt'));
  console.log('CAMERA_OK: ' + (after.camDist < 50));
  console.log('DONE');
});
