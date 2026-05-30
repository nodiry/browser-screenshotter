import { chromium, firefox, webkit, devices } from "playwright";

export type ScreenshotOptions = {
  url: string;
  browser?: "chromium" | "firefox" | "webkit";
  format?: "png" | "jpeg" | "webp";
  quality?: number;
  fullPage?: boolean;
  viewport?: { width: number; height: number };
  device?: string;
  darkMode?: boolean;
  reducedMotion?: "reduce" | "no-preference";
  waitUntil?: "load" | "networkidle" | "domcontentloaded" | "commit";
  delay?: number;
  timeout?: number;
  omitBackground?: boolean;
  scale?: number;
};

export type PDFOptions = {
  url: string;
  pageFormat?: "A4" | "A3" | "Letter" | "Legal";
  landscape?: boolean;
  scale?: number;
  timeout?: number;
};

export type ScreenshotResult = {
  image: Buffer;
  title: string;
  elapsed: number;
};

export async function screenshot(opts: ScreenshotOptions): Promise<ScreenshotResult> {
  const browserType =
    opts.browser === "firefox" ? firefox :
    opts.browser === "webkit"  ? webkit  : chromium;

  const browser = await browserType.launch();

  const deviceDescriptor = opts.device ? devices[opts.device] : undefined;

  const contextOptions: Parameters<typeof browser.newContext>[0] = {
    colorScheme: opts.darkMode ? "dark" : "light",
    reducedMotion: opts.reducedMotion ?? "no-preference",
    deviceScaleFactor: opts.scale ?? 1,
    ...(deviceDescriptor ?? {}),
  };

  // Only override viewport if no device preset was chosen
  if (!deviceDescriptor) {
    contextOptions.viewport = opts.viewport ?? { width: 1920, height: 1080 };
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  try {
    const startTime = Date.now();

    await page.goto(opts.url, {
      waitUntil: opts.waitUntil ?? "networkidle",
      timeout: opts.timeout ?? 15000,
    });

    if (opts.delay && opts.delay > 0) {
      await page.waitForTimeout(Math.min(opts.delay, 10000));
    }

    const title = await page.title().catch(() => "");

    const screenshotOpts: Parameters<typeof page.screenshot>[0] = {
      fullPage: opts.fullPage ?? true,
      type: opts.format === "jpeg" ? "jpeg" :
            opts.format === "webp" ? "png"  : "png",
      omitBackground: opts.omitBackground ?? false,
    };

    // WebP: capture as PNG, note that Playwright doesn't natively output webp
    // We still pass quality for JPEG
    if (opts.format === "jpeg") {
      screenshotOpts.quality = opts.quality ?? 90;
    }

    const image = await page.screenshot(screenshotOpts);
    const elapsed = Date.now() - startTime;

    await browser.close();
    return { image, title, elapsed };
  } catch (err) {
    await browser.close();
    throw err;
  }
}

export async function generatePDF(opts: PDFOptions): Promise<Buffer> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(opts.url, {
      waitUntil: "networkidle",
      timeout: opts.timeout ?? 20000,
    });

    const pdfBuffer = await page.pdf({
      format: opts.pageFormat ?? "A4",
      landscape: opts.landscape ?? false,
      scale: Math.min(Math.max(opts.scale ?? 1, 0.1), 2),
      margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (err) {
    await browser.close();
    throw err;
  }
}

export { devices };
