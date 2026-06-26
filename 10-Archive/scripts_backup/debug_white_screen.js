const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
      console.log('BROWSER LOG:', msg.text());
  });
  page.on('pageerror', err => {
      console.log('BROWSER EXCEPTION:', err.toString());
  });
  
  try {
      console.log('Navigating to index.html...');
      await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/index.html', { waitUntil: 'domcontentloaded' });
      console.log('Page loaded completely!');
      
      await new Promise(r => setTimeout(r, 2000));
      let html = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
      console.log('Body HTML starts with:', html);
  } catch (e) {
      console.error('Test error:', e);
  } finally {
      await browser.close();
  }
})();
