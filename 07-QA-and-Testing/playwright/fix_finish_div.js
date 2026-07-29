
const { test } = require('@playwright/test');
test('finish divide', async ({ page }) => {
  page.on('pageerror', e=>console.log('ERR: '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(700);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer1'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  // contact eat
  await page.evaluate(()=>{
    autoAI=false; player.eaten=0; player.massFood=0; player.eatsSinceDiv=0;
    for(const o of orgs){ if(o!==player&&Math.hypot(o.x-player.x,o.y-player.y)<200) o.alive=false; }
    const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
    for(let i=0;i<4;i++){const fo=spawnOrg(sp,player.x,player.y,false); if(fo){fo.size=player.size*0.3;fo.divCD=0;fo.invuln=0;}}
  });
  await page.waitForTimeout(600);
  const ate=await page.evaluate(()=>({eaten:player.eaten,mass:player.massFood}));
  console.log('ATE '+JSON.stringify(ate));
  await page.evaluate(()=>{
    player.energy=player.sp.repEnergy+80; player.age=99; player.divCD=0;
    player.size=player.sp.size*1.1; player.massFood=40; player.eatsSinceDiv=8;
    const ok=doDivide(player);
    window.__ok=ok; window.__orgCount=orgs.length;
  });
  await page.waitForTimeout(1200);
  const fin=await page.evaluate(()=>({
    ok:window.__ok,
    dividing:player.dividing, divT:player.divT, size:player.size,
    mass:player.massFood, eats:player.eatsSinceDiv, cd:player.divCD,
    can:window.canDivide(player), reason:window.divideBlockReason(player),
    orgsDelta: orgs.length-window.__orgCount
  }));
  console.log('FIN '+JSON.stringify(fin));
  console.log('DONE');
});
