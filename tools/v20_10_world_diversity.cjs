// v20.10 world diversity probe: 3 independent starts must give 3 different world hashes
const { chromium } = require(require('path').join(__dirname,'..','.04-Src','node_modules','playwright'));
const base = process.env.GATE_BASE_URL || 'http://127.0.0.1:8821';
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true }); const out = [];
  for (let i = 0; i < 3; i++) {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
    await p.goto(base + '/index.html?test=1', { waitUntil: 'load' });
    await p.waitForFunction('typeof startGame==="function"', null, { timeout: 30000 });
    await p.evaluate('startGame(false)'); await p.waitForTimeout(1500);
    out.push(await p.evaluate(() => {
      const s = orgs.map(o => (o.sp && (o.sp.id || o.sp.name) || o.type || '?') + '@' + Math.round(o.x / 50) + ',' + Math.round(o.y / 50)).join('|');
      let h = 2166136261; for (let k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619) >>> 0; }
      const kinds = {}; orgs.forEach(o => { const k = o.sp && (o.sp.id || o.sp.name) || '?'; kinds[k] = 1; });
      return { hash: h.toString(16), n: orgs.length, species: Object.keys(kinds).length, player: player && player.sp && (player.sp.id || player.sp.name) };
    }));
    await p.close();
  }
  await b.close(); console.log(JSON.stringify(out));
  const uniq = new Set(out.map(o => o.hash)).size;
  console.log(uniq === 3 ? 'DIVERSITY OK 3/3 unique' : 'DIVERSITY FAIL unique=' + uniq); process.exit(uniq === 3 ? 0 : 1);
})();
