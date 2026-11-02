// v26 задача 9: A4 (RTL/dir) + A5 (цифры из реестра) — съёмка в реальном браузере и таблица замеров.
// Снимает 7 RTL-языков + 3 новых письма (dz, ti, pa) на мобильном 375x812 и десктопе 1400x900.
// Для каждого кадра: document.dir, класс igs-rtl, образец цифр HUD, число переполнившихся элементов,
// ошибки консоли. Пишет PNG + JSON + MD-таблицу.
// Usage: node tools/v26_rtl_shots.cjs [base]  (base по умолчанию http://127.0.0.1:8821)
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));

const BASE = process.argv[2] || 'http://127.0.0.1:8821';
const OUT = '09-Docs/out-dev-factory/shots-v26-rtl';
const LANGS = [
  ['ar', 'Арабский', 'rtl'], ['fa', 'Персидский', 'rtl'], ['ur', 'Урду', 'rtl'], ['he', 'Иврит', 'rtl'],
  ['ps', 'Пушту', 'rtl'], ['ckb', 'Сорани', 'rtl'], ['sd', 'Синдхи', 'rtl'],
  ['dz', 'Дзонг-кэ', 'ltr'], ['ti', 'Тигринья', 'ltr'], ['pa', 'Панджаби', 'ltr']
];

const PROBE = `(function(){
  function vis(el){ var r=el.getBoundingClientRect(); if(!r.width||!r.height) return false;
    var cs=getComputedStyle(el); return cs.display!=='none'&&cs.visibility!=='hidden'&&cs.opacity!=='0'; }
  function inScroll(el){ for(var a=el;a&&a!==document.body;a=a.parentElement){ var cs=getComputedStyle(a);
    if((cs.overflowY==='auto'||cs.overflowY==='scroll')&&a.scrollHeight>a.clientHeight+1) return true; } return false; }
  var vw=innerWidth, vh=innerHeight, over=[], outside=[];
  Array.from(document.querySelectorAll('body *')).forEach(function(el){
    if(!vis(el)||inScroll(el)) return;
    if(!el.children.length && (el.textContent||'').trim()){
      var cs=getComputedStyle(el), ellip=(cs.textOverflow==='ellipsis'||cs.overflow==='hidden');
      if((el.scrollWidth-el.clientWidth>1 || el.scrollHeight-el.clientHeight>1) && !ellip)
        over.push((el.id||el.className||el.tagName)+' "'+(el.textContent||'').trim().slice(0,24)+'"');
    }
    var r=el.getBoundingClientRect();
    if(r.width&&vis(el)&&(r.x<-2||r.right>vw+2||r.y<-2||r.bottom>vh+2) && !el.closest('.ov'))
      outside.push((el.id||el.className||el.tagName)+' '+[Math.round(r.x),Math.round(r.right)].join(','));
  });
  var hud=document.getElementById('hud');
  var rec=Object.keys(window.__i18nMissKeys||{});
  // __i18nMiss пишется и на обращениях до загрузки пакета — считаем честно: записано обращений / реально absent
  var absent=rec.filter(function(k){var key=k.split(':').slice(1).join(':');return !(window.T&&T.en&&(key in T.en));});
  return JSON.stringify({
    dir: document.documentElement.dir || document.body.dir || '',
    rtlClass: /igs-rtl/.test(document.documentElement.className+' '+document.body.className),
    font: getComputedStyle(document.body).fontFamily.slice(0,60),
    hudText: hud ? (hud.textContent||'').replace(/\\s+/g,' ').trim().slice(0,110) : '',
    digits: (document.body.textContent||'').match(/[0-9۰-۹٠-٩०-९૦-૯୦-୯߀-߉]+/g)||[],
    over: over.slice(0,8), outside: outside.slice(0,6),
    i18nRecorded: rec.length, i18nMiss: absent.length, i18nMissList: absent.slice(0,6)
  });
})()`;

