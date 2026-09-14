const { chromium } = require('playwright');
const URL = "https://igraspore.pages.dev";
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,200)));
  page.on('console', msg => { if(msg.type()==='error') errors.push('console:'+msg.text().slice(0,200)); });

  await page.goto(URL + '?v=audit' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Collect script URLs actually loaded
  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
  });
  console.log('LOADED SCRIPTS:');
  scripts.forEach(s => console.log('  ' + s));

  // Check key functions exist
  const fns = await page.evaluate(() => {
    return {
      updateViruses: typeof updateViruses,
      viruses_var: typeof viruses,
      biology_virus_loaded: typeof window.updateViruses,
      SPECIES_DB: typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.length : 'undef',
      colony_species: typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.filter(s => s.shape === 'colony').map(s => s.name) : [],
      noRandomSpawn: typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.filter(s => s.flags && s.flags.noRandomSpawn).map(s => s.name) : [],
    };
  });
  console.log('\nFUNCTIONS:', JSON.stringify(fns, null, 2));

  // Start game and check viruses + colonies
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(3000);

  // Check state
  const state = await page.evaluate(() => {
    // Colony check: are there colony-shaped organisms alive?
    var colonies = (orgs || []).filter(o => o.alive && o.sp && o.sp.shape === 'colony');
    var colonyNames = colonies.map(o => o.sp.name).filter((v,i,a) => a.indexOf(v) === i);
    var vir = viruses || [];
    // Check virus infection state
    var infected = (orgs || []).filter(o => o.alive && o.viralLoad);
    
    return {
      alive: (orgs || []).filter(o => o && o.alive).length,
      viruses: vir.length,
      virusDetails: vir.slice(0, 3).map(v => ({ x: Math.round(v.x), y: Math.round(v.y), age: v.age||0 })),
      infected: infected.length,
      colonies_alive: colonies.length,
      colony_names: colonyNames,
      // Check green blob: producers near surface
      producers_near_surface: (orgs || []).filter(o => o.alive && o.sp && o.sp.cat === 'producer' && o.y < 100).length,
    };
  });
  console.log('\nGAME STATE:', JSON.stringify(state, null, 2));

  // Screenshot
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/AUDIT-live.png' });
  
  console.log('\nERRORS:', errors.length);
  errors.forEach(e => console.log('  ' + e));

  await browser.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
