// Place and type pages (/goa/stays, /north-goa/stays, /anjuna/stays,
// /goa/stays/villas ...). One pure module, used by BOTH the website pages
// (src/pages/PlaceStays.tsx) and the crawler version in api/property-seo.ts, so
// a visitor and a search engine always see the same title, text and listings.
//
// Everything on a page is computed from live listings (counts, prices, what is
// actually available). Nothing is invented, and a page with fewer than two
// stays is marked noindex and left out of the sitemap rather than published thin.
//
// This folder starts with "_" so Vercel does not count it as a serverless
// function (the Hobby plan allows 12 and we are at the limit).

export interface PlaceListing {
  id: string;
  title: string;
  city: string | null;
  state: string | null;
  price_per_night: number | string;
  images: string[];
  max_guests: number | null;
  bedrooms: number | null;
  amenities: string[];
  space_type: string | null;
  pets_allowed: boolean | null;
}

/** Team / test accounts: their listings are demos and stay out of search. */
export const SEED_HOST_EMAILS = [
  "akshayne912@gmail.com",
  "hello@wayzyy.com",
  "akshaytrythis@gmail.com",
  "anantsharma8055@gmail.com",
  "raijagriti.work@gmail.com",
  "priyanshubhardwaj0912@gmail.com",
];

export const slugify = (input: string): string =>
  input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/, "");

/** The nightly price a guest sees: the host's rate with Wayzyy's 7% service fee included. */
export const guestPrice = (hostPrice: number | string): number => Math.round(Number(hostPrice) * 1.07);

export const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

const REGIONS: Record<string, { name: string; areas: string[] }> = {
  "north-goa": {
    name: "North Goa",
    areas: [
      "candolim", "siolim", "anjuna", "vagator", "chapora", "arpora", "baga", "calangute", "assagao", "morjim",
      "mandrem", "arambol", "ashwem", "nerul", "sinquerim", "marna", "girim", "saligao", "parra", "porvorim",
      "pernem", "aldona", "nachinola", "sangolda", "reis-magos", "verla", "oxel", "ozran",
    ],
  },
  "south-goa": {
    name: "South Goa",
    areas: [
      "colva", "varca", "benaulim", "palolem", "agonda", "cavelossim", "majorda", "betalbatim", "canacona",
      "margao", "cansaulim", "utorda", "galgibaga", "patnem", "mobor", "sernabatim", "arossim", "velsao", "dabolim",
    ],
  },
};

export interface CategoryDef {
  slug: string;
  name: string;     // heading text: "Villas and houses"
  inGoa: string;    // "Villas and houses in Goa"
  test: (p: PlaceListing) => boolean;
  // Optional overrides for categories that answer a specific search (e.g. "goa workation").
  title?: string;
  description?: (n: number, min: string) => string;
  intro?: string[];
  faqs?: Faq[];
}

const amenityText = (p: PlaceListing) => (p.amenities ?? []).join(" ").toLowerCase();
const isWorkFriendly = (p: PlaceListing) => /wi-?fi/.test(amenityText(p)) && /workspace|desk/.test(amenityText(p));

const hasPool = (p: PlaceListing) =>
  (p.amenities ?? []).some((a) => /pool/i.test(a)) || /pool/i.test(p.title);

