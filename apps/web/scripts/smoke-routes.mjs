import process from "node:process";
import { chromium } from "playwright";

const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const routes = [
  { path: "/", label: "dashboard", text: "Delivery Intelligence Dashboard" },
  { path: "/pr-workspace", label: "pr-workspace", text: "PR Workspace", afterLoad: waitForPrWorkspaceOptions },
  { path: "/release-center", label: "release-center", text: "Release Center", afterLoad: waitForReleaseData },
  { path: "/policy-center", label: "policy-center", text: "Policy Center", afterLoad: waitForPolicyEvaluation },
];

async function waitForPrWorkspaceOptions(page) {
  await page.locator("select").waitFor({ state: "visible", timeout: 30000 });
  await page.waitForFunction(() => {
    const selectElement = document.querySelector("select");
    return Boolean(selectElement && selectElement.querySelectorAll("option").length > 0);
  });
}

async function waitForReleaseData(page) {
  await page.getByText("Readiness Score", { exact: false }).waitFor({ state: "visible", timeout: 30000 });
}

async function waitForPolicyEvaluation(page) {
  await page.getByText("Evaluation Result", { exact: false }).waitFor({ state: "visible", timeout: 30000 });
}

async function verifyRoute(page, route) {
  const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: "domcontentloaded" });
  if (!response || !response.ok()) {
    throw new Error(`Route ${route.label} failed to load: ${response?.status() ?? "no response"}`);
  }

  await page.waitForLoadState("networkidle");
  await page.getByText(route.text, { exact: false }).first().waitFor({ state: "visible", timeout: 30000 });

  if (route.afterLoad) {
    await route.afterLoad(page);
  }
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    for (const route of routes) {
      console.log(`Checking ${route.label} at ${route.path}`);
      await verifyRoute(page, route);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
