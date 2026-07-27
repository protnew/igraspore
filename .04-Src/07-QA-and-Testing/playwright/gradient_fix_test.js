
const { test } = require('@playwright/test');

test('LIVE gradient crash fix verification', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('https://protnew.github.io/igraspore/?nocache=' + Date.now(), { 
    waitUntil: 'load', timeout: 20000 
  });
  await page.waitForTimeout(3000);
  
  // Start game
  await page.evaluate(() => {
    document.getElementById('startBtn').click();
  });
  await page.waitForTimeout(3000);
  
  // Check state and FPS
  const status = await page.evaluate(() => ({
    state: typeof state !== 'undefined' ? state : 'undef',
    camX: typeof cam !== 'undefined' ? cam.x : 'undef',
    camY: typeof cam !== 'undefined' ? cam.y : 'undef',
    zoom: typeof zoom !== 'undefined' ? zoom : 'undef',
    tod: typeof tod !== 'undefined' ? tod : 'undef',
    dayLight: typeof dayLight !== 'undefined' ? dayLight : 'undef',
  }));
  console.log('STATUS:', JSON.stringify(status));
  
  // Check for 'non-finite' errors specifically
  const gradientErrors = errors.filter(e => e.includes('non-finite') || e.includes('createRadialGradient'));
  if (gradientErrors.length > 0) {
    console.log('❌ GRADIENT ERRORS:', gradientErrors.join('; '));
  } else {
    console.log('✅ NO gradient errors!');
  }
  
  // Try clicking buttons
  await page.evaluate(() => {
    document.getElementById('bDiv').click();
  });
  await page.waitForTimeout(500);
  
  console.log('ALL errors:', errors.length);
  if (errors.length > 0) console.log('Errors:', errors.slice(0,5).join('; '));
  
  await page.screenshot({ path: 'screenshots/CLICK-02-gradient-fix.png' });
  console.log('DONE');
});
