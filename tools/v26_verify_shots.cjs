// v26 приёмка: независимая проверка кадров — тот же стенд, те же языки/экраны,
// снимает свои PNG и вытаскивает якоря из DOM (dir, menuSub, wiki-текст, HUD, ошибки консоли).
// Usage: node tools/v26_verify_shots.cjs
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = 'http://127.0.0.1:8821';
const OUT = path.join(__dirname, '..', '09-Docs', 'out-dev-factory', 'shots-v26-verify');
const PROBE = path.join(OUT, 'verify-probe.json');
// 12 кадров: 6 моб (375×812) + 6 десктоп (1400×900), микс языков/экранов
const SHOTS = [
  { lang: 'ar', screen: 'menu',    w: 375,  h: 812 },
  { lang: 'ar', screen: 'wiki',    w: 375,  h: 812 },
  { lang: 'fa', screen: 'settings',w: 375,  h: 812 },
  { lang: 'he', screen: 'game',    w: 375,  h: 812 },
  { lang: 'dz', screen: 'wiki',    w: 375,  h: 812 },
  { lang: 'ti', screen: 'game',    w: 375,  h: 812 },
  { lang: 'pa', screen: 'menu',    w: 375,  h: 812 },
  { lang: 'ar', screen: 'wiki',    w: 1400, h: 900 },
  { lang: 'he', screen: 'menu',    w: 1400, h: 900 },
  { lang: 'ur', screen: 'menu',    w: 1400, h: 900 },
  { lang: 'sd', screen: 'wiki',    w: 1400, h: 900 },
  { lang: 'dz', screen: 'game',    w: 1400, h: 900 },
];
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const s of SHOTS) {
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
    // тот же QA-путь форсирования языка, что у исполнителя (v26_rtl_shots.cjs:74): обходит фильтр включённых
    await p.addInitScript(l => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); }, s.lang);
    await p.goto(BASE + '/?lang=' + s.lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForSelector('#startBtn', { timeout: 20000 });
    await sleep(1400); // пакет языка грузится асинхронно
    let open = null;
    if (s.screen === 'wiki') {
      open = async () => { await p.evaluate("document.getElementById('wikiBtnMenu').click()"); await sleep(1500); };
    } else if (s.screen === 'settings') {
      open = async () => { await p.evaluate("document.getElementById('startBtn').click()"); await sleep(900);
        await p.evaluate("(function(){var b=document.getElementById('setBtn2')||document.getElementById('setBtn');if(b)b.click();})()"); await sleep(1500); };
    } else if (s.screen === 'game') {
      open = async () => {
        await p.evaluate("document.getElementById('startBtn').click()");
        await sleep(4000); // интро-карточка + старт
        await p.evaluate("(function(){var ok=document.getElementById('introOk')||document.getElementById('roleCardOk');if(ok)ok.click();})()");
        await sleep(2500);
      };
    } else open = async () => {};
    await open();
    const name = s.lang + '-' + s.w + '-' + s.screen + '.png';
    await p.screenshot({ path: path.join(OUT, name) });
    const dom = await p.evaluate(() => {
      const t = el => el ? (el.textContent || '').trim().slice(0, 160) : null;
      const dir = document.documentElement.getAttribute('dir');
      const rtlClass = document.body.classList.contains('igs-rtl');
      const over = [...document.querySelectorAll('body *')].filter(e => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
      }).length;
      return {
        dir, rtlClass, over,
        menuSub: t(document.getElementById('menuSub')),
        hud: t(document.getElementById('hud')),
        wikiTitle: t(document.getElementById('wikiT')),
        introO: (document.getElementById('introO') || {}).className,
        state: typeof state !== 'undefined' ? state : null,
        htmlLang: document.documentElement.lang,
      };
    }).catch(e => ({ err: e.message.slice(0, 100) }));
    results.push({ ...s, file: name, errs: errs.length, errsSample: errs.slice(0, 2), ...dom });
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(PROBE, JSON.stringify(results, null, 1));
  for (const r of results)
    console.log(r.file + ' | dir=' + r.dir + ' igs-rtl=' + r.rtlClass + ' over=' + r.over + ' errs=' + r.errs + ' | menuSub=' + (r.menuSub || '—').slice(0, 60) + (r.wikiTitle ? ' | wiki=' + r.wikiTitle.slice(0, 30) : '') + (r.hud ? ' | hud=' + r.hud.slice(0, 40) : ''));
  console.log('PROBE: ' + PROBE);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
