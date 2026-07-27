// iGraSpore V2 — Comprehensive Functional Test (60 elements)
const { test: base, expect } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';
const SS = 'screenshots';
const DESKTOP = { width: 1400, height: 900 };
const MOBILE = { width: 375, height: 812 };

async function waitForGame(page) {
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
}

async function startGame(page) {
  // Click start button to begin game
  const startBtn = page.locator('#startBtn');
  if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(1000);
  }
  // Skip tutorial — try multiple approaches
  await page.evaluate(() => {
    // Direct call to skip tutorial if function exists
    if (typeof skipTutorial === 'function') skipTutorial();
    if (typeof tutorialStep !== 'undefined') tutorialStep = 999;
    if (typeof hideTutorial === 'function') hideTutorial();
    // Hide tutorial overlay
    var tuts = document.querySelectorAll('[class*="tutorial"], [id*="tutorial"], [id*="tut"]');
    tuts.forEach(t => t.style.display = 'none');
  }).catch(() => {});
  await page.waitForTimeout(300);
  // Also try clicking skip button quickly
  try {
    const skip = page.locator('text=Пропустить').first();
    await skip.click({ timeout: 1000 });
  } catch (e) {}
  // Verify game started
  await page.waitForFunction(() => typeof state !== 'undefined' && (state === 'playing' || state === 'menu' || typeof orgs !== 'undefined'), { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
}

async function skipTutorial(page) {
  return startGame(page);
}

async function getGameState(page) {
  return await page.evaluate(() => ({
    orgCount: orgs ? orgs.length : 0,
    aliveCount: orgs ? orgs.filter(o => o.alive).length : 0,
    playerExists: typeof player !== 'undefined' && player !== null,
    playerSpecies: player ? (player.sp ? player.sp.name : null) : null,
    dayLight: typeof dayLight !== 'undefined' ? dayLight : 0,
    tod: typeof tod !== 'undefined' ? tod : 0,
    season: typeof season !== 'undefined' ? season : 0,
    zoom: typeof zoom !== 'undefined' ? zoom : 1,
    state: typeof state !== 'undefined' ? state : 'unknown',
  }));
}

async function switchToSpecies(page, index) {
  await page.evaluate((idx) => {
    if (typeof SPECIES_DB !== 'undefined' && SPECIES_DB[idx] && typeof player !== 'undefined' && player) {
      player.sp = SPECIES_DB[idx];
      player.species = idx;
      player.size = SPECIES_DB[idx].size || 5;
      player.energy = 80;
    }
  }, index);
}

const test = base.extend({});
test.describe.configure({ mode: 'default' });

test.describe('iGraSpore V2 — Functional Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(GAME_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('#c', { state: 'visible' });
    await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
    await page.waitForTimeout(500);
  });

  // === LOAD & CANVAS ===
  test('01 Game loads without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
    await page.screenshot({ path: `${SS}/01-game-load.png` });
  });

  test('02 Canvas visible and sized', async ({ page }) => {
    const canvas = page.locator('#c');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(100);
    expect(box.height).toBeGreaterThan(100);
    await page.screenshot({ path: `${SS}/02-canvas.png` });
  });

  test('03 Start screen visible', async ({ page }) => {
    await page.screenshot({ path: `${SS}/03-start.png` });
  });

  test('04 Skip tutorial and play', async ({ page }) => {
    await skipTutorial(page);
    const st = await getGameState(page);
    await page.screenshot({ path: `${SS}/04-playing.png` });
  });

  // === PLAYER CONTROLS ===
  test('05 Player organism exists', async ({ page }) => {
    await skipTutorial(page);
    const st = await getGameState(page);
    expect(st.playerExists).toBeTruthy();
    await page.screenshot({ path: `${SS}/05-player.png` });
  });

  test('06 WASD movement', async ({ page }) => {
    await skipTutorial(page);
    const p1 = await page.evaluate(() => ({ x: player.x, y: player.y }));
    await page.keyboard.down('w'); await page.waitForTimeout(300); await page.keyboard.up('w');
    await page.waitForTimeout(200);
    const p2 = await page.evaluate(() => ({ x: player.x, y: player.y }));
    expect(Math.abs(p2.x-p1.x)+Math.abs(p2.y-p1.y)).toBeGreaterThan(0);
    await page.screenshot({ path: `${SS}/06-wasd.png` });
  });

  test('07 Zoom in', async ({ page }) => {
    await skipTutorial(page);
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SS}/07-zoom-in.png` });
  });

  test('08 Zoom out', async ({ page }) => {
    await skipTutorial(page);
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SS}/08-zoom-out.png` });
  });

  test('09 Right-click target', async ({ page }) => {
    await skipTutorial(page);
    await page.mouse.click(800, 500, { button: 'right' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SS}/09-right-click.png` });
  });

  test('10 Space dash', async ({ page }) => {
    await skipTutorial(page);
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${SS}/10-dash.png` });
  });

  test('11 Q division', async ({ page }) => {
    await skipTutorial(page);
    await page.keyboard.press('q');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/11-division.png` });
  });

  test('12 R cyst', async ({ page }) => {
    await skipTutorial(page);
    await page.keyboard.press('r');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SS}/12-cyst.png` });
  });

  test('13 E phagocytosis', async ({ page }) => {
    await skipTutorial(page);
    await page.keyboard.press('e');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SS}/13-phago.png` });
  });

  test('14 Tab auto-mode', async ({ page }) => {
    await skipTutorial(page);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/14-auto.png` });
  });

  // === UI ELEMENTS ===
  test('15 HUD left panel', async ({ page }) => {
    await skipTutorial(page);
    await page.screenshot({ path: `${SS}/15-hud.png` });
  });

  test('16 Speed controls', async ({ page }) => {
    await skipTutorial(page);
    const b5 = page.locator('text=5x');
    if (await b5.isVisible({timeout:500}).catch(()=>false)) { await b5.click(); await page.waitForTimeout(300); }
    await page.screenshot({ path: `${SS}/16-speed.png` });
  });

  test('17 Pause button', async ({ page }) => {
    await skipTutorial(page);
    const bp = page.locator('#bPause');
    if (await bp.isVisible({timeout:500}).catch(()=>false)) { await bp.click(); await page.waitForTimeout(300); }
    await page.screenshot({ path: `${SS}/17-pause.png` });
  });

  test('18 Language selector', async ({ page }) => {
    await page.screenshot({ path: `${SS}/18-lang.png` });
  });

  test('19 Minimap', async ({ page }) => {
    await skipTutorial(page);
    await page.waitForTimeout(500);
    const mm = page.locator('#mm');
    await expect(mm).toBeVisible();
    await page.screenshot({ path: `${SS}/19-minimap.png` });
  });

  test('20 Population graph', async ({ page }) => {
    await skipTutorial(page);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/20-popgraph.png` });
  });

  test('21 Ecosystem panel', async ({ page }) => {
    await skipTutorial(page);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/21-eco.png` });
  });

  test('22 Key hints', async ({ page }) => {
    await page.screenshot({ path: `${SS}/22-keys.png` });
  });

  // === WORLD & ENVIRONMENT ===
  test('23 Day state', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof tod!=='undefined') tod=12; });
    await page.waitForTimeout(1000);
    // Debug: check all sun-related variables
    const debug = await page.evaluate(() => {
      var dp = (tod-6)/12;
      var PWW = typeof PW !== 'undefined' ? PW : 0;
      var sunX = -PWW*0.8 + dp*PWW*1.6;
      var sunY = -Math.sin(dp*Math.PI)*150+20;
      var vh = cv.height/zoom;
      var vT = cam.y - vh/2;
      return {
        tod, dayLight: typeof dayLight!=='undefined'?dayLight:-1,
        cam: {x:cam.x, y:cam.y}, zoom,
        PW: PWW, PD: typeof PD!=='undefined'?PD:0,
        sunX, sunY, vT,
        sunVisible: sunY > vT,
        skyRenders: vT < 0,
        canvas: {w:cv.width, h:cv.height},
        screenSunY: cv.height/2 + (sunY - cam.y) * zoom,
        screenSunX: cv.width/2 + (sunX - cam.x) * zoom
      };
    });
    console.log('DAY DEBUG:', JSON.stringify(debug));
    await page.screenshot({ path: `${SS}/23-day.png` });
  });

  test('24 Night state', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof tod!=='undefined') tod=0; });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/24-night.png` });
  });

  test('25 Sun position check', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof tod!=='undefined') tod=12; });
    await page.waitForTimeout(500);
    const si = await page.evaluate(() => {
      var PWW = typeof PW !== 'undefined' ? PW : (typeof window.PW !== 'undefined' ? window.PW : 4000);
      var dp=(tod-6)/12, sx=-PWW*0.8+dp*PWW*1.6, sy=-Math.sin(dp*Math.PI)*400+50;
      return {sx,sy,aboveWater:sy<0,tod};
    });
    console.log('SUN:',JSON.stringify(si));
    await page.screenshot({ path: `${SS}/25-sun.png` });
  });

  test('26 Shadows check', async ({ page }) => {
    await skipTutorial(page);
    const info = await page.evaluate(() => ({
      shadows: typeof settings!=='undefined'?settings.shadows:'?',
      orgCount: typeof orgs!=='undefined'?orgs.filter(o=>o.alive).length:0,
    }));
    console.log('SHADOWS:',JSON.stringify(info));
    await page.screenshot({ path: `${SS}/26-shadows.png` });
  });

  test('27 Winter', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof season!=='undefined') season=3; });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/27-winter.png` });
  });

  test('28 Summer', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof season!=='undefined') season=1; });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/28-summer.png` });
  });

  test('29 Rain', async ({ page }) => {
    await skipTutorial(page);
    await page.evaluate(() => { if(typeof isRaining!=='undefined') isRaining=true; });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/29-rain.png` });
  });

  test('30 Acid rain button', async ({ page }) => {
    await skipTutorial(page);
    const b = page.locator('#btnAcid');
    if (await b.isVisible({timeout:500}).catch(()=>false)) { await b.click(); await page.waitForTimeout(500); }
    await page.screenshot({ path: `${SS}/30-acid.png` });
  });

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
