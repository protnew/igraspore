const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => {
      console.log('PAGE ERROR STACK:', err.stack);
      process.exit(1);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Start game
  await page.click('#startBtn');
  console.log('Game started.');

  // Let it run for 1000 cycles (approx 16 seconds at 60fps)
  console.log('Simulating 1000+ cycles...');
  await page.waitForTimeout(16000);

  // Check for NaN or Infinity in organisms
  const nanCount = await page.evaluate(() => {
      let errs = 0;
      for(let o of window.orgs) {
          if(isNaN(o.x) || isNaN(o.y) || isNaN(o.vx) || isNaN(o.vy) || !isFinite(o.x) || !isFinite(o.y)) {
              errs++;
          }
      }
      return errs;
  });

  if (nanCount > 0) {
      console.error(`FAILED: Found ${nanCount} organisms with NaN or Infinity coordinates!`);
      process.exit(1);
  }

  console.log('NaN/Infinity detection passed (0 errors).');
  
  // Test completed
  await page.screenshot({ path: 'playwright_test_result.png' });
  console.log('SUCCESS: All temporal stress tests passed.');
  await browser.close();
})();
