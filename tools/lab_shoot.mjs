import pw from '../.04-Src/node_modules/playwright-core/index.js';
const { chromium } = pw;
import fs from 'fs';
const pages = ['index','tests','ui-audit','languages','store-readiness','competitors','media','buttons','tz-index'];
const out = '09-Docs/out-dev-factory/shots-release-ready-2026-10-14/lab';
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
let ok = 0; const fail = [];
for (const p of pages) {
  const url = 'http://127.0.0.1:8793/lab/' + (p === 'index' ? '' : p + '.html');
  try {
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 40)));
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(700);
    const status = resp ? resp.status() : 'no-resp';
    await page.screenshot({ path: out + '/390-' + p + '.png' });
    if (status === 200 && errs.length === 0) ok++; else fail.push(p + ':' + (status || 'ERR') + ':' + (errs[0] || ''));
    await page.close();
  } catch (e) { fail.push(p + ':throw:' + e.message.slice(0, 30)); }
}
await b.close();
console.log('lab shots ok=' + ok + '/' + pages.length);
if (fail.length) console.log('issues: ' + fail.join(', '));
