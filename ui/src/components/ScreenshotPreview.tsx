import { motion } from "framer-motion";
import { Download, Link, Clock, Globe, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  imageUrl: string;
  apiUrl: string;
  elapsed: number | null;
  pageTitle: string | null;
  targetUrl: string;
  format: string;
}

export function ScreenshotPreview({ imageUrl, apiUrl, elapsed, pageTitle, targetUrl, format }: Props) {
  const [copied, setCopied] = useState<"url" | "curl" | null>(null);

  const copy = async (text: string, type: "url" | "curl") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const curlCmd = `curl "${apiUrl}" --output screenshot.${format}`;

  const handleDownload = async () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `screenshot-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.0, 0.0, 0.2, 1.0] }}
      className="mt-8"
    >
      {/* Browser chrome */}
      <div className="rounded-2xl border border-white/8 bg-[#0e0e0e] overflow-hidden shadow-2xl glow-violet-sm">
        {/* Browser top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#141414] border-b border-white/6">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {/* URL bar */}
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-md px-3 py-1.5 min-w-0">
            <Globe size={11} className="text-zinc-500 shrink-0" />
            <span className="text-xs text-zinc-400 truncate font-mono">{targetUrl}</span>
          </div>
          {/* Elapsed */}
          {elapsed !== null && (
            <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-zinc-500">
              <Clock size={11} />
              <span>{(elapsed / 1000).toFixed(2)}s</span>
            </div>
          )}
        </div>

        {/* Screenshot image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={pageTitle ?? "Website screenshot"}
            className="w-full block"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/20 flex items-center justify-center">
            <button
              onClick={handleDownload}
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Page title */}
        {pageTitle && (
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500 truncate">
              <span className="text-zinc-600">Page: </span>
              {pageTitle}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Copy API URL */}
          <button
            onClick={() => copy(apiUrl, "url")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-white/8 bg-white/3 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
          >
            {copied === "url" ? <Check size={12} className="text-green-400" /> : <Link size={12} />}
            {copied === "url" ? "Copied!" : "Copy API URL"}
          </button>

          {/* Copy cURL */}
          <button
            onClick={() => copy(curlCmd, "curl")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-white/8 bg-white/3 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
          >
            {copied === "curl" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied === "curl" ? "Copied!" : "Copy cURL"}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition-all"
          >
            <Download size={12} />
            Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
