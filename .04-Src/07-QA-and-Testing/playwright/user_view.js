
const { test } = require('@playwright/test');

test('User view - realistic mode', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Check DEFAULT mode
  const defaultMode = await page.evaluate(() => settings.renderMode);
  console.log('DEFAULT_MODE=' + defaultMode);
  
  // Screenshot in default (cartoon)
  await page.screenshot({ path: 'screenshots/USER-cartoon-default.png' });
  
  // Now switch to realistic via the big button
  await page.evaluate(() => {
    var btn = document.getElementById('renderModeBtn');
    if(btn) btn.click();
    else if(document.getElementById('bRender')) document.getElementById('bRender').click();
  });
  await page.waitForTimeout(1000);
  
  // Verify switch happened
  const afterSwitch = await page.evaluate(() => ({
    mode: settings.renderMode,
    btnText: document.getElementById('renderModeBtn') ? document.getElementById('renderModeBtn').textContent.trim() : 'NO BTN',
  }));
  console.log('AFTER_SWITCH=' + JSON.stringify(afterSwitch));
  
  // Screenshot in realistic
  await page.screenshot({ path: 'screenshots/USER-realistic.png' });
  
  // Zoom in to see organisms
  await page.evaluate(() => { tZoom = 10; zoom = 10; });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/USER-realistic-zoom.png' });
  
  console.log('DONE');
});
