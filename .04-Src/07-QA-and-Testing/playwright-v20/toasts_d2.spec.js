const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');
// Y2 (TZ v20, D2): тосты только по Eat
async function boot(page){
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.click('#startBtn');
  await page.waitForFunction('document.getElementById("introO").className==="ov show" || state==="playing"', null, { timeout: 10000 });
  await page.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  await page.waitForFunction('state==="playing"', null, { timeout: 5000 });
  await page.evaluate('window.skipTutorial && window.skipTutorial()');
  await page.waitForTimeout(400);
}
test('[Y2-a] явный Eat без добычи рядом → тост промаха ≥1', async ({ page }) => {
  await boot(page);
  await page.evaluate('(function(){ for(var i=orgs.length-1;i>=0;i--){ var o=orgs[i]; if(o&&o.alive&&o!==player&&Math.hypot(o.x-player.x,o.y-player.y)<260){ o.x+=6000; } } })()'); // очистить ближнюю добычу
  const n = await page.evaluate('(function(){ window.__t=0; var o=window.showToast; window.showToast=function(m,c){window.__t++; return o(m,c)}; window.tryPlayerEat(); return window.__t; })()');
  expect(n).toBeGreaterThanOrEqual(1);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-Y2-eat-toast.png' });
});
test('[Y2-b] 12 с без ввода → 0 тостов', async ({ page }) => {
  await boot(page);
  await page.evaluate('(function(){ for(var i=orgs.length-1;i>=0;i--){ var o=orgs[i]; if(o&&o.alive&&o!==player&&Math.hypot(o.x-player.x,o.y-player.y)<260){ o.x+=6000; } } })()');
  await page.evaluate('(function(){ window.__t=0; var o=window.showToast||function(){}; window.showToast=function(m,c){ if(m!=="Туториал пройден"&&m!=="Tutorial complete"){window.__t++;} return o(m,c)}; })()');
  await page.waitForTimeout(12000);
  const n = await page.evaluate('window.__t');
  expect(n).toBe(0);
});
test('[Y2-c] пробел → 0 тостов (без добычи)', async ({ page }) => {
  await boot(page);
  await page.evaluate('(function(){ for(var i=orgs.length-1;i>=0;i--){ var o=orgs[i]; if(o&&o.alive&&o!==player&&Math.hypot(o.x-player.x,o.y-player.y)<260){ o.x+=6000; } } })()');
  const n = await page.evaluate('(function(){ window.__t=0; var o=window.showToast; window.showToast=function(m,c){window.__t++; return o(m,c)}; document.dispatchEvent(new KeyboardEvent("keydown",{key:" ",code:"Space",bubbles:true})); return window.__t; })()');
  expect(n).toBe(0);
});
