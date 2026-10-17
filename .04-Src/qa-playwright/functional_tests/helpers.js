// iGraSpore V2 — Comprehensive Functional Test (60 elements)
const { test: base, expect } = require('@playwright/test');
const GAME_URL = 'https://protnew.github.io/igraspore/';
const SS = 'screenshots';
const DESKTOP = { width: 1400, height: 900 };
const MOBILE = { width: 375, height: 812 };

async function waitForGame(page) {
  await page.waitForSelector('#c', { state: 'visible' });
  await page.waitForFunction(() => typeof SPECIES_DB !== 'undefined', { timeout: 15000 });
  await page.waitForTimeout(1000);
}

async function startGame(page) {
  // Click start button to begin game
  const startBtn = page.locator('#startBtn');
  if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(1000);
  }
  // Skip tutorial — try multiple approaches
  await page.evaluate(() => {
    // Direct call to skip tutorial if function exists
    if (typeof skipTutorial === 'function') skipTutorial();
    if (typeof tutorialStep !== 'undefined') tutorialStep = 999;
    if (typeof hideTutorial === 'function') hideTutorial();
    // Hide tutorial overlay
    var tuts = document.querySelectorAll('[class*="tutorial"], [id*="tutorial"], [id*="tut"]');
    tuts.forEach(t => t.style.display = 'none');
  }).catch(() => {});
  await page.waitForTimeout(300);
  // Also try clicking skip button quickly
  try {
    const skip = page.locator('text=Пропустить').first();
    await skip.click({ timeout: 1000 });
  } catch (e) {}
  // Verify game started
  await page.waitForFunction(() => typeof state !== 'undefined' && (state === 'playing' || state === 'menu' || typeof orgs !== 'undefined'), { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
}

async function skipTutorial(page) {
  return startGame(page);
}

async function getGameState(page) {
  return await page.evaluate(() => ({
    orgCount: orgs ? orgs.length : 0,
    aliveCount: orgs ? orgs.filter(o => o.alive).length : 0,
    playerExists: typeof player !== 'undefined' && player !== null,
    playerSpecies: player ? (player.sp ? player.sp.name : null) : null,
    dayLight: typeof dayLight !== 'undefined' ? dayLight : 0,
    tod: typeof tod !== 'undefined' ? tod : 0,
    season: typeof season !== 'undefined' ? season : 0,
    zoom: typeof zoom !== 'undefined' ? zoom : 1,
    state: typeof state !== 'undefined' ? state : 'unknown',
  }));
}

async function switchToSpecies(page, index) {
  await page.evaluate((idx) => {
    if (typeof SPECIES_DB !== 'undefined' && SPECIES_DB[idx] && typeof player !== 'undefined' && player) {
      player.sp = SPECIES_DB[idx];
      player.species = idx;
      player.size = SPECIES_DB[idx].size || 5;
      player.energy = 80;
    }
  }, index);
}

const test = base.extend({});
test.describe.configure({ mode: 'default' });

module.exports = { test, expect, GAME_URL, SS, DESKTOP, MOBILE,
  waitForGame, startGame, skipTutorial, getGameState, switchToSpecies };
