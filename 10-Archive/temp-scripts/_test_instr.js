const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=in' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  // Instrument: monkey-patch energy property on a decomposer
  const result = await page.evaluate(() => {
    var dec = (orgs||[]).find(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
    if (!dec) return { error: 'no decomposer' };
    
    var id = dec.id;
    var log = [];
    var origEnergy = dec.energy;
    
    // Run 30 ticks (1 second) and record energy before/after each
    for (var tick = 0; tick < 30; tick++) {
      var before = orgs.find(function(o){return o.id === id});
      var eBefore = before ? before.energy : -999;
      updateWorld(1/30);
      var after = orgs.find(function(o){return o.id === id});
      var eAfter = after ? after.energy : -999;
      if (after && tick < 5) {
        log.push({
          tick: tick,
          eBefore: Math.round(eBefore*100)/100,
          eAfter: Math.round(eAfter*100)/100,
          delta: Math.round((eAfter-eBefore)*100)/100,
          state: after.state,
          age: Math.round(after.age),
          y: Math.round(after.y),
          cyst: after.cyst,
          inBiofilm: after.inBiofilm,
        });
      }
    }
    
    var final = orgs.find(function(o){return o.id === id});
    return {
      log: log,
      startE: origEnergy,
      after1s: final ? Math.round(final.energy*100)/100 : 'dead',
      netChange: final ? Math.round((final.energy - origEnergy)*100)/100 : 'dead',
    };
  });
  console.log('INSTRUMENTED:', JSON.stringify(result, null, 2));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
