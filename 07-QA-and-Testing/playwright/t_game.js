
const { test } = require('@playwright/test');
test('Game start + tutorial + cells', async ({ page }) => {
  await page.goto('https://protnew.github.io/igraspore/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  
  await page.locator('#startBtn').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/CMP-03-game-start.png' });
  
  // Tutorial check
  const tut = await page.evaluate(() => {
    var layer = document.getElementById('tutorialLayer');
    var next = document.getElementById('tutNext');
    return {
      layerExists: !!layer, layerVis: layer ? layer.offsetParent !== null : false,
      layerDisp: layer ? getComputedStyle(layer).display : 'n/a',
      nextExists: !!next, nextVis: next ? next.offsetParent !== null : false
    };
  });
  console.log('TUT:', JSON.stringify(tut));
  
  if (tut.nextVis) {
    for (let s = 1; s <= 5; s++) {
      const si = await page.evaluate(() => {
        var c = document.getElementById('tutorialCounter');
        var n = document.getElementById('tutNext');
        return { counter: c ? c.textContent : 'none', nextVis: n ? n.offsetParent !== null : false };
      });
      console.log(`T${s}:`, JSON.stringify(si));
      if (!si.nextVis) break;
      await page.locator('#tutNext').click({ timeout: 3000 }).catch(e => console.log('FAIL:', e.message.substring(0,80)));
      await page.waitForTimeout(500);
      await page.screenshot({ path: `screenshots/CMP-tut-${s}.png` });
    }
  } else {
    console.log('NO TUTORIAL — game starts directly');
  }
  
  // Cells check
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/CMP-04-cells.png' });
  
  const cells = await page.evaluate(() => {
    var c = document.getElementById('c');
    var ctx = c.getContext('2d');
    var data = ctx.getImageData(0, 0, 400, 400).data;
    var nonBg = 0;
    for (var i = 0; i < data.length; i += 4)
      if (data[i] > 30 || data[i+1] > 30 || data[i+2] > 30) nonBg++;
    return { orgCount: orgs.length, pct: (nonBg / (data.length/4) * 100).toFixed(1), state: state };
  });
  console.log('CELLS:', JSON.stringify(cells));
});
