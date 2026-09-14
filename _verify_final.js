
const { chromium } = require('playwright');

async function freshGame(page, mode) {
  await page.goto('https://igraspore.pages.dev/?nocache=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.evaluate((m) => {
    settings.renderMode = m;
    window._rmodeUserPicked = (m === 'swiss');
    selSpecies = 0;
    startGame(false);
  }, mode);
  await page.waitForTimeout(3000);
}

async function dismissPopups(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.ov.show').forEach(o => o.className='ov');
    document.querySelectorAll('button').forEach(b => {
      var t = b.textContent || '';
      if (t.includes('Понятно') || t.includes('Пропустить') || t.includes('Далее') || t.includes('Skip')) b.click();
    });
    document.querySelectorAll('[id*="info"],[id*="Info"],[id*="keyHint"]').forEach(e => e.style.display='none');
  });
  await page.waitForTimeout(300);
}

(async () => {
  const results = [];
  const browser = await chromium.launch({ headless: true });

  // T1: Swiss + interact fn loaded
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await freshGame(page, 'swiss');
    const d = await page.evaluate(() => ({
      orgs: orgs.length, approx: orgs.filter(o => isSwissApprox(o)).length,
      cov: swissCoverageStats(), interact: typeof window.updateOrgInteract
    }));
    results.push({ s: 'Core', n: 'Swiss+interact', pass: d.orgs>500 && d.approx===0 && d.cov.approx===0 && d.interact==='function' && errs.length===0, d: `orgs=${d.orgs}, ${d.cov.dedicated}D/${d.cov.approx}A, fn=${d.interact}, errs=${errs.length}` });
    await page.close();
  }

  // T2: Camera z1/5/10
  for (const z of [1, 5, 10]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await freshGame(page, 'cartoon');
    await dismissPopups(page);
    await page.evaluate((z) => { tZoom = z; zoom = z; }, z);
    await page.waitForTimeout(1000);
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(2000);
    await page.keyboard.up('KeyD');
    await page.waitForTimeout(500);
    const dist = await page.evaluate(() => Math.round(Math.hypot((player.x-cam.x)*zoom, (player.y-cam.y)*zoom)));
    results.push({ s: 'Camera', n: `Follow z=${z}`, pass: dist < 80, d: `dist=${dist}px` });
    await page.close();
  }

  // T3: Green tint
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await freshGame(page, 'cartoon');
    await dismissPopups(page);
    await page.evaluate(() => { tZoom = 0.5; zoom = 0.5; });
    await page.waitForTimeout(1500);
    const green = await page.evaluate(() => {
      var cv = document.getElementById('c'), ctx = cv.getContext('2d'), n = 0;
      for (var gy of [0.3,0.45,0.6,0.75]) for (var gx of [0.2,0.35,0.5,0.65,0.8]) {
        var p = ctx.getImageData(Math.floor(cv.width*gx), Math.floor(cv.height*gy), 1, 1).data;
        if (p[1] > p[2]+20) n++;
      }
      return n;
    });
    results.push({ s: 'Visual', n: 'No green tint', pass: green < 3, d: `green=${green}/20` });
    await page.close();
  }

  // T4: Dark rects 3 modes
  for (const mode of ['cartoon', 'bioicons', 'swiss']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await freshGame(page, mode);
    await dismissPopups(page);
    await page.evaluate(() => { tZoom = 3.0; zoom = 3.0; });
    await page.waitForTimeout(1000);
    const dark = await page.evaluate(() => {
      var cv = document.getElementById('c'), ctx = cv.getContext('2d');
      var img = ctx.getImageData(100, 100, cv.width-200, cv.height-200);
      var max = 0, run = 0;
      for (var i = 0; i < img.data.length; i += 8) {
        if (img.data[i]+img.data[i+1]+img.data[i+2] < 50) { run++; if (run>max) max=run; } else run = 0;
      }
      return max;
    });
    results.push({ s: 'Visual', n: `Dark rects ${mode}`, pass: dark < 10, d: `run=${dark}px` });
    await page.close();
  }

  // T5: Star selector
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await freshGame(page, 'cartoon');
    await dismissPopups(page);
    await page.selectOption('#starSelectGame', 'betelgeuse');
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => window.currentStarId);
    results.push({ s: 'UI', n: 'Star change', pass: after==='betelgeuse', d: `sol→${after}` });
    await page.close();
  }

  // T6: Virus
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('https://igraspore.pages.dev/?nocache='+Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => { selSpecies=100; startGame(false); });
    await page.waitForTimeout(2000);
    const d = await page.evaluate(() => ({ virus: window.virusPlayer, phages: viruses.length, cursor: document.getElementById('c').style.cursor }));
    results.push({ s: 'Virus', n: 'Spectator', pass: d.virus && d.phages===20 && d.cursor==='crosshair', d: `phages=${d.phages}, cursor=${d.cursor}` });
    await page.close();
  }

  // T7: JS errors
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', msg => { if (msg.type()==='error') errs.push(msg.text()); });
    await page.goto('https://igraspore.pages.dev/?nocache='+Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    for (const mode of ['cartoon', 'bioicons', 'swiss']) {
      await page.evaluate((m) => { state='menu'; settings.renderMode=m; window._rmodeUserPicked=(m==='swiss'); selSpecies=0; startGame(false); }, mode);
      await page.waitForTimeout(2000);
    }
    results.push({ s: 'JS', n: '0 errors 3 modes', pass: errs.length===0, d: `errors=${errs.length}` });
    await page.close();
  }

  // T8: Mobile
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, userAgent: 'Mozilla/5.0 (iPhone)' });
    await page.goto('https://igraspore.pages.dev/?nocache='+Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => { settings.renderMode='swiss'; window._rmodeUserPicked=true; selSpecies=0; startGame(false); });
    await page.waitForTimeout(2000);
    const d = await page.evaluate(() => ({ mobile: document.documentElement.classList.contains('is-mobile'), orgs: orgs.length, approx: orgs.filter(o => isSwissApprox(o)).length }));
    results.push({ s: 'Mobile', n: 'iPhone', pass: d.mobile && d.orgs>200 && d.approx===0, d: `orgs=${d.orgs}, approx=${d.approx}` });
    await page.close();
  }

  // SUMMARY
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass);
  
  console.log('\n========================================');
  console.log('LIVE VERIFICATION (post-cleanup)');
  console.log('========================================\n');
  
  const suites = {};
  for (const r of results) { if (!suites[r.s]) suites[r.s] = []; suites[r.s].push(r); }
  for (const [suite, tests] of Object.entries(suites)) {
    const sp = tests.filter(t => t.pass).length;
    console.log(`[${suite}] ${sp}/${tests.length}`);
    for (const t of tests) console.log(`  ${t.pass ? '✅' : '❌'} ${t.n}: ${t.d}`);
  }
  console.log(`\nTOTAL: ${passed}/${results.length} PASS`);
  if (failed.length) { console.log('\nFAILED:'); for (const f of failed) console.log(`  ❌ ${f.s}/${f.n}: ${f.d}`); }
  
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
