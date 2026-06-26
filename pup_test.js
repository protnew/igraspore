const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) console.error('PAGE HTTP ERROR:', response.status(), response.url());
  });

  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');
  console.log("Navigating to", fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  await browser.close();
})();
