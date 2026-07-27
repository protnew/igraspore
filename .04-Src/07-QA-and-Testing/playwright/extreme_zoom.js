
const { test } = require('@playwright/test');

test('Extreme zoom cell interior', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  await page.evaluate(() => {
    freeCam = true;
    window.screensaverAutoCam = false;
    window.lastInteractionTime = Date.now() + 999999999;
  });
  
  // Find a LARGE cell, then use extreme zoom
  const target = await page.evaluate(() => {
    var candidates = orgs.filter(o => o.alive && o.size > 15);
    candidates.sort((a,b) => b.size - a.size);
    var t = candidates[0];
    if(!t) return null;
    // Make the cell bigger for better visibility
    t.size = 50;
    return { name: t.sp.name, x: Math.round(t.x), y: Math.round(t.y), organs: t.organs ? t.organs.map(g=>g.t).join(',') : '' };
  });
  console.log('TARGET: ' + JSON.stringify(target));
  
  // Set extreme zoom
  await page.evaluate((pos) => {
    cam.x = pos.x; cam.y = pos.y;
    zoom = 200; tZoom = 200;
    window.screensaverAutoCam = false;
    window.lastInteractionTime = Date.now() + 999999999;
  }, target);
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'screenshots/BIO-EXTREME-z200.png' });
  console.log('DONE');
});
