
const { test } = require('@playwright/test');

test('Debug aiOrg hunt logic', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Test specific predator-prey pair
  const huntDebug = await page.evaluate(() => {
    // Find a hungry consumer2
    var pred = orgs.find(o => o.alive && o.sp.cat === 'consumer2' && o.energy < 85);
    if(!pred) return { error: 'no hungry consumer2' };
    
    var foodCats = FOOD[pred.sp.cat];
    var nearby = window.getNearby(pred.x, pred.y, 2000);
    
    // Check each nearby organism
    var edible = nearby.filter(p => {
      if(!p.alive || p === pred || p.cyst || p.divCD > 0 || p.invuln > 0) return false;
      if(foodCats.indexOf(p.sp.cat) < 0) return false;
      if(p.size >= pred.size * 0.88) return false;
      return true;
    });
    
    // Check the dist2 for closest edible
    var closestEdible = null, closestDist = 999999;
    edible.forEach(p => {
      var d = (p.x-pred.x)*(p.x-pred.x) + (p.y-pred.y)*(p.y-pred.y);
      if(d < closestDist) { closestDist = d; closestEdible = p; }
    });
    
    return {
      predName: pred.sp.name,
      predSize: Math.round(pred.size),
      predEnergy: Math.round(pred.energy),
      nearbyCount: nearby.length,
      edibleCount: edible.length,
      closestEdibleDist: closestEdible < 999999 ? Math.round(Math.sqrt(closestEdible)) : 'none',
      closestEdibleSize: closestEdible ? Math.round(closestEdible.size) : 'none',
      huntRange: 350,
      // Is closest within hunt range?
      inHuntRange: closestEdible && closestDist < 350*350,
    };
  });
  console.log('HUNT_DEBUG: ' + JSON.stringify(huntDebug));
  
  console.log('DONE');
});
