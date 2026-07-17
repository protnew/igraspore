
const { test } = require('@playwright/test');

test('Get FPS IDs', async ({ page }) => {
  page.setDefaultTimeout(30000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(500);
  await page.evaluate(() => { document.getElementById('startBtn').click(); });
  await page.waitForTimeout(3000);
  
  // Find FPS-related elements
  const result = await page.evaluate(() => {
    var all = document.querySelectorAll('*');
    var found = [];
    for(var i = 0; i < all.length; i++) {
      var el = all[i];
      var txt = (el.textContent || '').trim();
      if(txt.match(/^\d+$/) && parseInt(txt) > 10 && parseInt(txt) < 200) {
        // Could be FPS
        found.push({id: el.id, class: el.className, tag: el.tagName, text: txt});
      }
    }
    // Also get the specific stats bar text
    var sb = document.getElementById('statBar');
    return {
      matches: found.slice(0, 10),
      statBarHTML: sb ? sb.innerHTML.substring(0, 500) : 'not found',
      bodyText: document.body.innerText.match(/(?:FPS|fps|кадр)[^\n]{0,30}/g)
    };
  });
  
  console.log('FPS elements:', JSON.stringify(result, null, 2));
});
