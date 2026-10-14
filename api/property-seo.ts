import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

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
  const words = slugify([title, city].filter(Boolean).join(" "));
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const ogImage = images[0] || `${SITE}/og-image.png`;
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
