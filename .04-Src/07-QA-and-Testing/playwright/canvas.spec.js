import { test, expect } from '@playwright/test';

test.describe('Canvas Visual Regression Testing', () => {
  test('should render the game canvas and match screenshot', async ({ page }) => {
    await page.goto('/');

    // Wait for the canvas to be attached to the DOM
    const canvas = page.locator('canvas#c');
    await canvas.waitFor({ state: 'attached', timeout: 15000 });

    // Wait for a little bit to let initial rendering settle (e.g., gradients or initial UI)
    await page.waitForTimeout(2000); 

    // Take a screenshot of the canvas and match with baseline
    await expect(page).toHaveScreenshot('game-canvas.png', {
      maxDiffPixels: 2000,
      animations: 'disabled'
    });
  });

  test('should render the UI overlays on top of canvas', async ({ page }) => {
    await page.goto('/');
    
    // Wait for canvas
    const canvas = page.locator('canvas#c');
    await canvas.waitFor({ state: 'attached', timeout: 15000 });

    // Wait for main menu to appear (menuO)
    const menuO = page.locator('#menuO');
    await expect(menuO).toHaveClass(/show/);

    // Take full page screenshot
    await expect(page).toHaveScreenshot('full-page-ui.png', {
      maxDiffPixels: 2000,
      animations: 'disabled'
    });
  });
});
