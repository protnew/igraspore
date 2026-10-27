// v20.11 T1 (V30): count overlapping species-number captions in demo (canvas). Test-only fillText hook (records, does not change drawing).
// Usage: node tools/v20_11_demo_labels.cjs <base> <outDir> [langs] [W]
const { chromium } = require(require('path').join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const fs = require('fs'), path = require('path');
const base = process.argv[2] || 'http://127.0.0.1:8821', OUT = process.argv[3] || 'demolabels';
const LANGS = (process.argv[4] || 'ru,en,hi').split(','), W = +(process.argv[5] || 390);
const HOOK = () => { const P = CanvasRenderingContext2D.prototype, f = P.fillText; window.__lbl = [];
  P.fillText = function (t, x, y) { if (window.__rec && /^#\d/.test(String(t))) { const m = this.measureText(t), h = parseFloat(this.font.match(/(\d+(?:\.\d+)?)px/)[1]);
    const l = this.textAlign === 'center' ? x - m.width / 2 : x; const tp = this.textBaseline === 'top' ? y : y - h;
    window.__lbl.push([String(t), Math.round(l), Math.round(tp), Math.round(m.width), Math.round(h), this.fillStyle]); } return f.apply(this, arguments); }; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true }); const b = await chromium.launch({ channel: 'chrome', headless: true }); const res = {};
  for (const L of LANGS) { const c = await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true }); const p = await c.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(HOOK);
    await p.goto(`${base}/?test=1&pool=300&lang=${L}`, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1500);
    await p.evaluate("document.getElementById('demoBtn')&&document.getElementById('demoBtn').click()"); await p.waitForTimeout(3000);
    let worst = 0, total = 0, frames = 0;
    for (let k = 0; k < 5; k++) { const r = await p.evaluate(() => new Promise(ok => { requestAnimationFrame(() => { window.__lbl = []; window.__rec = true; requestAnimationFrame(() => { window.__rec = false; ok(window.__lbl); }); }); }));
      // keep only the bright pass (shadow pass is drawn +1px offset with dark fill)
      const L2 = r.filter(x => !/rgba\(0, ?0, ?0/.test(x[5]) && x[5] !== 'rgba(0,0,0,0.65)');
      let ov = 0; for (let i = 0; i < L2.length; i++) for (let j = i + 1; j < L2.length; j++) { const a = L2[i], c2 = L2[j];
        if (a[1] < c2[1] + c2[3] && c2[1] < a[1] + a[3] && a[2] < c2[2] + c2[4] && c2[2] < a[2] + a[4]) ov++; }
      if (process.env.DUMP && k === 0) { const fsx = {}; L2.forEach(x => { const key = x[5] + '|' + x[4]; fsx[key] = (fsx[key] || 0) + 1; }); console.log(JSON.stringify(fsx), JSON.stringify(L2.slice(0, 6))); } worst = Math.max(worst, ov); total += L2.length; frames++; await p.waitForTimeout(700); }
    const hint = await p.evaluate(() => { const e = [...document.querySelectorAll('body *')].find(x => /1-6|click|possess/i.test(x.childNodes[0] && x.childNodes[0].textContent || '') && x.offsetParent); return e ? e.textContent.trim().slice(0, 120) : null; });
    await p.screenshot({ path: path.join(OUT, `${L}_${W}_demo.png`) });
    res[L] = { overlapsWorst: worst, labelsAvg: Math.round(total / frames), hintEnglishLike: hint, errs: errs.length }; await c.close(); console.log(L, JSON.stringify(res[L])); }
  fs.writeFileSync(path.join(OUT, 'demolabels.json'), JSON.stringify(res, null, 1)); await b.close();
})();


