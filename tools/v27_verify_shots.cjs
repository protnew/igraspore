// v27 приёмка: экраны HUD-цифр по системам письма (задача 3 — сдали без кадров) + листинг-файлы.
// Проверяем: bn → ১১২ (beng), dz → ༡༡༢ (tibt), bo → tibt, km → khmr, lo → laoo, or → orya (or выключен — форс).
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = 'http://127.0.0.1:8821';
const OUT = path.join(__dirname, '..', '09-Docs', 'out-dev-factory', 'shots-v27-verify');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CASES = [
  { lang: 'bn', expect: 'beng ০-৯', sample: '০১২৩৪৫৬৭৮৯' },
  { lang: 'dz', expect: 'tibt ༠-༩', sample: '༠༡༢༣༤༥༦༧༨༩' },
  { lang: 'bo', expect: 'tibt ༠-༩', sample: '༠༡༢༣༤༥༦༧༨༩' },
  { lang: 'km', expect: 'khmr ០-៩', sample: '០១២៣៤៥៦៧៨៩' },
  { lang: 'lo', expect: 'laoo ໐-໙', sample: '໐໑໒໓໔໕໖໗໘໙' },
  { lang: 'or', expect: 'orya ୦-୯', sample: '୦୧୨୩୪୫୬୭୮୯' },
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch();
  const rows = [];
  for (const c of CASES) {
    const ctx = await br.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message.slice(0, 100)));
    await p.addInitScript(l => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); }, c.lang);
    await p.goto(BASE + '/?lang=' + c.lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForSelector('#startBtn', { timeout: 20000 });
    await sleep(1200);
    await p.evaluate("document.getElementById('startBtn').click()");
    await sleep(4000);
    await p.evaluate("(function(){var ok=document.getElementById('introOk')||document.getElementById('roleCardOk');if(ok)ok.click();})()");
    await sleep(2500);
    const png = path.join(OUT, c.lang + '-375-hud.png');
    await p.screenshot({ path: png });
    const probe = await p.evaluate((sample) => {
      const hud = (document.getElementById('hud') || {}).textContent || '';
      const over = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).length;
      // есть ли в HUD хоть одна национальная цифра из системы языка
      const native = [...hud].some(ch => sample.includes(ch));
      return { hud: hud.trim().slice(0, 140), nativeDigitsInHud: native, over, state: typeof state !== 'undefined' ? state : null };
    }, c.sample).catch(e => ({ err: e.message.slice(0, 100) }));
    rows.push({ lang: c.lang, expect: c.expect, errs: errs.length, ...probe, png: path.basename(png) });
    await ctx.close();
  }
  await br.close();
  fs.writeFileSync(path.join(OUT, 'verify-probe.json'), JSON.stringify(rows, null, 1));
  for (const r of rows)
    console.log(r.lang + ' (' + r.expect + '): HUD=' + (r.hud || '').slice(0, 70).replace(/\n/g, ' ') + ' | родные цифры в HUD=' + r.nativeDigitsInHud + ' over=' + r.over + ' errs=' + r.errs + ' state=' + r.state);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
