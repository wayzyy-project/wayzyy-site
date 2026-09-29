import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, MapPin, Users, BedDouble, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { SUPPORT_PHONE } from "@/components/host/HostGetStarted";

const SUPPORT_PHONE_HREF = SUPPORT_PHONE.replace(/\s+/g, "");

// Accounts whose listings are internal/demo data, never shown on a page we
// hand to a real client. Same two accounts the seed migration
// (20260623130000_seed_goa_properties.sql) owns and deletes/reseeds by.
const SEED_HOST_EMAILS = ["akshayne912@gmail.com", "hello@wayzyy.com"];

// Same North/South Goa taluka split used in the site's own Goa guides
// (src/pages/blog/NorthGoaVsSouthGoa.tsx), so "North Goa" here means the same
// thing it means everywhere else on wayzyy.com.
const NORTH_GOA_AREAS = [
  "calangute", "baga", "anjuna", "vagator", "candolim", "arpora", "assagao",
  "morjim", "ashwem", "mandrem", "siolim", "sinquerim", "saligao", "porvorim",
  "mapusa", "pilerne", "nerul", "reis magos", "panjim", "panaji",
];
const SOUTH_GOA_AREAS = [
  "margao", "colva", "benaulim", "palolem", "agonda", "patnem", "varca",
  "cavelossim", "betalbatim", "majorda", "utorda", "cansaulim", "vasco",
  "cola", "galgibaga", "canacona", "quepem", "chandor", "curtorim",
];

type Region = "all" | "north" | "south";

function classifyRegion(p: { city?: string | null; area?: string | null; street?: string | null }): Region {
  const haystack = `${p.area ?? ""} ${p.city ?? ""} ${p.street ?? ""}`.toLowerCase();
  if (NORTH_GOA_AREAS.some((a) => haystack.includes(a))) return "north";
  if (SOUTH_GOA_AREAS.some((a) => haystack.includes(a))) return "south";
  return "all"; // unclassified area - still shown, just excluded from a region-specific filter
}

