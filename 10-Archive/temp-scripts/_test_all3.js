const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  
  page.on('console', msg => { if (msg.type() === 'error') console.log('[ERR]', msg.text().substring(0,200)); });
  
  await page.goto('https://igraspore.pages.dev?v=t3' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  // Start game and track camera + player
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(1000);
  
  // Check initial player
  const init = await page.evaluate(() => {
    return {
      player: player ? { name: player.sp.name, cat: player.sp.cat, alive: player.alive, x: Math.round(player.x), y: Math.round(player.y) } : null,
      cam: { x: Math.round(cam.x), y: Math.round(cam.y), zoom: cam.zoom ? Math.round(cam.zoom*100)/100 : '?' },
      freeCam: typeof freeCam !== 'undefined' ? freeCam : '?',
      autoAI: typeof autoAI !== 'undefined' ? autoAI : '?',
    };
  });
  console.log('INITIAL:', JSON.stringify(init));
  
  // Wait 3 seconds - does camera switch?
  await page.waitForTimeout(3000);
  
  const after3s = await page.evaluate(() => {
    return {
      player: player ? { name: player.sp.name, cat: player.sp.cat, alive: player.alive, x: Math.round(player.x), y: Math.round(player.y) } : null,
      cam: { x: Math.round(cam.x), y: Math.round(cam.y), zoom: cam.zoom ? Math.round(cam.zoom*100)/100 : '?' },
      freeCam: typeof freeCam !== 'undefined' ? freeCam : '?',
      autoAI: typeof autoAI !== 'undefined' ? autoAI : '?',
    };
  });
  console.log('AFTER 3s:', JSON.stringify(after3s));
  
  // Virus check
  const virusState = await page.evaluate(() => {
    var v = viruses || [];
    return {
      count: v.length,
      sample: v.length ? { x: Math.round(v[0].x), y: Math.round(v[0].y), vx: Math.round(v[0].vx*100)/100, vy: Math.round(v[0].vy*100)/100, name: v[0].sp.name } : null,
    };
  });
  console.log('VIRUS:', JSON.stringify(virusState));
  
  // Run 3 more seconds
  await page.evaluate(() => { for(var i=0;i<90;i++) updateWorld(1/30); });
  
  const afterVirus = await page.evaluate(() => {
    var v = viruses || [];
    var infected = (orgs||[]).filter(function(o){return o.infectionT > 0}).length;
    return {
      virusCount: v.length,
      infected: infected,
      playerAlive: player ? player.alive : false,
      playerName: player ? player.sp.name : '?',
      playerEnergy: player ? Math.round(player.energy) : 0,
      playerInfected: player ? (player.infectionT || 0) : 0,
    };
  });
  console.log('VIRUS AFTER 3s:', JSON.stringify(afterVirus));
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
