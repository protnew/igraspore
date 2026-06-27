const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER EXCEPTION:', err.toString()));
  
  console.log('Loading page...');
  await page.goto('file://' + __dirname.replace(/\\/g, '/').replace('/scratch', '') + '/index.html', { timeout: 15000 });
  console.log('Page loaded!');
  await browser.close();
})();
