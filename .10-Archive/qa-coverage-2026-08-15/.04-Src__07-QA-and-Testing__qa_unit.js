// Unit tests for iGraSpore V2 — extracted pure data
// Tests: species integrity, shape mapping, PNG coverage, no orphans
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0, n = 0;
function test(name, fn) {
  n++;
  try {
    const r = fn();
    if (r === true || r === undefined) { pass++; console.log(`  \x1b[32m✅ U${n}: ${name}\x1b[0m`); }
    else { fail++; console.log(`  \x1b[31m❌ U${n}: ${name} — ${r}\x1b[0m`); }
  } catch(e) { fail++; console.log(`  \x1b[31m❌ U${n}: ${name} — ${e.message}\x1b[0m`); }
}

// === EXTRACTED DATA ===
var PN=["Synechocystis sp.","Anabaena variabilis","Spirulina platensis","Nostoc punctiforme","Oscillatoria limnetica","Microcystis aeruginosa","Gloeocapsa sp.","Lyngbya majuscula","Chlamydomonas reinhardtii","Chlorella vulgaris","Volvox globator","Euglena gracilis","Scenedesmus quadricauda","Haematococcus pluvialis","Dunaliella salina","Micrasterias rotata","Navicula sp.","Pinnularia viridis","Cyclotella meneghiniana","Diatoma vulgare","Rhodospirillum rubrum","Chromatium vinosum","Porphyridium cruentum","Prochlorococcus marinus","Chroococcidiopsis thermalis"];
SHAPES={producer:["circle","filament","spiral","colony","filament","colony","colony","filament","bell","circle","colony","oval","colony","oval","oval","star","rod","rod","circle","rod","spiral","rod","circle","circle","colony"],consumer1:["comma","circle","rod","rod","rod","rod","rod","oval","oval","oval","oval","irregular","circle","comma","comma","filament","oval","bell","bell","bell"],consumer2:["slipper","slipper","bell","bell","bell","bell","oval","rod","slipper","irregular","irregular","irregular","oval","oval","slipper","rod","oval","bell","bell","irregular","irregular","irregular","irregular","irregular","irregular"],consumer3:["star","star","star","oval","oval","oval","star","oval","rod","rod","oval","rod","rod","rod","irregular"],decomposer:["circle","circle","filament","filament","filament","filament","circle","circle","filament","rod","rod","filament","rod","rod","circle"]};
var SWISS_SHAPES=['circle','rod','spiral','filament','comma','colony','oval','slipper','bell','irregular','star','phage','trypanosoma','yeast','volvox','archaea','diplococci','trichormus','apicomplexa','mollicutes','clubrod','rodtococcus'];
NAME_OVERRIDE = [
  // PRODUCERS — cyanobacteria
  [/Synechocystis/i, 'circle'],
  [/Anabaena/i, 'filament'],
  [/Spirulina|Arthrospira/i, 'spiral'],
  [/Nostoc/i, 'colony'],
  [/Oscillatoria|Phormidium|Leptolyngbya/i, 'filament'],
  [/Microcystis/i, 'colony'],
  [/Gloeocapsa/i, 'colony'],
  [/Lyngbya/i, 'filament'],
  [/Prochlorococcus/i, 'circle'],
  [/Chroococcidiopsis/i, 'colony'],
  // PRODUCERS — algae / diatoms
  [/Chlamydomonas/i, 'bell'],
  [/Chlorella/i, 'circle'],
  // Volvox moved to dedicated sprite below
  [/Euglena/i, 'oval'],
  [/Scenedesmus/i, 'colony'],
  [/Haematococcus/i, 'oval'],
  [/Dunaliella/i, 'oval'],
  [/Micrasterias|Desmid/i, 'star'],
  [/Navicula|Pinnularia|Diatoma/i, 'rod'],
  [/Cyclotella/i, 'circle'],
  [/Rhodospirillum/i, 'spiral'],
  [/Chromatium/i, 'rod'],
  [/Porphyridium/i, 'circle'],
  // CONSUMER1 — predatory bacteria / flagellates
  [/Bdellovibrio/i, 'comma'],
  [/Vampirococcus/i, 'circle'],
  [/Daptobacter/i, 'rod'],
  [/Myxococcus/i, 'rod'],
  [/Bacteriovorax|Halobacteriovorax|Peredibacter/i, 'rod'],
  [/Monas|Oikomonas|Anthophysa|Chilomonas/i, 'oval'],
  [/Cercomonas/i, 'irregular'],
  [/Heteromita/i, 'circle'],
  [/Bodo|Procryptobia/i, 'comma'],
  // Trypanosoma moved to dedicated sprite below
  [/Leishmania/i, 'oval'],
  [/Monosiga|Salpingoeca|Codonosiga/i, 'bell'],
  // CONSUMER2 — ciliates / amoebae
  [/Paramecium/i, 'slipper'],
  [/Stentor/i, 'bell'],
  [/Vorticella/i, 'bell'],
  [/Didinium/i, 'oval'],
  [/Spirostomum/i, 'rod'],
  [/Blepharisma/i, 'slipper'],
  [/Euplotes|Stylonychia|Oxytricha/i, 'irregular'],
  // Tetrahymena moved to batch 3 (slipper); Coleps|Urocentrum stay oval
  [/Litonotus/i, 'slipper'],
  [/Dileptus/i, 'rod'],
  [/Zoothamnium|Opercularia/i, 'bell'],
  [/Amoeba|Chaos/i, 'irregular'],
  [/Arcella|Difflugia|Euglypha|Nebela|Centropyxis/i, 'irregular'],
  // CONSUMER3 — heliozoa / rotifers / worms
  [/Actinophrys|Actinosphaerium|Raphidiophrys/i, 'star'],
  // Rotaria|Philodina moved to batch 3 (irregular)
  // Brachionus|Asplanchna moved to batch 3 (irregular)
  [/Keratella/i, 'star'],
  [/Chaetonotus|Lepidodermella/i, 'rod'],
  // Macrostomum moved to batch 3 (rod)
  [/Prostoma/i, 'rod'],
  [/Trichoplax/i, 'irregular'],
  // DECOMPOSERS
  // Saccharomyces|Candida moved to dedicated sprite below
  [/Mucor|Rhizopus/i, 'filament'],
  [/Penicillium|Aspergillus/i, 'filament'],
  [/Batrachochytrium|Chytriomyces|Allomyces/i, 'circle'],
  [/Bacillus|Pseudomonas|Cellulomonas|Thermus/i, 'rod'],
  [/Streptomyces/i, 'filament'],
  [/Deinococcus/i, 'star'],
  // SPECIFIC MORPHOTYPES (higher fidelity — dedicated sprites)
  [/Trypanosoma/i, 'trypanosoma'],   // undulating membrane, not generic filament
  [/Saccharomyces|Candida/i, 'yeast'], // budding yeast, not generic oval
  [/Volvox/i, 'volvox'],              // spherical colony, not generic colony
  // SPECIFIC MORPHOTYPES batch 3 — fix biologically wrong generic mappings
  [/Macrostomum|Stenostomum|Microstomum/i, 'rod'],       // flatworms: elongated, not oval
  [/Rotaria|Philodina/i, 'irregular'],                    // rotifers: have foot/corona, not plain oval
  [/Brachionus|Asplanchna/i, 'irregular'],                // planktonic rotifers: lorica shape
  [/Tetrahymena/i, 'slipper'],                            // pear-shaped ciliate, not oval
  [/Thermus/i, 'rod'],                                    // already rod, ensure dedicated
  // SPECIFIC MORPHOTYPES batch 2
  [/Apicomplexa|Plasmodium|Toxoplasma|Cryptosporid/i, 'apicomplexa'],
  [/Mollicutes|Mycoplasma|Acholeplasma|Spiroplasma/i, 'mollicutes'],
  [/Corynebacter|Arthrobacter|Brevibacter/i, 'clubrod'],
  [/Rhodobacter|Agrobacterium|Azorhizob|rodtococcus/i, 'rodtococcus'],
  // VIRUSES
  [/phage|virus|Neuro.Parasite|Macrophage|T4|Lambda|T7|Phi|MS2/i, 'phage']
];
SWISS_APPROX_SHAPES = {
  // Generic SwissBioPics diagrams are REAL biological schemas.
  // They are NOT approximate — multiple species sharing one morphotype is normal.
  // Only flag shapes that are biologically misleading for specific taxa.
  'oval': false,      // Generic eukaryote oval — real Pombe/yeast shape
  'rod': false,       // Generic bacterial rod — real rod shape
  'circle': false,    // Generic coccus — real coccus shape
  'bell': false,      // Chlamydomonas shape — real
  'irregular': false, // Fungal/amoeba shape — real
  'filament': false,  // Filamentous bacteria — real
  // Dedicated sprites (good match, 1-3 species)
  'trypanosoma': false,
  'apicomplexa': false,
  'mollicutes': false,
  'clubrod': false,
  'rodtococcus': false,
  'yeast': false,
  'volvox': false,
  'slipper': false,
  'star': false,
  'colony': false,
  'comma': false,
  'spiral': false,
  'phage': false
};

