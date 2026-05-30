# Playwright Screenshot API

Bun HTTP server that wraps Playwright's browser automation into a simple REST interface.

**Base URL (production):** `https://bss.glasscube.uz`  
**Base URL (local):** `http://localhost:3000`

---

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/screenshot` | Capture a page as PNG, JPEG, or WebP |
| `GET` | `/pdf` | Export a page as a PDF document |
| `GET` | `/devices` | List all supported Playwright device presets |
| `GET` | `/health` | Server status and uptime |

Legacy: `GET /` is aliased to `/screenshot` for backward compatibility.

---

## `GET /screenshot`

Captures a screenshot of any public URL with full Playwright option support.

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `url` | string | **required** | Target URL (must include protocol, e.g. `https://`) |
| `browser` | `chromium` \| `firefox` \| `webkit` | `chromium` | Browser engine |
| `format` | `png` \| `jpeg` \| `webp` | `png` | Output image format |
| `quality` | number 1–100 | `90` | Compression quality (JPEG and WebP only) |
| `fullPage` | boolean | `true` | Capture entire scrollable page (`false` = viewport only) |
| `viewport` | `WxH` string | `1920x1080` | Viewport dimensions, e.g. `1280x800` |
| `device` | string | — | Playwright device preset (overrides `viewport`) |
| `darkMode` | boolean | `false` | Emulate `prefers-color-scheme: dark` |
| `scale` | number 1–3 | `1` | Device scale factor (2 = HiDPI, 3 = Retina) |
| `waitUntil` | `load` \| `networkidle` \| `domcontentloaded` | `networkidle` | Navigation wait condition |
| `delay` | number 0–10000 | `0` | Extra wait after load event (milliseconds) |
| `timeout` | number 5000–30000 | `15000` | Max navigation timeout (milliseconds) |
| `omitBackground` | boolean | `false` | Transparent background (PNG only) |

### Response headers

| Header | Value |
|---|---|
| `Content-Type` | `image/png` or `image/jpeg` |
| `X-Screenshot-Time-Ms` | Total time from request to image delivery (ms) |
| `X-Page-Title` | URL-encoded `<title>` text of the captured page |
| `X-Browser-Used` | Browser engine that was used |

### Examples

```bash
# Minimal — just provide a URL
curl "https://bss.glasscube.uz/screenshot?url=https://example.com" \
  --output screenshot.png

# Firefox + dark mode + JPEG quality 85
curl "https://bss.glasscube.uz/screenshot?url=https://example.com&browser=firefox&darkMode=true&format=jpeg&quality=85" \
  --output dark-firefox.jpg

# iPhone 15 Pro emulation
curl "https://bss.glasscube.uz/screenshot?url=https://example.com&device=iPhone+15+Pro" \
  --output iphone.png

# Viewport-only, HiDPI, WebKit
curl "https://bss.glasscube.uz/screenshot?url=https://example.com&browser=webkit&fullPage=false&scale=2" \
  --output hiDPI.png

# Slow page — increase timeout + add post-load delay
curl "https://bss.glasscube.uz/screenshot?url=https://example.com&timeout=25000&delay=2000" \
  --output patient.png

# Transparent PNG (for design tools)
curl "https://bss.glasscube.uz/screenshot?url=https://example.com&omitBackground=true" \
  --output transparent.png
```

---

## `GET /pdf`

Exports a web page as a PDF using Playwright's `page.pdf()`.

> **Note:** Only Chromium supports PDF generation in Playwright.

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `url` | string | **required** | Target URL |
| `pageFormat` | `A4` \| `A3` \| `Letter` \| `Legal` | `A4` | Paper format |
| `landscape` | boolean | `false` | Landscape orientation |
| `scale` | number 0.1–2 | `1` | Content scale factor |
| `timeout` | number | `20000` | Max navigation timeout (ms) |

### Examples

```bash
# A4 portrait PDF
curl "https://bss.glasscube.uz/pdf?url=https://example.com" \
  --output page.pdf

# Letter landscape
curl "https://bss.glasscube.uz/pdf?url=https://example.com&pageFormat=Letter&landscape=true" \
  --output landscape.pdf
```

---

## `GET /devices`

Returns a JSON array of all Playwright device names that can be passed as `device=` to `/screenshot`.

```bash
curl "https://bss.glasscube.uz/devices"
# → ["Desktop Chrome","Desktop Edge","Desktop Firefox","Desktop Safari","Galaxy S9+","iPad Mini","iPhone 15","iPhone 15 Pro", ...]
```

---

## `GET /health`

```bash
curl "https://bss.glasscube.uz/health"
# → { "status": "ok", "version": "2.0.0", "uptime": 1234.56 }
```

---

## Running locally

```bash
# Install dependencies
bun install

# Install browser binaries (first time only)
bunx playwright install chromium firefox webkit

# Start the server
bun run start
# → http://localhost:3000
```

---

## Error responses

All errors return JSON with an `error` and `message` field:

```json
{
  "error": "Screenshot failed",
  "message": "net::ERR_NAME_NOT_RESOLVED at https://notareal.domain"
}
```

| HTTP status | Meaning |
|---|---|
| `400` | Missing or invalid parameters |
| `500` | Browser/navigation error |
| `404` | Unknown route |

---

## CORS

All responses include `Access-Control-Allow-Origin: *` so the API can be called from any browser origin.
