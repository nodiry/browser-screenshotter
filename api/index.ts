import { serve } from "bun";
import { screenshot } from "./lib/utils";

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url).searchParams.get("url");

    if (!url) return new Response("Missing url", { status: 400 });

    try {
      const image = await screenshot(url);

      return new Response(image, {
        headers: { "Content-Type": "image/png" },
      });
    } catch (e) {
      return new Response("Failed to load page", { status: 500 });
    }
  },
});
