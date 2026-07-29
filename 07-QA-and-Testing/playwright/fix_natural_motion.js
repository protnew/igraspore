
const { test } = require('@playwright/test');
test('predator auto eat + no spin', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(String(e.message||e)));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(900);

  // Pick a consumer1 / predator species if available
  const pick = await page.evaluate(() => {
    let idx = 0;
    for(let i=0;i<SPECIES_DB.length;i++){
      if(SPECIES_DB[i].cat==='consumer1' || SPECIES_DB[i].cat==='consumer2'){ idx=i; break; }
    }
    // try click species card
    selSpecies = idx;
    return {idx, name:SPECIES_DB[idx].name, cat:SPECIES_DB[idx].cat, size:SPECIES_DB[idx].size, speed:SPECIES_DB[idx].speed, food:(FOOD[SPECIES_DB[idx].cat]||[])};
  });
  console.log('SPECIES: '+JSON.stringify(pick));

  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(600);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  await page.waitForTimeout(200);

  const start = await page.evaluate(() => {
    autoAI = true;
    player.energy = 70;
    player.alive = true; player.dying=false; player.cyst=false; player.parasite=null;
    player.eaten = 0; player.aiTarget=null; player.aiRetargetT=0;
    player.facing = 0; player.angle = 0; player.vx=0; player.vy=0;
    // clear and spawn edible producers nearby
    for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<700) o.alive=false; }
    let n=0;
    const producers = SPECIES_DB.filter(s=>s.cat==='producer');
    for(let i=0;i<10;i++){
      const sp=producers[i%producers.length]||SPECIES_DB[0];
      const fo=spawnOrg(sp, player.x+40+i*12, player.y+(i%3-1)*10, false);
      if(fo){ fo.size=Math.min(fo.size, player.size*0.5); fo.divCD=0; fo.invuln=0; fo.vx=0; fo.vy=0; n++; }
    }
    return {cat:player.sp.cat, size:player.size, foodN:n, energy:player.energy};
  });
  console.log('START: '+JSON.stringify(start));

  // Sample facing over time — spin detector
  await page.evaluate(()=>{ window.__fac=[]; window.__e0=player.eaten||0; });
  for(let i=0;i<30;i++){
    await page.waitForTimeout(80);
    await page.evaluate(()=>{
      window.__fac.push({
        f: player.facing||player.angle||0,
        x:player.x,y:player.y,
        st:player.state,
        t:player.aiTarget?1:0
      });
      // also sample NPC spin
      if(!window.__npc) window.__npc=[];
      let c=0;
      for(const o of orgs){
        if(!o.alive||o.isPlayer) continue;
        if(Math.hypot(o.x-player.x,o.y-player.y)>400) continue;
        if(c>=5) break;
        window.__npc.push(o.facing||o.angle||0);
        c++;
      }
    });
  }

  const stats = await page.evaluate(() => {
    const f=window.__fac;
    let turn=0, dist=0;
    for(let i=1;i<f.length;i++){
      let da=f[i].f-f[i-1].f;
      while(da>Math.PI) da-=Math.PI*2;
      while(da<-Math.PI) da+=Math.PI*2;
      turn += Math.abs(da);
      dist += Math.hypot(f[i].x-f[i-1].x, f[i].y-f[i-1].y);
    }
    const net=Math.hypot(f.at(-1).x-f[0].x, f.at(-1).y-f[0].y);
    // full rotations estimate
    const spins = turn / (Math.PI*2);
    // NPC angle deltas
    let npcTurn=0, npcN=0;
    const npc=window.__npc||[];
    // group every 5
    for(let i=5;i<npc.length;i++){
      let da=npc[i]-npc[i-5];
      while(da>Math.PI) da-=Math.PI*2;
      while(da<-Math.PI) da+=Math.PI*2;
      npcTurn += Math.abs(da); npcN++;
    }
    return {
      eaten: (player.eaten||0)-(window.__e0||0),
      totalEaten: player.eaten||0,
      energy: player.energy,
      state: player.state,
      hasTarget: !!(player.aiTarget&&player.aiTarget.alive),
      pathEff: dist>1 ? Number((net/dist).toFixed(3)) : 0,
      playerSpins: Number(spins.toFixed(2)),
      playerTurnRad: Number(turn.toFixed(2)),
      net: Number(net.toFixed(1)),
      dist: Number(dist.toFixed(1)),
      avgNpcTurn: npcN? Number((npcTurn/npcN).toFixed(3)) : null,
      autoAI
    };
  });
  console.log('STATS: '+JSON.stringify(stats));

  // Manual E still works
  await page.evaluate(()=>{
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    const fo=spawnOrg(sp, player.x+8, player.y, false);
    if(fo){ fo.size=player.size*0.3; fo.divCD=0; fo.invuln=0; }
  });
  await page.keyboard.press('e');
  await page.waitForTimeout(120);
  const ekey = await page.evaluate(()=>({eaten:player.eaten, toast:(document.getElementById('toast')||{}).textContent}));
  console.log('EKEY: '+JSON.stringify(ekey));

  await page.screenshot({path:'screenshots/NAT-auto-predator.png'});
  await page.evaluate(()=>{ settings.renderMode='realistic'; zoom=4; tZoom=4; if(typeof render==='function') render(); });
  await page.waitForTimeout(300);
  // sample realistic facing stability frames
  await page.evaluate(()=>{ window.__rf=[]; });
  for(let i=0;i<10;i++){
    await page.waitForTimeout(50);
    await page.evaluate(()=>{
      let s=0,n=0;
      for(const o of orgs){
        if(!o.alive) continue;
        if(Math.hypot(o.x-cam.x,o.y-cam.y)>300) continue;
        s += (o.facing||o.angle||0); n++;
      }
      window.__rf.push(n?s/n:0);
    });
  }
  const spinR = await page.evaluate(()=>{
    const a=window.__rf; let t=0;
    for(let i=1;i<a.length;i++){ let d=a[i]-a[i-1]; while(d>Math.PI)d-=Math.PI*2; while(d<-Math.PI)d+=Math.PI*2; t+=Math.abs(d); }
    return {meanTurn:Number(t.toFixed(3)), frames:a.length};
  });
  console.log('REAL_SPIN: '+JSON.stringify(spinR));
  await page.screenshot({path:'screenshots/NAT-realistic-nosspin.png'});

  console.log('ERRORS: '+errors.length);
  errors.slice(0,8).forEach(e=>console.log('ERR: '+e));
  console.log('DONE');
});
