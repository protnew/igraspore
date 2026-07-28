
const { test } = require('@playwright/test');
test('auto catches prey', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(800);
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  const res = await page.evaluate(async () => {
    autoAI=true; player.vx=0;player.vy=0;player.aiTarget=null;player.aiRetargetT=0;
    for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<500) o.alive=false; }
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    const prey=spawnOrg(sp, player.x+120, player.y, false);
    prey.size=player.size*0.4; prey.vx=0;prey.vy=0;prey.divCD=0;prey.invuln=0;
    const e0=player.eaten||0;
    // simulate 3s of game already running via waiting outside
    return {e0, prey:!!prey};
  });
  await page.waitForTimeout(3000);
  const end = await page.evaluate(() => {
    const p=window.__path;
    // measure last motion
    return {
      eaten:player.eaten||0,
      state:player.state,
      energy:player.energy,
      hasTarget:!!(player.aiTarget&&player.aiTarget.alive),
      distTarget: player.aiTarget? Math.hypot(player.aiTarget.x-player.x, player.aiTarget.y-player.y):null,
      autoAI
    };
  });
  console.log('AUTO3S: '+JSON.stringify({res,end,errors:errors.length}));
  await page.screenshot({path:'screenshots/FIX-auto-catch.png'});
  // E spam
  const e1=await page.evaluate(()=>player.eaten||0);
  for(let i=0;i<3;i++){
    await page.evaluate(()=>{
      const sp=SPECIES_DB[0];
      const fo=spawnOrg(sp,player.x+10,player.y,false);
      if(fo){fo.size=player.size*0.3;fo.divCD=0;fo.invuln=0;}
    });
    await page.keyboard.press('e');
    await page.waitForTimeout(100);
  }
  const e2=await page.evaluate(()=>({eaten:player.eaten||0, toast:(document.getElementById('toast')||{}).textContent}));
  console.log('ESPM: '+JSON.stringify({e1,e2}));
  console.log('ERRORS:'+errors.length);
  console.log('DONE');
});
