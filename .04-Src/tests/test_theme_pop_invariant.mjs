/**
 * Theme must not change organism population (classic vs neon-bio).
 * Run: cd /workspace/kqt && node /workspace/igraspore/.04-Src/tests/test_theme_pop_invariant.mjs
 * Expects IGS_BASE (default http://127.0.0.1:8820/index.html).
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (e1) {
  try {
    ({ chromium } = require("/workspace/kqt/node_modules/playwright"));
  } catch (e2) {
    throw e1;
  }
}

const BASE = process.env.IGS_BASE || "http://127.0.0.1:8820/index.html";

async function measure(theme) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto(`${BASE}?themePond=${theme}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => typeof startGame === "function" && typeof SPECIES_DB !== "undefined");
  const result = await page.evaluate(async (theme) => {
    let s = 42 >>> 0;
    Math.random = function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return (s >>> 0) / 4294967296;
    };
    if (window.igsThemeEngine && window.igsThemeEngine.applyThemePond) {
      window.igsThemeEngine.applyThemePond(theme);
    }
    document.body.setAttribute("data-theme-pond", theme);
    ["menuO", "introO"].forEach((id) => {
      const e = document.getElementById(id);
      if (e) { e.className = "ov"; e.style.display = "none"; }
    });
    document.body.classList.remove("in-menu");
    if (typeof settings !== "undefined" && settings) {
      settings.renderMode = theme === "classic" ? "cartoon" : "swiss";
    }
    startGame(false);
    state = "playing";
    const io = document.getElementById("introO");
    if (io) io.className = "ov";
    await new Promise((r) => setTimeout(r, 2800));
    const n = Array.isArray(orgs) ? orgs.length : -1;
    const alive = Array.isArray(orgs) ? orgs.filter((o) => o && o.alive !== false).length : -1;
    return { theme, n, alive };
  }, theme);
  await browser.close();
  return result;
}

const classic = await measure("classic");
const neon = await measure("neon-bio");
const delta = Math.abs(classic.n - neon.n);
const ok = classic.n >= 200 && neon.n >= 200 && delta <= 15;
console.log(JSON.stringify({ classic, neon, delta, ok }, null, 2));
if (!ok) {
  console.error("FAIL: theme changed population (or pop too low)");
  process.exit(1);
}
console.log("PASS: theme does not materially affect population");
