const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('console', m => { if(m.type()==='error') console.log('[ERR]', m.text().substring(0,200)); });
  
  await page.goto('https://igraspore.pages.dev?v=det' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
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
  
  // Find a diverse cluster of organisms and zoom WAY in
  await page.evaluate(() => {
    // Find organisms of different shapes near player
    var diverse = [];
    var shapes_seen = {};
    for(var i=0;i<orgs.length;i++){
      var o=orgs[i]; if(!o.alive)continue;
      var sh=o.sp.shape;
      if(!shapes_seen[sh] && Math.abs(o.x-player.x)<300 && Math.abs(o.y-player.y)<200){
        shapes_seen[sh]=true;
        diverse.push(o);
      }
    }
    // Center camera on diverse cluster
    if(diverse.length>0){
      cam.x = diverse[0].x;
      cam.y = diverse[0].y;
    }
    zoom = 6.0; // VERY high zoom
    tZoom = 6.0;
  });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { for(var i=0;i<10;i++) updateWorld(1/30); });
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIOICONS-V2-DETAIL.png' });
  console.log('screenshot done');
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
