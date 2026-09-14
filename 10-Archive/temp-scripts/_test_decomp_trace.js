const { chromium } = require('playwright');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(URL + '?v=dec' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => {
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof startGame === 'function') startGame();
  });
  await page.waitForTimeout(2000);

  // Trace decomposer + consumer2 state every 10s
  for (let sec = 0; sec <= 40; sec += 10) {
    if (sec > 0) {
      await page.evaluate(() => {
        for (let i = 0; i < 10*30; i++) updateWorld(1/30); // 10s
      });
    }
    const trace = await page.evaluate(() => {
      // Decomposer stats
      var decs = orgs.filter(o => o.alive && o.sp && o.sp.cat === 'decomposer');
      var decEnergy = decs.map(o => Math.round(o.energy)).sort((a,b)=>a-b);
      var decY = decs.map(o => Math.round(o.y));
      var decMass = decs.map(o => Math.round((o.massFood||0)*10)/10);
      
      // Consumer2 stats
      var c2s = orgs.filter(o => o.alive && o.sp && o.sp.cat === 'consumer2');
      var c2Energy = c2s.map(o => Math.round(o.energy)).sort((a,b)=>a-b);
      
      // Nutrient clouds at depth
      var deepClouds = (typeof nutrientClouds !== 'undefined') ? 
        nutrientClouds.filter(c => c.y > 500).length : 'undef';
      var allClouds = (typeof nutrientClouds !== 'undefined') ? nutrientClouds.length : 'undef';
      
      return {
        sec,
        decCount: decs.length,
        decEnergy: decEnergy.length > 0 ? `min=${decEnergy[0]} med=${decEnergy[Math.floor(decEnergy.length/2)]} max=${decEnergy[decEnergy.length-1]}` : 'none',
        decY: decY.length > 0 ? `min=${Math.min.apply(null,decY)} max=${Math.max.apply(null,decY)}` : 'none',
        decMass: decMass.length > 0 ? `min=${decMass[0]} med=${decMass[Math.floor(decMass.length/2)]}` : 'none',
        c2Count: c2s.length,
        c2Energy: c2Energy.length > 0 ? `min=${c2Energy[0]} med=${c2Energy[Math.floor(c2Energy.length/2)]} max=${c2Energy[c2Energy.length-1]}` : 'none',
        deepClouds,
        allClouds,
        PD: typeof PD !== 'undefined' ? PD : 'undef',
      };
    });
    console.log('T=' + sec + ':', JSON.stringify(trace));
  }

  await browser.close();
})().catch(e=>{ console.error('FAIL', e.message); process.exit(1); });
