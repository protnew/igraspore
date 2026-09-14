const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  
  await page.goto('https://igraspore.pages.dev?v=px' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty = 'easy';
    startGame();
  });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { settings.renderMode='bioicons'; applyRenderMode(); });
  await page.waitForTimeout(500);
  
  // Center on organisms and zoom in
  await page.evaluate(() => {
    // Find a big rod near player
    var target = null;
    for(var i=0;i<orgs.length;i++){
      var o=orgs[i]; if(!o.alive)continue;
      if(o.sp.shape==='rod' && o.size>5){target=o;break;}
    }
    if(!target){for(var i=0;i<orgs.length;i++){if(orgs[i].alive&&orgs[i].size>5){target=orgs[i];break;}}}
    if(target){cam.x=target.x;cam.y=target.y;}
    zoom=10;tZoom=10;
  });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { for(var i=0;i<10;i++) updateWorld(1/30); });
  
  // Take screenshot with device scale factor 2
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIOICONS-HD.png' });
  
  // Also check: is drawBioicon actually being called?
  const callCount = await page.evaluate(() => {
    // Instrument drawBioicon
    var origDraw = window.drawBioicon;
    var count = 0;
    window.drawBioicon = function() { count++; return origDraw.apply(this, arguments); };
    // Run one frame
    for(var i=0;i<1;i++) updateWorld(1/30);
    // render
    if(typeof render === 'function') render();
    window.drawBioicon = origDraw;
    return count;
  });
  console.log('drawBioicon called per frame:', callCount);
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
