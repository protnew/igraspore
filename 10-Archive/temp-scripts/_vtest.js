const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.substring(0,200)));

  await page.goto('https://igraspore.pages.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Check virus function
  const fnCheck = await page.evaluate(() => {
    var fnStr = typeof updateViruses === 'function' ? updateViruses.toString() : 'MISSING';
    return {
      hasBrownian: fnStr.includes('Brownian'),
      hasVsp: fnStr.includes('vsp<0.3'),
      bioReady: window.bioiconsReady ? window.bioiconsReady() : 'MISSING',
    };
  });
  console.log('Code:', JSON.stringify(fnCheck));

  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy'; startGame();
  });
  await page.waitForTimeout(2000);

  // Virus test — 20s only
  for (var t = 0; t <= 20; t += 5) {
    var vs = await page.evaluate(() => {
      var v = viruses||[];
      var moving = v.filter(x => Math.sqrt(x.vx*x.vx+x.vy*x.vy) > 0.1).length;
      var avgSpd = v.length ? v.reduce((s,x)=>s+Math.sqrt(x.vx*x.vx+x.vy*x.vy),0)/v.length : 0;
      return { n: v.length, mov: moving, spd: Math.round(avgSpd*100)/100, inf: (orgs||[]).filter(o=>o.infectionT>0).length };
    });
    console.log('t=' + t + 's:', JSON.stringify(vs));
    if (t < 20) await page.evaluate(() => { for(var i=0;i<5*30;i++) updateWorld(1/30); });
  }

  console.log('Errors:', errs.length);
  if(errs.length) errs.forEach(e => console.log('  ' + e));
  
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/VTEST-FINAL.png' });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
