const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('console', m => { if(m.type()==='error') errs.push(m.text().substring(0,300)); });
  page.on('pageerror', e => errs.push('PAGE: ' + e.message.substring(0,300)));

  await page.goto('https://igraspore.pages.dev?v=full' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  // Set bioicons BEFORE starting game
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    settings.renderMode = 'bioicons';
    difficulty = 'easy';
    startGame();
  });
  await page.waitForTimeout(3000);

  // CHECK 1: Mode confirmed
  const mode = await page.evaluate(() => settings.renderMode);
  console.log('=== MODE ===');
  console.log('renderMode:', mode);

  // CHECK 2: Population breakdown
  const pop = await page.evaluate(() => {
    var alive = (orgs||[]).filter(o=>o.alive);
    var cats = {};
    alive.forEach(o => { cats[o.sp.cat] = (cats[o.sp.cat]||0)+1; });
    return { total: alive.length, cats, player: player ? player.sp.name : 'NULL' };
  });
  console.log('\n=== POPULATION ===');
  console.log(JSON.stringify(pop));

  // CHECK 3: Player status
  const player = await page.evaluate(() => {
    if(!player) return null;
    return {
      name: player.sp.name,
      cat: player.sp.cat,
      shape: player.sp.shape,
      energy: Math.round(player.energy),
      mass: Math.round(player.mass*10)/10,
      size: Math.round(player.size*10)/10,
      alive: player.alive,
      infected: player.infected || false,
    };
  });
  console.log('\n=== PLAYER ===');
  console.log(JSON.stringify(player));

  // CHECK 4: drawBioicon actually called during render
  const calls = await page.evaluate(() => {
    var orig = window.drawBioicon;
    var n = 0;
    var virusCalls = 0;
    window.drawBioicon = function() { n++; return orig.apply(this, arguments); };
    if(window.drawVirusBioicon){
      var vorig = window.drawVirusBioicon;
      window.drawVirusBioicon = function() { virusCalls++; return vorig.apply(this, arguments); };
    }
    render();
    window.drawBioicon = orig;
    return { bioCalls: n, virusCalls };
  });
  console.log('\n=== RENDER CALLS ===');
  console.log('drawBioicon:', calls.bioCalls, 'drawVirusBioicon:', calls.virusCalls);

  // CHECK 5: Speeds — hierarchy test
  const speeds = await page.evaluate(() => {
    var result = {};
    var cats = ['producer','consumer1','consumer2','consumer3','decomposer'];
    cats.forEach(c => {
      var sample = (orgs||[]).filter(o => o.alive && o.sp.cat === c).slice(0, 5);
      var sp = sample.map(o => Math.round(Math.sqrt(o.vx*o.vx+o.vy*o.vy)*100)/100);
      result[c] = sp.length ? { speeds: sp, avg: Math.round(sp.reduce((a,b)=>a+b,0)/sp.length*100)/100 } : null;
    });
    return result;
  });
  console.log('\n=== SPEED HIERARCHY ===');
  Object.keys(speeds).forEach(k => {
    console.log(k + ':', speeds[k] ? JSON.stringify(speeds[k]) : 'EMPTY');
  });

  // CHECK 6: Eating test — run 10s, check energy changes
  console.log('\n=== EATING (10s) ===');
  var eatBefore = await page.evaluate(() => {
    var p = player;
    if(!p) return null;
    return { energy: Math.round(p.energy), mass: Math.round(p.mass*10)/10, foodPool: typeof foodPool !== 'undefined' ? foodPool.length : 'N/A' };
  });
  console.log('Before:', JSON.stringify(eatBefore));
  await page.evaluate(() => { for(var i=0;i<10*30;i++) updateWorld(1/30); });
  var eatAfter = await page.evaluate(() => {
    var p = player;
    if(!p) return null;
    var fed = (orgs||[]).filter(o => o.alive && o.energy > 50).length;
    return { energy: Math.round(p.energy), mass: Math.round(p.mass*10)/10, fed: fed };
  });
  console.log('After 10s:', JSON.stringify(eatAfter));

  // CHECK 7: Division test
  console.log('\n=== DIVISION ===');
  var divBefore = await page.evaluate(() => {
    return {
      playerDivs: player ? player.divisions : -1,
      totalDivs: (orgs||[]).filter(o => o.dividing).length,
    };
  });
  console.log('Before:', JSON.stringify(divBefore));
  // Run 20 more seconds for divisions
  await page.evaluate(() => { for(var i=0;i<20*30;i++) updateWorld(1/30); });
  var divAfter = await page.evaluate(() => {
    return {
      playerDivs: player ? player.divisions : -1,
      totalPop: (orgs||[]).filter(o => o.alive).length,
    };
  });
  console.log('After 20s:', JSON.stringify(divAfter));

  // CHECK 8: Viruses in bioicons mode
  console.log('\n=== VIRUSES ===');
  var vCheck = await page.evaluate(() => {
    var v = viruses||[];
    var speeds = v.map(x => Math.sqrt(x.vx*x.vx+x.vy*x.vy));
    var avgSp = speeds.length ? speeds.reduce((a,b)=>a+b,0)/speeds.length : 0;
    return {
      count: v.length,
      moving: speeds.filter(s => s > 0.05).length,
      avgSpeed: Math.round(avgSp*100)/100,
      infected: (orgs||[]).filter(o => o.infectionT > 0).length,
    };
  });
  console.log(JSON.stringify(vCheck));

  // CHECK 9: Day/night cycle
  console.log('\n=== DAY/NIGHT ===');
  var tod = await page.evaluate(() => Math.round(tod*10)/10);
  console.log('tod:', tod, tod < 6 || tod > 18 ? 'NIGHT' : 'DAY');

  // CHECK 10: HUD elements
  console.log('\n=== HUD ===');
  var hud = await page.evaluate(() => {
    var result = {};
    ['mJoy','mActs','mTop'].forEach(function(id){
      var el = document.getElementById(id);
      result[id] = el ? (Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height)) : 'NULL';
    });
    // Check energy bar
    var eb = document.getElementById('energyBar');
    result.energyBar = eb ? Math.round(eb.getBoundingClientRect().width) + 'px' : 'NULL';
    result.playerAlive = player ? player.alive : false;
    return result;
  });
  console.log(JSON.stringify(hud));

  // CHECK 11: Errors
  console.log('\n=== ERRORS ===');
  console.log('count:', errs.length);
  errs.forEach(e => console.log('  ' + e.substring(0,200)));

  // Screenshots
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIO-FULL-PLAY.png' });

  // Zoom in screenshot
  await page.evaluate(() => {
    zoom = 4.0; tZoom = 4.0;
    if(player){ cam.x = player.x; cam.y = player.y; }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIO-FULL-ZOOM.png' });

  console.log('\nDONE');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
