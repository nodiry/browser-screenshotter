import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Monitor, Smartphone, Tablet, Tv2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type Options = {
  browser: "chromium" | "firefox" | "webkit";
  format: "png" | "jpeg" | "webp";
  quality: number;
  fullPage: boolean;
  viewportW: number;
  viewportH: number;
  device: string;
  darkMode: boolean;
  waitUntil: "load" | "networkidle" | "domcontentloaded";
  delay: number;
  timeout: number;
  omitBackground: boolean;
  scale: number;
};

interface Props {
  open: boolean;
  onToggle: () => void;
  options: Options;
  onChange: (patch: Partial<Options>) => void;
}

type BtnGroupOption<T extends string> = { value: T; label: string };

function BtnGroup<T extends string>({
  value,
  options,
  onChange,
  size = "sm",
}: {
  value: T;
  options: BtnGroupOption<T>[];
  onChange: (v: T) => void;
  size?: "sm" | "xs";
}) {
  return (
    <div className="flex rounded-lg border border-white/8 overflow-hidden bg-white/3">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 px-3 transition-all font-medium",
            size === "sm" ? "py-1.5 text-xs" : "py-1 text-[11px]",
            value === o.value
              ? "bg-violet-600/30 text-violet-300 border-r border-l border-violet-500/30 first:border-l-0 last:border-r-0"
              : "text-zinc-400 hover:text-white hover:bg-white/5",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const viewportPresets = [
  { label: "Mobile", icon: Smartphone, w: 390, h: 844 },
  { label: "Tablet", icon: Tablet, w: 768, h: 1024 },
  { label: "Desktop", icon: Monitor, w: 1920, h: 1080 },
  { label: "4K", icon: Tv2, w: 3840, h: 2160 },
];

export function AdvancedOptions({ open, onToggle, options, onChange }: Props) {
  return (
    <div className="border-t border-white/6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          Advanced Options
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5">

              {/* Row 1: Browser + Format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Browser Engine</label>
                  <BtnGroup
                    value={options.browser}
                    onChange={(v) => onChange({ browser: v })}
                    options={[
                      { value: "chromium", label: "Chromium" },
                      { value: "firefox", label: "Firefox" },
                      { value: "webkit", label: "WebKit" },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Output Format</label>
                  <BtnGroup
                    value={options.format}
                    onChange={(v) => onChange({ format: v })}
                    options={[
                      { value: "png", label: "PNG" },
                      { value: "jpeg", label: "JPEG" },
                      { value: "webp", label: "WebP" },
                    ]}
                  />
                </div>
              </div>

              {/* Row 2: Quality (JPEG/WebP) + Scale */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                      Quality{" "}
                      {options.format === "png" && <span className="text-zinc-600">(PNG is lossless)</span>}
                    </label>
                    <span className="text-xs font-mono text-violet-400">{options.quality}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={options.quality}
                    disabled={options.format === "png"}
                    onChange={(e) => onChange({ quality: Number(e.target.value) })}
                    className={cn("w-full", options.format === "png" && "opacity-30 cursor-not-allowed")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Device Scale Factor</label>
                  <BtnGroup
                    value={String(options.scale) as never}
                    onChange={(v) => onChange({ scale: Number(v) })}
                    options={[
                      { value: "1", label: "1×" },
                      { value: "2", label: "2× (HiDPI)" },
                      { value: "3", label: "3× (Retina)" },
                    ]}
                  />
                </div>
              </div>

              {/* Row 3: Viewport */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Viewport</label>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Preset buttons */}
                  {viewportPresets.map((preset) => {
                    const Icon = preset.icon;
                    const active = options.viewportW === preset.w && options.viewportH === preset.h;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => onChange({ viewportW: preset.w, viewportH: preset.h })}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          active
                            ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                            : "bg-white/3 border-white/8 text-zinc-400 hover:text-white hover:border-white/20",
                        )}
                      >
                        <Icon size={12} />
                        {preset.label}
                        <span className="text-[10px] text-zinc-600">{preset.w}×{preset.h}</span>
                      </button>
                    );
                  })}
                  {/* Custom inputs */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <input
                      type="number"
                      value={options.viewportW}
                      onChange={(e) => onChange({ viewportW: Number(e.target.value) })}
                      className="w-20 bg-white/5 border border-white/8 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-violet-500/50"
                    />
                    <span className="text-zinc-600 text-xs">×</span>
                    <input
                      type="number"
                      value={options.viewportH}
                      onChange={(e) => onChange({ viewportH: Number(e.target.value) })}
                      className="w-20 bg-white/5 border border-white/8 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Wait strategy + Delay + Timeout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Wait Until</label>
                  <BtnGroup
                    value={options.waitUntil}
                    onChange={(v) => onChange({ waitUntil: v })}
                    options={[
                      { value: "load", label: "Load" },
                      { value: "networkidle", label: "Idle" },
                      { value: "domcontentloaded", label: "DOM" },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Extra Delay</label>
                    <span className="text-xs font-mono text-zinc-500">{options.delay}ms</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={100}
                    value={options.delay}
                    onChange={(e) => onChange({ delay: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Timeout</label>
                    <span className="text-xs font-mono text-zinc-500">{options.timeout / 1000}s</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={30000}
                    step={1000}
                    value={options.timeout}
                    onChange={(e) => onChange({ timeout: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Row 5: Device preset */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Device Emulation</label>
                <select
                  value={options.device}
                  onChange={(e) => onChange({ device: e.target.value })}
                  className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/50 appearance-none"
                >
                  <option value="">None (use viewport above)</option>
                  <optgroup label="iPhone">
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="iPhone 15">iPhone 15</option>
                    <option value="iPhone 14">iPhone 14</option>
                    <option value="iPhone SE">iPhone SE</option>
                  </optgroup>
                  <optgroup label="iPad">
                    <option value="iPad Pro 11">iPad Pro 11"</option>
                    <option value="iPad Mini">iPad Mini</option>
                  </optgroup>
                  <optgroup label="Android">
                    <option value="Pixel 7">Pixel 7</option>
                    <option value="Pixel 5">Pixel 5</option>
                    <option value="Galaxy S9+">Galaxy S9+</option>
                  </optgroup>
                  <optgroup label="Desktop">
                    <option value="Desktop Chrome">Desktop Chrome</option>
                    <option value="Desktop Firefox">Desktop Firefox</option>
                    <option value="Desktop Safari">Desktop Safari</option>
                    <option value="Desktop Edge">Desktop Edge</option>
                  </optgroup>
                </select>
                {options.device && (
                  <p className="text-[11px] text-zinc-600">
                    Device preset overrides viewport — browser emulates the selected device's screen size and user-agent.
                  </p>
                )}
              </div>

              {/* Row 6: Toggles */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    label: "Full Page",
                    description: "Capture entire scrollable page",
                    key: "fullPage" as const,
                  },
                  {
                    label: "Dark Mode",
                    description: "Emulate prefers-color-scheme: dark",
                    key: "darkMode" as const,
                  },
                  {
                    label: "Transparent BG",
                    description: "Omit background (PNG only)",
                    key: "omitBackground" as const,
                  },
                ].map(({ label, description, key }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl bg-white/3 border border-white/6 px-3 py-2.5 gap-3"
                  >
                    <div>
                      <p className="text-xs font-medium text-zinc-300">{label}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{description}</p>
                    </div>
                    <Switch
                      checked={options[key] as boolean}
                      onCheckedChange={(v) => onChange({ [key]: v })}
                      className="shrink-0"
                    />
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
