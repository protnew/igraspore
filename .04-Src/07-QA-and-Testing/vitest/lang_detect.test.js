import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { detectLang } = require('../../js/i18n_detect.js');

const on = ['en', 'ru', 'pt-BR', 'es', 'hi', 'id', 'tr', 'de', 'fr', 'ja', 'zh-TW', 'fil'];
const cases = [
  [[], 'en'],
  [[''], 'en'],
  [['en-US'], 'en'],
  [['ru-RU', 'en'], 'ru'],
  [['de-DE'], 'de'],
  [['fr'], 'fr'],
  [['ja-JP'], 'ja'],
  [['hi-IN'], 'hi'],
  [['tr-TR'], 'tr'],
  [['id-ID'], 'id'],
  [['in'], 'id'],
  [['tl'], 'fil'],
  [['pt-BR'], 'pt-BR'],
  [['pt-PT'], 'pt-BR'],
  [['es-MX'], 'es'],
  [['es-419'], 'es'],
  [['zh-TW'], 'zh-TW'],
  [['zh-HK'], 'zh-TW'],
  [['zh-Hant-TW'], 'zh-TW'],
  [['zh-CN'], 'en'],
  [['zh-Hans'], 'en'],
  [['zh'], 'en'],
  [['ar', 'ru'], 'ru'],
  [['xx', 'fr'], 'fr'],
  [['pt-BR', 'ja'], 'pt-BR'],
];

describe('detectLang', () => {
  it('maps 25 navigator.languages lists', () => {
    expect(cases).toHaveLength(25);
    cases.forEach(([langs, want]) => {
      expect(detectLang(langs, on)).toBe(want);
    });
  });
});
