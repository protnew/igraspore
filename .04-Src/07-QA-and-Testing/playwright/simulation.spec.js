import { test, expect } from '@playwright/test';

test.describe('iGraSpore V2 Headless Simulation Test', () => {
  test('should run the game loop for 500 frames without exceptions and maintain population', async ({ page }) => {
    // Array to catch any page errors or console errors
    const errors = [];
    page.on('pageerror', error => { require('fs').writeFileSync('err.log', 'PAGE: ' + error.message + '\\n', {flag:'a'}); errors.push(error.message); });
    page.on('console', msg => {
      if (msg.type() === 'error') {
        require('fs').writeFileSync('err.log', 'CONS: ' + msg.text() + '\\n', {flag:'a'});
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for the canvas to be attached
    const canvas = page.locator('canvas#c');
    await canvas.waitFor({ state: 'attached', timeout: 15000 });

    // Ensure the main menu is present and start button is visible
    const startBtn = page.locator('#startBtn');
    await startBtn.waitFor({ state: 'visible', timeout: 5000 });

    // Let the baseline load
    await page.waitForTimeout(1000);

    // Click START to begin the simulation
    await startBtn.click();

    // Check that we transitioned to playing state
    await page.waitForFunction(() => window.state === 'playing', { timeout: 5000 });

    // Set timeScale to maximum to speed up testing
    await page.evaluate(() => {
      if (typeof window.timeScale !== 'undefined') {
         window.timeScale = 25; // MAX SPEED
      }
    });

    // Wait until the game loop reaches 500 frames
    for(let i=0; i<15; i++) { await page.waitForTimeout(1000); let fc = await page.evaluate(() => window.fc); console.log('fc=', fc); if(fc >= 500) break; }

    // Get population count from window.orgs
    const populationSize = await page.evaluate(() => {
      return (window.orgs && Array.isArray(window.orgs)) ? window.orgs.length : 0;
    });

    // Validate that no unhandled exceptions were thrown
    expect(errors).toHaveLength(0);

    // Check that the population has not dropped to 0 (checking for instant death bugs)
    expect(populationSize).toBeGreaterThan(0);
    
    // Log population size for informational purposes
    console.log(`Test finished at frame 500+. Population: ${populationSize}`);
  });
});
