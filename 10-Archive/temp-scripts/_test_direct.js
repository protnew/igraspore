const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=dx' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  // Run 20 seconds to let decomposers sink
  await page.evaluate(() => { for(var i=0;i<20*30;i++) updateWorld(1/30); });

  // Direct test: manually compute DOM gain for a deep decomposer
  const result = await page.evaluate(() => {
    var decs = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
    if (!decs.length) return {error:'none'};
    
    // Pick the deepest one
    decs.sort(function(a,b){return b.y - a.y});
    var dec = decs[0];
    
    // Manually compute what DOM should give
    var dt = 1/30;
    var depthF = Math.max(0, Math.min(1, dec.y / PD));
    var expectedDOM = (0.4 + depthF * 0.6) * dt * DIFF[difficulty].energy;
    
    // Check if any nutrient cloud is nearby
    var nearCloud = null;
    if (typeof nutrientClouds !== 'undefined') {
      for (var i=0; i<nutrientClouds.length; i++) {
        var nc = nutrientClouds[i];
        var dx = nc.x - dec.x, dy = nc.y - dec.y;
        var d2 = dx*dx + dy*dy;
        if (d2 < (nc.r*1.35)*(nc.r*1.35)) { nearCloud = {x:Math.round(nc.x), y:Math.round(nc.y), r:nc.r, intensity:nc.intensity}; break; }
      }
    }
    
    // Check metab
    var baseMetab = (0.008 + dec.sp.speed * (dec.speedMult||1) * 0.003) * DIFF[difficulty].metab;
    baseMetab *= 0.38; // decomposer
    var metabMult = dec.inBiofilm ? 0.3 : 1.0;
    if (dec.cellWall > 0) metabMult *= (1 + dec.cellWall * 0.2);
    // aging exempt for decomposer now
    var metab = baseMetab * metabMult;
    
    var o2Lim = Math.min(1.0, Math.max(0, (typeof globalO2 !== 'undefined' ? globalO2 : 30) + (dec.o2Offset||0)) / 50.0);
    var o2Mul = 1.0 - o2Lim * 0; // o2TaxCap=1.0 for decomposer → o2Mul = 1.0 always
    
    return {
      dec: { y: Math.round(dec.y), energy: Math.round(dec.energy), age: Math.round(dec.age), state: dec.state, cellWall: dec.cellWall },
      dom_perTick: Math.round(expectedDOM*10000)/10000,
      dom_perSec: Math.round(expectedDOM*30*100)/100,
      metab_perTick: Math.round(metab*10000)/10000,
      metab_perSec: Math.round(metab*30*100)/100,
      net_perSec: Math.round((expectedDOM*30 - metab*30)*100)/100,
      nearCloud: nearCloud,
      cloudCount: typeof nutrientClouds !== 'undefined' ? nutrientClouds.length : 'undef',
      globalO2: typeof globalO2 !== 'undefined' ? Math.round(globalO2) : 'undef',
    };
  });
  console.log(JSON.stringify(result, null, 2));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
