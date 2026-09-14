const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); // MOBILE
  const errs = [];
  page.on('console', m => { if(m.type()==='error') errs.push(m.text().substring(0,200)); });
  page.on('pageerror', e => errs.push('PAGE: ' + e.message.substring(0,200)));

  await page.goto('https://igraspore.pages.dev?v=audit' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  // ===== AUDIT 1: Start game fresh =====
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof startGame === 'function') startGame();
  });
  await page.waitForTimeout(3000);

  const s0 = await page.evaluate(() => {
    // COLONIES at start?
    var colonies = (orgs||[]).filter(o => o.alive && o.sp && o.sp.shape === 'colony');
    var colonyNames = colonies.map(o => o.sp.name);

    // PLAYER species
    var playerInfo = player ? {
      name: player.sp.name,
      cat: player.sp.cat,
      shape: player.sp.shape,
      isColony: player.sp.shape === 'colony',
      alive: player.alive,
    } : null;

    // CAM stability
    var camInfo = {
      camX: Math.round(cam.x), camY: Math.round(cam.y),
      playerX: player ? Math.round(player.x) : null,
      playerY: player ? Math.round(player.y) : null,
      camOnPlayer: player ? (Math.abs(cam.x - player.x) < 100) : false,
      freeCam: freeCam,
      focusTarget: window.focusTarget ? 'HIJACKED' : 'null',
      focusTimer: window.focusTimer,
    };

    // VIRUSES
    var virusInfo = {
      count: (viruses||[]).length,
      sample: (viruses&&viruses.length) ? {
        x: Math.round(viruses[0].x), y: Math.round(viruses[0].y),
        vx: Math.round(viruses[0].vx*100)/100, vy: Math.round(viruses[0].vy*100)/100,
      } : null,
    };

    // INFECTED
    var infected = (orgs||[]).filter(o => o.infectionT > 0);

    // ALL SPECIES at start - count by category
    var cats = {};
    (orgs||[]).forEach(o => {
      if(!o.alive) return;
      var c = o.sp.cat;
      if(!cats[c]) cats[c] = { count: 0, shapes: {} };
      cats[c].count++;
      var sh = o.sp.shape;
      cats[c].shapes[sh] = (cats[c].shapes[sh]||0) + 1;
    });

    return { colonyNames, playerInfo, camInfo, virusInfo, infected: infected.length, cats };
  });
  console.log('=== AUDIT 1: FRESH START ===');
  console.log('Colonies at start:', JSON.stringify(s0.colonyNames));
  console.log('Player:', JSON.stringify(s0.playerInfo));
  console.log('Camera:', JSON.stringify(s0.camInfo));
  console.log('Viruses:', JSON.stringify(s0.virusInfo));
  console.log('Infected cells:', s0.infected);
  console.log('Categories:', JSON.stringify(s0.cats, null, 1));

  // ===== AUDIT 2: Run 15 seconds, check what breaks =====
  console.log('\n=== AUDIT 2: 15s RUN ===');
  var prevPlayer = s0.playerInfo ? s0.playerInfo.name : null;
  for (var t = 3; t <= 15; t += 3) {
    await page.evaluate(() => { for(var i=0;i<3*30;i++) updateWorld(1/30); });
    var snap = await page.evaluate(() => {
      var v = viruses||[];
      var inf = (orgs||[]).filter(o => o.infectionT > 0).length;
      var alive = (orgs||[]).filter(o => o.alive).length;
      var cats2 = {};
      (orgs||[]).forEach(o => { if(o.alive) cats2[o.sp.cat] = (cats2[o.sp.cat]||0)+1; });
      return {
        playerAlive: player ? player.alive : false,
        playerName: player ? player.sp.name : 'NULL',
        playerChanged: player ? (player.sp.name !== prevPlayer) : true,
        camOnPlayer: player ? (Math.abs(cam.x - player.x) < 100) : false,
        focusTarget: window.focusTarget ? 'HIJACKED' : 'null',
        viruses: v.length,
        infected: inf,
        aliveCount: alive,
        cats: cats2,
      };
    });
    console.log('t=' + t + 's: ' + JSON.stringify(snap));
  }

  // ===== AUDIT 3: Screenshot mobile in CARTOON mode =====
  await page.evaluate(() => {
    settings.renderMode = 'cartoon';
    if (typeof applyRenderMode === 'function') applyRenderMode();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/AUDIT-MOB-CARTOON.png' });

  // ===== AUDIT 4: Switch to BIOICONS =====
  await page.evaluate(() => {
    settings.renderMode = 'bioicons';
    if (typeof applyRenderMode === 'function') applyRenderMode();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/AUDIT-MOB-BIOICONS.png' });

  // ===== AUDIT 5: Check render button text =====
  const btnText = await page.evaluate(() => {
    var btn = document.getElementById('renderModeBtn');
    return btn ? btn.textContent : 'NOT FOUND';
  });
  console.log('\nRender button text:', btnText);

  // ===== AUDIT 6: Mobile UI coverage =====
  const dims = await page.evaluate(() => {
    var els = {};
    ['renderModeBtn','actBar','leftContainer','keyHint','mActs','mJoy','mTop'].forEach(function(id){
      var el = document.getElementById(id);
      if(el){
        var r = el.getBoundingClientRect();
        els[id] = { w: Math.round(r.width), h: Math.round(r.height),
          display: getComputedStyle(el).display,
          visible: r.width > 0 && r.height > 0
        };
      } else { els[id] = null; }
    });
    return { vw: window.innerWidth, vh: window.innerHeight, els };
  });
  console.log('\n=== AUDIT 6: MOBILE UI ===');
  console.log('Viewport:', dims.vw + 'x' + dims.vh);
  Object.keys(dims.els).forEach(function(k){
    var e = dims.els[k];
    console.log('  ' + k + ': ' + (e ? JSON.stringify(e) : 'null'));
  });

  console.log('\nERRORS:', errs.length);
  errs.forEach(function(e){ console.log('  ' + e); });

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
