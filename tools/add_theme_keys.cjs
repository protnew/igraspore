#!/usr/bin/env node
// Add missing theme.* keys to all locales (MACHINE_TRANSLATED from en)
const fs = require('fs');
const path = require('path');

const I18N_DIR = path.resolve(__dirname, '..', '.04-Src', 'i18n');
const EN_FILE = path.join(I18N_DIR, 'en.json');

const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
const themeKeys = Object.keys(en).filter(k => k.startsWith('theme.') || k.startsWith('aria.theme'));

console.log(`Adding ${themeKeys.length} theme keys to all locales\n`);

const files = fs.readdirSync(I18N_DIR).filter(f => f.endsWith('.json') && f !== 'en.json' && !f.includes('identity') && !f.includes('wave2') && f !== 'languages.json');

let updated = 0;
for (const file of files) {
  const filePath = path.join(I18N_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let added = 0;
  for (const key of themeKeys) {
    if (!(key in data)) {
      // Add with MACHINE_TRANSLATED prefix
      data[key] = '[MT] ' + en[key];
      added++;
    }
  }
  
  if (added > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`  ${file}: +${added} keys`);
    updated++;
  }
}

console.log(`\nUpdated ${updated} locale files`);
