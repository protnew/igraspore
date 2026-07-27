
const { test } = require('@playwright/test');

test('Button responsiveness test', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  
  page.setDefaultTimeout(15000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  // 1. Click START button
  console.log('STEP 1: Clicking startBtn...');
  const startBtn = await page.$('#startBtn');
  const startBox = await startBtn.boundingBox();
  console.log('startBtn box:', JSON.stringify(startBox));
  
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(2000);
  
  const state1 = await page.evaluate(() => ({
    state: typeof state !== 'undefined' ? state : 'undef',
    actBarDisplay: document.getElementById('actBar') ? document.getElementById('actBar').style.display : 'no-el',
    menuOClass: document.getElementById('menuO') ? document.getElementById('menuO').className : 'no-el',
    popCount: typeof orgs !== 'undefined' ? orgs.length : 0
  }));
  console.log('After start:', JSON.stringify(state1));
  
  // 2. Try clicking action bar buttons
  console.log('STEP 2: Testing action buttons...');
  
  const bEat = await page.$('#bEat');
  if (bEat) {
    const box = await bEat.boundingBox();
    console.log('bEat box:', JSON.stringify(box));
    // Real click
    await page.mouse.click(box.x + box.width/2, box.y + box.height/2);
    await page.waitForTimeout(500);
    console.log('bEat clicked OK');
  }
  
  const bDiv = await page.$('#bDiv');
  if (bDiv) {
    const box = await bDiv.boundingBox();
    console.log('bDiv box:', JSON.stringify(box));
    await page.mouse.click(box.x + box.width/2, box.y + box.height/2);
    await page.waitForTimeout(500);
    console.log('bDiv clicked OK');
  }
  
  const bAuto = await page.$('#bAuto');
  if (bAuto) {
    const box = await bAuto.boundingBox();
    console.log('bAuto box:', JSON.stringify(box));
    await page.mouse.click(box.x + box.width/2, box.y + box.height/2);
    await page.waitForTimeout(500);
    console.log('bAuto clicked OK');
  }
  
  // 3. Try keyboard
  console.log('STEP 3: Keyboard test...');
  await page.keyboard.press('KeyW');
  await page.waitForTimeout(200);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(200);
  console.log('Keyboard OK');
  
  // 4. Check canvas click
  console.log('STEP 4: Canvas click test...');
  const canvas = await page.$('#c');
  const cBox = await canvas.boundingBox();
  await page.mouse.click(cBox.x + cBox.width/2, cBox.y + cBox.height/2);
  await page.waitForTimeout(500);
  console.log('Canvas clicked OK');
  
  // 5. Screenshot of gameplay
  await page.screenshot({ path: 'screenshots/CLICK-01-gameplay.png' });
  
  // 6. Check FPS during all this
  const fps = await page.evaluate(() => {
    return new Promise(resolve => {
      var count = 0, start = performance.now();
      function loop() {
        count++;
        if (performance.now() - start < 2000) requestAnimationFrame(loop);
        else resolve(Math.round(count / 2));
      }
      requestAnimationFrame(loop);
    });
  });
  console.log('FPS during gameplay:', fps);
  
  // 7. Check for JS errors
  console.log('JS errors:', errors.length ? errors.join('; ') : 'NONE');
  
  console.log('ALL DONE');
});
