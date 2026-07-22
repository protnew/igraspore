
const { test } = require('@playwright/test');

test('Visual verification', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // 1. Cartoon mode screenshot
  await page.screenshot({ path: 'screenshots/VIS-cartoon.png' });
  console.log('CARTOON: zoom=' + await page.evaluate(() => zoom.toFixed(1)));
  
  // 2. Switch to realistic
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/VIS-realistic.png' });
  console.log('REALISTIC: mode=' + await page.evaluate(() => settings.renderMode));
  
  // 3. Check render mode button
  const btnText = await page.evaluate(() => {
    var btn = document.getElementById('renderModeBtn');
    return btn ? { text: btn.textContent.trim(), class: btn.className, display: btn.style.display } : null;
  });
  console.log('BUTTON: ' + JSON.stringify(btnText));
  
  // 4. Check shore vegetation count and positions
  const veg = await page.evaluate(() => {
    if(typeof shoreDecor === 'undefined') return null;
    return {
      total: shoreDecor.length,
      types: shoreDecor.reduce((acc, d) => { acc[d.type] = (acc[d.type]||0)+1; return acc; }, {}),
      withShadow: shoreDecor.filter(d => d.hasShadow !== false).length,
      minX: Math.round(Math.min(...shoreDecor.map(d => d.x))),
      maxX: Math.round(Math.max(...shoreDecor.map(d => d.x))),
    };
  });
  console.log('VEGETATION: ' + JSON.stringify(veg));
  
  // 5. Check currents strength
  const currentStrength = await page.evaluate(() => {
    // Check oscillation amplitude
    var testY = 1000;
    var fc_test = 100;
    var amp = Math.sin(testY * 0.002 + fc_test * 0.003) * 3;
    return { amplitude: amp.toFixed(3) };
  });
  console.log('CURRENTS: ' + JSON.stringify(currentStrength));
  
  console.log('DONE');
});
