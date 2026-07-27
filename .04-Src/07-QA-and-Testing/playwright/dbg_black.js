
const { test } = require('@playwright/test');

test('Debug black screen', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(2000);
  
  // Switch to realistic FIRST
  await page.evaluate(() => toggleRenderModeLarge());
  await page.waitForTimeout(1000);
  
  // Get organisms in viewport at default zoom (0.5)
  const debug = await page.evaluate(() => {
    var vw = cv.width/zoom, vh = cv.height/zoom;
    var vL = cam.x - vw/2, vR = cam.x + vw/2;
    var vT = cam.y - vh/2, vB = cam.y + vh/2;
    var inView = orgs.filter(o => o.alive && o.x >= vL && o.x <= vR && o.y >= vT && o.y <= vB);
    return JSON.stringify({
      zoom: zoom.toFixed(2),
      vw: Math.round(vw), vh: Math.round(vh),
      totalAlive: orgs.filter(o => o.alive).length,
      inViewport: inView.length,
      mode: settings.renderMode,
      // Check canvas pixels
      canvasW: cv.width, canvasH: cv.height,
    });
  });
  console.log('DEBUG: ' + debug);
  
  // Read actual canvas pixels to see if anything is drawn
  const pixels = await page.evaluate(() => {
    var ctx2 = cv.getContext('2d');
    var imgData = ctx2.getImageData(cv.width/2-50, cv.height/2-50, 100, 100);
    var sum = 0;
    for(var i = 0; i < imgData.data.length; i += 4) {
      sum += imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];
    }
    var avg = sum / (100*100*3);
    return JSON.stringify({ avgBrightness: Math.round(avg), sample: [imgData.data[0], imgData.data[1], imgData.data[2], imgData.data[4], imgData.data[5], imgData.data[6]] });
  });
  console.log('PIXELS: ' + pixels);
  
  // Try zoom 3
  await page.evaluate(() => { tZoom = 3; zoom = 3; });
  await page.waitForTimeout(1000);
  
  const pixels2 = await page.evaluate(() => {
    var ctx2 = cv.getContext('2d');
    var imgData = ctx2.getImageData(cv.width/2-50, cv.height/2-50, 100, 100);
    var sum = 0;
    for(var i = 0; i < imgData.data.length; i += 4) {
      sum += imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];
    }
    return JSON.stringify({ avgBrightness: Math.round(sum / (100*100*3)) });
  });
  console.log('PIXELS_Z3: ' + pixels2);
  
  await page.screenshot({ path: 'screenshots/DBG-black-z05.png' });
  await page.evaluate(() => { tZoom = 3; zoom = 3; });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/DBG-black-z3.png' });
  
  console.log('ERRORS: ' + errors.length);
  console.log('DONE');
});
