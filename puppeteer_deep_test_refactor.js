const puppeteer = require('puppeteer');

(async () => {
    console.log('Starting Deep E2E verification for Refactoring...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if(msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
    });
    page.on('pageerror', err => {
        console.log('BROWSER EXCEPTION:', err.toString());
        process.exit(1);
    });

    try {
        await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/index.html', { waitUntil: 'domcontentloaded' });
        
        console.log('1. Verifying global variables from splitted files...');
        const globals = await page.evaluate(() => {
            return {
                initWorld: typeof window.initWorld,
                spawnOrg: typeof window.spawnOrg,
                aiOrg: typeof window.aiOrg,
                drawBody: typeof window.drawBody,
                buildWiki: typeof window.buildWiki,
                loop: typeof window.loop,
                PW: typeof window.PW
            };
        });
        
        console.log('Globals status:', globals);
        for(let key in globals) {
            if(globals[key] === 'undefined') {
                throw new Error(`Global ${key} is undefined! Refactoring broke the scope.`);
            }
        }
        
        console.log('2. Menu Setup...');
        await page.waitForSelector('#startBtn', {visible: true, timeout: 5000});
        
        console.log('3. Starting Game...');
        await page.click('#startBtn');
        await new Promise(r => setTimeout(r, 2000));
        
        console.log('4. Checking Organisms Count...');
        const orgsCount = await page.evaluate(() => window.orgs.length);
        console.log('Total orgs spawned:', orgsCount);
        if(orgsCount < 100) throw new Error('Not enough organisms spawned!');

        console.log('TEST RESULT: ALL DEEP TESTS PASSED.');
    } catch (e) {
        console.error('Test failed:', e);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
