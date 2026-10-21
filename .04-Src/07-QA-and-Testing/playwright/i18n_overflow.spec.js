// i18n_overflow.spec.js — TZ v9 L.9 (стр. 323): переполнение/обрезка текста
// на 390x844 (mobile) и 1280x800 по всем включённым языкам × 8 экранов.
// Снимки: 09-Docs/out-dev-factory/shots-release-ready-2026-10-14/i18n/<lang>/<vp>-<screen>.png
// Каждый видимый текстовый элемент: scrollWidth<=clientWidth+1, scrollHeight<=clientHeight+1
// (или text-overflow:ellipsis + title); пересечение кнопок=0; текст внутри viewport; __i18nMiss===0.
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8795';
const SHOTS = path.resolve(__dirname, '../../../09-Docs/out-dev-factory/shots-release-ready-2026-10-14/i18n');
const ENABLED = ['ru','en','pt-BR','id','de','fr','hi','ja','vi','ko','th','it','pl','uk','zh-TW','ms','bn'];

// ---------- аудит видимых элементов ----------

const AUDIT_JS = `(function(){
  var vw=window.innerWidth, vh=window.innerHeight;
  function vis(el){
    var r=el.getBoundingClientRect(); if(r.width===0||r.height===0) return false;
    var cs=getComputedStyle(el);
    return cs.display!=='none'&&cs.visibility!=='hidden'&&cs.opacity!=='0';
  }
  // контент внутри скроллящегося контейнера законно уходит за фолд
  function inScrollable(el){
    for(var a=el;a&&a!==document.body;a=a.parentElement){
      var cs=getComputedStyle(a);
      if((cs.overflowY==='auto'||cs.overflowY==='scroll')&&a.scrollHeight>a.clientHeight+1)return true;
    }
    return false;
  }
  // текстовые переполнения
  var overflow=[];
  Array.from(document.querySelectorAll('body *')).forEach(function(el){
    if(!vis(el)) return;
    if(el.tagName==='INPUT'||el.tagName==='SELECT'||el.tagName==='OPTION'||el.tagName==='TEXTAREA') return;
    if(inScrollable(el)) return;
    if(!el.children.length || (el.children.length===0 && el.textContent.trim())) {
      var cs=getComputedStyle(el);
      var ellip=(cs.textOverflow==='ellipsis'||cs.overflow==='hidden')&&(el.title||el.getAttribute('data-k-title'));
      var sw=el.scrollWidth-el.clientWidth, sh=el.scrollHeight-el.clientHeight;
      if((sw>1||sh>1)&&!ellip){
        var r=el.getBoundingClientRect();
        overflow.push({tag:el.tagName,id:el.id||'',cls:String(el.className).slice(0,40),txt:(el.textContent||'').trim().slice(0,40),dw:sw,dh:sh});
      }
    }
  });
  // кнопки: пересечения + выход за viewport
  var btns=Array.from(document.querySelectorAll('[role=button],button')).filter(vis);
  var overlaps=[];
  for(var i=0;i<btns.length;i++)for(var j=i+1;j<btns.length;j++){
    var a=btns[i].getBoundingClientRect(),b=btns[j].getBoundingClientRect();
    // кнопки внутри разных оверлеев не пересекаются визуально — пропуск пары, где один содержит другого родителя-оверлея
    var oa=btns[i].closest('.ov'), ob=btns[j].closest('.ov');
    if(oa!==ob) continue;
    if(a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height)
      overlaps.push((btns[i].id||btns[i].className)+' x '+(btns[j].id||btns[j].className));
  }
  var outVp=[];
  btns.concat(Array.from(document.querySelectorAll('#hud,#todWrap,#scaleW,#camM')).filter(vis)).forEach(function(el){
    if(inScrollable(el)) return;
    var r=el.getBoundingClientRect();
    if(r.x<-2||r.y<-2||r.right>vw+2||r.bottom>vh+2)
      outVp.push((el.id||el.className)+' '+[r.x|0,r.y|0,r.right|0,r.bottom|0].join(','));
  });
  return JSON.stringify({overflow:overflow.slice(0,15),overlap:overlaps.slice(0,15),outVp:outVp.slice(0,10),
    miss:(typeof window.__i18nMiss==='number')?window.__i18nMiss:-1});
})()`;

