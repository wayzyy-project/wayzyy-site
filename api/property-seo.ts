import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import {
  buildPlacePage, allPlacePaths, placeJsonLd, guestPrice, inr, SEED_HOST_EMAILS as PLACE_SEED_EMAILS,
  type PlaceListing,
} from "./_lib/places.js";

// ONE function serves four jobs, because the Vercel Hobby plan allows at most
// 12 serverless functions in total:
//   /<place>/stays, /goa/stays/<type> (crawlers only)         -> ?place=&cat=
//   /property/<name>-<id>   (crawlers only, see vercel.json)  -> HTML page
//   /sitemap-listings.xml                                     -> ?sitemap=1
//   /api/property-preview?id=...                              -> ?format=json
//
// What search engines and link-preview bots (WhatsApp, Telegram, LinkedIn,
// Facebook, X, Slack...) receive for /property/<name>-<id>. The site itself is
// built in the browser, so without this every listing link would come back as
// the same generic homepage page: same title, same preview picture. People get
// the normal site; vercel.json only routes crawlers here.

const SITE = "https://wayzyy.com";
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
// Team / test accounts - their listings are demos, kept out of search.
const SEED_HOST_EMAILS = [
  "akshayne912@gmail.com",
  "hello@wayzyy.com",
  "akshaytrythis@gmail.com",
  "anantsharma8055@gmail.com",
  "raijagriti.work@gmail.com",
  "priyanshubhardwaj0912@gmail.com",
];

// Same rules as src/lib/propertySlug.ts - keep both in step.
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

const propertyPath = (id: string, title?: string | null, city?: string | null): string => {
  // Skip the city when the title already names it ("…, Rohini" + "Rohini").
  const cityWord = city && !String(title ?? "").toLowerCase().includes(String(city).toLowerCase()) ? city : null;
  const words = slugify([title, cityWord].filter(Boolean).join(" "));
  return `/property/${words ? `${words}-` : ""}${id}`;
};

const esc = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

/**
 * Preview-sized copy of a listing photo for WhatsApp / Facebook / X cards: a
 * 1200x630 crop at about 100 KB instead of the full original (often 250 KB+,
 * which WhatsApp tends to drop). Only for our own storage; other hosts as-is.
 */
const socialImage = (u: string): string =>
  u.includes("/storage/v1/object/public/")
    ? `${u.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/")}${u.includes("?") ? "&" : "?"}width=1200&height=630&resize=cover&quality=60`
    : u;

/** The normal single-page app, for anything we can't describe (demo pages, unknown ids). */
async function sendApp(req: VercelRequest, res: VercelResponse, status = 200) {
  try {
    const host = req.headers.host || "wayzyy.com";
    const r = await fetch(`https://${host}/index.html`);
    const html = await r.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(status).send(html);
  } catch {
    return res.redirect(302, SITE);
  }
}

