const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('console', m => { if(m.type()==='error') errs.push(m.text().substring(0,300)); });
  page.on('pageerror', e => errs.push('PAGE: ' + e.message.substring(0,300)));

  await page.goto('https://igraspore.pages.dev?v=b2' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // CODE VERSION CHECK
  const code = await page.evaluate(() => {
    var src = document.documentElement.outerHTML;
    return {
      hasBrownian: src.includes('Brownian'),
      hasVirusFix: src.includes('vsp<0.3') || src.includes('vsp < 0.3'),
      hasNewDrawSz: src.includes('sz*8'),
      bioReady: window.bioiconsReady ? window.bioiconsReady() : 'MISSING',
    };
  });
  console.log('=== CODE VERSION ===');
  console.log(JSON.stringify(code));

  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy'; startGame();
  });
  await page.waitForTimeout(3000);

  // VIRUS TEST — 40 seconds, the real test
  console.log('\n=== VIRUS LIFECYCLE (40s) ===');
  for (var t = 0; t <= 40; t += 5) {
    var vs = await page.evaluate(() => {
      var v = viruses||[];
      var moving = v.filter(x => Math.sqrt(x.vx*x.vx+x.vy*x.vy) > 0.1).length;
      var avgSpeed = v.length ? v.reduce((s,x)=>s+Math.sqrt(x.vx*x.vx+x.vy*x.vy),0)/v.length : 0;
      return {
        count: v.length,
        moving: moving,
        avgSpeed: Math.round(avgSpeed*100)/100,
        infected: (orgs||[]).filter(o=>o.infectionT>0).length,
      };
    });
    var status = vs.moving > 0 ? '✅' : '❌ FROZEN';
    console.log('t=' + t + 's: ' + vs.count + ' virus, ' + vs.moving + ' moving, speed=' + vs.avgSpeed + ', infected=' + vs.infected + ' ' + status);
    if (t < 40) await page.evaluate(() => { for(var i=0;i<5*30;i++) updateWorld(1/30); });
  }

  // CAMERA
  console.log('\n=== CAMERA (20s) ===');
  var camBad = 0;
  for (var t = 0; t < 20; t += 2) {
    var cam = await page.evaluate(() => {
      var p = player;
      if (!p || !p.alive) return { dead: true };
      return { dx: Math.round(Math.abs(cam.x-p.x)), dy: Math.round(Math.abs(cam.y-p.y)), focus: window.focusTarget?'HIJACK':'ok' };
    });
    if (cam.dead || cam.focus==='HIJACK') camBad++;
    if (!cam.dead) console.log('t=' + t + 's: dx=' + cam.dx + ' dy=' + cam.dy + ' ' + cam.focus);
    else console.log('t=' + t + 's: PLAYER DEAD');
    if (t < 18) await page.evaluate(() => { for(var i=0;i<2*30;i++) updateWorld(1/30); });
  }
  console.log('Camera failures:', camBad + '/10');

  // COLONIES
  const colonies = await page.evaluate(() => (orgs||[]).filter(o=>o.alive&&o.sp.shape==='colony').length);
  console.log('\n=== COLONIES: ' + colonies + ' ===');

  // ERRORS
  console.log('\n=== ERRORS: ' + errs.length + ' ===');
  errs.slice(0,5).forEach(e => console.log('  ' + e));

  // SCREENSHOTS
  await page.evaluate(() => { settings.renderMode='bioicons'; applyRenderMode(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BRUTAL2-BIO.png' });

  await page.evaluate(() => { settings.renderMode='cartoon'; applyRenderMode(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BRUTAL2-CARTOON.png' });

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
