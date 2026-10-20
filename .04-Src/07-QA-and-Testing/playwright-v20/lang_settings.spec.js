const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');
// B12 (TZ v20): язык в настройках меняется без перезапуска, ?lang обновляется, игра сохранена
test('[B12] switch language in settings mid-game', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  await page.click('#startBtn'); await page.waitForTimeout(400);
  await page.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  const pidBefore = await page.evaluate('player ? player.sp.id : -1');
  await page.evaluate(`buildSettings(); document.getElementById('setO').className='ov show';`);
  await page.waitForTimeout(300);
  const hasLang = await page.evaluate(`!!document.getElementById('setLang')`);
  expect(hasLang).toBe(true);
  const nOpts = await page.evaluate(`document.getElementById('setLang').options.length`);
  expect(nOpts).toBe(20);
  await page.selectOption('#setLang', 'tr');
  await page.waitForTimeout(500);
  const after = await page.evaluate(`({url: location.search, lang: curLang, pid: player?player.sp.id:-1, div: document.getElementById('bDiv').textContent, pause: document.getElementById('pauseT').textContent})`);
  expect(after.lang).toBe('tr');
  expect(after.url).toContain('lang=tr');
  expect(after.pid).toBe(pidBefore); // та же жизнь
  expect(/[\u0400-\u04FF]/.test(after.div)).toBe(false);
  await page.evaluate(`document.getElementById('setO').className='ov';`);
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  const pauseTxt = await page.evaluate(`document.getElementById('pauseT').textContent`);
  expect(/[\u0400-\u04FF]/.test(pauseTxt)).toBe(false);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-B12-lang.png' });
});
