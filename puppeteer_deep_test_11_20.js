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

  console.log('Starting Deep E2E verification for Backlog 11-20...');
  await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/index.html', { timeout: 0 });
  
  try {
    console.log('1. Menu Setup...');
    await page.waitForSelector('#langSelWrap');
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

    await page.click('#startBtn');
    await new Promise(r => setTimeout(r, 1000));

    // Test 1: Global Catastrophe Logic (Acid Rain)
    console.log('Test 1: Global Catastrophe Logic');
    let acidTest = await page.evaluate(() => {
       if(!window.globalCatastrophe) return 'Catastrophe manager missing';
       let p = player;
       if(!p) return 'Player not spawned';
       let e1 = p.energy;
       p.y = 10; // near surface
       window.globalCatastrophe.active = true;
       window.globalCatastrophe.type = 'acid';
       window.globalCatastrophe.timer = 10;
       
       // Force update loop for a few simulated frames
       let oldRand = Math.random;
       Math.random = () => 0.01;
       updateWorld(0.016);
       Math.random = oldRand;
       
       let e2 = p.energy;
       if(e2 >= e1) return 'Energy did not decrease from acid rain';
       return 'SUCCESS';
    });
    console.log('   Result:', acidTest);
    if(acidTest !== 'SUCCESS') hasError = true;

    // Test 2: Parasitic Infection
    console.log('Test 2: Parasitic Infection Mechanism');
    let parasiteTest = await page.evaluate(() => {
       let p = player;
       let parasiteSp = window.VIRUS_SPECS.find(v => v.type === 'parasite');
       if(!parasiteSp) return 'Parasite spec missing';
       
       // Spawn parasite exactly at player coordinates
       viruses.push({x: p.x, y: p.y, vx: 0, vy: 0, sp: parasiteSp, target: null, age: 0, angle: 0, wobble: 0});
       
       for(let i=0; i<60; i++) {
           updateViruses(0.016);
           updateInfections(0.016);
       }
       
       if(!p.infected) return 'Player did not get infected';
       if(!p.parasiticInfection) return 'Parasitic infection flag missing';
       return 'SUCCESS';
    });
    console.log('   Result:', parasiteTest);
    if(parasiteTest !== 'SUCCESS') hasError = true;

    // Test 3: Cyst Mechanics
    console.log('Test 3: Cyst Mechanics (Temperature Extreme)');
    let cystTest = await page.evaluate(() => {
       let p = player;
       p.y = PD - 5; // force bottom
       generateTempGrid(); // ensure it exists
       // Forcibly make it freezing
       TEMP_GRID[19] = -10; 
       p.sp.tempRange = [10, 30]; // Must be outside
       p.energy = 50;
       
       updateWorld(0.016);
       
       if(!p.cyst) return 'Player did not encyst in extreme temp';
       return 'SUCCESS';
    });
    console.log('   Result:', cystTest);
    if(cystTest !== 'SUCCESS') hasError = true;

    // Test 4: DNA Export
    console.log('Test 4: DNA Base64 Export');
    let exportTest = await page.evaluate(() => {
       if(typeof window.exportDNA !== 'function') return 'exportDNA missing';
       window.exportDNA();
       let b64 = document.getElementById('dnaString').value;
       if(!b64 || b64.length < 10) return 'exportDNA returned invalid string';
       return 'SUCCESS';
    });
    console.log('   Result:', exportTest);
    if(exportTest !== 'SUCCESS') hasError = true;

    if (hasError) {
       console.log('TEST RESULT: FAILED.');
       process.exit(1);
    } else {
       console.log('TEST RESULT: ALL DEEP TESTS PASSED.');
    }

  } catch (e) {
    console.error('Test script exception:', e);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
