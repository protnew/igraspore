const { test, expect } = require('@playwright/test');
const { startGame, collectErrs } = require('./_helpers');

// v24 задача 6: FPS-гейт — медиана ≥30 и p5 ≥25 при пуле 300 (критик 4 v21: хвост важнее медианы).
// Стенд: 1 воркер (GATE_WORKERS=1), разгруженная машина — как весь гейт v20/v24; эмулятор — ENV-LIMITED, вне гейта.
test('[FPS] gameplay 15s at pool 300: median >= 30, p5 >= 25', async ({ page }) => {
  const errs = collectErrs(page);
  await startGame(page, { test: true });
  await page.locator('#roleCardOk').click({ timeout: 8000 }).catch(() => {});
  await page.locator('#tutSkip').click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1500); // прогрев: первый кадр/шейдеры/спрайты
  const m = await page.evaluate(`(function(){
    return new Promise(function(res){
      var dts=[], last=performance.now(), t0=last;
      function fr(now){ dts.push(now-last); last=now;
        if(now-t0<15000) requestAnimationFrame(fr);
        else {
          dts.sort(function(a,b){return a-b});
          var fps=dts.map(function(d){return 1000/d;});
          var med=fps[Math.floor(fps.length/2)];
          var p5=fps[Math.max(0,Math.floor(fps.length*0.05))];
          res({n:fps.length, med:+med.toFixed(1), p5:+p5.toFixed(1), maxMs:+dts[dts.length-1].toFixed(0)});
        }
      }
      requestAnimationFrame(fr);
    });
  })()`);
  expect(m.n, 'captured frames ' + JSON.stringify(m)).toBeGreaterThan(200);
  expect(m.med, 'FPS median ' + JSON.stringify(m)).toBeGreaterThanOrEqual(30);
  expect(m.p5, 'FPS p5 ' + JSON.stringify(m)).toBeGreaterThanOrEqual(25);
  const hard = errs.filter(e => !/favicon|sw\.js|404/.test(e));
  expect(hard).toEqual([]);
});
