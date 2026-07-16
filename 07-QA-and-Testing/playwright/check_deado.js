
const { test } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';

test('Check deadO exists', async ({ page }) => {
  await page.goto(GAME_URL, { waitUntil: 'networkidle' });
  
  // Check if deadO exists in the HTML
  const deadO = await page.evaluate(() => {
    var el = document.getElementById('deadO');
    return el ? { exists: true, html: el.outerHTML.substring(0, 200) } : { exists: false };
  });
  console.log('deadO:', JSON.stringify(deadO));
  
  // Get all elements with 'dead' in their id
  const deadElements = await page.evaluate(() => {
    var els = document.querySelectorAll('[id*="dead"]');
    return Array.from(els).map(e => ({ id: e.id, tag: e.tagName, class: e.className }));
  });
  console.log('dead elements:', JSON.stringify(deadElements));
  
  // Get full body HTML
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  // Search for 'deadO' in body HTML
  const hasDeadO = bodyHTML.includes('deadO');
  console.log('body contains deadO:', hasDeadO);
  
  // Also check if there's a deadScreen element
  const hasDeadScreen = bodyHTML.includes('deadScreen');
  console.log('body contains deadScreen:', hasDeadScreen);
  
  // Check the page source
  const pageSource = await page.content();
  console.log('page source contains deadO:', pageSource.includes('deadO'));
  console.log('page source length:', pageSource.length);
});
