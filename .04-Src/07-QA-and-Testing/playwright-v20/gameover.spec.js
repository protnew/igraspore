const { test, expect } = require('@playwright/test');
const { BASE, startGame } = require('./_helpers');
test('[B13] killPlayer -> deadO <=2s -> restart/menu work', async ({ page }) => {
  await startGame(page, { test: true });
  const t0 = Date.now();
  await page.evaluate('window.__igsTest.killPlayer()');
  await page.waitForFunction('document.getElementById("deadO").className==="ov show"', null, { timeout: 3000 });
  expect(Date.now() - t0).toBeLessThanOrEqual(2000);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-B13-dead-spec.png' });
  await page.click('#restartBtn');
  await page.waitForTimeout(400);
  expect(await page.evaluate('document.getElementById("menuO").className')).toBe('ov show');
});
test('[B13] no test hook without ?test=1', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  expect(await page.evaluate('typeof window.__igsTest')).toBe('undefined');
});
