
const { test, expect } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';

test('Tutorial Next button works', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  
  await page.goto(GAME_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  
  // Click start button
  const startBtn = page.locator('#startBtn');
  if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(1500);
  }
  
  // Take screenshot of tutorial step 1
  await page.screenshot({ path: 'screenshots/tutorial-01-step1.png' });
  
  // Find all visible text on page
  const allText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log('PAGE TEXT AFTER START:', allText.substring(0, 500));
  
  // Look for "Далее" button
  const nextBtn = page.locator('text=Далее');
  const nextVisible = await nextBtn.isVisible({ timeout: 2000 }).catch(() => false);
  console.log('NEXT BUTTON VISIBLE:', nextVisible);
  
  if (nextVisible) {
    // Get button info
    const btnInfo = await nextBtn.evaluate(el => ({
      tag: el.tagName,
      id: el.id,
      class: el.className,
      onclick: el.onclick ? 'has onclick' : 'no onclick',
      disabled: el.disabled,
      parent: el.parentElement ? el.parentElement.id : 'none',
      rect: el.getBoundingClientRect()
    }));
    console.log('NEXT BUTTON INFO:', JSON.stringify(btnInfo));
    
    // Try clicking it
    try {
      await nextBtn.click({ timeout: 3000 });
      console.log('NEXT CLICK: SUCCESS');
    } catch (e) {
      console.log('NEXT CLICK FAILED:', e.message.substring(0, 200));
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/tutorial-02-after-next.png' });
    
    // Check if tutorial advanced
    const newText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('TEXT AFTER NEXT:', newText.substring(0, 300));
    
    // Check tutorial step
    const tutStep = await page.evaluate(() => {
      // Look for step indicator like "1/5" or "2/5"
      var match = document.body.innerText.match(/(\d+)\/(\d+)/);
      return match ? match[0] : 'not found';
    });
    console.log('TUTORIAL STEP:', tutStep);
  } else {
    // Maybe it says "Пропустить" (skip) — check what buttons exist
    const skipBtn = page.locator('text=Пропустить');
    const skipVisible = await skipBtn.isVisible({ timeout: 1000 }).catch(() => false);
    console.log('SKIP BUTTON VISIBLE:', skipVisible);
    
    // Check for any tutorial-related elements
    const tutElements = await page.evaluate(() => {
      var results = [];
      // Check for overlay elements
      var overlays = document.querySelectorAll('[class*="tut"], [id*="tut"], [class*="overlay"], [id*="overlay"]');
      overlays.forEach(el => {
        results.push({ tag: el.tagName, id: el.id, class: el.className, text: el.innerText.substring(0, 100) });
      });
      // Check all buttons
      var btns = document.querySelectorAll('button, [onclick], .btn');
      btns.forEach(el => {
        var t = el.innerText.trim();
        if (t && t.length < 50) results.push({ tag: el.tagName, id: el.id, class: el.className, text: t });
      });
      return results;
    });
    console.log('TUTORIAL ELEMENTS:', JSON.stringify(tutElements).substring(0, 1000));
  }
  
  // Check for JS errors
  console.log('JS ERRORS:', errors.length > 0 ? errors : 'none');
  
  // Final screenshot
  await page.screenshot({ path: 'screenshots/tutorial-03-final.png' });
});
