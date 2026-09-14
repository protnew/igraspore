const { chromium } = require('playwright');
const wait = ms => new Promise(r => setTimeout(r, ms));
const ssDir = 'C:/Obsidian/New/Projects/08-iGraSpore_V2/03-Design-and-Assets/qa-screenshots/species_grid';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 400, height: 600 } });
  
  await page.goto('https://igraspore.pages.dev/?cb=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await wait(3000);
  
  // Get all species names
  const species = await page.evaluate(() => {
    var arr = [];
    for (var i = 0; i < SPECIES_DB.length; i++) {
      arr.push({ id: i, name: SPECIES_DB[i].name, cat: SPECIES_DB[i].cat, shape: SPECIES_DB[i].shape });
    }
    return arr;
  });
  
  // For each species: start game, get the pickShape result, take screenshot
  let results = [];
  for (var i = 0; i < species.length; i++) {
    const sp = species[i];
    const pickResult = await page.evaluate((sp) => {
      var fakeOrg = { sp: { name: sp.name, cat: sp.cat, shape: sp.shape } };
      var shape = pickShape(fakeOrg, sp.shape);
      return shape;
    }, sp);
    
    results.push({ id: sp.id, name: sp.name, cat: sp.cat, shape: pickResult });
  }
  
  // Print results
  console.log('ID|Name|Shape');
  for (var i = 0; i < results.length; i++) {
    console.log(results[i].id + '|' + results[i].name + '|' + results[i].shape);
  }
  
  // Count shape distribution
  var counts = {};
  results.forEach(r => { counts[r.shape] = (counts[r.shape]||0) + 1; });
  console.log('\n=== SHAPE DISTRIBUTION ===');
  Object.keys(counts).sort((a,b) => counts[b]-counts[a]).forEach(k => {
    console.log(k + ': ' + counts[k]);
  });
  
  // Colony species specifically
  console.log('\n=== COLONY SPECIES CHECK ===');
  results.filter(r => r.name.match(/Volvox|Nostoc|Microcystis|Gloeocapsa|Scenedesmus|Chroococcidiopsis/))
    .forEach(r => console.log(r.name + ' → ' + r.shape));
  
  await browser.close();
})().catch(e=>{console.error('FATAL:',e.message);process.exit(1);});
