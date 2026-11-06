#!/usr/bin/env node
// TZ-08 Stage 2: Matrix of 87 screenshots with live links
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { chromium } = require(path.resolve(__dirname, '..', 'node_modules', 'playwright'));

const BASE = process.env.BASE || 'http://127.0.0.1:8794';
const OUT = path.resolve(__dirname, '..', '.04-Src', 'shots-i18n-real');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const DESKTOP = { width: 1400, height: 900 };
const MOBILE = { width: 375, height: 812 };

const SCREENS = ['menu', 'game', 'pause', 'settings', 'wiki', 'bestiary', 'themes', 'help', 'dead', 'intro', 'burger', 'eco'];

const ANCHORS = {
  menu: '#menuLangSel',
  game: '#c',
  pause: '#pauseO',
  settings: '#setO',
  wiki: '#wikiO',
  bestiary: '#wikiO',
  themes: '#actBar',
  help: '#helpO',
  dead: '#deadO',
  intro: '#introO',
  burger: '#burgerGame',
  eco: '#ecoP',
};

const SHOTS = [];
let shotNum = 1;

function addShot(lang, screen, viewport, theme) {
  const num = String(shotNum++).padStart(2, '0');
  const vpName = viewport.width === 1400 ? 'desktop' : 'mobile';
  const themePart = theme ? `&theme=${theme}` : '';
  const url = `${BASE}/index.html?lang=${lang}${themePart}&screen=${screen}`;
  
  SHOTS.push({
    url,
    viewport,
    anchor: ANCHORS[screen],
    name: `${num}-${lang}-${vpName}-${screen}${theme ? '-' + theme : ''}`,
    label: `${lang} · ${vpName} ${viewport.width}px · ${screen}${theme ? ' · theme: ' + theme : ''}`,
    screen,
    lang,
    theme,
  });
}

['en', 'ru'].forEach(lang => {
  SCREENS.forEach(screen => {
    addShot(lang, screen, DESKTOP);
    addShot(lang, screen, MOBILE);
  });
});

['ar', 'he'].forEach(lang => {
  ['menu', 'game', 'pause', 'settings', 'wiki', 'help', 'dead', 'intro'].forEach(screen => {
    addShot(lang, screen, DESKTOP);
  });
});

['zh-CN', 'hi'].forEach(lang => {
  ['menu', 'game', 'settings', 'wiki'].forEach(screen => {
    addShot(lang, screen, DESKTOP);
  });
});

['bn', 'ta', 'th', 'ja'].forEach(lang => {
  ['menu', 'game'].forEach(screen => {
    addShot(lang, screen, DESKTOP);
  });
});

['classic', 'engraving', 'neon-bio', 'phase-contrast', 'haeckel-watercolor', 'glass-lab', 'cyberpunk-scanner'].forEach(theme => {
  addShot('en', 'game', DESKTOP, theme);
});

console.log(`Total shots planned: ${SHOTS.length}`);

async function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

(async () => {
  const br = await chromium.launch({ channel: 'chrome', headless: true });
  const manifest = [];
  let skipped = 0;
  
  for (let i = 0; i < SHOTS.length; i++) {
    const s = SHOTS[i];
    const isRTL = s.lang === 'ar' || s.lang === 'he';
    const ctx = await br.newContext({ viewport: s.viewport, locale: isRTL ? 'ar' : 'en' });
    const pg = await ctx.newPage();
    const errors = [];
    pg.on('pageerror', e => errors.push(e.message));
    
    console.log(`[${i + 1}/${SHOTS.length}] ${s.name}`);
    
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
      
      await pg.waitForTimeout(2000);
      
      const anchorSel = s.anchor;
      const anchorVisible = await pg.isVisible(anchorSel).catch(() => false);
      
      if (!anchorVisible) {
        console.log(`  WARN: anchor ${anchorSel} not visible`);
      }
      
      const title = await pg.title();
      const htmlLang = await pg.evaluate(() => document.documentElement.lang || '');
      const htmlDir = await pg.evaluate(() => document.documentElement.dir || '');
      const html = await pg.content();
      const bytes = Buffer.byteLength(html, 'utf8');
      const hash = await sha256(Buffer.from(html, 'utf8'));
      
      const fp = path.join(OUT, `${s.name}.png`);
      await pg.screenshot({ path: fp, fullPage: false });
      const pngSize = fs.statSync(fp).size;
      
      if (pngSize < 20000) {
        console.log(`  WARN: file <20 KB (${pngSize} bytes)`);
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
        screen: s.screen,
        lang: s.lang,
        theme: s.theme,
        timestamp: new Date().toISOString()
      });
      
      console.log(`  OK: ${pngSize} bytes, ${errors.length} pageerror`);
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
      manifest.push({ name: s.name, label: s.label, url: s.url, viewport: s.viewport, skipped: true, reason: e.message });
      skipped++;
    }
    
    await ctx.close();
  }
  
  await br.close();
  
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  
  const pngFiles = fs.readdirSync(OUT).filter(f => f.endsWith('.png'));
  const manifestNames = manifest.filter(m => !m.skipped).map(m => m.name + '.png');
  
  const missingInManifest = pngFiles.filter(f => !manifestNames.includes(f));
  const missingOnDisk = manifestNames.filter(f => !pngFiles.includes(f));
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Planned: ${SHOTS.length}`);
  console.log(`Captured: ${manifest.length - skipped}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`PNG files on disk: ${pngFiles.length}`);
  console.log(`Manifest entries (non-skipped): ${manifestNames.length}`);
  console.log(`1:1 correspondence: ${missingInManifest.length === 0 && missingOnDisk.length === 0 ? 'YES' : 'NO'}`);
  console.log(`\nFolder: ${OUT}`);
  console.log(`Manifest: ${path.join(OUT, 'manifest.json')}`);
})();
