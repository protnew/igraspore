
const { test } = require('@playwright/test');

test('LIVE — global gradient guard verification', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('https://protnew.github.io/igraspore/?nocache=' + Date.now(), { 
    waitUntil: 'load', timeout: 25000 
  });
  await page.waitForTimeout(3000);
  
  // Check monkey-patch loaded
  const patched = await page.evaluate(() => {
    const orig = ctx.createRadialGradient.toString();
    return orig.includes('isFinite');
  });
  console.log('Monkey-patch loaded:', patched);
  
  // Click START
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(3000);
  
  // Let the game run for several seconds
  await page.waitForTimeout(5000);
  
  const gradientErrors = errors.filter(e => 
    e.includes('non-finite') || 
    e.includes('createRadialGradient') || 
    e.includes('createLinearGradient')
  );
  
  console.log('Gradient errors:', gradientErrors.length);
  console.log('ALL errors:', errors.length);
  
  // Check game state
  const status = await page.evaluate(() => ({
    state: typeof state !== 'undefined' ? state : 'undef',
    fps: typeof lastFps !== 'undefined' ? lastFps : 'N/A',
  }));
  console.log('Status:', JSON.stringify(status));
  
  // Try clicking buttons
  const bEat = await page.$('#bEat');
  if (bEat) {
    const box = await bEat.boundingBox();
    console.log('bEat:', JSON.stringify(box));
    await page.mouse.click(box.x + box.width/2, box.y + box.height/2);
    console.log('bEat clicked');
  }
  
  await page.screenshot({ path: 'screenshots/CLICK-03-global-guard.png' });
  console.log('DONE');
});
