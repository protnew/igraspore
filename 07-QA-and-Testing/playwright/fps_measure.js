
const { test } = require('@playwright/test');

test('HUD text', async ({ page }) => {
  page.setDefaultTimeout(30000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(3000);
  
  // Get ALL text that contains "FPS" or numbers that look like FPS
  const text = await page.evaluate(() => {
    // Look for the right-side stat panel
    var rightPanel = document.querySelector('.statR, [class*="stat"], [id*="stat"]');
    if (rightPanel) return rightPanel.innerText;
    
    // Fallback: search for any element containing "FPS"
    var all = document.querySelectorAll('div, span');
    for (var i = 0; i < all.length; i++) {
      if (all[i].innerText && all[i].innerText.length < 200 && /\d+/.test(all[i].innerText)) {
        var t = all[i].innerText.trim();
        if (t.length > 5 && t.length < 100) console.log(i, t.replace(/\n/g, ' | '));
      }
    }
    return document.body.innerText.substring(0, 2000);
  });
  
  console.log('HUD:', text.substring(0, 500));
  
  // Also set NIGHT and check FPS  
  await page.evaluate(() => { tod = 1; updateTodUI(); });
  await page.waitForTimeout(3000);
  
  // Measure actual FPS using rAF timestamps
  const measuredFPS = await page.evaluate(async () => {
    var frameTimes = [];
    return new Promise(resolve => {
      var count = 0;
      var startT = performance.now();
      function loop() {
        count++;
        if (performance.now() - startT < 3000) {
          requestAnimationFrame(loop);
        } else {
          resolve(Math.round(count / 3));
        }
      }
      requestAnimationFrame(loop);
    });
  });
  
  console.log('MEASURED NIGHT FPS:', measuredFPS);
  
  // Day
  await page.evaluate(() => { tod = 12; updateTodUI(); });
  await page.waitForTimeout(2000);
  const dayFPS = await page.evaluate(async () => {
    return new Promise(resolve => {
      var count = 0;
      var startT = performance.now();
      function loop() {
        count++;
        if (performance.now() - startT < 3000) {
          requestAnimationFrame(loop);
        } else {
          resolve(Math.round(count / 3));
        }
      }
      requestAnimationFrame(loop);
    });
  });
  console.log('MEASURED DAY FPS:', dayFPS);
  
  // Screenshot night
  await page.evaluate(() => { tod = 1; updateTodUI(); });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/FINAL-14-night-final.png' });
});
