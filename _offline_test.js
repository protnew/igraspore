
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  // Step 1: Load online
  console.log('Step 1: Loading online...');
  await page.goto('https://igraspore.pages.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  // Check cache
  const cachedCount = await page.evaluate(async () => {
    const keys = await caches.keys();
    let total = 0;
    for (const key of keys) {
      const cache = await caches.open(key);
      const reqs = await cache.keys();
      total += reqs.length;
    }
    return total;
  });
  console.log('  Cached resources: ' + cachedCount);
  
  // Step 2: Go offline
  console.log('Step 2: Going offline...');
  await page.context().setOffline(true);
  await page.waitForTimeout(500);
  
  // Step 3: Reload offline
  console.log('Step 3: Reloading offline...');
  try {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const state = await page.evaluate(() => {
      return {
        hasCanvas: !!document.getElementById('c'),
        orgsCount: (typeof orgs !== 'undefined') ? orgs.length : -1,
        hasStartGame: typeof startGame,
        bodyLen: document.body ? document.body.innerText.length : 0
      };
    });
    
    console.log('  Canvas: ' + state.hasCanvas);
    console.log('  Orgs: ' + state.orgsCount);
    console.log('  startGame: ' + state.hasStartGame);
    console.log('  Body text length: ' + state.bodyLen);
    
    if (state.hasCanvas && state.orgsCount >= 0 && state.hasStartGame === 'function') {
      console.log('\nVERDICT: OFFLINE WORKS');
    } else {
      console.log('\nVERDICT: OFFLINE FAILED');
    }
  } catch (e) {
    console.log('  Reload error: ' + e.message.substring(0, 100));
    console.log('\nVERDICT: OFFLINE FAILED');
  }
  
  await page.context().setOffline(false);
  await browser.close();
})().catch(e => console.error('FATAL:', e.message));
