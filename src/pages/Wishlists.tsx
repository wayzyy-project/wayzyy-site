import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { PropertyCard } from "@/components/marketplace/PropertyCard";
import { MOCK_PROPERTIES, PropertyListing } from "@/data/mockProperties";
import { supabase } from "@/lib/supabase";
import { getWishlistIds } from "@/lib/wishlist";

export default function Wishlists() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [dbProperties, setDbProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = () => {
    setWishlistIds(getWishlistIds());
  };

  useEffect(() => {
    loadSaved();
    window.addEventListener("wayzyy_wishlist_updated", loadSaved);
    return () => window.removeEventListener("wayzyy_wishlist_updated", loadSaved);
  }, []);

  // Fetch live properties from Supabase
  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const transformed: PropertyListing[] = data.map((p: any) => ({
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
            lat: p.lat || 28.6280,
            lng: p.lng || 77.3820,
            images: p.images && p.images.length > 0 ? p.images : [
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80"
            ],
            pricePerNight: p.price_per_night || 3500,
            originalPrice: (p.price_per_night || 3500) * 2,
            currency: "₹",
            rating: 5.0,
            reviewCount: 9,
            isGuestFavourite: true,
            maxGuests: p.max_guests || 4,
            bedrooms: p.bedrooms || 2,
            beds: p.beds || 2,
            bathrooms: p.bathrooms || 2,
            amenities: p.amenities || [
              "Fast Wifi (150+ Mbps)",
              "Air conditioning in all rooms",
              "Fully equipped modular kitchen"
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
              { icon: "trophy", title: "Guest favourite", description: "One of the most loved homes on Wayzyy." }
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
            instantBook: true
          }));
          setDbProperties(transformed);
        }
      } catch (err) {
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  const allProperties = useMemo(() => {
    const map = new Map<string, PropertyListing>();
    MOCK_PROPERTIES.forEach((p) => map.set(p.id, p));
    dbProperties.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [dbProperties]);

  const savedProperties = useMemo(() => {
    return allProperties.filter((p) => wishlistIds.includes(p.id));
  }, [allProperties, wishlistIds]);

  return (
    <SEO
      title="Saved Wishlists - Wayzyy"
      description="View your favorite homestays, 2BHKs, and pool villas saved on Wayzyy."
    >
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <AirbnbHeader compact />

        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-foreground">
              Wishlists
            </h1>
            <p className="text-xs text-muted-foreground">
              {savedProperties.length > 0 
                ? `${savedProperties.length} saved ${savedProperties.length === 1 ? "property" : "properties"}`
                : "Your saved homestays and vacation getaways"}
            </p>
          </div>

          {savedProperties.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4 max-w-xl mx-auto my-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
                <Heart className="h-8 w-8 fill-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground">Create your first wishlist</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                As you search, tap the heart icon on any stay to save your favorite homestays, pool villas, and 2BHKs here.
              </p>
              <Link
                to="/stays"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E05300] text-white px-6 py-3 text-xs font-bold shadow-md shadow-[#FF6B00]/25 hover:scale-105 transition-all"
              >
                <span>Start exploring stays</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  nights={2}
                  includeAllFees={true}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </SEO>
  );
}
