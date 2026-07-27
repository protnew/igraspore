
const { test } = require('@playwright/test');

test('Debug stomach contents', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Run for 2 seconds at 50x
  await page.evaluate(() => { timeScale = 50; });
  await page.waitForTimeout(2000);
  
  // Force an organism to eat and check stomach immediately
  const eatResult = await page.evaluate(() => {
    var pred = orgs.find(o => o.alive && o.eaten > 0);
    if(!pred) return { error: 'no predator with eaten>0' };
    return {
      name: pred.sp.name,
      eaten: pred.eaten,
      stomachLen: pred.stomach ? pred.stomach.length : 'undefined',
      stomachContents: pred.stomach ? pred.stomach.map(s => ({e: Math.round(s.energy), sz: Math.round(s.size)})) : [],
      energy: Math.round(pred.energy),
    };
  });
  console.log('PREDATOR: ' + JSON.stringify(eatResult));
  
  // Check how many orgs have eaten>0
  const stats = await page.evaluate(() => ({
    totalEaters: orgs.filter(o => o.alive && o.eaten > 0).length,
    withStomach: orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length,
    totalAlive: orgs.filter(o => o.alive).length,
  }));
  console.log('STATS: ' + JSON.stringify(stats));
  
  console.log('DONE');
});
