
const { chromium } = require('playwright');
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  
  await page.goto('https://igraspore.pages.dev/?cb=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
  await wait(3000);
  
  // Check if gameLoop is running
  const fc0 = await page.evaluate(() => fc);
  console.log('Initial fc:', fc0);
  
  // Force start the game loop if it isn't running
  await page.evaluate(() => {
    // Manually trigger the game loop for testing
    if (typeof lastT === 'undefined') lastT = 0;
    // Simulate ~60fps game ticks
    window._testLoop = function(ts) {
      gameLoop(ts);
    };
  });
  
  // Manually pump the game loop at 16ms intervals
  let ts = 1000;
  for (let i = 0; i < 300; i++) {
    await page.evaluate((t) => gameLoop(t), ts);
    ts += 16;
    if (i % 60 === 0) await wait(50);
  }
  
  const fc1 = await page.evaluate(() => fc);
  console.log('After manual gameLoop x300:', fc1);
  
  // Start game
  await page.evaluate(() => { selSpecies = 45; settings.renderMode = 'swiss'; _rmodeUserPicked = true; startGame(false); });
  
  // Pump more game ticks
  for (let i = 0; i < 180; i++) {
    await page.evaluate((t) => gameLoop(t), ts);
    ts += 16;
  }
  
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o => o.className = 'ov'); });
  
  const gameState = await page.evaluate(() => ({
    fc: fc,
    state: state,
    orgsCount: orgs.length,
    playerAlive: player ? player.alive : null,
    playerEnergy: player ? Math.round(player.energy) : null,
    playerAge: player ? Math.round(player.age) : null,
    playerSize: player ? Math.round(player.size*10)/10 : null,
    playerMassFood: player ? Math.round(player.massFood*10)/10 : null,
    canDivide: player ? canDivide(player) : null,
    divReason: player ? divideBlockReason(player) : null
  }));
  console.log('Game state after pump:', JSON.stringify(gameState));
  
  // Force qualify and divide
  await page.evaluate(() => {
    player.energy = 500; player.size = player.sp.size * 1.2; player.age = 100;
    player.divCD = 0; player.cyst = false; player.dividing = false;
    player.massFood = 10;
    doDivide(player);
  });
  
  // Pump game ticks to progress division
  for (let i = 0; i < 120; i++) {
    await page.evaluate((t) => gameLoop(t), ts);
    ts += 16;
  }
  
  const afterDiv = await page.evaluate(() => ({
    dividing: player ? player.dividing : null,
    divT: player ? Math.round((player.divT||0)*100)/100 : null,
    orgsCount: orgs.length,
    playerSize: player ? Math.round(player.size*10)/10 : null
  }));
  console.log('After division pump:', JSON.stringify(afterDiv));
  
  // Test starvation with pump
  await page.evaluate(() => { selSpecies = 45; startGame(false); });
  for (let i = 0; i < 180; i++) { await page.evaluate((t) => gameLoop(t), ts); ts += 16; }
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o => o.className = 'ov'); });
  
  // Set energy to 0 and pump
  await page.evaluate(() => { if (player) { player.energy = 0; player.invuln = 0; player.cyst = false; player._starvedOnce = false; } });
  for (let i = 0; i < 60; i++) { await page.evaluate((t) => gameLoop(t), ts); ts += 16; }
  
  const starveState = await page.evaluate(() => ({
    cyst: player ? player.cyst : null,
    energy: player ? Math.round(player.energy) : null,
    alive: player ? player.alive : null,
    state: state
  }));
  console.log('Starvation after pump:', JSON.stringify(starveState));
  
  // Test death
  await page.evaluate(() => { selSpecies = 45; startGame(false); });
  for (let i = 0; i < 180; i++) { await page.evaluate((t) => gameLoop(t), ts); ts += 16; }
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o => o.className='ov'); });
  
  // Kill all same species
  await page.evaluate(() => {
    if (!player) return;
    var id = player.sp.id;
    orgs.forEach(function(o) { if (o && o.sp.id === id) { o.alive = false; o.dying = true; o.deathT = 0; } });
  });
  for (let i = 0; i < 300; i++) { await page.evaluate((t) => gameLoop(t), ts); ts += 16; }
  
  const deathState = await page.evaluate(() => ({
    state: state,
    playerNull: player === null,
    orgsCount: orgs.length
  }));
  console.log('Death after pump:', JSON.stringify(deathState));
  
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
