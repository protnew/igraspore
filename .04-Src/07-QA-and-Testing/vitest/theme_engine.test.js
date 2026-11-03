import { describe, it, expect, beforeEach, vi } from 'vitest';
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
