
const { test } = require('@playwright/test');

test('Screenshots v2 - fixed zoom', async ({ page }) => {
  page.setDefaultTimeout(30000);
  
  // 1. GAME WITH FIXED ZOOM
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/REAL-09-game-zoom-fixed.png' });
  
  // Check zoom and orgs visible
  const info = await page.evaluate(() => ({
    zoom: zoom.toFixed(2),
    camX: cam.x.toFixed(0),
    camY: cam.y.toFixed(0),
    totalOrgs: orgs.length,
    viewportW: (cv.width / zoom).toFixed(0),
    viewportH: (cv.height / zoom).toFixed(0)
  }));
  console.log('Game info:', JSON.stringify(info));
  
  // 2. DAY SCENE
  await page.evaluate(() => { tod = 12; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/REAL-10-day-fixed.png' });
  
  // 3. SUNRISE
  await page.evaluate(() => { tod = 5.5; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/REAL-11-sunrise.png' });
  
  // 4. SUNSET
  await page.evaluate(() => { tod = 18.5; updateTodUI(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/REAL-12-sunset.png' });
  
  // 5. REAL DEATH SCREEN - kill ALL same-species
  await page.evaluate(() => {
    if(!player) return;
    var pSp = player.sp.id;
    var killed = 0;
    for(var i = orgs.length - 1; i >= 0; i--) {
      if(orgs[i].sp && orgs[i].sp.id === pSp) {
        orgs[i]._remove = true;
        killed++;
      }
    }
    console.log('Killed', killed, 'same-species orgs');
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/REAL-13-death-real.png' });
  
  console.log('Done!');
});
