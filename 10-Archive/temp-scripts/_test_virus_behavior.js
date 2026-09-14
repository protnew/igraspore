const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=vb' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1500);

  // Track virus movement + behavior
  const result = await page.evaluate(() => {
    var vir = viruses || [];
    var info = vir.slice(0, 5).map(function(v, i) {
      return {
        idx: i,
        x: Math.round(v.x), y: Math.round(v.y),
        vx: Math.round(v.vx*100)/100, vy: Math.round(v.vy*100)/100,
        age: Math.round(v.age*10)/10,
        hasTarget: !!(v.target && v.target.alive),
        targetName: v.target ? (v.target.sp ? v.target.sp.name : '?') : null,
        sp: v.sp ? v.sp.name : '?',
      };
    });
    return { count: vir.length, samples: info };
  });
  console.log('VIRUS STATE:', JSON.stringify(result, null, 2));

  // Run 2 seconds, track virus position change
  var pos0 = await page.evaluate(() => {
    var v = viruses[0];
    return v ? { x: v.x, y: v.y, vx: v.vx, vy: v.vy } : null;
  });
  
  await page.evaluate(() => { for(var i=0;i<2*30;i++) updateWorld(1/30); });
  
  var pos1 = await page.evaluate(() => {
    var v = viruses[0];
    return v ? { x: v.x, y: v.y, vx: v.vx, vy: v.vy, age: v.age } : null;
  });
  
  console.log('\nVIRUS[0] movement:');
  console.log('  before:', JSON.stringify(pos0));
  console.log('  after:', JSON.stringify(pos1));
  if (pos0 && pos1) {
    var dx = pos1.x - pos0.x, dy = pos1.y - pos0.y;
    console.log('  delta: dx=' + Math.round(dx) + ' dy=' + Math.round(dy) + ' dist=' + Math.round(Math.sqrt(dx*dx+dy*dy)));
  }

  // Check: do viruses DIVIDE? They should NOT divide - only lytic cycle
  var divCheck = await page.evaluate(() => {
    // Check if any virus has division-related properties
    var v = viruses[0];
    if (!v) return 'no virus';
    return {
      hasDividing: v.dividing,
      hasDivT: v.divT !== undefined,
      hasMassFood: v.massFood !== undefined,
      hasEatsSinceDiv: v.eatsSinceDiv !== undefined,
      keys: Object.keys(v).join(','),
    };
  });
  console.log('\nVIRUS division check:', JSON.stringify(divCheck, null, 2));

  // Check: what category does the virus organism belong to?
  var catCheck = await page.evaluate(() => {
    // Is the virus in the orgs array or separate?
    var virInOrgs = (orgs||[]).filter(function(o){return o.sp && o.sp.cat === 'virus'}).length;
    return {
      virusesInOrgsArray: virInOrgs,
      virusesInVirusesArray: (viruses||[]).length,
    };
  });
  console.log('\nVIRUS location:', JSON.stringify(catCheck));

  // Screenshot
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/VIRUS-BEHAVIOR.png' });
  
  await browser.close();
  console.log('\nDONE');
})().catch(function(e){console.error(e);process.exit(1)});
