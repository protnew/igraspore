
const { test } = require('@playwright/test');

test('F8-F10 + summary', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  await page.goto('https://protnew.github.io/igraspore/?nocache=' + Date.now(), { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  // Start game
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // F8: Minimap
  const minimapData = await page.evaluate(() => {
    const mm = document.getElementById('mm');
    if (!mm) return { exists: false };
    return { exists: true, width: mm.width, height: mm.height, visible: mm.style.display !== 'none' };
  });
  console.log('F8_MINIMAP: ' + JSON.stringify(minimapData));
  await page.screenshot({ path: 'screenshots/FUNC-08-minimap.png' });
  
  // F9: Population dynamics
  const pop1 = await page.evaluate(() => orgs.filter(o => o.alive).length);
  const species1 = await page.evaluate(() => {
    const s = new Set(); orgs.forEach(o => { if (o.alive) s.add(o.sp.name); }); return s.size;
  });
  await page.waitForTimeout(3000);
  const pop2 = await page.evaluate(() => orgs.filter(o => o.alive).length);
  const species2 = await page.evaluate(() => {
    const s = new Set(); orgs.forEach(o => { if (o.alive) s.add(o.sp.name); }); return s.size;
  });
  console.log('F9_POPULATION: pop=' + pop1 + '→' + pop2 + ' species=' + species1 + '→' + species2);
  await page.screenshot({ path: 'screenshots/FUNC-09-population.png' });
  
  // F10: Free camera
  await page.evaluate(() => { if(typeof freeCam!=='undefined' && !freeCam) document.getElementById('bFree')?.click(); });
  await page.waitForTimeout(500);
  const freeCamState = await page.evaluate(() => ({ freeCam, camX: Math.round(cam.x), camY: Math.round(cam.y) }));
  await page.keyboard.press('KeyW');
  await page.waitForTimeout(200);
  await page.keyboard.press('KeyA');
  await page.waitForTimeout(200);
  const freeCamAfter = await page.evaluate(() => ({ camX: Math.round(cam.x), camY: Math.round(cam.y) }));
  const camMoved = freeCamState.camX !== freeCamAfter.camX || freeCamState.camY !== freeCamAfter.camY;
  console.log('F10_FREECAM: enabled=' + freeCamState.freeCam + ' camMoved=' + camMoved);
  await page.screenshot({ path: 'screenshots/FUNC-10-freecam.png' });
  
  // FPS
  const fps = await page.evaluate(() => {
    return new Promise(resolve => {
      var count = 0, start = performance.now();
      function loop() {
        count++;
        if (performance.now() - start < 2000) requestAnimationFrame(loop);
        else resolve(Math.round(count / 2));
      }
      requestAnimationFrame(loop);
    });
  });
  console.log('FPS: ' + fps);
  console.log('ERRORS: ' + errors.length);
  errors.slice(0,5).forEach(e => console.log('  ERR: ' + e));
  console.log('ALL_DONE');
});
