const { chromium } = require(require('path').join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
(async () => { const b = await chromium.launch({ channel: 'chrome', headless: true }); const out = {};
 for (const W of (process.argv[3] || '1280').split(',').map(Number)) { const p = await b.newPage({ viewport: { width: W, height: W < 600 ? 844 : 800 } });
  await p.goto((process.argv[2] || 'http://127.0.0.1:8821') + '/?test=1&pool=300&lang=ru', { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(4000);
  out[W] = await p.evaluate(() => ['#menuO .tt', '#menuSub', '#diffWrap', '#menuActions', '#startBtn'].map(s => { const e = document.querySelector(s); if (!e) return s + ':none'; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return s + ':L' + Math.round(r.left) + ' C' + Math.round(r.left + r.width / 2) + ' W' + Math.round(r.width) + ' ta=' + cs.textAlign + ' pl=' + cs.paddingLeft; }));
  if (process.argv[4]) await p.screenshot({ path: process.argv[4] + '/ru_' + W + '_menu.png' }); await p.close(); }
 console.log(JSON.stringify(out)); await b.close(); })();

