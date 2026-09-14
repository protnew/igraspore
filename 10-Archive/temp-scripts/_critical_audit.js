const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('console', m => { if(m.type()==='error') errs.push(m.text().substring(0,250)); });
  page.on('pageerror', e => errs.push('PAGE: ' + e.message.substring(0,250)));

  // Fresh load
  await page.goto('https://igraspore.pages.dev?v=crit' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  // CHECK 1: Is the deployed HTML the new version?
  const htmlCheck = await page.evaluate(() => ({
    hasBioicons: typeof window.drawBioicon === 'function',
    bioiconsReady: typeof window.bioiconsReady === 'function' ? window.bioiconsReady() : 'N/A',
    bioDebug: window._bioDebug,
  }));
  console.log('=== CHECK 1: DEPLOYED VERSION ===');
  console.log(JSON.stringify(htmlCheck));

  // Start game
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy';
    startGame();
  });
  await page.waitForTimeout(3000);

  // CHECK 2: Colonies at start
  const colonies = await page.evaluate(() => {
    return (orgs||[]).filter(o => o.alive && o.sp && o.sp.shape === 'colony').map(o => o.sp.name);
  });
  console.log('\n=== CHECK 2: COLONIES ===');
  console.log('Colonies at start:', JSON.stringify(colonies), 'count:', colonies.length);

  // CHECK 3: Camera stability — track for 20 seconds
  console.log('\n=== CHECK 3: CAMERA (20s) ===');
  var camIssues = 0;
  for (var t = 0; t < 20; t += 2) {
    await page.evaluate(() => { for(var i=0;i<2*30;i++) updateWorld(1/30); });
    var snap = await page.evaluate(() => ({
      pAlive: player ? player.alive : false,
      pName: player ? player.sp.name : 'NULL',
      camOnPlayer: player ? Math.abs(cam.x - player.x) < 150 : false,
      focus: window.focusTarget ? 'HIJACK' : 'ok',
      freeCam: freeCam,
    }));
    if (!snap.camOnPlayer || snap.focus === 'HIJACK') camIssues++;
    console.log('t=' + (t+2) + 's: ' + JSON.stringify(snap));
  }
  console.log('Camera issues:', camIssues);

  // CHECK 4: Viruses
  console.log('\n=== CHECK 4: VIRUSES ===');
  const vBefore = await page.evaluate(() => ({
    count: (viruses||[]).length,
    infected: (orgs||[]).filter(o => o.infectionT > 0).length,
    sample: viruses && viruses.length ? { vx: Math.round(viruses[0].vx*100)/100, vy: Math.round(viruses[0].vy*100)/100 } : null,
  }));
  console.log('Before:', JSON.stringify(vBefore));
  // Run 10 more seconds for lysis
  await page.evaluate(() => { for(var i=0;i<10*30;i++) updateWorld(1/30); });
  const vAfter = await page.evaluate(() => ({
    count: (viruses||[]).length,
    infected: (orgs||[]).filter(o => o.infectionT > 0).length,
  }));
  console.log('After 10s:', JSON.stringify(vAfter));

  // CHECK 5: Render modes — does the button cycle through 3?
  console.log('\n=== CHECK 5: RENDER MODES ===');
  await page.evaluate(() => { settings.renderMode = 'cartoon'; applyRenderMode(); });
  var mode1 = await page.evaluate(() => settings.renderMode);
  console.log('Set cartoon:', mode1);
  await page.evaluate(() => { settings.renderMode = 'bioicons'; applyRenderMode(); });
  var mode2 = await page.evaluate(() => settings.renderMode);
  var bioCheck = await page.evaluate(() => window.bioiconsReady());
  console.log('Set bioicons:', mode2, 'ready:', bioCheck);
  await page.evaluate(() => { settings.renderMode = 'realistic'; applyRenderMode(); });
  var mode3 = await page.evaluate(() => settings.renderMode);
  console.log('Set realistic:', mode3);

  // CHECK 6: Mobile UI coverage
  console.log('\n=== CHECK 6: MOBILE UI ===');
  const ui = await page.evaluate(() => {
    var els = {};
    ['renderModeBtn','actBar','leftContainer','keyHint','mActs','mJoy','mTop','mActEat','mActDiv','mActAuto','mActZoom'].forEach(function(id){
      var el = document.getElementById(id);
      if(el){
        var r = el.getBoundingClientRect();
        els[id] = Math.round(r.width)+'x'+Math.round(r.height);
      } else els[id] = 'NULL';
    });
    return { vw: window.innerWidth, vh: window.innerHeight, els };
  });
  console.log('Viewport:', ui.vw + 'x' + ui.vh);
  Object.keys(ui.els).forEach(k => console.log('  ' + k + ': ' + ui.els[k]));

  // CHECK 7: drawBioicon actually called during render?
  console.log('\n=== CHECK 7: BIOICONS RENDER CALLS ===');
  await page.evaluate(() => { settings.renderMode = 'bioicons'; applyRenderMode(); });
  await page.waitForTimeout(500);
  const calls = await page.evaluate(() => {
    var orig = window.drawBioicon;
    var n = 0;
    window.drawBioicon = function() { n++; return orig.apply(this, arguments); };
    render();
    window.drawBioicon = orig;
    return n;
  });
  console.log('drawBioicon calls per render():', calls);

  // Screenshots
  await page.evaluate(() => { settings.renderMode = 'bioicons'; applyRenderMode(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/CRIT-MOB-BIO.png' });

  await page.evaluate(() => { settings.renderMode = 'cartoon'; applyRenderMode(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/CRIT-MOB-CARTOON.png' });

  console.log('\n=== ERRORS ===');
  console.log('Count:', errs.length);
  errs.forEach(e => console.log('  ' + e));

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
