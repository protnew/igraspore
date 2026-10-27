// v20.7: воспроизвести frameMasks из membrane.spec и посмотреть длины масок/XOR
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
const fs = require('fs');
const spec = fs.readFileSync('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/07-QA-and-Testing/playwright-v20/membrane.spec.js', 'utf8');

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto('http://127.0.0.1:8798/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForTimeout(2000);
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction('document.getElementById("introO").className==="ov show" || state==="playing"', null, { timeout: 10000 });
  await p.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  await p.waitForFunction('state==="playing"', null, { timeout: 5000 });
  await p.evaluate('window.skipTutorial && window.skipTutorial()');
  await p.evaluate('(function(){ zoom=14; tZoom=14; if(player){cam.x=player.x; cam.y=player.y;} timeScale=1; window.focusTimer=0; window.cinematicTime=1; })()');
  await p.waitForTimeout(1200);

  // вытащить frameMasks/xorRatio как в спеке (eval того же кода)
  const fmSrc = spec.slice(spec.indexOf('async function frameMasks'), spec.indexOf('function maskStats'));
  const xrSrc = spec.slice(spec.indexOf('function xorRatio'), spec.indexOf('test('));
  const mod = {};
  const factory = new Function('page', fmSrc.replace(/^async function frameMasks\(page\)\{/, 'return async function(page){') .replace(/\}$/, '}') + '\nreturn frameMasks;')();
  const xorFactory = new Function(xrSrc.replace(/^function xorRatio\(a, b\)\{/, 'return function(a,b){').replace(/\}$/, '}') + '\nreturn xorRatio;');
  const frameMasks = factory;
  const xorRatio = xorFactory();
  const masks = await frameMasks(p);
  const lens = masks.map(m => m.length);
  const ratios = [];
  for (let i = 1; i < masks.length; i++) ratios.push(xorRatio({ mask: masks[i-1] }, { mask: masks[i] }));
  console.log('mask lens:', JSON.stringify(lens));
  console.log('xor:', JSON.stringify(ratios));
  console.log('sample[0] first3:', JSON.stringify(masks[0] && masks[0].slice(0, 3)));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
