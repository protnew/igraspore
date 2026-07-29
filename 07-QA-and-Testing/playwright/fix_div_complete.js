
const { test } = require('@playwright/test');
test('div complete + autoeat', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(800);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer1'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // autoeat no E
  const eat = await page.evaluate(async () => {
    autoAI=false; player.eaten=0; player.massFood=0; player.eatsSinceDiv=0;
    for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<250) o.alive=false; }
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    for(let i=0;i<4;i++){ const fo=spawnOrg(sp,player.x+i*2,player.y,false); if(fo){fo.size=player.size*0.3;fo.divCD=0;fo.invuln=0;} }
    return true;
  });
  await page.waitForTimeout(700);
  const ate = await page.evaluate(()=>({eaten:player.eaten, mass:+(player.massFood||0).toFixed(2), size:+player.size.toFixed(2)}));
  console.log('ATE: '+JSON.stringify(ate));

  // force ready divide and wait finish
  await page.evaluate(()=>{
    player.energy=player.sp.repEnergy+80; player.age=99; player.divCD=0; player.dividing=false;
    player.size=player.sp.size*1.1; player.massFood=30; player.eatsSinceDiv=6;
    doDivide(player);
  });
  await page.waitForTimeout(1200);
  const fin = await page.evaluate(()=>({
    dividing:player.dividing, size:+player.size.toFixed(2), mass:player.massFood, eats:player.eatsSinceDiv,
    cd:+(player.divCD||0).toFixed(1), can:window.canDivide(player), reason:window.divideBlockReason(player)
  }));
  console.log('FIN: '+JSON.stringify(fin));
  // try immediate redivide
  const again = await page.evaluate(()=>{ player.energy=999; player.divCD=0; return {ok:!!doDivide(player), reason:window.divideBlockReason(player)}; });
  console.log('AGAIN: '+JSON.stringify(again));
  console.log('ERRORS:'+errors.length);
  console.log('DONE');
});