export const CATEGORIES: CategoryDef[] = [
  { slug: "villas", name: "Villas and houses", inGoa: "Villas and houses in Goa", test: (p) => /villa|bungalow|estate|mansion|house|homestay|cottage/i.test(p.title) },
  { slug: "pools", name: "Stays with a pool", inGoa: "Stays with a pool in Goa", test: hasPool },
  { slug: "apartments", name: "Apartments", inGoa: "Apartments in Goa", test: (p) => /apartment|flat|\bapt\b|studio|1\s?bhk/i.test(p.title) },
  { slug: "pet-friendly", name: "Pet-friendly stays", inGoa: "Pet-friendly stays in Goa", test: (p) => p.pets_allowed === true },
  {
    slug: "workation", name: "Workation stays", inGoa: "Workation stays in Goa", test: isWorkFriendly,
    title: "Goa Workation Stays with WiFi & a Workspace (2026) | Wayzyy",
    description: (n, min) => `${n} work-friendly villas and homes in Goa with WiFi and a dedicated workspace, from ${min} a night. Long-stay discounts where hosts offer them.`,
    intro: [
      "Every stay on this page lists both WiFi and a workspace, so you are not working from a bed or a café all month. Ask the host for a WiFi speed test and whether there is power backup before you book, especially for June to September, when monsoon storms cause short outages.",
      "For a workation, Assagao, Siolim and Anjuna are the easiest base: quiet lanes, good cafés and coworking spaces within 15 minutes by scooter. Some hosts offer a discount for stays of 7 nights or more, or 28 nights or more; if they do, it is applied automatically at checkout.",
    ],
    faqs: [
      { q: "Is Goa good for a workation?", a: "Yes. North Goa villages like Assagao, Siolim and Anjuna have fibre internet, work-friendly cafés and coworking spaces. October to May is the most reliable season; during the monsoon (June to September) it is quieter and cheaper, but plan for occasional power and internet cuts." },
      { q: "How do I check the WiFi before I book?", a: "Message the host from the listing and ask for a recent speed test screenshot and whether the router has power backup. For video calls, look for at least 50 Mbps." },
      { q: "Do stays give a discount for a month-long workation?", a: "Some hosts set a weekly discount (7+ nights) or a monthly discount (28+ nights). Pick your dates on a listing and the discount is shown in the price before you pay." },
      { q: "Where should I stay in Goa for a workation?", a: "Assagao and Siolim for quiet and cafés, Anjuna and Vagator if you want a social scene after work, and Palolem or Agonda in South Goa if you want the beach and do not mind fewer coworking options." },
    ],
  },
  { slug: "for-groups", name: "Stays for groups", inGoa: "Stays for groups in Goa", test: (p) => (p.max_guests ?? 0) >= 6 },
];

const titleCase = (s: string) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
const isGoa = (p: PlaceListing) => String(p.state ?? "").trim().toLowerCase() === "goa";
const areaSlug = (p: PlaceListing) => slugify(String(p.city ?? ""));
const MIN_LISTINGS = 2;

