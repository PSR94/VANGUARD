import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const outputDir = path.resolve(process.cwd(), "../../docs/assets/screenshots");

const shots = [
  { route: "/", file: "dashboard.png", waitFor: { type: "text", value: "Delivery Intelligence Dashboard" } },
  { route: "/pr-workspace", file: "pr-workspace.png", waitFor: { type: "text", value: "PR Workspace" }, afterLoad: analyzePrWorkspace },
  { route: "/release-center", file: "release-center.png", waitFor: { type: "text", value: "Release Center" } },
  { route: "/policy-center", file: "policy-center.png", waitFor: { type: "text", value: "Policy Center" } }
];

async function waitForPageReady(page, waitFor) {
  await page.waitForLoadState("networkidle");
  if (waitFor?.type === "text") {
    await page.getByText(waitFor.value, { exact: false }).first().waitFor({ state: "visible", timeout: 30000 });
  }
}

async function analyzePrWorkspace(page) {
  const select = page.locator("select");
  await select.waitFor({ state: "visible", timeout: 30000 });
  await page.waitForFunction(() => {
    const selectElement = document.querySelector("select");
    return Boolean(selectElement && selectElement.querySelectorAll("option").length > 0);
  });
  await select.selectOption({ index: 0 });
  const analyzeButton = page.getByRole("button", { name: /analyze/i });
  await analyzeButton.waitFor({ state: "visible", timeout: 30000 });
  await Promise.all([
    page.waitForResponse(
      (response) => response.url().includes("/api/v1/pull-requests/") && response.url().includes("/analyze") && response.ok(),
      { timeout: 30000 }
    ),
    analyzeButton.click()
  ]);
  await page.getByText("Risk and Evidence", { exact: false }).waitFor({ state: "visible", timeout: 30000 });
}

async function capture(page, route, file) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
  const shot = shots.find((item) => item.file === file);
  await waitForPageReady(page, shot?.waitFor);
  if (shot?.afterLoad) {
    await shot.afterLoad(page);
  }
  await page.screenshot({
    path: path.join(outputDir, file),
    fullPage: true
  });
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  try {
    for (const shot of shots) {
      console.log(`Capturing ${shot.file} from ${shot.route}`);
      await capture(page, shot.route, shot.file);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
