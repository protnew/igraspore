// Полный пул (без ?test=1): первый кадр и готовый мир. Таймаут спеки не поднимаем выше конфига.
const { test, expect } = require('@playwright/test');
const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8821';

test('полный пул: кадр ≤1 с, мир ≤3 с', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('#startBtn', { timeout: 20000 });
  await page.waitForFunction('window._bake && window._bake.easy && window._bake.easy.length>1000', null, { timeout: 10000 });
  await page.evaluate(`(function(){ window.IGS_PHASE=[]; window._clickT=performance.now(); document.getElementById('startBtn').click(); })()`);
  await page.waitForFunction(`(function(){ var p=window.IGS_PHASE||[]; for(var i=0;i<p.length;i++) if(p[i][0]==='start.end') return true; return false; })()`, null, { timeout: 5000 });
  const frame = await page.evaluate(`(function(){ var p=window.IGS_PHASE; for(var i=0;i<p.length;i++) if(p[i][0]==='start.end') return p[i][1]-window._clickT; return 99999; })()`);
  expect(frame).toBeLessThanOrEqual(1000);
  await page.waitForFunction(`(function(){ var p=window.IGS_PHASE||[]; for(var i=0;i<p.length;i++) if(p[i][0]==='world.full') return true; return false; })()`, null, { timeout: 5000 });
  const full = await page.evaluate(`(function(){ var p=window.IGS_PHASE; for(var i=0;i<p.length;i++) if(p[i][0]==='world.full') return p[i][1]-window._clickT; return 99999; })()`);
  const n = await page.evaluate('orgs.length');
  expect(full).toBeLessThanOrEqual(3000);
  expect(n).toBeGreaterThan(1500);
});
