const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');
test('[B3] 9 HUD elements hidden in menu', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.click('#startBtn'); await page.waitForTimeout(300);
  await page.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  await page.evaluate('window.__igsTest ? window.__igsTest.killPlayer() : (player=null)');
  await page.waitForFunction('document.getElementById("deadO").className==="ov show"', null, { timeout: 5000 });
  await page.click('#menuBtn'); await page.waitForTimeout(400);
  const r = await page.evaluate(`(function(){
    var ids=['hud','topR','ecoP','legP','actBar','scaleW','spdBar','todWrap','camM'];
    var bad=[]; for(var i=0;i<ids.length;i++){ var el=document.getElementById(ids[i]);
      if(!el || !(getComputedStyle(el).display==='none' || el.getBoundingClientRect().width===0)) bad.push(ids[i]); }
    return {bad: bad, state: state};})()`);
  expect(r.bad).toEqual([]); expect(r.state).toBe('menu');
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-B3-menu-spec.png' });
});
