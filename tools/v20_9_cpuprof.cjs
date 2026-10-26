// v20_9_cpuprof.cjs — top self-time JS functions during play (full pool). Usage: node tools/v20_9_cpuprof.cjs <base> [w] [h]
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:8821', W = +process.argv[3] || 1280, H = +process.argv[4] || 800;
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: W, height: H } });
  const p = await ctx.newPage();
  await p.goto(base + '/?lang=ru', { waitUntil: 'load', timeout: 60000 });
  await p.waitForSelector('#startBtn');
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction(`(function(){var io=document.getElementById('introO');if(io&&io.className.indexOf('show')>=0&&window.closeIntroCard)window.closeIntroCard();
    var rc=document.getElementById('roleCardOk');if(rc)rc.click();var sk=document.getElementById('tutSkip');if(sk&&sk.offsetParent)sk.click();return window.state==='playing';})()`, null, { timeout: 60000, polling: 200 });
  await p.waitForTimeout(3000);
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
  await cdp.send('Profiler.start'); await p.waitForTimeout(8000);
  const { profile } = await cdp.send('Profiler.stop');
  const self = {}, dt = profile.timeDeltas, cnt = {};
  for (const s of profile.samples) cnt[s] = (cnt[s] || 0) + 1;
  let total = 0;
  for (const n of profile.nodes) { const c = cnt[n.id] || 0; total += c; const f = n.callFrame;
    const k = (f.functionName || '(anon)') + ' ' + f.url.split('/').pop().split('?')[0] + ':' + (f.lineNumber + 1); self[k] = (self[k] || 0) + c; }
  const lines={}; for (const n of profile.nodes) { if(!n.positionTicks) continue; const f=n.callFrame.url.split('/').pop().split('?')[0]; for(const t of n.positionTicks){ const k=f+':'+t.line; lines[k]=(lines[k]||0)+t.ticks; } }
  if (process.env.LINES) Object.entries(lines).sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([k,v])=>console.log('L', (100*v/total).toFixed(1)+'%', k));
  Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log((100 * v / total).toFixed(1) + '%', k));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
