// v20.7: диагностика #bPause после нового старта (fail 6/13/20)
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto('http://127.0.0.1:8798/?lang=ru&test=1&pool=200&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForSelector('#startBtn', { timeout: 30000 });
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction(`(function(){
    if (typeof state === 'undefined') return false;
    var rc = document.getElementById('roleCardOk');
    if (rc) { try { rc.click(); } catch(e){} }
    var skip = document.getElementById('tutSkip');
    if (skip && skip.offsetParent !== null) { try { skip.click(); } catch(e){} }
    return state === 'playing' && window.player && player.alive;
  })()`, undefined, { timeout: 60000, polling: 120 });
  const d = await p.evaluate(`(function(){
    var ids = ['bPause','actBar','bEat','bAuto','hud','topR','keyHint'];
    var out = {};
    ids.forEach(function(id){
      var e = document.getElementById(id); if(!e){ out[id]='missing'; return; }
      var r = e.getBoundingClientRect();
      out[id] = { disp: getComputedStyle(e).display, vis: getComputedStyle(e).visibility,
        w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y),
        parentDisp: e.offsetParent ? getComputedStyle(e.offsetParent).display : 'no-offset-parent' };
    });
    out.state = state;
    var ab = document.getElementById('actBar');
    out.actBarClass = ab ? ab.className : null;
    out.actBarInline = ab ? ab.getAttribute('style') : null;
    return JSON.stringify(out);
  })()`);
  console.log(d);
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
