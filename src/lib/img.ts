// Listing photos live in Supabase Storage, and every full-size download counts
// against the plan's egress quota. Serve them through Vercel's image optimizer
// (configured in vercel.json): it resizes to WebP and caches for a month, so
// Supabase is hit about once per photo and size instead of on every page view.
const SIZES = [200, 320, 480, 640, 900, 1400, 1800];

/**
 * src + srcSet so the browser downloads the smallest size that fills the
 * space (a phone card needs ~480px, a retina laptop ~900px) instead of one
 * fixed width for everyone. Non-Wayzyy-storage URLs just get a plain src.
 */
export function imgSet(url: string | null | undefined, widths = [320, 480, 640, 900]): { src: string; srcSet?: string } {
  const src = img(url, widths[widths.length - 1]);
  if (!url || src === url || !src.startsWith("/_vercel/image")) return { src: src || "" };
  return {
    src: img(url, widths[2] ?? widths[widths.length - 1]),
    srcSet: widths.map((w) => `${img(url, w)} ${w}w`).join(", "),
  };
}

export function img(url: string | null | undefined, width = 800): string {
  if (!url) return "";
  // Only on the deployed site; the optimizer doesn't exist on localhost.
  if (typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.hostname)) return url;
  if (!url.includes(".supabase.co/storage/v1/object/public/")) return url;
  const w = SIZES.find((s) => s >= width) ?? SIZES[SIZES.length - 1];
  return `/_vercel/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;
}
