// v20.11 T3/T5: perf gate. CPU sampled BEFORE the browser starts; >20% => ENV-LIMITED (numbers kept as diagnostic only).
// Interleaved A/B cold loads (new context each): time to visible #startBtn + top resources by duration.
// Usage: node tools/v20_11_perf_gate.cjs <out.json> [runs=5] [A=http://127.0.0.1:8821] [B=http://127.0.0.1:8822]
const os = require('os'), fs = require('fs');
const { chromium } = require(require('path').join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const OUT = process.argv[2] || 'perf_gate.json', N = +(process.argv[3] || 5), A = process.argv[4] || 'http://127.0.0.1:8821', B = process.argv[5] || 'http://127.0.0.1:8822';
const snap = () => os.cpus().reduce((s, c) => { const t = c.times; s.i += t.idle; s.a += t.user + t.nice + t.sys + t.irq + t.idle; return s; }, { i: 0, a: 0 });
const cpu = () => new Promise(ok => { const s = snap(); setTimeout(() => { const e = snap(); ok(Math.round(100 * (1 - (e.i - s.i) / (e.a - s.a)))); }, 1500); });
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
(async () => {
  const c0 = [await cpu(), await cpu(), await cpu()], cm = med(c0), env = cm > 20 ? 'ENV-LIMITED' : 'OK';
  const b = await chromium.launch({ channel: 'chrome', headless: true }); const runs = { A: [], B: [] };
  for (let k = 0; k < N; k++) for (const [n, u] of [['A', A], ['B', B]]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage(); const t0 = Date.now();
    try { await p.goto(u + '/?test=1&pool=300&lang=ru', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await p.waitForFunction("(function(){var e=document.getElementById('startBtn');return e&&e.offsetParent&&e.textContent.trim().length>0})()", null, { timeout: 120000, polling: 50 });
      const ms = Date.now() - t0; const top = await p.evaluate(() => performance.getEntriesByType('resource').map(r => [r.name.replace(location.origin, ''), Math.round(r.duration), Math.round(r.responseEnd)]).sort((x, y) => y[1] - x[1]).slice(0, 8));
      runs[n].push({ ms, top }); } catch (e) { runs[n].push({ err: String(e.message).slice(0, 100) }); }
    await ctx.close(); process.stdout.write(n + ' ');
  }
  await b.close(); const mA = med(runs.A.filter(r => r.ms).map(r => r.ms)), mB = med(runs.B.filter(r => r.ms).map(r => r.ms));
  const res = { at: new Date().toISOString(), cpuBefore: c0, env, medianA: mA, medianB: mB, deltaMs: mA - mB, runs };
  fs.writeFileSync(OUT, JSON.stringify(res, null, 1)); console.log('\n' + JSON.stringify({ env, cpuBefore: c0, medianA: mA, medianB: mB, deltaMs: mA - mB }));
})();
