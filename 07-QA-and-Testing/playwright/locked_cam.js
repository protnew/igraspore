
const { test } = require('@playwright/test');

test('Locked camera cell detail', async ({ page }) => {
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
  
  const target = await page.evaluate(() => {
    var candidates = orgs.filter(o => o.alive && o.size > 15);
    candidates.sort((a,b) => b.size - a.size);
    var t = candidates[0];
    if(!t) return null;
    return { name: t.sp.name, size: Math.round(t.size*10)/10, x: Math.round(t.x), y: Math.round(t.y), organs: t.organs ? t.organs.length : 0 };
  });
  console.log('TARGET: ' + JSON.stringify(target));
  
  // Set camera — use single argument object
  for(let i = 0; i < 5; i++) {
    await page.evaluate((pos) => {
      cam.x = pos.x; cam.y = pos.y;
      zoom = 50; tZoom = 50;
      window.screensaverAutoCam = false;
      window.lastInteractionTime = Date.now() + 999999999;
    }, target);
    await page.waitForTimeout(200);
  }
  
  await page.waitForTimeout(2000);
  
  const camCheck = await page.evaluate(() => ({
    camX: Math.round(cam.x), camY: Math.round(cam.y), zoom: zoom.toFixed(1)
  }));
  console.log('CAM: ' + JSON.stringify(camCheck));
  
  await page.screenshot({ path: 'screenshots/BIO-LOCKED-z50.png' });
  console.log('DONE');
});
