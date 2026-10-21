import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { loadAndValidate, gateLang } from '../../../tools/i18n/critic_check.mjs';

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const now = () => new Date().toISOString(); // real UTC; must match file mtime (epoch) within 5 min
function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'critictest-')); }

function writeDict(dir, lang, content) {
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, lang + '.json');
  fs.writeFileSync(p, content);
  return { p, sha: sha(fs.readFileSync(p)) };
}

function analystObj(lang, { score, inputSha, round = 5 }) {
  const ax = Math.round(score * 100) / 100;
  const axes = { meaning: ax, glossary: ax, register: ax, length: ax, errors: ax };
  return {
    schema: 'critic/1', role: 'analyst', model: 'Grok Bot', session_id: 'analyst-08-20261016-1800',
    round, started_at: new Date(Date.now() - 60000).toISOString(), finished_at: now(), langs: [{ code: lang, score, axes }],
    input_sha256: { [lang]: inputSha },
  };
}

function writeAnalyst(dir, file, obj, logExists = true) {
  const log = path.join(dir, 'log.txt');
  if (logExists) fs.writeFileSync(log, 'CHECK');
  obj.log = log;
  const bytes = Buffer.from(JSON.stringify(obj), 'utf8');
  fs.writeFileSync(path.join(dir, file), bytes);
  return { file, sha: sha(bytes) };
}

function writeLedger(dir, rows) {
  const p = path.join(dir, 'ANALYST-LEDGER.md');
  fs.writeFileSync(p, rows.map((r) => r.join(' | ')).join('\n') + '\n');
  return p;
}

describe('critic_check U44 — analyst integrity, round>=5, gate', () => {
  it('1) analyst file edited after write (sha not in ledger) -> FAIL', () => {
    const d = tmp();
    const dict = writeDict(path.join(d, 'i18n'), 'es', '{"a":1}');
    const a = writeAnalyst(d, 'es-analyst-round5.json', analystObj('es', { score: 8.5, inputSha: dict.sha }));
    const ledger = writeLedger(d, [[a.file, 'f'.repeat(64), '2026-10-16']]); // wrong sha
    const res = loadAndValidate(d, ledger);
    expect(res.errors.some((e) => /изменён не аналитиком/.test(e))).toBe(true);
  });

  it('2) critic-A round >= 5 -> FAIL', () => {
    const d = tmp();
    const obj = {
      schema: 'igs-critic/1', role: 'critic-A', model: 'claude-sonnet-4-5', session_id: 'sA',
      round: 5, started_at: now(), finished_at: now(), log: path.join(d, 'l.txt'),
      langs: [{ code: 'de', score: 8.2, axes: { meaning: 8, glossary: 8, register: 8, length: 9, errors: 8 } }],
    };
    fs.writeFileSync(path.join(d, 'l.txt'), 'x');
    fs.writeFileSync(path.join(d, 'wave-de-critic-A-round5.json'), JSON.stringify(obj));
    const res = loadAndValidate(d, path.join(d, 'none.md'));
    expect(res.errors.some((e) => /круга 5 запрещён|критик только analyst/.test(e))).toBe(true);
  });

  it('3) gate: outdated input_sha (dict changed after review) -> FAIL', () => {
    const d = tmp();
    const dict = writeDict(path.join(d, 'i18n'), 'es', '{"a":1}');
    const a = writeAnalyst(d, 'es-analyst-round5.json', analystObj('es', { score: 8.5, inputSha: 'a'.repeat(64) }));
    const ledger = writeLedger(d, [[a.file, a.sha, '2026-10-16']]);
    const g = gateLang(d, 'es', { ledgerPath: ledger, dictPath: dict.p });
    expect(g.ok).toBe(false);
    expect(g.reason).toMatch(/изменён после оценки/);
  });

  it('4) gate: score 7.5 (below threshold) -> FAIL', () => {
    const d = tmp();
    const dict = writeDict(path.join(d, 'i18n'), 'fil', '{"a":1}');
    const a = writeAnalyst(d, 'fil-analyst-round5.json', analystObj('fil', { score: 7.5, inputSha: dict.sha }));
    const ledger = writeLedger(d, [[a.file, a.sha, '2026-10-16']]);
    const g = gateLang(d, 'fil', { ledgerPath: ledger, dictPath: dict.p });
    expect(g.ok).toBe(false);
    expect(g.reason).toMatch(/ниже порога/);
  });

  it('5) gate: score 8 + fresh sha -> PASS', () => {
    const d = tmp();
    const dict = writeDict(path.join(d, 'i18n'), 'tr', '{"a":1}');
    const a = writeAnalyst(d, 'tr-analyst-round5.json', analystObj('tr', { score: 8, inputSha: dict.sha }));
    const ledger = writeLedger(d, [[a.file, a.sha, '2026-10-16']]);
    const g = gateLang(d, 'tr', { ledgerPath: ledger, dictPath: dict.p });
    expect(g.ok).toBe(true);
  });
});
