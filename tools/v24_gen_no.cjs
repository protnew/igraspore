// v24 L1/no: генерация норвежского словаря+wiki из датского (bokmål исторически от датского) с норвежскими правками
const fs = require('fs');
const path = require('path');
const I18N = path.join(__dirname, '..', '.04-Src', 'i18n');

// 1) Словарь: da → no
const da = JSON.parse(fs.readFileSync(path.join(I18N, 'da.json'), 'utf8'));
const no = JSON.parse(JSON.stringify(da));
// Норвежские заменители характерных датских слов (bokmål)
const noFixes = {
  'menuSub': 'Simulering av mikroorganismer — {n} arter + virus. Tverrsnitt av en dam.',
  'poolWill': 'I dammen: ~{n} organismer · {kinds} arter',
  'exitAsk': 'Avslutte?', 'exitMsg': 'Fremdriften i dette livet går tapt.',
  'deadYours': 'Cellen din døde', 'setLang': 'Språk', 'yes': 'Ja', 'no': 'Nei', 'more': 'Mer',
  'diffE': 'Lett', 'diffN': 'Normal', 'diffH': 'Vanskelig',
  'consumer1': 'Små etere', 'consumer2': 'Mellom etere', 'consumer3': 'Store jegere',
  'decomposer': 'Renholdere (sopper)', 'producer': 'Grønt (mat)',
  'demo': 'DEMO / Galleri', 'help': 'Slik spiller du', 'wikiT': 'Wiki: Livet i dammen',
  'season0': 'Vår', 'season1': 'Sommer', 'season2': 'Høst', 'season3': 'Vinter',
  'restart': 'OMSTART', 'resume': 'FORTSETT', 'close': 'LUKK', 'clear': 'Tøm',
  'economy': 'Sparmodus', 'economyAsk': 'Bildefrekvens under 25. Sparmodus i innstillinger: færre etiketter, damm −30%.',
  'errGeneric': 'Feil', 'errAsync': 'Asynkron feil', 'loadingWorld': 'Bygger dammen…',
  'roleOk': 'Forstått — jeg svømmer', 'roleWho': 'Hvem du er / hva du spiser',
  'speciesShown.one': '{n} art', 'speciesShown.other': '{n} arter',
  'coloniesCount.one': '{n} koloni', 'coloniesCount.other': '{n} kolonier',
  'aliveCount.one': '{n} i live', 'aliveCount.other': '{n} i live',
  'toast.controls': 'Styring: WASD / mus · SPIS (E) · DEL (Q)',
  'camFlyTouch': 'Fri kamera',
  'helpTouch': '<p><b>Kontroll:</b> Dra joyticken for å svømme. Trykk på vannet for å sikte. Nedre knapper: spis, del, spore, auto. Knip for zoom.</p>',
};
for (const k in noFixes) no[k] = noFixes[k];
// Глобальные замены датских слов на норвежские в остальных значениях
const wordMap = [
  [/efterår/g, 'høst'], [/Gennemført/g, 'Fullført'], [/gennemfør/g, 'fullfør'],
  [/afslut/g, 'avslutt'], [/Efter/g, 'Etter'], [/efter/g, 'etter'],
  [/Styring/g, 'Kontroll'], [/styring/g, 'kontroll'],
  [/dammen/g, 'dammen'], [/dam/g, 'dam'],
  [/færdig/g, 'ferdig'], [/Færdig/g, 'Ferdig'],
  [/Svøm/g, 'Svøm'], [/svoem/g, 'svøm'],
  [/og så/g, 'og så'],
  [/Kilder/g, 'Kilder'],
  [/Fredag/g, 'Fredag'],
];
for (const k in no) {
  if (typeof no[k] === 'string') {
    for (const [re, rep] of wordMap) no[k] = no[k].replace(re, rep);
  }
}
fs.writeFileSync(path.join(I18N, 'no.json'), JSON.stringify(no, null, 2) + '\n');
console.log('no.json:', Object.keys(no).length, 'ключей');

// 2) Wiki: da → no
const daW = JSON.parse(fs.readFileSync(path.join(I18N, 'wiki', 'da.json'), 'utf8'));
const noW = JSON.parse(JSON.stringify(daW));
const wikiFixes = {
  '0': 'Synechocystis er en cyanobakterie uten kjerne. Lever av lys: oksygenproduserende fotosyntese på membraner, ingen kloroplaster. Labmodell for hydrogenmetabolisme.',
  '1': 'Anabaena variabilis er en tråd. Noen celler blir heterocyster og binder nitrogen mens naboene lager sukker. I dammen leverer den bundet nitrogen.',
  '2': 'Spirulina (Arthrospira) er en spiral av celler med gassblærer. Henger nær overflaten, fotosyntetiserer og er spiselig. I spillet en stor grønn skrue i vannfilmen.',
  '5': 'Microcystis aeruginosa er en slimkoloni, ofte giftig (mikrocystin). Forårsaker vannblomstring. I spillet en grønn kolonikule, risikabelt bytte.',
  '8': 'Chlamydomonas reinhardtii er en grønn celle med to flageller og en øyeflekk. Svømmer mot lyset. Klassisk alg-genetikk-modell.',
  '9': 'Chlorella vulgaris er en ubevegelig grønn kule. Deler seg raskt og er proteinrik. Mat for små etere og rommat-emne.',
  '10': 'Volvox globator er et hult kule av tusenvis av celler. Datterkolonier modnes inni og forlater kule. I spillet en stor grønn koloni.',
  '11': 'Euglena gracilis er en mixotrof: kloroplaster pluss evnen til å spise. En rød øyeflekk følger lyset. Grønn om dagen; i mørket bytter til mat.',
  '15': 'Micrasterias rotata er en flat stjernedesmid. To speilvendte halvdeler med dype innsnitt. Ubevegelig; fotosyntetiserer i surt myrvann.',
  '45': 'Paramecium caudatum er den klassiske tetten. Tusenvis av cilia, en munnfure, sammentrekkende vakuoler. Filtrerer bakterier.',
  '49': 'Vorticella campanula er en klokke på en sammentrekkende stilk. Stilken snurrer seg inn i en spiral øyeblikkelig. Selve cellen svømmer ikke bort.',
  '64': 'Amoeba proteus er den klassiske amøben. Pseudopodier flyter rundt byttet. Ingen fast form, ingen cilia.',
  '85': 'Saccharomyces cerevisiae er gjær. Knoppter, spiser sukker, frigjør CO₂ og alkohol. I dammen rydder den opp løst organisk materiale.',
  '1001': 'Seksuell eukaryot er en undervisningsmodell for seksuell reproduksjon. To kjønn, gamet-fusjon, ikke enkel binær deling.'
};
for (const k in wikiFixes) { if (noW[k]) noW[k] = { body: wikiFixes[k] }; }
// Глобальные замены в wiki
for (const k in noW) {
  let b = noW[k].body;
  b = b.replace(/efterår/g, 'høst').replace(/Efter/g, 'Etter').replace(/efter/g, 'etter');
  b = b.replace(/Styring/g, 'Kontroll').replace(/styring/g, 'kontroll');
  b = b.replace(/Færdig/g, 'Ferdig').replace(/færdig/g, 'ferdig');
  noW[k].body = b;
}
fs.writeFileSync(path.join(I18N, 'wiki', 'no.json'), JSON.stringify(noW, null, 2) + '\n');
const enW = JSON.parse(fs.readFileSync(path.join(I18N, 'wiki', 'en.json'), 'utf8'));
console.log('wiki-no:', Object.keys(noW).length, 'статей, miss:', Object.keys(enW).filter(k => !(k in noW)).length);
