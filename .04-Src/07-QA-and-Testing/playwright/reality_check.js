
const { test } = require('@playwright/test');

test('User reality check', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  // Check menu first
  await page.screenshot({ path: 'screenshots/REALITY-menu.png' });
  console.log('MENU_OK');
  
  // Start game — DON'T change zoom, see what default looks like
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(3000);
  
  // Default cartoon screenshot
  const cartoonState = await page.evaluate(() => JSON.stringify({
    mode: settings.renderMode,
    zoom: zoom.toFixed(2),
    camX: Math.round(cam.x), camY: Math.round(cam.y),
    playerX: player ? Math.round(player.x) : 0,
    playerY: player ? Math.round(player.y) : 0,
    alive: orgs.filter(o=>o.alive).length,
    fc: fc, gt: Math.round(gt),
    camDist: player ? Math.round(Math.sqrt((player.x-cam.x)**2+(player.y-cam.y)**2)) : 999,
  }));
  console.log('CARTOON_STATE: ' + cartoonState);
  await page.screenshot({ path: 'screenshots/REALITY-cartoon.png' });
  
  // Switch to realistic
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(2000);
  
  const realisticState = await page.evaluate(() => JSON.stringify({
    mode: settings.renderMode,
    zoom: zoom.toFixed(2),
  }));
  console.log('REALISTIC_STATE: ' + realisticState);
  await page.screenshot({ path: 'screenshots/REALITY-realistic.png' });
  
  console.log('ERRORS: ' + errors.length);
  errors.slice(0,3).forEach(e => console.log('  ERR: ' + e.substring(0,200)));
  console.log('DONE');
});