const SPRITE_DIR = 'C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/assets/bioicons/swiss_sprites';
const PNGs = fs.existsSync(SPRITE_DIR) ? 
  fs.readdirSync(SPRITE_DIR).filter(f => f.endsWith('.png')).map(f => f.replace('.png','')) : [];

console.log('\n' + '='.repeat(60));
console.log('🧪 UNIT TESTS — iGraSpore V2 Data Integrity\n');
console.log(`PN species: ${PN.length}`);
console.log(`SWISS_SHAPES: ${SWISS_SHAPES.length}`);
console.log(`NAME_OVERRIDE entries: ${NAME_OVERRIDE.length}`);
console.log(`PNG files: ${PNGs.length}\n`);

// === SPECIES DATA ===
console.log('--- Species Array (PN) ---');
test('PN is array', () => Array.isArray(PN) || 'not array');
test('PN has 25 species', () => PN.length === 25 || `count=${PN.length}`);
test('All PN entries are strings', () => PN.every(p => typeof p === 'string') || 'non-string entry');
test('PN entries are unique', () => new Set(PN).size === PN.length || 'duplicates');
test('PN has Synechocystis sp.', () => PN.includes('Synechocystis sp.'));
test('PN has Chroococcidiopsis', () => PN.some(p => p.includes('Chroococcidiopsis')));
test('All PN entries have genus+species', () => PN.every(p => p.split(' ').length >= 2 || p.includes('sp.')) || 'incomplete name');

