const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto('http://127.0.0.1:8798/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForTimeout(2000);
  await p.evaluate('(function(){ var i=SPECIES_DB.findIndex(function(s){return (s.locomotion==="flagella"||s.locomotion==="cilia")&&s.shape==="circle";}); if(i>=0) window.selSpecies=i; })()');
    await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction('state==="playing" || document.getElementById("introO").className==="ov show"', null, { timeout: 10000 });
  await p.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  await p.waitForFunction('state==="playing"', null, { timeout: 5000 });
  await p.evaluate('window.skipTutorial && window.skipTutorial()');
  await p.evaluate('(function(){ zoom=14; tZoom=14; timeScale=1; window.focusTimer=0; window.cinematicTime=1; })()');
  const out = await p.evaluate(`(function(){
    return new Promise(function(res){
      if(player){ player.x+=6000; player.y=Math.max(60,player.y); cam.x=player.x; cam.y=player.y; }
      var sp0=player.sp.speed||3;
      var keep=setInterval(function(){ if(player){ player.vx=sp0*1.5; player.vy=sp0*0.5; } },4);
      window.__mpc=0; var omp=window.membranePath;
      window.membranePath=function(a,sz2,dt2){ window.__mpc++; if(a===player) window.__mpPlayer=(window.__mpPlayer||0)+1; return omp.apply(this,arguments); };
      var warm=0;
      function step(){
        if(!player||warm>=70){ clearInterval(keep); res(JSON.stringify({mpc:window.__mpc,mpPlayer:window.__mpPlayer||0,warm:warm, vS:+(player&&player._membVS||0).toFixed(3), spd:+(player?Math.hypot(player.vx,player.vy):0).toFixed(2), spSpeed:sp0, ang:+(player&&player._membAng||0).toFixed(2), state:state})); return; }
        warm++; requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  })()`);
  console.log(out);
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
