// v21 §13.1: тест-ловушка пула — число в меню == реальному пулу (±5%), потолок 300.
// node tools/v21_pool_check.cjs [base] [vp]   | NEG=1 — внедряет завышенный множитель в баннер и ждёт поимку.
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');

const BASE = process.argv[2] || 'http://127.0.0.1:8821';
const VP = process.argv[3] || '1280';
const NEG = process.env.NEG === '1';

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: parseInt(VP, 10) || 1280, height: 800 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  await p.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForSelector('#poolBanner', { timeout: 20000 });
  const bannerN = await p.evaluate(`(function(){
    var el = document.getElementById('poolBanner');
    var t = el.textContent || '';
    var m = t.match(/~?(\\d+)/);
    var n = m ? parseInt(m[1], 10) : -1;
    if (${NEG ? 'true' : 'false'}) { el.textContent = t.replace(n, n * 2); n = n * 2; } // NEG: завышенный множитель
    return n;
  })()`);
  // старт и реальный пул через 10 с
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction(`(function(){
    if (typeof state === 'undefined') return false;
    var rc = document.getElementById('roleCardOk'); if (rc) { try { rc.click(); } catch(e){} }
    var skip = document.getElementById('tutSkip');
    if (skip && skip.offsetParent !== null) { try { skip.click(); } catch(e){} }
    return state === 'playing' && window.player && player.alive;
  })()`, undefined, { timeout: 60000, polling: 150 });
  await p.waitForTimeout(10000);
  const real = await p.evaluate(`(function(){
    var n = 0; for (var i = 0; i < orgs.length; i++) if (orgs[i] && orgs[i].alive) n++;
    return n;
  })()`);
  const diff = Math.abs(bannerN - real) / Math.max(1, real);
  const capOK = real <= 300 && bannerN <= 300;
  const verdict = { vp: VP, banner: bannerN, real, diffPct: +(diff * 100).toFixed(1), capOK, match: diff <= 0.05, errs: errs.slice(0, 2) };
  console.log(JSON.stringify(verdict));
  const pass = verdict.match && capOK;
  console.log(pass ? 'PASS' : 'FAIL');
  await b.close();
  process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
