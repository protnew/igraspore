
const { test } = require('@playwright/test');
test('surface v2', async ({ page }) => {
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(600);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='producer'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(400);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  const r = await page.evaluate(()=>{
    autoAI=false; freeCam=false;
    player.x=0; player.y=100; player.vx=0; player.vy=0;
    const yHist=[];
    keys['w']=true;
    for(let i=0;i<150;i++){
      moveOrg(player, 0.04);
      updateOrg(player, 0.04);
      if(i%30===0) yHist.push(+player.y.toFixed(1));
    }
    keys['w']=false;
    return {y:+player.y.toFixed(2), yHist, ok: player.y < 12};
  });
  console.log(JSON.stringify(r));
  // predator faster than phyto (player thrust sample)
  const spd = await page.evaluate(()=>{
    function thrustSample(cat){
      for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat===cat){selSpecies=i; break;}
      // spawn temp
      const sp=SPECIES_DB.find(s=>s.cat===cat);
      const o=spawnOrg(sp, 0, 500, false);
      o.isPlayer=true; o.alive=true;
      const old=player; player=o; autoAI=false;
      o.vx=0;o.vy=0; keys['w']=true;
      moveOrg(o, 0.05); keys['w']=false;
      const v = Math.hypot(o.vx,o.vy);
      player=old; o.alive=false;
      return +v.toFixed(3);
    }
    return {phyto: thrustSample('producer'), pred: thrustSample('consumer3'), cil: thrustSample('consumer2')};
  });
  console.log('THRUST '+JSON.stringify(spd));
  console.log('DONE');
});
