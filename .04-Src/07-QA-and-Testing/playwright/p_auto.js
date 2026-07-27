
const { test } = require('@playwright/test');

test('Player + autopilot', async ({ page }) => {
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Check what species player is
  const pInfo = await page.evaluate(() => JSON.stringify({
    species: player.sp.name, cat: player.sp.cat,
    food: FOOD[player.sp.cat], energy: Math.round(player.energy),
  }));
  console.log('PLAYER: ' + pInfo);
  
  // Run autopilot 10s
  await page.keyboard.press('Tab');
  await page.waitForTimeout(10000);
  
  const aInfo = await page.evaluate(() => JSON.stringify({
    autoAI: autoAI,
    alive: player && player.alive,
    state: player ? player.state : 'dead',
    energy: player ? Math.round(player.energy) : 0,
    eaten: player ? player.eaten : 0,
    offspring: player ? player.offspring : 0,
    orgsAlive: orgs.filter(o => o.alive).length,
    orgsDead: orgs.filter(o => !o.alive).length,
  }));
  console.log('AFTER_10S: ' + aInfo);
  console.log('ERRORS: ' + errors.length);
  errors.forEach(e => console.log('ERR: ' + e.substring(0,150)));
  console.log('DONE');
});
