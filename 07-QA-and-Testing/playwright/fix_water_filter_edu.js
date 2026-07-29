
const { test } = require('@playwright/test');
test('black water + ciliate filter + org edu', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(700);

  // Start as Paramecium
  await page.evaluate(()=>{
    for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer2'){selSpecies=i;break;}
  });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  const morning = await page.evaluate(()=>({tod:+tod.toFixed(1), dayLight:+dayLight.toFixed(2), cat:player.sp.cat, name:player.sp.name}));
  console.log('START '+JSON.stringify(morning));

  // Realistic mode screenshot - sample center pixel brightness
  await page.evaluate(()=>{ settings.renderMode='realistic'; zoom=3.5; tZoom=3.5; });
  await page.waitForTimeout(400);
  await page.screenshot({path:'screenshots/FIX-realistic-water.png'});
  const bright = await page.evaluate(()=>{
    const c = document.getElementById('cv') || document.querySelector('canvas');
    const ctx = c.getContext('2d');
    // sample center region average luminance
    const w=c.width,h=c.height;
    const img = ctx.getImageData(w*0.35,h*0.35, Math.floor(w*0.3), Math.floor(h*0.3));
    let s=0,n=img.data.length/4;
    for(let i=0;i<img.data.length;i+=4){ s += 0.2126*img.data[i]+0.7152*img.data[i+1]+0.0722*img.data[i+2]; }
    return +(s/n).toFixed(1);
  });
  console.log('CENTER_LUMA '+bright+' (want >18, not near 0 black)');

  // Cartoon mode too
  await page.evaluate(()=>{ settings.renderMode='cartoon'; });
  await page.waitForTimeout(300);
  await page.screenshot({path:'screenshots/FIX-cartoon-water.png'});

  // Filter feed test: place tiny bacteria in zone
  const feed = await page.evaluate(()=>{
    autoAI=false;
    player.eaten=0; player.massFood=0; player.energy=60;
    // kill nearby large stuff
    for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<150) o.alive=false; }
    const bac = SPECIES_DB.find(s=>s.cat==='consumer1') || SPECIES_DB.find(s=>s.cat==='producer');
    const alg = SPECIES_DB.find(s=>s.cat==='producer');
    for(let i=0;i<8;i++){
      const sp = i%2?bac:alg;
      const fo=spawnOrg(sp, player.x + 12 + i*2, player.y + (i-4)*2, false);
      if(fo){ fo.size = Math.max(0.5, player.size*0.22); fo.energy=25; fo.divCD=0; fo.invuln=0; }
    }
    // run filter pull many frames
    let pulls=0;
    for(let t=0;t<45;t++){
      if(typeof filterFeedPull==='function') filterFeedPull(player, 0.04);
      if(typeof updateOrg==='function') updateOrg(player, 0.04);
      if(typeof moveOrg==='function') moveOrg(player, 0.04);
      pulls = player._filterPullN||pulls;
    }
    // findBestPrey should reject large peer ciliate
    const big = spawnOrg(player.sp, player.x+80, player.y, false);
    if(big){ big.size = player.size * 1.1; big.alive=true; }
    const prey = findBestPrey(player, 200, true);
    const preyOk = !prey || prey.size < player.size*0.7;
    return {
      eaten: player.eaten||0,
      mass: +(player.massFood||0).toFixed(2),
      energy: +player.energy.toFixed(1),
      pulls,
      preyIsTiny: preyOk,
      preyCat: prey && prey.sp ? prey.sp.cat : null,
      preySize: prey ? +prey.size.toFixed(2) : null
    };
  });
  console.log('FILTER '+JSON.stringify(feed));

  // Organelle panel at high zoom
  const edu = await page.evaluate(()=>{
    zoom=4.5; tZoom=4.5;
    if(typeof renderOrganelleEdu==='function') renderOrganelleEdu(-999,999,-999,999);
    const pan = document.getElementById('orgEduPanel');
    return {
      panel: !!pan && pan.style.display!=='none',
      html: pan ? pan.innerText.slice(0,120) : '',
      hasInfo: typeof ORGANELLE_INFO!=='undefined' && !!ORGANELLE_INFO.cilia
    };
  });
  await page.waitForTimeout(200);
  await page.screenshot({path:'screenshots/FIX-organelle-edu.png'});
  console.log('EDU '+JSON.stringify(edu));

  // producer should NOT filter-eat like predator
  const prod = await page.evaluate(()=>{
    // switch conceptual: spawn producer NPC check can eat
    const pr = SPECIES_DB.find(s=>s.cat==='producer');
    const o = spawnOrg(pr, 0, PD*0.2, false);
    const prey = findBestPrey(o, 300, false);
    return {prodPrey: prey?prey.sp.cat:null};
  });
  console.log('PROD '+JSON.stringify(prod));

  console.log('ERRORS '+errors.length);
  errors.slice(0,10).forEach(e=>console.log('ERR '+e));
  console.log('DONE');
});
