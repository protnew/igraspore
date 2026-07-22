
const { test } = require('@playwright/test');

test('Debug AI state', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Check organism energies — AI only hunts when energy < 85
  const energyStats = await page.evaluate(() => {
    var alive = orgs.filter(o => o.alive);
    return {
      totalAlive: alive.length,
      hungry: alive.filter(o => o.energy < 85).length,
      starving: alive.filter(o => o.energy < 30).length,
      avgEnergy: Math.round(alive.reduce((s,o)=>s+o.energy,0)/alive.length),
      minEnergy: Math.min(...alive.map(o=>o.energy)),
      maxEnergy: Math.max(...alive.map(o=>o.energy)),
      // Check what getNearby actually returns
      sampleNearby: (function(){
        var o = alive.find(x => x.sp.cat === 'consumer2');
        if(!o) return 'no consumer2';
        var n = window.getNearby(o.x, o.y, 200);
        return { count: n.length, sameCell: n.filter(x => x.x === o.x).length };
      })(),
    };
  });
  console.log('ENERGY: ' + JSON.stringify(energyStats));
  
  // Run simulation
  await page.evaluate(() => { timeScale = 50; });
  await page.waitForTimeout(3000);
  
  const after = await page.evaluate(() => {
    var alive = orgs.filter(o => o.alive);
    return {
      hungry: alive.filter(o => o.energy < 85).length,
      avgEnergy: Math.round(alive.reduce((s,o)=>s+o.energy,0)/alive.length),
      states: alive.reduce((acc,o)=>{if(o.state)acc[o.state]=(acc[o.state]||0)+1;return acc;},{}),
      eaters: alive.filter(o => o.eaten > 0).length,
      stomachs: alive.filter(o => o.stomach && o.stomach.length > 0).length,
    };
  });
  console.log('AFTER_3S: ' + JSON.stringify(after));
  
  console.log('DONE');
});
