const { chromium } = require('playwright');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,200)));
  page.on('console', msg => { if(msg.type()==='error') errors.push('console:'+msg.text().slice(0,200)); });

  console.log('Loading:', URL);
  await page.goto(URL + '?v=full' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Start game
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);

  // === PHASE 1: Verify virus lytic cycle ===
  console.log('\n=== VIRUS LYTIC CYCLE TEST ===');
  
  // T=0: check initial state
  let s0 = await page.evaluate(() => {
    var vir = viruses || [];
    var inf = (orgs||[]).filter(o => o.alive && o.infected);
    return { viruses: vir.length, infected: inf.length, alive: (orgs||[]).filter(o=>o&&o.alive).length };
  });
  console.log('T=0:', JSON.stringify(s0));

  // Run 30s of simulation and track infections + lysis events
  for (let t = 5; t <= 30; t += 5) {
    await page.evaluate(() => {
      for (let i = 0; i < 5 * 30; i++) updateWorld(1/30);
    });
    let s = await page.evaluate(() => {
      var vir = viruses || [];
      var inf = (orgs||[]).filter(o => o.alive && o.infected);
      // Count lysis debris (dead organisms with deathCause = LYSIS)
      var lysis = typeof DCODE !== 'undefined' ? (orgs||[]).filter(o => o.deathCause === DCODE.LYSIS).length : 0;
      return { 
        viruses: vir.length, 
        infected: inf.length, 
        alive: (orgs||[]).filter(o=>o&&o.alive).length,
        virusY: vir.slice(0,3).map(v => Math.round(v.y))
      };
    });
    console.log('T=' + t + ':', JSON.stringify(s));
  }

  // === PHASE 2: Survival per category ===
  console.log('\n=== SURVIVAL BY CATEGORY ===');
  const cats = await page.evaluate(() => {
    var byCat = {};
    var bySp = {};
    for (var o of (orgs||[])) {
      if (!o || !o.alive) continue;
      var c = (o.sp && o.sp.cat) || '?';
      var n = (o.sp && (o.sp.name || o.sp.id)) || '?';
      byCat[c] = (byCat[c]||0) + 1;
      if (!bySp[n]) bySp[n] = { cat: c, n: 0 };
      bySp[n].n++;
    }
    return { byCat, speciesCount: Object.keys(bySp).length };
  });
  console.log('Cats:', JSON.stringify(cats.byCat));
  console.log('Species alive:', cats.speciesCount);

  // === PHASE 3: Colony check ===
  console.log('\n=== COLONY CHECK ===');
  const col = await page.evaluate(() => {
    var colonies = (orgs||[]).filter(o => o.alive && o.sp && o.sp.shape === 'colony');
    return { count: colonies.length, names: colonies.map(o => o.sp.name).filter((v,i,a) => a.indexOf(v) === i) };
  });
  console.log('Colonies alive:', col.count, col.names);

  // === PHASE 4: Player check ===
  console.log('\n=== PLAYER ===');
  const player = await page.evaluate(() => {
    if (typeof player === 'undefined' || !player) return 'no player';
    return { name: player.sp ? player.sp.name : '?', energy: Math.round(player.energy||0), alive: player.alive, infected: player.infected };
  });
  console.log('Player:', JSON.stringify(player));

  // Screenshot
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/FULL-FUNC-30s.png' });

  console.log('\nERRORS:', errors.length);
  errors.forEach(e => console.log('  ' + e));

  await browser.close();
  console.log('\nDONE');
})().catch(e => { console.error('FAIL', e); process.exit(1); });
