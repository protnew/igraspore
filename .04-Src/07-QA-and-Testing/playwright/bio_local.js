
const { test } = require('@playwright/test');

test('LOCAL biology test', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  // Check init
  const init = await page.evaluate(() => ({
    db: SPECIES_DB.length,
    orgs: orgs.length,
    state: state,
  }));
  console.log('INIT: ' + JSON.stringify(init));
  
  // Start game
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  const game = await page.evaluate(() => ({
    state: state,
    pop: orgs.filter(o => o.alive).length,
  }));
  console.log('GAME: ' + JSON.stringify(game));
  
  if(game.state === 'playing' && game.pop > 0) {
    // Test microscope
    await page.evaluate(() => document.getElementById('bMicro').click());
    await page.waitForTimeout(1000);
    const micro = await page.evaluate(() => ({ mode: settings.microscopeMode, zoom: zoom.toFixed(2) }));
    console.log('MICRO: ' + JSON.stringify(micro));
    await page.screenshot({ path: 'screenshots/BIO-LOCAL-micro.png' });
    
    // Zoom in
    await page.evaluate(() => { tZoom = 20; });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/BIO-LOCAL-zoom.png' });
    
    // Sample organisms
    const sample = await page.evaluate(() => {
      return orgs.filter(o => o.alive).slice(0,3).map(o => ({
        name: o.sp.name.substring(0,20),
        organs: o.organs ? o.organs.length : 0,
        flag: o.sp.bio.flag, cilia: o.sp.bio.cilia,
      }));
    });
    console.log('SAMPLE: ' + JSON.stringify(sample));
  }
  
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
  errors.forEach(e => console.log('  ' + e.substring(0, 200)));
});
