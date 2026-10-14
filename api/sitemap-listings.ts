import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Every live listing, with its named URL, so search engines can find them.
// Served at /sitemap-listings.xml (see vercel.json) and listed in robots.txt.

const SITE = "https://wayzyy.com";
const SEED_HOST_EMAILS = [
  "akshayne912@gmail.com",
  "hello@wayzyy.com",
  "akshaytrythis@gmail.com",
  "anantsharma8055@gmail.com",
  "raijagriti.work@gmail.com",
  "priyanshubhardwaj0912@gmail.com",
];

const slugify = (input: string): string =>
  input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/, "");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const toImages = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.filter((u) => typeof u === "string");
  if (typeof raw === "string") {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.filter((u) => typeof u === "string");
    } catch { /* not JSON */ }
  }
  return [];
};

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).send("Server not configured");

  const admin = createClient(supabaseUrl, serviceKey);
  const { data, error } = await admin
    .from("properties")
    .select("id, title, city, images, updated_at, host_email")
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(5000);
  if (error) return res.status(500).send("Could not build sitemap");

  const rows = (data ?? []).filter((p) => !SEED_HOST_EMAILS.includes(String(p.host_email ?? "").toLowerCase()));
  const urls = rows
    .map((p) => {
      const words = slugify([p.title, p.city].filter(Boolean).join(" "));
      const loc = `${SITE}/property/${words ? `${words}-` : ""}${p.id}`;
      const lastmod = p.updated_at ? new Date(p.updated_at).toISOString().slice(0, 10) : undefined;
      const imgs = toImages(p.images)
        .slice(0, 5)
        .map((u) => `<image:image><image:loc>${esc(u)}</image:loc></image:image>`)
        .join("");
      return `<url><loc>${esc(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>0.8</priority>${imgs}</url>`;
    })
    .join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res
    .status(200)
    .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`);
}
