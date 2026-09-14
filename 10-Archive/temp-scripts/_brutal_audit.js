const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('console', m => { if(m.type()==='error') errs.push(m.text().substring(0,300)); });
  page.on('pageerror', e => errs.push('PAGE: ' + e.message.substring(0,300)));

  // FRESH load — unique URL, no cache
  await page.goto('https://igraspore.pages.dev?v=brutal' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  // CHECK 1: Is virus Brownian fix actually deployed?
  const fixCheck = await page.evaluate(() => {
    var bvSrc = '';
    // Try to get the function source
    try { bvSrc = updateViruses.toString(); } catch(e) { bvSrc = 'FN_NOT_FOUND'; }
    return {
      hasBrownian: bvSrc.indexOf('Math.random()-0.5') >= 0,
      hasDrift: bvSrc.indexOf('Brownian') >= 0 || bvSrc.indexOf('brownian') >= 0,
      hasSpeedClamp: bvSrc.indexOf('vsp<0.3') >= 0 || bvSrc.indexOf('vsp') >= 0,
      srcLen: bvSrc.length,
      srcStart: bvSrc.substring(0, 100),
    };
  });
  console.log('=== VIRUS FIX CHECK ===');
  console.log(JSON.stringify(fixCheck));

  // Start game
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy'; startGame();
  });
  await page.waitForTimeout(3000);

  // CHECK 2: Viruses at T=0, T=15, T=30 — track movement
  console.log('\n=== VIRUS TIMELINE ===');
  for (var t = 0; t <= 30; t += 5) {
    var snap = await page.evaluate(() => {
      var v = viruses || [];
      var speeds = v.map(x => Math.sqrt(x.vx*x.vx + x.vy*x.vy));
      var avgSpeed = speeds.length ? speeds.reduce((a,b)=>a+b,0)/speeds.length : 0;
      var moving = speeds.filter(s => s > 0.05).length;
      return {
        count: v.length,
        moving: moving,
        avgSpeed: Math.round(avgSpeed*100)/100,
        maxSpeed: speeds.length ? Math.round(Math.max(...speeds)*100)/100 : 0,
        infected: (orgs||[]).filter(o => o.infectionT > 0).length,
      };
    });
    console.log('T=' + t + 's: ' + JSON.stringify(snap));
    if (t < 30) await page.waitForTimeout(5000);
  }

  // CHECK 3: Colonies at start (reload)
  await page.evaluate(() => { location.reload(); });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy'; startGame();
  });
  await page.waitForTimeout(3000);
  const colonies = await page.evaluate(() => {
    var c = (orgs||[]).filter(o => o.alive && o.sp && o.sp.shape === 'colony');
    var colonySpecies = (orgs||[]).filter(o => o.alive && o.sp && o.sp.noRandomSpawn);
    return { colonyShape: c.length, noRandomSpawn: colonySpecies.length, names: colonySpecies.map(o=>o.sp.name) };
  });
  console.log('\n=== COLONIES ===');
  console.log(JSON.stringify(colonies));

  // CHECK 4: Camera — 15s, detailed
  console.log('\n=== CAMERA 15s ===');
  var camIssues = 0;
  for (var t = 0; t <= 15; t += 3) {
    var cam = await page.evaluate(() => ({
      pAlive: player ? player.alive : false,
      dx: player ? Math.round(Math.abs(cam.x - player.x)) : -1,
      dy: player ? Math.round(Math.abs(cam.y - player.y)) : -1,
      focus: window.focusTarget ? 'HIJACK' : 'ok',
    }));
    if (!cam.pAlive || cam.dx > 200) camIssues++;
    console.log('t=' + t + ': ' + JSON.stringify(cam));
    if (t < 15) await page.waitForTimeout(3000);
  }
  console.log('camIssues:', camIssues);

  // CHECK 5: Bioicons — ready + draw calls + drawSz verification
  console.log('\n=== BIOICONS ===');
  var bio = await page.evaluate(() => {
    var src = window.drawBioicon ? window.drawBioicon.toString() : 'NOT_FOUND';
    return {
      ready: window.bioiconsReady ? window.bioiconsReady() : 'NO_FN',
      hasDrawSz: src.indexOf('sz*8') >= 0,
      hasSz45: src.indexOf('sz*4.5') >= 0,
      srcSnip: src.substring(src.indexOf('drawSz'), src.indexOf('drawSz')+80),
    };
  });
  console.log(JSON.stringify(bio));

  // CHECK 6: Niche survival at T=30
  console.log('\n=== NICHE SURVIVAL T=30 ===');
  // Run 30s of simulation
  for (var i = 0; i < 30; i++) await page.waitForTimeout(1000);
  var niches = await page.evaluate(() => {
    var cats = {};
    (orgs||[]).filter(o => o.alive).forEach(o => {
      var c = o.sp.cat || 'unknown';
      if (!cats[c]) cats[c] = { count: 0, minE: 999, names: {} };
      cats[c].count++;
      cats[c].minE = Math.min(cats[c].minE, o.energy || 0);
      var n = o.sp.name;
      cats[n] = cats[n] || 0; cats[n]++;
    });
    // Simplify
    var result = {};
    Object.keys(cats).forEach(k => { if(typeof cats[k]==='object') result[k] = cats[k].count; });
    return { totalAlive: (orgs||[]).filter(o=>o.alive).length, byCat: result };
  });
  console.log(JSON.stringify(niches));

  // CHECK 7: JS errors
  console.log('\n=== ERRORS ===');
  console.log('count:', errs.length);
  errs.forEach(e => console.log('  ' + e.substring(0,150)));

  // Screenshots both modes
  await page.evaluate(() => { settings.renderMode='bioicons'; applyRenderMode(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BRUTAL-BIO.png' });

  await page.evaluate(() => { settings.renderMode='cartoon'; applyRenderMode(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BRUTAL-CARTOON.png' });

  console.log('\nDONE');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
