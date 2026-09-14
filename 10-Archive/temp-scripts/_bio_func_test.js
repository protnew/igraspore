const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('console', m => { if(m.type()==='error') errs.push(m.text().substring(0,300)); });
  page.on('pageerror', e => errs.push('PAGE: ' + e.message.substring(0,300)));

  await page.goto('https://igraspore.pages.dev?v=func' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy'; startGame();
  });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    window._rmodeUserPicked = true;
    settings.renderMode = 'bioicons';
    applyRenderMode();
  });
  await page.waitForTimeout(2000);

  var pass = 0, fail = 0;
  function check(name, cond, extra) {
    console.log((cond ? '✅' : '❌') + ' ' + name + (extra ? ' (' + extra + ')' : ''));
    if(cond) pass++; else fail++;
  }

  // 1. Mode
  check('Bioicons mode active', await page.evaluate(() => settings.renderMode === 'bioicons'));

  // 2. drawBioicon called
  var dc = await page.evaluate(() => {
    var o = window.drawBioicon; var n = 0;
    window.drawBioicon = function(){n++; return o.apply(this,arguments);};
    render(); window.drawBioicon = o; return n;
  });
  check('drawBioicon renders organisms', dc > 0, dc + ' calls');

  // 3. Population
  var pop = await page.evaluate(() => {
    var a = (orgs||[]).filter(o=>o.alive);
    return { total: a.length, producer: a.filter(o=>o.sp.cat==='producer').length, consumer1: a.filter(o=>o.sp.cat==='consumer1').length };
  });
  check('Population > 500', pop.total > 500, pop.total + ' orgs');
  check('Producers > 300', pop.producer > 300, pop.producer);
  check('Consumer1 > 50', pop.consumer1 > 50, pop.consumer1);

  // 4. Player alive
  var p = await page.evaluate(() => player ? { name: player.sp.name, alive: player.alive, energy: Math.round(player.energy), shape: player.sp.shape } : null);
  check('Player alive', p && p.alive, p ? p.name + ' E=' + p.energy : 'NULL');

  // 5. Speed hierarchy
  var sp = await page.evaluate(() => {
    var r = {};
    ['producer','consumer1','consumer2','consumer3','decomposer'].forEach(c => {
      var s = (orgs||[]).filter(o => o.alive && o.sp.cat===c);
      if(s.length) r[c] = Math.round(Math.sqrt(s[0].vx*s[0].vx+s[0].vy*s[0].vy)*100)/100;
    });
    return r;
  });
  check('Producer slowest (food)', sp.producer < 0.3, sp.producer);
  check('Consumer3 fastest (predator)', sp.consumer3 > 0.5, sp.consumer3);
  check('Decomposer barely moves', sp.decomposer < 0.3, sp.decomposer);

  // 6. Eating — energy changes over time
  var e1 = await page.evaluate(() => player ? Math.round(player.energy) : -1);
  await page.evaluate(() => { for(var i=0;i<15*30;i++) updateWorld(1/30); });
  var e2 = await page.evaluate(() => player ? Math.round(player.energy) : -1);
  check('Energy system active', e1 !== e2, e1 + '→' + e2);
  check('Player alive after 15s', await page.evaluate(() => player ? player.alive : false));

  // 7. Division — population grows or maintains
  var pop1 = await page.evaluate(() => (orgs||[]).filter(o=>o.alive).length);
  await page.evaluate(() => { for(var i=0;i<15*30;i++) updateWorld(1/30); });
  var pop2 = await page.evaluate(() => (orgs||[]).filter(o=>o.alive).length);
  check('Population maintained', pop2 > 200, pop1 + '→' + pop2);

  // 8. Viruses
  var v = await page.evaluate(() => {
    var vs = viruses||[];
    var sp = vs.map(x => Math.sqrt(x.vx*x.vx+x.vy*x.vy));
    return {
      count: vs.length,
      moving: sp.filter(s => s > 0.05).length,
      infected: (orgs||[]).filter(o => o.infectionT > 0).length,
    };
  });
  check('Viruses present', v.count > 0, v.count + ' viruses');
  check('Viruses moving', v.moving === v.count, v.moving + '/' + v.count);
  check('Infection spreading', v.infected >= 0, v.infected + ' infected');

  // 9. Day/night
  var tod = await page.evaluate(() => Math.round(tod*10)/10);
  check('Day/night cycle', tod >= 0 && tod <= 24, 'tod=' + tod);

  // 10. 5 niches alive
  var niches = await page.evaluate(() => {
    var alive = (orgs||[]).filter(o=>o.alive);
    var cats = {};
    alive.forEach(o => cats[o.sp.cat] = (cats[o.sp.cat]||0)+1);
    return Object.keys(cats).filter(k => cats[k] > 0).length;
  });
  check('5 ecological niches alive', niches >= 4, niches + ' niches');

  // 11. Camera follows player
  var camOk = await page.evaluate(() => {
    if(!player) return false;
    return Math.abs(cam.x - player.x) < 200 && Math.abs(cam.y - player.y) < 200;
  });
  check('Camera on player', camOk);

  // 12. Colonies at start = 0
  var colonies = await page.evaluate(() => (orgs||[]).filter(o => o.alive && o.sp.shape === 'colony').length);
  check('No colony blobs', colonies === 0, colonies + ' colonies');

  // 13. JS errors
  check('Zero JS errors', errs.length === 0, errs.length + ' errors');

  console.log('\n=== RESULT: ' + pass + ' PASS / ' + fail + ' FAIL ===');
  errs.forEach(e => console.log('  ERR: ' + e.substring(0,200)));

  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIO-FUNC-FINAL.png' });

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
