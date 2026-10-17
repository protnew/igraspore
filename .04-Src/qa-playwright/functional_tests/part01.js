// U47: часть 1 функционального набора (тесты 01–30). Тела тестов и ожидания — дословный перенос
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

});
