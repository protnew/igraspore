const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=dr' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  // Find a decomposer and track ALL energy changes
  const result = await page.evaluate(() => {
    var dec = (orgs||[]).find(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
    if (!dec) return { error: 'no decomposer' };
    
    var e0 = dec.energy;
    var id = dec.id;
    
    // Run ONE update step and measure
    updateWorld(1/30);
    
    var dec2 = orgs.find(function(o){return o.id === id});
    if (!dec2) return { error: 'decomposer died in 1 tick' };
    
    var delta = dec2.energy - e0;
    return {
      id: id,
      e0: Math.round(e0*100)/100,
      e1: Math.round(dec2.energy*100)/100,
      delta_per_tick: Math.round(delta*100)/100,
      delta_per_sec: Math.round(delta*30*100)/100,
      alive: dec2.alive,
      y: Math.round(dec2.y),
    };
  });
  console.log('ONE TICK:', JSON.stringify(result));
  
  // Now check: is updateOrg called per-organism or is there a batch killer?
  // Also check: maybe decomposers are dying from the cull (too many organisms)
  const cull = await page.evaluate(() => {
    // Count total orgs and check if cull is active
    var alive = (orgs||[]).filter(function(o){return o&&o.alive}).length;
    var maxOrg = typeof MAX_ORG !== 'undefined' ? MAX_ORG : 'undef';
    var density = typeof settings !== 'undefined' ? settings.density : 'undef';
    return { alive: alive, maxOrg: maxOrg, density: density };
  });
  console.log('CULL CHECK:', JSON.stringify(cull));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
