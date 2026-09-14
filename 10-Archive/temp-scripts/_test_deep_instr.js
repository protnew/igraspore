const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=di' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  // Run 15 seconds to let decomposers settle at depth
  await page.evaluate(() => { for(var i=0;i<15*30;i++) updateWorld(1/30); });

  // Now find a DEEP decomposer
  const result = await page.evaluate(() => {
    var decs = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer' && o.y > 500});
    if (!decs.length) return { error: 'no deep decomposer', allDecs: (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'}).map(function(d){return {y:Math.round(d.y), e:Math.round(d.energy)}}).slice(0,5) };
    
    var dec = decs[0];
    var id = dec.id;
    var log = [];
    
    for (var tick = 0; tick < 10; tick++) {
      var before = orgs.find(function(o){return o.id === id});
      var eBefore = before ? before.energy : -999;
      updateWorld(1/30);
      var after = orgs.find(function(o){return o.id === id});
      var eAfter = after ? after.energy : -999;
      if (after) {
        log.push({
          tick: tick, eBefore: Math.round(eBefore*100)/100, eAfter: Math.round(eAfter*100)/100,
          delta: Math.round((eAfter-eBefore)*100)/100, age: Math.round(after.age),
          y: Math.round(after.y), state: after.state, cellWall: after.cellWall,
        });
      } else { log.push({tick: tick, dead: true}); break; }
    }
    return { y0: Math.round(dec.y), e0: Math.round(dec.energy), age0: Math.round(dec.age), log: log };
  });
  console.log(JSON.stringify(result, null, 2));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
