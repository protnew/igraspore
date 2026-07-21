
const { test } = require('@playwright/test');

test('JS syntax check', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  const state = await page.evaluate(() => ({
    SPECIES_DB: typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.length : 'undef',
    settings: typeof settings !== 'undefined' ? 'exists' : 'undef',
    orgs: typeof orgs !== 'undefined' ? orgs.length : 'undef',
  }));
  console.log('STATE: ' + JSON.stringify(state));
  console.log('ERRORS: ' + errors.length);
  errors.forEach(e => console.log('  ' + e.substring(0, 200)));
});
