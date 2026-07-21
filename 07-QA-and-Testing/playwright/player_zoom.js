
const { test } = require('@playwright/test');

test('Player cell zoom', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Make player huge and zoom in (camera follows player automatically)
  await page.evaluate(() => {
    freeCam = false; // Camera follows player
    if(player && player.alive) {
      player.size = 40; // Make it big
      player.organs = player.organs || [];
    }
    tZoom = 15; // Reasonable zoom
    zoom = 15;
  });
  await page.waitForTimeout(3000);
  
  // Check player info
  const pInfo = await page.evaluate(() => ({
    exists: !!player,
    alive: player ? player.alive : false,
    name: player ? player.sp.name : 'none',
    size: player ? Math.round(player.size*10)/10 : 0,
    x: player ? Math.round(player.x) : 0,
    y: player ? Math.round(player.y) : 0,
    organs: player && player.organs ? player.organs.map(g=>g.t).join(',') : 'none',
    zoom: zoom.toFixed(1),
    camX: Math.round(cam.x), camY: Math.round(cam.y),
  }));
  console.log('PLAYER: ' + JSON.stringify(pInfo));
  
  await page.screenshot({ path: 'screenshots/BIO-PLAYER-z15.png' });
  
  // Higher zoom
  await page.evaluate(() => {
    if(player) { player.size = 40; }
    tZoom = 30; zoom = 30;
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/BIO-PLAYER-z30.png' });
  
  console.log('DONE');
});
