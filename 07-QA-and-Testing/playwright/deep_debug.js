
const { test } = require('@playwright/test');

test('Deep debug eating', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Instrument eatOrg to count calls
  await page.evaluate(() => {
    window._eatCalls = 0;
    window._originalEatOrg = eatOrg;
    eatOrg = function(pred, prey) {
      window._eatCalls++;
      return window._originalEatOrg(pred, prey);
    };
  });
  
  // Run for 3 seconds
  await page.evaluate(() => { timeScale = 50; });
  await page.waitForTimeout(3000);
  
  const debug = await page.evaluate(() => ({
    eatCalls: window._eatCalls,
    getNearbyExists: typeof window.getNearby === 'function',
    spatialGridExists: !!window.spatialGrid,
    gridCells: Object.keys(window.spatialGrid || {}).length,
    totalEaters: orgs.filter(o => o.alive && o.eaten > 0).length,
    totalKills: orgs.reduce((s, o) => s + (o.eaten || 0), 0),
    foodChain: FOOD,
  }));
  console.log('DEBUG: ' + JSON.stringify(debug));
  
  // Check getNearby for a specific organism
  const nearbyTest = await page.evaluate(() => {
    var org = orgs.find(o => o.alive && o.sp.cat === 'consumer2');
    if(!org) return { error: 'no consumer2' };
    var nearby = window.getNearby ? window.getNearby(org.x, org.y, 200) : [];
    var foodCats = FOOD[org.sp.cat] || [];
    var edibleNearby = nearby.filter(o => o.alive && foodCats.indexOf(o.sp.cat) >= 0 && o.size < org.size * 0.88);
    return {
      orgName: org.sp.name,
      orgCat: org.sp.cat,
      orgSize: Math.round(org.size),
      nearbyCount: nearby.length,
      edibleNearby: edibleNearby.length,
      foodCats: foodCats,
    };
  });
  console.log('NEARBY_TEST: ' + JSON.stringify(nearbyTest));
  
  console.log('DONE');
});
