
const { test } = require('@playwright/test');

test('Check divCD', async ({ page }) => {
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  const debug = await page.evaluate(() => {
    var alive = orgs.filter(o => o.alive);
    return {
      total: alive.length,
      withDivCD: alive.filter(o => o.divCD > 0).length,
      avgDivCD: alive.reduce((s,o) => s + (o.divCD||0), 0) / alive.length,
      dividing: alive.filter(o => o.dividing).length,
      // Check if moveOrg is even called
      hasSpeed: alive.filter(o => o.sp.speed > 0).length,
      avgSpeed: alive.reduce((s,o) => s + o.sp.speed, 0) / alive.length,
      // Sample organism full state
      sample: (function(){
        var o = alive.find(x => !x.isPlayer);
        if(!o) return null;
        return {
          name: o.sp.name,
          cat: o.sp.cat,
          speed: o.sp.speed,
          vx: o.vx,
          vy: o.vy,
          energy: o.energy,
          divCD: o.divCD,
          cyst: o.cyst,
          state: o.state,
          dividing: o.dividing,
          alive: o.alive,
          isPlayer: o.isPlayer,
        };
      })(),
    };
  });
  console.log('DEBUG: ' + JSON.stringify(debug, null, 2));
  console.log('DONE');
});
