const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('console', m => { if(m.type()==='error') errs.push(m.text().substring(0,300)); });
  page.on('pageerror', e => errs.push('PAGE: ' + e.message.substring(0,300)));

  await page.goto('https://igraspore.pages.dev?v=real' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  // Start game FIRST, then switch to bioicons
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy';
    startGame();
  });
  await page.waitForTimeout(1000);

  // NOW switch to bioicons (after startGame reset)
  await page.evaluate(() => {
    window._rmodeUserPicked = true;
    settings.renderMode = 'bioicons';
    applyRenderMode();
  });
  await page.waitForTimeout(3000);

  // VERIFY mode is actually bioicons
  const mode = await page.evaluate(() => settings.renderMode);
  console.log('renderMode:', mode);

  // VERIFY drawBioicon is called
  const calls = await page.evaluate(() => {
    var orig = window.drawBioicon;
    var n = 0;
    window.drawBioicon = function() { n++; return orig.apply(this, arguments); };
    render();
    window.drawBioicon = orig;
    return n;
  });
  console.log('drawBioicon calls:', calls);

  // Population
  const pop = await page.evaluate(() => {
    var alive = (orgs||[]).filter(o=>o.alive);
    var cats = {};
    alive.forEach(o => { cats[o.sp.cat] = (cats[o.sp.cat]||0)+1; });
    return { total: alive.length, cats };
  });
  console.log('Population:', JSON.stringify(pop));

  // Player
  const pinfo = await page.evaluate(() => {
    if(!player) return null;
    return { name: player.sp.name, shape: player.sp.shape, energy: Math.round(player.energy), size: player.size };
  });
  console.log('Player:', JSON.stringify(pinfo));

  // Speeds
  const speeds = await page.evaluate(() => {
    var r = {};
    ['producer','consumer1','consumer2','consumer3','decomposer'].forEach(c => {
      var s = (orgs||[]).filter(o => o.alive && o.sp.cat===c).slice(0,5);
      var sp = s.map(o => Math.round(Math.sqrt(o.vx*o.vx+o.vy*o.vy)*100)/100);
      r[c] = sp.length ? sp[0] : 'none';
    });
    return r;
  });
  console.log('Speeds:', JSON.stringify(speeds));

  // Viruses
  const vCheck = await page.evaluate(() => {
    var v = viruses||[];
    var sp = v.map(x => Math.sqrt(x.vx*x.vx+x.vy*x.vy));
    return {
      count: v.length,
      moving: sp.filter(s => s > 0.05).length,
      avgSpeed: sp.length ? Math.round(sp.reduce((a,b)=>a+b,0)/sp.length*100)/100 : 0,
      infected: (orgs||[]).filter(o => o.infectionT > 0).length,
    };
  });
  console.log('Viruses:', JSON.stringify(vCheck));

  // Eating test
  var eatBefore = await page.evaluate(() => player ? Math.round(player.energy) : -1);
  await page.evaluate(() => { for(var i=0;i<10*30;i++) updateWorld(1/30); });
  var eatAfter = await page.evaluate(() => player ? Math.round(player.energy) : -1);
  console.log('Energy before/after 10s:', eatBefore, '→', eatAfter);

  // Division test
  var popBefore = await page.evaluate(() => (orgs||[]).filter(o=>o.alive).length);
  await page.evaluate(() => { for(var i=0;i<20*30;i++) updateWorld(1/30); });
  var popAfter = await page.evaluate(() => (orgs||[]).filter(o=>o.alive).length);
  console.log('Population 20s:', popBefore, '→', popAfter);

  // Day/night
  const tod = await page.evaluate(() => Math.round(tod*10)/10);
  console.log('tod:', tod, tod < 6 || tod > 18 ? 'NIGHT' : 'DAY');

  // Errors
  console.log('Errors:', errs.length);
  errs.forEach(e => console.log('  ' + e.substring(0,200)));

  // Screenshots
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIO-REAL-MOB.png' });

  // Zoom in
  await page.evaluate(() => { zoom = 5.0; tZoom = 5.0; if(player){cam.x=player.x;cam.y=player.y;} });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIO-REAL-ZOOM.png' });

  console.log('DONE');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