interface Listing {
  id: string;
  title: string;
  area: string;
  city: string;
  pricePerNight: number;
  hasPricing: boolean;
  isDraft: boolean;
  maxGuests: number;
  bedrooms: number;
  image: string;
  amenities: string[];
  region: Region;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 50000;

export default function GoaStaysPublic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);

  // The URL is the source of truth - read straight from it, and every
  // control below writes straight back to it, so a filter change always
  // shows up in the address bar immediately and a shared link always
  // reproduces the same view on load.
  const region = (searchParams.get("region") as Region) || "all";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const minPrice = minPriceParam ? Number(minPriceParam) : DEFAULT_MIN_PRICE;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : DEFAULT_MAX_PRICE;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, city, area, street, images, price_per_night, max_guests, bedrooms, amenities, status, host_email")
        // Live listings, plus drafts still being onboarded - a draft without
        // pricing yet just gets a "call us" card instead of a price below.
        .in("status", ["active", "draft"])
        .not("host_email", "in", `(${SEED_HOST_EMAILS.join(",")})`)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const transformed: Listing[] = data.map((p: any) => {
          let images: string[] = [];
          if (Array.isArray(p.images)) images = p.images;
          else if (typeof p.images === "string") {
            try {
              const parsed = JSON.parse(p.images);
              if (Array.isArray(parsed)) images = parsed;
            } catch {
              /* leave empty */
            }
          }
          const price = Number(p.price_per_night) || 0;
          return {
            id: p.id,
            title: p.title || "Goa stay",
            area: p.area || p.street || "",
            city: p.city || "Goa",
            pricePerNight: price,
            hasPricing: price > 0,
            isDraft: p.status === "draft",
            maxGuests: Number(p.max_guests) || 0,
            bedrooms: Number(p.bedrooms) || 0,
            image: images[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
            amenities: Array.isArray(p.amenities) ? p.amenities.slice(0, 3) : [],
            region: classifyRegion(p),
          };
        });
        setListings(transformed);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (region !== "all" && l.region !== region) return false;
      // No pricing set yet (draft) - a price filter has nothing to compare
      // against, so it doesn't apply rather than hiding the listing.
      if (!l.hasPricing) return true;
      if (l.pricePerNight < minPrice) return false;
      if (l.pricePerNight > maxPrice) return false;
      return true;
    });
  }, [listings, region, minPrice, maxPrice]);

  function setRegion(r: Region) {
    const next = new URLSearchParams(searchParams);
    if (r === "all") next.delete("region");
    else next.set("region", r);
    setSearchParams(next, { replace: true });
  }

  function setPrice(next: { min?: number; max?: number }) {
    const params = new URLSearchParams(searchParams);
    const nextMin = next.min ?? minPrice;
    const nextMax = next.max ?? maxPrice;
    if (nextMin > DEFAULT_MIN_PRICE) params.set("minPrice", String(nextMin));
    else params.delete("minPrice");
    if (nextMax < DEFAULT_MAX_PRICE) params.set("maxPrice", String(nextMax));
    else params.delete("maxPrice");
    setSearchParams(params, { replace: true });
  }

  const hasPriceFilter = minPrice > DEFAULT_MIN_PRICE || maxPrice < DEFAULT_MAX_PRICE;

  return (
    <SEO
      title="Goa stays on Wayzyy"
      description="Browse verified, live Goa villas and homestays with real pricing, photos and amenities - no login needed."
    >
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="Wayzyy" className="h-7 w-7 rounded-full object-cover" />
            <span className="font-display text-base font-bold tracking-tight text-slate-900">wayzyy</span>
          </Link>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Stays in Goa</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {loading ? "Loading listings…" : `${filtered.length} listing${filtered.length === 1 ? "" : "s"}`}
            {region !== "all" && <> in {region === "north" ? "North" : "South"} Goa</>}
            {hasPriceFilter && <> · ₹{minPrice.toLocaleString("en-IN")}–₹{maxPrice.toLocaleString("en-IN")} / night</>}
          </p>

          {/* Region tabs - the simple North/South switch the client uses */}
          <div className="mt-5 flex gap-1 rounded-full bg-slate-100 p-1 w-fit">
            {(["all", "north", "south"] as Region[]).map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  region === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r === "all" ? "All Goa" : r === "north" ? "North Goa" : "South Goa"}
              </button>
            ))}
          </div>

          {/* Price range - writes straight to the URL on every change */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Price / night
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">₹</span>
              <input
                type="number"
                min={0}
                step={500}
                value={minPrice || ""}
                placeholder="Min"
                onChange={(e) => setPrice({ min: Number(e.target.value) || DEFAULT_MIN_PRICE })}
                className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
              />
              <span className="text-slate-400">–</span>
              <span className="text-sm text-slate-400">₹</span>
              <input
                type="number"
                min={0}
                step={500}
                value={maxPrice === DEFAULT_MAX_PRICE ? "" : maxPrice}
                placeholder="Max"
                onChange={(e) => setPrice({ max: Number(e.target.value) || DEFAULT_MAX_PRICE })}
                className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
              />
            </div>
            {hasPriceFilter && (
              <button
                onClick={() => setPrice({ min: DEFAULT_MIN_PRICE, max: DEFAULT_MAX_PRICE })}
                className="text-xs font-semibold text-ember hover:underline"
              >
                Clear price filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-6 w-6 animate-spin text-ember" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 text-center">
              <p className="text-base font-semibold text-slate-900">No listings match these filters</p>
              <p className="max-w-sm text-sm text-slate-500">Try widening the price range or switching the region tab.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l) => {
                // A draft without pricing isn't ready for a guest to click
                // through into (there's little to see yet) - the card's job
                // is to prompt a call, not a navigation, so it isn't wrapped
                // in the property-detail Link the way a priced card is.
                const cardBody = (
                  <>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={l.image}
                        alt={l.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-900">{l.title}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {[l.area, l.city].filter(Boolean).join(", ")}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {l.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <BedDouble className="h-3.5 w-3.5" /> {l.bedrooms}
                          </span>
                        )}
                        {l.maxGuests > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> {l.maxGuests}
                          </span>
                        )}
                      </div>
                      {l.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {l.amenities.map((a) => (
                            <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                      {l.hasPricing ? (
                        <p className="pt-1 text-sm font-bold text-slate-900">
                          ₹{l.pricePerNight.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-500">/ night</span>
                        </p>
                      ) : (
                        <div className="mt-1 rounded-xl bg-amber-50 p-2.5">
                          <p className="text-xs font-semibold text-amber-800">
                            Pricing isn't visible here yet - no worries, there's a reason. Interested? Give us a call.
                          </p>
                          <a
                            href={`tel:${SUPPORT_PHONE_HREF}`}
                            className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-ember hover:underline"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {SUPPORT_PHONE}
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                );

                return l.hasPricing ? (
                  <Link
                    key={l.id}
                    to={`/property/${l.id}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 transition-shadow hover:shadow-lg"
                  >
                    {cardBody}
                  </Link>
                ) : (
                  <div
                    key={l.id}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    {cardBody}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </SEO>
  );
}
