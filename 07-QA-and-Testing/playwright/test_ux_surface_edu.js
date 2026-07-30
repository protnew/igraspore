
const { test } = require('@playwright/test');
test('start surface + no sponge + edu hover', async ({ page }) => {
  page.on('pageerror', e=>console.log('PE '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(400);
  // pick bacteria
  await page.evaluate(()=>{
    for(let i=0;i<SPECIES_DB.length;i++) if(SPECIES_DB[i].cat==='consumer1'){selSpecies=i;break;}
  });
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(350);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });
  const info = await page.evaluate(()=>{
    const names = orgs.filter(o=>o&&o.alive).map(o=>o.sp&&o.sp.name).filter(Boolean);
    const sponge = names.filter(n=>/Sponge|Макроф|Macro/i.test(n)).length;
    const big = orgs.filter(o=>o&&o.alive&&o.size>=12).map(o=>({n:o.sp.name,s:+o.size.toFixed(1)}));
    const edu = document.getElementById('orgEduPanel');
    // move mouse outside cell
    return {
      playerY: +player.y.toFixed(1),
      nearSurface: player.y < 70,
      sponge,
      big: big.slice(0,8),
      hasSpongeInDB: SPECIES_DB.some(s=>s.id===1000),
      hasMacroInDB: SPECIES_DB.some(s=>s.id===999),
      eduDisplay: edu ? edu.style.display : 'none',
      snellStr: (renderSnellWindow||function(){}).toString().slice(0,80)
    };
  });
  // zoom in and check edu only inside
  await page.evaluate(()=>{ freeCam=false; zoom=4; tZoom=4; cam.x=player.x; cam.y=player.y; });
  await page.mouse.move(5,5); // corner - outside
  await page.waitForTimeout(200);
  const out = await page.evaluate(()=>{
    const edu=document.getElementById('orgEduPanel');
    return edu?edu.style.display:'none';
  });
  // center of canvas ~ player
  const box = await page.evaluate(()=>{
    const c=document.querySelector('canvas');
    return {w:c.clientWidth,h:c.clientHeight};
  });
  await page.mouse.move(box.w/2, box.h/2);
  await page.waitForTimeout(250);
  const inn = await page.evaluate(()=>{
    // force one render tick state: call renderOrganelleEdu if needed - game loop should run
    const edu=document.getElementById('orgEduPanel');
    return {disp: edu?edu.style.display:'none', html: edu?edu.innerText.slice(0,80):''};
  });
  console.log('INFO '+JSON.stringify(info));
  console.log('EDU_OUT '+out+' EDU_IN '+JSON.stringify(inn));
  await page.screenshot({path:'screenshots/UX-start-surface.png'});
  console.log('DONE');
});