export interface PageLink { href: string; label: string; count: number }
export interface Faq { q: string; a: string }
export interface PlacePage {
  kind: "goa" | "region" | "area" | "category";
  path: string;               // canonical, e.g. /anjuna/stays
  placeName: string;          // "Anjuna" / "Goa"
  h1: string;
  title: string;
  description: string;
  intro: string[];
  listings: PlaceListing[];
  amenities: { name: string; count: number }[];
  faqs: Faq[];
  indexable: boolean;
  breadcrumbs: { name: string; path: string }[];
  related: { regions: PageLink[]; places: PageLink[]; categories: PageLink[] };
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function scopeListings(all: PlaceListing[], placeSlug: string): { list: PlaceListing[]; name: string; kind: PlacePage["kind"] } | null {
  const goa = all.filter(isGoa);
  if (placeSlug === "goa") return { list: goa, name: "Goa", kind: "goa" };
  const region = REGIONS[placeSlug];
  if (region) return { list: goa.filter((p) => region.areas.includes(areaSlug(p))), name: region.name, kind: "region" };
  const inArea = goa.filter((p) => areaSlug(p) === placeSlug && placeSlug !== "goa");
  if (inArea.length > 0) return { list: inArea, name: titleCase(String(inArea[0].city).trim()), kind: "area" };
  return null;
}

function topAmenities(list: PlaceListing[], limit = 8) {
  const counts = new Map<string, number>();
  for (const p of list) for (const a of new Set((p.amenities ?? []).map((x) => String(x).trim()).filter(Boolean))) counts.set(a, (counts.get(a) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([name, count]) => ({ name, count }));
}

/** Everything one page needs, or null if the address isn't a real page. */
export function buildPlacePage(all: PlaceListing[], placeSlug: string, catSlug?: string): PlacePage | null {
  const scope = scopeListings(all, placeSlug);
  if (!scope) return null;

  const cat = catSlug ? CATEGORIES.find((c) => c.slug === catSlug) : undefined;
  if (catSlug && (!cat || scope.kind !== "goa")) return null; // type pages live under /goa/stays/<type>

  const list = (cat ? scope.list.filter(cat.test) : scope.list)
    .slice()
    .sort((a, b) => (b.images?.length ?? 0) - (a.images?.length ?? 0) || Number(a.price_per_night) - Number(b.price_per_night));

  const n = list.length;
  const prices = list.map((p) => guestPrice(p.price_per_night));
  const min = n ? Math.min(...prices) : 0;
  const max = n ? Math.max(...prices) : 0;
  const guests = list.map((p) => p.max_guests ?? 0).filter(Boolean);
  const gMin = guests.length ? Math.min(...guests) : 0;
  const gMax = guests.length ? Math.max(...guests) : 0;
  const poolN = list.filter(hasPool).length;
  const petN = list.filter((p) => p.pets_allowed === true).length;
  const groupN = list.filter((p) => (p.max_guests ?? 0) >= 6).length;

  const where = scope.kind === "goa" ? "Goa" : scope.kind === "region" ? scope.name : `${scope.name}, Goa`;
  const path = cat ? `/goa/stays/${cat.slug}` : `/${placeSlug}/stays`;

  const h1 = cat ? cat.inGoa : `Holiday rentals in ${scope.kind === "area" ? `${scope.name}, Goa` : scope.name}`;
  const title = cat?.title ? cat.title : cat
    ? `${cat.inGoa} | Wayzyy`
    : scope.kind === "goa"
      ? "Holiday Rentals in Goa | Villas, Pools & Homes | Wayzyy"
      : scope.kind === "region"
        ? `${scope.name} Holiday Rentals | Wayzyy`
        : `Holiday Rentals in ${scope.name}, Goa | Wayzyy`;

  const highlight = poolN > 0 ? `${poolN} with a pool` : groupN > 0 ? `${groupN} that sleep 6 or more` : "homes for every kind of trip";
  const description = n && cat?.description ? cat.description(n, inr(min)) : n
    ? `${plural(n, "place")} to stay in ${where}, from ${inr(min)} a night. ${highlight}. Prices include Wayzyy's service fee; GST is added at checkout.`
    : `Holiday rentals in ${where} on Wayzyy.`;

  const intro: string[] = [];
  if (n) {
    intro.push(
      `Wayzyy has ${plural(n, "place")} to stay in ${where}${cat ? ` in the "${cat.name.toLowerCase()}" group` : ""}. ` +
        `Nightly prices run from ${inr(min)} to ${inr(max)}, with Wayzyy's service fee already included` +
        `${gMin && gMax ? `, and homes sleep between ${gMin} and ${gMax} guests` : ""}.`,
    );
    const bits: string[] = [];
    if (poolN) bits.push(`${plural(poolN, "stay")} ${poolN === 1 ? "has" : "have"} a pool`);
    if (groupN) bits.push(`${groupN} ${groupN === 1 ? "sleeps" : "sleep"} 6 guests or more`);
    if (petN) bits.push(`${petN} ${petN === 1 ? "welcomes" : "welcome"} pets`);
    if (bits.length) intro.push(`${bits.join(", ")}.`);
    if (cat?.intro) intro.push(...cat.intro);
    intro.push("Every stay shows the full price before you decide, and hosts on Wayzyy keep 100% of their nightly rate.");
  }

  const faqs: Faq[] = [...(n && cat?.faqs ? cat.faqs : [])];
  if (n) {
    faqs.push({
      q: `How much does it cost to stay in ${where}?`,
      a: `On Wayzyy, stays in ${where} cost from ${inr(min)} to ${inr(max)} per night. These prices include Wayzyy's service fee; GST is added when you book.`,
    });
    faqs.push({
      q: `Are there stays with a pool in ${where}?`,
      a: poolN
        ? `Yes. ${plural(poolN, "stay")} in ${where} on Wayzyy ${poolN === 1 ? "has" : "have"} a pool.`
        : `None of the stays currently listed for ${where} on Wayzyy mention a pool.`,
    });
    faqs.push({
      q: `Which stays in ${where} are good for groups?`,
      a: groupN
        ? `${plural(groupN, "stay")} in ${where} ${groupN === 1 ? "sleeps" : "sleep"} 6 guests or more. Open any listing to see its exact capacity and bedrooms.`
        : `The stays listed for ${where} sleep up to ${gMax || "a few"} guests. Open any listing for its exact capacity and bedrooms.`,
    });
    if (petN) {
      faqs.push({
        q: `Can I bring a pet to a stay in ${where}?`,
        a: `${plural(petN, "stay")} in ${where} ${petN === 1 ? "allows" : "allow"} pets. The pet policy and any pet fee are shown on each listing.`,
      });
    }
    faqs.push({
      q: "How do I book?",
      a: "Open a stay, choose your dates and guests, and follow the steps. If bookings are not open yet, you can send an enquiry from the listing and our team will get back to you.",
    });
  }

  const crumbs: { name: string; path: string }[] = [{ name: "Wayzyy", path: "/" }, { name: "Goa", path: "/goa/stays" }];
  if (scope.kind === "region" || scope.kind === "area") crumbs.push({ name: scope.name, path });
  if (cat) crumbs.push({ name: cat.name, path });

  return {
    kind: cat ? "category" : scope.kind,
    path, placeName: scope.name, h1, title, description, intro,
    listings: list,
    amenities: topAmenities(list),
    faqs,
    indexable: n >= MIN_LISTINGS,
    breadcrumbs: crumbs,
    related: relatedLinks(all),
  };
}

/** Links to every page that is worth visiting (two or more stays), for internal linking. */
export function relatedLinks(all: PlaceListing[]): PlacePage["related"] {
  const goa = all.filter(isGoa);
  const regions: PageLink[] = [{ href: "/goa/stays", label: "All of Goa", count: goa.length }];
  for (const [slug, r] of Object.entries(REGIONS)) {
    const count = goa.filter((p) => r.areas.includes(areaSlug(p))).length;
    if (count >= MIN_LISTINGS) regions.push({ href: `/${slug}/stays`, label: r.name, count });
  }
  const byArea = new Map<string, { label: string; count: number }>();
  for (const p of goa) {
    const s = areaSlug(p);
    if (!s || s === "goa") continue;
    const cur = byArea.get(s);
    byArea.set(s, { label: cur?.label ?? titleCase(String(p.city).trim()), count: (cur?.count ?? 0) + 1 });
  }
  const places = [...byArea.entries()]
    .filter(([, v]) => v.count >= MIN_LISTINGS)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([slug, v]) => ({ href: `/${slug}/stays`, label: v.label, count: v.count }));
  const categories = CATEGORIES.map((c) => ({ href: `/goa/stays/${c.slug}`, label: c.name, count: goa.filter(c.test).length })).filter(
    (c) => c.count >= MIN_LISTINGS,
  );
  return { regions, places, categories };
}

/** Every address that should be in the sitemap. */
export function allPlacePaths(all: PlaceListing[]): string[] {
  const rel = relatedLinks(all);
  return [...rel.regions, ...rel.places, ...rel.categories].map((l) => l.href);
}

/** JSON-LD for a page: breadcrumbs, the list of stays, and the FAQ. */
export function placeJsonLd(page: PlacePage, site = "https://wayzyy.com", pathFor: (p: PlaceListing) => string): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumbs.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, item: `${site}${b.path}` })),
    },
  ];
  if (page.listings.length) {
    out.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.h1,
      numberOfItems: page.listings.length,
      itemListElement: page.listings.slice(0, 30).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site}${pathFor(p)}`,
        name: p.title,
        ...(p.images?.[0] ? { image: p.images[0] } : {}),
      })),
    });
  }
  if (page.faqs.length) {
    out.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return out;
}
