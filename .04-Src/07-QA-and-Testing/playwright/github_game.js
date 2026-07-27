
const { test } = require('@playwright/test');

test('GitHub Pages realistic in-game', async ({ page }) => {
  page.setDefaultTimeout(30000);
  
  await page.goto('https://protnew.github.io/igraspore/?nocache=' + Date.now(), { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Start game
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Check if renderModeBtn is visible
  const btnInfo = await page.evaluate(() => {
    var btn = document.getElementById('renderModeBtn');
    return {
      exists: !!btn,
      display: btn ? btn.style.display : 'none',
      text: btn ? btn.textContent.trim() : 'N/A',
      class: btn ? btn.className : 'N/A',
    };
  });
  console.log('BTN: ' + JSON.stringify(btnInfo));
  
  // Click realistic toggle
  await page.evaluate(() => {
    var btn = document.getElementById('renderModeBtn');
    if(btn) btn.click();
  });
  await page.waitForTimeout(1000);
  
  const afterClick = await page.evaluate(() => ({
    mode: settings.renderMode,
    btnText: document.getElementById('renderModeBtn') ? document.getElementById('renderModeBtn').textContent.trim() : 'N/A',
  }));
  console.log('AFTER_CLICK: ' + JSON.stringify(afterClick));
  
  // Screenshot
  await page.screenshot({ path: 'screenshots/GITHUB-game-realistic.png' });
  
  console.log('DONE');
});
