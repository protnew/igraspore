
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const url = 'https://igraspore.pages.dev/?v=20260811120515&t=' + Date.now();
  const outDir = 'C:/Hermes/hermes-data-native/tmp-igraspore-pages/_qa_swiss';
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Check stamp in HTML
  const html = await page.content();
  const hasStamp = html.includes('20260811120515') || html.includes('swiss-bio-audit');

  // Start game if needed
  await page.evaluate(() => {
    try {
      if (typeof startGame === 'function') {
        window._rmodeUserPicked = true;
        startGame();
      }
      if (window.settings) {
        window.settings.renderMode = 'swiss';
        if (typeof applyRenderMode === 'function') applyRenderMode();
        if (typeof loadSwissSprites === 'function') loadSwissSprites();
      }
    } catch (e) { window.__bootErr = String(e); }
  });
  await page.waitForTimeout(4000);

  // Wait sprites
  for (let i=0;i<20;i++){
    const ready = await page.evaluate(() => window.swissReady ? window.swissReady() : false);
    if (ready) break;
    await page.waitForTimeout(500);
  }

  // Force more viruses + advance time
  await page.evaluate(() => {
    if (typeof spawnVirus === 'function') {
      for (let i=0;i<8;i++) try{spawnVirus();}catch(e){}
    }
  });
  // run sim 3s
  await page.waitForTimeout(3000);

  const report = await page.evaluate(() => {
    const orgs = window.orgs || [];
    const viruses = window.viruses || [];
    const shapes = {};
    const loco = {};
    const sessile = [];
    orgs.forEach(o => {
      if (!o || !o.alive) return;
      const sh = (o.sp && o.sp.shape) || '?';
      shapes[sh] = (shapes[sh]||0)+1;
      const L = o.locomotion || (o.sp && o.sp.locomotion) || '?';
      loco[L] = (loco[L]||0)+1;
      const nm = (o.sp && o.sp.name) || '';
      if (/Vorticella|Zoothamnium|Opercularia/i.test(nm)) {
        sessile.push({name: nm, loco: L, vx: o.vx, vy: o.vy});
      }
    });
    // Swiss pickShape diversity
    let swissShapes = {};
    if (typeof pickShape === 'function') {
      orgs.forEach(o => {
        if (!o||!o.alive) return;
        const s = pickShape(o, o.sp && o.sp.shape);
        swissShapes[s] = (swissShapes[s]||0)+1;
      });
    } else if (window.pickShape) {
      orgs.forEach(o => {
        if (!o||!o.alive) return;
        const s = window.pickShape(o, o.sp && o.sp.shape);
        swissShapes[s] = (swissShapes[s]||0)+1;
      });
    }
    const vspeeds = viruses.map(v => Math.sqrt((v.vx||0)**2+(v.vy||0)**2));
    const vmax = vspeeds.length ? Math.max(...vspeeds) : 0;
    const vavg = vspeeds.length ? vspeeds.reduce((a,b)=>a+b,0)/vspeeds.length : 0;

    // green pixel %
    const cv = document.getElementById('c') || document.querySelector('canvas');
    let greenPct = -1;
    if (cv) {
      const ctx = cv.getContext('2d');
      const img = ctx.getImageData(0,0,cv.width,cv.height);
      const d = img.data;
      let green=0,total=0;
      for (let i=0;i<d.length;i+=16){
        total++;
        if (d[i+1] > 80 && d[i+1] > d[i]*1.5 && d[i+1] > d[i+2]*1.5 && (d[i]+d[i+2])<120) green++;
      }
      greenPct = total ? +(green/total*100).toFixed(2) : -1;
    }

    // markers in config
    const cfgSpeed = (window.VIRUS_SPECS && window.VIRUS_SPECS[0] && window.VIRUS_SPECS[0].speed) || null;
    const mode = window.settings && window.settings.renderMode;
    const ready = window.swissReady ? window.swissReady() : false;
    const updateSrc = (typeof updateViruses === 'function') ? updateViruses.toString().slice(0,800) : '';
    const locoSrc = (typeof getLocomotion === 'function') ? getLocomotion.toString().slice(0,500) : '';

    return {
      mode, ready, pop: orgs.filter(o=>o&&o.alive).length,
      virusCount: viruses.length, vmax: +vmax.toFixed(3), vavg: +vavg.toFixed(3),
      shapes, loco, swissShapes, sessile: sessile.slice(0,8),
      greenPct, cfgSpeed,
      hasPassive: updateSrc.includes('0.25') || updateSrc.includes('Passive Brownian ALWAYS'),
      hasNameSessile: locoSrc.includes('Vorticella'),
      stentorLoco: orgs.filter(o=>o&&o.alive&&/Stentor/i.test(o.sp&&o.sp.name||'')).map(o=>({n:o.sp.name,L:o.locomotion||o.sp.locomotion})).slice(0,3),
      bootErr: window.__bootErr || null
    };
  });

  const shot = path.join(outDir, 'swiss_live.png');
  await page.screenshot({ path: shot, fullPage: false });

  const result = { url, hasStamp, errors, report, shot };
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
