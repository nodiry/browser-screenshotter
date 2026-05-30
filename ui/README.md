# Playwright Screenshot UI

React + Vite frontend for the Playwright Screenshot API.

**Live:** [playwright.glasscube.uz](https://playwright.glasscube.uz)  
**API:** [bss.glasscube.uz](https://bss.glasscube.uz)

---

## Features

- **URL input** with one-click capture
- **Advanced Options panel** — exposes every Playwright feature:
  - Browser engine (Chromium / Firefox / WebKit)
  - Output format (PNG / JPEG / WebP) with quality slider
  - Full-page vs. viewport-only capture
  - Device scale factor (1× / 2× HiDPI / 3× Retina)
  - Viewport presets (Mobile / Tablet / Desktop / 4K) + custom
  - Device emulation (iPhone, iPad, Pixel, Galaxy…)
  - Dark mode emulation
  - Wait strategy (load / networkidle / domcontentloaded)
  - Extra delay + timeout controls
  - Transparent background (PNG)
- **"How it works" modal** — animated 6-step Playwright workflow (Framer Motion)
- **Screenshot preview** with browser-chrome frame, timing, and page title
- **Download** button and **copy cURL / API URL** actions
- **Inline API docs** — endpoint reference, parameter table, cURL / JS / Python examples

---

## Tech stack

| | |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI primitives) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Language | TypeScript |

---

## Development

```bash
# Install dependencies
npm install   # or: bun install

# Start dev server (http://localhost:5200)
npm run dev

# Production build (output → dist/)
npm run build

# Preview production build
npm run preview
```

### Environment variables

Create a `.env` file in the `ui/` directory:

```env
VITE_BASE_URL=https://bss.glasscube.uz
```

The default (`http://localhost:3000`) is used when the variable is absent.

---

## Project structure

```
ui/src/
├── App.tsx                      Main layout, state, capture logic
├── main.tsx                     Entry point with TooltipProvider
├── index.css                    Dark theme (violet accent), global styles
│
├── components/
│   ├── HowItWorksModal.tsx      Framer Motion animated 6-step flow modal
│   ├── AdvancedOptions.tsx      All Playwright options in an accordion panel
│   ├── ScreenshotPreview.tsx    Browser-chrome result view with actions
│   └── APIDocsSection.tsx       Inline API reference + tabbed code examples
│
└── components/ui/               shadcn/ui primitives
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── slider.tsx
    ├── switch.tsx
    ├── tabs.tsx
    └── tooltip.tsx
```

---

## Capture flow

1. User enters a URL and (optionally) adjusts options in the Advanced panel
2. `handleCapture()` in `App.tsx` builds the API URL with all params via `URLSearchParams`
3. `fetch()` is called against the API; the image blob is stored in object-URL state
4. `ScreenshotPreview` renders the result with browser chrome, timing, and download controls
5. On error, a red alert banner explains what went wrong
