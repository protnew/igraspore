
const { test, expect } = require('@playwright/test');
const URL = 'https://protnew.github.io/igraspore/';

test('COMPREHENSIVE: all features', async ({ page }) => {
  const results = {};
  
  // 1. LOAD PAGE
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/CMP-01-menu.png' });
  
  // 2. SCREENSAVER
  const ssBtn = page.locator('#screensaverBtn');
  if (await ssBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await ssBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/CMP-02-screensaver.png' });
    
    const ssState = await page.evaluate(() => ({
      state: state, orgCount: orgs.length, fps: fps
    }));
    results.screensaver = ssState;
    console.log('SCREENSAVER:', JSON.stringify(ssState));
  }
  
  // 3. RELOAD for fresh state
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  
  // 4. START GAME
  await page.locator('#startBtn').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/CMP-03-game-start.png' });
  
  // 5. TUTORIAL
  const tutInfo = await page.evaluate(() => {
    var layer = document.getElementById('tutorialLayer');
    var next = document.getElementById('tutNext');
    return {
      layerExists: !!layer,
      layerDisplay: layer ? getComputedStyle(layer).display : 'n/a',
      nextExists: !!next,
      nextVisible: next ? next.offsetParent !== null : false
    };
  });
  results.tutorial = tutInfo;
  console.log('TUTORIAL:', JSON.stringify(tutInfo));
  
  // Click through tutorial if visible
  if (tutInfo.nextExists && tutInfo.nextVisible) {
    for (let step = 1; step <= 5; step++) {
      const stepInfo = await page.evaluate(() => {
        var c = document.getElementById('tutorialCounter');
        var n = document.getElementById('tutNext');
        return { counter: c ? c.textContent : 'none', nextVis: n ? n.offsetParent !== null : false };
      });
      console.log(`TUT ${step}:`, JSON.stringify(stepInfo));
      if (!stepInfo.nextVis) break;
      await page.locator('#tutNext').click({ timeout: 3000 }).catch(e => console.log('CLICK FAIL:', e.message.substring(0,80)));
      await page.waitForTimeout(500);
      await page.screenshot({ path: `screenshots/CMP-tut-${step}.png` });
    }
  } else {
    await page.evaluate(() => { var b = document.getElementById('tutSkip'); if(b) b.click(); });
    await page.waitForTimeout(500);
    console.log('NO TUTORIAL VISIBLE');
  }
  
  // 6. CELLS VISIBLE (center of screen)
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/CMP-04-cells.png' });
  
  const cells = await page.evaluate(() => {
    var c = document.getElementById('c');
    var ctx = c.getContext('2d');
    var data = ctx.getImageData(0, 0, Math.min(c.width, 400), Math.min(c.height, 400)).data;
    var nonBg = 0, total = data.length / 4;
    for (var i = 0; i < data.length; i += 4)
      if (data[i] > 30 || data[i+1] > 30 || data[i+2] > 30) nonBg++;
    return {
      orgCount: orgs.length,
      pct: (nonBg / total * 100).toFixed(1),
      state: state,
      zoom: typeof zoom !== 'undefined' ? zoom.toFixed(1) : (typeof cam !== 'undefined' && cam.zoom ? cam.zoom.toFixed(1) : 'n/a')
    };
  });
  results.cellsVisible = cells;
  console.log('CELLS:', JSON.stringify(cells));
  
  // 7. DAY/NIGHT CYCLE — sample at 100x speed
  const speed100 = page.locator('text=100x').first();
  if (await speed100.isVisible({ timeout: 1000 }).catch(() => false)) {
    await speed100.click();
    await page.waitForTimeout(300);
  }
  
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(3000);
    const light = await page.evaluate(() => ({
      dayProg: typeof dayProg !== 'undefined' ? dayProg.toFixed(3) : 'n/a',
      dayLight: typeof dayLight !== 'undefined' ? dayLight.toFixed(3) : 'n/a',
      totalDays: typeof totalDays !== 'undefined' ? totalDays : 'n/a',
      isNight: typeof dayLight !== 'undefined' && dayLight < 0.3,
      fps: typeof fps !== 'undefined' ? fps : -1,
      orgCount: orgs.length
    }));
    console.log(`CYCLE ${i}:`, JSON.stringify(light));
    if (i === 1 || i === 4 || i === 7)
      await page.screenshot({ path: `screenshots/CMP-05-cycle-${i}.png` });
  }
  
  // 8. ZOOM IN
  await page.evaluate(() => { if (typeof cam !== 'undefined') { cam.zoom = 8; } else if (typeof zoom !== 'undefined') { zoom = 8; } });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/CMP-06-zoom-in.png' });
  
  console.log('\n=== FINAL ===');
  console.log(JSON.stringify(results, null, 2));
});
