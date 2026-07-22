
const { test } = require('@playwright/test');

test('gameLoop runs after fix', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push('PAGE: ' + err.message));
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(3000);
  
  const stats = await page.evaluate(() => ({
    gt: gt,
    fc: fc,
    state: state,
    eaters: orgs.filter(o => o.alive && o.eaten > 0).length,
    totalKills: orgs.reduce((s, o) => s + (o.eaten || 0), 0),
    stomachs: orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length,
    states: orgs.reduce((acc,o)=>{if(o.alive&&o.state)acc[o.state]=(acc[o.state]||0)+1;return acc;},{}),
    sampleVx: orgs.find(o => o.alive) ? orgs.find(o => o.alive).vx.toFixed(4) : 'none',
    alive: orgs.filter(o => o.alive).length,
  }));
  console.log('STATS: ' + JSON.stringify(stats));
  console.log('ERRORS: ' + JSON.stringify(errors));
  console.log('DONE');
});
