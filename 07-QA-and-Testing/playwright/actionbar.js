
const { test } = require('@playwright/test');

test('Action bar screenshot', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Check action bar buttons
  const buttons = await page.evaluate(() => {
    var btns = document.querySelectorAll('.ab');
    return Array.from(btns).map(b => ({
      id: b.id,
      title: b.title,
      text: b.textContent.trim().substring(0, 10),
    }));
  });
  console.log('BUTTONS: ' + JSON.stringify(buttons));
  
  // Click microscope
  await page.evaluate(() => document.getElementById('bMicro').click());
  await page.waitForTimeout(500);
  
  const microStyle = await page.evaluate(() => {
    var b = document.getElementById('bMicro');
    return { bg: b.style.background, border: b.style.borderColor };
  });
  console.log('MICRO_STYLE: ' + JSON.stringify(microStyle));
  
  // Screenshot of bottom action bar
  await page.screenshot({ path: 'screenshots/BIO-actionbar.png', fullPage: false });
  console.log('DONE');
});
