
const { test } = require('@playwright/test');

test('Cell detail at zoom 60', async ({ page }) => {
  page.setDefaultTimeout(20000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Enable free cam so camera stays where we put it
  await page.evaluate(() => { freeCam = true; });
  await page.waitForTimeout(500);
  
  // Find the LARGEST cell and center camera on it
  const target = await page.evaluate(() => {
    var candidates = orgs.filter(o => o.alive && o.size > 15);
    candidates.sort((a,b) => b.size - a.size);
    var t = candidates[0];
    if(!t) return null;
    cam.x = t.x; cam.y = t.y;
    zoom = 60; tZoom = 60;
    return { name: t.sp.name, size: t.size, x: t.x, y: t.y, organs: t.organs ? t.organs.length : 0 };
  });
  console.log('TARGET: ' + JSON.stringify(target));
  await page.waitForTimeout(3000);
  
  // Screenshot
  await page.screenshot({ path: 'screenshots/BIO-CELL-DETAIL-z60.png' });
  
  // Also take one with microscope overlay
  await page.evaluate(() => { settings.microscopeMode = true; });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/BIO-CELL-MICRO-z60.png' });
  
  // Find a ciliate specifically
  const ciliate = await page.evaluate(() => {
    var candidates = orgs.filter(o => o.alive && o.sp.bio && o.sp.bio.cilia);
    candidates.sort((a,b) => b.size - a.size);
    var t = candidates[0];
    if(!t) return null;
    cam.x = t.x; cam.y = t.y;
    zoom = 50; tZoom = 50;
    settings.microscopeMode = false;
    return { name: t.sp.name, size: t.size };
  });
  console.log('CILIATE: ' + JSON.stringify(ciliate));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/BIO-CILIATE-z50.png' });
  
  // Find a flagellated cell
  const flagellate = await page.evaluate(() => {
    var candidates = orgs.filter(o => o.alive && o.sp.bio && o.sp.bio.flag);
    candidates.sort((a,b) => b.size - a.size);
    var t = candidates[0];
    if(!t) return null;
    cam.x = t.x; cam.y = t.y;
    zoom = 50; tZoom = 50;
    return { name: t.sp.name, size: t.size };
  });
  console.log('FLAGELLATE: ' + JSON.stringify(flagellate));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/BIO-FLAGELLATE-z50.png' });
  
  console.log('DONE');
});
