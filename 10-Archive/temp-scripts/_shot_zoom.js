const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  await page.goto('https://igraspore.pages.dev?v=zm' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy';
    startGame();
  });
  await page.waitForTimeout(2000);
  
  // Switch to bioicons
  await page.evaluate(() => { settings.renderMode='bioicons'; applyRenderMode(); });
  await page.waitForTimeout(500);
  
  // Check current zoom
  const z1 = await page.evaluate(() => ({ zoom: zoom, tZoom: tZoom }));
  console.log('Initial zoom:', JSON.stringify(z1));
  
  // Set zoom using the proper game variable
  await page.evaluate(() => {
    zoom = 8.0;
    tZoom = 8.0;
    // Center on a large organism
    var biggest = null;
    for(var i=0;i<orgs.length;i++){
      if(orgs[i].alive && (!biggest || orgs[i].size > biggest.size)) biggest = orgs[i];
    }
    if(biggest){ cam.x = biggest.x; cam.y = biggest.y; }
  });
  
  // Run frames to let camera settle
  for(var i = 0; i < 5; i++) {
    await page.waitForTimeout(200);
    await page.evaluate(() => { for(var j=0;j<5;j++) updateWorld(1/30); });
  }
  
  // Check zoom again
  const z2 = await page.evaluate(() => ({ zoom: zoom, tZoom: tZoom, camX: Math.round(cam.x), camY: Math.round(cam.y) }));
  console.log('After set zoom:', JSON.stringify(z2));
  
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIOICONS-V2-MAXZOOM.png' });
  console.log('screenshot done');
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
