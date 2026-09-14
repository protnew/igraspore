const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=dd' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  // Track a single decomposer's energy components over 10 seconds
  const result = await page.evaluate(() => {
    var dec = (orgs||[]).find(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
    if (!dec) return { error: 'no decomposer' };
    
    var track = { id: dec.id, startEnergy: dec.energy, y: dec.y, size: dec.size };
    var readings = [];
    
    // Manually compute what SHOULD happen
    var dt = 1/30;
    var PD_val = typeof PD !== 'undefined' ? PD : 2000;
    var depthF = Math.max(0, Math.min(1, dec.y / PD_val));
    var DIFF_easy_energy = 1; // assume 1
    var domGain_expected = (0.4 + depthF * 0.6) * dt * DIFF_easy_energy;
    
    // Check DIFF.easy
    var diffInfo = typeof DIFF !== 'undefined' && DIFF.easy ? { energy: DIFF.easy.energy, metab: DIFF.easy.metab } : 'undef';
    
    // Check metab for this organism
    var baseMetab = (0.008 + (dec.sp.speed||1) * (dec.speedMult||1) * 0.003) * (DIFF.easy ? DIFF.easy.metab : 0.5);
    var decMetabMult = 0.42; // decomposer exemption
    baseMetab *= decMetabMult;
    
    return {
      track: track,
      depthF: depthF,
      domGain_perSec: domGain_expected * 30,
      baseMetab_perSec: baseMetab,
      diffInfo: diffInfo,
      decSpeed: dec.sp.speed,
      decSpeedMult: dec.speedMult,
      decInBiofilm: dec.inBiofilm,
      decCyst: dec.cyst,
      isEuk: dec.sp.isEuk,
    };
  });
  console.log('DECOMPOSER ANALYSIS:', JSON.stringify(result, null, 2));

  // Run 10s and track
  await page.evaluate(() => { for(var i=0;i<10*30;i++) updateWorld(1/30); });
  
  const after = await page.evaluate(() => {
    var decs = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
    return {
      count: decs.length,
      avgEnergy: decs.length ? Math.round(decs.reduce(function(s,o){return s+o.energy},0)/decs.length) : 0,
      avgY: decs.length ? Math.round(decs.reduce(function(s,o){return s+o.y},0)/decs.length) : 0,
    };
  });
  console.log('AFTER 10s:', JSON.stringify(after));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
