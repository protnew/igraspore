
const { test } = require('@playwright/test');

test('Final comparison both modes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Set zoom to 1 for wide view
  await page.evaluate(() => { tZoom = 1; zoom = 1; });
  await page.waitForTimeout(1000);
  
  // CARTOON
  await page.screenshot({ path: 'screenshots/DONE-cartoon.png' });
  const cartoonStats = await page.evaluate(() => JSON.stringify({
    mode: settings.renderMode, alive: orgs.filter(o=>o.alive).length,
    fc: fc, gt: Math.round(gt), zoom: zoom.toFixed(1)
  }));
  console.log('CARTOON: ' + cartoonStats);
  
  // REALISTIC
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/DONE-realistic.png' });
  const realisticStats = await page.evaluate(() => JSON.stringify({
    mode: settings.renderMode, fc: fc
  }));
  console.log('REALISTIC: ' + realisticStats);
  
  // Camera toggle test
  await page.evaluate(() => toggleRenderModeLarge()); // back to cartoon
  await page.waitForTimeout(500);
  
  // Test V key (detach camera)
  await page.keyboard.press('v');
  await page.waitForTimeout(500);
  const detached = await page.evaluate(() => JSON.stringify({ freeCam: freeCam }));
  console.log('DETACHED: ' + detached);
  
  // Test V key again (reattach)
  await page.keyboard.press('v');
  await page.waitForTimeout(500);
  const attached = await page.evaluate(() => JSON.stringify({ 
    freeCam: freeCam,
    camDist: player ? Math.round(Math.sqrt((player.x-cam.x)**2+(player.y-cam.y)**2)) : 999
  }));
  console.log('ATTACHED: ' + attached);
  
  console.log('ERRORS: ' + errors.length);
  console.log('DONE');
});
