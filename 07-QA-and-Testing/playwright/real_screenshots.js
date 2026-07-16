
const { test } = require('@playwright/test');

test('Screenshots for user', async ({ page }) => {
  page.setDefaultTimeout(30000);
  
  // 1. MENU
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/REAL-01-menu.png' });
  console.log('1. Menu captured');
  
  // 2. SCREENSAVER
  await page.evaluate(() => { document.getElementById('screensaverBtn').click(); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/REAL-02-screensaver.png' });
  console.log('2. Screensaver captured');
  
  // 3. RETURN TO MENU
  await page.evaluate(() => { 
    state = 'menu'; 
    document.getElementById('menuO').className = 'ov show';
    document.getElementById('hud').style.display = 'none';
  });
  await page.waitForTimeout(1000);
  
  // 4. START GAME
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/REAL-03-game-start.png' });
  console.log('3. Game start captured');
  
  // 5. CELLS
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/REAL-04-cells.png' });
  console.log('4. Cells captured');
  
  // 6. ZOOM IN
  await page.evaluate(() => { if(typeof cam !== 'undefined') cam.zoom = 6; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/REAL-05-zoom-in.png' });
  console.log('5. Zoom in captured');
  
  // 7. DAY/NIGHT — check current state
  const light = await page.evaluate(() => ({
    tod: tod.toFixed(1), dl: dayLight.toFixed(3)
  }));
  console.log('Light state:', JSON.stringify(light));
  
  // 8. Force night
  await page.evaluate(() => { tod = 1; updateTodUI(); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/REAL-06-night-moon.png' });
  console.log('6. Night/moon captured');
  
  // 9. Force day
  await page.evaluate(() => { tod = 12; updateTodUI(); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/REAL-07-day-sun.png' });
  console.log('7. Day/sun captured');
  
  // 10. Death screen
  await page.evaluate(() => {
    if (player) { player.energy = 0; player._remove = true; player.dying = true; }
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/REAL-08-death.png' });
  console.log('8. Death captured');
  
  console.log('All done!');
});
