const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  
  await page.goto('https://igraspore.pages.dev?v=ps' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);

  // For each category, track behavior of 3 random organisms over 5 seconds
  const result = await page.evaluate(() => {
    var cats = ['producer', 'consumer1', 'consumer2', 'consumer3', 'decomposer'];
    var report = [];
    
    for (var ci = 0; ci < cats.length; ci++) {
      var cat = cats[ci];
      var orgsOfCat = (orgs || []).filter(function(o) { 
        return o.alive && o.sp && o.sp.cat === cat; 
      });
      if (!orgsOfCat.length) {
        report.push({ cat: cat, status: 'EXTINCT', tested: 0 });
        continue;
      }
      
      // Sample up to 3 organisms
      var sample = orgsOfCat.slice(0, Math.min(3, orgsOfCat.length));
      var sampleIds = sample.map(function(o) { return o.id; });
      
      // Record initial state
      var init = sample.map(function(o) {
        return {
          id: o.id, name: o.sp.name, cat: o.sp.cat,
          shape: o.sp.shape,
          speed: o.sp.speed,
          energy: Math.round(o.energy),
          x: Math.round(o.x), y: Math.round(o.y),
          massFood: Math.round((o.massFood || 0) * 10) / 10,
          eatsSinceDiv: o.eatsSinceDiv || 0,
          dividing: o.dividing || false,
          age: Math.round(o.age),
        };
      });
      
      // Record positions for movement test
      var pos0 = sample.map(function(o) { return { id: o.id, x: o.x, y: o.y }; });
      
      // Check category-specific behavior
      var behaviors = {};
      
      if (cat === 'producer') {
        // Producers: should photosynthesize (energy from light), barely move
        behaviors.expected = 'photosynthesis, drift slowly';
        behaviors.expectedSpeed = 'very low (< 0.5)';
      } else if (cat === 'consumer1') {
        // Bacteria: should eat producers, move moderately
        behaviors.expected = 'eat producers, run-tumble movement';
        behaviors.expectedSpeed = 'low (0.1-0.3)';
      } else if (cat === 'consumer2') {
        // Ciliates: filter feeders, move faster
        behaviors.expected = 'filter feed on bacteria/producers, active swimming';
        behaviors.expectedSpeed = 'medium (0.2-0.5)';
      } else if (cat === 'consumer3') {
        // Predators: hunt prey, fastest
        behaviors.expected = 'hunt smaller organisms, fast pursuit';
        behaviors.expectedSpeed = 'high (0.3-0.6)';
      } else if (cat === 'decomposer') {
        // Decomposers: absorb DOM, slow/sessile
        behaviors.expected = 'absorb dissolved organic matter, slow/sessile';
        behaviors.expectedSpeed = 'very low';
      }
      
      // Count alive
      var alive = orgsOfCat.length;
      
      report.push({
        cat: cat,
        alive: alive,
        tested: sample.length,
        behaviors: behaviors,
        samples: init,
        pos0: pos0,
      });
    }
    
    return report;
  });
  
  // Run 3 seconds to track movement
  await page.evaluate(() => { for(var i=0;i<3*30;i++) updateWorld(1/30); });
  
  const after = await page.evaluate(() => {
    var report = [];
    var cats = ['producer', 'consumer1', 'consumer2', 'consumer3', 'decomposer'];
    for (var ci = 0; ci < cats.length; ci++) {
      var cat = cats[ci];
      var orgsOfCat = (orgs || []).filter(function(o) { 
        return o.alive && o.sp && o.sp.cat === cat; 
      });
      
      // Find same species as before, track movement
      var sample = orgsOfCat.slice(0, 3);
      var afterData = sample.map(function(o) {
        return {
          id: o.id, name: o.sp.name,
          energy: Math.round(o.energy),
          x: Math.round(o.x), y: Math.round(o.y),
          massFood: Math.round((o.massFood || 0) * 10) / 10,
          eatsSinceDiv: o.eatsSinceDiv || 0,
          dividing: o.dividing || false,
          age: Math.round(o.age),
          alive: o.alive,
        };
      });
      report.push({ cat: cat, alive: orgsOfCat.length, samples: afterData });
    }
    return report;
  });

  // Virus specific test
  const virusTest = await page.evaluate(() => {
    var v = viruses || [];
    if (!v.length) return { count: 0 };
    
    // Track virus 0
    var v0 = v[0];
    var pos0 = { x: v0.x, y: v0.y };
    
    return {
      count: v.length,
      sample: {
        x: Math.round(v0.x), y: Math.round(v0.y),
        vx: Math.round(v0.vx * 100) / 100,
        vy: Math.round(v0.vy * 100) / 100,
        sp: v0.sp.name,
        shape: v0.sp.shape,
        hasDivision: v0.dividing !== undefined,
        hasMassFood: v0.massFood !== undefined,
      },
      pos0: pos0,
    };
  });
  
  // Run 2 more seconds for virus movement
  await page.evaluate(() => { for(var i=0;i<2*30;i++) updateWorld(1/30); });
  
  const virusAfter = await page.evaluate(() => {
    var v = viruses || [];
    if (!v.length) return { count: 0 };
    return {
      count: v.length,
      pos1: { x: Math.round(v[0].x), y: Math.round(v[0].y) },
    };
  });

  console.log('=== PER-SPECIES FUNCTIONAL TEST ===\n');
  
  for (var i = 0; i < result.length; i++) {
    var r = result[i];
    var a = after[i];
    console.log('\n--- ' + r.cat.toUpperCase() + ' ---');
    console.log('Alive: ' + r.alive + ' → ' + a.alive);
    console.log('Expected: ' + (r.behaviors.expected || '?'));
    
    for (var j = 0; j < r.samples.length; j++) {
      var s = r.samples[j];
      var sa = null;
      // Find matching after sample
      for (var k = 0; k < a.samples.length; k++) {
        if (a.samples[k].name === s.name) { sa = a.samples[k]; break; }
      }
      
      var dx = 0, dy = 0;
      if (sa) {
        dx = sa.x - s.x;
        dy = sa.y - s.y;
      }
      var dist = Math.round(Math.sqrt(dx*dx + dy*dy));
      
      console.log('  ' + s.name + ' [' + s.shape + '] spd=' + s.speed);
      console.log('    E:' + s.energy + (sa ? '→' + sa.energy : '') + 
                  ' mass:' + s.massFood + (sa ? '→' + (sa.massFood || 0) : '') +
                  ' age:' + s.age + (sa ? '→' + sa.age : ''));
      console.log('    pos:(' + s.x + ',' + s.y + ')' + (sa ? '→(' + sa.x + ',' + sa.y + ') dist=' + dist : ''));
      console.log('    dividing:' + s.dividing + (sa ? '→' + sa.dividing : '') +
                  ' eats:' + s.eatsSinceDiv + (sa ? '→' + (sa.eatsSinceDiv||0) : ''));
    }
  }
  
  console.log('\n--- VIRUS ---');
  console.log('Count: ' + virusTest.count + ' → ' + virusAfter.count);
  if (virusTest.sample) {
    console.log('Sample: ' + virusTest.sample.sp + ' [' + virusTest.sample.shape + ']');
    console.log('  vel: vx=' + virusTest.sample.vx + ' vy=' + virusTest.sample.vy);
    console.log('  hasDivision: ' + virusTest.sample.hasDivision + ' (should be false)');
    console.log('  hasMassFood: ' + virusTest.sample.hasMassFood + ' (should be false)');
    if (virusAfter.pos1) {
      var vdx = virusAfter.pos1.x - virusTest.pos0.x;
      var vdy = virusAfter.pos1.y - virusTest.pos0.y;
      var vdist = Math.round(Math.sqrt(vdx*vdx + vdy*vdy));
      console.log('  movement: (' + Math.round(virusTest.pos0.x) + ',' + Math.round(virusTest.pos0.y) + ') → ' + JSON.stringify(virusAfter.pos1) + ' dist=' + vdist);
    }
  }
  
  console.log('\n\nJS ERRORS: ' + errors.length);
  if (errors.length) errors.slice(0, 5).forEach(function(e) { console.log('  ' + e); });
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
