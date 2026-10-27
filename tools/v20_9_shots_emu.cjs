// v20_9_shots_emu.cjs — E2 emulator frames via Chrome on Android over CDP (adb forward tcp:9333 localabstract:chrome_devtools_remote).
// Usage: node tools/v20_9_shots_emu.cjs <outDir> [langs]
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || 'shots-emu';
const ALL = JSON.parse(fs.readFileSync(path.join(__dirname, '../.04-Src/i18n/languages.json'), 'utf8')).map(l => l.code);
const LANGS = process.argv[3] ? process.argv[3].split(',') : ALL;
const vis = id => `(function(){var e=document.getElementById('${id}');if(!e)return false;var s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;})()`;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const p = b.contexts()[0].pages()[0] || await b.contexts()[0].newPage();
  const res = [];
  const waitVis = async id => { try { await p.waitForFunction(vis(id), null, { timeout: 15000 }); return true; } catch { return false; } };
  const shot = async (L, n, ok) => { const f = path.join(OUT, `emu_${L}_${n}.png`); await p.screenshot({ path: f, timeout: 30000 }); res.push({ lang: L, screen: n, status: ok ? 'OK' : 'FAIL', file: f }); };
  for (const L of LANGS) {
    try {
      const t0 = Date.now();
      await p.goto(`http://10.0.2.2:8821/?test=1&pool=200&lang=${L}&t=${t0}`, { waitUntil: 'load', timeout: 90000 });
      const okM = await waitVis('menuO'); const menuMs = Date.now() - t0; await shot(L, 'menu', okM);
      await p.evaluate("document.getElementById('startBtn').click()");
      const okG = await p.waitForFunction("window.state==='playing'||window.state==='paused'", null, { timeout: 60000 }).then(() => true, () => false);
      await p.evaluate("(function(){try{if(window.closeIntroCard)closeIntroCard();}catch(e){};['roleCardOk','tutSkip'].forEach(function(i){var e=document.getElementById(i);if(e&&e.offsetParent)e.click();});})()");
      await p.waitForTimeout(2000); await shot(L, 'game', okG);
      await p.evaluate("(function(){var b=document.getElementById('bPause');if(b&&b.offsetParent){b.click();return}var a=document.getElementById('pauseBtn');if(a)a.click();})()");
      await shot(L, 'pause', await waitVis('pauseO'));
      res[res.length - 3].menuMs = menuMs;
    } catch (e) { res.push({ lang: L, screen: 'crash', status: 'FAIL', err: String(e.message).slice(0, 200) }); }
    process.stdout.write(L + ' ');
  }
  fs.writeFileSync(path.join(OUT, 'status.json'), JSON.stringify(res, null, 1));
  const c = s => res.filter(r => r.status === s).length;
  console.log('\nSUMMARY OK=' + c('OK') + ' FAIL=' + c('FAIL'));
  res.filter(r => r.status !== 'OK').forEach(r => console.log(r.status, r.lang, r.screen, r.err || ''));
  await b.close().catch(() => {});
})();
