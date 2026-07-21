
const { test } = require('@playwright/test');

test('Camera + movement + buttons', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  const before = await page.evaluate(() => Math.round(player.x));
  
  // Press D for 1.5 seconds
  await page.keyboard.down('d');
  await page.waitForTimeout(1500);
  await page.keyboard.up('d');
  
  const after = await page.evaluate(() => ({
    px: Math.round(player.x),
    cx: Math.round(cam.x),
    camDist: Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)),
  }));
  console.log('BEFORE_X=' + before + ' AFTER=' + JSON.stringify(after));
  console.log('PLAYER_MOVED=' + (after.px - before) + 'px');
  console.log('CAMERA_DIST=' + after.camDist + 'px');
  
  // Toggle render mode
  await page.evaluate(() => document.getElementById('bRender').click());
  await page.waitForTimeout(300);
  const rmode = await page.evaluate(() => settings.renderMode);
  console.log('RENDER_MODE=' + rmode);
  
  // Microscope
  await page.evaluate(() => document.getElementById('bMicro').click());
  await page.waitForTimeout(300);
  console.log('MICRO=' + await page.evaluate(() => settings.microscopeMode));
  
  await page.screenshot({ path: 'screenshots/FIX-camera-follow.png' });
  console.log('DONE');
});
