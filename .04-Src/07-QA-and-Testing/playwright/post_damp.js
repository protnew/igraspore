
const { test } = require('@playwright/test');

test('Post-damp-fix eating check', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Check movement first
  const pos1 = await page.evaluate(() => {
    var o = orgs.find(x => x.alive && x.sp.cat === 'consumer2');
    return o ? { x: Math.round(o.x), y: Math.round(o.y), vx: o.vx.toFixed(2), vy: o.vy.toFixed(2) } : null;
  });
  console.log('POS1: ' + JSON.stringify(pos1));
  
  await page.evaluate(() => { timeScale = 30; });
  await page.waitForTimeout(3000);
  
  const stats = await page.evaluate(() => ({
    eaters: orgs.filter(o => o.alive && o.eaten > 0).length,
    totalKills: orgs.reduce((s, o) => s + (o.eaten || 0), 0),
    stomachs: orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length,
    states: orgs.reduce((acc,o)=>{if(o.alive&&o.state)acc[o.state]=(acc[o.state]||0)+1;return acc;},{}),
    alive: orgs.filter(o => o.alive).length,
    // Check velocity of a sample organism
    sampleVx: (function(){ var o = orgs.find(x => x.alive); return o ? o.vx.toFixed(3) : 'none'; })(),
  }));
  console.log('STATS: ' + JSON.stringify(stats));
  console.log('DONE');
});
