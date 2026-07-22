
const { test } = require('@playwright/test');

test('Long eating test', async ({ page }) => {
  page.setDefaultTimeout(60000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Run at NORMAL speed (timeScale=1) for 10 seconds
  await page.waitForTimeout(10000);
  
  const stats10s = await page.evaluate(() => ({
    eaters: orgs.filter(o => o.alive && o.eaten > 0).length,
    totalKills: orgs.reduce((s, o) => s + (o.eaten || 0), 0),
    stomachs: orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length,
    states: orgs.reduce((acc,o)=>{if(o.alive&&o.state)acc[o.state]=(acc[o.state]||0)+1;return acc;},{}),
    sampleVx: (function(){ var o = orgs.find(x => x.alive && !x.isPlayer); return o ? o.vx.toFixed(3) : 'none'; })(),
  }));
  console.log('NORMAL_10S: ' + JSON.stringify(stats10s));
  
  // Now try at timeScale=10
  await page.evaluate(() => { timeScale = 10; });
  await page.waitForTimeout(10000);
  
  const stats20s = await page.evaluate(() => ({
    eaters: orgs.filter(o => o.alive && o.eaten > 0).length,
    totalKills: orgs.reduce((s, o) => s + (o.eaten || 0), 0),
    stomachs: orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length,
    states: orgs.reduce((acc,o)=>{if(o.alive&&o.state)acc[o.state]=(acc[o.state]||0)+1;return acc;},{}),
  }));
  console.log('SPEED_10_10S: ' + JSON.stringify(stats20s));
  
  console.log('DONE');
});
