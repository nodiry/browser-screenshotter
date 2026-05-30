import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const API_BASE = "https://bss.glasscube.uz";

const params = [
  { name: "url", type: "string", required: true, default: "—", desc: "Target URL to screenshot" },
  { name: "browser", type: "enum", required: false, default: "chromium", desc: "chromium | firefox | webkit" },
  { name: "format", type: "enum", required: false, default: "png", desc: "png | jpeg | webp" },
  { name: "quality", type: "number", required: false, default: "90", desc: "1–100 (jpeg/webp only)" },
  { name: "fullPage", type: "boolean", required: false, default: "true", desc: "Capture full scrollable page" },
  { name: "viewport", type: "string", required: false, default: "1920x1080", desc: "WxH e.g. 1280x800" },
  { name: "device", type: "string", required: false, default: "—", desc: "Playwright device name e.g. iPhone 15" },
  { name: "darkMode", type: "boolean", required: false, default: "false", desc: "Enable dark color scheme" },
  { name: "scale", type: "number", required: false, default: "1", desc: "Device scale factor 1–3" },
  { name: "waitUntil", type: "enum", required: false, default: "networkidle", desc: "load | networkidle | domcontentloaded" },
  { name: "delay", type: "number", required: false, default: "0", desc: "Extra wait after load (ms, 0–10000)" },
  { name: "timeout", type: "number", required: false, default: "15000", desc: "Navigation timeout (ms, 5000–30000)" },
  { name: "omitBackground", type: "boolean", required: false, default: "false", desc: "Transparent background (PNG only)" },
];

const pdfParams = [
  { name: "url", type: "string", required: true, default: "—", desc: "Target URL to convert" },
  { name: "pageFormat", type: "enum", required: false, default: "A4", desc: "A4 | A3 | Letter | Legal" },
  { name: "landscape", type: "boolean", required: false, default: "false", desc: "Landscape orientation" },
  { name: "scale", type: "number", required: false, default: "1", desc: "Content scale 0.1–2" },
  { name: "timeout", type: "number", required: false, default: "20000", desc: "Max wait time (ms)" },
];

