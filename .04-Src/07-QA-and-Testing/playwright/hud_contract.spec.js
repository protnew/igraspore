// hud_contract.spec.js — TZ v9 §P0/P1/L.6 (стр. 665): контракт кнопок HUD и меню паузы.
// Каждая видимая кнопка: клик/клавиша -> эффект через глобалы или тост; без эффекта и без тоста = FAIL.
// Прогон: 1280x800 и 390x844 (isMobile, hasTouch); языки ru, en, hi.
// Запуск: GATE_BASE_URL=http://127.0.0.1:8795 node .04-Src/node_modules/.bin/playwright test --config tools/... (см. run-all-tests.ps1)
import { test, expect } from '@playwright/test';

const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8795';
const LANGS = ['ru', 'en', 'hi'];

// ---------- helpers ----------

async function passStartCardAndTutorial(page) {
  const card = page.locator('#roleCardOk');
  try {
    await card.waitFor({ state: 'visible', timeout: 8000 });
    await card.click();
  } catch (e) { /* карточки нет — вирус/демо, не ослабляем ожидание playing ниже */ }
  const skip = page.locator('#tutSkip');
  try {
    await skip.waitFor({ state: 'visible', timeout: 5000 });
    await skip.click();
  } catch (e) { /* туториал уже пройден в localStorage */ }
}

async function boot(page, lang) {
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0, 200)));
  // v20.6 G2: тестовый режим (малый пул) + evaluate-клик (page.click ловит pointer-захват оверлеев)
  await page.goto(BASE + '/?lang=' + lang + '&test=1&pool=200&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('#startBtn', { timeout: 20000 });
  await page.evaluate("document.getElementById('startBtn').click()");
  await passStartCardAndTutorial(page);
  await page.waitForFunction(
    () => window.state === 'playing' && window.player && player.alive,
    undefined,
    { timeout: 30000 }
  );
  page._errs = errs;
  return errs;
}

const SNAP_JS = `JSON.stringify({
  state: (typeof state!=='undefined')?state:null,
  cyst: !!(window.player&&player.cyst),
  dividing: !!(window.player&&player.dividing),
  autoAI: (typeof autoAI!=='undefined')?!!autoAI:null,
  freeCam: (typeof freeCam!=='undefined')?!!freeCam:null,
  micro: !!(window.settings&&settings.microscopeMode),
  rm: window.settings?settings.renderMode:null,
  zoom: (typeof zoom!=='undefined')?+zoom.toFixed(2):null,
  tZoom: (typeof tZoom!=='undefined')?+tZoom.toFixed(2):null,
  showMap: document.body.classList.contains('show-map'),
  legendCollapsed: (typeof window._legendCollapsed!=='undefined')?!!window._legendCollapsed:null,
  ovs: Array.from(document.querySelectorAll('.ov.show')).map(e=>e.id).sort().join(','),
  toast: (document.getElementById('toast')||{}).textContent||'',
  toastVis: (function(){var t=document.getElementById('toast');return !!(t&&getComputedStyle(t).opacity!=='0'&&t.style.display!=='none');})(),
  energy: window.player?+player.energy.toFixed(2):null,
  alive: !!(window.player&&player.alive)
})`;

const snap = (page) => page.evaluate(SNAP_JS).then(JSON.parse);

const BUTTONS_JS = `Array.from(document.querySelectorAll('[role=button],button'))
  .filter(function(b){
    if(b.closest('.ov:not(.show)')) return false;              // кнопки внутри скрытых оверлеев
    if(b.closest('#tutorialLayer') ) { var tl=document.getElementById('tutorialLayer'); if(tl&&tl.style.display==='none') return false; }
    if(b.closest('#menuO') || b.closest('#deadO')) return false; // меню и экран смерти — не игровой HUD
    var r=b.getBoundingClientRect();
    if(r.width===0||r.height===0) return false;
    var cs=getComputedStyle(b);
    if(cs.display==='none'||cs.visibility==='hidden') return false;
    return true;
  })
  .map(function(b){var r=b.getBoundingClientRect();return {id:b.id||b.className,cls:b.className,x:r.x,y:r.y,w:r.width,h:r.height,parked:b.classList.contains('hud-parked'),inPause:!!b.closest('#pauseO'),aria:b.getAttribute('aria-label')||''};})`;

const visibleButtons = (page) => page.evaluate(BUTTONS_JS);

