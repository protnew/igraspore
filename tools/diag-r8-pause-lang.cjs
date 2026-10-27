// v21 R8 repro: смена языка в игре → пауза → pExit/pMore тексты
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  await p.goto('http://127.0.0.1:8798/?lang=es&test=1&pool=200&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForSelector('#startBtn');
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction(`(function(){
    if (typeof state === 'undefined') return false;
    var rc = document.getElementById('roleCardOk'); if (rc) { try { rc.click(); } catch(e){} }
    var skip = document.getElementById('tutSkip');
    if (skip && skip.offsetParent !== null) { try { skip.click(); } catch(e){} }
    var io = document.getElementById('introO');
    if (io && io.className.indexOf('show') >= 0 && typeof window.closeIntroCard === 'function') window.closeIntroCard();
    return state === 'playing' && window.player && player.alive;
  })()`, undefined, { timeout: 60000, polling: 150 });
  // смена языка через настройки (как на телефоне)
  await p.evaluate('buildSettings(); document.getElementById("setO").className = "ov show"');
  await p.waitForTimeout(300);
  await p.selectOption('#setLang', 'de');
  await p.waitForTimeout(500);
  await p.evaluate('document.getElementById("setO").className = "ov"');
  await p.evaluate("document.getElementById('bPause').click()");
  await p.waitForTimeout(500);
  const d = await p.evaluate(`(function(){
    return JSON.stringify({ lang: curLang,
      pExit: document.getElementById('pExit').textContent,
      pMore: document.getElementById('pMore').textContent,
      pauseT: document.getElementById('pauseT').textContent,
      resBtn: document.getElementById('resBtn').textContent });
  })()`);
  console.log(d, 'errs:', errs.slice(0, 2));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
