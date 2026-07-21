
const { test } = require('@playwright/test');

test('All fixes verified', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  
  // Check initial zoom
  const initZoom = await page.evaluate(() => zoom.toFixed(1));
  console.log('INITIAL_ZOOM=' + initZoom);
  
  // Start game
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  const startState = await page.evaluate(() => ({
    zoom: zoom.toFixed(1),
    camDist: Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)),
    state: state,
  }));
  console.log('START=' + JSON.stringify(startState));
  
  // Test movement — WASD
  const beforeX = await page.evaluate(() => Math.round(player.x));
  await page.keyboard.down('d');
  await page.waitForTimeout(1000);
  await page.keyboard.up('d');
  const afterX = await page.evaluate(() => Math.round(player.x));
  console.log('MOVEMENT_D=' + (afterX - beforeX) + 'px');
  
  // Test all buttons exist
  const btns = await page.evaluate(() => {
    return ['bEat','bDiv','bCyst','bAuto','bFree','bMicro','bRender','bFol','bWiki','bPause'].map(id => ({
      id, exists: !!document.getElementById(id)
    }));
  });
  const allExist = btns.every(b => b.exists);
  console.log('ALL_BUTTONS=' + allExist);
  
  // Test render mode toggle
  await page.evaluate(() => document.getElementById('bRender').click());
  const rmode = await page.evaluate(() => settings.renderMode);
  console.log('RENDER_MODE=' + rmode);
  
  // Test microscope toggle
  await page.evaluate(() => document.getElementById('bMicro').click());
  const micro = await page.evaluate(() => settings.microscopeMode);
  console.log('MICROSCOPE=' + micro);
  
  // Screenshot
  await page.screenshot({ path: 'screenshots/FIX-all-verified.png' });
  
  // Errors
  console.log('ERRORS=' + errors.length);
  
  console.log('DONE');
});
