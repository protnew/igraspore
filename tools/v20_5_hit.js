const { chromium } = require('../.04-Src/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('http://127.0.0.1:8813/?lang=ru&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await p.waitForSelector('#startBtn');
  await p.waitForTimeout(1200);
  const info = await p.evaluate(() => {
    const e = document.getElementById('startBtn');
    const r = e.getBoundingClientRect();
    const top = document.elementFromPoint(r.x + r.width / 2, r.y + 8);
    return { w: Math.round(r.width), h: Math.round(r.height), top: top && (top.id || top.tagName + '.' + top.className), body: document.body.className };
  });
  console.log(JSON.stringify(info));
  const t0 = Date.now();
  try {
    await p.click('#startBtn', { timeout: 8000 });
    console.log('click ok', Date.now() - t0, await p.evaluate(() => state));
  } catch (e) {
    console.log('click fail', Date.now() - t0, String(e).slice(0, 180));
  }
  await b.close();
})();