const audit = (page) => page.evaluate(AUDIT_JS).then(JSON.parse);

async function shot(page, lang, vp, screen) {
  const dir = path.join(SHOTS, lang);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${vp}-${screen}.png`) });
}

async function waitPlaying(page) {
  await page.waitForFunction(() => window.state === 'playing' && window.player && player.alive, undefined, { timeout: 30000 });
}

// ---------- переходы по экранам ----------

let CUR_LANG = 'ru';

async function screenMenu(page) {
  await page.goto(BASE + '/?lang=' + CUR_LANG + '&t=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.removeItem('igs_lang'));
  await page.waitForSelector('#menuO.ov.show, #startBtn', { timeout: 20000 });
  await page.waitForTimeout(1200);
}

async function screenTutorial(page) {
  await page.evaluate(() => localStorage.removeItem('igraspore_tut_v2'));
  await page.goto(BASE + '/?lang=' + CUR_LANG + '&t=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#startBtn', { timeout: 20000 });
  await page.click('#startBtn');
  await page.waitForTimeout(2000);
  await page.locator('#tutorialCard').waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
}

async function screenGame(page) {
  const rc = page.locator('#roleCardOk');
  try {
    await rc.waitFor({ state: 'visible', timeout: 8000 });
    await rc.click();
  } catch (e) { /* карточка уже закрыта таймером */ }
  const skip = page.locator('#tutSkip');
  try {
    await skip.waitFor({ state: 'visible', timeout: 5000 });
    await skip.click();
  } catch (e) { /* туториал не показан */ }
  await waitPlaying(page);
  await page.waitForTimeout(800);
}

async function screenPause(page) {
  await page.click('#bPause');
  await page.waitForTimeout(400);
}

async function screenSettings(page) {
  await page.click('#pSet');
  await page.waitForSelector('#setO.ov.show', { timeout: 5000 });
  await page.waitForTimeout(300);
}

async function screenWikiList(page) {
  await page.click('#setClose').catch(() => {});
  await page.waitForTimeout(200);
  await page.click('#pWiki');
  // ленивая загрузка вики-пакета + рендер списка
  await page.waitForSelector('#wikiO.ov.show', { timeout: 5000 });
  await page.waitForSelector('#wikiContent .wiki-entry', { timeout: 15000 });
  await page.waitForTimeout(400);
}

async function screenWikiArticle(page) {
  // Вики — один скроллируемый список, отдельного экрана статьи нет (F1).
  // «Статью» снимаем фильтром #wikiSearch: печатаем имя первой записи →
  // остаётся одна карточка с полным телом (artBlock, факты, органоиды).
  const name = ((await page.locator('#wikiContent .wiki-entry b').first().textContent().catch(() => '')) || '').trim();
  const box = page.locator('#wikiSearch');
  if (name) { await box.fill(name); await box.dispatchEvent('input'); }
  await page.waitForTimeout(900);
  await page.evaluate(() => { const c = document.getElementById('wikiContent'); if (c) c.scrollTop = 0; const o = document.getElementById('wikiO'); if (o) o.scrollTop = 0; });
  await page.waitForTimeout(200);
}

async function screenGameOver(page) {
  await page.click('#wikiClose').catch(() => {});
  await page.click('#resBtn').catch(() => {});
  await page.waitForTimeout(300);
  await page.evaluate(`(function(){
    if(window.player){player.alive=false;player.energy=0;}
    if(typeof state!=='undefined') state='gameover';
  })()`);
  await page.waitForSelector('#deadO.ov.show, #deadScreen', { timeout: 10000 });
  await page.waitForTimeout(500);
}

const SCREENS = [
  ['menu', screenMenu],
  ['tutorial', screenTutorial],
  ['game', screenGame],
  ['pause', screenPause],
  ['settings', screenSettings],
  ['wiki-list', screenWikiList],
  ['wiki-article', screenWikiArticle],
  ['gameover', screenGameOver],
];

// ---------- матрица ----------

async function walk(page, lang, problems) {
  for (const [name, fn] of SCREENS) {
    await fn(page).catch(e => problems.push(`${name}:nav:${e.message.slice(0, 80)}`));
    await shot(page, lang, '390', name);
    const a = await audit(page);
    if (a.overflow.length) problems.push(`${name}:overflow:${a.overflow.map(o => o.id || o.cls || o.txt).join('|')}`);
    if (a.overlap.length) problems.push(`${name}:overlap:${a.overlap.join('|')}`);
    if (a.outVp.length) problems.push(`${name}:outVp:${a.outVp.join('|')}`);
    if (a.miss > 0) problems.push(`${name}:i18nMiss=${a.miss}`);
  }
}

for (const lang of ENABLED) {
  test.describe(`${lang}`, () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

    test(`[${lang}] 390x844: 8 экранов без переполнений`, async ({ page }) => {
      CUR_LANG = lang;
      const problems = [];
      for (const [name, fn] of SCREENS) {
        await fn(page).catch(e => problems.push(`${name}:nav:${e.message.slice(0, 80)}`));
        await shot(page, lang, '390', name);
        const a = await audit(page);
        if (a.overflow.length) problems.push(`${name}:overflow:${a.overflow.map(o => o.id || o.cls || o.txt).join('|')}`);
        if (a.overlap.length) problems.push(`${name}:overlap:${a.overlap.join('|')}`);
        if (a.outVp.length) problems.push(`${name}:outVp:${a.outVp.join('|')}`);
        if (a.miss > 0) problems.push(`${name}:i18nMiss=${a.miss}`);
      }
      expect(problems, lang + ' problems').toEqual([]);
    });

    test(`[${lang}] 1280x800: 8 экранов без переполнений`, async ({ page }) => {
      CUR_LANG = lang;
      await page.setViewportSize({ width: 1280, height: 800 });
      const problems = [];
      for (const [name, fn] of SCREENS) {
        await fn(page).catch(e => problems.push(`${name}:nav:${e.message.slice(0, 80)}`));
        await shot(page, lang, '1280', name);
        const a = await audit(page);
        if (a.overflow.length) problems.push(`${name}:overflow:${a.overflow.map(o => o.id || o.cls || o.txt).join('|')}`);
        if (a.overlap.length) problems.push(`${name}:overlap:${a.overlap.join('|')}`);
        if (a.outVp.length) problems.push(`${name}:outVp:${a.outVp.join('|')}`);
        if (a.miss > 0) problems.push(`${name}:i18nMiss=${a.miss}`);
      }
      expect(problems, lang + ' problems').toEqual([]);
    });
  });
}

// ---------- U27: es/tr/fil сняты принудительным языком (не включены в LANGS) ----------
// window.__igsForceLang seed (igs_force_lang/igs_lang) -> boot добавляет язык в
// IGS_ENABLED только для этой QA-сессии; languages.json/LANGS/localeConfig не меняются.
const FORCED = ['es', 'tr', 'fil'];
for (const lang of FORCED) {
  test.describe(`${lang} (forced)`, () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

    test(`[${lang}] forced 390x844: 8 экранов без переполнений`, async ({ page }) => {
      await page.addInitScript((l) => {
        localStorage.setItem('igs_force_lang', l);
        localStorage.setItem('igs_lang', l);
      }, lang);
      CUR_LANG = lang;
      const problems = [];
      await walk(page, lang, problems);
      expect(problems, lang + ' forced problems').toEqual([]);
    });
  });
}
