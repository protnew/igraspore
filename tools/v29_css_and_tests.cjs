const fs = require('fs');
const path = require('path');

let css = fs.readFileSync('style.css', 'utf8');
const marker = '/* v29 theme engine */';
const i = css.indexOf(marker);
if (i >= 0) {
  const theme = css.slice(i);
  css = css.slice(0, i).replace(/\s+$/, '') + '\n';
  fs.writeFileSync('style.css', css);
  fs.writeFileSync('style-themes-v29.css', theme);
  console.log('style', css.split(/\n/).length, 'themes', theme.split(/\n/).length);
} else if (!fs.existsSync('style-themes-v29.css')) {
  fs.writeFileSync('style-themes-v29.css', [
    '/* v29 theme engine */',
    'html[data-theme-pond="neon-bio"], body[data-theme-pond="neon-bio"] { background:#000 !important; }',
    'html[data-theme-pond="phase-contrast"], body[data-theme-pond="phase-contrast"] { background:#081214 !important; }',
    '#wikiO[data-theme-bestiary] { background: var(--theme-panel, rgba(0,12,28,.92)); color: var(--theme-text,#fff); border-color: var(--theme-border,#1a3a55); }',
    '#wikiO[data-theme-bestiary="neon-bio"] .wiki-entry { border:1px solid #00ffff55; box-shadow:0 0 8px #ff00aa33; }',
    '#wikiO[data-theme-bestiary="phase-contrast"] .wiki-entry { border:1px solid #7fb2b255; font-family: Georgia, serif; }',
    '#wikiO[data-theme-bestiary="neon-bio"] .tt { color:#00ffff; text-shadow:0 0 8px #ff00aa88; }',
    '#themePondBar, #themeBestiaryBar, .theme-set-row select { min-height:48px; }',
    '.theme-sel-wrap select { min-height:48px; min-width:48px; }',
    ''
  ].join('\n'));
  console.log('wrote themes css fallback');
}

let idx = fs.readFileSync('index.html', 'utf8');
if (!idx.includes('style-themes-v29.css')) {
  if (idx.includes('href="style.css"')) {
    idx = idx.replace('href="style.css"', 'href="style.css"\n<link rel="stylesheet" href="style-themes-v29.css?v=1793720001">');
  } else {
    idx = idx.replace('</head>', '<link rel="stylesheet" href="style-themes-v29.css?v=1793720001">\n</head>');
  }
  fs.writeFileSync('index.html', idx);
}
console.log('css link', fs.readFileSync('index.html','utf8').includes('style-themes-v29.css'));

const test = `import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
function loadScript(rel) {
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  (0, eval)(code);
}

describe('theme_engine wave1', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<div id="wikiO" class="ov"><div class="tt">Wiki</div><div id="wikiContent"></div></div><div id="topRightStack"></div><div id="setBody"></div>';
    global.fetch = vi.fn(async (url) => {
      const id = String(url).split('/').pop().replace('.json','');
      const p = path.join(root, '.04-Src/data/themes', id + '.json');
      const j = JSON.parse(fs.readFileSync(p, 'utf8'));
      return { json: async () => j };
    });
    loadScript('.04-Src/js/theme_analytics.js');
    loadScript('.04-Src/js/theme_engine.js');
    ['classic','neon-bio','phase-contrast'].forEach(id => {
      const j = JSON.parse(fs.readFileSync(path.join(root,'.04-Src/data/themes',id+'.json'),'utf8'));
      window.igsThemeEngine.seedCache(id, j);
    });
  });

  it('lists 3 wave1 themes', () => {
    expect(window.igsThemeEngine.listThemes()).toEqual(['classic','neon-bio','phase-contrast']);
  });

  it('applies independent bestiary and pond themes', () => {
    window.igsThemeEngine.applyThemeBestiary('neon-bio');
    window.igsThemeEngine.applyThemePond('phase-contrast');
    expect(localStorage.getItem('igs.theme.bestiary')).toBe('neon-bio');
    expect(localStorage.getItem('igs.theme.pond')).toBe('phase-contrast');
    expect(document.getElementById('wikiO').getAttribute('data-theme-bestiary')).toBe('neon-bio');
    expect(document.documentElement.getAttribute('data-theme-pond')).toBe('phase-contrast');
  });

  it('A/B assign writes theme_assign when empty', () => {
    window.igsThemeAnalytics.clear();
    localStorage.removeItem('igs.theme.bestiary');
    localStorage.removeItem('igs.theme.ab.bestiary');
    const th = window.igsThemeEngine.currentBestiary();
    expect(['classic','neon-bio','phase-contrast']).toContain(th);
    const buf = window.igsThemeAnalytics.readBuf();
    expect(buf.some(e => e.event === 'theme_assign' && e.screen === 'bestiary')).toBe(true);
  });
});

describe('theme_analytics', () => {
  beforeEach(() => {
    localStorage.clear();
    loadScript('.04-Src/js/theme_analytics.js');
  });

  it('buffers events and respects opt-out', () => {
    window.igsThemeAnalytics.track('theme_change', { screen:'pond', from:'classic', to:'neon-bio' });
    expect(window.igsThemeAnalytics.readBuf().length).toBe(1);
    window.igsThemeAnalytics.setEnabled(false);
    window.igsThemeAnalytics.track('theme_change', { screen:'pond', from:'neon-bio', to:'classic' });
    expect(window.igsThemeAnalytics.readBuf().length).toBe(1);
  });

  it('flush without endpoint stays local', () => {
    window.IGS_THEME_ANALYTICS_URL = '';
    window.igsThemeAnalytics.track('session_len', { ms: 1000 });
    const r = window.igsThemeAnalytics.flush();
    expect(r.local === true || r.sent === 0).toBe(true);
  });

  it('client has no CF_API_TOKEN', () => {
    const src = fs.readFileSync(path.join(root,'.04-Src/js/theme_analytics.js'),'utf8');
    expect(src.includes('CF_API_TOKEN')).toBe(false);
  });
});
`;
fs.writeFileSync('.04-Src/07-QA-and-Testing/vitest/theme_engine.test.js', test);
console.log('vitest written');
