// v20.10 L1: justify the 116 open i18n_lint findings one by one. An allow entry (file+line+exact) is written only when
// the source line proves the literal is a translation value: T.<lang>.<key>='…' / T['<lang>'].<key>="…" / LANG_NAME{code:'…'}.
// Everything else stays open and is printed. Linter itself is not changed.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const inv = JSON.parse(fs.readFileSync(path.join(ROOT, '09-Docs/out-dev-factory/logs-release-ready-2026-10-14/i18n-inventory-before.json'), 'utf8'));
const allowF = path.join(ROOT, '.04-Src/tools/i18n/i18n_lint.allow.json'); const allow = JSON.parse(fs.readFileSync(allowF, 'utf8'));
const src = fs.readFileSync(path.join(ROOT, '.04-Src/js/config.js'), 'utf8').split(/\r?\n/);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const open = inv.findings.filter(f => f.cat === 'ui' && !f.allowed);
const added = [], left = [];
for (const f of open) {
  const L = src[f.line - 1] || '', t = String(f.text);
  const q = `(?<qq>['"])${esc(t).replace(/'/g, "\\\\?'")}\\k<qq>`;
  let m = new RegExp(`T(?:\\.([a-z]{2,3}(?:_[A-Z]+)?)|\\[['"]([a-zA-Z-]+)['"]\\])\\.([A-Za-z0-9_.]+)\\s*=\\s*${q}`).exec(L);
  let reason = null;
  if (m) reason = `translation value T.${m[1] || m[2]}.${m[3]} (inline dictionary in config.js, v20.7 keys); not hardcoded UI`;
  else if ((m = new RegExp(`LANG_NAME\\s*=\\s*\\{.*?['"]?([a-zA-Z-]+)['"]?\\s*:\\s*${q}`).exec(L))) reason = `language endonym LANG_NAME.${m[1]} (shown in its own language by design)`;
  else if ((m = new RegExp(`['"]?([a-zA-Z-]{2,6})['"]?\\s*:\\s*${q}`).exec(L)) && /LANG_NAME|langNames|T\[|T\./.test(L)) reason = `translation/endonym map entry ${m[1]} on dictionary line`;
  else if (f.type === 'ternary' && t === 'ru' && /curLang\)\?curLang:'ru'/.test(L)) reason = 'fallback language code ru when curLang is unset (code, not visible text)';
  if (reason && !allow.some(a => a.file === f.file && a.line === f.line && a.exact === t)) { allow.push({ file: f.file, line: f.line, exact: t, reason: 'v20.10 L1: ' + reason }); added.push(f.line + ' ' + t.slice(0, 30)); }
  else if (!reason) left.push(f.line + ' [' + f.type + '] ' + JSON.stringify(t).slice(0, 80) + ' :: ' + L.trim().slice(0, 100));
}
fs.writeFileSync(allowF, JSON.stringify(allow, null, 2) + '\n');
console.log('open=' + open.length + ' justified=' + added.length + ' left=' + left.length); left.forEach(x => console.log('LEFT', x));
