/**
 * Captures marketing screenshots of the running app into public/screenshots.
 * Prereq: production or dev server on http://localhost:3210
 * Run:    node scripts/capture-screenshots.mjs
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3210";
const OUT = "public/screenshots";
mkdirSync(OUT, { recursive: true });

const DARK_PREFS = JSON.stringify({
  state: { themeMode: "dark", numberStyle: "exact" },
  version: 0,
});

async function newPage(browser, { dark = false } = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: dark ? "dark" : "light",
  });
  if (dark) {
    await context.addInitScript((prefs) => {
      window.localStorage.setItem("makesense-preferences", prefs);
    }, DARK_PREFS);
  }
  const page = await context.newPage();
  return { context, page };
}

async function settle(page) {
  // Let entrance animations and charts finish before capturing.
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1800);
}

const browser = await chromium.launch();

// 1. Dashboard, light.
{
  const { context, page } = await newPage(browser);
  await page.goto(`${BASE}/dashboard`);
  await settle(page);
  await page.screenshot({ path: `${OUT}/dashboard.png` });
  await context.close();
  console.log("dashboard.png");
}

// 2. Models gallery, light.
{
  const { context, page } = await newPage(browser);
  await page.goto(`${BASE}/models`);
  await settle(page);
  await page.screenshot({ path: `${OUT}/models.png` });
  await context.close();
  console.log("models.png");
}

// 3. Workspace cash-flow tab, dark.
{
  const { context, page } = await newPage(browser, { dark: true });
  await page.goto(`${BASE}/models`);
  await settle(page);
  const firstModel = page.locator('a[href^="/models/"]').first();
  await firstModel.click();
  await page.waitForURL(/\/models\/[^/]+$/);
  await settle(page);
  await page.getByRole("tab", { name: /cash flow/i }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/workspace-cashflow-dark.png` });
  await context.close();
  console.log("workspace-cashflow-dark.png");
}

// 4. Report page, light.
{
  const { context, page } = await newPage(browser);
  await page.goto(`${BASE}/models`);
  await settle(page);
  const firstModel = page.locator('a[href^="/models/"]').first();
  await firstModel.click();
  await page.waitForURL(/\/models\/[^/]+$/);
  await page.getByRole("link", { name: /report/i }).first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/report.png`, fullPage: false });
  await context.close();
  console.log("report.png");
}

// 5. Break-even calculator, light.
{
  const { context, page } = await newPage(browser);
  await page.goto(`${BASE}/break-even-calculator`);
  await settle(page);
  await page.screenshot({ path: `${OUT}/calculator.png` });
  await context.close();
  console.log("calculator.png");
}

await browser.close();
console.log("done");
