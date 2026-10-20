const { test, expect } = require('@playwright/test');
const { startGame, collectErrs } = require('./_helpers');
test('[B1] phage head = 0.08 x median bacteria radius', async ({ page }) => {
  const errs = collectErrs(page);
  await startGame(page, { test: true });
  await page.evaluate('window.__igsTest.spawnVirusNear()');
  await page.evaluate('(function(){ zoom=12; tZoom=12; if(player){cam.x=player.x; cam.y=player.y;} })()');
  await page.waitForTimeout(900);
  const r = await page.evaluate('window.__igsTest.getSizes()');
  const med = r.bacteria.slice().sort((a,b)=>a-b)[Math.floor(r.bacteria.length/2)];
  const target = 0.08 * med;
  expect(r.bacteria.length).toBeGreaterThan(50);
  expect(Math.abs(r.virusHead - target) / target).toBeLessThanOrEqual(0.06);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-B1-virus-spec.png' });
  expect(errs.length).toBe(0);
});
