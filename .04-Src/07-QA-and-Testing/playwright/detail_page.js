
const { test } = require('@playwright/test');
test('Cell biology detail page', async ({ page }) => {
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/screenshots/cell_biology_detail.html', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/BIO-DETAIL-ALL4.png' });
  console.log('DONE');
});