async function renderPropertyPage(req: VercelRequest, res: VercelResponse) {
  const slugParam = typeof req.query.slug === "string" ? req.query.slug : "";
  const ids = slugParam.match(UUID_RE);
  const id = ids ? ids[ids.length - 1].toLowerCase() : null;
  if (!id) return sendApp(req, res);

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return sendApp(req, res);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: p } = await admin
    .from("properties")
    .select("id, title, description, city, state, location, latitude, longitude, images, max_guests, bedrooms, beds, bathrooms, amenities, space_type, status, host_email")
    .eq("id", id)
    .maybeSingle();

  // Only live listings are described to the world.
  if (!p || p.status !== "active") return sendApp(req, res, 404);

  const canonicalPath = propertyPath(p.id, p.title, p.city);
  // One address per listing: old id-only links and stale names go to the real one.
  if (decodeURIComponent(req.url?.split("?")[0] ?? "") !== canonicalPath) {
    res.setHeader("Cache-Control", "public, s-maxage=600");
    return res.redirect(301, canonicalPath);
  }

  const url = `${SITE}${canonicalPath}`;
  const images = toImages(p.images);
  const placeLine = [p.city, p.state].filter(Boolean).join(", ");
  const title = `${p.title}${placeLine ? ` - ${placeLine}` : ""} | Wayzyy`;
  const description =
    String(p.description ?? "").replace(/\s+/g, " ").trim().slice(0, 155) ||
    `${p.space_type ?? "Stay"} with ${p.bedrooms ?? "?"} bedrooms${placeLine ? ` in ${placeLine}` : ""}. Book directly on Wayzyy.`;
  const amenities: string[] = Array.isArray(p.amenities) ? p.amenities.filter((a: unknown) => typeof a === "string") : [];
  const isSeed = SEED_HOST_EMAILS.includes(String(p.host_email ?? "").toLowerCase());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    identifier: p.id,
    name: p.title,
    description,
    url,
    image: images.slice(0, 8),
    address: { "@type": "PostalAddress", addressLocality: p.city, addressRegion: p.state, addressCountry: "IN" },
    latitude: p.latitude,
    longitude: p.longitude,
    containsPlace: {
      "@type": "Accommodation",
      occupancy: { "@type": "QuantitativeValue", value: p.max_guests },
      numberOfBedrooms: p.bedrooms,
      numberOfBathroomsTotal: p.bathrooms,
      amenityFeature: amenities.slice(0, 20).map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Wayzyy", item: SITE },
      { "@type": "ListItem", position: 2, name: "Stays", item: `${SITE}/stays` },
      { "@type": "ListItem", position: 3, name: p.title, item: url },
    ],
  };

  const ogImage = images[0] ? socialImage(images[0]) : `${SITE}/og-image.jpg`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${isSeed ? "noindex, nofollow" : "index, follow, max-image-preview:large"}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:site_name" content="Wayzyy">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbs).replace(/</g, "\\u003c")}</script>
