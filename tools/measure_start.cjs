// Замер START по фазам, полный пул (без ?test=1).
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
const base = process.env.GATE_BASE_URL || 'http://127.0.0.1:8821';
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const t0 = Date.now();
  await p.goto(base + '/?lang=en&t=' + Date.now(), { waitUntil: 'load', timeout: 60000 });
  await p.waitForSelector('#startBtn', { timeout: 20000 });
  await p.waitForFunction('window._bake && window._bake.easy && window._bake.easy.length', null, { timeout: 15000 }).catch(function(){});
  console.log('menu_ms', Date.now() - t0);
  const clickAt = Date.now();
  await p.evaluate('var t=performance.now(); document.getElementById("startBtn").click(); window._clickT=t;');
  await p.waitForFunction('window.state==="playing" || window.state==="paused"', null, { timeout: 60000 });
  const frame = Date.now() - clickAt;
  await p.waitForFunction('!(window._popQueue&&window._popQueue.length)', null, { timeout: 20000 }).catch(function(){});
  const snap = await p.evaluate(`(function(){
    var ph = window.IGS_PHASE || [];
    var base = ph.length ? ph[0][1] : 0;
    var rows = ph.map(function(x){ return x[0]+' '+(Math.round(x[1]-base)); });
    return JSON.stringify({state:state, orgs:orgs.length, frameWait:0, rows:rows});
  })()`);
  console.log('frame_ms', frame);
  console.log(snap);
  await b.close();
})().catch(function(e){ console.error('FAIL', e.message); process.exit(1); });
