
const { test } = require('@playwright/test');

test('High zoom cell biology', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Enable microscope + zoom very high
  await page.evaluate(() => {
    document.getElementById('bMicro').click();
    tZoom = 30;
  });
  await page.waitForTimeout(3000);
  
  // Find a large cell and center camera on it
  await page.evaluate(() => {
    var big = orgs.filter(o => o.alive).sort((a,b) => b.size - a.size)[0];
    if(big) { cam.x = big.x; cam.y = big.y; }
  });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'screenshots/BIO-HIGH-ZOOM.png' });
  
  const cellInfo = await page.evaluate(() => {
    var big = orgs.filter(o => o.alive).sort((a,b) => b.size - a.size)[0];
    if(!big) return null;
    return {
      name: big.sp.name,
      size: Math.round(big.size*10)/10,
      organs: big.organs ? big.organs.map(g => g.t).join(',') : 'none',
      flag: big.sp.bio.flag, cilia: big.sp.bio.cilia,
      chloro: big.sp.bio.chloro, nucleus: big.sp.bio.nucleus,
    };
  });
  console.log('CELL: ' + JSON.stringify(cellInfo));
  console.log('DONE');
});
