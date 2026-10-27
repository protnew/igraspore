// v20.10 CPU profile of 6 s gameplay (top self-time functions)
const { chromium } = require(require('path').join(__dirname,'..','.04-Src','node_modules','playwright'));
const base = process.env.GATE_BASE_URL || 'http://127.0.0.1:8821';
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto(base + '/index.html?test=1', { waitUntil: 'load' });
  await p.waitForFunction('typeof startGame==="function"');
  await p.evaluate('startGame(false)'); await p.waitForTimeout(2000);
  const c = await p.context().newCDPSession(p);
  await c.send('Profiler.enable'); await c.send('Profiler.setSamplingInterval', { interval: 200 });
  await c.send('Profiler.start'); await p.waitForTimeout(6000);
  const { profile } = await c.send('Profiler.stop');
  const self = {}, dt = profile.timeDeltas, idx = {}; profile.nodes.forEach(n => idx[n.id] = n);
  profile.samples.forEach((id, i) => { const f = idx[id].callFrame; const k = (f.functionName || '(anon)') + ' ' + f.url.split('/').pop() + ':' + (f.lineNumber + 1); self[k] = (self[k] || 0) + (dt[i] || 0); });
  const tot = Object.values(self).reduce((a, b) => a + b, 0);
  Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log((100 * v / tot).toFixed(1) + '%  ' + k));
  await b.close();
})();
