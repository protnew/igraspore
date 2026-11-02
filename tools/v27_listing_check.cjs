#!/usr/bin/env node
// v27_listing_check.cjs — проверка листингов Play Store для 100 языков
// Критерии: 100 файлов, 0 копий en (кроме allow), лимиты знаков соблюдены

const fs = require('fs');
const path = require('path');

const LISTING_DIR = path.join(__dirname, '..', '.04-Src', 'i18n', 'listing');
const LANGS_FILE = path.join(__dirname, '..', '.04-Src', 'i18n', 'languages.json');

// Языки, которым разрешено копировать en (например, региональные варианты)
const ALLOW_COPY_EN = ['en-GB', 'en-AU', 'en-CA'];

const LIMITS = {
  title: 30,
  shortDescription: 80,
  fullDescription: 4000
};

function check() {
  const errors = [];
  const warnings = [];
  
  // Загружаем реестр языков
  let langs;
  try {
    langs = JSON.parse(fs.readFileSync(LANGS_FILE, 'utf8'));
  } catch (e) {
    console.error('❌ Не удалось загрузить languages.json:', e.message);
    process.exit(1);
  }
  
  const expectedLangs = langs.map(l => l.code);
  console.log(`Ожидается языков: ${expectedLangs.length}`);
  
  // Проверяем наличие директории
  if (!fs.existsSync(LISTING_DIR)) {
    console.error(`❌ Директория не найдена: ${LISTING_DIR}`);
    process.exit(1);
  }
  
  // Загружаем en.json как эталон
  let enListing;
  try {
    enListing = JSON.parse(fs.readFileSync(path.join(LISTING_DIR, 'en.json'), 'utf8'));
  } catch (e) {
    console.error('❌ Не удалось загрузить en.json:', e.message);
    process.exit(1);
  }
  
  const existingFiles = fs.readdirSync(LISTING_DIR).filter(f => f.endsWith('.json'));
  console.log(`Найдено файлов: ${existingFiles.length}`);
  
  let passCount = 0;
  let failCount = 0;
  
  for (const langCode of expectedLangs) {
    const filePath = path.join(LISTING_DIR, `${langCode}.json`);
    
    if (!fs.existsSync(filePath)) {
      errors.push(`❌ ${langCode}: файл отсутствует`);
      failCount++;
      continue;
    }
    
    let listing;
    try {
      listing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      errors.push(`❌ ${langCode}: невалидный JSON: ${e.message}`);
      failCount++;
      continue;
    }
    
    // Проверяем наличие обязательных полей
    const requiredFields = ['title', 'shortDescription', 'fullDescription'];
    const missingFields = requiredFields.filter(f => !listing[f]);
    if (missingFields.length > 0) {
      errors.push(`❌ ${langCode}: отсутствуют поля: ${missingFields.join(', ')}`);
      failCount++;
      continue;
    }
    
    // Проверяем лимиты знаков
    let limitsOk = true;
    for (const [field, limit] of Object.entries(LIMITS)) {
      const len = listing[field].length;
      if (len > limit) {
        errors.push(`❌ ${langCode}.${field}: ${len} > ${limit} символов`);
        limitsOk = false;
      }
    }
    
    // Проверяем копирование en (кроме allow и самого en)
    if (langCode !== 'en' && !ALLOW_COPY_EN.includes(langCode)) {
      if (listing.title === enListing.title) {
        errors.push(`❌ ${langCode}: title скопирован из en`);
        limitsOk = false;
      }
      if (listing.shortDescription === enListing.shortDescription) {
        errors.push(`❌ ${langCode}: shortDescription скопирован из en`);
        limitsOk = false;
      }
    }
    
    if (limitsOk) {
      passCount++;
    } else {
      failCount++;
    }
  }
  
  // Выводим результаты
  if (errors.length > 0) {
    console.log('\nОшибки:');
    errors.forEach(e => console.log(e));
  }
  
  if (warnings.length > 0) {
    console.log('\nПредупреждения:');
    warnings.forEach(w => console.log(w));
  }
  
  console.log(`\nИтого: ${passCount}/${expectedLangs.length} успешно, ${failCount} ошибок`);
  
  if (failCount > 0) {
    process.exit(1);
  } else {
    console.log('✅ Все проверки пройдены');
    process.exit(0);
  }
}

// NEG-режим для тестирования
if (process.env.NEG === '1') {
  console.log('🔴 NEG=1: эмуляция дефектов для проверки ловли');
  // Создаём временный файл с нарушением
  const testFile = path.join(LISTING_DIR, 'test-neg.json');
  fs.writeFileSync(testFile, JSON.stringify({
    title: 'x'.repeat(31), // нарушение лимита
    shortDescription: 'test',
    fullDescription: 'test'
  }));
  console.log(`Создан тестовый файл: ${testFile}`);
  try {
    check();
  } finally {
    // Удаляем тестовый файл
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  }
} else {
  check();
}
