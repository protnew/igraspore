
const { test } = require('@playwright/test');

test('Zoom comparison screenshots', async ({ page }) => {
  page.setDefaultTimeout(30000);
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(2000);
  
  // Test multiple zoom levels
  const zoomLevels = [0.3, 0.5, 0.8, 1.5];
  for (const z of zoomLevels) {
    await page.evaluate((zz) => { tZoom = zz; zoom = zz; }, z);
    await page.waitForTimeout(1500);
    
    // Force midday
    await page.evaluate(() => { tod = 12; updateTodUI(); });
    await page.waitForTimeout(500);
    
    const info = await page.evaluate(() => ({
      zoom: zoom.toFixed(2),
      totalOrgs: orgs.length,
      vw: (cv.width / zoom).toFixed(0),
      vh: (cv.height / zoom).toFixed(0)
    }));
    
    const fname = 'screenshots/REAL-zoom-' + z.toFixed(1) + '.png';
    await page.screenshot({ path: fname });
    console.log(`${fname}: ${JSON.stringify(info)}`);
  }
  
  console.log('Done!');
});
