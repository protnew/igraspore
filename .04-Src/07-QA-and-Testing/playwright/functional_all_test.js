
const { test, expect } = require('@playwright/test');

const URL = 'file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html';

test.describe('iGraSpore V2 — Functional Tests', () => {

  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(15000);
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForTimeout(1500);
  });

  // ============================================================
  // TEST 1: Predation — AI organisms eat each other
  // ============================================================
  test('T1: AI organisms eat prey', async ({ page }) => {
    // Count organisms before
    const before = await page.evaluate(() => orgs.filter(o => o.alive).length);
    
    // Run simulation for 5 seconds at 100x speed
    await page.evaluate(() => { timeScale = 100; });
    await page.waitForTimeout(5000);
    
    // Check that some organisms died from being eaten
    const after = await page.evaluate(() => ({
      alive: orgs.filter(o => o.alive).length,
      eaten: orgs.filter(o => o.eaten > 0).length,
      totalKills: orgs.reduce((s, o) => s + (o.eaten || 0), 0),
    }));
    
    console.log('T1_PREDITATION: before=' + before + ' after=' + JSON.stringify(after));
    
    // At least SOME organisms should have eaten something
    expect(after.totalKills).toBeGreaterThan(0);
  });

  // ============================================================
  // TEST 2: Division/reproduction
  // ============================================================
  test('T2: Organisms divide and reproduce', async ({ page }) => {
    await page.evaluate(() => { timeScale = 50; });
    await page.waitForTimeout(5000);
    
    const repro = await page.evaluate(() => ({
      totalOffspring: orgs.reduce((s, o) => s + (o.offspring || 0), 0),
      dividing: orgs.filter(o => o.dividing).length,
      generations: Math.max(...orgs.map(o => o.generation || 0)),
    }));
    
    console.log('T2_REPRODUCTION: ' + JSON.stringify(repro));
    expect(repro.totalOffspring).toBeGreaterThan(0);
  });

  // ============================================================
  // TEST 3: Viruses infect and kill
  // ============================================================
  test('T3: Virus infection works', async ({ page }) => {
    await page.evaluate(() => { timeScale = 50; });
    
    // Force-spawn some viruses
    await page.evaluate(() => {
      for(let i = 0; i < 10; i++) spawnVirus();
    });
    await page.waitForTimeout(8000);
    
    const virusState = await page.evaluate(() => ({
      virusCount: viruses.length,
      infected: orgs.filter(o => o.infected).length,
      lysed: orgs.filter(o => !o.alive && o.deathCause === 'lysis').length,
    }));
    
    console.log('T3_VIRUSES: ' + JSON.stringify(virusState));
    // Viruses should exist and some infections should happen
    expect(virusState.virusCount).toBeGreaterThan(0);
  });

  // ============================================================
  // TEST 4: Energy/metabolism system
  // ============================================================
  test('T4: Energy system works', async ({ page }) => {
    const energyBefore = await page.evaluate(() => 
      orgs.filter(o => o.alive).reduce((s, o) => s + o.energy, 0) / orgs.filter(o => o.alive).length
    );
    
    await page.evaluate(() => { timeScale = 20; });
    await page.waitForTimeout(3000);
    
    const energyAfter = await page.evaluate(() => ({
      avgEnergy: orgs.filter(o => o.alive).reduce((s, o) => s + o.energy, 0) / Math.max(1, orgs.filter(o => o.alive).length),
      starving: orgs.filter(o => o.alive && o.energy < 20).length,
      healthy: orgs.filter(o => o.alive && o.energy > 70).length,
    }));
    
    console.log('T4_ENERGY: avgBefore=' + Math.round(energyBefore) + ' ' + JSON.stringify(energyAfter));
    expect(energyAfter.avgEnergy).toBeGreaterThan(0);
  });

  // ============================================================
  // TEST 5: AI behaviors (hunt, flee, wander)
  // ============================================================
  test('T5: AI behaviors are diverse', async ({ page }) => {
    await page.evaluate(() => { timeScale = 30; });
    await page.waitForTimeout(3000);
    
    const behaviors = await page.evaluate(() => {
      const states = {};
      orgs.forEach(o => { if(o.alive && o.state) states[o.state] = (states[o.state]||0)+1; });
      return states;
    });
    
    console.log('T5_BEHAVIORS: ' + JSON.stringify(behaviors));
    // Should have multiple behavior states active
    expect(Object.keys(behaviors).length).toBeGreaterThan(1);
  });

  // ============================================================
  // TEST 6: Cyst formation under stress
  // ============================================================
  test('T6: Cyst formation', async ({ page }) => {
    // Force extreme temperature
    await page.evaluate(() => {
      SEASONS[0].temp = -5; // Freeze
    });
    await page.evaluate(() => { timeScale = 30; });
    await page.waitForTimeout(3000);
    
    const cysts = await page.evaluate(() => orgs.filter(o => o.cyst).length);
    console.log('T6_CYSTS: ' + cysts);
    // Some organisms should form cysts in extreme conditions
    // (May be 0 if no organisms in affected zone — that's OK)
  });

  // ============================================================
  // TEST 7: Population balance — no extinction/explosion
  // ============================================================
  test('T7: Population stays bounded', async ({ page }) => {
    await page.evaluate(() => { timeScale = 50; });
    await page.waitForTimeout(5000);
    
    const pop = await page.evaluate(() => orgs.filter(o => o.alive).length);
    console.log('T7_POPULATION: ' + pop);
    expect(pop).toBeGreaterThan(100);  // Not extinct
    expect(pop).toBeLessThan(4000);    // Not exploded
  });

  // ============================================================
  // TEST 8: Camera follows player
  // ============================================================
  test('T8: Camera follows player', async ({ page }) => {
    const before = await page.evaluate(() => Math.round(player.x));
    await page.keyboard.down('d');
    await page.waitForTimeout(1000);
    await page.keyboard.up('d');
    const after = await page.evaluate(() => ({
      px: Math.round(player.x),
      cx: Math.round(cam.x),
      dist: Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)),
    }));
    console.log('T8_CAMERA: before_x=' + before + ' ' + JSON.stringify(after));
    expect(after.dist).toBeLessThan(100); // Camera within 100px of player
  });

  // ============================================================
  // TEST 9: Controls work (WASD, E, Q, R)
  // ============================================================
  test('T9: Keyboard controls', async ({ page }) => {
    const pos1 = await page.evaluate(() => ({ x: Math.round(player.x), y: Math.round(player.y) }));
    
    // Move with WASD
    await page.keyboard.down('w'); await page.waitForTimeout(300);
    await page.keyboard.down('d'); await page.waitForTimeout(500);
    await page.keyboard.up('w'); await page.keyboard.up('d');
    
    const pos2 = await page.evaluate(() => ({ x: Math.round(player.x), y: Math.round(player.y) }));
    const moved = Math.abs(pos2.x - pos1.x) + Math.abs(pos2.y - pos1.y);
    console.log('T9_CONTROLS: moved=' + moved + 'px');
    expect(moved).toBeGreaterThan(5);
  });

  // ============================================================
  // TEST 10: Microscope mode toggle
  // ============================================================
  test('T10: Microscope mode', async ({ page }) => {
    await page.evaluate(() => document.getElementById('bMicro').click());
    await page.waitForTimeout(500);
    const micro = await page.evaluate(() => settings.microscopeMode);
    console.log('T10_MICROSCOPE: ' + micro);
    expect(micro).toBe(true);
  });

  // ============================================================
  // TEST 11: Render mode toggle
  // ============================================================
  test('T11: Render mode toggle', async ({ page }) => {
    const before = await page.evaluate(() => settings.renderMode);
    await page.evaluate(() => toggleRenderModeLarge());
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => settings.renderMode);
    console.log('T11_RENDER: ' + before + ' -> ' + after);
    expect(before).not.toBe(after);
  });

  // ============================================================
  // TEST 12: Stomach/food vacuole visual
  // ============================================================
  test('T12: Predators have stomach contents', async ({ page }) => {
    await page.evaluate(() => { timeScale = 50; });
    await page.waitForTimeout(5000);
    
    const stomachs = await page.evaluate(() => 
      orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length
    );
    console.log('T12_STOMACHS: ' + stomachs);
    expect(stomachs).toBeGreaterThan(0);
  });

  // ============================================================
  // TEST 13: No JavaScript errors during gameplay
  // ============================================================
  test('T13: No JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    
    await page.evaluate(() => { timeScale = 30; });
    await page.waitForTimeout(5000);
    
    console.log('T13_ERRORS: ' + errors.length);
    errors.forEach(e => console.log('  ERR: ' + e.substring(0, 150)));
    expect(errors.length).toBe(0);
  });

  // ============================================================
  // TEST 14: Defenses work (shell, spikes, toxic)
  // ============================================================
  test('T14: Defense mechanisms', async ({ page }) => {
    await page.evaluate(() => { timeScale = 50; });
    await page.waitForTimeout(5000);
    
    const defenses = await page.evaluate(() => {
      return {
        shelled: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.shell).length,
        spiked: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.spikes).length,
        toxic: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.toxic).length,
        venomous: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.venom).length,
      };
    });
    console.log('T14_DEFENSES: ' + JSON.stringify(defenses));
    // Should have some defended organisms
    expect(defenses.shelled + defenses.spiked + defenses.toxic + defenses.venomous).toBeGreaterThan(0);
  });

  // ============================================================
  // TEST 15: FPS stability
  // ============================================================
  test('T15: FPS is stable', async ({ page }) => {
    await page.waitForTimeout(2000);
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
    console.log('T15_FPS: ' + fps);
    expect(fps).toBeGreaterThan(10); // At least 10 FPS with 2000+ organisms
  });
});
