
const { test } = require('@playwright/test');
test('swallow scale', async ({ page }) => {
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(700);
  await page.evaluate(()=>{ for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer1'){selSpecies=i;break;} });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(400);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  const r = await page.evaluate(() => {
    autoAI=false;
    function meal(sz,en){
      player.energy=40; player.massFood=0; player.stomach=[];
      player.size = Math.max(player.sp.size, sz*1.1); // can swallow
      for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<250) o.alive=false; }
      const sp=SPECIES_DB.find(s=>s.cat==='producer')||SPECIES_DB[0];
      const fo=spawnOrg(sp,player.x,player.y,false);
      fo.size=sz; fo.energy=en; fo.divCD=0; fo.invuln=0;
      const e0=player.energy,m0=player.massFood;
      eatOrg(player,fo);
      return {dEn:+(player.energy-e0).toFixed(2), dMass:+(player.massFood-m0).toFixed(3)};
    }
    const s=meal(0.8,15), m=meal(2.0,40), l=meal(3.5,80);
    return {s,m,l, ok: l.dEn>m.dEn && m.dEn>s.dEn && l.dMass>m.dMass && m.dMass>s.dMass,
      gate: (()=>{ player.eatsSinceDiv=1; player.energy=999; player.age=99; player.divCD=0; player.dividing=false; player.size=player.sp.size*1.1; player.massFood=40; return canDivide(player); })()
    };
  });
  console.log(JSON.stringify(r));
  console.log('DONE');
});
