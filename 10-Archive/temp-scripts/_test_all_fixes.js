const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  
  await page.goto('https://igraspore.pages.dev?v=fx' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);
  
  // Get initial player position
  const init = await page.evaluate(() => ({
    player: player ? { name: player.sp.name, x: Math.round(player.x), y: Math.round(player.y) } : null,
    cam: { x: Math.round(cam.x), y: Math.round(cam.y) },
    focusTarget: window.focusTarget ? 'SET' : 'null',
    focusTimer: window.focusTimer,
  }));
  console.log('INITIAL:', JSON.stringify(init));
  
  // Run 10 seconds of game time and check camera stability every 2s
  for (var t = 2; t <= 10; t += 2) {
    await page.evaluate(() => { for(var i=0;i<2*30;i++) updateWorld(1/30); });
    var snap = await page.evaluate(() => ({
      player: player ? { x: Math.round(player.x), y: Math.round(player.y), alive: player.alive } : null,
      cam: { x: Math.round(cam.x), y: Math.round(cam.y) },
      camOnPlayer: player ? (Math.abs(cam.x - player.x) < 200 && Math.abs(cam.y - (player.y-18)) < 200) : false,
      focusTarget: window.focusTarget ? 'SET' : 'null',
      focusTimer: window.focusTimer,
    }));
    console.log('t=' + t + 's:', JSON.stringify(snap));
  }
  
  // Virus check
  const vState = await page.evaluate(() => {
    var v = viruses || [];
    var infected = (orgs||[]).filter(function(o){return o.infectionT > 0});
    return {
      count: v.length,
      infected: infected.length,
      infectedNames: infected.slice(0,3).map(function(o){return o.sp.name}),
    };
  });
  console.log('VIRUS:', JSON.stringify(vState));
  
  // Switch to bioicons + screenshot
  await page.evaluate(() => {
    settings.renderMode = 'bioicons';
    if (typeof applyRenderMode === 'function') applyRenderMode();
    if (typeof window.loadBioicons === 'function' && !window.bioiconsReady()) window.loadBioicons();
  });
  await page.waitForTimeout(3000);
  await page.evaluate(() => { for(var i=0;i<30;i++) updateWorld(1/30); });
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIOICONS-CLEAN.png' });
  
  // Also screenshot cartoon mode for comparison
  await page.evaluate(() => {
    settings.renderMode = 'cartoon';
    if (typeof applyRenderMode === 'function') applyRenderMode();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/CARTOON-CLEAN.png' });
  
  console.log('Screenshots done');
  console.log('ERRORS:', errors.length);
  errors.slice(0,3).forEach(function(e){console.log('  ',e)});
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