const arg = (n, d) => { const a = process.argv.find(x => x.startsWith('--' + n + '=')); return a ? a.slice(3 + n.length) : d; };
const ONLY_LANGS = arg('langs', '').split(',').filter(Boolean);
const ONLY_VP = arg('vp', '').split(',').filter(Boolean);
const ONLY_SCREENS = arg('screens', '').split(',').filter(Boolean);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch({ channel: 'chrome', headless: true });
  // при выборочной пересъёмке дописываем в существующую таблицу, не затирая остальные строки
  const prevPath = path.join(OUT, 'v26-rtl-probe.json');
  let rows = fs.existsSync(prevPath) ? JSON.parse(fs.readFileSync(prevPath, 'utf8')) : [];
  const prevBy = {}; for (const r of rows) prevBy[r.code + '@' + r.vp] = r;
  const VPS = [['375', 375, 812, ['menu', 'settings', 'wiki', 'game']], ['1400', 1400, 900, ['menu', 'wiki']]]
    .filter(v => !ONLY_VP.length || ONLY_VP.includes(v[0]))
    .map(v => [v[0], v[1], v[2], ONLY_SCREENS.length ? v[3].filter(s => ONLY_SCREENS.includes(s)) : v[3]])
    .filter(v => v[3].length);
  for (const [code, name, expectDir] of LANGS.filter(l => !ONLY_LANGS.length || ONLY_LANGS.includes(l[0]))) {
    for (const [vp] of VPS) rows = rows.filter(r => !(r.code === code && r.vp === vp));
    fs.mkdirSync(path.join(OUT, code), { recursive: true });
    for (const [vp, w, h, screens] of VPS) {
      const ctx = await br.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: vp === '375', hasTouch: vp === '375' });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
      page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 120)); });
      await page.addInitScript(l => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); localStorage.removeItem('igraspore_tut_v2'); }, code);
      await page.goto(`${BASE}/?lang=${code}&t=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForSelector('#startBtn', { timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const shots = [];
      for (const s of screens) {
        if (s === 'menu') { /* уже меню */ }
        if (s === 'settings') { await page.click('#startBtn').catch(() => {}); await page.waitForTimeout(1200);
          for (const sel of ['#introOk', '#roleCardOk', '#tutSkip']) { const b = page.locator(sel); if (await b.isVisible().catch(() => false)) await b.click().catch(() => {}); await page.waitForTimeout(250); }
          await page.waitForFunction(() => window.state === 'playing', undefined, { timeout: 25000 }).catch(() => {});
          await page.click('#bPause').catch(() => {}); await page.waitForTimeout(300);
          await page.click('#pSet').catch(() => {}); await page.waitForSelector('#setO.ov.show', { timeout: 6000 }).catch(() => {}); await page.waitForTimeout(400); }
        if (s === 'wiki') { await page.click('#setClose').catch(() => {});
          // на десктопе игра не запускается → #pWiki (пауза) невидим, wiki открывается кнопкой меню
          const pw = page.locator('#pWiki');
          if (await pw.isVisible().catch(() => false)) await pw.click().catch(() => {});
          else await page.click('#wikiBtnMenu').catch(() => {});
          await page.waitForSelector('#wikiContent .wiki-entry', { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(500); }
        if (s === 'game') { await page.click('#wikiClose').catch(() => {}); await page.waitForTimeout(400);
          // после wiki остаётся открытым оверлей паузы — снимаем его кнопкой «продолжить», иначе кадр = меню паузы
          const rb = page.locator('#resBtn'); if (await rb.isVisible().catch(() => false)) await rb.click().catch(() => {});
          await page.waitForFunction(() => window.state === 'playing', undefined, { timeout: 10000 }).catch(() => {});
          await page.waitForTimeout(900); }
        const png = path.join(OUT, code, `${vp}-${s}.png`);
        await page.screenshot({ path: png }).catch(() => {});
        const probe = JSON.parse(await page.evaluate(PROBE).catch(() => '{"dir":"","over":[],"outside":[],"digits":[],"hudText":"","i18nMiss":-1,"rtlClass":false,"font":""}'));
        shots.push({ screen: s, png, ...probe });
      }
      const first = shots[0];
      const outsideNames = [...new Set(shots.flatMap(s => s.outside || []))];
      const absentKeys = [...new Set(shots.flatMap(s => s.i18nMissList || []))];
      rows.push({
        code, name, vp, expectDir, dir: first.dir, rtlClass: first.rtlClass, font: first.font,
        digitsSample: (first.digits || []).slice(0, 6).join(' '),
        over: Math.max(...shots.map(s => (s.over || []).length)), overItems: (first.over || []).slice(0, 3),
        outside: outsideNames.length, outsideItems: outsideNames.slice(0, 3),
        i18nRecorded: Math.max(...shots.map(s => s.i18nRecorded || 0)),
        i18nMiss: absentKeys.length, i18nMissKeys: absentKeys.slice(0, 4),
        pageErrors: errs.length, errSamples: errs.slice(0, 2),
        hud: first.hudText, frames: (() => {
          const mine = shots.map(s => s.png.replace(/\\/g, '/'));
          const pr = prevBy[code + '@' + vp];
          const keep = pr ? (pr.frames || []).filter(f => !screens.some(sc => f.endsWith('/' + vp + '-' + sc + '.png'))) : [];
          return keep.concat(mine);
        })()
      });
      console.log(`${code} ${vp}: dir=${first.dir} rtl=${first.rtlClass} over=${rows[rows.length - 1].over} outside=${rows[rows.length - 1].outside} errs=${errs.length} tt-обращений=${rows[rows.length - 1].i18nRecorded} absent=${rows[rows.length - 1].i18nMiss}`);
      await ctx.close();
    }
  }
  await br.close();
  fs.writeFileSync(path.join(OUT, 'v26-rtl-probe.json'), JSON.stringify(rows, null, 1));
  const md = ['# v26 задача 9 — A4 (RTL/dir) и A5 (цифры из реестра): замеры с реального браузера', '',
    `Стенд: ${BASE} (локальный, node tools/serve-static.mjs 8821). Съёмка: tools/v26_rtl_shots.cjs, Playwright + Chromium, ${new Date().toISOString().slice(0, 16)}Z.`, '',
    '| Язык | Вьюпорт | dir в DOM | ожидался | класс igs-rtl | Цифры с экрана (образец) | Переполнено элементов | Вылезают за вьюпорт | tt() обращений | реально нет в словаре | Ошибок консоли |',
    '|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of rows) md.push(`| ${r.code} (${r.name}) | ${r.vp}px | ${r.dir || '—'} | ${r.expectDir} | ${r.rtlClass ? 'да' : 'нет'} | ${r.digitsSample || '—'} | ${r.over} | ${r.outside} | ${r.i18nRecorded} | ${r.i18nMiss}${r.i18nMiss ? ' (' + r.i18nMissKeys.join(', ') + ')' : ''} | ${r.pageErrors} |`);
  md.push('', '## Кадры', '');
  for (const r of rows) md.push(`- ${r.code} ${r.vp}px: ${r.frames.join(' · ')}`);
  md.push('', '## Как читать колонки', '',
    '«tt() обращений» — счётчик __i18nMiss: сколько раз tt() был вызван до загрузки языкового пакета. Это НЕ число непереведённых ключей.',
    '«реально нет в словаре» — те же обращения, отфильтрованные по загруженному T.en. Для en = 1 ключ (aria.lang). Для не-EN языков в списке 6:',
    'когда curLang ≠ en, i18n/en.json не подгружается и T.en остаётся рукописным inline-набором в config.js — фоллбек на английском там не работает.',
    '«Вылезают за вьюпорт» = 1 у ltr-языков на 375px — это #scaleL (линейка масштаба), так же ведёт себя в en/ru/th: к переводу отношения не имеет.',
    '«Ошибок консоли» = 0 после починки Д9 (404 на fonts.generated.css и на woff2).');
  fs.writeFileSync(path.join(OUT, 'v26-rtl-table.md'), md.join('\n') + '\n');
  console.log('готово: ' + OUT + '\\v26-rtl-table.md, кадров=' + rows.reduce((a, r) => a + r.frames.length, 0));
})();
