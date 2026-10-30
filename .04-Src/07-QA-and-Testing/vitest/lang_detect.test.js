import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { detectLang } = require('../../js/i18n_detect.js');

// v24 A1: включённый набор на момент теста (20); когда фазы L включат pt-PT/es-419/no/he/sr/zh-CN — кейсы обновить вместе с реестром
const on = ['en','ru','pt-BR','es','hi','id','tr','de','fr','ja','ko','th','vi','it','pl','uk','zh-TW','ms','bn','fil'];
const cases = [
  [[], 'en'], [[''], 'en'], [['en-US'], 'en'], [['ru-RU','en'], 'ru'], [['de-DE'], 'de'],
  [['fr'], 'fr'], [['ja-JP'], 'ja'], [['hi-IN'], 'hi'], [['tr-TR'], 'tr'], [['id-ID'], 'id'],
  [['in'], 'id'], [['tl'], 'fil'],
  [['pt-BR'], 'pt-BR'], [['pt-PT'], 'pt-BR'], [['pt-AO'], 'pt-BR'],
  [['es-ES'], 'es'], [['es-MX'], 'es'], [['es-419'], 'es'], [['es-US'], 'es'],
  [['zh-TW'], 'zh-TW'], [['zh-HK'], 'zh-TW'], [['zh-MO'], 'zh-TW'], [['zh-Hant-TW'], 'zh-TW'],
  [['zh-CN'], 'en'], [['zh-SG'], 'en'], [['zh-Hans'], 'en'], [['zh'], 'en'],
  [['nb-NO'], 'en'], [['nn'], 'en'], [['no'], 'en'], [['iw'], 'en'], [['he-IL'], 'en'], [['sr-RS'], 'en'],
  [['ar','ru'], 'ru'], [['xx','fr'], 'fr'], [['pt-BR','ja'], 'pt-BR'],
];
describe('detectLang (v24 A1 таблица цепочек)', () => {
  it('maps navigator.languages → первый включённый', () => {
    cases.forEach(([langs, want]) => { const got = detectLang(langs, on); if (got !== want) console.error("CASE", JSON.stringify(langs), "got", got, "want", want); expect(got).toBe(want); });
  });
});
