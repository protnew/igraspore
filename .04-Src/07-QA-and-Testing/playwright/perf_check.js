
const { test } = require('@playwright/test');

test('Perf check after shadowBlur removal', async ({ page }) => {
  page.setDefaultTimeout(30000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  
  // Start game
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(2000);
  
  // Set to NIGHT (max bioluminescence organisms)
  await page.evaluate(() => { tod = 1; updateTodUI(); });
  await page.waitForTimeout(3000);
  
  // Measure FPS for 5 seconds
  const stats = await page.evaluate(async () => {
    var frames = 0;
    var start = performance.now();
    await new Promise(r => setTimeout(r, 5000));
    frames = window._frameCount || 0;
    return {
      fps: document.getElementById('fpsV') ? document.getElementById('fpsV').textContent : 'n/a',
      pop: document.getElementById('popV') ? document.getElementById('popV').textContent : 'n/a',
      cpu: document.getElementById('cpuV') ? document.getElementById('cpuV').textContent : 'n/a',
    };
  });
  
  console.log('NIGHT STATS:', JSON.stringify(stats));
  
  // Screenshot
  await page.screenshot({ path: 'screenshots/FINAL-12-night-perf.png' });
  
  // Switch to DAY
  await page.evaluate(() => { tod = 12; updateTodUI(); });
  await page.waitForTimeout(2000);
  
  const dayStats = await page.evaluate(() => ({
    fps: document.getElementById('fpsV') ? document.getElementById('fpsV').textContent : 'n/a',
    pop: document.getElementById('popV') ? document.getElementById('popV').textContent : 'n/a',
  }));
  console.log('DAY STATS:', JSON.stringify(dayStats));
  
  await page.screenshot({ path: 'screenshots/FINAL-13-day-perf.png' });
  
  console.log('DONE');
});
