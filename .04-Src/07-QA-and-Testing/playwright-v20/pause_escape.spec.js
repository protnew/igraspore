const { test, expect } = require('@playwright/test');
const { startGame } = require('./_helpers');
test('[B2.1] Esc -> paused, player alive', async ({ page }) => {
  await startGame(page);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const s = await page.evaluate('({state, pause: document.getElementById("pauseO").className, alive: !!(player&&player.alive)})');
  expect(s.state).toBe('paused'); expect(s.pause).toBe('ov show'); expect(s.alive).toBe(true);
});
test('[B2.2] Esc-Esc resumes', async ({ page }) => {
  await startGame(page);
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  expect(await page.evaluate('state')).toBe('playing');
  expect(await page.evaluate('document.getElementById("pauseO").className')).toBe('ov');
});
test('[B2.3] Exit -> confirm -> No keeps pause', async ({ page }) => {
  await startGame(page);
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  await page.click('#pExit'); await page.waitForTimeout(200);
  expect(await page.evaluate('document.getElementById("exitConfirm").className')).toBe('ov show');
  await page.click('#ecNo'); await page.waitForTimeout(150);
  expect(await page.evaluate('state')).toBe('paused');
});
test('[B2.4] Exit -> Yes -> menu', async ({ page }) => {
  await startGame(page);
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  await page.click('#pExit'); await page.waitForTimeout(200);
  await page.click('#ecYes'); await page.waitForTimeout(300);
  expect(await page.evaluate('state')).toBe('menu');
  expect(await page.evaluate('document.getElementById("menuO").className')).toBe('ov show');
});
test('[B2-i18n] pause texts not cyrillic in es', async ({ page }) => {
  await page.goto(require('./_helpers').BASE + '/?lang=es&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.click('#startBtn'); await page.waitForTimeout(300);
  await page.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  const txt = await page.evaluate('(document.getElementById("pExit").textContent||"") + " " + (document.getElementById("ecT").textContent||"")');
  expect(/[\u0400-\u04FF]/.test(txt)).toBe(false);
});
