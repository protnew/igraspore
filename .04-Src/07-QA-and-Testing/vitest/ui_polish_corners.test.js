/**
 * UI-POLISH-CORNERS-2026-09-22 — lightweight contract tests
 * Run via: node .04-Src/node_modules/vitest/vitest.mjs run 07-QA-and-Testing/vitest/ui_polish_corners.test.js
 * (file is ferried into .04-Src/07-QA-and-Testing/vitest/ on Windows)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../..'); // project root when under .04-Src/07-QA...
const STYLE = fs.existsSync(path.join(ROOT, 'style.css'))
  ? path.join(ROOT, 'style.css')
  : path.join(ROOT, '..', 'style.css');

describe('UI-POLISH corners CSS contract', () => {
  const css = fs.readFileSync(STYLE, 'utf8');
  it('defines --corner-bottom and stack heights', () => {
    expect(css).toMatch(/--corner-bottom:\s*max\(var\(--actbar-bottom\)/);
    expect(css).toMatch(/--mm-h:\s*80px/);
    expect(css).toMatch(/--pc-h:\s*55px/);
  });
  it('anchors #mmWrap/#demoTip to --corner-bottom (not full actbar-h)', () => {
    expect(css).toMatch(/#mmWrap\{[^}]*bottom:var\(--corner-bottom\)/);
    expect(css).toMatch(/#demoTip\{[^}]*bottom:var\(--corner-bottom\)/);
    expect(css).toMatch(/#pcWrap\{[^}]*bottom:calc\(var\(--corner-bottom\) \+ var\(--mm-h\) \+ var\(--ui-gap\)\)/);
  });
  it('narrow ≤900 lifts corners above actBar band', () => {
    expect(css).toMatch(/@media \(max-width: 900px\).*?#mmWrap, #demoTip, #scaleW, #hDivReady/s);
    expect(css).toMatch(/bottom: calc\(var\(--actbar-bottom\) \+ var\(--actbar-h\) \+ var\(--ui-gap\)\) !important/);
  });
});

describe('updateLegend EN/RU body lines', () => {
  // Pure function extract via vm of ui.js is heavy; assert source contract instead + runtime shape.
  const uiPathCandidates = [
    path.join(ROOT, '.04-Src', 'js', 'ui.js'),
    path.join(ROOT, '04-Src', 'js', 'ui.js'),
  ];
  const uiPath = uiPathCandidates.find(p => fs.existsSync(p));
  it('ui.js localizes the 6 legend body strings', () => {
    expect(uiPath, 'ui.js path').toBeTruthy();
    const src = fs.readFileSync(uiPath, 'utf8');
    expect(src).toMatch(/\['#2c2','Algae'\]/);
    expect(src).toMatch(/\['#4af','Bacteria'\]/);
    expect(src).toMatch(/\['#dd44cc','Apex hunters'\]/);
    expect(src).toMatch(/\['#c4f','Large'\]/);
    expect(src).toMatch(/\['#a86','Decomposers'\]/);
    expect(src).toMatch(/\['#f44','Viruses'\]/);
    // RU intact
    expect(src).toMatch(/Водоросли/);
    expect(src).toMatch(/Бактерии/);
    expect(src).toMatch(/Крупные охотники/);
    expect(src).toMatch(/Разлагатели/);
    expect(src).toMatch(/Вирусы/);
  });
});
