const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');
test('[B6] intro card once per species, game paused under it', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  await page.evaluate('try{localStorage.removeItem("igs.intro.0")}catch(e){}');
  await page.click('#startBtn');
  await page.waitForTimeout(600);
  const s1 = await page.evaluate('({shown: document.getElementById("introO").className, state: state})');
  expect(s1.shown).toBe('ov show'); expect(s1.state).toBe('paused');
  const e1 = await page.evaluate('player.energy');
  await page.waitForTimeout(2500);
  const e2 = await page.evaluate('player.energy');
  expect(e1).toBe(e2); // энергия заморожена под карточкой
  await page.click('#introOk');
  await page.waitForTimeout(250);
  expect(await page.evaluate('state')).toBe('playing');
  // повторный старт тем же видом — карточки нет
  await page.evaluate('player=null; state="menu"; document.getElementById("menuO").className="ov show"; hideGameHud();');
  await page.click('#startBtn');
  await page.waitForTimeout(700);
  expect(await page.evaluate('document.getElementById("introO").className')).toBe('ov');
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-B6-card-spec.png' });
});
