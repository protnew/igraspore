#!/usr/bin/env node
// Audit 102 locales: coverage % vs en.json
const fs = require('fs');
const path = require('path');

const I18N_DIR = path.resolve(__dirname, '..', '.04-Src', 'i18n');
const EN_FILE = path.join(I18N_DIR, 'en.json');

const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
const enKeys = Object.keys(en);
const enCount = enKeys.length;

console.log(`en.json: ${enCount} keys\n`);

const results = [];
const files = fs.readdirSync(I18N_DIR).filter(f => f.endsWith('.json') && f !== 'en.json' && !f.includes('identity') && !f.includes('wave2'));

for (const file of files) {
  const locale = file.replace('.json', '');
  const filePath = path.join(I18N_DIR, file);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = Object.keys(data);
    
    // Missing keys (in en but not in locale)
    const missing = enKeys.filter(k => !(k in data));
    
    // Empty values
    const empty = keys.filter(k => {
      const v = data[k];
      return v === '' || v === null || v === undefined;
    });
    
    // Placeholder mismatches
    const placeholderMismatches = [];
    for (const key of enKeys) {
      if (key in data) {
        const enPlaceholders = (en[key] || '').match(/\{[^}]+\}/g) || [];
        const locPlaceholders = (data[key] || '').match(/\{[^}]+\}/g) || [];
        if (enPlaceholders.length !== locPlaceholders.length) {
          placeholderMismatches.push(key);
        }
      }
    }
    
    const coverage = ((keys.length - empty.length) / enCount * 100).toFixed(1);
    const status = coverage >= 95 ? '🟢' : coverage >= 80 ? '🟡' : '🔴';
    
    results.push({
      locale,
      file,
      keys: keys.length,
      missing: missing.length,
      empty: empty.length,
      placeholders: placeholderMismatches.length,
      coverage: parseFloat(coverage),
      status
    });
  } catch (e) {
    results.push({ locale, file, keys: 0, missing: enCount, empty: 0, placeholders: 0, coverage: 0, status: '❌', error: e.message });
  }
}

// Sort by coverage descending
results.sort((a, b) => b.coverage - a.coverage);

// Print table
console.log('Locale'.padEnd(12) + 'Keys'.padEnd(8) + 'Missing'.padEnd(10) + 'Empty'.padEnd(8) + 'Placeholders'.padEnd(15) + 'Coverage'.padEnd(12) + 'Status');
console.log('-'.repeat(75));
for (const r of results) {
  console.log(
    r.locale.padEnd(12) +
    String(r.keys).padEnd(8) +
    String(r.missing).padEnd(10) +
    String(r.empty).padEnd(8) +
    String(r.placeholders).padEnd(15) +
    (r.coverage + '%').padEnd(12) +
    r.status
  );
}

// Summary
const total = results.length;
const green = results.filter(r => r.status === '🟢').length;
const yellow = results.filter(r => r.status === '🟡').length;
const red = results.filter(r => r.status === '🔴').length;
const broken = results.filter(r => r.status === '❌').length;

console.log(`\nSummary: ${total} locales`);
console.log(`  🟢 ≥95%: ${green}`);
console.log(`  🟡 80-95%: ${yellow}`);
console.log(`  🔴 <80%: ${red}`);
console.log(`  ❌ broken: ${broken}`);

// Save to file for report
fs.writeFileSync(path.join(I18N_DIR, 'audit-results.json'), JSON.stringify(results, null, 2));
console.log(`\nSaved to audit-results.json`);
