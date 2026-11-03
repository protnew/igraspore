const { chromium } = require(require('path').join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8795';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('pageerror', e => console.log('PAGEERR', e.message.slice(0,200)));
  page.on('console', m => { if (m.type()==='error') console.log('CONSERR', m.text().slice(0,200)); });
  const url = BASE + '/?lang=en&test=1&pool=120&t=' + Date.now();
  console.log('goto', url);
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  console.log('status', resp && resp.status());
  await page.waitForTimeout(2000);
  const snap = await page.evaluate(`(function(){
    return {
      startBtn: !!document.getElementById('startBtn'),
      state: typeof state==='undefined' ? 'undef' : state,
      igsTheme: !!window.igsThemeEngine,
      themeScripts: Array.from(document.scripts).filter(s=>/theme_/.test(s.src)).map(s=>s.src),
      cssTheme: !!document.querySelector('link[href*="style-themes"]'),
      bodyLen: document.body ? document.body.innerHTML.length : 0,
      title: document.title
    };
  })()`);
  console.log('snap', JSON.stringify(snap, null, 2));
  if (snap.startBtn) {
    await page.evaluate("document.getElementById('startBtn').click()");
    for (let i=0;i<20;i++) {
      await page.waitForTimeout(1000);
      const st = await page.evaluate(`(function(){
        return {
          state: typeof state==='undefined'?'undef':state,
          player: typeof player==='undefined'?null:(player&&player.alive),
          ov: Array.from(document.querySelectorAll('.ov.show')).map(e=>e.id),
          intro: (document.getElementById('introO')||{}).className,
        };
      })()`);
      console.log('t'+i, JSON.stringify(st));
      if (st.state==='playing' || st.state==='paused') break;
    }
  }
  await page.screenshot({ path: '09-Docs/out-dev-factory/theme-shots-v29/probe.png' });
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
