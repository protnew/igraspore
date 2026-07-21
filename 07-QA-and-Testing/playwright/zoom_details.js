
const { test } = require('@playwright/test');

test('High-zoom cell biology screenshots', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Helper: find cell of specific type and zoom in
  async function zoomToCell(type, zoom, filename) {
    const found = await page.evaluate((t) => {
      var candidates = orgs.filter(o => o.alive && (!t || o.sp.cat === t));
      // Sort by size (largest first for best visibility)
      candidates.sort((a,b) => b.size - a.size);
      var target = candidates[0];
      if(!target) return null;
      cam.x = target.x; cam.y = target.y;
      tZoom = zoom;
      return { name: target.name || target.sp.name, size: target.size, cat: target.sp.cat };
    }, type);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/' + filename });
    return found;
  }
  
  // 1. Producer (algae) with chloroplasts + nucleus + DNA
  const algae = await zoomToCell('producer', 25, 'BIO-zoom-algae.png');
  console.log('ALGAE: ' + JSON.stringify(algae));
  
  // 2. Consumer2 (ciliate) with cilia + macronucleus + oral groove
  const ciliate = await zoomToCell('consumer2', 25, 'BIO-zoom-ciliate.png');
  console.log('CILIATE: ' + JSON.stringify(ciliate));
  
  // 3. Consumer3 (predator) with flagella + trichocysts
  const predator = await zoomToCell('consumer3', 25, 'BIO-zoom-predator.png');
  console.log('PREDATOR: ' + JSON.stringify(predator));
  
  // 4. Decomposer (fungus) with spores
  const fungus = await zoomToCell('decomposer', 25, 'BIO-zoom-fungus.png');
  console.log('FUNGUS: ' + JSON.stringify(fungus));
  
  // 5. Enable microscope mode and zoom
  await page.evaluate(() => {
    settings.microscopeMode = true;
    tZoom = 30;
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/BIO-microscope-detail.png' });
  
  // 6. Night time bioluminescence
  await page.evaluate(() => {
    settings.microscopeMode = false;
    tod = 2; // Deep night
    tZoom = 15;
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/BIO-night-biolum.png' });
  
  // Check organism organs
  const organInfo = await page.evaluate(() => {
    var o = orgs.filter(x => x.alive).sort((a,b) => b.size - a.size)[0];
    if(!o) return null;
    return {
      name: o.sp.name,
      organs: o.organs ? o.organs.map(g => g.t) : [],
      bio: o.sp.bio,
    };
  });
  console.log('ORGANS: ' + JSON.stringify(organInfo));
  
  console.log('DONE');
});
