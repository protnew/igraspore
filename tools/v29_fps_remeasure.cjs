const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://127.0.0.1:8820/?lang=en&t='+Date.now(), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#startBtn');
  await page.waitForTimeout(1000);
  await page.evaluate("document.getElementById('startBtn').click()");
  await page.waitForFunction('!!(window.player&&player.alive)', null, { timeout: 60000 });
  await page.evaluate(`(function(){try{closeIntroCard&&closeIntroCard()}catch(e){}
    var rc=document.getElementById('roleCardOk'); if(rc)rc.click();
    var skip=document.getElementById('tutSkip'); if(skip)skip.click();
    var res=document.getElementById('resBtn'); if(res)res.click();
    if(state==='paused') state='playing';})()`);
  const themes = ['classic','neon-bio','phase-contrast'];
  const fps = {};
  for (const th of themes) {
    await page.evaluate(`(function(th){localStorage.setItem('igs.theme.pond',th); if(window.igsThemeEngine) window.igsThemeEngine.applyThemePond(th);})(${JSON.stringify(th)})`);
    await page.waitForTimeout(400);
    fps[th] = await page.evaluate(`(function(){
      return new Promise(function(res){
        var dts=[], last=performance.now(), t0=last;
        function fr(now){ dts.push(now-last); last=now;
          if(now-t0<30000) requestAnimationFrame(fr);
          else {
            var fpsArr=dts.map(function(d){return 1000/Math.max(d,0.001);}).sort(function(a,b){return a-b;});
            var med=fpsArr[Math.floor(fpsArr.length/2)];
            var p5=fpsArr[Math.max(0,Math.floor(fpsArr.length*0.05))];
            res({n:fpsArr.length, med:+med.toFixed(1), p5:+p5.toFixed(1)});
          }
        }
        requestAnimationFrame(fr);
      });
    })()`);
    console.log(th, JSON.stringify(fps[th]));
  }
  const repPath = '09-Docs/out-dev-factory/theme-shots-v29/matrix-report.json';
  const rep = JSON.parse(fs.readFileSync(repPath,'utf8'));
  rep.fps = fps;
  rep.fpsNote = '30s pond, fps sorted ascending; med and p5';
  fs.writeFileSync(repPath, JSON.stringify(rep,null,2));
  await browser.close();
})().catch(e=>{console.error(e); process.exit(1);});
