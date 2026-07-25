
const { test } = require('@playwright/test');

test('Debug both modes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Check cartoon mode
  const cartoon = await page.evaluate(() => JSON.stringify({
    mode: settings.renderMode,
    alive: orgs.filter(o => o.alive).length,
    camX: Math.round(cam.x), camY: Math.round(cam.y),
    zoom: zoom.toFixed(2),
    fc: fc, gt: Math.round(gt),
    playerAlive: player ? player.alive : false,
  }));
  console.log('CARTOON: ' + cartoon);
  
  await page.screenshot({ path: 'screenshots/DBG-cartoon.png' });
  
  // Switch to realistic
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(1000);
  
  const realistic = await page.evaluate(() => JSON.stringify({
    mode: settings.renderMode,
    alive: orgs.filter(o => o.alive).length,
    fc: fc,
  }));
  console.log('REALISTIC: ' + realistic);
  
  await page.screenshot({ path: 'screenshots/DBG-realistic.png' });
  
  // Switch BACK to cartoon
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(1000);
  
  const backCartoon = await page.evaluate(() => JSON.stringify({
    mode: settings.renderMode,
    fc: fc,
    alive: orgs.filter(o => o.alive).length,
  }));
  console.log('BACK_TO_CARTOON: ' + backCartoon);
  
  await page.screenshot({ path: 'screenshots/DBG-cartoon-back.png' });
  
  console.log('ERRORS: ' + errors.length);
  errors.slice(0,5).forEach(e => console.log('  ERR: ' + e.substring(0,200)));
  console.log('DONE');
});
