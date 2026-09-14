
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://igraspore.pages.dev/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);
  const start = await page.evaluate(() => (typeof settings!=='undefined' ? settings.renderMode : 'no-settings'));
  await page.evaluate(() => { if (typeof startGame==='function') startGame(false); });
  await page.waitForTimeout(1500);
  const afterStart = await page.evaluate(() => settings.renderMode);
  const seq = [afterStart];
  for (let i=0;i<3;i++){
    await page.evaluate(() => toggleRenderModeLarge());
    seq.push(await page.evaluate(() => settings.renderMode));
  }
  const btn = await page.evaluate(() => {
    const b = document.getElementById('renderModeBtn');
    return b ? {text: b.innerText, cls: b.className} : null;
  });
  console.log(JSON.stringify({start, afterStart, seq, btn, hasDrawBio: await page.evaluate(() => typeof drawBioicon)}));
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
