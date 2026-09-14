
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  
  const errors = [];
  const warnings = [];
  page.on('pageerror', e => errors.push('PAGE_ERROR: ' + e.message));
  page.on('console', msg => {
    if(msg.type()==='error') errors.push('CONSOLE_ERROR: ' + msg.text());
    if(msg.type()==='warning') warnings.push('CONSOLE_WARN: ' + msg.text());
  });
  
  const url = 'https://igraspore.pages.dev/?v=20260811132709';
  console.log('=== Loading:', url, '===');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  const results = {};
  
  // ===== TEST 1: Render mode cycle (cartoon → bioicons → swiss → cartoon) =====
  console.log('\n--- TEST 1: Render mode cycle ---');
  const modes = [];
  for(let i=0; i<4; i++){
    const before = await page.evaluate(() => settings.renderMode);
    await page.click('#renderModeBtn');
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => settings.renderMode);
    modes.push(before + ' → ' + after);
  }
  results.renderCycle = modes;
  // Check realistic is NOT in cycle
  const hasRealistic = modes.some(m => m.includes('realistic'));
  results.renderCycle_realisticRemoved = !hasRealistic ? 'PASS' : 'FAIL: realistic in cycle';
  
  // ===== TEST 2: Swiss mode — green clouds OFF =====
  console.log('\n--- TEST 2: Swiss green cloud check ---');
  await page.evaluate(() => {
    settings.renderMode = 'swiss';
    window._rmodeUserPicked = true;
    if(typeof applyRenderMode === 'function') applyRenderMode();
    if(typeof loadSwissSprites === 'function') loadSwissSprites();
  });
  await page.waitForTimeout(3000);
  // Start a game
  await page.evaluate(() => { selSpecies = 0; if(typeof startGame==='function') startGame(false); });
  await page.waitForTimeout(3000);
  
  // Pixel analysis: check green dominance
  const greenAnalysis = await page.evaluate(() => {
    var cv = document.getElementById('c');
    if(!cv) return {error:'no canvas'};
    var ctx = cv.getContext('2d');
    var w = cv.width, h = cv.height;
    var data = ctx.getImageData(0, 0, w, h).data;
    var green = 0, total = 0;
    for(var i=0; i<data.length; i+=16){ // sample every 4th pixel
      var r=data[i], g=data[i+1], b=data[i+2];
      total++;
      // "Green cloud" = high green, low blue, medium-low red
      if(g > 120 && g > r+30 && g > b+20 && r < 100) green++;
    }
    return { greenPct: (green/total*100).toFixed(1), total: total, green: green };
  });
  results.greenClouds = greenAnalysis.greenPct < 5 ? 'PASS ('+greenAnalysis.greenPct+'%)' : 'WARN ('+greenAnalysis.greenPct+'%)';
  
  // ===== TEST 3: Virus speed cap =====
  console.log('\n--- TEST 3: Virus speed ---');
  await page.waitForTimeout(5000); // let viruses move
  const virusSpeeds = await page.evaluate(() => {
    if(!viruses || !viruses.length) return {error:'no viruses', count:0};
    var maxSp = 0, speeds = [];
    for(var i=0; i<viruses.length; i++){
      var v = viruses[i];
      var sp = Math.sqrt(v.vx*v.vx + v.vy*v.vy);
      speeds.push(sp.toFixed(3));
      if(sp > maxSp) maxSp = sp;
    }
    return { count: viruses.length, maxSpeed: maxSp.toFixed(3), cap: maxSp <= 0.26 ? 'PASS' : 'FAIL', sample: speeds.slice(0,10) };
  });
  results.virusSpeed = virusSpeeds;
  
  // ===== TEST 4: Sessile organisms don't move =====
  console.log('\n--- TEST 4: Sessile check ---');
  const sessileTest = await page.evaluate(() => {
    // Find Vorticella in orgs
    var sessile = [], mobile = [];
    for(var i=0; i<orgs.length && (sessile.length<3 || mobile.length<3); i++){
      var o = orgs[i];
      if(!o.alive) continue;
      if(o.sp && /Vorticella|Zoothamnium|Opercularia/i.test(o.sp.name)){
        sessile.push({name: o.sp.name, x: o.x.toFixed(1), y: o.y.toFixed(1), vx: o.vx.toFixed(4), vy: o.vy.toFixed(4)});
      }
      if(o.sp && o.sp.name === 'Stentor coeruleus'){
        mobile.push({name: o.sp.name, x: o.x.toFixed(1), y: o.y.toFixed(1), vx: o.vx.toFixed(4), vy: o.vy.toFixed(4)});
      }
    }
    return { sessile: sessile, stentorMobile: mobile };
  });
  results.sessile = sessileTest;
  
  // ===== TEST 5: Species selection — virus click =====
  console.log('\n--- TEST 5: Virus selection flow ---');
  // Go back to menu
  await page.evaluate(() => {
    state = 'menu';
    document.getElementById('menuO').className = 'ov show';
    document.getElementById('hud').style.display = 'none';
  });
  await page.waitForTimeout(500);
  // Click virus category
  await page.evaluate(() => {
    selCat = 'virus';
    if(typeof buildSpeciesGrid === 'function') buildSpeciesGrid();
  });
  await page.waitForTimeout(500);
  const virusCards = await page.evaluate(() => {
    var cards = document.querySelectorAll('#spGrid .sc');
    return { count: cards.length, names: Array.from(cards).map(c => c.querySelector('.scN')?.textContent?.trim()?.substring(0,30)) };
  });
  results.virusCards = virusCards;
  
  // Click first virus card
  await page.evaluate(() => {
    var card = document.querySelector('#spGrid .sc');
    if(card) card.click();
  });
  await page.waitForTimeout(500);
  const selSpeciesVal = await page.evaluate(() => selSpecies);
  results.virusSelected = selSpeciesVal >= 100 ? 'PASS (selSpecies='+selSpeciesVal+')' : 'FAIL (selSpecies='+selSpeciesVal+')';
  
  // ===== TEST 6: Start as virus → spectator mode =====
  console.log('\n--- TEST 6: Start as virus ---');
  await page.evaluate(() => { if(typeof startGame==='function') startGame(false); });
  await page.waitForTimeout(2000);
  const virusGameState = await page.evaluate(() => ({
    virusPlayer: window.virusPlayer,
    playerIsNull: player === null,
    freeCam: freeCam,
    state: state,
    virusCount: viruses.length,
    orgCount: orgs.filter(o=>o.alive).length
  }));
  results.virusStartMode = virusGameState;
  
  // ===== TEST 7: Click to infect in virus mode =====
  console.log('\n--- TEST 7: Click to infect ---');
  // Find a bacterium on screen and click it
  const infectResult = await page.evaluate(() => {
    // Find a producer/consumer1 near center
    var target = null;
    for(var i=0; i<orgs.length; i++){
      var o = orgs[i];
      if(!o.alive || o.infected) continue;
      if(o.sp.cat === 'producer' || o.sp.cat === 'consumer1'){
        // Check if on screen
        var sx = cv.width/2 + (o.x - cam.x) * zoom;
        var sy = cv.height/2 + (o.y - cam.y) * zoom;
        if(sx > 100 && sx < cv.width-100 && sy > 100 && sy < cv.height-100){
          target = { o: o, sx: sx, sy: sy };
          break;
        }
      }
    }
    if(!target) return { error: 'no target on screen' };
    var beforeInfected = orgs.filter(o=>o.infected).length;
    // Dispatch click
    var rect = cv.getBoundingClientRect();
    var ev = new MouseEvent('mousedown', {
      clientX: rect.left + target.sx,
      clientY: rect.top + target.sy,
      button: 0,
      bubbles: true
    });
    cv.dispatchEvent(ev);
    return { 
      targetFound: target.o.sp.name,
      beforeInfected: beforeInfected,
      sx: target.sx.toFixed(0),
      sy: target.sy.toFixed(0)
    };
  });
  await page.waitForTimeout(1000);
  const afterInfect = await page.evaluate(() => orgs.filter(o=>o.infected).length);
  results.clickInfect = {
    target: infectResult.targetFound || infectResult.error,
    infectedBefore: infectResult.beforeInfected,
    infectedAfter: afterInfect,
    result: afterInfect > (infectResult.beforeInfected||0) ? 'PASS' : 'NEED_MANUAL_CHECK'
  };
  
  // ===== TEST 8: Swiss sprite count =====
  console.log('\n--- TEST 8: Swiss sprites ---');
  const swissState = await page.evaluate(() => ({
    ready: typeof swissReady==='function' ? swissReady() : '?',
    shapesList: typeof SHAPES !== 'undefined' && typeof SHAPES !== 'function' ? SHAPES : '?',
    coverage: typeof swissCoverageStats === 'function' ? swissCoverageStats() : 'no fn'
  }));
  results.swissSprites = swissState;
  
  // ===== TEST 9: Keyboard — RU layout (e.code) =====
  console.log('\n--- TEST 9: RU keyboard ---');
  // Start normal game
  await page.evaluate(() => {
    window.virusPlayer = false;
    selSpecies = 0;
    if(typeof startGame==='function') startGame(false);
  });
  await page.waitForTimeout(2000);
  
  // Press KeyW (physical position = Ц on RU layout)
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(500);
  const wResult = await page.evaluate(() => ({
    keysW: keys['w'],
    playerVx: player ? player.vx.toFixed(3) : 'no player',
    playerY: player ? player.y.toFixed(1) : 'no player',
    freeCam: freeCam
  }));
  await page.keyboard.up('KeyW');
  results.ruKeyboard = wResult.keysW === true ? 'PASS (KeyW → keys.w = true)' : 'FAIL';
  
  // ===== TEST 10: Population stability (20s sim) =====
  console.log('\n--- TEST 10: Population stability ---');
  const popStart = await page.evaluate(() => orgs.filter(o=>o.alive).length);
  await page.waitForTimeout(20000); // 20 seconds
  const popEnd = await page.evaluate(() => ({
    alive: orgs.filter(o=>o.alive).length,
    niches: (() => {
      var cats = {};
      orgs.forEach(o => { if(o.alive) cats[o.sp.cat] = (cats[o.sp.cat]||0)+1; });
      return cats;
    })(),
    playerAlive: player ? player.alive : false,
    virusCount: viruses.length
  }));
  results.population = {
    start: popStart,
    end: popEnd.alive,
    niches: popEnd.niches,
    playerAlive: popEnd.playerAlive,
    stable: popEnd.alive > popStart * 0.3 ? 'PASS' : 'WARN (population crash)',
    nichesAlive: Object.keys(popEnd.niches).length
  };
  
  // ===== FINAL: Error summary =====
  results.errors = errors;
  results.warnings = warnings.slice(0, 10);
  
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
