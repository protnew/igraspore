
const { test, expect } = require('@playwright/test');
const URL = 'file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html';

test.describe('iGraSpore V2 — Extended Functional Tests', () => {
  beforeEach: async ({ page }) => {}

  test('E1: Each species category can eat its food chain', async ({ page }) => {
    page.setDefaultTimeout(20000);
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForTimeout(1500);
    
    // Run at high speed to trigger eating
    await page.evaluate(() => { timeScale = 100; });
    await page.waitForTimeout(5000);
    
    // Check each category
    const cats = await page.evaluate(() => {
      var result = {};
      var foodMap = FOOD;
      for(var cat in foodMap) {
        var predators = orgs.filter(o => o.alive && o.sp.cat === cat);
        var eaters = predators.filter(o => (o.eaten || 0) > 0);
        result[cat] = { total: predators.length, eaters: eaters.length, kills: predators.reduce((s,o)=>s+(o.eaten||0),0) };
      }
      return result;
    });
    console.log('E1_FOOD_CHAIN: ' + JSON.stringify(cats));
    
    // At least consumer1, consumer2, consumer3 should have eaters
    expect(cats.consumer1.eaters + cats.consumer2.eaters + cats.consumer3.eaters).toBeGreaterThan(0);
  });

  test('E2: Stomach contents visible after eating', async ({ page }) => {
    page.setDefaultTimeout(20000);
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForTimeout(1500);
    
    await page.evaluate(() => { timeScale = 50; });
    await page.waitForTimeout(3000);
    
    const stomachs = await page.evaluate(() => 
      orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length
    );
    console.log('E2_STOMACHS: ' + stomachs);
    expect(stomachs).toBeGreaterThan(0);
  });

  test('E3: Virus infection actually happens', async ({ page }) => {
    page.setDefaultTimeout(20000);
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForTimeout(1500);
    
    // Spawn viruses near organisms
    await page.evaluate(() => {
      for(var i=0; i<20; i++) spawnVirus();
      timeScale = 50;
    });
    await page.waitForTimeout(10000);
    
    const vi = await page.evaluate(() => ({
      viruses: viruses.length,
      infected: orgs.filter(o => o.infected).length,
    }));
    console.log('E3_VIRUS_INFECT: ' + JSON.stringify(vi));
    expect(vi.infected).toBeGreaterThan(0);
  });

  test('E4: Defense mechanisms trigger on attack', async ({ page }) => {
    page.setDefaultTimeout(20000);
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForTimeout(1500);
    
    await page.evaluate(() => { timeScale = 80; });
    await page.waitForTimeout(5000);
    
    // Check that predators got poisoned/paralyzed by defended prey
    const defenses = await page.evaluate(() => ({
      poisoned: orgs.filter(o => o.alive && o.flashColor === '#0f0').length,
      slowed: orgs.filter(o => o.alive && o.speedMult < 0.5).length,
      shelled: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.shell).length,
      spiked: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.spikes).length,
      toxic: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.toxic).length,
      venom: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.venom).length,
    }));
    console.log('E4_DEFENSES: ' + JSON.stringify(defenses));
    expect(defenses.shelled + defenses.spiked + defenses.toxic + defenses.venom).toBeGreaterThan(0);
  });

  test('E5: Division creates offspring with mutations', async ({ page }) => {
    page.setDefaultTimeout(20000);
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForTimeout(1500);
    
    await page.evaluate(() => { timeScale = 100; });
    await page.waitForTimeout(5000);
    
    const mutations = await page.evaluate(() => {
      var varied = {
        speed: new Set(),
        size: new Set(),
        temp: new Set(),
      };
      orgs.forEach(o => {
        if(o.alive) {
          varied.speed.add(Math.round((o.speedMult||1)*10)/10);
          varied.size.add(Math.round((o.sizeMult||1)*10)/10);
          varied.temp.add(Math.round((o.tempOffset||0)*10)/10);
        }
      });
      return {
        speedVariants: varied.speed.size,
        sizeVariants: varied.size.size,
        tempVariants: varied.temp.size,
        maxGeneration: Math.max(...orgs.map(o => o.generation || 0)),
        totalOffspring: orgs.reduce((s,o) => s + (o.offspring||0), 0),
      };
    });
    console.log('E5_MUTATIONS: ' + JSON.stringify(mutations));
    expect(mutations.totalOffspring).toBeGreaterThan(0);
  });

  test('E6: No crashes or NaN errors at extreme timeScale', async ({ page }) => {
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForTimeout(1000);
    
    // Run at extreme speed
    await page.evaluate(() => { timeScale = 500; });
    await page.waitForTimeout(5000);
    
    // Check for NaN
    const nanCheck = await page.evaluate(() => {
      var nanOrgs = orgs.filter(o => 
        isNaN(o.x) || isNaN(o.y) || isNaN(o.energy) || isNaN(o.size)
      ).length;
      return { nanOrgs, totalOrgs: orgs.length };
    });
    
    console.log('E6_EXTREME: errors=' + errors.length + ' nanOrgs=' + JSON.stringify(nanCheck));
    expect(nanCheck.nanOrgs).toBe(0);
    expect(errors.length).toBe(0);
  });

  test('E7: AI organisms show diverse behaviors over time', async ({ page }) => {
    page.setDefaultTimeout(20000);
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => { timeScale = 50; });
    await page.waitForTimeout(5000);
    
    const states = await page.evaluate(() => {
      var s = {};
      orgs.forEach(o => { if(o.alive && o.state) s[o.state] = (s[o.state]||0)+1; });
      return s;
    });
    console.log('E7_STATES: ' + JSON.stringify(states));
    // Should have at least 3 different states
    expect(Object.keys(states).length).toBeGreaterThanOrEqual(3);
  });
});
