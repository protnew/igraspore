const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=col' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  // Check SPECIES_DB flags before game start
  const flags = await page.evaluate(() => {
    return SPECIES_DB.filter(function(s){return s.shape === 'colony'}).map(function(s){
      return { name: s.name, noRandomSpawn: s.flags ? s.flags.noRandomSpawn : 'no flags', shape: s.shape, size: s.size };
    });
  });
  console.log('Colony flags:', JSON.stringify(flags, null, 2));
  
  // Start game
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);
  
  // Check colonies at start
  const state = await page.evaluate(() => {
    var colonies = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.shape === 'colony'});
    return { count: colonies.length, names: colonies.map(function(c){return c.sp.name}) };
  });
  console.log('Colonies at start:', JSON.stringify(state));
  
  // Run 10s
  await page.evaluate(() => { for(var i=0;i<10*30;i++) updateWorld(1/30); });
  
  const state2 = await page.evaluate(() => {
    var colonies = (orgs||[]).filter(function(o){return o.alive && o.sp && o.sp.shape === 'colony'});
    return { count: colonies.length, names: colonies.map(function(c){return c.sp.name}) };
  });
  console.log('Colonies at 10s:', JSON.stringify(state2));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
