import { useState } from "react";
import { Camera, Download, Loader2, Sparkles, Globe } from "lucide-react";

export default function App() {
  const [url, setUrl] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate screenshot URL
  const handleCheck = async () => {
    if (!url.trim()) return;

    setLoading(true);

    // Small delay so loading state feels responsive
    await new Promise((r) => setTimeout(r, 300));

    setImg(`http://localhost:3000/?url=${encodeURIComponent(url.trim())}`);

    setLoading(false);
  };

  // Download image directly
  const handleDownload = async () => {
    if (!img) return;

    try {
      const response = await fetch(img);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `screenshot-${Date.now()}.png`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white text-black p-2 rounded-xl">
              <Camera size={22} />
            </div>

            <h1 className="text-3xl font-bold">Browser Screenshot Tool</h1>
          </div>

          <p className="text-zinc-400">
            Capture screenshots from any public URL locally ⚡
          </p>
        </div>

        {/* Input card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-3">
            {/* URL input */}
            <div className="relative flex-1">
              <Globe
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />

              <input
                type="text"
                value={url}
                placeholder="https://example.com"
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCheck();
                }}
                className="
                  w-full
                  bg-zinc-950
                  border
                  border-zinc-800
                  rounded-2xl
                  pl-11
                  pr-4
                  py-4
                  text-white
                  outline-none
                  focus:border-zinc-600
                  transition
                "
              />
            </div>

            {/* Capture button */}
            <button
              onClick={handleCheck}
              disabled={loading}
              className="
                bg-white
                text-black
                px-6
                py-4
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                hover:scale-[1.02]
                active:scale-[0.98]
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Capture
                </>
              )}
            </button>
          </div>
        </div>

        {/* Screenshot preview */}
        {img && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Screenshot Preview</h2>

              <button
                onClick={handleDownload}
                className="
                  bg-zinc-800
                  hover:bg-zinc-700
                  px-4
                  py-2
                  rounded-xl
                  flex
                  items-center
                  gap-2
                  transition
                "
              >
                <Download size={18} />
                Download
              </button>
            </div>

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-900
                shadow-2xl
              "
            >
              <img
                src={img}
                alt="Website screenshot"
                className="w-full block"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
