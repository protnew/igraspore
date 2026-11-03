const { chromium } = require(require('path').join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('browser ok');
  const t0 = Date.now();
  const resp = await page.goto('http://127.0.0.1:8820/', { waitUntil: 'commit', timeout: 20000 });
  console.log('commit', resp && resp.status(), Date.now()-t0);
  await page.waitForSelector('#startBtn', { timeout: 30000 });
  console.log('startBtn', Date.now()-t0);
  await page.waitForTimeout(2000);
  const pre = await page.evaluate(`({species:(SPECIES_DB||[]).length, state, theme:!!window.igsThemeEngine})`);
  console.log(JSON.stringify(pre));
  await page.evaluate("document.getElementById('startBtn').click()");
  for (let i=0;i<15;i++){
    await page.waitForTimeout(800);
    const st = await page.evaluate(`({state, alive:!!(window.player&&player.alive)})`);
    console.log('t'+i, st);
    if (st.state==='playing') break;
  }
  await browser.close();
})().catch(e=>{console.error('FAIL', e.message); process.exit(1);});
