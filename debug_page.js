const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  console.log('Loading page...');
  try {
    await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/index.html', {timeout: 5000});
  } catch(e) {
    console.log('Goto error:', e.message);
  }
  await new Promise(r => setTimeout(r, 2000)); // wait a bit to catch errors
  await browser.close();
})();
