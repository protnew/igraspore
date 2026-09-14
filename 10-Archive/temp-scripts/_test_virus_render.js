const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('JS ERROR:', msg.text());
  });
  
  await page.goto('https://igraspore.pages.dev?v=vr' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);

  // Get details about viruses
  const data = await page.evaluate(() => {
    var vList = [];
    for (var i = 0; i < Math.min(viruses.length, 3); i++) {
      var v = viruses[i];
      vList.push({
        shape: v.sp.shape,
        color: v.sp.color,
        cat: v.sp.cat,
        speed: v.sp.speed,
        x: Math.round(v.x), y: Math.round(v.y),
      });
    }
    
    // Check if updateViruses is called in game loop
    var callFound = false;
    // Check updateWorld function
    var uW = updateWorld.toString();
    callFound = uW.indexOf('updateViruses') >= 0;
    
    return {
      viruses: vList,
      updateVirusesCalled: callFound,
      virusCount: viruses.length,
    };
  });
  console.log(JSON.stringify(data, null, 2));

  // Check: which functions are called in updateWorld
  const worldLoop = await page.evaluate(() => {
    return updateWorld.toString().substring(0, 500);
  });
  console.log('\nupdateWorld (first 500 chars):');
  console.log(worldLoop);

  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
