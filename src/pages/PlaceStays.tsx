import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Users, BedDouble, MapPin, ChevronDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/lib/supabase";
import { propertyPath } from "@/lib/propertySlug";
import NotFound from "@/pages/NotFound";
import {
  buildPlacePage, placeJsonLd, guestPrice, inr, SEED_HOST_EMAILS,
  type PlaceListing,
} from "../../api/_lib/places";

// Place and type pages: /goa/stays, /north-goa/stays, /anjuna/stays,
// /goa/stays/villas ... All text, counts and prices are computed from the live
// listings by api/_lib/places.ts (the same code the crawler version uses).

const COLUMNS =
  "id, title, city, state, price_per_night, images, max_guests, bedrooms, amenities, space_type, pets_allowed, host_email";

const toArray = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string");
    } catch { /* not JSON */ }
  }
  return [];
};

/** Card-sized copy of a photo from our own storage (about a quarter of the bytes of the original). */
const thumb = (url: string, width = 640): string =>
  url.includes("/storage/v1/object/public/")
    ? `${url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/")}${url.includes("?") ? "&" : "?"}width=${width}&quality=70`
    : url;

export default function PlaceStays() {
  const { place = "", cat } = useParams<{ place: string; cat?: string }>();
  const [listings, setListings] = useState<PlaceListing[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("properties").select(COLUMNS).eq("status", "active");
      if (cancelled) return;
      const rows = (data ?? [])
        .filter((p: any) => !SEED_HOST_EMAILS.includes(String(p.host_email ?? "").toLowerCase()))
        .map((p: any) => ({ ...p, images: toArray(p.images), amenities: toArray(p.amenities) })) as PlaceListing[];
      setListings(rows);
    })();
    return () => { cancelled = true; };
  }, []);

  const page = useMemo(() => (listings ? buildPlacePage(listings, place, cat) : null), [listings, place, cat]);

  if (listings === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!page) return <NotFound />;

  const jsonLd = placeJsonLd(page, "https://wayzyy.com", (p) => propertyPath(p));
  const related = page.related;

  return (
    <SEO title={page.title} description={page.description} path={page.path} noindex={!page.indexable} jsonLd={jsonLd}>
      <div className="min-h-screen bg-background text-foreground">
        <AirbnbHeader compact />
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            {page.breadcrumbs.map((b, i) => (
              <span key={b.path}>
                {i > 0 && <span className="mx-1.5">/</span>}
                {i === page.breadcrumbs.length - 1 ? (
                  <span className="text-foreground">{b.name}</span>
                ) : (
                  <Link to={b.path} className="hover:underline">{b.name}</Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="font-display text-3xl font-bold sm:text-4xl">{page.h1}</h1>
          <div className="mt-3 max-w-3xl space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {page.intro.map((t, i) => <p key={i}>{t}</p>)}
          </div>

          {/* Other pages: regions, places and types - also how search engines find them. */}
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Explore stays">
            {[...related.regions, ...related.places, ...related.categories].map((l) => (
              <Link
                key={l.href}
                to={l.href}
                aria-current={l.href === page.path ? "page" : undefined}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  l.href === page.path
                    ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                {l.label} <span className="text-muted-foreground">· {l.count}</span>
              </Link>
            ))}
          </div>

          {page.listings.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
              No stays here yet. <Link to="/stays" className="font-semibold text-[#FF6B00] underline">Browse all stays</Link>.
            </p>
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {page.listings.map((p, i) => (
                <li key={p.id}>
                  <Link to={propertyPath(p)} className="group block">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                      {p.images?.[0] && (
                        <img
                          src={thumb(p.images[0])}
                          alt={p.title}
                          width={640}
                          height={480}
                          loading={i < 4 ? "eager" : "lazy"}
                          fetchPriority={i === 0 ? "high" : undefined}
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <h2 className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug">{p.title}</h2>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {[p.city, p.state].filter(Boolean).join(", ")}
                    </p>
                    <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      {p.max_guests ? <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.max_guests} guests</span> : null}
                      {p.bedrooms ? <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{p.bedrooms} bedrooms</span> : null}
                    </p>
                    <p className="font-price mt-1 text-sm">
                      <span className="font-bold">{inr(guestPrice(p.price_per_night))}</span>
                      <span className="text-muted-foreground"> / night</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {page.amenities.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-xl font-bold">Popular amenities in {page.placeName}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {page.amenities.map((a) => (
                  <li key={a.name} className="rounded-full bg-muted px-3.5 py-1.5 text-sm">
                    {a.name} <span className="text-muted-foreground">· {a.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section className="mt-14 max-w-3xl">
              <h2 className="font-display text-xl font-bold">Questions about staying in {page.placeName}</h2>
              <div className="mt-3 divide-y divide-border rounded-2xl border border-border">
                {page.faqs.map((f) => (
                  <details key={f.q} className="group px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                      {f.q}
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </main>
        <SiteFooter />
      </div>
    </SEO>
  );
}
