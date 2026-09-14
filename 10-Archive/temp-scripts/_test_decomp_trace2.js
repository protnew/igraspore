const { chromium } = require('playwright');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0,200)));
  await page.goto(URL + '?v=d2' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => {
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof startGame === 'function') startGame();
  });
  await page.waitForTimeout(2000);

  for (var sec = 0; sec <= 40; sec += 10) {
    if (sec > 0) {
      await page.evaluate(() => {
        for (var i = 0; i < 300; i++) updateWorld(1/30);
      });
    }
    var trace = await page.evaluate(() => {
      var decs = orgs.filter(function(o){return o.alive && o.sp && o.sp.cat === 'decomposer'});
      var decE = decs.map(function(o){return Math.round(o.energy)}).sort(function(a,b){return a-b});
      var decY = decs.map(function(o){return Math.round(o.y)});
      var c2s = orgs.filter(function(o){return o.alive && o.sp && o.sp.cat === 'consumer2'});
      var c2E = c2s.map(function(o){return Math.round(o.energy)}).sort(function(a,b){return a-b});
      var deepC = nutrientClouds ? nutrientClouds.filter(function(c){return c.y > 500}).length : 0;
      return JSON.stringify({
        dec: decs.length,
        decE: decs.length ? [decE[0], decE[Math.floor(decs.length/2)], decE[decs.length-1]] : [],
        decY: decs.length ? [Math.min.apply(null,decY), Math.max.apply(null,decY)] : [],
        c2: c2s.length,
        c2E: c2s.length ? [c2E[0], c2E[Math.floor(c2s.length/2)], c2E[c2s.length-1]] : [],
        clouds: nutrientClouds ? nutrientClouds.length : 0,
        deepC: deepC,
        PD: typeof PD !== 'undefined' ? PD : 0
      });
    });
    console.log('T=' + sec + ': ' + trace);
  }
  console.log('errors: ' + errs.length);
  if (errs.length) console.log('err[0]: ' + errs[0]);
  await browser.close();
})().catch(function(e){ console.error('FAIL ' + e.message); process.exit(1); });
