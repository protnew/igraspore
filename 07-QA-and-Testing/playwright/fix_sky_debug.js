
const { test } = require('@playwright/test');
test('debug sky', async ({ page }) => {
  page.on('pageerror', e=>console.log('PE '+e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(500);
  await page.evaluate(()=>{ selSpecies=0; document.getElementById('startBtn').click(); });
  await page.waitForTimeout(300);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  const d = await page.evaluate(()=>{
    freeCam=true; autoAI=false;
    cam.x=0; cam.y=-40; zoom=1; tZoom=1;
    tod=11; dayLight=0.9;
    // manual call render once if available
    const has = {
      renderSky: typeof renderSky,
      renderWater: typeof renderWater,
      render: typeof render,
      drawFrame: typeof drawFrame,
      loop: typeof loop
    };
    // compute vT like render.js
    const vw=cv.width/zoom, vh=cv.height/zoom;
    const vL=cam.x-vw/2,vR=cam.x+vw/2,vT=cam.y-vh/2,vB=cam.y+vh/2;
    // force one render
    if(typeof render==='function') render();
    else if(typeof drawFrame==='function') drawFrame();
    return {
      has,
      cam:{x:cam.x,y:cam.y,z:zoom},
      view:{vT,vB,vh,cw:cv.width,ch:cv.height},
      sun: window._sunPos,
      tod, dayLight
    };
  });
  console.log(JSON.stringify(d,null,2));
  await page.waitForTimeout(200);
  await page.screenshot({path:'screenshots/NAT4-debug.png'});
  // sample after wait for RAF
  await page.waitForTimeout(500);
  const d2 = await page.evaluate(()=>{
    freeCam=true; cam.y=-40; cam.x=0; zoom=1; tod=11; dayLight=0.9;
    return {sun:window._sunPos, camy:cam.y, tod, dl:dayLight};
  });
  console.log('AFTER '+JSON.stringify(d2));
  await page.screenshot({path:'screenshots/NAT4-debug2.png'});
});
