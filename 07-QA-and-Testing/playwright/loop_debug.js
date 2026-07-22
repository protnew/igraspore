
const { test } = require('@playwright/test');

test('gameLoop running?', async ({ page }) => {
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  
  const before = await page.evaluate(() => ({ gt: gt, fc: fc, state: state }));
  console.log('BEFORE_START: ' + JSON.stringify(before));
  
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(100);
  
  const justAfter = await page.evaluate(() => ({ gt: gt, fc: fc, state: state }));
  console.log('JUST_AFTER_START: ' + JSON.stringify(justAfter));
  
  await page.waitForTimeout(2000);
  
  const after2s = await page.evaluate(() => ({
    gt: gt,
    fc: fc,
    state: state,
    orgCount: orgs.length,
    aliveCount: orgs.filter(o => o.alive).length,
    orgsVx: orgs.filter(o => o.alive).slice(0, 5).map(o => o.vx.toFixed(4)),
    timeScale: timeScale,
  }));
  console.log('AFTER_2S: ' + JSON.stringify(after2s));
  
  console.log('DONE');
});
