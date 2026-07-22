
const { test } = require('@playwright/test');

test('Autopilot behavior test', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Enable autopilot
  await page.evaluate(() => { autoAI = true; });
  await page.waitForTimeout(500);
  
  const autoState = await page.evaluate(() => ({
    autoAI: autoAI,
    playerAlive: player ? player.alive : false,
    playerState: player ? player.state : 'null',
    playerEnergy: player ? Math.round(player.energy) : 0,
    playerEaten: player ? player.eaten : 0,
  }));
  console.log('AUTO_ON: ' + JSON.stringify(autoState));
  
  // Let autopilot run for 5 seconds
  await page.waitForTimeout(5000);
  
  const after5s = await page.evaluate(() => ({
    autoAI: autoAI,
    playerAlive: player ? player.alive : false,
    playerState: player ? player.state : 'null',
    playerEnergy: player ? Math.round(player.energy) : 0,
    playerEaten: player ? player.eaten : 0,
    playerX: player ? Math.round(player.x) : 0,
    playerY: player ? Math.round(player.y) : 0,
    playerVx: player ? player.vx.toFixed(3) : '0',
    playerVy: player ? player.vy.toFixed(3) : '0',
    camDist: player ? Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)) : 9999,
  }));
  console.log('AFTER_5S: ' + JSON.stringify(after5s));
  
  // Take screenshot
  await page.screenshot({ path: 'screenshots/AUTO-test.png' });
  
  // Check if camera follows player during autopilot
  const camFollow = after5s.camDist < 50;
  console.log('CAMERA_FOLLOWS: ' + camFollow);
  
  // Check if player is doing something (not idle)
  console.log('PLAYER_ACTIVE: ' + (after5s.playerState !== 'idle'));
  
  console.log('ERRORS: ' + errors.length);
  errors.forEach(e => console.log('  ' + e.substring(0, 150)));
  console.log('DONE');
});
