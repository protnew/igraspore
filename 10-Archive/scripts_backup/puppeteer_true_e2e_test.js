const puppeteer = require('puppeteer');

(async () => {
  let hasError = false;
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
      hasError = true;
    }
  });
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
    hasError = true;
  });

  console.log('Starting True E2E verification (Holistic Testing)...');
  await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/index.html', { timeout: 0 });
  
  try {
    console.log('1. Testing UI Elements & Layout (Rule 12: Visual & DOM Audit)');
    await page.waitForSelector('#langSelWrap');
    console.log('DOM is loaded and intact.');

    // Simulate real user interaction (Rule 18: True User Simulation)
    await page.click('#langSelWrap');
    await new Promise(r => setTimeout(r, 200));
    await page.evaluate(() => {
      let items = document.querySelectorAll('.lang-item');
      for(let i=0; i<items.length; i++) {
        if(items[i].getAttribute('data-lang') === 'en') { items[i].click(); break; }
      }
    });

    await page.waitForSelector('.cb[data-c="producer"]');
    await page.click('.cb[data-c="producer"]');
    await new Promise(r => setTimeout(r, 200));
    
    console.log('2. Starting Game via UI Click...');
    await page.click('#startBtn');
    await new Promise(r => setTimeout(r, 1000));

    // Temporal Stress Test (Rule 12: Time-based Verification)
    console.log('3. Running Temporal Stress Test (10000 ms real-time simulation)...');
    
    // Instead of forcing `updateWorld()`, we just let `requestAnimationFrame` run!
    // We wait 10 seconds to let physics calculate real collisions with walls.
    await new Promise(r => setTimeout(r, 10000));

    let physicsTest = await page.evaluate(() => {
       if(!player) return 'Player not spawned';
       if(isNaN(player.x) || isNaN(player.y)) return 'CRITICAL PHYSICS NaN EXPLOSION: Coordinates are NaN';
       if(isNaN(player.vx) || isNaN(player.vy)) return 'CRITICAL PHYSICS NaN EXPLOSION: Velocities are NaN';
       if(isNaN(cam.x) || isNaN(cam.y)) return 'CAMERA BROKEN: NaN';
       return 'SUCCESS';
    });
    console.log('   Physics & Stability Result:', physicsTest);
    if(physicsTest !== 'SUCCESS') hasError = true;

    // Visual Rendering check
    console.log('4. Verifying Canvas Render...');
    let renderTest = await page.evaluate(() => {
       let cv = document.getElementById('c');
       if(!cv) return 'Canvas missing';
       if(cv.width === 0 || cv.height === 0) return 'Canvas size is 0';
       return 'SUCCESS';
    });
    console.log('   Render Engine Result:', renderTest);
    if(renderTest !== 'SUCCESS') hasError = true;

    await page.screenshot({ path: 'true_e2e_result.png' });
    console.log('   Screenshot saved: true_e2e_result.png');

    console.log('TEST RESULT: ' + (hasError ? 'FAILED' : 'ALL DEEP TESTS PASSED.'));

  } catch (err) {
    console.error('TEST SCRIPT CRASH:', err);
    hasError = true;
  }
  
  await browser.close();
  process.exit(hasError ? 1 : 0);
})();
