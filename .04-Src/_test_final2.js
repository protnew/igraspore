const { chromium } = require('playwright');
const wait = ms => new Promise(r => setTimeout(r, ms));
const ssDir = 'C:/Obsidian/New/Projects/08-iGraSpore_V2/03-Design-and-Assets/qa-screenshots/functional_test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message.substring(0, 80)));
  
  await page.goto('https://igraspore.pages.dev/?cb=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await wait(3000);
  
  let p=0,f=0,n=0;
  function chk(name,ok,d){n++;if(ok){p++;console.log('  P'+n+': '+name);}else{f++;console.log('  F'+n+': '+name+' -- '+(d||''));}}
  let step=0;
  async function ss(name) {
    step++;
    try { await page.screenshot({path:ssDir+'/'+String(step).padStart(2,'0')+'_'+name+'.png', timeout:5000}); } catch(e) {}
  }
  function pump(ticks) {
    return page.evaluate((tk) => {
      var ts = performance.now();
      for (var i = 0; i < tk; i++) gameLoop(ts + i * 16);
    }, ticks);
  }
  
  // === START ===
  console.log('=== START GAME ===');
  for (const [idx,nm,cat] of [[0,'Synechocystis','producer'],[25,'Bdellovibrio','consumer1'],[45,'Paramecium','consumer2'],[70,'Actinophrys','consumer3'],[85,'Saccharomyces','decomposer']]) {
    await page.evaluate((i)=>{selSpecies=i;settings.renderMode='swiss';_rmodeUserPicked=true;startGame(false);},idx);
    await wait(1000);
    await page.evaluate(()=>{document.querySelectorAll('.ov.show').forEach(o=>o.className='ov');});
    await wait(200);
    const info = await page.evaluate(()=>player?{n:player.sp.name,c:player.sp.cat,e:Math.round(player.energy)}:null);
    await ss('start_'+nm);
    chk('START '+nm+' ('+cat+')',info&&info.n.toLowerCase().includes(nm.toLowerCase())&&info.c===cat,info?'"'+info.n+'" e='+info.e:'null');
  }
  
  // === HUNT ===
  console.log('\n=== HUNT ===');
  await page.evaluate(()=>{selSpecies=45;startGame(false);});
  await pump(100);
  await page.evaluate(()=>{document.querySelectorAll('.ov.show').forEach(o=>o.className='ov');});
  await ss('hunt_before');
  
  const hunt = await page.evaluate(()=>{
    if(!player||!player.alive)return{ok:false};
    var prey=null,md=Infinity;
    for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o||!o.alive||o===player)continue;
      if(o.sp.size<player.sp.size*0.9){var dx=o.x-player.x,dy=o.y-player.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;prey=o;}}}
    if(!prey)return{ok:false};
    player.x=prey.x+2;player.y=prey.y+2;
    var e1=Math.round(player.energy);tryPlayerEat();
    return{ok:true,p:prey.sp.name,e1:e1,e2:Math.round(player.energy)};
  });
  await pump(20);
  await ss('hunt_after');
  if(hunt.ok) chk('HUNT: eats '+hunt.p,hunt.e2>hunt.e1,'e '+hunt.e1+'->'+hunt.e2);
  else chk('HUNT',false,'no prey');
  
  // === DIVIDE ===
  console.log('\n=== DIVIDE ===');
  await page.evaluate(()=>{selSpecies=45;startGame(false);});
  await pump(100);
  await page.evaluate(()=>{document.querySelectorAll('.ov.show').forEach(o=>o.className='ov');});
  await page.evaluate(()=>{player.energy=500;player.size=player.sp.size*1.2;player.age=100;player.divCD=0;player.cyst=false;player.dividing=false;player.massFood=10;doDivide(player);});
  await ss('divide_start');
  await pump(50);
  const afterDiv = await page.evaluate(()=>({dividing:player?player.dividing:null,orgs:orgs.length}));
  await ss('divide_done');
  chk('DIVIDE: Paramecium',!afterDiv.dividing,'dividing='+afterDiv.dividing);
  
  // === STARVATION ===
  console.log('\n=== STARVATION ===');
  await page.evaluate(()=>{selSpecies=45;startGame(false);});
  await pump(100);
  await page.evaluate(()=>{document.querySelectorAll('.ov.show').forEach(o=>o.className='ov');});
  await page.evaluate(()=>{if(player){player.energy=0;player.invuln=0;player._starvedOnce=false;}});
  await pump(50);
  const starve = await page.evaluate(()=>({cyst:player?player.cyst:null,e:player?Math.round(player.energy):null}));
  await ss('starvation');
  chk('STARVATION: cyst',starve.cyst===true,'cyst='+starve.cyst+' e='+starve.e);
  
  // === ZOOM ===
  console.log('\n=== ZOOM ===');
  await page.evaluate(()=>{selSpecies=45;startGame(false);});
  await pump(30);
  await page.evaluate(()=>{document.querySelectorAll('.ov.show').forEach(o=>o.className='ov');});
  await page.evaluate(()=>{tZoom=8;zoom=8;});
  await wait(300);
  await ss('zoom_8x');
  chk('ZOOM 8x',Math.abs(await page.evaluate(()=>zoom)-8)<1);
  
  await page.evaluate(()=>{tZoom=0.5;zoom=0.5;});
  await wait(300);
  await ss('zoom_far');
  chk('ZOOM 0.5x',Math.abs(await page.evaluate(()=>zoom)-0.5)<1);
  
  // === MODES ===
  console.log('\n=== MODES ===');
  await page.evaluate(()=>{tZoom=2;zoom=2;settings.renderMode='cartoon';});
  await pump(20);
  await ss('mode_cartoon');
  chk('CARTOON',await page.evaluate(()=>settings.renderMode)==='cartoon');
  
  await page.evaluate(()=>{settings.renderMode='swiss';});
  await pump(20);
  await ss('mode_swiss');
  chk('SWISS',await page.evaluate(()=>settings.renderMode)==='swiss');
  
  // === BUTTONS ===
  console.log('\n=== BUTTONS ===');
  const a1=await page.evaluate(()=>autoAI);
  await page.evaluate(()=>{var b=document.getElementById('bAuto');if(b)b.click();});
  chk('AUTO toggle',await page.evaluate(()=>autoAI)!==a1);
  const fc1=await page.evaluate(()=>freeCam);
  await page.evaluate(()=>{var b=document.getElementById('bFree');if(b)b.click();});
  chk('FREECAM toggle',await page.evaluate(()=>freeCam)!==fc1);
  
  // === PHOTOSYNTHESIS ===
  console.log('\n=== PHOTOSYNTHESIS ===');
  await page.evaluate(()=>{selSpecies=0;startGame(false);});
  await pump(30);
  await page.evaluate(()=>{document.querySelectorAll('.ov.show').forEach(o=>o.className='ov');});
  const e1=await page.evaluate(()=>player?Math.round(player.energy):0);
  await pump(30);
  const e2=await page.evaluate(()=>player?Math.round(player.energy):0);
  await ss('photosynthesis');
  chk('PHOTOSYNTHESIS',e2>=e1,'e '+e1+'->'+e2);
  
  console.log('\n'+'='.repeat(50));
  console.log('TOTAL: '+p+'/'+n+' ('+Math.round(p/n*100)+'%) FAIL:'+f);
  console.log('JS errors: '+errors.length);
  if(errors.length)errors.slice(0,5).forEach(e=>console.log('  ERR: '+e));
  console.log('Screenshots: '+step);
  
  await browser.close();
})().catch(e=>{console.error('FATAL:',e.message);process.exit(1);});
