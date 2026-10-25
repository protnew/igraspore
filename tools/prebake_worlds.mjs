// Детерминированные миры: 8 на сложность, seed. Запуск при живом стенде GATE_BASE_URL.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../.04-Src/node_modules/playwright');
const base = process.env.GATE_BASE_URL || 'http://127.0.0.1:8821';
const outDir = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', '.04-Src/js/data/worlds');
const diffs = ['easy', 'normal', 'hard'];
const SEEDS = [110351, 246353, 390451, 512927, 678901, 812347, 934567, 102938];
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext()).newPage();
await page.goto(base + '/?lang=en&t=' + Date.now(), { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(1500);
for (const diff of diffs) {
  for (let k = 0; k < SEEDS.length; k++) {
    const rows = await page.evaluate(`(function(){
      function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
      difficulty=${JSON.stringify(diff)};
      var prev=Math.random;
      Math.random=mulberry32(${SEEDS[k]});
      window._chunkPop=false; window._popQueue=null; window.TEST_POOL=0;
      initWorld();
      Math.random=prev;
      var rows=[];
      for(var i=0;i<orgs.length;i++){
        var o=orgs[i]; if(!o||o.isPlayer) continue;
        rows.push([o.sp.id|0, Math.round(o.x), Math.round(o.y)]);
      }
      return rows;
    })()`);
    const file = path.join(outDir, diff + '-' + k + '.json');
    fs.writeFileSync(file, JSON.stringify(rows));
    const kb = fs.statSync(file).size / 1024;
    console.log(diff, k, 'orgs', rows.length, 'kb', kb.toFixed(1));
    if (kb > 300) throw new Error('file over 300KB ' + file);
  }
}
await browser.close();
console.log('BAKE OK');
