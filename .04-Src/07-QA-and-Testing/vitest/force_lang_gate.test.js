import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { forceLangAllowed } = require('../../js/i18n_detect.js');

describe('forceLangAllowed (U39 — QA hook only on localhost or ?qa=1)', () => {
  it('allows the local QA stand hosts', () => {
    expect(forceLangAllowed('127.0.0.1', '')).toBe(true);
    expect(forceLangAllowed('localhost', '')).toBe(true);
    expect(forceLangAllowed('[::1]', '')).toBe(true);
  });

  it('allows a remote/QA host only with ?qa=1', () => {
    expect(forceLangAllowed('igraspore.example', '?qa=1')).toBe(true);
    expect(forceLangAllowed('example.com', '?lang=es&qa=1')).toBe(true);
  });

  it('ignores force off-QA (production users cannot enable a disabled language)', () => {
    expect(forceLangAllowed('igraspore.app', '')).toBe(false);
    expect(forceLangAllowed('igraspore.app', '?lang=es')).toBe(false);
    expect(forceLangAllowed('example.com', '?qa=0')).toBe(false);
    expect(forceLangAllowed('example.com', '?qa=yes')).toBe(false);
    expect(forceLangAllowed('', '')).toBe(false);
  });
});
