# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional_all_test.js >> iGraSpore V2 — Functional Tests >> T12: Predators have stomach contents
- Location: 07-QA-and-Testing\playwright\functional_all_test.js:209:3

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
      - generic: Экосистема
      - generic:
        - generic: "1531"
      - generic:
        - generic: "279"
      - generic:
        - generic: "81"
      - generic:
        - generic: "39"
      - generic:
        - generic: "330"
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
  117 |   });
  118 | 
  119 |   // ============================================================
  120 |   // TEST 6: Cyst formation under stress
  121 |   // ============================================================
  122 |   test('T6: Cyst formation', async ({ page }) => {
  123 |     // Force extreme temperature
  124 |     await page.evaluate(() => {
  125 |       SEASONS[0].temp = -5; // Freeze
  126 |     });
  127 |     await page.evaluate(() => { timeScale = 30; });
  128 |     await page.waitForTimeout(3000);
  129 |     
  130 |     const cysts = await page.evaluate(() => orgs.filter(o => o.cyst).length);
  131 |     console.log('T6_CYSTS: ' + cysts);
  132 |     // Some organisms should form cysts in extreme conditions
  133 |     // (May be 0 if no organisms in affected zone — that's OK)
  134 |   });
  135 | 
  136 |   // ============================================================
  137 |   // TEST 7: Population balance — no extinction/explosion
  138 |   // ============================================================
  139 |   test('T7: Population stays bounded', async ({ page }) => {
  140 |     await page.evaluate(() => { timeScale = 50; });
  141 |     await page.waitForTimeout(5000);
  142 |     
  143 |     const pop = await page.evaluate(() => orgs.filter(o => o.alive).length);
  144 |     console.log('T7_POPULATION: ' + pop);
  145 |     expect(pop).toBeGreaterThan(100);  // Not extinct
  146 |     expect(pop).toBeLessThan(4000);    // Not exploded
  147 |   });
  148 | 
  149 |   // ============================================================
  150 |   // TEST 8: Camera follows player
  151 |   // ============================================================
  152 |   test('T8: Camera follows player', async ({ page }) => {
  153 |     const before = await page.evaluate(() => Math.round(player.x));
  154 |     await page.keyboard.down('d');
  155 |     await page.waitForTimeout(1000);
  156 |     await page.keyboard.up('d');
  157 |     const after = await page.evaluate(() => ({
  158 |       px: Math.round(player.x),
  159 |       cx: Math.round(cam.x),
  160 |       dist: Math.round(Math.sqrt((player.x-cam.x)**2 + (player.y-cam.y)**2)),
  161 |     }));
  162 |     console.log('T8_CAMERA: before_x=' + before + ' ' + JSON.stringify(after));
  163 |     expect(after.dist).toBeLessThan(100); // Camera within 100px of player
  164 |   });
  165 | 
  166 |   // ============================================================
  167 |   // TEST 9: Controls work (WASD, E, Q, R)
  168 |   // ============================================================
  169 |   test('T9: Keyboard controls', async ({ page }) => {
  170 |     const pos1 = await page.evaluate(() => ({ x: Math.round(player.x), y: Math.round(player.y) }));
  171 |     
  172 |     // Move with WASD
  173 |     await page.keyboard.down('w'); await page.waitForTimeout(300);
  174 |     await page.keyboard.down('d'); await page.waitForTimeout(500);
  175 |     await page.keyboard.up('w'); await page.keyboard.up('d');
  176 |     
  177 |     const pos2 = await page.evaluate(() => ({ x: Math.round(player.x), y: Math.round(player.y) }));
  178 |     const moved = Math.abs(pos2.x - pos1.x) + Math.abs(pos2.y - pos1.y);
  179 |     console.log('T9_CONTROLS: moved=' + moved + 'px');
  180 |     expect(moved).toBeGreaterThan(5);
  181 |   });
  182 | 
  183 |   // ============================================================
  184 |   // TEST 10: Microscope mode toggle
  185 |   // ============================================================
  186 |   test('T10: Microscope mode', async ({ page }) => {
  187 |     await page.evaluate(() => document.getElementById('bMicro').click());
  188 |     await page.waitForTimeout(500);
  189 |     const micro = await page.evaluate(() => settings.microscopeMode);
  190 |     console.log('T10_MICROSCOPE: ' + micro);
  191 |     expect(micro).toBe(true);
  192 |   });
  193 | 
  194 |   // ============================================================
  195 |   // TEST 11: Render mode toggle
  196 |   // ============================================================
  197 |   test('T11: Render mode toggle', async ({ page }) => {
  198 |     const before = await page.evaluate(() => settings.renderMode);
  199 |     await page.evaluate(() => toggleRenderModeLarge());
  200 |     await page.waitForTimeout(300);
  201 |     const after = await page.evaluate(() => settings.renderMode);
  202 |     console.log('T11_RENDER: ' + before + ' -> ' + after);
  203 |     expect(before).not.toBe(after);
  204 |   });
  205 | 
  206 |   // ============================================================
  207 |   // TEST 12: Stomach/food vacuole visual
  208 |   // ============================================================
  209 |   test('T12: Predators have stomach contents', async ({ page }) => {
  210 |     await page.evaluate(() => { timeScale = 50; });
  211 |     await page.waitForTimeout(5000);
  212 |     
  213 |     const stomachs = await page.evaluate(() => 
  214 |       orgs.filter(o => o.alive && o.stomach && o.stomach.length > 0).length
  215 |     );
  216 |     console.log('T12_STOMACHS: ' + stomachs);
> 217 |     expect(stomachs).toBeGreaterThan(0);
      |                      ^ Error: expect(received).toBeGreaterThan(expected)
  218 |   });
  219 | 
  220 |   // ============================================================
  221 |   // TEST 13: No JavaScript errors during gameplay
  222 |   // ============================================================
  223 |   test('T13: No JS errors', async ({ page }) => {
  224 |     const errors = [];
  225 |     page.on('pageerror', err => errors.push(err.message));
  226 |     
  227 |     await page.evaluate(() => { timeScale = 30; });
  228 |     await page.waitForTimeout(5000);
  229 |     
  230 |     console.log('T13_ERRORS: ' + errors.length);
  231 |     errors.forEach(e => console.log('  ERR: ' + e.substring(0, 150)));
  232 |     expect(errors.length).toBe(0);
  233 |   });
  234 | 
  235 |   // ============================================================
  236 |   // TEST 14: Defenses work (shell, spikes, toxic)
  237 |   // ============================================================
  238 |   test('T14: Defense mechanisms', async ({ page }) => {
  239 |     await page.evaluate(() => { timeScale = 50; });
  240 |     await page.waitForTimeout(5000);
  241 |     
  242 |     const defenses = await page.evaluate(() => {
  243 |       return {
  244 |         shelled: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.shell).length,
  245 |         spiked: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.spikes).length,
  246 |         toxic: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.toxic).length,
  247 |         venomous: orgs.filter(o => o.alive && o.sp.flags && o.sp.flags.venom).length,
  248 |       };
  249 |     });
  250 |     console.log('T14_DEFENSES: ' + JSON.stringify(defenses));
  251 |     // Should have some defended organisms
  252 |     expect(defenses.shelled + defenses.spiked + defenses.toxic + defenses.venomous).toBeGreaterThan(0);
  253 |   });
  254 | 
  255 |   // ============================================================
  256 |   // TEST 15: FPS stability
  257 |   // ============================================================
  258 |   test('T15: FPS is stable', async ({ page }) => {
  259 |     await page.waitForTimeout(2000);
  260 |     const fps = await page.evaluate(() => {
  261 |       return new Promise(resolve => {
  262 |         var count = 0, start = performance.now();
  263 |         function loop() {
  264 |           count++;
  265 |           if (performance.now() - start < 2000) requestAnimationFrame(loop);
  266 |           else resolve(Math.round(count / 2));
  267 |         }
  268 |         requestAnimationFrame(loop);
  269 |       });
  270 |     });
  271 |     console.log('T15_FPS: ' + fps);
  272 |     expect(fps).toBeGreaterThan(10); // At least 10 FPS with 2000+ organisms
  273 |   });
  274 | });
  275 | 
```