// эффект = любое изменение снимка, кроме волатильных полей
function snapChanged(a, b) {
  const volatile = ['toast', 'toastVis', 'energy'];
  for (const k of Object.keys(a)) {
    if (volatile.includes(k)) continue;
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) return k;
  }
  return null;
}

async function toastText(page) {
  return page.evaluate(`(document.getElementById('toast')||{}).textContent||''`);
}

// ---------- desktop 1280x800 ----------

test.describe('HUD contract — desktop 1280x800', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  for (const lang of LANGS) {
    test(`[${lang}] постоянных видимых элементов HUD <= 7, >=44px, без перекрытий`, async ({ page }) => {
      await boot(page, lang);
      const btns = await visibleButtons(page);
      const persistent = btns.filter(b => !b.inPause && !b.parked);
      expect(persistent.length, 'persistent buttons: ' + JSON.stringify(persistent.map(b => b.id))).toBeLessThanOrEqual(7);
      for (const b of persistent) {
        expect(b.w, b.id + ' width').toBeGreaterThanOrEqual(44);
        expect(b.h, b.id + ' height').toBeGreaterThanOrEqual(44);
      }
      for (let i = 0; i < persistent.length; i++)
        for (let j = i + 1; j < persistent.length; j++) {
          const A = persistent[i], B = persistent[j];
          const overlap = A.x < B.x + B.w && B.x < A.x + A.w && A.y < B.y + B.h && B.y < A.y + A.h;
          expect(overlap, `overlap ${A.id} vs ${B.id}`).toBe(false);
        }
      const parked = btns.filter(b => b.parked);
      expect(parked.length, 'parked visible: ' + parked.map(b => b.id)).toBe(0);
    });

    test(`[${lang}] Q: деление — ready даёт dividing, blocked даёт причину`, async ({ page }) => {
      await boot(page, lang);
      // доводим игрока до ready
      await page.evaluate(`(function(){var n=divideNeeds(player);
        player.energy=n.energy[1]+10; player.massFood=(n.mass[1]||0)+1;
        player.size=Math.max(player.size,(n.size&&n.size[1])||player.size);
        player.divCD=0; player.cyst=false;})()`);
      await page.waitForTimeout(150);
      await page.click('#bDiv');
      await page.waitForTimeout(300);
      const s = await snap(page);
      const wentDiv = s.dividing || (await toastText(page)).length > 0;
      expect(wentDiv, 'Q при ready: dividing или тост').toBe(true);
      // blocked: энергия в ноль -> причина
      await page.evaluate(`(function(){player.dividing=false;player.energy=0;player.divCD=0;})()`);
      await page.click('#bDiv');
      await page.waitForTimeout(300);
      const t = await toastText(page);
      const blocked = await page.evaluate(`(function(){var d=document.getElementById('bDiv');return d.classList.contains('is-blocked');})()`);
      expect(t.length > 0 || blocked, 'Q при blocked: тост-причина или is-blocked').toBe(true);
    });

    test(`[${lang}] R: ручная циста держится >=1с, повторное R будит`, async ({ page }) => {
      await boot(page, lang);
      await page.keyboard.press('r');
      await page.waitForTimeout(200);
      let s = await snap(page);
      expect(s.cyst, 'R -> cyst=true').toBe(true);
      await page.waitForTimeout(1200);
      s = await snap(page);
      expect(s.cyst, 'cyst держится (manual)').toBe(true);
      await page.evaluate(`player.cystT=999;`);
      await page.keyboard.press('r');
      await page.waitForTimeout(200);
      s = await snap(page);
      expect(s.cyst, 'повторное R -> cyst=false').toBe(false);
    });

    test(`[${lang}] E x4 вида: каждый даёт тост или изменение энергии/массы`, async ({ page }) => {
      await boot(page, lang);
      for (const cat of ['producer', 'consumer1', 'consumer2', 'decomposer']) {
        await page.evaluate(`(function(){var sp=SPECIES_DB.find(function(s){return s.cat==='${cat}'});
          if(sp)player.sp=sp;player.cyst=false;player.dying=false;player.alive=true;
          player.energy=30;document.getElementById('toast').textContent='';})()`);
        await page.waitForTimeout(100);
        const before = await snap(page);
        await page.click('#bEat');
        await page.waitForTimeout(700);
        const after = await snap(page);
        const eff = snapChanged(before, after) || (await toastText(page)) || Math.abs((after.energy||0)-(before.energy||0))>0.001;
        expect(!!eff, `E у ${cat}: тост или эффект`).toBe(true);
      }
    });

    test(`[${lang}] Tab (bAuto) переключает autoAI`, async ({ page }) => {
      await boot(page, lang);
      const a = await snap(page);
      await page.click('#bAuto');
      await page.waitForTimeout(200);
      const b = await snap(page);
      expect(b.autoAI, 'autoAI toggled').toBe(!a.autoAI);
      await page.click('#bAuto'); // вернуть
    });

    test(`[${lang}] меню паузы: каждая кнопка даёт эффект`, async ({ page }) => {
      await boot(page, lang);
      await page.click('#pauseBtn');
      await page.waitForTimeout(250);
      expect(await page.evaluate(`document.getElementById('pauseO').className`)).toContain('show');
      const ids = await page.evaluate(`Array.from(document.querySelectorAll('#pauseO button')).map(b=>b.id)`);
      for (const id of ids) {
        const before = await snap(page);
        await page.click('#' + id);
        await page.waitForTimeout(350);
        const after = await snap(page);
        const eff = snapChanged(before, after) || (await toastText(page));
        expect(!!eff, `pause button #${id} без эффекта`).toBe(true);
        // закрыть любой всплывший оверлей поверх паузы
        const CLOSE = { helpO: 'helpClose', setO: 'setClose', wikiO: 'wikiClose' };
        for (const ovId of (after.ovs || '').split(',')) {
          if (ovId && ovId !== 'pauseO' && ovId !== 'menuO' && CLOSE[ovId]) {
            await page.click('#' + CLOSE[ovId]).catch(() => {});
            await page.waitForTimeout(150);
          }
        }
        if (after.state === 'menu') break; // menuBtnPause — выход, цикл завершён
        if (after.state === 'playing') await page.click('#bPause');
        await page.waitForTimeout(150);
      }
    });

    test(`[${lang}] ни одной мёртвой кнопки: все видимые дают эффект или тост`, async ({ page }) => {
      await boot(page, lang);
      const btns = await visibleButtons(page);
      const dead = [];
      for (const b of btns.filter(x => !x.parked && !x.inPause)) {
        if (['bEat', 'bDiv', 'bCyst'].includes(b.id)) continue; // проверены отдельными шагами (эффект зависит от состояния)
        const before = await snap(page);
        await page.click('[id="' + b.id + '"]').catch(() => {});
        await page.waitForTimeout(300);
        const after = await snap(page);
        if (!snapChanged(before, after) && !(await toastText(page))) dead.push(b.id || b.cls);
        // откат побочных состояний
        if (after.state === 'paused' || (after.ovs || '').length) {
          await page.keyboard.press('Escape').catch(() => {});
          await page.click('#resBtn').catch(() => {});
          await page.waitForTimeout(150);
        }
      }
      expect(dead, 'мёртвые кнопки').toEqual([]);
    });
  }
});

