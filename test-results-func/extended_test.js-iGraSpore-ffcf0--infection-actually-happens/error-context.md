# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: extended_test.js >> iGraSpore V2 — Extended Functional Tests >> E3: Virus infection actually happens
- Location: 07-QA-and-Testing\playwright\extended_test.js:53:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "🎨 МУЛЬТЯШНЫЙ" [ref=e2] [cursor=pointer]
  - generic "Minimap" [ref=e4] [cursor=pointer]
  - generic "Population graph" [ref=e5]
  - generic [ref=e6]:
    - generic [ref=e8] [cursor=pointer]:
      - generic [ref=e9]: 🌐
      - generic [ref=e10]: Русский
      - generic [ref=e11]: ▼
    - generic:
      - generic: Synechocystis sp.
      - generic: Gen 0 · 6.0μm
      - generic:
        - text: "Энергия: 100/100 · Возраст: 2s"
        - text: "Съедено: 0 · Делений: 0"
      - button "🧬 ДНК-Редактор"
    - generic:
      - generic: Экосистема
      - generic:
        - generic: "1546"
      - generic:
        - generic: "280"
      - generic:
        - generic: "81"
      - generic:
        - generic: "39"
      - generic:
        - generic: "330"
      - generic:
        - generic: "20"
      - generic:
        - text: "Причины гибели:"
        - generic:
          - generic:
            - generic: "Голод:"
            - generic: "0"
          - generic:
            - generic: "Съедено:"
            - generic: "0"
          - generic:
            - generic: "Темп:"
            - generic: "0"
          - generic:
            - generic: "Старость:"
            - generic: "0"
          - generic:
            - generic: "Лизис:"
            - generic: "0"
    - generic:
      - generic: Легенда
      - generic: Водоросли
      - generic: Бактерии
      - generic: Инфузории
      - generic: Хищники
      - generic: Грибки
      - generic: Вирусы
      - generic: macrophage
  - generic:
    - generic: "Поп-ция: 2290"
    - generic: "FPS: 23 · Свет: 13%"
    - generic: "Темп: 24°C · Дней: 0"
  - generic:
    - generic: ☀ Ясно
    - generic: "Ветер: 0"
  - generic: 100 μm
  - generic [ref=e12]:
    - generic "ПАУЗА" [ref=e13] [cursor=pointer]: ⏸
    - generic "0.1x" [ref=e14] [cursor=pointer]
    - generic "0.25x" [ref=e15] [cursor=pointer]
    - generic "0.5x" [ref=e16] [cursor=pointer]
    - generic "1x" [ref=e17] [cursor=pointer]
    - generic "5x" [ref=e18] [cursor=pointer]
    - generic "25x" [ref=e19] [cursor=pointer]
    - generic "100x" [ref=e20] [cursor=pointer]
  - generic:
    - generic:
      - text: WASD — движение | Мышь — направление | E — есть | Q — делиться
      - text: R — циста | Tab — автопилот | F — своб.камера | M — микроскоп | N — режим
      - text: V — следовать | B — вики | P — пауза | Колесо — зум
  - generic [ref=e21]:
    - generic "Eat" [ref=e22] [cursor=pointer]:
      - text: 🍼
      - generic [ref=e23]: E
    - generic "Divide" [ref=e24] [cursor=pointer]:
      - text: 🕔
      - generic [ref=e25]: Q
    - generic "Cyst" [ref=e26] [cursor=pointer]:
      - text: 🛡
      - generic [ref=e27]: R
    - generic "AI" [ref=e28] [cursor=pointer]:
      - text: 🤖
      - generic [ref=e29]: Tab
    - generic "Free cam" [ref=e30] [cursor=pointer]:
      - text: 📹
      - generic [ref=e31]: F
    - generic "Microscope Mode" [ref=e32] [cursor=pointer]:
      - text: 🔬
      - generic [ref=e33]: M
    - generic "Render Mode (Realistic/Cartoon)" [ref=e34] [cursor=pointer]:
      - text: 🎨
      - generic [ref=e35]: "N"
    - generic "Follow" [ref=e36] [cursor=pointer]:
      - text: 🎯
      - generic [ref=e37]: V
    - generic "Wiki/Bestiary" [ref=e38] [cursor=pointer]:
      - text: 📚
      - generic [ref=e39]: B
    - generic "Pause" [ref=e40] [cursor=pointer]:
      - text: ⏸
      - generic [ref=e41]: P
    - generic "Zoom+" [ref=e42] [cursor=pointer]: 🔍+
    - generic "Zoom-" [ref=e43] [cursor=pointer]: 🔍-
    - generic "Sandbox Tools" [ref=e44] [cursor=pointer]: 🛠
```

# Test source

```ts
  1   | 
  2   | const { test, expect } = require('@playwright/test');
  3   | const URL = 'file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html';
  4   | 
  5   | test.describe('iGraSpore V2 — Extended Functional Tests', () => {
  6   |   beforeEach: async ({ page }) => {}
  7   | 
  8   |   test('E1: Each species category can eat its food chain', async ({ page }) => {
  9   |     page.setDefaultTimeout(20000);
  10  |     await page.goto(URL, { waitUntil: 'load' });
  11  |     await page.waitForTimeout(1000);
  12  |     await page.evaluate(() => document.getElementById('startBtn').click());
  13  |     await page.waitForTimeout(1500);
  14  |     
  15  |     // Run at high speed to trigger eating
  16  |     await page.evaluate(() => { timeScale = 100; });
  17  |     await page.waitForTimeout(5000);
  18  |     
  19  |     // Check each category
  20  |     const cats = await page.evaluate(() => {
  21  |       var result = {};
  22  |       var foodMap = FOOD;
  23  |       for(var cat in foodMap) {
  24  |         var predators = orgs.filter(o => o.alive && o.sp.cat === cat);
  25  |         var eaters = predators.filter(o => (o.eaten || 0) > 0);
  26  |         result[cat] = { total: predators.length, eaters: eaters.length, kills: predators.reduce((s,o)=>s+(o.eaten||0),0) };
  27  |       }
  28  |       return result;
  29  |     });
  30  |     console.log('E1_FOOD_CHAIN: ' + JSON.stringify(cats));
  31  |     
  32  |     // At least consumer1, consumer2, consumer3 should have eaters
  33  |     expect(cats.consumer1.eaters + cats.consumer2.eaters + cats.consumer3.eaters).toBeGreaterThan(0);
  34  |   });
  35  | 
  36  |   test('E2: Stomach contents visible after eating', async ({ page }) => {
  37  |     page.setDefaultTimeout(20000);
  38  |     await page.goto(URL, { waitUntil: 'load' });
  39  |     await page.waitForTimeout(1000);
  40  |     await page.evaluate(() => document.getElementById('startBtn').click());
  41  |     await page.waitForTimeout(1500);
  42  |     
  43  |     await page.evaluate(() => { timeScale = 50; });
  44  |     await page.waitForTimeout(3000);
  45  |     
  46  |     const stomachs = await page.evaluate(() => 
  47  |       orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length
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
> 72  |     expect(vi.infected).toBeGreaterThan(0);
      |                         ^ Error: expect(received).toBeGreaterThan(expected)
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
  148 |     const nanCheck = await page.evaluate(() => {
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
```