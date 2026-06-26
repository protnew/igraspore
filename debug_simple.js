const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('LOG:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('EXCEPTION:', err.toString()));
    
    try {
        await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/index.html', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 1000));
        let typeOfLoop = await page.evaluate(() => typeof loop);
        let typeOfInitMenu = await page.evaluate(() => typeof initMenu);
        console.log('typeof loop:', typeOfLoop);
        console.log('typeof initMenu:', typeOfInitMenu);
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
