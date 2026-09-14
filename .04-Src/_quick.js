const { chromium } = require('playwright');
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 400, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message.substring(0, 80)));
  
  await page.goto('https://igraspore.pages.dev/?cb=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await wait(3000);
  
  // Check functions
  const fnCheck = await page.evaluate(() => ({
    updateOrg: typeof updateOrg,
    canDivide: typeof canDivide,
    doDivide: typeof doDivide,
    killOrg: typeof killOrg,
    finishDivide: typeof finishDivide,
    doCyst: typeof doCyst,
    SPECIES_DB: typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.length : 0
  }));
  console.log('Functions:', JSON.stringify(fnCheck));
  
  // Start game as Paramecium
  await page.evaluate(() => { selSpecies=45; startGame(false); });
  
  // Pump just 30 ticks
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<30;i++) gameLoop(ts+i*16); });
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o=>o.className='ov'); });
  
  // Check player state AFTER pump
  const gs = await page.evaluate(() => ({
    age: player ? Math.round(player.age) : null,
    energy: player ? Math.round(player.energy) : null,
    orgs: orgs.length,
    alive: player ? player.alive : null,
    canDivide: player ? canDivide(player) : null,
    divReason: player ? divideBlockReason(player) : null,
    massFood: player ? Math.round(player.massFood*100)/100 : null
  }));
  console.log('After 30 ticks:', JSON.stringify(gs));
  
  // Division test
  await page.evaluate(() => {
    player.energy=500;player.size=player.sp.size*1.2;player.age=100;
    player.divCD=0;player.cyst=false;player.dividing=false;player.massFood=10;
    doDivide(player);
  });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<40;i++) gameLoop(ts+i*16); });
  
  const afterDiv = await page.evaluate(() => ({
    dividing: player ? player.dividing : null,
    divT: player ? Math.round((player.divT||0)*100)/100 : null,
    orgs: orgs.length
  }));
  console.log('Division:', JSON.stringify(afterDiv));
  
  // Starvation test
  await page.evaluate(() => { selSpecies=45; startGame(false); });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<30;i++) gameLoop(ts+i*16); });
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o=>o.className='ov'); });
  await page.evaluate(() => { if(player){player.energy=0;player.invuln=0;player._starvedOnce=false;} });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<30;i++) gameLoop(ts+i*16); });
  
  const starve = await page.evaluate(() => ({
    cyst: player?player.cyst:null,
    e: player?Math.round(player.energy):null
  }));
  console.log('Starvation:', JSON.stringify(starve));
  
  // Hunt test
  await page.evaluate(() => { selSpecies=45; startGame(false); });
  await page.evaluate(() => { var ts=performance.now(); for(var i=0;i<30;i++) gameLoop(ts+i*16); });
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o=>o.className='ov'); });
  
  const hunt = await page.evaluate(() => {
    if(!player||!player.alive)return{ok:false};
    var prey=null,md=Infinity;
    for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o||!o.alive||o===player)continue;
      if(o.sp.size<player.sp.size*0.9){var dx=o.x-player.x,dy=o.y-player.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;prey=o;}}}
    if(!prey)return{ok:false};
    player.x=prey.x+2;player.y=prey.y+2;
    var e1=Math.round(player.energy);tryPlayerEat();
    return{ok:true,p:prey.sp.name,e1:e1,e2:Math.round(player.energy)};
  });
  console.log('Hunt:', JSON.stringify(hunt));
  
  // Buttons
  const a1=await page.evaluate(()=>autoAI);
  await page.evaluate(()=>{var b=document.getElementById('bAuto');if(b)b.click();});
  const a2=await page.evaluate(()=>autoAI);
  const fc1=await page.evaluate(()=>freeCam);
  await page.evaluate(()=>{var b=document.getElementById('bFree');if(b)b.click();});
  const fc2=await page.evaluate(()=>freeCam);
  console.log('Auto:', a1+'->'+a2+' Freecam:', fc1+'->'+fc2);
  
  // Errors
  console.log('\nJS errors:', errors.length);
  errors.slice(0,5).forEach(e=>console.log('  '+e));
  
  await browser.close();
})().catch(e=>{console.error('FATAL:',e.message);process.exit(1);});
