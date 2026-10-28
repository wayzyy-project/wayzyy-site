import { spaceTypeLine } from "@/lib/spaceType";
import { img } from "@/lib/img";
import React, { useState, useEffect, useMemo } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Map as MapIcon, Grid as GridIcon, ShieldCheck, Heart, SlidersHorizontal, Loader2, Info } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { CategoryBar, FilterOptions, DEFAULT_FILTERS } from "@/components/marketplace/CategoryBar";
import { FilterModal } from "@/components/marketplace/FilterModal";
import { PropertyCard } from "@/components/marketplace/PropertyCard";
import { AREA_GUIDES, TRIP_GUIDES } from "@/data/areaGuides";
import { MOCK_PROPERTIES, PropertyListing } from "@/data/mockProperties";
import { supabase } from "@/lib/supabase";
import { isBrowsable } from "../../api/_lib/places";
import { cardHostNightly, guestNightlyPrice, toDateStr, type GuestPricingTier } from "@/lib/pricing";
import { APIProvider, Map as GoogleMap, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/lib/googleMaps";
import { propertyPath } from "@/lib/propertySlug";
import { PropertyGridSkeleton } from "@/components/marketplace/Skeletons";

// Same price-pill look the old Leaflet divIcon had, as a real component now
// that it's an AdvancedMarker's `content` rather than a static HTML string.
function PricePin({ price, currency, label }: { price: number; currency: string; label?: string }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        fontWeight: 800,
        fontSize: 11,
        padding: "5px 10px",
        borderRadius: 24,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        border: "1px solid #e2e8f0",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {label ?? `${currency}${price.toLocaleString("en-IN")}`}
    </div>
  );
}

// Real listings that live on one of the seed accounts above and should be
// shown anyway (the seed filter exists to hide old demo listings).
const PUBLIC_DESPITE_SEED_HOST = [
  "f9369419-9808-4a0b-a999-1519b869ac08", // Urban Villa, Rohini (hello@wayzyy.com)
];

const SEED_HOST_EMAILS = [
  "akshayne912@gmail.com",
  "hello@wayzyy.com",
  "akshaytrythis@gmail.com",
  "anantsharma8055@gmail.com",
  "raijagriti.work@gmail.com",
  "priyanshubhardwaj0912@gmail.com",
];

// Short filter labels (same list as the app) -> words to look for in a
// listing's amenities.
const AMENITY_KEYWORDS: Record<string, string[]> = {
  WiFi: ["wifi", "wi-fi", "internet"],
  Kitchen: ["kitchen"],
  Washer: ["washer", "washing"],
  AC: ["air condition", "ac "],
  Heating: ["heating", "heater"],
  "Hot Water": ["hot water", "geyser"],
  TV: ["tv", "television"],
  Pool: ["pool"],
  Parking: ["parking"],
  Breakfast: ["breakfast"],
  Garden: ["garden", "lawn"],
  "Beach Access": ["beach"],
  "Pet-friendly": ["pet"],
  BBQ: ["bbq", "barbecue", "grill"],
  Workspace: ["workspace", "desk"],
  Gym: ["gym", "fitness"],
  "EV Charger": ["ev charger", "charger"],
};

function matchesFilters(p: PropertyListing, f: FilterOptions): boolean {
  // Showcase listings have no price yet, so any budget leaves them out.
  const budgetSet = f.minPrice > DEFAULT_FILTERS.minPrice || f.maxPrice < DEFAULT_FILTERS.maxPrice;
  if (p.showcase) {
    if (budgetSet) return false;
  } else if (p.pricePerNight < f.minPrice || p.pricePerNight > f.maxPrice) {
    return false;
  }
  if (f.placeType === "room" && !p.isRoom) return false;
  if (f.placeType === "entire" && p.isRoom) return false;
  if (f.bedrooms > 0 && p.bedrooms < f.bedrooms) return false;
  if (f.beds > 0 && p.beds < f.beds) return false;
  if (f.bathrooms > 0 && p.bathrooms < f.bathrooms) return false;
  if (f.selfCheckIn && !p.hasSelfCheckIn) return false;
  if (f.petsAllowed && !p.allowsPets) return false;
  if (f.amenities.length > 0) {
    const text = (p.amenities ?? []).join(" | ").toLowerCase() + " ";
    const ok = f.amenities.every((label) => (AMENITY_KEYWORDS[label] ?? [label.toLowerCase()]).some((k) => text.includes(k)));
    if (!ok) return false;
  }
  return true;
}