const snippets = {
  curl: `# Basic screenshot
curl "${API_BASE}/screenshot?url=https://example.com" \\
  --output screenshot.png

# Firefox + dark mode + JPEG 85%
curl "${API_BASE}/screenshot?url=https://example.com&browser=firefox&darkMode=true&format=jpeg&quality=85" \\
  --output dark-firefox.jpg

# Mobile device emulation
curl "${API_BASE}/screenshot?url=https://example.com&device=iPhone+15+Pro" \\
  --output iphone.png

# Full PDF export
curl "${API_BASE}/pdf?url=https://example.com&pageFormat=A4&landscape=false" \\
  --output page.pdf

# List all device presets
curl "${API_BASE}/devices"`,

  javascript: `// Basic screenshot with fetch
const response = await fetch(
  \`${API_BASE}/screenshot?url=https://example.com\`
);
const blob = await response.blob();
const url = URL.createObjectURL(blob);

// Screenshot with options
const params = new URLSearchParams({
  url: "https://example.com",
  browser: "firefox",
  format: "webp",
  quality: "90",
  darkMode: "true",
  fullPage: "true",
  viewport: "1280x800",
});
const res = await fetch(\`${API_BASE}/screenshot?\${params}\`);
const image = await res.blob();

// Read timing metadata
const timeMs = res.headers.get("X-Screenshot-Time-Ms");
const title  = decodeURIComponent(res.headers.get("X-Page-Title") ?? "");

console.log(\`Captured "\${title}" in \${timeMs}ms\`);`,

  python: `import requests

# Basic screenshot
r = requests.get("${API_BASE}/screenshot", params={
    "url": "https://example.com"
})
with open("screenshot.png", "wb") as f:
    f.write(r.content)

# Advanced – WebKit, dark mode, custom viewport
r = requests.get("${API_BASE}/screenshot", params={
    "url": "https://example.com",
    "browser": "webkit",
    "format": "jpeg",
    "quality": 85,
    "darkMode": "true",
    "viewport": "1440x900",
    "waitUntil": "networkidle",
})
with open("webkit-dark.jpg", "wb") as f:
    f.write(r.content)

# Metadata from headers
print("Time:", r.headers.get("X-Screenshot-Time-Ms"), "ms")
print("Title:", r.headers.get("X-Page-Title"))

# PDF export
pdf = requests.get("${API_BASE}/pdf", params={
    "url": "https://example.com",
    "pageFormat": "A4",
})
with open("page.pdf", "wb") as f:
    f.write(pdf.content)`,
};

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl bg-[#0a0a0a] border border-white/6 overflow-hidden">
      <button
        onClick={copy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all z-10"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      </button>
      <pre className="p-4 text-xs text-zinc-300 code-block overflow-x-auto scrollbar-hide">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function APIDocsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mt-16"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">API Reference</h2>
          <p className="text-sm text-zinc-500 mt-1">Direct HTTP access — no SDK required</p>
        </div>
        <a
          href={API_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors border border-white/8 rounded-lg px-3 py-1.5 hover:border-violet-500/30"
        >
          {API_BASE.replace("https://", "")}
          <ExternalLink size={11} />
        </a>
      </div>

      <div className="space-y-6">
        {/* Endpoints overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { method: "GET", path: "/screenshot", desc: "Capture page as PNG, JPEG, or WebP", color: "text-green-400 bg-green-500/10" },
            { method: "GET", path: "/pdf", desc: "Export page as a PDF document", color: "text-blue-400 bg-blue-500/10" },
            { method: "GET", path: "/devices", desc: "List all supported device presets", color: "text-yellow-400 bg-yellow-500/10" },
            { method: "GET", path: "/health", desc: "API server status and uptime", color: "text-zinc-400 bg-white/5" },
          ].map((ep) => (
            <div key={ep.path} className="flex items-center gap-3 rounded-xl bg-white/3 border border-white/6 px-4 py-3">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ep.color}`}>{ep.method}</span>
              <code className="text-sm text-zinc-300 font-mono">{ep.path}</code>
              <span className="text-xs text-zinc-600 ml-auto text-right">{ep.desc}</span>
            </div>
          ))}
        </div>

        {/* /screenshot params table */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <code className="text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">GET /screenshot</code>
            <span className="text-zinc-600 font-normal">parameters</span>
          </h3>
          <div className="rounded-xl border border-white/6 overflow-hidden">
            <div className="grid grid-cols-12 text-[10px] font-medium text-zinc-600 uppercase tracking-wider bg-white/2 px-4 py-2 border-b border-white/4">
              <span className="col-span-3">Parameter</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-2">Default</span>
              <span className="col-span-5">Description</span>
            </div>
            {params.map((p, i) => (
              <div key={p.name} className={`grid grid-cols-12 px-4 py-2.5 text-xs items-center ${i % 2 === 0 ? "bg-transparent" : "bg-white/1"}`}>
                <div className="col-span-3 flex items-center gap-2">
                  <code className="text-violet-300 font-mono">{p.name}</code>
                  {p.required && <Badge variant="outline" className="text-[9px] px-1 py-0 border-orange-500/40 text-orange-400">required</Badge>}
                </div>
                <span className="col-span-2 text-zinc-500 font-mono">{p.type}</span>
                <code className="col-span-2 text-zinc-400 font-mono">{p.default}</code>
                <span className="col-span-5 text-zinc-500">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* /pdf params */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <code className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">GET /pdf</code>
            <span className="text-zinc-600 font-normal">parameters</span>
          </h3>
          <div className="rounded-xl border border-white/6 overflow-hidden">
            <div className="grid grid-cols-12 text-[10px] font-medium text-zinc-600 uppercase tracking-wider bg-white/2 px-4 py-2 border-b border-white/4">
              <span className="col-span-3">Parameter</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-2">Default</span>
              <span className="col-span-5">Description</span>
            </div>
            {pdfParams.map((p, i) => (
              <div key={p.name} className={`grid grid-cols-12 px-4 py-2.5 text-xs items-center ${i % 2 === 0 ? "bg-transparent" : "bg-white/1"}`}>
                <div className="col-span-3 flex items-center gap-2">
                  <code className="text-blue-300 font-mono">{p.name}</code>
                  {p.required && <Badge variant="outline" className="text-[9px] px-1 py-0 border-orange-500/40 text-orange-400">required</Badge>}
                </div>
                <span className="col-span-2 text-zinc-500 font-mono">{p.type}</span>
                <code className="col-span-2 text-zinc-400 font-mono">{p.default}</code>
                <span className="col-span-5 text-zinc-500">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response headers */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Response Headers</h3>
          <div className="rounded-xl border border-white/6 overflow-hidden">
            {[
              { header: "X-Screenshot-Time-Ms", desc: "Total time from request to image (ms)" },
              { header: "X-Page-Title", desc: "URL-encoded page <title> text" },
              { header: "X-Browser-Used", desc: "Which browser engine was used" },
              { header: "Content-Type", desc: "image/png | image/jpeg | application/pdf" },
            ].map((h, i) => (
              <div key={h.header} className={`flex items-center gap-4 px-4 py-2.5 text-xs ${i % 2 === 0 ? "" : "bg-white/1"}`}>
                <code className="text-yellow-300/80 font-mono w-52 shrink-0">{h.header}</code>
                <span className="text-zinc-500">{h.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code examples */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Code Examples</h3>
          <Tabs defaultValue="curl">
            <TabsList className="bg-white/5 border border-white/8 mb-3">
              <TabsTrigger value="curl" className="text-xs">cURL</TabsTrigger>
              <TabsTrigger value="javascript" className="text-xs">JavaScript</TabsTrigger>
              <TabsTrigger value="python" className="text-xs">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="curl"><CodeBlock code={snippets.curl} /></TabsContent>
            <TabsContent value="javascript"><CodeBlock code={snippets.javascript} /></TabsContent>
            <TabsContent value="python"><CodeBlock code={snippets.python} /></TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.section>
  );
}
