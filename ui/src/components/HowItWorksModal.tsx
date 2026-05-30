import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, Globe, Server, Monitor, FileImage, Camera, Layers } from "lucide-react";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Globe,
    title: "Enter URL",
    desc: "User provides any public web address to the UI",
    color: "text-blue-400",
    ring: "ring-blue-500/30",
    bg: "bg-blue-500/10",
    dot: "bg-blue-500",
  },
  {
    icon: Server,
    title: "API Receives",
    desc: "Bun server parses all options and validates the request",
    color: "text-indigo-400",
    ring: "ring-indigo-500/30",
    bg: "bg-indigo-500/10",
    dot: "bg-indigo-500",
  },
  {
    icon: Monitor,
    title: "Browser Launches",
    desc: "Playwright spins up headless Chromium, Firefox, or WebKit",
    color: "text-violet-400",
    ring: "ring-violet-500/30",
    bg: "bg-violet-500/10",
    dot: "bg-violet-500",
  },
  {
    icon: Layers,
    title: "Page Loads",
    desc: "Navigates, applies dark mode / device emulation, waits for render",
    color: "text-purple-400",
    ring: "ring-purple-500/30",
    bg: "bg-purple-500/10",
    dot: "bg-purple-500",
  },
  {
    icon: Camera,
    title: "Snapshot Taken",
    desc: "Full-page or viewport screenshot captured at chosen resolution",
    color: "text-fuchsia-400",
    ring: "ring-fuchsia-500/30",
    bg: "bg-fuchsia-500/10",
    dot: "bg-fuchsia-500",
  },
  {
    icon: FileImage,
    title: "Image Returned",
    desc: "PNG, JPEG or WebP delivered with timing & title in headers",
    color: "text-pink-400",
    ring: "ring-pink-500/30",
    bg: "bg-pink-500/10",
    dot: "bg-pink-500",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

const arrowVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1, scaleX: 1,
    transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1.0] },
  },
};

export function HowItWorksModal({ open, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-4xl bg-[#0e0e0e] border border-white/8 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
              <div>
                <h2 className="text-lg font-semibold text-white">How it works</h2>
                <p className="text-sm text-zinc-500 mt-0.5">
                  From URL to screenshot in milliseconds
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors rounded-lg p-1.5 hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Flow */}
            <div className="p-6">
              {/* Desktop: horizontal flow */}
              <div className="hidden md:block">
                <motion.div
                  className="flex items-start gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate={open ? "visible" : "hidden"}
                >
                  {steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex items-start flex-1 min-w-0">
                        <motion.div
                          variants={stepVariants}
                          className={`flex-1 min-w-0 rounded-xl border ${step.ring} ${step.bg} p-4 flex flex-col gap-3`}
                        >
                          {/* Step number + icon */}
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${step.bg} ${step.ring} ring-1 flex items-center justify-center`}>
                              <span className={`text-[10px] font-bold ${step.color}`}>{i + 1}</span>
                            </div>
                            <div className={`w-7 h-7 rounded-lg ${step.bg} flex items-center justify-center`}>
                              <Icon size={14} className={step.color} />
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white mb-1">{step.title}</p>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">{step.desc}</p>
                          </div>
                        </motion.div>

                        {/* Connector arrow */}
                        {i < steps.length - 1 && (
                          <motion.div
                            variants={arrowVariants}
                            className="flex items-center self-center mx-1.5 shrink-0"
                            style={{ originX: 0 }}
                          >
                            <div className="w-6 h-px bg-white/15" />
                            <svg width="6" height="8" viewBox="0 0 6 8" className="text-white/20">
                              <path d="M0 0 L6 4 L0 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Mobile: vertical timeline */}
              <div className="md:hidden">
                <motion.div
                  className="relative"
                  variants={containerVariants}
                  initial="hidden"
                  animate={open ? "visible" : "hidden"}
                >
                  <div className="absolute left-[22px] top-8 bottom-8 w-px bg-white/6" />
                  <div className="space-y-3">
                    {steps.map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <motion.div key={i} variants={stepVariants} className="flex items-start gap-4">
                          <div className={`relative z-10 w-11 h-11 rounded-xl ${step.bg} ring-1 ${step.ring} flex items-center justify-center shrink-0`}>
                            <Icon size={18} className={step.color} />
                          </div>
                          <div className="pt-1.5">
                            <p className="text-sm font-semibold text-white">{step.title}</p>
                            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{step.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Animated "live" demo hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-5 rounded-xl bg-violet-500/5 border border-violet-500/15 p-4 flex items-center gap-3"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
                </span>
                <p className="text-xs text-zinc-400">
                  The entire flow runs in{" "}
                  <span className="text-violet-400 font-medium">under 3 seconds</span> for most pages — headless browser launch included.
                </p>
              </motion.div>
            </div>

            {/* Footer gradient */}
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
