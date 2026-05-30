import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Loader2,
  Globe,
  Sparkles,
  GitFork,
  ExternalLink,
  AlertCircle,
  BookOpen,
  Zap,
} from "lucide-react";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { AdvancedOptions, type Options } from "@/components/AdvancedOptions";
import { ScreenshotPreview } from "@/components/ScreenshotPreview";
import { APIDocsSection } from "@/components/APIDocsSection";
import { Badge } from "@/components/ui/badge";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";

const DEFAULT_OPTIONS: Options = {
  browser: "chromium",
  format: "png",
  quality: 90,
  fullPage: true,
  viewportW: 1920,
  viewportH: 1080,
  device: "",
  darkMode: false,
  waitUntil: "networkidle",
  delay: 0,
  timeout: 15000,
  omitBackground: false,
  scale: 1,
};

type CaptureResult = {
  imageUrl: string;
  apiUrl: string;
  elapsed: number | null;
  pageTitle: string | null;
};

function buildApiUrl(url: string, opts: Options): string {
  const params = new URLSearchParams({ url: url.trim() });
  params.set("browser", opts.browser);
  params.set("format", opts.format);
  if (opts.format !== "png") params.set("quality", String(opts.quality));
  params.set("fullPage", String(opts.fullPage));
  if (opts.device) {
    params.set("device", opts.device);
  } else {
    params.set("viewport", `${opts.viewportW}x${opts.viewportH}`);
  }
  if (opts.darkMode) params.set("darkMode", "true");
  if (opts.scale > 1) params.set("scale", String(opts.scale));
  params.set("waitUntil", opts.waitUntil);
  if (opts.delay > 0) params.set("delay", String(opts.delay));
  if (opts.timeout !== 15000) params.set("timeout", String(opts.timeout));
  if (opts.omitBackground) params.set("omitBackground", "true");
  return `${BASE_URL}/screenshot?${params}`;
}

const featurePills = [
  "Chromium · Firefox · WebKit",
  "Device Emulation",
  "Dark Mode",
  "Full-Page & PDF",
  "Custom Viewports",
  "JPEG · PNG · WebP",
];

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CaptureResult | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);

  const patchOptions = (patch: Partial<Options>) =>
    setOptions((prev) => ({ ...prev, ...patch }));

  const handleCapture = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const withProto = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

    setLoading(true);
    setError(null);
    setResult(null);

    const apiUrl = buildApiUrl(withProto, options);
    const startTime = Date.now();

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        let msg = `Server error ${response.status}`;
        try {
          const j = await response.json() as { message?: string };
          if (j.message) msg = j.message;
        } catch { /* ignore */ }
        throw new Error(msg);
      }

      const blob = await response.blob();
      const elapsed = Date.now() - startTime;
      const imageUrl = URL.createObjectURL(blob);
      const rawTitle = response.headers.get("X-Page-Title");
      const pageTitle = rawTitle ? decodeURIComponent(rawTitle) : null;

      setResult({ imageUrl, apiUrl, elapsed, pageTitle });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to capture screenshot";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCapture();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle grid background */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      {/* Radial glow at top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 py-10 pb-20">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Camera size={16} className="text-violet-400" />
            </div>
            <span className="font-semibold text-sm text-zinc-300">Playwright Demo</span>
            <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-400 bg-violet-500/5">
              v2.0
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://playwright.glasscube.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg border border-white/6 hover:border-white/15"
            >
              <Zap size={11} className="text-violet-400" />
              Live Demo
            </a>
            <a
              href="https://github.com/glasscube/playwright-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg border border-white/6 hover:border-white/15"
            >
              <GitFork size={13} />
              Source
            </a>
          </div>
        </header>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="gradient-text">Screenshot any website</span>
              <br />
              <span className="text-zinc-400 text-3xl sm:text-4xl font-semibold">with full Playwright power</span>
            </h1>
            <p className="text-zinc-500 text-base max-w-xl mx-auto leading-relaxed">
              Multi-browser rendering · device emulation · dark mode · PDF export —
              all via a single HTTP request.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mt-5"
          >
            {featurePills.map((f) => (
              <span
                key={f}
                className="text-[11px] text-zinc-500 bg-white/4 border border-white/6 rounded-full px-3 py-1"
              >
                {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Main capture card ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-2xl border border-white/8 bg-[#0e0e0e] shadow-2xl overflow-hidden"
        >
          {/* URL Input row */}
          <div className="flex flex-col sm:flex-row gap-3 p-4">
            <div className="relative flex-1">
              <Globe
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
                size={15}
              />
              <input
                type="text"
                value={url}
                placeholder="https://example.com"
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full bg-white/4 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all disabled:opacity-60"
              />
            </div>

            <button
              onClick={handleCapture}
              disabled={loading || !url.trim()}
              className="sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900/40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-900/30"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Capturing…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Capture
                </>
              )}
            </button>
          </div>

          {/* Advanced options (accordion) */}
          <AdvancedOptions
            open={showAdvanced}
            onToggle={() => setShowAdvanced((p) => !p)}
            options={options}
            onChange={patchOptions}
          />

          {/* How it works link */}
          <div className="px-4 pb-3 flex items-center gap-3">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <BookOpen size={12} />
              How it works
            </button>
            <div className="h-3 w-px bg-white/8" />
            <a
              href="https://bss.glasscube.uz/health"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <ExternalLink size={11} />
              API: bss.glasscube.uz
            </a>
          </div>
        </motion.div>

        {/* ── Error state ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 flex items-start gap-3 rounded-xl bg-red-500/8 border border-red-500/20 px-4 py-3"
            >
              <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-300 font-medium">Capture failed</p>
                <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Screenshot result ───────────────────────────────────────────── */}
        {result && (
          <ScreenshotPreview
            imageUrl={result.imageUrl}
            apiUrl={result.apiUrl}
            elapsed={result.elapsed}
            pageTitle={result.pageTitle}
            targetUrl={url}
            format={options.format}
          />
        )}

        {/* ── API docs ────────────────────────────────────────────────────── */}
        <APIDocsSection />

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="mt-16 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
              <Camera size={10} className="text-violet-400" />
            </div>
            <span>Playwright Screenshot API · Glasscube</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://playwright.glasscube.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              UI <ExternalLink size={9} />
            </a>
            <a
              href="https://bss.glasscube.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              API <ExternalLink size={9} />
            </a>
            <a
              href="https://github.com/glasscube/playwright-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              GitHub <ExternalLink size={9} />
            </a>
            <span className="text-zinc-700">MIT License</span>
          </div>
        </footer>
      </div>

      {/* ── How it works modal ──────────────────────────────────────────── */}
      <HowItWorksModal open={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </div>
  );
}
