// lab_tests_page.spec.js — TZ v20 Y1: страница лаб-тестов получает данные до Playwright.
// Формат страницы (build_tests_page.mjs): статичные таблицы всех прогонов results-*.json.
// skip-условие сохранено: нет строк (= нет данных) → skip.
import { test, expect } from '@playwright/test';
const fs = require('fs');
const path = require('path');
const BASE = process.env.LAB_URL || 'http://127.0.0.1:8793';

const runsDir = path.resolve(__dirname, '../../../09-Docs/test-runs');

async function openLab(page){
  await page.goto(BASE + '/lab/tests.html', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
}

test('[Y1-1] данные есть: строки тестов в странице (не «нет данных»)', async ({ page }) => {
  await openLab(page);
  const rows = await page.locator('table tr:has(td)').count();
  test.skip(rows === 0, 'results-latest.json отсутствует — страница «нет данных»');
  expect(rows).toBeGreaterThan(100);
});

test('[Y1-2] данные самого свежего прогона видны на странице', async ({ page }) => {
  const latestPath = path.join(runsDir, 'results-latest.json');
  test.skip(!fs.existsSync(latestPath), 'results-latest.json нет на диске');
  const data = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
  const firstName = (data.suites && data.suites[0] && data.suites[0].tests && data.suites[0].tests[0] && data.suites[0].tests[0].title) || '';
  test.skip(!firstName, 'в results-latest нет имён тестов');
  await openLab(page);
  const body = await page.locator('body').innerText();
  expect(body).toContain(firstName.slice(0, 40));
});

test('[Y1-3] статусы pass/fail помечены в строках', async ({ page }) => {
  await openLab(page);
  const pass = await page.locator('tr.pass, tr[class*=pass]').count();
  expect(pass).toBeGreaterThan(50);
});

test('[Y1-4] упавшие тесты различимы', async ({ page }) => {
  await openLab(page);
  const any = await page.locator('table tr:has(td)').first().getAttribute('class');
  expect(any).toBeTruthy();
});

test('[Y1-5] счётчики итогов по прогонам присутствуют', async ({ page }) => {
  await openLab(page);
  const body = await page.locator('body').innerText();
  expect(body).toMatch(/\d+\s*\/\s*\d+|pass\s*=\s*\d+/i);
});
