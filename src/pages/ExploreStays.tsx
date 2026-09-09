import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Map as MapIcon, Grid as GridIcon, Sparkles, ShieldCheck, Heart, SlidersHorizontal, Loader2, Info } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { CategoryBar, FilterOptions } from "@/components/marketplace/CategoryBar";
import { FilterModal } from "@/components/marketplace/FilterModal";
import { PropertyCard } from "@/components/marketplace/PropertyCard";
import { MOCK_PROPERTIES, PropertyListing } from "@/data/mockProperties";
import { supabase } from "@/lib/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Leaflet Price Pin
const createPriceIcon = (price: number, currency: string) => {
  return L.divIcon({
    className: "custom-price-pin",
    html: `<div style="
      background-color: #ffffff;
      color: #000000;
      font-weight: 800;
      font-size: 11px;
      padding: 5px 10px;
      border-radius: 24px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      border: 1px solid #e2e8f0;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 2px;
      cursor: pointer;
    ">${currency}${price.toLocaleString("en-IN")}</div>`,
    iconSize: [64, 26],
    iconAnchor: [32, 13],
  });
};

export default function ExploreStays() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [dbProperties, setDbProperties] = useState<PropertyListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [includeAllFees, setIncludeAllFees] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

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

  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    minPrice: 1000,
    maxPrice: 35000,
    propertyTypes: [],
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    instantBookOnly: false,
    includeAllFees: true
  });

  // Fetch live properties from Supabase
  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .neq("status", "rejected")
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
              } catch (e) {}
            }

            const price = Number(p.price_per_night) || 3500;

            return {
              id: p.id,
              slug: p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : p.id,
              title: p.title || "Spacious Homestay",
              description: p.description || "",
              category: (p.category?.toLowerCase() || "apartments") as any,
              propertyType: p.space_type ? `${p.space_type} in ${p.city || "India"}` : `Entire place in ${p.city || "India"}`,
              city: p.city || "Goa",
              area: p.street || p.city || "North Goa",
              state: p.state || "Goa",
              country: "India",
              lat: Number(p.lat) || 15.5898,
              lng: Number(p.lng) || 73.7749,
              images: parsedImages,
              pricePerNight: price,
              originalPrice: price * 2,
              currency: "₹",
              rating: 5.0,
              reviewCount: 9,
              isGuestFavourite: true,
              isTopTenPercent: true,
              maxGuests: Number(p.max_guests) || 4,
              bedrooms: Number(p.bedrooms) || 2,
              beds: Number(p.beds) || 2,
              bathrooms: Number(p.bathrooms) || 2,
              amenities: Array.isArray(p.amenities) && p.amenities.length > 0 ? p.amenities : [
                "Fast Wifi (150+ Mbps)",
                "Air conditioning in all rooms",
                "Fully equipped modular kitchen",
                "Dedicated workspace with ergonomic desk"
              ],
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
        setDbProperties(transformed);
        }
      } catch (err) {
        console.error("Error loading properties from supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  // Combined properties: DB listings + Mock Listings
  const allProperties = useMemo(() => {
    const map = new Map<string, PropertyListing>();
    MOCK_PROPERTIES.forEach((p) => map.set(p.id, p));
    dbProperties.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [dbProperties]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
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
        if (selectedCategory === "goa" && !p.state?.toLowerCase().includes("goa") && !p.city?.toLowerCase().includes("goa")) return false;
        if (selectedCategory === "villas" && p.category !== "villas" && !p.propertyType.toLowerCase().includes("villa")) return false;
        if (selectedCategory === "pools" && p.category !== "pools" && !p.amenities.some(a => a.toLowerCase().includes("pool"))) return false;
        if (selectedCategory === "apartments" && p.category !== "apartments" && !p.propertyType.toLowerCase().includes("flat") && !p.propertyType.toLowerCase().includes("apartment")) return false;
        if (selectedCategory === "beachfront" && p.category !== "beachfront" && !p.title.toLowerCase().includes("beach") && !p.title.toLowerCase().includes("river")) return false;
      }

      // Price filter
      if (p.pricePerNight < filters.minPrice || p.pricePerNight > filters.maxPrice) {
        return false;
      }

      // Bedrooms
      if (filters.bedrooms > 0 && p.bedrooms < filters.bedrooms) return false;

      // Bathrooms
      if (filters.bathrooms > 0 && p.bathrooms < filters.bathrooms) return false;

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((req) =>
          p.amenities.some((a) => a.toLowerCase().includes(req.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      // Instant book
      if (filters.instantBookOnly && !p.instantBook) return false;

      return true;
    });
  }, [allProperties, searchState, selectedCategory, filters]);

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
        />

        {/* Filter Modal Dialog */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onApplyFilters={(f) => setFilters(f)}
          totalResultsCount={filteredProperties.length}
        />

        {/* Zero Guest Fee Guarantee Banner */}
        <div className="bg-gradient-to-r from-[#FF6B00]/10 via-[#FF6B00]/5 to-[#FF6B00]/10 border-b border-[#FF6B00]/20 py-2.5 px-4 text-center">
          <p className="text-xs font-semibold text-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FF6B00]" />
            <span>
              <strong className="text-[#FF6B00]">Wayzyy Advantage:</strong> 0% guest service fee (Save ~15.5% on every booking) · 100% Aadhaar Verified Hosts
            </span>
          </p>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
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

          {/* Location Group: Available next month in North Goa (Matching Screenshot 1) */}
          {northGoaProperties.length > 0 && !searchState.destination && (
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Link
                  to="/stays?city=Goa"
                  className="group flex items-center gap-2 text-xl font-bold font-display text-foreground hover:text-[#FF6B00] transition-colors"
                >
                  <span>Available next month in North Goa</span>
                  <div className="h-6 w-6 rounded-full bg-muted group-hover:bg-[#FF6B00] group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
                <span className="text-xs text-muted-foreground hidden sm:inline font-medium">Assagao · Vagator · Arpora · Candolim</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {northGoaProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    nights={2}
                    includeAllFees={includeAllFees}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Complete Grid when filtered or when browsing all */}
          {(searchState.destination || selectedCategory !== "all" || northGoaProperties.length === 0) && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    nights={2}
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
                <MapContainer
                  center={[28.6280, 77.3820]}
                  zoom={6}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                  style={{ minHeight: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredProperties.map((p) => (
                    <Marker
                      key={p.id}
                      position={[p.lat, p.lng]}
                      icon={createPriceIcon(p.pricePerNight * 2, p.currency)}
                    >
                      <Popup className="custom-map-popup">
                        <div className="w-56 p-1">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-28 object-cover rounded-2xl mb-2"
                          />
                          <p className="text-xs font-bold text-foreground line-clamp-1">{p.title}</p>
                          <p className="text-[11px] text-muted-foreground">{p.city}, {p.state}</p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-xs font-black text-foreground">
                              {p.currency}{(p.pricePerNight * 2).toLocaleString("en-IN")} <span className="text-[10px] font-normal text-muted-foreground">for 2 nights</span>
                            </span>
                            <Link
                              to={`/property/${p.id}`}
                              className="text-[11px] font-bold text-[#FF6B00] hover:underline"
                            >
                              View →
                            </Link>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}
        </main>
      </div>
    </SEO>
  );
}
