import type { VercelRequest, VercelResponse } from "@vercel/node";

const hits = new Map<string, number[]>();

// shortcut: per-instance memory, so the limit is per warm serverless instance not global; move to Upstash/Vercel WAF rate limiting when traffic grows.
export function rateLimited(req: VercelRequest, res: VercelResponse, max = 5, windowMs = 60_000): boolean {
  const ip = String(req.headers["x-forwarded-for"] ?? "unknown").split(",")[0].trim();
  const key = `${req.url?.split("?")[0]}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
    res.status(429).json({ error: "Too many requests" });
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}
