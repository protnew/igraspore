
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(__dirname);
  const cleanDir = path.join(outDir, '_clean_svg');
  const rawDir = path.join(outDir, '_raw');
  fs.mkdirSync(rawDir, { recursive: true });
  const shapes = fs.readdirSync(cleanDir).filter(f => f.endsWith('.svg')).map(f => f.replace(/\.svg$/,''));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 1100 }, deviceScaleFactor: 2 });

  for (const shape of shapes) {
    const svgPath = path.join(cleanDir, shape + '.svg');
    let svg = fs.readFileSync(svgPath, 'utf8');
    // ensure xmlns
    if (!/xmlns=/.test(svg)) {
      svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    // strip xml declaration issues
    svg = svg.replace(/<\?xml[^>]*\?>/, '');
    const html = `<!doctype html><html><head><style>
      html,body{margin:0;padding:0;background:transparent}
      #box{width:1000px;height:1000px;display:flex;align-items:center;justify-content:center;background:transparent}
      #box svg{max-width:960px;max-height:960px;width:auto;height:auto}
    </style></head><body><div id="box">${svg}</div></body></html>`;
    await page.setContent(html, { waitUntil: 'load', timeout: 120000 });
    // wait fonts/images inside svg
    await page.waitForTimeout(300);
    const box = page.locator('#box');
    const shot = path.join(rawDir, shape + '.png');
    await box.screenshot({ path: shot, omitBackground: true });
    const st = fs.statSync(shot);
    console.log('RASTER', shape, st.size);
  }
  await browser.close();
  console.log('DONE', shapes.length);
})().catch(e => { console.error(e); process.exit(1); });
