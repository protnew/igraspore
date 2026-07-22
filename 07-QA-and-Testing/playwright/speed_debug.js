
const { test } = require('@playwright/test');

test('Speed debug', async ({ page }) => {
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  const speedDebug = await page.evaluate(() => {
    var o = orgs.find(x => x.alive && !x.isPlayer);
    if(!o) return 'no org';
    var sp = o.sp;
    var speed = Math.max(sp.speed, 0.8) * SPD_SCALE * 0.05;
    return {
      spSpeed: sp.speed,
      SPD_SCALE: SPD_SCALE,
      computedSpeed: speed,
      vx: o.vx,
      vy: o.vy,
      x: Math.round(o.x),
      y: Math.round(o.y),
      state: o.state,
      timeScale: timeScale,
      gt: gt,
    };
  });
  console.log('SPEED: ' + JSON.stringify(speedDebug));
  
  // Wait 2 more seconds then check position
  await page.waitForTimeout(2000);
  
  const moved = await page.evaluate(() => {
    var o = orgs.find(x => x.alive && !x.isPlayer);
    if(!o) return 'no org';
    return {
      x: Math.round(o.x),
      y: Math.round(o.y),
      vx: o.vx.toFixed(4),
      vy: o.vy.toFixed(4),
      state: o.state,
    };
  });
  console.log('AFTER_2S: ' + JSON.stringify(moved));
  
  console.log('DONE');
});