</head>
<body>
<h1>${esc(p.title)}</h1>
<p>${esc(placeLine)}</p>
<p>${esc(p.space_type ?? "")} · ${esc(p.max_guests ?? "")} guests · ${esc(p.bedrooms ?? "")} bedrooms · ${esc(p.bathrooms ?? "")} bathrooms</p>
<p>${esc(String(p.description ?? "").slice(0, 1500))}</p>
${amenities.length ? `<h2>Amenities</h2><ul>${amenities.slice(0, 30).map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
${images.slice(0, 6).map((u) => `<img src="${esc(u)}" alt="${esc(p.title)}" width="800">`).join("\n")}
<p><a href="${esc(url)}">View ${esc(p.title)} on Wayzyy</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
  return res.status(200).send(html);
}

// ── /sitemap-listings.xml: every live listing, with its named URL ──────────
async function renderSitemap(res: VercelResponse) {
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

  const xmlEsc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rows = (data ?? []).filter((p) => !SEED_HOST_EMAILS.includes(String(p.host_email ?? "").toLowerCase()));
  const urls = rows
    .map((p) => {
      const loc = `${SITE}${propertyPath(p.id, p.title, p.city)}`;
      const lastmod = p.updated_at ? new Date(p.updated_at).toISOString().slice(0, 10) : undefined;
      const imgs = toImages(p.images)
        .slice(0, 5)
        .map((u) => `<image:image><image:loc>${xmlEsc(u)}</image:loc></image:image>`)
        .join("");
      return `<url><loc>${xmlEsc(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>0.8</priority>${imgs}</url>`;
    })
    .join("\n");

  // Place and type pages (only those with two or more stays).
  const publicListings = await fetchPublicListings();
  const placeUrls = (publicListings ? allPlacePaths(publicListings) : [])
    .map((path) => `<url><loc>${xmlEsc(`${SITE}${path}`)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
    .join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res
    .status(200)
    .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${placeUrls}\n${urls}\n</urlset>`);
}

// ── /api/property-preview?id=...: the old JSON preview, address kept working ─
// Public, unauthenticated preview of one property (draft / pending_review too,
// since anon RLS only exposes active rows). No price, no host contact details,
// no street/pincode - the exact address stays withheld before booking.
async function renderPreviewJson(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: "Server not configured" });
  const id = typeof req.query.id === "string" ? req.query.id : undefined;
  if (!id) return res.status(400).json({ error: "Missing id" });

  const admin = createClient(supabaseUrl, serviceKey);
  const { data, error } = await admin
    .from("properties")
    .select("id, title, description, city, state, location, latitude, longitude, images, max_guests, bedrooms, beds, bathrooms, amenities, space_type, status")
    .eq("id", id)
    .maybeSingle();
  if (error || !data || data.status === "rejected") return res.status(404).json({ error: "Not found" });

  const { status: _status, ...preview } = data;
  return res.status(200).json({ property: preview });
}

// ── Place and type pages for crawlers: /anjuna/stays, /goa/stays/villas ... ──
const PLACE_COLUMNS = "id, title, city, state, price_per_night, images, max_guests, bedrooms, amenities, space_type, pets_allowed, host_email";

async function fetchPublicListings(): Promise<PlaceListing[] | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  const admin = createClient(supabaseUrl, serviceKey);
  const { data, error } = await admin.from("properties").select(PLACE_COLUMNS).eq("status", "active");
  if (error) return null;
  return (data ?? [])
    .filter((p: any) => !PLACE_SEED_EMAILS.includes(String(p.host_email ?? "").toLowerCase()))
    .map((p: any) => ({ ...p, images: toImages(p.images), amenities: Array.isArray(p.amenities) ? p.amenities.filter((a: unknown) => typeof a === "string") : [] })) as PlaceListing[];
}

async function renderPlaceHtml(req: VercelRequest, res: VercelResponse) {
  const place = typeof req.query.place === "string" ? req.query.place : "";
  const cat = typeof req.query.cat === "string" ? req.query.cat : undefined;
  const all = await fetchPublicListings();
  if (!all) return sendApp(req, res);
  const page = buildPlacePage(all, place, cat);
  if (!page) return sendApp(req, res, 404);

  const url = `${SITE}${page.path}`;
  const pathFor = (p: PlaceListing) => propertyPath(p.id, p.title, p.city);
  const ld = placeJsonLd(page, SITE, pathFor);
  const ogImage = page.listings[0]?.images?.[0] ? socialImage(page.listings[0].images[0]) : `${SITE}/og-image.jpg`;
  const links = [...page.related.regions, ...page.related.places, ...page.related.categories];

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(page.title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${page.indexable ? "index, follow, max-image-preview:large" : "noindex, follow"}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:site_name" content="Wayzyy">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
${ld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>
<body>
<nav aria-label="Breadcrumb">${page.breadcrumbs.map((b) => `<a href="${esc(b.path)}">${esc(b.name)}</a>`).join(" / ")}</nav>
<h1>${esc(page.h1)}</h1>
${page.intro.map((t) => `<p>${esc(t)}</p>`).join("\n")}
<nav aria-label="Explore stays"><ul>${links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)} (${l.count})</a></li>`).join("")}</ul></nav>
<ul>
${page.listings.map((p) => `<li><a href="${esc(pathFor(p))}"><h2>${esc(p.title)}</h2></a> ${esc([p.city, p.state].filter(Boolean).join(", "))} · ${esc(p.max_guests ?? "")} guests · ${esc(p.bedrooms ?? "")} bedrooms · ${esc(inr(guestPrice(p.price_per_night)))} per night</li>`).join("\n")}
</ul>
${page.amenities.length ? `<h2>Popular amenities in ${esc(page.placeName)}</h2><ul>${page.amenities.map((a) => `<li>${esc(a.name)} (${a.count})</li>`).join("")}</ul>` : ""}
${page.faqs.length ? `<h2>Questions about staying in ${esc(page.placeName)}</h2>${page.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("\n")}` : ""}
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
  return res.status(200).send(html);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.sitemap) return renderSitemap(res);
  if (req.query.format === "json") return renderPreviewJson(req, res);
  if (req.query.place) return renderPlaceHtml(req, res);
  return renderPropertyPage(req, res);
}
