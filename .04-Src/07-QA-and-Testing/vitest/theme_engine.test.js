import { describe, it, expect, beforeEach, vi } from 'vitest';
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
