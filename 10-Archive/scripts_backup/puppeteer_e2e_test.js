const puppeteer = require('puppeteer');

(async () => {
  let hasError = false;
  const browser = await puppeteer.launch();
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

  console.log('Starting E2E verification...');
  await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/index.html');
  
  try {
    console.log('1. Testing Language Selector UI...');
    await page.waitForSelector('#langSelWrap');
    await page.click('#langSelWrap');
    await new Promise(r => setTimeout(r, 500));
    // Click English language item
    await page.evaluate(() => {
      let items = document.querySelectorAll('.lang-item');
      for(let i=0; i<items.length; i++) {
        if(items[i].getAttribute('data-lang') === 'en') { items[i].click(); break; }
      }
    });

    console.log('2. Testing Species Categories...');
    await page.waitForSelector('.cb[data-c="producer"]');
    await page.click('.cb[data-c="producer"]');
    await new Promise(r => setTimeout(r, 500));
    await page.click('.cb[data-c="virus"]');
    await new Promise(r => setTimeout(r, 500));

    console.log('3. Starting Game Engine...');
    await page.click('#startBtn');
    
    // Play for 3 seconds
    console.log('4. Simulating gameplay and hotkeys (WASD)...');
    await new Promise(r => setTimeout(r, 1000));
    await page.keyboard.press('KeyW');
    await page.keyboard.press('KeyD');
    await page.mouse.move(800, 600);
    await page.mouse.move(200, 300);
    await new Promise(r => setTimeout(r, 2000));

    console.log('5. Testing Zoom...');
    await page.evaluate(() => {
       window.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));
    });
    await new Promise(r => setTimeout(r, 1000));

    if (hasError) {
       console.log('TEST RESULT: FAILED. Errors were detected.');
       process.exit(1);
    } else {
       console.log('TEST RESULT: SUCCESS. 0 errors detected across full E2E pipeline.');
    }

  } catch (e) {
    console.error('Test script exception:', e);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
