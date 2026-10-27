const { chromium } = require(require('path').join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
(async () => { const b = await chromium.launch({ channel: 'chrome', headless: true }); const out = {};
 for (const [W, H, mob] of [[390, 844, true], [1280, 800, false]]) { const c = await b.newContext({ viewport: { width: W, height: H }, isMobile: mob, hasTouch: mob }); const p = await c.newPage();
  await p.goto('http://127.0.0.1:8821/?test=1&pool=200&lang=ru', { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForFunction("document.getElementById('startBtn')&&document.getElementById('startBtn').offsetParent", null, { timeout: 120000 });
  await p.waitForTimeout(1500); let how = 'trial-ok'; try { await p.click('#startBtn', { trial: true, timeout: 5000 }); } catch (e) { how = 'BLOCKED: ' + String(e.message).split('\n').find(l => /intercepts/.test(l)) ; }
  const r = await p.evaluate(() => { const e = document.getElementById('startBtn').getBoundingClientRect(); const x = e.left + e.width / 2, y = e.top + e.height / 2; const t = document.elementFromPoint(x, y); return [Math.round(x), Math.round(y), t ? (t.id || t.tagName + '.' + t.className) : null]; });
  if (mob) await p.touchscreen.tap(r[0], r[1]); else await p.mouse.click(r[0], r[1]); await p.waitForTimeout(4000);
  out[W] = { trial: how, topAtCenter: r[2], stateAfterRealInput: await p.evaluate('window.state') }; await c.close(); }
 console.log(JSON.stringify(out)); await b.close(); })();
