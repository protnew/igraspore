
const { test } = require('@playwright/test');

test('Biology + Microscope full test', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  await page.goto('https://protnew.github.io/igraspore/?nocache=' + Date.now(), { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  const initState = await page.evaluate(() => ({
    SPECIES_DB: typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.length : 'undef',
    orgsCount: typeof orgs !== 'undefined' ? orgs.length : 'undef',
  }));
  console.log('INIT: ' + JSON.stringify(initState));
  
  // Start game
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  const gameState = await page.evaluate(() => ({
    state: typeof state !== 'undefined' ? state : 'undef',
    popCount: orgs.filter(o => o.alive).length,
    microBtn: !!document.getElementById('bMicro'),
  }));
  console.log('GAME: ' + JSON.stringify(gameState));
  
  // Enable microscope mode
  await page.evaluate(() => document.getElementById('bMicro').click());
  await page.waitForTimeout(2000);
  
  const microState = await page.evaluate(() => ({
    microscopeMode: settings.microscopeMode,
    zoom: zoom.toFixed(2),
    tZoom: tZoom.toFixed(2),
  }));
  console.log('MICRO: ' + JSON.stringify(microState));
  
  await page.screenshot({ path: 'screenshots/BIO-microscope-on.png' });
  
  // Zoom in to see cell biology
  await page.evaluate(() => { tZoom = 20; });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/BIO-cell-zoom.png' });
  
  // Check organism biology
  const orgData = await page.evaluate(() => {
    var sample = orgs.filter(o => o.alive).slice(0, 3).map(o => ({
      name: o.sp.name.substring(0, 25),
      hasFlag: o.sp.bio && o.sp.bio.flag,
      hasCilia: o.sp.bio && o.sp.bio.cilia,
      hasNucleus: o.sp.bio && o.sp.bio.nucleus,
      hasChloro: o.sp.bio && o.sp.bio.chloro,
      hasMito: o.sp.bio && o.sp.bio.mito,
      hasStomach: o.stomach && o.stomach.length > 0,
      organs: o.organs ? o.organs.length : 0,
    }));
    return { totalAlive: orgs.filter(o => o.alive).length, sample };
  });
  console.log('BIO_DATA: ' + JSON.stringify(orgData));
  
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
  
  // Errors
  console.log('ERRORS: ' + errors.length);
  errors.slice(0,3).forEach(e => console.log('  ' + e.substring(0,150)));
  
  console.log('DONE');
});
