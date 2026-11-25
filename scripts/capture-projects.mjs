import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("assets/source-images", { recursive: true });
const browser = await chromium.launch({ headless: true });
const projects = [
  ["swag", "https://swag-shopping-mall.vercel.app/"],
  ["sahara", "https://sahara-bill-book.web.app/"],
  ["aironix", "https://aironix-26.web.app/"],
];

for (const [name, url] of projects) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
    await page.waitForTimeout(name === "aironix" ? 22000 : 7000);
    await page.screenshot({
      path: `assets/source-images/${name}-screenshot.png`,
      animations: "disabled",
    });
    console.log(
      name,
      JSON.stringify({
        title: await page.title(),
        text: (await page.locator("body").innerText()).slice(0, 900),
      }),
    );
  } catch (error) {
    console.error(name, error.message);
  }
  await page.close();
}

await browser.close();
