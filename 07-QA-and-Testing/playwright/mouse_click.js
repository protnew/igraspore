
const { test, expect } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';

test('Tutorial: real mouse click on Далее', async ({ page }) => {
  await page.goto(GAME_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  await page.locator('#startBtn').click();
  await page.waitForTimeout(2000);
  
  // Get button position
  const btnRect = await page.evaluate(() => {
    var btn = document.getElementById('tutNext');
    var r = btn.getBoundingClientRect();
    // Check what element is at the center of the button
    var cx = r.x + r.width/2, cy = r.y + r.height/2;
    var topEl = document.elementFromPoint(cx, cy);
    return {
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      centerX: cx, centerY: cy,
      topElementAtCenter: topEl ? topEl.tagName + '#' + topEl.id + '.' + topEl.className : 'none',
      isButtonOnTop: topEl === btn,
      tutLayerZ: window.getComputedStyle(document.getElementById('tutorialLayer')).zIndex,
      canvasZ: window.getComputedStyle(document.getElementById('c')).zIndex,
    };
  });
  console.log('BUTTON RECT:', JSON.stringify(btnRect));
  
  // Try real mouse click at button center
  await page.mouse.click(btnRect.centerX, btnRect.centerY);
  await page.waitForTimeout(1000);
  
  // Check if tutorial advanced
  const counter = await page.evaluate(() => {
    var el = document.getElementById('tutorialCounter');
    return el ? el.textContent : 'not found';
  });
  console.log('COUNTER AFTER MOUSE CLICK:', counter);
  
  await page.screenshot({ path: 'screenshots/tut-mouse-click.png' });
  
  // If still on step 1, the button is blocked by another element
  if (counter === '1 / 5') {
    console.log('BUG: Mouse click did NOT advance tutorial — button is blocked!');
    // Check what's blocking
    const blocking = await page.evaluate(() => {
      var btn = document.getElementById('tutNext');
      var r = btn.getBoundingClientRect();
      var cx = r.x + r.width/2, cy = r.y + r.height/2;
      var els = [];
      // Check all elements at this point
      var el = document.elementFromPoint(cx, cy);
      while (el) {
        els.push({ tag: el.tagName, id: el.id, class: el.className, z: window.getComputedStyle(el).zIndex });
        el = el.parentElement;
        if (els.length > 10) break;
      }
      return els;
    });
    console.log('ELEMENTS AT BUTTON CENTER:', JSON.stringify(blocking));
  } else {
    console.log('OK: Mouse click advanced tutorial to', counter);
  }
});
