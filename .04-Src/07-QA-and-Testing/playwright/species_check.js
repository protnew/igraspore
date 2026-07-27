
const { test } = require('@playwright/test');

test('Player species check', async ({ page }) => {
  page.setDefaultTimeout(15000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  const info = await page.evaluate(() => {
    return JSON.stringify({
      species: player.sp.name,
      cat: player.sp.cat,
      food: FOOD[player.sp.cat],
      speed: player.sp.speed,
      shape: player.sp.shape,
      energy: Math.round(player.energy),
      y: Math.round(player.y),
    });
  });
  console.log('PLAYER: ' + info);
  
  // Now test autopilot with a consumer species
  // Switch to a consumer2 (ciliate) which actually hunts
  await page.evaluate(() => {
    // Find a ciliate in the species DB
    var ciliate = SPECIES_DB.findIndex(s => s.cat === 'consumer2');
    if (ciliate >= 0) {
      selSpecies = ciliate;
    }
  });
  
  // Restart game with new species
  await page.evaluate(() => {
    document.getElementById('menuBtn').click();
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  const newInfo = await page.evaluate(() => {
    return JSON.stringify({
      species: player.sp.name,
      cat: player.sp.cat,
      food: FOOD[player.sp.cat],
    });
  });
  console.log('NEW_PLAYER: ' + newInfo);
  
  // Enable autopilot
  await page.keyboard.press('Tab');
  await page.waitForTimeout(5000);
  
  const result = await page.evaluate(() => {
    return JSON.stringify({
      autoAI: autoAI,
      state: player ? player.state : 'dead',
      energy: player ? Math.round(player.energy) : 0,
      eaten: player ? player.eaten : 0,
      alive: orgs.filter(o => o.alive).length,
    });
  });
  console.log('CILIATE_AUTO: ' + result);
  console.log('DONE');
});
