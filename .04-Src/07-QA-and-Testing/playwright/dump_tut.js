
const { test } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';

test('Dump tutorial HTML', async ({ page }) => {
  await page.goto(GAME_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  
  // Click start
  await page.locator('#startBtn').click();
  await page.waitForTimeout(1500);
  
  // Get the FULL HTML of the page
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  
  // Find tutNext element and its surrounding HTML
  const tutHtml = await page.evaluate(() => {
    var btn = document.getElementById('tutNext');
    if (!btn) return 'NO tutNext element';
    // Get parent chain
    var p = btn.parentElement;
    var chain = [];
    var el = btn;
    for (var i = 0; i < 5; i++) {
      chain.push({
        tag: el.tagName, id: el.id, class: el.className,
        style: el.getAttribute('style') || '',
        html: el.outerHTML.substring(0, 300)
      });
      el = el.parentElement;
      if (!el) break;
    }
    return chain;
  });
  
  console.log('TUT NEXT CHAIN:', JSON.stringify(tutHtml, null, 2));
  
  // Get computed style
  const computed = await page.evaluate(() => {
    var btn = document.getElementById('tutNext');
    if (!btn) return null;
    var cs = window.getComputedStyle(btn);
    return {
      display: cs.display,
      visibility: cs.visibility,
      width: cs.width,
      height: cs.height,
      position: cs.position,
      zIndex: cs.zIndex,
      opacity: cs.opacity,
      overflow: cs.overflow,
      parentDisplay: btn.parentElement ? window.getComputedStyle(btn.parentElement).display : 'none',
      parentVisibility: btn.parentElement ? window.getComputedStyle(btn.parentElement).visibility : 'none',
      parentPosition: btn.parentElement ? window.getComputedStyle(btn.parentElement).position : 'none',
    };
  });
  console.log('COMPUTED STYLE:', JSON.stringify(computed, null, 2));
  
  // Find what creates the tutorial — search for tutNext in all script tags
  const scriptSearch = await page.evaluate(() => {
    var scripts = document.querySelectorAll('script');
    var results = [];
    scripts.forEach(s => {
      if (s.src) results.push('external: ' + s.src);
      else if (s.textContent.includes('tutNext') || s.textContent.includes('tutBtn')) {
        results.push('inline: ' + s.textContent.substring(s.textContent.indexOf('tutNext') - 100, s.textContent.indexOf('tutNext') + 200));
      }
    });
    return results;
  });
  console.log('SCRIPT SEARCH:', JSON.stringify(scriptSearch));
});
