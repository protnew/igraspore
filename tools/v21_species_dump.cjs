// v21: снимок списка видов {name, cat} со стенда
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext()).newPage();
  await p.goto((process.argv[2] || 'http://127.0.0.1:8821') + '/?lang=en', { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  const out = await p.evaluate('(function(){ return JSON.stringify(SPECIES_DB.map(function(s){return {name:s.name,cat:s.cat,locomotion:s.locomotion};})); })()');
  require('fs').writeFileSync(process.argv[3] || '09-Docs/out-dev-factory/eco-v21/species.json', out);
  console.log('species:', JSON.parse(out).length);
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
