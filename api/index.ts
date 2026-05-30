import { serve } from "bun";
import { screenshot, generatePDF, devices } from "./lib/utils";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function res(body: BodyInit | null, init: ResponseInit = {}): Response {
  return new Response(body, {
    ...init,
    headers: { ...CORS, ...(init.headers as Record<string, string> ?? {}) },
  });
}

function json(data: unknown, status = 200): Response {
  return res(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function bool(val: string | null, def = false): boolean {
  if (val === null) return def;
  return val === "true" || val === "1";
}

function num(val: string | null, def: number, min = -Infinity, max = Infinity): number {
  const n = val !== null ? Number(val) : def;
  const safe = isNaN(n) ? def : n;
  return Math.min(Math.max(safe, min), max);
}

function validEnum<T extends string>(val: string | null, allowed: T[], def: T): T {
  return (allowed as string[]).includes(val ?? "") ? (val as T) : def;
}

serve({
  port: 3000,
  async fetch(req) {
    const u = new URL(req.url);
    const method = req.method.toUpperCase();
    const path = u.pathname;
    const p = u.searchParams;

    if (method === "OPTIONS") return res(null, { status: 204 });

    // ─── Health ────────────────────────────────────────────────────────────
    if (path === "/health") {
      return json({ status: "ok", version: "2.0.0", uptime: process.uptime() });
    }

    // ─── List devices ──────────────────────────────────────────────────────
    if (path === "/devices") {
      return json(Object.keys(devices).sort());
    }

    // ─── PDF ───────────────────────────────────────────────────────────────
    if (path === "/pdf") {
      const url = p.get("url");
      if (!url) return json({ error: "Missing required parameter: url" }, 400);

      try {
        const pdfBuffer = await generatePDF({
          url,
          pageFormat: validEnum(p.get("pageFormat"), ["A4", "A3", "Letter", "Legal"], "A4"),
          landscape: bool(p.get("landscape")),
          scale: num(p.get("scale"), 1, 0.1, 2),
          timeout: num(p.get("timeout"), 20000, 5000, 60000),
        });

        return res(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="screenshot.pdf"`,
          },
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return json({ error: "PDF generation failed", message: msg }, 500);
      }
    }

    // ─── Screenshot (primary + legacy `/`) ────────────────────────────────
    const isScreenshotRoute = path === "/screenshot" || path === "/";
    if (!isScreenshotRoute) return json({ error: "Not Found" }, 404);

    const url = p.get("url");
    if (!url) return json({ error: "Missing required parameter: url" }, 400);

    let viewport: { width: number; height: number } | undefined;
    const vp = p.get("viewport");
    if (vp) {
      const parts = vp.split("x").map(Number);
      if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
        viewport = { width: parts[0], height: parts[1] };
      }
    }

    const browser  = validEnum(p.get("browser"),    ["chromium", "firefox", "webkit"], "chromium");
    const format   = validEnum(p.get("format"),      ["png", "jpeg", "webp"],           "png");
    const waitUntil = validEnum(p.get("waitUntil"), ["load", "networkidle", "domcontentloaded", "commit"], "networkidle");

    try {
      const result = await screenshot({
        url,
        browser,
        format,
        quality:         num(p.get("quality"),  90,    1,     100),
        fullPage:        bool(p.get("fullPage"), true),
        viewport:        viewport ?? { width: 1920, height: 1080 },
        device:          p.get("device") ?? undefined,
        darkMode:        bool(p.get("darkMode")),
        waitUntil,
        delay:           num(p.get("delay"),    0,     0,     10000),
        timeout:         num(p.get("timeout"),  15000, 5000,  30000),
        omitBackground:  bool(p.get("omitBackground")),
        scale:           num(p.get("scale"),    1,     1,     3),
      });

      const mime = format === "jpeg" ? "image/jpeg" : "image/png";

      return res(result.image, {
        headers: {
          "Content-Type": mime,
          "X-Screenshot-Time-Ms": String(result.elapsed),
          "X-Page-Title": encodeURIComponent(result.title),
          "X-Browser-Used": browser,
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      return json({ error: "Screenshot failed", message: msg }, 500);
    }
  },
});

console.log("🎭 Playwright Screenshot API  →  http://localhost:3000");
console.log("   /screenshot  – capture page as PNG/JPEG/WebP");
console.log("   /pdf         – convert page to PDF");
console.log("   /devices     – list device presets");
console.log("   /health      – server status");
