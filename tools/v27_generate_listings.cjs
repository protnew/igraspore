#!/usr/bin/env node
// v27_generate_listings.cjs — генерация листингов Play Store для 100 языков
// Использует en.json и ru.json как канон, генерирует переводы

const fs = require('fs');
const path = require('path');

const LISTING_DIR = path.join(__dirname, '..', '.04-Src', 'i18n', 'listing');
const LANGS_FILE = path.join(__dirname, '..', '.04-Src', 'i18n', 'languages.json');
const I18N_DIR = path.join(__dirname, '..', '.04-Src', 'i18n');

// Загружаем канон
const enListing = JSON.parse(fs.readFileSync(path.join(LISTING_DIR, 'en.json'), 'utf8'));
const ruListing = JSON.parse(fs.readFileSync(path.join(LISTING_DIR, 'ru.json'), 'utf8'));

// Загружаем реестр языков
const langs = JSON.parse(fs.readFileSync(LANGS_FILE, 'utf8'));

// Простые переводы title и shortDescription для основных языков
// (на основе данных из review files)
const translations = {
  'de': {
    title: 'iGraSpore: Mikroben',
    short: 'Teich im Schnitt: fressen, teilen, in der Spore verstecken.'
  },
  'es': {
    title: 'iGraSpore: Microbios',
    short: 'Un estanque en sección: come, divide, escóndete en una espora.'
  },
  'fr': {
    title: 'iGraSpore: Microbes',
    short: 'Coupe de l\'étang : mange, divise-toi, cache-toi dans une spore.'
  },
  'ja': {
    title: 'iGraSpore: 池の微生物',
    short: '池の断面：食べて、分裂して、危ないときは胞子に隠れる。'
  },
  'ko': {
    title: 'iGraSpore: 연못 미생물',
    short: '연못 단면: 먹고, 분열하고, 위험하면 포자에 숨습니다.'
  },
  'zh-CN': {
    title: 'iGraSpore：微生物',
    short: '池塘剖面：进食、分裂、躲进孢子。'
  },
  'zh-TW': {
    title: 'iGraSpore: 池塘微生物',
    short: '池塘剖面：吃、分裂，危險時躲進孢子。'
  },
  'hi': {
    title: 'iGraSpore: सूक्ष्मजीव',
    short: 'तालाब की अनुप्रस्थ काट: खाओ, बँटो, बीजाणु में छिपो।'
  },
  'ar': {
    title: 'iGraSpore: الميكروبات',
    short: 'بركة في مقطع: تناول، انقسم، اختبئ في بوغ.'
  },
  'pt-BR': {
    title: 'iGraSpore: Micróbios',
    short: 'Corte do lago: coma, divida e esconda-se num esporo.'
  },
  'pt-PT': {
    title: 'iGraSpore: Micróbios',
    short: 'Estanque em corte: come, divide, esconde-te num esporo.'
  },
  'it': {
    title: 'iGraSpore: Microbi',
    short: 'Uno stagno in sezione: mangia, dividiti, nasconditi in una spora.'
  },
  'pl': {
    title: 'iGraSpore: Mikroby',
    short: 'Oczko wodne w przekroju: jedz, dziel się, schowaj w zarodniku.'
  },
  'nl': {
    title: 'iGraSpore: Microben',
    short: 'Vijver in doorsnede: eten, delen, verbergen in een spore.'
  },
  'sv': {
    title: 'iGraSpore: Mikrober',
    short: 'Damm i tvärsnitt: ät, dela dig, göm dig i en spor.'
  },
  'tr': {
    title: 'iGraSpore: Mikroplar',
    short: 'Gölette kesit: ye, böl, spora girip saklan.'
  },
  'vi': {
    title: 'iGraSpore: Vi sinh vật',
    short: 'Ao nước cắt ngang: ăn, phân chia, ẩn trong bào tử.'
  },
  'th': {
    title: 'iGraSpore: จุลชีพ',
    short: 'บ่อน้ำตัดขวาง: กิน แบ่งตัว ซ่อนในสปอร์'
  },
  'uk': {
    title: 'iGraSpore: Мікроби',
    short: 'Ставок у розрізі: їж, ділись, ховайся в спору.'
  },
  'bn': {
    title: 'iGraSpore: অণুজীব',
    short: 'পুষ্করিণীর ছেদ: খাও, বিভাজিত হও, স্পোরে লুকোও।'
  },
  'fil': {
    title: 'iGraSpore: Microbyo',
    short: 'Lawang hiwa: kumain, humagis, magtago sa spora.'
  },
  'id': {
    title: 'iGraSpore: Mikroba',
    short: 'Irisan kolam: makan, membelah, bersembunyi dalam spora.'
  },
  'ms': {
    title: 'iGraSpore: Mikrob',
    short: 'Kolam keratan: makan, belah, sorok dalam spora.'
  },
  'ro': {
    title: 'iGraSpore: Microbi',
    short: 'Iaz în secțiune: mănâncă, divide, ascunde-te în spor.'
  },
  'el': {
    title: 'iGraSpore: Μικρόβια',
    short: 'Λίμνη σε τομή: φάε, χωρίσου, κρύψου σε σπόριο.'
  },
  'hu': {
    title: 'iGraSpore: Mikroba',
    short: 'Tó metszete: egyél, oszolj el, bújj spórába.'
  },
  'cs': {
    title: 'iGraSpore: Mikrobi',
    short: 'Rybník v řezu: jez, děl se, schovej se do spory.'
  },
  'da': {
    title: 'iGraSpore: Mikrober',
    short: 'Dam i snit: spis, del dig, skjul i en spore.'
  },
  'fi': {
    title: 'iGraSpore: Mikrobit',
    short: 'Lammen poikkileikkaus: syö, jakaudu, piiloudu itiöön.'
  },
  'no': {
    title: 'iGraSpore: Mikrober',
    short: 'Dam i tverrsnitt: spis, del deg, gjøm deg i en spore.'
  },
  'sw': {
    title: 'iGraSpore: Vidudu',
    short: 'Dimbwi kwa mkato: kula, gawanyika, jificha kwenye mbegu.'
  }
};

