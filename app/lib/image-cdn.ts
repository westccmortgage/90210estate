// Listing and agent photos arrive as full-size originals (often 200 KB+ each).
// On Netlify they are routed through the Netlify Image CDN, which resizes them
// to the width actually shown and serves WebP/AVIF from the edge. Only hosts
// allowed in netlify.toml `[images] remote_images` are rewritten; anything else
// (a new host, local `next start`) keeps its original URL, so nothing breaks.

const CDN_HOSTS = new Set([
  "agpqetgxaibwzhuyanpk.supabase.co",
  "media.crmls.org",
  "media-production.lp-cdn.com",
  "cdn.agentimagehosting.com",
]);

const enabled = process.env.IMAGE_CDN === "netlify";

export function cdnImage(url: string | null | undefined, width: number, quality = 72): string | undefined {
  if (!url) return undefined;
  if (!enabled) return url;
  try {
    if (!CDN_HOSTS.has(new URL(url).hostname)) return url;
  } catch {
    return url;
  }
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}
