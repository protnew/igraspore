# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: extended_test.js >> iGraSpore V2 — Extended Functional Tests >> E6: No crashes or NaN errors at extreme timeScale
- Location: 07-QA-and-Testing\playwright\extended_test.js:133:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.evaluate: Test timeout of 120000ms exceeded.
```

# Test source

```ts
  48  |     );
  49  |     console.log('E2_STOMACHS: ' + stomachs);
  50  |     expect(stomachs).toBeGreaterThan(0);
  51  |   });
  52  | 
  53  |   test('E3: Virus infection actually happens', async ({ page }) => {
  54  |     page.setDefaultTimeout(20000);
  55  |     await page.goto(URL, { waitUntil: 'load' });
  56  |     await page.waitForTimeout(1000);
  57  |     await page.evaluate(() => document.getElementById('startBtn').click());
  58  |     await page.waitForTimeout(1500);
  59  |     
  60  |     // Spawn viruses near organisms
  61  |     await page.evaluate(() => {
  62  |       for(var i=0; i<20; i++) spawnVirus();
  63  |       timeScale = 50;
  64  |     });
  65  |     await page.waitForTimeout(10000);
  66  |     
  67  |     const vi = await page.evaluate(() => ({
  68  |       viruses: viruses.length,
  69  |       infected: orgs.filter(o => o.infected).length,
  70  |     }));
  71  |     console.log('E3_VIRUS_INFECT: ' + JSON.stringify(vi));
  72  |     expect(vi.infected).toBeGreaterThan(0);
  73  |   });
  74  | 
  75  |   test('E4: Defense mechanisms trigger on attack', async ({ page }) => {
  76  |     page.setDefaultTimeout(20000);
  77  |     await page.goto(URL, { waitUntil: 'load' });
  78  |     await page.waitForTimeout(1000);
  79  |     await page.evaluate(() => document.getElementById('startBtn').click());
  80  |     await page.waitForTimeout(1500);
  81  |     
  82  |     await page.evaluate(() => { timeScale = 80; });
  83  |     await page.waitForTimeout(5000);
  84  |     
  85  |     // Check that predators got poisoned/paralyzed by defended prey
  86  |     const defenses = await page.evaluate(() => ({
  87  |       poisoned: orgs.filter(o => o.alive && o.flashColor === '#0f0').length,
  88  |       slowed: orgs.filter(o => o.alive && o.speedMult < 0.5).length,
  89  |       shelled: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.shell).length,
  90  |       spiked: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.spikes).length,
  91  |       toxic: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.toxic).length,
  92  |       venom: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.venom).length,
  93  |     }));
  94  |     console.log('E4_DEFENSES: ' + JSON.stringify(defenses));
  95  |     expect(defenses.shelled + defenses.spiked + defenses.toxic + defenses.venom).toBeGreaterThan(0);
  96  |   });
  97  | 
  98  |   test('E5: Division creates offspring with mutations', async ({ page }) => {
  99  |     page.setDefaultTimeout(20000);
  100 |     await page.goto(URL, { waitUntil: 'load' });
  101 |     await page.waitForTimeout(1000);
  102 |     await page.evaluate(() => document.getElementById('startBtn').click());
  103 |     await page.waitForTimeout(1500);
  104 |     
  105 |     await page.evaluate(() => { timeScale = 100; });
  106 |     await page.waitForTimeout(5000);
  107 |     
  108 |     const mutations = await page.evaluate(() => {
  109 |       var varied = {
  110 |         speed: new Set(),
  111 |         size: new Set(),
  112 |         temp: new Set(),
  113 |       };
  114 |       orgs.forEach(o => {
  115 |         if(o.alive) {
  116 |           varied.speed.add(Math.round((o.speedMult||1)*10)/10);
  117 |           varied.size.add(Math.round((o.sizeMult||1)*10)/10);
  118 |           varied.temp.add(Math.round((o.tempOffset||0)*10)/10);
  119 |         }
  120 |       });
  121 |       return {
  122 |         speedVariants: varied.speed.size,
  123 |         sizeVariants: varied.size.size,
  124 |         tempVariants: varied.temp.size,
  125 |         maxGeneration: Math.max(...orgs.map(o => o.generation || 0)),
  126 |         totalOffspring: orgs.reduce((s,o) => s + (o.offspring||0), 0),
  127 |       };
  128 |     });
  129 |     console.log('E5_MUTATIONS: ' + JSON.stringify(mutations));
  130 |     expect(mutations.totalOffspring).toBeGreaterThan(0);
  131 |   });
  132 | 
  133 |   test('E6: No crashes or NaN errors at extreme timeScale', async ({ page }) => {
  134 |     page.setDefaultTimeout(20000);
  135 |     const errors = [];
  136 |     page.on('pageerror', err => errors.push(err.message));
  137 |     
  138 |     await page.goto(URL, { waitUntil: 'load' });
  139 |     await page.waitForTimeout(1000);
  140 |     await page.evaluate(() => document.getElementById('startBtn').click());
  141 |     await page.waitForTimeout(1000);
  142 |     
  143 |     // Run at extreme speed
  144 |     await page.evaluate(() => { timeScale = 500; });
  145 |     await page.waitForTimeout(5000);
  146 |     
  147 |     // Check for NaN
> 148 |     const nanCheck = await page.evaluate(() => {
      |                                 ^ Error: page.evaluate: Test timeout of 120000ms exceeded.
  149 |       var nanOrgs = orgs.filter(o => 
  150 |         isNaN(o.x) || isNaN(o.y) || isNaN(o.energy) || isNaN(o.size)
  151 |       ).length;
  152 |       return { nanOrgs, totalOrgs: orgs.length };
  153 |     });
  154 |     
  155 |     console.log('E6_EXTREME: errors=' + errors.length + ' nanOrgs=' + JSON.stringify(nanCheck));
  156 |     expect(nanCheck.nanOrgs).toBe(0);
  157 |     expect(errors.length).toBe(0);
  158 |   });
  159 | 
  160 |   test('E7: AI organisms show diverse behaviors over time', async ({ page }) => {
  161 |     page.setDefaultTimeout(20000);
  162 |     await page.goto(URL, { waitUntil: 'load' });
  163 |     await page.waitForTimeout(1000);
  164 |     await page.evaluate(() => document.getElementById('startBtn').click());
  165 |     await page.waitForTimeout(1000);
  166 |     
  167 |     await page.evaluate(() => { timeScale = 50; });
  168 |     await page.waitForTimeout(5000);
  169 |     
  170 |     const states = await page.evaluate(() => {
  171 |       var s = {};
  172 |       orgs.forEach(o => { if(o.alive && o.state) s[o.state] = (s[o.state]||0)+1; });
  173 |       return s;
  174 |     });
  175 |     console.log('E7_STATES: ' + JSON.stringify(states));
  176 |     // Should have at least 3 different states
  177 |     expect(Object.keys(states).length).toBeGreaterThanOrEqual(3);
  178 |   });
  179 | });
  180 | 
```