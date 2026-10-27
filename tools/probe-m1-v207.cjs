// v20.7: почему M1 XOR=0 — живой ли membranePath на игроке при zoom=14
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 100)));
  await p.goto('http://127.0.0.1:8798/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForSelector('#startBtn');
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction(`(function(){
    if (typeof state === 'undefined') return false;
    var rc = document.getElementById('roleCardOk');
    if (rc) { try { rc.click(); } catch(e){} }
    var skip = document.getElementById('tutSkip');
    if (skip && skip.offsetParent !== null) { try { skip.click(); } catch(e){} }
    return state === 'playing' && window.player && player.alive;
  })()`, undefined, { timeout: 60000, polling: 120 });
  await p.evaluate(`(function(){ zoom=14; tZoom=14; if(player){cam.x=player.x; cam.y=player.y;} window.focusTimer=0; window.cinematicTime=1; timeScale=1; })()`);
  await p.waitForTimeout(1200);
  const d = await p.evaluate(`(function(){
    var o = window.player;
    var calls = 0;
    var omp = window.membranePath;
    if (omp) {
      window.__mpc = 0;
      window.membranePath = function(a, s, dt){ window.__mpc++; return omp.apply(this, arguments); };
    }
    return JSON.stringify({
      hasMp: typeof window.membranePath === 'function',
      enabled: (typeof membraneEnabled === 'function') ? membraneEnabled() : 'no fn',
      softMembrane: settings.softMembrane,
      zoom: zoom, shape: o && o.sp ? o.sp.shape : null,
      state: state
    });
  })()`);
  console.log('setup:', d);
  await p.waitForTimeout(1000);
  const d2 = await p.evaluate(`(function(){
    var o = window.player;
    return JSON.stringify({ mpCalls: window.__mpc || -1,
      memb: o && o._memb ? { len: o._memb.length, first3: Array.prototype.slice.call(o._memb, 0, 3).map(function(x){return +x.toFixed(3);}) } : null,
      vs: o ? +Math.hypot(o.vx, o.vy).toFixed(2) : null, vS: o ? +(o._membVS||0).toFixed(3) : null,
      gt: typeof gt !== 'undefined' ? +gt.toFixed(2) : null });
  })()`);
  console.log('after 1s:', d2, 'errs:', errs.slice(0, 2));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
