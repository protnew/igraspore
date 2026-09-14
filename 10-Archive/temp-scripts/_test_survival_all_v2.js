const { chromium } = require('playwright');
const fs = require('fs');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,120)));
  await page.goto(URL + '?v=surv2' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => {
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof startGame === 'function') startGame();
  });
  await page.waitForTimeout(2000);

  // Ecosystem snapshot series
  const series = [];
  async function snap(sec) {
    const s = await page.evaluate((sec) => {
      const alive = orgs.filter(o=>o && o.alive);
      const byCat = {}, bySp = {};
      for (const o of alive) {
        const c = (o.sp && o.sp.cat) || '?';
        const n = (o.sp && (o.sp.name || o.sp.id)) || '?';
        byCat[c] = (byCat[c]||0)+1;
        if(!bySp[n]) bySp[n] = {cat:c, n:0}; bySp[n].n++;
      }
      return {
        sec, alive: alive.length,
        viruses: viruses.length,
        infected: orgs.filter(o=>o&&o.infected).length,
        byCat, speciesCount: Object.keys(bySp).length,
        bySp
      };
    }, sec);
    series.push(s);
    const bc = s.byCat;
    console.log(`T=${sec}s: alive=${s.alive} P=${bc.producer||0} c1=${bc.consumer1||0} c2=${bc.consumer2||0} c3=${bc.consumer3||0} D=${bc.decomposer||0} V=${s.viruses} inf=${s.infected} sp=${s.speciesCount}`);
  }

  await snap(0);
  for (let sec = 15; sec <= 60; sec += 15) {
    await page.evaluate(() => {
      for (let i = 0; i < 15*30; i++) updateWorld(1/30); // 15s
    });
    await snap(sec);
  }

  // Per-species analysis
  const start = series[0].bySp, end = series[series.length-1].bySp;
  const allNames = new Set([...Object.keys(start), ...Object.keys(end)]);
  const results = [];
  for (const name of allNames) {
    const n0 = (start[name] && start[name].n) || 0;
    const n60 = (end[name] && end[name].n) || 0;
    const cat = ((end[name] || start[name] || {}).cat) || '?';
    let status = 'stable';
    if (n0 === 0 && n60 > 0) status = 'emerged';
    else if (n0 > 0 && n60 === 0) status = 'extinct';
    else if (n0 > 0 && n60 < n0 * 0.3) status = 'crash';
    else if (n0 > 0 && n60 > n0 * 1.8) status = 'boom';
    results.push({ name, cat, n0, n60, status });
  }

  const byStatus = {};
  results.forEach(r => { byStatus[r.status] = (byStatus[r.status]||0)+1; });
  const crash = results.filter(r=>r.status==='crash').sort((a,b)=>b.n0-a.n0);
  const extinct = results.filter(r=>r.status==='extinct');
  const stableCount = (byStatus.stable||0) + (byStatus.boom||0);
  const totalCount = results.filter(r => r.n0 > 0 || r.n60 > 0).length;
  const survivalRate = totalCount > 0 ? Math.round(stableCount / totalCount * 100) : 0;

  console.log('\n=== SURVIVAL SUMMARY ===');
  console.log(`Total species: ${totalCount}`);
  console.log(`Stable+Boom: ${stableCount} (${survivalRate}%)`);
  console.log(`Crash: ${byStatus.crash||0}, Extinct: ${byStatus.extinct||0}, Emerged: ${byStatus.emerged||0}`);
  console.log(`Survival rate (target ≥50%): ${survivalRate >= 50 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log('\nCrash species:');
  crash.forEach(c => console.log(`  ${c.name} (${c.cat}): ${c.n0}→${c.n60}`));
  console.log('\nExtinct:');
  extinct.forEach(e => console.log(`  ${e.name} (${e.cat})`));

  // Niches
  const cats = {};
  results.filter(r=>r.n60>0).forEach(r => { cats[r.cat] = (cats[r.cat]||0)+1; });
  console.log('\nNiches with species at T=60s:', JSON.stringify(cats));
  console.log('All 5 niches alive:', Object.keys(cats).length >= 5 ? 'PASS ✅' : 'FAIL ❌');

  // JS errors
  console.log('\nJS errors:', errors.length);
  if (errors.length) console.log('  first:', errors[0]);

  fs.writeFileSync('C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/SURVIVAL-FINAL.json', JSON.stringify({series, results, byStatus, crash, extinct, survivalRate, cats, errors}, null, 2));
  
  // Screenshot
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/SURVIVAL-FINAL.png' });
  await browser.close();
  console.log('\nDONE');
})().catch(e=>{ console.error('FAIL', e.message); process.exit(1); });
