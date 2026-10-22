const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');
test('[B4] release demo: spectator pond, >=30 visible, exit chrome', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  await page.click('#screensaverBtn');
  await page.waitForTimeout(2500);
  const p = await page.evaluate(`(function(){
    var vL=cam.x-cv.width/2/zoom, vR=cam.x+cv.width/2/zoom, vT=cam.y-cv.height/2/zoom, vB=cam.y+cv.height/2/zoom;
    var vis=0; for(var k=0;k<orgs.length;k++){var o=orgs[k]; if(o&&o.alive&&o.x>vL&&o.x<vR&&o.y>vT&&o.y<vB)vis++;}
    var x=document.getElementById('demoExit');
    return {demo:!!window.demoMode, vis:vis, exit:x?x.style.display:''};})()`);
  expect(p.demo).toBe(true);
  expect(p.vis).toBeGreaterThanOrEqual(30);
  expect(p.exit).toBe('flex');
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-B4-demo-spec.png' });
});
test('[B5] demoExit 48x48 + key exits to menu', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  await page.click('#screensaverBtn');
  await page.waitForTimeout(1500);
  const r = await page.evaluate(`(function(){var x=document.getElementById('demoExit'); var b=x.getBoundingClientRect(); return {w:b.width,h:b.height,d:x.style.display};})()`);
  expect(r.w).toBe(48); expect(r.h).toBe(48); expect(r.d).toBe('flex');
  await page.keyboard.press('x');
  await page.waitForTimeout(300);
  expect(await page.evaluate('state')).toBe('menu');
});
