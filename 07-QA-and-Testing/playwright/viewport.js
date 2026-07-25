
const { test } = require('@playwright/test');

test('Viewport check', async ({ page }) => {
  page.setDefaultTimeout(15000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  const check = await page.evaluate(() => {
    var vw = cv.width/zoom, vh = cv.height/zoom;
    var vL = cam.x - vw/2, vR = cam.x + vw/2, vT = cam.y - vh/2, vB = cam.y + vh/2;
    var inView = orgs.filter(o => o.alive && o.x >= vL-40 && o.x <= vR+40 && o.y >= vT-40 && o.y <= vB+40);
    return JSON.stringify({
      camX: Math.round(cam.x), camY: Math.round(cam.y),
      zoom: zoom.toFixed(2),
      vw: Math.round(vw), vh: Math.round(vh),
      vL: Math.round(vL), vR: Math.round(vR), vT: Math.round(vT), vB: Math.round(vB),
      totalAlive: orgs.filter(o => o.alive).length,
      inViewport: inView.length,
      sampleOrg: inView[0] ? {
        x: Math.round(inView[0].x), y: Math.round(inView[0].y),
        size: Math.round(inView[0].size),
        color: inView[0].sp.color,
        sizeOnScreen: Math.round(inView[0].size * zoom),
      } : null,
    });
  });
  console.log('VIEWPORT: ' + check);
  console.log('DONE');
});
