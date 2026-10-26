// v20_9_fps.cjs — FPS and frame-phase profile on the full pool (no ?test=1).
// Same world every run: Math.random is seeded in the harness (game code untouched).
// Usage: node tools/v20_9_fps.cjs <baseUrl> <width> <height> <runs> <lang> [seconds]
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
const [base, W, H, RUNS, LANG, SECS] = [process.argv[2] || 'http://127.0.0.1:8821', +process.argv[3] || 1280,
  +process.argv[4] || 800, +process.argv[5] || 5, process.argv[6] || 'ru', +process.argv[7] || 30];
const SEED = `(function(){var s=20261026;Math.random=function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);
t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();`;
const PROF = `(function(){window.__ph={};var P=window.__ph;function wrap(n,g){var f=window[n];if(typeof f!=='function'||f.__w)return;
var w=function(){var t=performance.now();try{return f.apply(this,arguments);}finally{P[g]=(P[g]||0)+performance.now()-t;}};w.__w=1;window[n]=w;}
var G={world:['renderSky','renderWater','renderSunRays','renderSediment','renderShore'],entities:['renderOrganisms','renderViruses'],
membranes:['membranePath'],particles:['renderParticles'],ui:['renderDayNight','renderTooltip','renderSunOverlay','updateHUD','updateUI'],
sim:['update','updateWorld','stepWorld']};Object.keys(G).forEach(function(g){G[g].forEach(function(n){wrap(n,g);});});})()`;
function med(a){a=a.slice().sort((x,y)=>x-y);return a[a.length>>1];}
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true,
    args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });
  const out = [];
  for (let r = 0; r < RUNS; r++) {
    const mob = W < 600;
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: mob ? 2 : 1, isMobile: mob, hasTouch: mob });
    if (!process.env.NOSEED) await ctx.addInitScript(SEED);
    const p = await ctx.newPage();
    const t0 = Date.now();
    await p.goto(base + '/?lang=' + LANG, { waitUntil: 'load', timeout: 60000 });
    await p.waitForSelector('#startBtn', { timeout: 30000 });
    const menuMs = Date.now() - t0;
    const c0 = Date.now();
    await p.evaluate("document.getElementById('startBtn').click()");
    await p.waitForFunction("window.state==='playing'||window.state==='paused'", null, { timeout: 60000 });
    const frameMs = Date.now() - c0;
    await p.waitForFunction(`(function(){var io=document.getElementById('introO');if(io&&io.className.indexOf('show')>=0&&window.closeIntroCard)window.closeIntroCard();
      var ok=document.getElementById('introOk');if(ok&&ok.offsetParent)ok.click();var rc=document.getElementById('roleCardOk');if(rc)rc.click();
      var sk=document.getElementById('tutSkip');if(sk&&sk.offsetParent)sk.click();return window.state==='playing';})()`, null, { timeout: 60000, polling: 200 });
    await p.waitForFunction("!(window._popQueue&&window._popQueue.length)", null, { timeout: 30000 }).catch(() => {});
    const worldMs = Date.now() - c0;
    if (!process.env.NOPROF) await p.evaluate(PROF);
    const res = await p.evaluate(`new Promise(function(res){var fr=0,sec=[],cur=0,t0=performance.now(),ts=t0;
      function f(t){fr++;cur++;if(t-ts>=1000){sec.push(cur*1000/(t-ts));cur=0;ts=t;}
      if(t-t0<${SECS * 1000})requestAnimationFrame(f);else res({fps:fr*1000/(t-t0),min:Math.min.apply(null,sec),frames:fr,
      orgs:(window.orgs||[]).length,zoom:window.zoom,ph:window.__ph});}requestAnimationFrame(f);})`);
    const per = {}; for (const k in res.ph) per[k] = +(res.ph[k] / res.frames).toFixed(2);
    out.push({ menuMs, frameMs, worldMs, fps: +res.fps.toFixed(1), min: +res.min.toFixed(1), orgs: res.orgs, zoom: res.zoom, msPerFrame: per });
    console.log(JSON.stringify(out[out.length - 1]));
    await ctx.close();
  }
  console.log('SUMMARY', JSON.stringify({ W, H, LANG, runs: RUNS, fpsMed: med(out.map(o => o.fps)), fpsMin: Math.min(...out.map(o => o.min)),
    frameMsMed: med(out.map(o => o.frameMs)), worldMsMed: med(out.map(o => o.worldMs)), menuMsMed: med(out.map(o => o.menuMs)) }));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
