// v20.7: перехват мутаций style/class на actBar/bPause
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');

const WATCH = `(function(){
  window.__who = [];
  function watch(el, name){
    if(!el) return;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        window.__who.push(name + ' ' + m.attributeName + '="' + (m.target.getAttribute(m.attributeName)||'') + '" t=' + Math.round(performance.now()));
      });
    });
    mo.observe(el, { attributes: true, attributeFilter: ['style','class'] });
  }
  watch(document.getElementById('actBar'), 'actBar');
  watch(document.getElementById('bPause'), 'bPause');
  return 1;
})()`;

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto('http://127.0.0.1:8798/?lang=ru&test=1&pool=200&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForSelector('#startBtn');
  await p.evaluate(WATCH);
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction("state==='playing'", undefined, { timeout: 45000, polling: 150 }).catch(() => {});
  await p.waitForTimeout(900);
  const d = await p.evaluate(`(function(){
    return JSON.stringify({
      who: (window.__who||[]).slice(0, 14),
      abVis: getComputedStyle(document.getElementById('actBar')).visibility,
      bpDisp: getComputedStyle(document.getElementById('bPause')).display,
      bpVis: getComputedStyle(document.getElementById('bPause')).visibility,
      abStyle: document.getElementById('actBar').getAttribute('style'),
      bpStyle: document.getElementById('bPause').getAttribute('style'),
      state: state
    });
  })()`);
  console.log(d);
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
