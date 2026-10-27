// v20.7: какие CSS-правила прячут actBar/bPause (перебор styleSheets)
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');

const DUMP = `(function(){
  function rulesFor(el, name){
    var out = [];
    var sheets = document.styleSheets;
    for (var si = 0; si < sheets.length; si++) {
      var sheet = sheets[si];
      var rules;
      try { rules = sheet.cssRules; } catch (e) { continue; }
      for (var ri = 0; ri < rules.length; ri++) {
        var r = rules[ri];
        if (!r.selectorText) continue;
        try {
          if (el.matches(r.selectorText)) {
            var css = r.style.cssText || '';
            if (/display|visibility/.test(css)) out.push(name + ' <= ' + r.selectorText + ' { ' + css.trim() + ' }');
          }
        } catch (e) {}
      }
    }
    return out;
  }
  var ab = document.getElementById('actBar');
  var bp = document.getElementById('bPause');
  return JSON.stringify({
    abClass: ab.className, bpClass: bp.className,
    abRules: rulesFor(ab, 'actBar'), bpRules: rulesFor(bp, 'bPause'),
    coarse: matchMedia('(pointer: coarse)').matches,
    maxw900: matchMedia('(max-width: 900px)').matches,
    bodyClass: document.body.className
  });
})()`;

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto('http://127.0.0.1:8798/?lang=ru&test=1&pool=200&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForSelector('#startBtn');
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction("state==='playing' || state==='paused'", undefined, { timeout: 45000, polling: 150 }).catch(() => {});
  await p.waitForTimeout(700);
  console.log(await p.evaluate(DUMP));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
