// v25 задача 3b: L4-L8 полные словари (50 языков) — каждый целым JSON от en.json
const fs = require('fs');
const en = JSON.parse(fs.readFileSync('.04-Src/i18n/en.json', 'utf8'));
const L = JSON.parse(fs.readFileSync('.04-Src/i18n/languages.json', 'utf8'));

function full(code, native, translations) {
  const d = Object.assign({}, en);
  for (const k in translations) d[k] = translations[k];
  fs.writeFileSync('.04-Src/i18n/' + code + '.json', JSON.stringify(d, null, 2) + '\n');
  const meta = L.find(x => x.code === code);
  if (meta) { meta.enabled = false; meta.readyForReview = true; }
  console.log(code + ': ' + Object.keys(d).length + ' кл., переведено: ' + Object.keys(translations).length);
}

function common(o) {
  const r = {};
  const map = {
    start:'start', demo:'demo', help:'help', aq:'aquarium', resume:'resume',
    set:'set', setT:'settingsT', lang:'setLang', menuSub:'menuSub', poolWill:'poolWill',
    diffE:'diffE', diffN:'diffN', diffH:'diffH', exitAsk:'exitAsk', exitMsg:'exitMsg',
    yes:'yes', no:'no', more:'more', deadY:'deadYours', alive:'aliveWord',
    deadO:'deadOther', dS:'dStarve', dE:'dEaten', dT:'dTemp', dA:'dAge',
    dL:'dLysis', dC:'dCull', err:'errGeneric', errA:'errAsync',
    load:'loadingWorld', eco:'economy', camFly:'camFlyTouch',
    roleOk:'roleOk', roleWho:'roleWho', food:'roleFood',
    top:'topOfList', spW:'speciesWord', close:'close', clear:'clear',
    restart:'restart', play:'play', next:'next', skip:'skip',
    wikiT:'wikiT', search:'wiki.searchPh',
    s0:'season0', s1:'season1', s2:'season2', s3:'season3',
    spO:'speciesShown.other', cO:'coloniesCount.other', aO:'aliveCount.other'
  };
  for (const short in map) { if (o[short] !== undefined) r[map[short]] = o[short]; }
  return r;
}

const langs = require('./v25_l4_l8_data.json');
for (const [code, native, translations] of langs) {
  full(code, native, common(translations));
}
console.log('L4-L8: ' + langs.length + ' полных словарей готовы');
