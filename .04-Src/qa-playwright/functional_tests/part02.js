// U47: часть 2 функционального набора (тесты 31–60). Тела тестов и ожидания — дословный перенос
// из .04-Src/07-QA-and-Testing/playwright/functional_test.js (копия «до»: .10-Archive/u47-split-2026-10-17/).
const { test, expect, GAME_URL, SS, DESKTOP, MOBILE,
  waitForGame, startGame, skipTutorial, getGameState, switchToSpecies } = require('./helpers.js');

test.describe('iGraSpore V2 — Functional Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(GAME_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('#c', { state: 'visible' });
    await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
    await page.waitForTimeout(500);
  });

  // === LOAD & CANVAS ===
  test('31 Eclipse button', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('#btnEclipse');
    if (await b.isVisible({timeout:500}).catch(()=>false)) { await b.click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/31-eclipse.png` });
  });

  // === ORGANISMS ===
  test('32 Ecosystem population', async ({ page }) => {
    await skipTutorial(page);
    // Wait for ecosystem to populate
    await page.waitForTimeout(5000);
    const st = await getGameState(page);
    console.log('POP:', st.aliveCount, 'orgCount:', st.orgCount);
    // Ecosystem might still be initializing, check orgs array
    const rawCount = await page.evaluate(() => {
      if (typeof orgs === 'undefined') return 0;
      return orgs.length;
    });
    console.log('RAW orgs.length:', rawCount);
    expect(rawCount).toBeGreaterThan(0);
    await page.screenshot({ path: `${SS}/32-pop.png` });
  });

  test('33 Producer species', async ({ page }) => {
    await skipTutorial(page);
    await switchToSpecies(page, 0);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/33-producer.png` });
  });

  test('34 Consumer1 species', async ({ page }) => {
    await skipTutorial(page);
    await switchToSpecies(page, 25);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/34-c1.png` });
  });

  test('35 Consumer2 species', async ({ page }) => {
    await skipTutorial(page);
    await switchToSpecies(page, 45);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/35-c2.png` });
  });

  test('36 Consumer3 predator', async ({ page }) => {
    await skipTutorial(page);
    await switchToSpecies(page, 70);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/36-c3.png` });
  });

  test('37 Decomposer', async ({ page }) => {
    await skipTutorial(page);
    await switchToSpecies(page, 85);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/37-decomp.png` });
  });

  test('38 Organism shapes', async ({ page }) => {
    await skipTutorial(page);
    // Wait for orgs to populate
    await page.waitForFunction(() => typeof orgs !== 'undefined' && orgs.length > 5, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);
    const result = await page.evaluate(() => {
      var aliveShapes = new Set(), allShapes = new Set();
      if (typeof orgs !== 'undefined') {
        orgs.forEach(o => {
          if (o.sp && o.sp.shape) {
            allShapes.add(o.sp.shape);
            if (o.alive) aliveShapes.add(o.sp.shape);
          }
        });
      }
      // Also check SPECIES_DB for shape data
      var dbShapes = new Set();
      if (typeof SPECIES_DB !== 'undefined') {
        SPECIES_DB.forEach(sp => { if (sp.shape) dbShapes.add(sp.shape); });
      }
      return {
        aliveShapes: Array.from(aliveShapes),
        allShapes: Array.from(allShapes),
        dbShapes: Array.from(dbShapes),
        orgCount: typeof orgs !== 'undefined' ? orgs.length : 0
      };
    });
    console.log('SHAPES:', JSON.stringify(result));
    // SPECIES_DB should always have shapes
    expect(result.dbShapes.length).toBeGreaterThan(2);
    await page.screenshot({ path: `${SS}/38-shapes.png` });
  });

  test('39 Bioluminescence night', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof tod!=='undefined') tod=0; });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/39-biolum.png` });
  });

  // === MENUS ===
  test('40 Wiki panel', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('#bWiki, #pWiki');
    if (await b.first().isVisible({timeout:500}).catch(()=>false)) { await b.first().click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/40-wiki.png` });
  });

  test('41 Settings panel', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('#pSet, #setBtn2');
    if (await b.first().isVisible({timeout:500}).catch(()=>false)) { await b.first().click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/41-settings.png` });
  });

  test('42 Menu overlay', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('#menuBtn');
    if (await b.isVisible({timeout:500}).catch(()=>false)) { await b.click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/42-menu.png` });
  });

  test('43 DNA panel', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('.dna-btn, #bAuto');
    if (await b.first().isVisible({timeout:500}).catch(()=>false)) { await b.first().click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/43-dna.png` });
  });

  test('44 Leaderboard', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('#btnLeaderboard');
    if (await b.isVisible({timeout:500}).catch(()=>false)) { await b.click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/44-lb.png` });
  });

  test('45 Sandbox mode', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('#bSandbox');
    if (await b.isVisible({timeout:500}).catch(()=>false)) { await b.click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/45-sandbox.png` });
  });

  test('46 Screensaver', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('#screensaverBtn');
    if (await b.isVisible({timeout:500}).catch(()=>false)) { await b.click(); await page.waitForTimeout(1000); }
    await page.screenshot({ path: `${SS}/46-screensaver.png` });
  });

  // === PERFORMANCE ===
  test('47 FPS measurement', async ({ page }) => {
    await skipTutorial(page);
    await page.waitForTimeout(1000);
    const r = await page.evaluate(() => new Promise(res => {
      var f=0,s=performance.now();
      function chk(){f++;if(performance.now()-s>=3000)res({fps:Math.round(f/3),frames:f});else requestAnimationFrame(chk);}
      chk();
    }));
    console.log('FPS:',JSON.stringify(r));
    expect(r.fps).toBeGreaterThan(15);
    await page.screenshot({ path: `${SS}/47-fps.png` });
  });

  test('48 500-frame stability', async ({ page }) => {
    await skipTutorial(page);
    await page.waitForTimeout(1000);
    const r = await page.evaluate(() => new Promise(res => {
      var sf=fc,sp=orgs.filter(o=>o.alive).length,errs=[];
      function chk(){
        if(fc-sf>=500){res({frames:fc-sf,sp,ep:orgs.filter(o=>o.alive).length,errs});}
        else{if(orgs.filter(o=>o.alive).length===0)errs.push('ZERO@'+fc);requestAnimationFrame(chk);}
      }
      chk();
    }));
    console.log('STAB:',JSON.stringify(r));
    expect(r.frames).toBeGreaterThanOrEqual(490);
    await page.screenshot({ path: `${SS}/48-stab.png` });
  });

  test('49 Mobile viewport', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/49-mobile.png` });
  });

  test('50 Touch joystick', async ({ browser }) => {
    const context = await browser.newContext({ viewport: MOBILE, hasTouch: true });
    const page = await context.newPage();
    await page.goto(GAME_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('#c', { state: 'visible' });
    await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
    await page.waitForTimeout(500);
    await startGame(page);
    await page.waitForTimeout(500);
    await page.touchscreen.tap(187, 600);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/50-touch.png` });
    await context.close();
  });

  // === VISUAL BUG DETECTION ===
  test('51 Sun at sunset', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof tod!=='undefined') tod=18; });
    await page.waitForTimeout(500);
    const si = await page.evaluate(() => {
      var dp=(tod-6)/12,sy=-Math.sin(dp*Math.PI)*400+50;
      return {sy,aboveWater:sy<0};
    });
    console.log('SUNSET SUN:',JSON.stringify(si));
    await page.screenshot({ path: `${SS}/51-sunset.png` });
  });

  test('52 Sun at sunrise', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof tod!=='undefined') tod=6; });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/52-sunrise.png` });
  });

  test('53 Shadows ON', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof settings!=='undefined') settings.shadows=true; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SS}/53-sh-on.png` });
  });

  test('54 Shadows OFF', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof settings!=='undefined') settings.shadows=false; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SS}/54-sh-off.png` });
  });

  test('55 High zoom detail', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof zoom!=='undefined') zoom=8; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SS}/55-hizoom.png` });
  });

  test('56 Death screen', async ({ page }) => {
    await skipTutorial(page);
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      if(typeof player!=='undefined'&&player){
        player.energy=0;
        player.alive=false;
        player.dying=true;
        player.deathT=0;
        player.deathCause='energy';
        player._remove=true;
      }
    });
    await page.waitForTimeout(2000);
    const deathState = await page.evaluate(() => typeof state!=='undefined'?state:'unknown');
    console.log('DEATH STATE:', deathState);
    await page.screenshot({ path: `${SS}/56-death.png` });
  });

  test('57 Help overlay', async ({ page }) => {
    const b = page.locator('#helpBtn, #pHelp');
    if (await b.first().isVisible({timeout:500}).catch(()=>false)) { await b.first().click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/57-help.png` });
  });

  test('58 Full desktop screenshot', async ({ page }) => {
    await skipTutorial(page);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SS}/58-full.png` });
  });

  test('59 100x speed stress', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof speedMul!=='undefined') speedMul=100; });
    await page.waitForTimeout(2000);
    const st = await getGameState(page);
    console.log('100X:',JSON.stringify(st));
    await page.screenshot({ path: `${SS}/59-100x.png` });
  });

  test('60 Console errors after 10s', async ({ page }) => {
    await skipTutorial(page);
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errs.push(msg.text()); });
    await page.waitForTimeout(10000);
    console.log('ERRORS:',errs);
    await page.screenshot({ path: `${SS}/60-errors.png` });
  });
});
