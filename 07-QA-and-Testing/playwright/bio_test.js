
const { test } = require('@playwright/test');

test('Biology + Microscope test', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  await page.goto('https://protnew.github.io/igraspore/?nocache=' + Date.now(), { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  // Start game
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Check microscope button exists
  const microBtn = await page.evaluate(() => ({
    exists: !!document.getElementById('bMicro'),
    settingsMode: typeof settings !== 'undefined' ? settings.microscopeMode : 'undef'
  }));
  console.log('MICRO_BTN: ' + JSON.stringify(microBtn));
  
  // Enable microscope mode
  await page.evaluate(() => document.getElementById('bMicro').click());
  await page.waitForTimeout(1000);
  
  const microState = await page.evaluate(() => ({
    microscopeMode: settings.microscopeMode,
    tZoom: typeof tZoom !== 'undefined' ? tZoom : 'undef',
    zoom: typeof zoom !== 'undefined' ? zoom.toFixed(2) : 'undef',
  }));
  console.log('MICRO_STATE: ' + JSON.stringify(microState));
  
  await page.screenshot({ path: 'screenshots/BIO-microscope-on.png' });
  
  // Check render mode toggle
  await page.evaluate(() => document.getElementById('setBtn2').click());
  await page.waitForTimeout(500);
  const settingsPanel = await page.evaluate(() => ({
    renderModeToggle: !!document.getElementById('rmodeTg'),
    currentMode: settings.renderMode,
  }));
  console.log('SETTINGS: ' + JSON.stringify(settingsPanel));
  await page.screenshot({ path: 'screenshots/BIO-settings.png' });
  await page.evaluate(() => document.getElementById('setClose').click());
  await page.waitForTimeout(300);
  
  // Zoom in to see cell details
  await page.evaluate(() => { tZoom = 15; });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/BIO-cell-detail.png' });
  
  // Check organism properties
  const orgData = await page.evaluate(() => {
    var sample = orgs.filter(o => o.alive).slice(0, 5).map(o => ({
      name: o.sp.name.substring(0, 20),
      size: Math.round(o.size * 10) / 10,
      energy: Math.round(o.energy),
      age: Math.round(o.age),
      hasFlagella: o.sp.bio && o.sp.bio.flag,
      hasCilia: o.sp.bio && o.sp.bio.cilia,
      hasNucleus: o.sp.bio && o.sp.bio.nucleus,
      hasChloro: o.sp.bio && o.sp.bio.chloro,
      shape: o.sp.shape,
    }));
    return { count: orgs.filter(o => o.alive).length, sample: sample };
  });
  console.log('ORG_DATA: ' + JSON.stringify(orgData));
  
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
  
  // Check for errors
  const gradientErrors = errors.filter(e => e.includes('non-finite') || e.includes('Gradient'));
  console.log('GRADIENT_ERRORS: ' + gradientErrors.length);
  console.log('ALL_ERRORS: ' + errors.length);
  if (errors.length > 0) console.log('ERRORS: ' + errors.slice(0, 3).join('; '));
  
  console.log('DONE');
});
