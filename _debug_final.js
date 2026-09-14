
const { chromium } = require('playwright');
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message.substring(0, 80)));
  
  await page.goto('https://igraspore.pages.dev/?cb=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
  await wait(5000);
  
  // Check if updateOrg is now defined
  const fnCheck = await page.evaluate(() => ({
    updateOrg: typeof updateOrg,
    canDivide: typeof canDivide,
    doDivide: typeof doDivide,
    finishDivide: typeof finishDivide,
    doCyst: typeof doCyst,
    killOrg: typeof killOrg,
    spawnOrg: typeof spawnOrg,
    updateWorld: typeof updateWorld,
    SPECIES_DB: typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.length : 0
  }));
  console.log('Functions:', JSON.stringify(fnCheck));
  
  // Start game
  await page.evaluate(() => { selSpecies = 45; settings.renderMode = 'swiss'; _rmodeUserPicked = true; startGame(false); });
  
  // Pump game ticks
  await page.evaluate(() => {
    var ts = performance.now();
    for (var i = 0; i < 300; i++) gameLoop(ts + i * 16);
  });
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o => o.className = 'ov'); });
  
  // Check game state
  const gs = await page.evaluate(() => ({
    orgs: orgs.length,
    playerAge: player ? Math.round(player.age) : null,
    playerEnergy: player ? Math.round(player.energy) : null,
    playerSize: player ? Math.round(player.size*10)/10 : null,
    playerMassFood: player ? Math.round(player.massFood*10)/10 : null,
    canDivide: player ? canDivide(player) : null,
    divReason: player ? divideBlockReason(player) : null
  }));
  console.log('Game state:', JSON.stringify(gs));
  
  // Division test
  await page.evaluate(() => {
    player.energy = 500; player.size = player.sp.size * 1.2; player.age = 100;
    player.divCD = 0; player.cyst = false; player.dividing = false;
    player.massFood = 10;
    doDivide(player);
  });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<200;i++) gameLoop(ts+i*16); });
  
  const afterDiv = await page.evaluate(() => ({
    dividing: player ? player.dividing : null,
    divT: player ? Math.round((player.divT||0)*100)/100 : null,
    orgs: orgs.length
  }));
  console.log('Division:', JSON.stringify(afterDiv));
  
  // Starvation test
  await page.evaluate(() => { selSpecies=45; startGame(false); });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<300;i++) gameLoop(ts+i*16); });
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o=>o.className='ov'); });
  
  await page.evaluate(() => { if(player){player.energy=0;player.invuln=0;player._starvedOnce=false;} });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<200;i++) gameLoop(ts+i*16); });
  
  const starve = await page.evaluate(() => ({
    cyst: player?player.cyst:null,
    energy: player?Math.round(player.energy):null,
    alive: player?player.alive:null
  }));
  console.log('Starvation:', JSON.stringify(starve));
  
  // Hunt test
  await page.evaluate(() => { selSpecies=45; startGame(false); });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<300;i++) gameLoop(ts+i*16); });
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o=>o.className='ov'); });
  
  const hunt = await page.evaluate(() => {
    if(!player||!player.alive) return {ok:false};
    var prey=null,md=Infinity;
    for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o||!o.alive||o===player)continue;
      if(o.sp.size<player.sp.size*0.9){var dx=o.x-player.x,dy=o.y-player.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;prey=o;}}}
    if(!prey) return {ok:false};
    player.x=prey.x+2;player.y=prey.y+2;
    var e1=Math.round(player.energy);
    tryPlayerEat();
    return{ok:true,p:prey.sp.name,e1:e1,e2:Math.round(player.energy),pa:prey.alive};
  });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<60;i++) gameLoop(ts+i*16); });
  console.log('Hunt:', JSON.stringify(hunt));
  
  // JS errors
  console.log('\nJS errors:', errors.length);
  errors.slice(0,5).forEach(e => console.log('  ERR:', e));
  
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
