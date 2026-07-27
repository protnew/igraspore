
const { test } = require('@playwright/test');

test('LIVE button test on GitHub Pages', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));
  
  page.setDefaultTimeout(20000);
  
  // Navigate to LIVE site with cache-busting
  await page.goto('https://protnew.github.io/igraspore/?nocache=' + Date.now(), { 
    waitUntil: 'load', timeout: 20000 
  });
  await page.waitForTimeout(2000);
  
  // Check what version we have
  const version = await page.evaluate(() => {
    return {
      hasDeadO: !!document.getElementById('deadO'),
      startBtn: !!document.getElementById('startBtn'),
      startBtnText: document.getElementById('startBtn') ? document.getElementById('startBtn').textContent : 'N/A',
      screensaverBtn: !!document.getElementById('screensaverBtn'),
      helpBtn: !!document.getElementById('helpBtn'),
      setBtn2: !!document.getElementById('setBtn2'),
      wikiBtnMenu: !!document.getElementById('wikiBtnMenu'),
      SPECIES_DB: typeof SPECIES_DB !== 'undefined' ? Object.keys(SPECIES_DB).length : 'undef',
    };
  });
  console.log('LIVE VERSION:', JSON.stringify(version));
  
  // Click START
  const startBtn = await page.$('#startBtn');
  if (startBtn) {
    const box = await startBtn.boundingBox();
    console.log('startBtn box:', JSON.stringify(box));
    
    // Try JS click first
    await page.evaluate(() => { 
      var btn = document.getElementById('startBtn');
      console.log('startBtn onclick:', typeof btn.onclick);
      btn.click(); 
    });
    await page.waitForTimeout(2000);
    
    const afterStart = await page.evaluate(() => ({
      state: typeof state !== 'undefined' ? state : 'undef',
      actBar: document.getElementById('actBar') ? document.getElementById('actBar').style.display : 'N/A',
    }));
    console.log('After start click:', JSON.stringify(afterStart));
    
    // Try action buttons
    const bEat = await page.$('#bEat');
    if (bEat) {
      const box2 = await bEat.boundingBox();
      console.log('bEat box:', JSON.stringify(box2));
    }
    
    await page.screenshot({ path: 'screenshots/LIVE-01-after-start.png' });
  }
  
  console.log('ERRORS:', errors.length ? errors.join('; ') : 'NONE');
  console.log('DONE');
});
