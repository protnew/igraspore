const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('https://igraspore.pages.dev?v=c3' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  // Check: simulate the EXACT pool filter from initWorld at runtime
  const pool = await page.evaluate(() => {
    var p = SPECIES_DB.filter(function(s){
      return s.cat === 'producer' && !(s.flags && s.flags.noRandomSpawn) && (s.size||1) < 16;
    });
    // Also check what foodPool would look like
    var foodCats = ['producer', 'consumer1'];
    var fp = [];
    for (var si=0; si<SPECIES_DB.length; si++){
      var _s = SPECIES_DB[si];
      if(foodCats.indexOf(_s.cat)>=0 && !(_s.flags && _s.flags.noRandomSpawn)) fp.push(_s);
    }
    return {
      initPool_has_colonies: p.some(function(s){return s.shape==='colony'}),
      foodPool_has_colonies: fp.some(function(s){return s.shape==='colony'}),
      foodPool_size: fp.length,
      foodPool_colony_names: fp.filter(function(s){return s.shape==='colony'}).map(function(s){return s.name}),
    };
  });
  console.log('Pool analysis:', JSON.stringify(pool, null, 2));
  
  // Now start game and find WHERE the colony comes from
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);
  
  const colony = await page.evaluate(() => {
    var c = (orgs||[]).find(function(o){return o.alive && o.sp && o.sp.shape === 'colony'});
    if (!c) return { found: false };
    return {
      found: true,
      name: c.sp.name,
      x: Math.round(c.x), y: Math.round(c.y),
      isPlayer: c.isPlayer,
      size: c.sp.size,
      energy: Math.round(c.energy),
    };
  });
  console.log('Colony:', JSON.stringify(colony, null, 2));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
