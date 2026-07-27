
const { test } = require('@playwright/test');

test('All fixes verification', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Check damage indicators gone
  const hasDmg = await page.evaluate(() => typeof window.dmgIndicators !== 'undefined');
  console.log('DMG_INDICATORS: ' + (hasDmg ? 'STILL EXISTS' : 'REMOVED'));
  
  // Check division shrink
  await page.evaluate(() => { tZoom = 5; zoom = 5; timeScale = 5; });
  await page.waitForTimeout(3000);
  const divCheck = await page.evaluate(() => {
    var dividing = orgs.filter(o => o.dividing);
    var sample = dividing[0];
    return JSON.stringify({
      dividingCount: dividing.length,
      hasPreDivSize: sample ? !!sample.preDivSize : false,
      sizeRatio: sample && sample.preDivSize ? (sample.size / sample.preDivSize).toFixed(3) : 'none',
    });
  });
  console.log('DIVISION: ' + divCheck);
  
  // Check eat effects
  const eatCheck = await page.evaluate(() => JSON.stringify({
    flashCount: orgs.filter(o => o.flash > 0).length,
    particleCount: parts.length,
  }));
  console.log('EAT_EFFECTS: ' + eatCheck);
  
  // Cartoon screenshot
  await page.evaluate(() => { tZoom = 1; zoom = 1; timeScale = 1; });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/FIX7-cartoon.png' });
  
  // Realistic screenshot  
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/FIX7-realistic.png' });
  
  // Realistic close-up
  await page.evaluate(() => { tZoom = 5; zoom = 5; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/FIX7-realistic-close.png' });
  
  console.log('ERRORS: ' + errors.length);
  errors.slice(0,3).forEach(e => console.log('  ERR: ' + e.substring(0,150)));
  console.log('DONE');
});