// ---------- mobile 390x844 ----------

test.describe('HUD contract — mobile 390x844', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  for (const lang of LANGS) {
    test(`[${lang}] <=7 элементов, >=44px, actBar <=72px, без перекрытий`, async ({ page }) => {
      await boot(page, lang);
      const btns = await visibleButtons(page);
      const persistent = btns.filter(b => !b.inPause && !b.parked);
      expect(persistent.length, 'persistent: ' + persistent.map(b => b.id)).toBeLessThanOrEqual(7);
      for (const b of persistent) {
        expect(b.w, b.id + ' w').toBeGreaterThanOrEqual(44);
        expect(b.h, b.id + ' h').toBeGreaterThanOrEqual(44);
      }
      const barH = await page.evaluate(`(function(){var a=document.getElementById('actBar');if(!a)return 0;var r=a.getBoundingClientRect();return r.height;})()`);
      expect(barH, 'actBar height').toBeLessThanOrEqual(72);
      for (let i = 0; i < persistent.length; i++)
        for (let j = i + 1; j < persistent.length; j++) {
          const A = persistent[i], B = persistent[j];
          expect(A.x < B.x + B.w && B.x < A.x + A.w && A.y < B.y + B.h && B.y < A.y + A.h, `overlap ${A.id}/${B.id}`).toBe(false);
        }
    });

    test(`[${lang}] тап по #bCyst включает цисту`, async ({ page }) => {
      await boot(page, lang);
      await page.tap('#bCyst');
      await page.waitForTimeout(250);
      const s = await snap(page);
      expect(s.cyst, 'tap bCyst -> cyst').toBe(true);
    });
  }
});