export default function ExploreStays() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [dbProperties, setDbProperties] = useState<PropertyListing[]>([]);
  // What each live listing's card price is built from (host rate, guest-count
  // pricing), kept apart from the display data so cardHostNightly() can price
  // the card for the searched party and nights - exactly as the app does.
  const [cardInputs, setCardInputs] = useState<Record<string, {
    hostPrice: number; tiers: GuestPricingTier[]; perPerson: boolean; threshold: number | null; fee: number | null;
  }>>({});
  // Host prices for the searched nights: listing id -> 'YYYY-MM-DD' -> price.
  const [searchDatePrices, setSearchDatePrices] = useState<Record<string, Record<string, number>>>({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [includeAllFees, setIncludeAllFees] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [openMapPinId, setOpenMapPinId] = useState<string | null>(null);

  // Search State
  const destinationQuery = searchParams.get("city") || "";
  const guestsQuery = Number(searchParams.get("guests")) || 1;

  const [searchState, setSearchState] = useState({
    destination: destinationQuery,
    checkIn: null as Date | null,
    checkOut: null as Date | null,
    guests: {
      adults: Math.max(1, guestsQuery),
      children: 0,
      infants: 0,
    }
  });

  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  // Cards show the per-night price until the guest picks dates, then the stay total.
  const datesPicked = !!(searchState.checkIn && searchState.checkOut);
  const stayNights = searchState.checkIn && searchState.checkOut
    ? Math.max(1, Math.round((searchState.checkOut.getTime() - searchState.checkIn.getTime()) / 86400000))
    : 1;

  // Fetch live properties from Supabase
  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*, property_guest_pricing_tiers(min_guests, price_per_night, on_dated_nights)")
          // Live listings, plus showcased drafts (enquiry-only, no price yet).
          .or("status.eq.active,showcase.eq.true")
          .or(`host_email.not.in.(${SEED_HOST_EMAILS.join(",")}),id.in.(${PUBLIC_DESPITE_SEED_HOST.join(",")})`)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const transformed: PropertyListing[] = data.map((p: any) => {
            let parsedImages = ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80"];
            if (Array.isArray(p.images) && p.images.length > 0) {
              parsedImages = p.images;
            } else if (typeof p.images === "string") {
              try {
                const arr = JSON.parse(p.images);
                if (Array.isArray(arr) && arr.length > 0) parsedImages = arr;
              } catch (e) { /* ignore */ }
            }

            const price = Number(p.price_per_night) || 3500;

            return {
              id: p.id,
              slug: p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : p.id,
              title: p.title || "Spacious Homestay",
              description: p.description || "",
              // The database stores singular categories ("villa", "apartment"); the tabs use plurals.
              category: (({ villa: "villas", apartment: "apartments", room: "rooms", house: "homes", beach: "beachfront" } as Record<string, string>)[p.category?.toLowerCase()] ?? (p.category?.toLowerCase() || "apartments")) as any,
              vibe: p.vibe ?? null,
              showcase: p.status !== "active" && !!p.showcase,
              minNights: Number(p.min_nights) || 1,
              hasSelfCheckIn: !!p.self_check_in,
              allowsPets: !!p.pets_allowed,
              isRoom: /room|^private$|^shared$/i.test(p.space_type ?? ""), // stored as "private"/"shared" codes too
              propertyType: spaceTypeLine(p.space_type, p.city, "India"),
              city: p.city || "Goa",
              // properties has 'location', not 'street'/'lat'/'lng' - those
              // don't exist, so every real listing's map pin was landing on
              // this same fallback point instead of its real location.
              area: p.location || p.city || "North Goa",
              state: p.state || "Goa",
              country: "India",
              lat: Number(p.latitude) || 15.5898,
              lng: Number(p.longitude) || 73.7749,
              images: parsedImages,
              pricePerNight: price,
              tags: Array.isArray(p.tags) ? p.tags.map(String).filter(Boolean) : [],
              originalPrice: price * 2,
              currency: "₹",
              // Real reviews aren't accurate/complete yet - PropertyCard no
              // longer renders any of these, kept at 0/false rather than a
              // flat "5.0 · 9 reviews · guest favourite" on every listing.
              rating: 0,
              reviewCount: 0,
              isGuestFavourite: false,
              isTopTenPercent: false,
              maxGuests: Number(p.max_guests) || 4,
              bedrooms: Number(p.bedrooms) || 2,
              beds: Number(p.beds) || 2,
              bathrooms: Number(p.bathrooms) || 2,
              // Real amenities only - filters match against these.
              amenities: [...(Array.isArray(p.amenities) ? p.amenities : []), ...(p.pets_allowed ? ["Pets allowed"] : [])],
            host: {
              name: p.host_email ? p.host_email.split("@")[0] : "Verified Host",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              isSuperhost: true,
              joinedDate: "Joined in 2025",
              responseRate: "100%",
              responseTime: "within an hour"
            },
            highlights: [
              { icon: "trophy", title: "Guest favourite", description: "One of the most loved homes on Wayzyy." },
              { icon: "door", title: "Self check-in", description: "Easy digital check-in." }
            ],
            ratingsBreakdown: { cleanliness: 5.0, accuracy: 5.0, communication: 5.0, location: 4.9, checkIn: 5.0, value: 5.0 },
            reviews: [],
            houseRules: {
              checkIn: "2:00 PM",
              checkOut: "11:00 AM",
              selfCheckIn: "Self check-in",
              smoking: false,
              pets: false,
              parties: false
            },
            cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
            instantBook: true,
            featuredSection: "north_goa"
          };
        });
        // Goa-only for browsing: listings elsewhere in India stay bookable
        // through their own link but aren't shown here (see isBrowsable).
        setDbProperties(transformed.filter((p) => isBrowsable(p)));
        const inputs: typeof cardInputs = {};
        for (const p of data as any[]) {
          inputs[p.id] = {
            hostPrice: Number(p.price_per_night) || 0,
            tiers: (p.property_guest_pricing_tiers ?? []).map((t: any) => ({
              minGuests: t.min_guests, pricePerNight: Number(t.price_per_night), onDatedNights: t.on_dated_nights === true,
            })),
            perPerson: !!p.per_person_pricing_enabled,
            threshold: p.extra_guest_threshold ?? null,
            fee: p.extra_guest_fee != null ? Number(p.extra_guest_fee) : null,
          };
        }
        setCardInputs(inputs);
        }
      } catch (err) {
        console.error("Error loading properties from supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  const searchCheckIn = searchState.checkIn ? toDateStr(searchState.checkIn) : null;
  const searchCheckOut = searchState.checkOut ? toDateStr(searchState.checkOut) : null;
  useEffect(() => {
    if (!searchCheckIn || !searchCheckOut) { setSearchDatePrices({}); return; }
    let cancelled = false;
    supabase
      .from("date_prices")
      .select("property_id, date, price")
      .gte("date", searchCheckIn)
      .lt("date", searchCheckOut)
      .then(({ data }) => {
        if (cancelled) return;
        const map: Record<string, Record<string, number>> = {};
        for (const r of (data ?? []) as { property_id: string; date: string; price: number }[]) {
          if (!map[r.property_id]) map[r.property_id] = {};
          map[r.property_id][r.date] = Number(r.price);
        }
        setSearchDatePrices(map);
      });
    return () => { cancelled = true; };
  }, [searchCheckIn, searchCheckOut]);

  // Combined properties: DB listings + Mock Listings. Live listings' prices
  // follow the searched party size and nights (cardHostNightly), the same
  // rule the app's Explore cards use, so one search shows one price on both.
  const searchGuests = searchState.guests.adults + searchState.guests.children;
  // Carried into the listing page so it prices the same stay as the card.
  const cardSearch = (() => {
    const q = new URLSearchParams();
    if (searchCheckIn && searchCheckOut) { q.set("checkin", searchCheckIn); q.set("checkout", searchCheckOut); }
    if (searchGuests > 1) q.set("guests", String(searchGuests));
    const str = q.toString();
    return str ? `?${str}` : "";
  })();
  const allProperties = useMemo(() => {
    const map = new Map<string, PropertyListing>();
    MOCK_PROPERTIES.forEach((p) => map.set(p.id, p));
    dbProperties.forEach((p) => {
      const input = cardInputs[p.id];
      if (!input || !input.hostPrice) { map.set(p.id, p); return; }
      const pricePerNight = cardHostNightly({
        hostPricePerNight: input.hostPrice,
        guests: Math.max(1, searchGuests),
        tiers: input.tiers,
        perPersonEnabled: input.perPerson,
        extraGuestThreshold: input.threshold,
        extraGuestFee: input.fee,
        dateOverrides: searchDatePrices[p.id],
        checkIn: searchCheckIn,
        checkOut: searchCheckOut,
      });
      map.set(p.id, pricePerNight === p.pricePerNight ? p : { ...p, pricePerNight });
    });
    return Array.from(map.values());
  }, [dbProperties, cardInputs, searchGuests, searchDatePrices, searchCheckIn, searchCheckOut]);

  // Filtered properties
  // Search box + category; the Filters panel is applied on top of this.
  const baseProperties = useMemo(() => {
    return allProperties.filter((p) => {
      // Destination filter
      if (searchState.destination) {
        const query = searchState.destination.toLowerCase();
        const matchesCity = p.city?.toLowerCase().includes(query);
        const matchesArea = p.area?.toLowerCase().includes(query);
        const matchesState = p.state?.toLowerCase().includes(query);
        const matchesTitle = p.title?.toLowerCase().includes(query);
        if (!matchesCity && !matchesArea && !matchesState && !matchesTitle) {
          return false;
        }
      }

      // Guest count filter
      const totalGuests = searchState.guests.adults + searchState.guests.children;
      if (totalGuests > p.maxGuests) return false;

      // Category filter
      if (selectedCategory !== "all") {
        if (["beach", "heritage", "farm", "clifftop"].includes(selectedCategory) && p.vibe !== selectedCategory) return false;
        if (selectedCategory === "goa" && !p.state?.toLowerCase().includes("goa") && !p.city?.toLowerCase().includes("goa")) return false;
        if (selectedCategory === "villas" && p.category !== "villas" && !p.propertyType.toLowerCase().includes("villa")) return false;
        if (selectedCategory === "pools" && p.category !== "pools" && !p.amenities.some(a => a.toLowerCase().includes("pool"))) return false;
        // "Modern 2BHKs": any home with exactly two bedrooms, whatever its type.
        if (selectedCategory === "apartments" && p.bedrooms !== 2) return false;
        if (selectedCategory === "beachfront" && p.category !== "beachfront" && !p.title.toLowerCase().includes("beach") && !p.title.toLowerCase().includes("river")) return false;
      }

      return true;
    });
  }, [allProperties, searchState, selectedCategory]);

  const filteredProperties = useMemo(
    () => baseProperties.filter((p) => matchesFilters(p, filters)),
    [baseProperties, filters],
  );

  const northGoaProperties = useMemo(() => {
    return filteredProperties.filter((p) => 
      p.state?.toLowerCase().includes("goa") || 
      p.city?.toLowerCase().includes("goa") || 
      p.area?.toLowerCase().includes("assagao") || 
      p.area?.toLowerCase().includes("vagator") ||
      p.area?.toLowerCase().includes("candolim") ||
      p.area?.toLowerCase().includes("arpora")
    );
  }, [filteredProperties]);

  const handlePerformSearch = (newSearchState: typeof searchState) => {
    setSearchState(newSearchState);
    if (newSearchState.destination) {
      setSearchParams({ city: newSearchState.destination, guests: String(newSearchState.guests.adults + newSearchState.guests.children) });
    } else {
      setSearchParams({});
    }
  };

  return (
    <SEO
      title="Explore Stays & Homestays in Goa & India - Wayzyy"
      description="Book verified 2BHKs, luxury villas with private pools, and beachfront stays. Zero guest booking fee, flat-rate host marketplace."
    >
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Top Airbnb Navbar */}
        <AirbnbHeader
          searchState={searchState}
          onPerformSearch={handlePerformSearch}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          activeCategory={selectedCategory}
        />

        {/* Category Horizontal Filter Bar */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenFilterModal={() => setIsFilterModalOpen(true)}
          includeAllFees={includeAllFees}
          onToggleIncludeAllFees={(val) => setIncludeAllFees(val)}
          filters={filters}
          onChangeFilters={setFilters}
        />

        {/* Filter Modal Dialog */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onApplyFilters={(f) => setFilters(f)}
          countFor={(f) => baseProperties.filter((p) => matchesFilters(p, f)).length}
        />

        {/* Zero Guest Fee Guarantee Banner */}
        <div className="border-b border-[#FF6B00]/15 bg-[#FF6B00]/[0.06]">
          <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10 xl:px-14 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[13px] text-foreground">
            <span><strong className="text-[#FF6B00]">Wayzyy Advantage:</strong> Save ~17% on each booking*</span>
            <span className="text-muted-foreground">Every listing reviewed by our team</span>
            <span className="text-[11px] text-muted-foreground">*Estimated, based on typical booking-platform service fees.</span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 mx-auto max-w-[1760px] w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8 space-y-12">
          {/* Active Search / Filter Feedback */}
          {searchState.destination && (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">Stays in "{searchState.destination}"</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{filteredProperties.length} verified places available</p>
              </div>
              <button
                onClick={() => {
                  setSearchState({ ...searchState, destination: "" });
                  setSearchParams({});
                }}
                className="text-xs font-bold text-[#FF6B00] hover:underline"
              >
                Clear location filter
              </button>
            </div>
          )}

          {/* First load: placeholder cards in the real grid, instead of a blank page or a "no results" flash. */}
          {loading && baseProperties.length === 0 && <PropertyGridSkeleton count={8} />}

          {/* All of Goa on the default tab; a picked tab shows only its own grid below (showing both listed everything twice) */}
          {northGoaProperties.length > 0 && !searchState.destination && selectedCategory === "all" && (
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Link
                  to="/stays?city=Goa"
                  className="group flex items-center gap-2 text-xl font-bold font-display text-foreground hover:text-[#FF6B00] transition-colors"
                >
                  <span>Stays across Goa</span>
                  <div className="h-6 w-6 rounded-full bg-muted group-hover:bg-[#FF6B00] group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
                <span className="text-xs text-muted-foreground hidden sm:inline font-medium">Assagao · Siolim · Candolim · Panjim</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1900px]:grid-cols-6 gap-x-6 gap-y-10">
                {northGoaProperties.map((property, idx) => (
                  <PropertyCard
                    key={property.id}
                    priority={idx < 4}
                    property={property}
                    nights={datesPicked ? stayNights : undefined}
                    search={cardSearch}
                    includeAllFees={includeAllFees}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Area guides: where to stay, linked to the long-form blog guides */}
          {!searchState.destination && selectedCategory === "all" && (
            <section className="space-y-5 border-t border-border pt-10" aria-labelledby="areas-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="areas-heading" className="text-xl font-bold font-display text-foreground">Explore Goa by area</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Not sure where to stay? Each area has its own feel. Read the guide, then pick a stay.</p>
                </div>
                <Link to="/blog" className="text-sm font-semibold text-[#FF6B00] hover:underline">All travel guides</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {AREA_GUIDES.map((g) => (
                  <Link
                    key={g.area}
                    to={g.guide}
                    className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[#FF6B00]/50"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF6B00]">{g.vibe}</span>
                    <span className="text-lg font-bold text-foreground">{g.area}</span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{g.blurb}</span>
                    <span className="mt-auto pt-2 text-sm font-semibold text-foreground group-hover:text-[#FF6B00] transition-colors">Read the {g.area} guide →</span>
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {TRIP_GUIDES.map((t) => (
                  <Link key={t.to} to={t.to} className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-foreground/40 transition-colors">
                    {t.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Complete Grid when filtered or when browsing all */}
          {!(loading && baseProperties.length === 0) && (searchState.destination || selectedCategory !== "all" || northGoaProperties.length === 0) && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1900px]:grid-cols-6 gap-x-6 gap-y-10">
                {filteredProperties.map((property, idx) => (
                  <PropertyCard
                    key={property.id}
                    priority={idx < 4}
                    property={property}
                    nights={datesPicked ? stayNights : undefined}
                    search={cardSearch}
                    includeAllFees={includeAllFees}
                  />
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border py-16 text-center space-y-3">
                  <p className="text-base font-bold text-foreground">No matching properties found</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your dates, removing price constraints, or searching for a broader location like "North Goa" or "Goa".
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchState({ ...searchState, destination: "" });
                    }}
                    className="mt-2 rounded-2xl px-6 py-2.5 bg-[#FF6B00] text-white text-xs font-bold shadow-md shadow-[#FF6B00]/20"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Split Map View Floating Button */}
          <div className="fixed bottom-8 inset-x-0 flex justify-center z-40 pointer-events-none">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "map" : "grid")}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-extrabold"
            >
              {viewMode === "grid" ? (
                <>
                  <MapIcon className="h-4 w-4 text-[#FF6B00]" />
                  <span>Show Map</span>
                </>
              ) : (
                <>
                  <GridIcon className="h-4 w-4 text-[#FF6B00]" />
                  <span>Show List</span>
                </>
              )}
            </button>
          </div>

          {/* Full Screen Map View Panel when active */}
          {viewMode === "map" && (
            <div className="fixed inset-0 top-[140px] z-30 bg-background flex flex-col">
              <div className="flex-1 w-full h-full relative">
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapId="DEMO_MAP_ID"
                    defaultCenter={{ lat: 15.55, lng: 73.78 }}
                    defaultZoom={10}
                    scrollwheel
                    disableDefaultUI
                    zoomControl
                    style={{ width: "100%", height: "100%" }}
                  >
                    {filteredProperties.map((p) => (
                      <AdvancedMarker
                        key={p.id}
                        position={{ lat: p.lat, lng: p.lng }}
                        onClick={() => setOpenMapPinId(p.id)}
                      >
                        <PricePin price={p.pricePerNight * 2} currency={p.currency} label={p.showcase ? "Enquire" : undefined} />
                      </AdvancedMarker>
                    ))}
                    {filteredProperties.map((p) =>
                      openMapPinId === p.id ? (
                        <InfoWindow
                          key={p.id}
                          position={{ lat: p.lat, lng: p.lng }}
                          onCloseClick={() => setOpenMapPinId(null)}
                        >
                          <div className="w-56 p-1">
                            <img
                              src={img(p.images[0], 640)}
                              alt={p.title}
                              className="w-full h-28 object-cover rounded-2xl mb-2"
                            />
                            <p className="text-xs font-bold text-foreground line-clamp-1">{p.title}</p>
                            <p className="text-[11px] text-muted-foreground">{p.city}, {p.state}</p>
                            <div className="mt-1.5 flex items-center justify-between">
                              {p.showcase ? (
                                <span className="text-xs font-bold text-ember">Contact us to book</span>
                              ) : (
                              <span className="font-price text-xs font-bold text-foreground">
                                {/* Same figure as the card: price with our 7% fee, per night or for the stay. */}
                                {p.currency}{(guestNightlyPrice(p.pricePerNight) * (datesPicked ? stayNights : 1)).toLocaleString("en-IN")} <span className="text-[10px] font-normal text-muted-foreground">{datesPicked && stayNights > 1 ? `for ${stayNights} nights` : "night"}</span>
                              </span>
                              )}
                              <Link
                                to={propertyPath(p) + cardSearch}
                                className="text-[11px] font-bold text-[#FF6B00] hover:underline"
                              >
                                View →
                              </Link>
                            </div>
                          </div>
                        </InfoWindow>
                      ) : null,
                    )}
                  </GoogleMap>
                </APIProvider>
              </div>
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    </SEO>
  );
}
