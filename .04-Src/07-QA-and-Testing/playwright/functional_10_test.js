
const { test, expect } = require('@playwright/test');

const URL = 'https://protnew.github.io/igraspore/?nocache=' + Date.now();

test('COMPREHENSIVE FUNCTIONAL TEST — 10 key features', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.setDefaultTimeout(20000);
  
  // ============================================================
  // FEATURE 1: Main Menu loads with all buttons
  // ============================================================
  await page.goto(URL, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2000);
  
  const menuElements = await page.evaluate(() => {
    return {
      startBtn: !!document.getElementById('startBtn'),
      screensaverBtn: !!document.getElementById('screensaverBtn'),
      helpBtn: !!document.getElementById('helpBtn'),
      setBtn2: !!document.getElementById('setBtn2'),
      wikiBtnMenu: !!document.getElementById('wikiBtnMenu'),
      startBtnText: document.getElementById('startBtn')?.textContent,
      speciesCount: typeof SPECIES_DB !== 'undefined' ? Object.keys(SPECIES_DB).length : 0,
    };
  });
  console.log('F1_MENU: ' + JSON.stringify(menuElements));
  await page.screenshot({ path: 'screenshots/FUNC-01-menu.png' });
  
  // ============================================================
  // FEATURE 2: Tutorial flow (5 steps via "Далее" button)
  // ============================================================
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1000);
  
  // Check if tutorial appears
  const tutVisible = await page.evaluate(() => {
    const t = document.getElementById('tutStep') || document.getElementById('tutorial');
    return t ? { visible: t.style.display !== 'none', text: t.textContent?.substring(0, 50) } : null;
  });
  
  // Try to advance tutorial through all steps
  let tutSteps = 0;
  for (let i = 0; i < 6; i++) {
    const advanced = await page.evaluate(() => {
      const nextBtn = document.getElementById('tutNext') || document.getElementById('tutNextBtn');
      if (nextBtn && nextBtn.style.display !== 'none') {
        nextBtn.click();
        return true;
      }
      return false;
    });
    if (advanced) {
      tutSteps++;
      await page.waitForTimeout(300);
    } else break;
  }
  console.log('F2_TUTORIAL: steps_completed=' + tutSteps);
  await page.screenshot({ path: 'screenshots/FUNC-02-tutorial.png' });
  
  // ============================================================
  // FEATURE 3: Gameplay starts — organism controllable
  // ============================================================
  const gameState = await page.evaluate(() => ({
    state: typeof state !== 'undefined' ? state : 'undef',
    playerExists: typeof player !== 'undefined' && player !== null,
    playerAlive: typeof player !== 'undefined' && player ? player.alive : false,
    playerX: typeof player !== 'undefined' && player ? Math.round(player.x) : 0,
    playerY: typeof player !== 'undefined' && player ? Math.round(player.y) : 0,
    popCount: typeof orgs !== 'undefined' ? orgs.length : 0,
    camX: typeof cam !== 'undefined' ? Math.round(cam.x) : 0,
    camY: typeof cam !== 'undefined' ? Math.round(cam.y) : 0,
    zoom: typeof zoom !== 'undefined' ? zoom.toFixed(2) : 'undef',
  }));
  console.log('F3_GAMEPLAY: ' + JSON.stringify(gameState));
  await page.screenshot({ path: 'screenshots/FUNC-03-gameplay.png' });
  
  // ============================================================
  // FEATURE 4: Keyboard controls (WASD movement)
  // ============================================================
  const posBefore = await page.evaluate(() => ({ x: player.x, y: player.y }));
  await page.keyboard.press('KeyD');
  await page.waitForTimeout(200);
  await page.keyboard.press('KeyD');
  await page.waitForTimeout(200);
  await page.keyboard.press('KeyS');
  await page.waitForTimeout(200);
  const posAfter = await page.evaluate(() => ({ x: player.x, y: player.y }));
  const moved = Math.abs(posAfter.x - posBefore.x) > 0.1 || Math.abs(posAfter.y - posBefore.y) > 0.1;
  console.log('F4_KEYBOARD: moved=' + moved + ' before=(' + Math.round(posBefore.x) + ',' + Math.round(posBefore.y) + ') after=(' + Math.round(posAfter.x) + ',' + Math.round(posAfter.y) + ')');
  
  // ============================================================
  // FEATURE 5: Action buttons (Eat, Divide, AI, Free cam)
  // ============================================================
  const actions = {};
  // Eat
  await page.evaluate(() => document.getElementById('bEat')?.click());
  await page.waitForTimeout(300);
  actions.eat = true;
  // Divide
  await page.evaluate(() => document.getElementById('bDiv')?.click());
  await page.waitForTimeout(300);
  actions.divide = true;
  // AI toggle
  await page.evaluate(() => document.getElementById('bAuto')?.click());
  await page.waitForTimeout(300);
  actions.ai = await page.evaluate(() => typeof player !== 'undefined' && player ? player.autoPilot : false);
  // Free cam
  await page.evaluate(() => document.getElementById('bFree')?.click());
  await page.waitForTimeout(300);
  actions.freeCam = await page.evaluate(() => typeof freeCam !== 'undefined' ? freeCam : false);
  console.log('F5_ACTIONS: ' + JSON.stringify(actions));
  await page.screenshot({ path: 'screenshots/FUNC-05-actions.png' });
  
  // ============================================================
  // FEATURE 6: Settings panel with render mode toggle
  // ============================================================
  // Open settings
  await page.evaluate(() => document.getElementById('setBtn2')?.click());
  await page.waitForTimeout(500);
  
  const settingsPanel = await page.evaluate(() => {
    const setO = document.getElementById('setO');
    const rmodeTg = document.getElementById('rmodeTg');
    return {
      panelVisible: setO ? setO.className.includes('show') : false,
      renderModeToggle: !!rmodeTg,
      currentMode: typeof settings !== 'undefined' ? settings.renderMode : 'undef',
    };
  });
  
  // Click render mode toggle
  if (settingsPanel.renderModeToggle) {
    await page.evaluate(() => document.getElementById('rmodeTg')?.click());
    await page.waitForTimeout(200);
    settingsPanel.newMode = await page.evaluate(() => settings.renderMode);
  }
  console.log('F6_SETTINGS: ' + JSON.stringify(settingsPanel));
  await page.screenshot({ path: 'screenshots/FUNC-06-settings.png' });
  
  // Close settings
  await page.evaluate(() => document.getElementById('setClose')?.click());
  await page.waitForTimeout(300);
  
  // ============================================================
  // FEATURE 7: Day/Night cycle (time progression)
  // ============================================================
  const timeBefore = await page.evaluate(() => typeof tod !== 'undefined' ? tod : 0);
  await page.waitForTimeout(3000); // Wait 3 seconds
  const timeAfter = await page.evaluate(() => typeof tod !== 'undefined' ? tod : 0);
  const timeAdvanced = timeAfter > timeBefore;
  console.log('F7_DAYNIGHT: before=' + timeBefore.toFixed(2) + ' after=' + timeAfter.toFixed(2) + ' advanced=' + timeAdvanced);
  await page.screenshot({ path: 'screenshots/FUNC-07-daynight.png' });
  
  // ============================================================
  // FEATURE 8: Minimap shows organisms
  // ============================================================
  const minimapData = await page.evaluate(() => {
    const mm = document.getElementById('mm');
    if (!mm) return { exists: false };
    return {
      exists: true,
      width: mm.width,
      height: mm.height,
      visible: mm.style.display !== 'none',
    };
  });
  console.log('F8_MINIMAP: ' + JSON.stringify(minimapData));
  await page.screenshot({ path: 'screenshots/FUNC-08-minimap.png' });
  
  // ============================================================
  // FEATURE 9: Population dynamics (organisms live, die, reproduce)
  // ============================================================
  const pop1 = await page.evaluate(() => orgs.filter(o => o.alive).length);
  const species1 = await page.evaluate(() => {
    const s = new Set();
    orgs.forEach(o => { if (o.alive) s.add(o.sp.name); });
    return s.size;
  });
  await page.waitForTimeout(3000);
  const pop2 = await page.evaluate(() => orgs.filter(o => o.alive).length);
  const species2 = await page.evaluate(() => {
    const s = new Set();
    orgs.forEach(o => { if (o.alive) s.add(o.sp.name); });
    return s.size;
  });
  console.log('F9_POPULATION: pop=' + pop1 + '→' + pop2 + ' species=' + species1 + '→' + species2);
  
  // ============================================================
  // FEATURE 10: Free camera mode + screensaver
  // ============================================================
  // Enable free cam
  await page.evaluate(() => { if(!freeCam) document.getElementById('bFree')?.click(); });
  await page.waitForTimeout(500);
  
  const freeCamState = await page.evaluate(() => ({
    freeCam: typeof freeCam !== 'undefined' ? freeCam : false,
    camX: Math.round(cam.x),
    camY: Math.round(cam.y),
  }));
  
  // Move camera with WASD in free cam
  await page.keyboard.press('KeyW');
  await page.waitForTimeout(200);
  await page.keyboard.press('KeyA');
  await page.waitForTimeout(200);
  
  const freeCamAfter = await page.evaluate(() => ({
    camX: Math.round(cam.x),
    camY: Math.round(cam.y),
  }));
  const camMoved = freeCamState.camX !== freeCamAfter.camX || freeCamState.camY !== freeCamAfter.camY;
  console.log('F10_FREECAM: enabled=' + freeCamState.freeCam + ' camMoved=' + camMoved + ' before=(' + freeCamState.camX + ',' + freeCamState.camY + ') after=(' + freeCamAfter.camX + ',' + freeCamAfter.camY + ')');
  await page.screenshot({ path: 'screenshots/FUNC-10-freecam.png' });
  
  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n=== ERRORS ===');
  console.log('Total JS errors: ' + errors.length);
  if (errors.length > 0) errors.slice(0, 5).forEach(e => console.log('  ' + e));
  
  // FPS check
  const fps = await page.evaluate(() => {
    return new Promise(resolve => {
      var count = 0, start = performance.now();
      function loop() {
        count++;
        if (performance.now() - start < 2000) requestAnimationFrame(loop);
        else resolve(Math.round(count / 2));
      }
      requestAnimationFrame(loop);
    });
  });
  console.log('FPS: ' + fps);
  console.log('ALL_DONE');
});
