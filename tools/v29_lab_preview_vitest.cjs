const fs = require('fs');
const themes = ['classic','phase-contrast','neon-bio','glass-lab','cyberpunk-scanner','haeckel-watercolor','engraving'];
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Theme preview links — iGraSpore</title>
<style>body{font:16px/1.4 system-ui;background:#0a1220;color:#e8f4ff;margin:24px} a{color:#6cf;display:block;margin:6px 0} .t{margin:18px 0;padding:12px;border:1px solid #234;border-radius:10px} h1{font-size:22px} code{color:#9ef}</style>
</head><body>
<h1>Theme test links (local)</h1>
<p>Game stand: <code>http://127.0.0.1:8820/</code> (or :8795). Lab: this page on :8793.</p>
<p>Query: <code>?themePond=ID&amp;themeBestiary=ID&amp;lang=en</code> — opens both screens in that style after Start.</p>
${themes.map(id => `<div class="t"><b>${id}</b>
<a href="http://127.0.0.1:8820/?themePond=${id}&themeBestiary=${id}&lang=en">Web 8820 — ${id}</a>
<a href="http://127.0.0.1:8795/?themePond=${id}&themeBestiary=${id}&lang=en">Web 8795 — ${id}</a>
</div>`).join('\\n')}
<p><a href="/lab/theme-stats.html?fixture=1">theme-stats fixture</a> · <a href="/lab/tests.html">lab tests</a></p>
</body></html>`;
fs.mkdirSync('.04-Src/dist-lab/lab', { recursive: true });
fs.writeFileSync('.04-Src/dist-lab/lab/theme-preview.html', html.replace(/\\\\n/g, '\n'));
console.log('preview written');

const test = `import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const THEMES = ['classic','phase-contrast','neon-bio','glass-lab','cyberpunk-scanner','haeckel-watercolor','engraving'];
function loadScript(rel) {
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  (0, eval)(code);
}

describe('theme_engine all styles', () => {
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
    THEMES.forEach(id => {
      const j = JSON.parse(fs.readFileSync(path.join(root,'.04-Src/data/themes',id+'.json'),'utf8'));
      window.igsThemeEngine.seedCache(id, j);
    });
  });

  it('lists 7 themes', () => {
    expect(window.igsThemeEngine.listThemes()).toEqual(THEMES);
  });

  it('applies each theme to bestiary and pond independently', () => {
    window.igsThemeEngine.applyThemeBestiary('glass-lab');
    window.igsThemeEngine.applyThemePond('neon-bio');
    expect(localStorage.getItem('igs.theme.bestiary')).toBe('glass-lab');
    expect(localStorage.getItem('igs.theme.pond')).toBe('neon-bio');
    expect(document.getElementById('wikiO').getAttribute('data-theme-bestiary')).toBe('glass-lab');
    expect(document.documentElement.getAttribute('data-theme-pond')).toBe('neon-bio');
    expect(window.__igsThemePondShader).toBeTruthy();
    expect(window.__igsThemePondShader.rgbTop).toBeTruthy();
  });

  it('every theme JSON has shader rgb + fpsBudget', () => {
    THEMES.forEach(id => {
      const j = JSON.parse(fs.readFileSync(path.join(root,'.04-Src/data/themes',id+'.json'),'utf8'));
      expect(j.shader.rgbTop.length).toBe(3);
      expect(j.fpsBudget.target).toBe(30);
      expect(j.cssVars['--theme-panel']).toBeTruthy();
    });
  });

  it('unknown theme falls back to classic', () => {
    expect(window.igsThemeEngine.applyThemePond('nope')).toBe('classic');
  });
});

describe('theme_analytics', () => {
  beforeEach(() => {
    localStorage.clear();
    loadScript('.04-Src/js/theme_analytics.js');
  });
  it('buffers and opt-out', () => {
    window.igsThemeAnalytics.track('theme_change', { screen:'pond', from:'classic', to:'neon-bio' });
    expect(window.igsThemeAnalytics.readBuf().length).toBe(1);
    window.igsThemeAnalytics.setEnabled(false);
    window.igsThemeAnalytics.track('theme_change', { screen:'pond', from:'neon-bio', to:'classic' });
    expect(window.igsThemeAnalytics.readBuf().length).toBe(1);
  });
  it('client has no CF_API_TOKEN', () => {
    const src = fs.readFileSync(path.join(root,'.04-Src/js/theme_analytics.js'),'utf8');
    expect(src.includes('CF_API_TOKEN')).toBe(false);
  });
});
`;
fs.writeFileSync('.04-Src/07-QA-and-Testing/vitest/theme_engine.test.js', test);
console.log('vitest updated');
