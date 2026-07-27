
const { test } = require('@playwright/test');

test('FULL functional verification', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  
  page.setDefaultTimeout(30000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(5000); // 5 seconds of normal simulation
  
  const stats = await page.evaluate(() => ({
    gt: Math.round(gt),
    fc: fc,
    alive: orgs.filter(o => o.alive).length,
    dead: orgs.filter(o => !o.alive).length,
    eaters: orgs.filter(o => o.eaten > 0).length,
    totalKills: orgs.reduce((s, o) => s + (o.eaten || 0), 0),
    stomachs: orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length,
    offspring: orgs.reduce((s, o) => s + (o.offspring || 0), 0),
    states: orgs.reduce((acc,o)=>{if(o.alive&&o.state)acc[o.state]=(acc[o.state]||0)+1;return acc;},{}),
    infected: orgs.filter(o => o.infected).length,
    viruses: viruses.length,
    sampleVx: orgs.find(o => o.alive) ? orgs.find(o => o.alive).vx.toFixed(3) : 'none',
  }));
  
  console.log('STATS: ' + JSON.stringify(stats, null, 2));
  console.log('ERRORS: ' + errors.length);
  if(errors.length > 0) console.log('FIRST_ERR: ' + errors[0].substring(0, 200));
  console.log('DONE');
});
