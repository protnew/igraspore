
const { test } = require('@playwright/test');

test('Camera follow + movement', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Check camera follows player
  const before = await page.evaluate(() => ({
    px: Math.round(player.x), py: Math.round(player.y),
    cx: Math.round(cam.x), cy: Math.round(cam.y),
    dist: Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)),
  }));
  console.log('BEFORE_MOVE: ' + JSON.stringify(before));
  
  // Press D (right) for 1.5 seconds
  await page.keyboard.down('d');
  await page.waitForTimeout(1500);
  await page.keyboard.up('d');
  
  const after = await page.evaluate(() => ({
    px: Math.round(player.x), py: Math.round(player.y),
    cx: Math.round(cam.x), cy: Math.round(cam.y),
    dist: Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)),
    movedPx: Math.round(player.x) - before.px,
  }));
  console.log('AFTER_D: ' + JSON.stringify(after));
  
  // Test render mode toggle
  await page.evaluate(() => document.getElementById('bRender').click());
  await page.waitForTimeout(300);
  const rmode = await page.evaluate(() => settings.renderMode);
  console.log('RENDER_MODE: ' + rmode);
  
  // Test microscope button
  await page.evaluate(() => document.getElementById('bMicro').click());
  await page.waitForTimeout(300);
  const micro = await page.evaluate(() => settings.microscopeMode);
  console.log('MICRO: ' + micro);
  
  await page.screenshot({ path: 'screenshots/FIX-test.png' });
  
  console.log('ERRORS: ' + errors.length);
  console.log('DONE');
});
