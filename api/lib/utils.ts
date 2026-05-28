import { chromium } from "playwright";

export async function screenshot(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage(); // create new page
  try {
    // go to url and wait until page is loaded
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    // take screenshot as buffer
    const image = await page.screenshot({ fullPage: true }); // full scroll page
    await browser.close();
    return image;
  } catch (err) {
    await browser.close();
    throw err;
  }
}
