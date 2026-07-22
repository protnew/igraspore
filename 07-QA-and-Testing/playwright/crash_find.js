
const { test } = require('@playwright/test');

test('Find exact crash', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text().substring(0, 300));
  });
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(3000);
  
  // Get unique errors
  const uniqueErrors = [...new Set(errors)].slice(0, 3);
  console.log('ERRORS (' + errors.length + ' total, ' + uniqueErrors.length + ' unique):');
  uniqueErrors.forEach(e => console.log('  ' + e));
  
  const stats = await page.evaluate(() => ({
    gt: gt, fc: fc, state: state,
    alive: orgs.filter(o => o.alive).length,
    eaters: orgs.filter(o => o.alive && o.eaten > 0).length,
    sampleVx: orgs.find(o => o.alive) ? orgs.find(o => o.alive).vx.toFixed(4) : 'none',
  }));
  console.log('STATS: ' + JSON.stringify(stats));
  console.log('DONE');
});
