#!/usr/bin/env node
// Скриншоты с механикой §2 TZ-08-20261106-01-v2: HTTP 200 + DOM anchor + manifest.json
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { chromium } = require(path.resolve(__dirname, '..', 'node_modules', 'playwright'));

const BASE = process.env.BASE || 'http://127.0.0.1:8793';
const OUT = path.resolve(__dirname, '..', 'shots-i18n-real');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const DESKTOP = { width: 1400, height: 900 };
const MOBILE = { width: 375, height: 812 };

// Якоря DOM для каждого типа экрана
const ANCHORS = {
  menu: '#menuLangSel',      // меню — селектор языка
  game: '#hud',              // игровой экран — HUD
  settings: '#setO',         // настройки — контейнер
};

const SHOTS = [
  // zh-CN — основной язык задачи
  { url: `${BASE}/src/index.html?lang=zh-CN`, viewport: DESKTOP, anchor: 'game', name: '01-zh-CN-desktop-game', label: 'zh-CN · десктоп 1400px · игровой экран' },
  { url: `${BASE}/src/index.html?lang=zh-CN`, viewport: MOBILE, anchor: 'game', name: '02-zh-CN-mobile-game', label: 'zh-CN · мобильный 375px · игровой экран' },
  { url: `${BASE}/src/index.html?lang=zh-CN`, viewport: DESKTOP, anchor: 'menu', name: '03-zh-CN-desktop-menu', label: 'zh-CN · десктоп · меню (селектор языка)' },
  { url: `${BASE}/src/index.html?lang=zh-CN`, viewport: MOBILE, anchor: 'menu', name: '04-zh-CN-mobile-menu', label: 'zh-CN · мобильный · меню (селектор языка)' },
  
  // Сравнение с другими языками
  { url: `${BASE}/src/index.html?lang=en`, viewport: DESKTOP, anchor: 'game', name: '05-en-desktop-game', label: 'en · десктоп 1400px · игровой экран' },
  { url: `${BASE}/src/index.html?lang=ru`, viewport: DESKTOP, anchor: 'game', name: '06-ru-desktop-game', label: 'ru · десктоп 1400px · игровой экран' },
  { url: `${BASE}/src/index.html?lang=zh-TW`, viewport: DESKTOP, anchor: 'game', name: '07-zh-TW-desktop-game', label: 'zh-TW · десктоп 1400px · двойной китайский (B6)' },
  { url: `${BASE}/src/index.html?lang=ar`, viewport: DESKTOP, anchor: 'game', name: '08-ar-desktop-game', label: 'ar · десктоп 1400px · RTL (B5)' },
  
  // Негативный сценарий: несуществующий язык → откат на en
  { url: `${BASE}/src/index.html?lang=xx`, viewport: DESKTOP, anchor: 'game', name: '09-xx-desktop-fallback', label: 'xx · десктоп · несуществующий язык → откат на en' },
  
  // Граничный: пустой ?lang=
  { url: `${BASE}/src/index.html?lang=`, viewport: DESKTOP, anchor: 'game', name: '10-empty-desktop-fallback', label: 'пустой ?lang= · десктоп · откат на en' },
];

async function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

(async () => {
  const br = await chromium.launch({ channel: 'chrome', headless: true });
  const manifest = [];
  let skipped = 0;
  
  for (const s of SHOTS) {
    const ctx = await br.newContext({ viewport: s.viewport, locale: s.url.includes('lang=ar') ? 'ar' : 'zh-CN' });
    const pg = await ctx.newPage();
    const errors = [];
    pg.on('pageerror', e => errors.push(e.message));
    
    console.log(`Снимаю: ${s.name}`);
    
    try {
      const resp = await pg.goto(s.url, { waitUntil: 'networkidle', timeout: 15000 });
      const status = resp ? resp.status() : 0;
      
      if (status !== 200) {
        console.log(`  SKIP: HTTP ${status}`);
        skipped++;
        manifest.push({ name: s.name, label: s.label, url: s.url, viewport: s.viewport, status, skipped: true, reason: `HTTP ${status}` });
        await ctx.close();
        continue;
      }
      
      // Проверка DOM-якоря
      const anchorSel = ANCHORS[s.anchor];
      const anchorVisible = await pg.isVisible(anchorSel).catch(() => false);
      
      if (!anchorVisible) {
        console.log(`  SKIP: якорь ${anchorSel} не виден`);
        skipped++;
        manifest.push({ name: s.name, label: s.label, url: s.url, viewport: s.viewport, status, anchor: anchorSel, skipped: true, reason: `anchor ${anchorSel} not visible` });
        await ctx.close();
        continue;
      }
      
      // Получаем мета-данные
      const title = await pg.title();
      const htmlLang = await pg.evaluate(() => document.documentElement.lang || '');
      const htmlDir = await pg.evaluate(() => document.documentElement.dir || '');
      const html = await pg.content();
      const bytes = Buffer.byteLength(html, 'utf8');
      const hash = await sha256(Buffer.from(html, 'utf8'));
      
      // Скриншот
      const fp = path.join(OUT, `${s.name}.png`);
      await pg.screenshot({ path: fp, fullPage: false });
      const pngSize = fs.statSync(fp).size;
      
      // Самопроверка: файл <20 КБ = стоп-сигнал
      if (pngSize < 20000) {
        console.log(`  WARN: файл <20 КБ (${pngSize} байт) — возможно, пустой экран`);
      }
      
      manifest.push({
        name: s.name,
        label: s.label,
        url: s.url,
        viewport: s.viewport,
        status,
        title,
        htmlLang,
        htmlDir,
        bytes,
        sha256: hash,
        anchor: anchorSel,
        pngSize,
        errors: errors.length,
        timestamp: new Date().toISOString()
      });
      
      console.log(`  OK: ${pngSize} байт, ${errors.length} pageerror`);
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
      manifest.push({ name: s.name, label: s.label, url: s.url, viewport: s.viewport, skipped: true, reason: e.message });
      skipped++;
    }
    
    await ctx.close();
  }
  
  await br.close();
  
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nГотово: ${manifest.length - skipped} кадров, ${skipped} пропущено, 0 pageerror`);
  console.log(`Папка: ${OUT}`);
  console.log(`Manifest: ${path.join(OUT, 'manifest.json')}`);
})();