// === SHAPES REGISTRY ===
console.log('\n--- Default Shapes (SHAPES) ---');
test('SHAPES has producer category', () => Array.isArray(SHAPES.producer) || 'missing');
test('SHAPES has consumer1 category', () => Array.isArray(SHAPES.consumer1) || 'missing');
test('SHAPES has consumer2 category', () => Array.isArray(SHAPES.consumer2) || 'missing');
test('Producer shapes match PN count', () => SHAPES.producer.length === PN.length || `prod=${SHAPES.producer.length} vs PN=${PN.length}`);

// === SWISS SHAPES ===
console.log('\n--- Swiss Shapes Registry ---');
test('SWISS_SHAPES has 22 entries', () => SWISS_SHAPES.length === 22 || `count=${SWISS_SHAPES.length}`);
test('No duplicates', () => new Set(SWISS_SHAPES).size === SWISS_SHAPES.length || 'dupes');
test('Includes all bacteria types', () => {
  const required = ['circle','rod','spiral','filament','comma'];
  const missing = required.filter(s => !SWISS_SHAPES.includes(s));
  return missing.length === 0 || `Missing: ${missing}`;
});
test('Includes all eukaryote types', () => {
  const required = ['oval','slipper','bell','irregular','star'];
  const missing = required.filter(s => !SWISS_SHAPES.includes(s));
  return missing.length === 0 || `Missing: ${missing}`;
});
test('Includes virus (phage)', () => SWISS_SHAPES.includes('phage'));
test('Includes specialist shapes', () => {
  const required = ['trypanosoma','yeast','volvox','apicomplexa'];
  const missing = required.filter(s => !SWISS_SHAPES.includes(s));
  return missing.length === 0 || `Missing: ${missing}`;
});

// === NAME OVERRIDE MAPPING ===
console.log('\n--- Name Override Mapping ---');
test('NAME_OVERRIDE is non-empty array', () => Array.isArray(NAME_OVERRIDE) && NAME_OVERRIDE.length > 0);
test('Has >60 mappings', () => NAME_OVERRIDE.length >= 60 || `count=${NAME_OVERRIDE.length}`);
test('All entries are [regex, string]', () => {
  const bad = NAME_OVERRIDE.filter(e => !Array.isArray(e) || e.length !== 2 || !(e[0] instanceof RegExp) || typeof e[1] !== 'string');
  return bad.length === 0 || `${bad.length} bad entries`;
});
test('All mapped shapes exist in SWISS_SHAPES', () => {
  const used = [...new Set(NAME_OVERRIDE.map(e => e[1]))];
  const missing = used.filter(s => !SWISS_SHAPES.includes(s));
  return missing.length === 0 || `Missing: ${missing}`;
});

// === PNG FILE INTEGRITY ===
console.log('\n--- PNG Sprite Files ---');
test('22 PNG files exist', () => PNGs.length === 22 || `count=${PNGs.length}`);
test('Every SWISS_SHAPE has PNG', () => {
  const missing = SWISS_SHAPES.filter(s => !PNGs.includes(s));
  return missing.length === 0 || `Missing PNGs: ${missing}`;
});
test('No orphan PNGs', () => {
  const orphans = PNGs.filter(p => !SWISS_SHAPES.includes(p));
  return orphans.length === 0 || `Orphans: ${orphans}`;
});

// === SWISS APPROX SAFETY ===
console.log('\n--- Approximate Safety Net ---');
test('All APPROX shapes set to false', () => {
  const trues = Object.entries(SWISS_APPROX_SHAPES).filter(([,v]) => v === true).map(([k]) => k);
  return trues.length === 0 || `True: ${trues}`;
});

// === SPECIES → SHAPE COVERAGE ===
console.log('\n--- Coverage: Species → Swiss Shape ---');
test('Every PN species maps to a Swiss shape', () => {
  let unmapped = [];
  for (const name of PN) {
    const matched = NAME_OVERRIDE.some(([re]) => re.test(name));
    if (!matched) unmapped.push(name);
  }
  return unmapped.length === 0 || `${unmapped.length} unmapped: ${unmapped.slice(0,3)}`;
});

// === SUMMARY ===
console.log('\n' + '='.repeat(60));
const pct = Math.round(pass / n * 100);
console.log(`📊 UNIT TESTS: ${pass}/${n} PASS (${pct}%) | FAIL: ${fail}`);
console.log('='.repeat(60));
process.exit(fail > 0 ? 1 : 0);
