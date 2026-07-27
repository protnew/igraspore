
const { test } = require('@playwright/test');

test('GitHub Pages version check', async ({ page }) => {
  page.setDefaultTimeout(30000);
  
  // Fetch the actual JS from GitHub Pages
  await page.goto('https://protnew.github.io/igraspore/?nocache=' + Date.now(), { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Check what renderMode code is deployed
  const deployed = await page.evaluate(() => {
    return JSON.stringify({
      renderModeExists: typeof settings !== 'undefined' && 'renderMode' in settings,
      currentMode: typeof settings !== 'undefined' ? settings.renderMode : 'undef',
      toggleExists: typeof toggleRenderModeLarge === 'function',
      renderBtnExists: !!document.getElementById('renderModeBtn'),
      bRenderExists: !!document.getElementById('bRender'),
      microBtnExists: !!document.getElementById('bMicro'),
      // Check if grayscale conversion code exists
      hasGrayscale: typeof hex2rgb === 'function',
      speciesCount: typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.length : 0,
    });
  });
  console.log('DEPLOYED: ' + deployed);
  
  // Try to switch to realistic on GitHub Pages
  if(typeof settings !== 'undefined') {
    await page.evaluate(() => {
      settings.renderMode = 'realistic';
      var btn = document.getElementById('renderModeBtn');
      if(btn) btn.click();
    });
    await page.waitForTimeout(500);
    const mode = await page.evaluate(() => settings.renderMode);
    console.log('GITHUB_MODE: ' + mode);
  }
  
  await page.screenshot({ path: 'screenshots/GITHUB-realistic.png' });
  console.log('DONE');
});
