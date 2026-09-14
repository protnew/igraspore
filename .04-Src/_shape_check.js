const { chromium } = require('playwright');
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 200, height: 300 } });
  
  await page.goto('https://igraspore.pages.dev/?cb=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await wait(2000);
  
  // Check pickShape for ALL species
  const results = await page.evaluate(() => {
    var arr = [];
    for (var i = 0; i < SPECIES_DB.length; i++) {
      var sp = SPECIES_DB[i];
      var fakeOrg = { sp: sp };
      var shape = pickShape(fakeOrg, sp.shape);
      arr.push(i + '|' + sp.name + '|' + shape);
    }
    return arr;
  });
  
  results.forEach(r => console.log(r));
  
  await browser.close();
})().catch(e=>{console.error('FATAL:',e.message);process.exit(1);});
