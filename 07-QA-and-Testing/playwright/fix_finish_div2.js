
const { test } = require('@playwright/test');
test('finish divide v2', async ({ page }) => {
  page.on('pageerror', e=>console.log('ERR: '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(700);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer1'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  await page.evaluate(()=>{
    autoAI=false;
    for(const o of orgs){ if(o!==player&&Math.hypot(o.x-player.x,o.y-player.y)<200) o.alive=false; }
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    for(let i=0;i<4;i++){const fo=spawnOrg(sp,player.x,player.y,false); if(fo){fo.size=player.size*0.3;fo.divCD=0;fo.invuln=0;}}
  });
  await page.waitForTimeout(500);
  const ate=await page.evaluate(()=>({eaten:player.eaten,mass:+(player.massFood||0).toFixed(2)}));
  console.log('ATE '+JSON.stringify(ate));
  await page.evaluate(()=>{
    player.energy=player.sp.repEnergy+80; player.age=99; player.divCD=0; player.dividing=false;
    player.size=player.sp.size*1.1; player.massFood=40; player.eatsSinceDiv=8;
    window.__ok=doDivide(player); window.__n0=orgs.filter(o=>o.alive).length;
  });
  await page.waitForTimeout(1000);
  const fin=await page.evaluate(()=>({
    ok:window.__ok, dividing:player.dividing, divT:+(player.divT||0).toFixed(2),
    size:+player.size.toFixed(2), mass:player.massFood, eats:player.eatsSinceDiv,
    cd:+(player.divCD||0).toFixed(1), can:window.canDivide(player),
    reason:window.divideBlockReason(player),
    born: orgs.filter(o=>o.alive).length - window.__n0
  }));
  console.log('FIN '+JSON.stringify(fin));
  // spam blocked after
  const spam=await page.evaluate(()=>{
    let n=0; player.energy=999; player.age=99;
    for(let i=0;i<8;i++){ player.divCD=0; if(doDivide(player)) n++; }
    return {n, reason:window.divideBlockReason(player), size:player.size, mass:player.massFood};
  });
  console.log('SPAM '+JSON.stringify(spam));
  console.log('DONE');
});
