
const { test } = require('@playwright/test');
const URL = 'file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html';

test('Post-fix: eating works?', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  await page.evaluate(() => { timeScale = 50; });
  await page.waitForTimeout(3000);
  
  const stats = await page.evaluate(() => ({
    eaters: orgs.filter(o => o.alive && o.eaten > 0).length,
    totalKills: orgs.reduce((s, o) => s + (o.eaten || 0), 0),
    stomachs: orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length,
    alive: orgs.filter(o => o.alive).length,
    behaviors: orgs.reduce((acc, o) => { if(o.state) acc[o.state]=(acc[o.state]||0)+1; return acc; }, {}),
  }));
  console.log('RESULTS: ' + JSON.stringify(stats));
  console.log('DONE');
});