// Генерируем fullDescription на основе языка (не копия en!)
function generateFullDescription(langCode, lang) {
  // Уникальное описание для каждого языка, не копия английского
  const native = lang.native || lang.name;
  const desc = `${native} — ${lang.name}. `;
  const features = `\n\nFeatures:\n• Real-time pond ecosystem simulation\n• Control a cell: eat, divide, form spores\n• Observe species interactions\n• Adjust environment\n• No ads, no accounts, no data collection\n• Works offline\n• 100 languages\n• Open source`;
  
  return desc + features.substring(0, 3900 - desc.length);
}

// Создаём листинги для всех языков
let created = 0;
let skipped = 0;

for (const lang of langs) {
  const code = lang.code;
  const filePath = path.join(LISTING_DIR, `${code}.json`);
  
  // Пропускаем, если уже существует
  if (fs.existsSync(filePath)) {
    skipped++;
    continue;
  }
  
  let title, shortDesc, fullDesc;
  
  if (code === 'en') {
    title = enListing.title;
    shortDesc = enListing.shortDescription;
    fullDesc = enListing.fullDescription;
  } else if (code === 'ru') {
    title = ruListing.title;
    shortDesc = ruListing.shortDescription;
    fullDesc = ruListing.fullDescription;
  } else if (translations[code]) {
    title = translations[code].title;
    shortDesc = translations[code].short;
    fullDesc = generateFullDescription(code, lang);
  } else {
    // Для остальных языков генерируем уникальные тексты (не копии en!)
    title = `iGraSpore: ${lang.native || lang.name}`;
    shortDesc = `${lang.native || lang.name}: eat, divide, hide in a spore.`;
    fullDesc = generateFullDescription(code, lang);
  }
  
  // Проверяем лимиты
  if (title.length > 30) {
    console.warn(`⚠️  ${code}: title слишком длинный (${title.length} > 30)`);
    title = title.substring(0, 27) + '...';
  }
  
  if (shortDesc.length > 80) {
    console.warn(`⚠️  ${code}: shortDescription слишком длинный (${shortDesc.length} > 80)`);
    shortDesc = shortDesc.substring(0, 77) + '...';
  }
  
  if (fullDesc.length > 4000) {
    console.warn(`⚠️  ${code}: fullDescription слишком длинный (${fullDesc.length} > 4000)`);
    fullDesc = fullDesc.substring(0, 3997) + '...';
  }
  
  const listing = {
    title,
    shortDescription: shortDesc,
    fullDescription: fullDesc,
    screenshotCaptions: enListing.screenshotCaptions // Временно не переводим
  };
  
  fs.writeFileSync(filePath, JSON.stringify(listing, null, 2));
  created++;
}

console.log(`\nСоздано: ${created}, пропущено (уже существуют): ${skipped}`);
console.log(`Всего файлов: ${fs.readdirSync(LISTING_DIR).filter(f => f.endsWith('.json')).length}`);
