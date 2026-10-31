/**
 * Use the original public photo URL. Vercel's image optimizer returns 402
 * for uncached sizes, leaving galleries blank while the originals still load.
 * A shared URL also lets the browser reuse its cache across listing cards
 * and detail pages.
 */
export function imgSet(url: string | null | undefined, _widths = [320, 480, 640, 900]): { src: string; srcSet?: string } {
  return { src: url || "" };
}

export function img(url: string | null | undefined, _width = 800): string {
  return url || "";
}

/**
 * Recover the original photo URL from a Vercel optimizer request.
 * Older deployed pages and cached bundles can still contain /_vercel/image
 * URLs even though new renders use the public storage URL directly.
 */
export function originalImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  try {
    const parsed = new URL(url, typeof window === "undefined" ? "https://wayzyy.com" : window.location.origin);
    if (parsed.pathname === "/_vercel/image") {
      return parsed.searchParams.get("url") || url;
    }
  } catch {
    // Keep the supplied URL if it cannot be parsed.
  }

  return url;
}

/**
 * Retry a failed optimized image once using its original public URL.
 * Returns true when a retry was started, allowing callers to defer their
 * broken-image UI until the direct request also fails.
 */
export function fallbackImageToOriginal(element: HTMLImageElement, originalUrl?: string | null): boolean {
  if (element.dataset.originalFallbackAttempted === "true") return false;

  const fallback = originalImageUrl(originalUrl || element.currentSrc || element.src);
  const failed = originalImageUrl(element.currentSrc || element.src);
  const wasOptimized = (element.currentSrc || element.src).includes("/_vercel/image?");

  if (!fallback || (!wasOptimized && fallback === failed)) return false;

  element.dataset.originalFallbackAttempted = "true";
  element.removeAttribute("srcset");
  element.removeAttribute("sizes");
  element.src = fallback;
  return true;
}
