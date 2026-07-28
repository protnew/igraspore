
const { test } = require('@playwright/test');
test('eat + autopilot purposeful movement', async ({ page }) => {
  const errors=[];
  page.on('pageerror', e => errors.push(String(e.message||e)));
  page.setDefaultTimeout(35000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(() => { try{ localStorage.setItem('igraspore_tut_v2','1'); }catch(e){} });
  await page.reload({waitUntil:'load'});
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(700);
  // skip tut if shown
  await page.evaluate(() => { if(window.skipTutorial) window.skipTutorial(); });
  await page.waitForTimeout(300);

  const start = await page.evaluate(() => {
    // ensure food nearby
    const foodCats = (typeof FOOD!=='undefined' && FOOD[player.sp.cat]) ? FOOD[player.sp.cat] : ['producer','consumer1'];
    let n=0;
    for(let i=0;i<SPECIES_DB.length && n<10;i++){
      const sp=SPECIES_DB[i];
      if(sp.size>player.size*0.7) continue;
      const ang=Math.random()*Math.PI*2, rr=25+Math.random()*40;
      const fo=spawnOrg(sp, player.x+Math.cos(ang)*rr, player.y+Math.sin(ang)*rr*0.5, false);
      if(fo){ fo.size=Math.min(fo.size, player.size*0.6); fo.energy=50; fo.divCD=0; fo.invuln=0; n++; }
    }
    return {cat:player.sp.cat, size:player.size, energy:player.energy, eaten:player.eaten||0, near:n};
  });
  console.log('START: '+JSON.stringify(start));

  // 1) Keyboard E
  const beforeE = await page.evaluate(() => ({eaten:player.eaten||0, energy:player.energy}));
  await page.keyboard.press('e');
  await page.waitForTimeout(200);
  const afterE = await page.evaluate(() => ({
    eaten:player.eaten||0, energy:player.energy,
    toast:(document.getElementById('toast')||{}).textContent||'',
    flash:player.flash||0
  }));
  console.log('KEY_E: '+JSON.stringify({beforeE, afterE, ok: afterE.eaten>beforeE.eaten || afterE.energy>beforeE.energy+1}));
  await page.screenshot({path:'screenshots/FIX-eat-E.png'});

  // 2) Button click ЕСТЬ
  await page.evaluate(() => {
    // spawn more food right on player
    for(let i=0;i<5;i++){
      const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
      const fo=spawnOrg(sp, player.x+(i-2)*8, player.y+(i%2)*6, false);
      if(fo){ fo.size=player.size*0.4; fo.divCD=0; fo.invuln=0; }
    }
  });
  const beforeB = await page.evaluate(() => ({eaten:player.eaten||0, energy:player.energy}));
  const box = await page.evaluate(() => {
    const b=document.getElementById('bEat');
    const r=b.getBoundingClientRect();
    return {x:r.x+r.w/2||r.x+r.width/2, y:r.y+r.h/2||r.y+r.height/2, w:r.width, h:r.height, text:b.innerText};
  });
  console.log('BTN: '+JSON.stringify(box));
  await page.mouse.click(box.x, box.y);
  await page.waitForTimeout(200);
  const afterB = await page.evaluate(() => ({eaten:player.eaten||0, energy:player.energy, toast:(document.getElementById('toast')||{}).textContent||''}));
  console.log('BTN_E: '+JSON.stringify({beforeB, afterB, ok: afterB.eaten>beforeB.eaten}));

  // 3) tryPlayerEat direct
  const direct = await page.evaluate(() => {
    const b={eaten:player.eaten||0};
    const r=window.tryPlayerEat();
    return {r, before:b.eaten, after:player.eaten||0, energy:player.energy};
  });
  console.log('DIRECT: '+JSON.stringify(direct));

  // 4) Autopilot movement quality — track path curvature
  await page.evaluate(() => {
    autoAI = true;
    // clear and place a single prey far to the RIGHT of player
    // remove nearby noise
    for(const o of orgs){ if(o!==player && o.alive){ const d=Math.hypot(o.x-player.x,o.y-player.y); if(d<400) o.alive=false; } }
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    const prey=spawnOrg(sp, player.x+180, player.y, false);
    if(prey){ prey.size=player.size*0.45; prey.vx=0; prey.vy=0; prey.divCD=0; prey.invuln=0; }
    player.vx=0; player.vy=0; player.aiTarget=null; player.aiRetargetT=0;
    window.__preyId = prey;
    window.__path = [];
  });
  await page.evaluate(() => {
    const btn=document.getElementById('bAuto');
    if(btn) btn.classList.add('on');
  });

  // sample path for 2 seconds
  for(let i=0;i<20;i++){
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      window.__path.push({x:player.x, y:player.y, t:gt, state:player.state, ang:player.angle});
    });
  }
  const pathStats = await page.evaluate(() => {
    const p=window.__path||[];
    if(p.length<3) return {n:p.length};
    let totalTurn=0, dist=0;
    for(let i=1;i<p.length;i++){
      const dx=p[i].x-p[i-1].x, dy=p[i].y-p[i-1].y;
      dist += Math.hypot(dx,dy);
      if(i>=2){
        const dx0=p[i-1].x-p[i-2].x, dy0=p[i-1].y-p[i-2].y;
        const a1=Math.atan2(dy0,dx0), a2=Math.atan2(dy,dx);
        let da=a2-a1; while(da>Math.PI)da-=Math.PI*2; while(da<-Math.PI)da+=Math.PI*2;
        totalTurn += Math.abs(da);
      }
    }
    const dx=p[p.length-1].x-p[0].x, dy=p[p.length-1].y-p[0].y;
    const net=Math.hypot(dx,dy);
    const efficiency = dist>1 ? net/dist : 0; // 1=straight, ~0=circling
    // NPC sample: average turn of nearby AI orgs
    let npcTurn=0, npcN=0;
    for(const o of orgs){
      if(!o.alive||o.isPlayer) continue;
      if(Math.hypot(o.x-player.x,o.y-player.y)>500) continue;
      if(o._prevAng!==undefined){
        let da=o.angle-o._prevAng; while(da>Math.PI)da-=Math.PI*2; while(da<-Math.PI)da+=Math.PI*2;
        npcTurn+=Math.abs(da); npcN++;
      }
      o._prevAng=o.angle;
    }
    return {
      samples:p.length,
      pathDist:Number(dist.toFixed(1)),
      netDisp:Number(net.toFixed(1)),
      efficiency:Number(efficiency.toFixed(3)),
      totalTurn:Number(totalTurn.toFixed(2)),
      endState:p[p.length-1].state,
      autoAI:autoAI,
      eaten:player.eaten||0,
      preyAlive: window.__preyId ? window.__preyId.alive : null
    };
  });
  console.log('PATH: '+JSON.stringify(pathStats));
  await page.screenshot({path:'screenshots/FIX-autopilot.png'});

  // 5) Realistic mode + autopilot still ok
  await page.evaluate(() => {
    settings.renderMode='realistic';
    if(typeof applyRenderMode==='function') applyRenderMode();
    zoom=4; tZoom=4;
    if(typeof render==='function') render();
  });
  await page.waitForTimeout(400);
  await page.screenshot({path:'screenshots/FIX-realistic-auto.png'});
  const realBright = await page.evaluate(() => {
    const d=cv.getContext('2d').getImageData(cv.width/2-100,cv.height/2-100,200,200).data;
    let s=0,nb=0; for(let i=0;i<d.length;i+=4){const v=d[i]+d[i+1]+d[i+2]; s+=v; if(v>30)nb++;}
    return {avg:Math.round(s/(200*200*3)), nonBlack:nb, mode:settings.renderMode};
  });
  console.log('REAL: '+JSON.stringify(realBright));

  console.log('ERRORS: '+errors.length);
  errors.slice(0,10).forEach(e=>console.log('ERR: '+String(e).substring(0,200)));
  console.log('DONE');
});
