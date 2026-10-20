const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');
test('[B4] demo: autopilot player, >=30 orgs, camera moves (4 probes)', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  await page.click('#screensaverBtn');
  const probes = [];
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(5000);
    probes.push(await page.evaluate(`(function(){
      var vL=cam.x-cv.width/2/zoom, vR=cam.x+cv.width/2/zoom, vT=cam.y-cv.height/2/zoom, vB=cam.y+cv.height/2/zoom;
      var vis=0; for(var k=0;k<orgs.length;k++){var o=orgs[k]; if(o&&o.alive&&o.x>vL&&o.x<vR&&o.y>vT&&o.y<vB)vis++;}
      return {alive: !!(player&&player.alive), auto: !!autoAI, camX: Math.round(cam.x), camY: Math.round(cam.y), vis: vis};})()`));
  }
  for (const p of probes) { expect(p.alive).toBe(true); expect(p.auto).toBe(true); expect(p.vis).toBeGreaterThanOrEqual(30); }
  const moved = Math.abs(probes[3].camX-probes[0].camX) + Math.abs(probes[3].camY-probes[0].camY);
  expect(moved).toBeGreaterThanOrEqual(20);
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
