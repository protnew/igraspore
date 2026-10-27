// v20.7: поймать повторный вызов startGame / повторный показ introO
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');

const INSTRUMENT = `(function(){
  window.__ev = [];
  var oS = window.startGame;
  if (!oS) { window.__ev.push('no startGame at instrument time'); return 1; }
  window.startGame = function(a, b){
    try {
      var st = (new Error().stack || '').split('\\n').slice(1, 4).join(' | ').slice(0, 220);
      window.__ev.push('startGame t=' + Math.round(performance.now()) + ' ss=' + a + ' :: ' + st);
    } catch (e) {}
    return oS.apply(this, arguments);
  };
  var io = document.getElementById('introO');
  if (io) {
    new MutationObserver(function(){
      window.__ev.push('INTRO ' + io.className + ' t=' + Math.round(performance.now()));
    }).observe(io, { attributes: true, attributeFilter: ['class'] });
  }
  return 1;
})()`;

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto('http://127.0.0.1:8798/?lang=en&test=1&pool=200&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForSelector('#startBtn');
  await p.evaluate(INSTRUMENT);
  await p.evaluate("document.getElementById('startBtn').click()");
  // helper-семантика: ждать playing, параллельно закрывая карточку
  await p.waitForFunction(`(function(){
    if (typeof state === 'undefined') return false;
    var rc = document.getElementById('roleCardOk');
    if (rc) { try { rc.click(); } catch(e){} }
    var skip = document.getElementById('tutSkip');
    if (skip && skip.offsetParent !== null) { try { skip.click(); } catch(e){} }
    var io2 = document.getElementById('introO');
    if (io2 && io2.className.indexOf('show') >= 0 && typeof window.closeIntroCard === 'function') window.closeIntroCard();
    return state === 'playing' && window.player && player.alive;
  })()`, undefined, { timeout: 60000, polling: 120 });
  await p.waitForTimeout(9000);
  console.log(await p.evaluate('JSON.stringify(window.__ev)'));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
