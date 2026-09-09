import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Star, 
  Share2, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Grid, 
  X, 
  DoorClosed, 
  Trophy, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  Check, 
  Wifi, 
  Tv, 
  Wind, 
  Utensils, 
  Car, 
  Waves, 
  Lock, 
  Clock, 
  AlertCircle,
  Flag,
  Loader2,
  Award
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { MOCK_PROPERTIES, PropertyListing } from "@/data/mockProperties";
import { quoteStay, type PricingInputs, type GuestPricingTier } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { isPropertyWishlisted, toggleWishlist } from "@/lib/wishlist";
import { BookingModal } from "@/components/booking/BookingModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Leaflet House Marker
const houseIcon = L.divIcon({
  className: "custom-house-marker",
  html: `<div style="
    background-color: #FF6B00;
    color: #ffffff;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(255,107,0,0.4);
    border: 2.5px solid #ffffff;
  ">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  </div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

export default function PropertyDetail() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Sync wishlist status
  useEffect(() => {
    if (property) {
      setIsSaved(isPropertyWishlisted(property.id));
    }
    const handleUpdate = () => {
      if (property) setIsSaved(isPropertyWishlisted(property.id));
    };
    window.addEventListener("wayzyy_wishlist_updated", handleUpdate);
    return () => window.removeEventListener("wayzyy_wishlist_updated", handleUpdate);
  }, [property]);

  // Reservation Form State
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 2));
  const [guestCount, setGuestCount] = useState(1);
  // Null for mock listings; populated for real ones after the Supabase fetch.
  const [pricingInputs, setPricingInputs] = useState<PricingInputs | null>(null);
  // Advisory shown alongside the extra-guest surcharge. The surcharge itself
  // IS charged online (see quoteStay); this note covers the separate case of
  // a guest turning up with more people than they booked for, which is a
  // conversation with the host and not something the platform settles.
  const [extraGuestNote, setExtraGuestNote] = useState<string | null>(null);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  // Fetch property data
  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      // 1. Check mock list
      const matchedMock = MOCK_PROPERTIES.find(
        (p) => p.id === propertyId || p.slug === propertyId
      );

      if (matchedMock) {
        setProperty(matchedMock);
        setLoading(false);
        return;
      }

      // 2. Fetch from Supabase
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .maybeSingle();

        if (data) {
          let parsedImages = [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
          ];
          if (Array.isArray(data.images) && data.images.length > 0) {
            parsedImages = data.images;
          } else if (typeof data.images === "string") {
            try {
              const arr = JSON.parse(data.images);
              if (Array.isArray(arr) && arr.length > 0) parsedImages = arr;
            } catch (e) {}
          }

          const price = Number(data.price_per_night) || 3700;

          const transformed: PropertyListing = {
            id: data.id,
            slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : data.id,
            title: data.title || "Spacious Homestay",
            description: data.description || "A wonderful place to stay.",
            category: (data.category?.toLowerCase() || "apartments") as any,
            propertyType: data.space_type ? `${data.space_type} in ${data.city || "India"}` : `Entire place in ${data.city || "India"}`,
            city: data.city || "Goa",
            area: data.street || data.city || "Goa",
            state: data.state || "Goa",
            country: "India",
            lat: Number(data.lat) || 28.6280,
            lng: Number(data.lng) || 77.3820,
            images: parsedImages,
            pricePerNight: price,
            originalPrice: price * 2,
            currency: "₹",
            rating: 5.0,
            reviewCount: 9,
            isGuestFavourite: true,
            isTopTenPercent: true,
            maxGuests: Number(data.max_guests) || 5,
            bedrooms: Number(data.bedrooms) || 2,
            beds: Number(data.beds) || 2,
            bathrooms: Number(data.bathrooms) || 2,
            amenities: Array.isArray(data.amenities) && data.amenities.length > 0 ? data.amenities : [
              "Fast Wifi (150+ Mbps)",
              "Air conditioning in all rooms",
              "Fully equipped modular kitchen",
              "Dedicated workspace with ergonomic desk",
              "Free high-speed covered parking on premises",
              "24/7 Security with CCTV & Smart Door Lock"
            ],
            host: {
              name: data.host_email ? data.host_email.split("@")[0] : "Wayzyy Host",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              isSuperhost: true,
              isNewHost: true,
              joinedDate: "Joined in 2025",
              responseRate: "100%",
              responseTime: "within an hour"
            },
            highlights: [
              { icon: "trophy", title: "Top 10% of homes", description: "This home is highly ranked based on ratings, reviews and reliability." },
              { icon: "door", title: "Self check-in", description: "You can check in with the building staff." },
              { icon: "map-pin", title: "Unbeatable location", description: "100% of guests in the past year gave this location a 5-star rating." }
            ],
            ratingsBreakdown: { cleanliness: 5.0, accuracy: 5.0, communication: 5.0, location: 4.9, checkIn: 5.0, value: 5.0 },
            reviews: [
              {
                id: "rev-1",
                authorName: "Aman Verma",
                authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                date: "August 2026",
                content: "Outstanding place! The cleanliness blew us away. Everything mentioned was accurate, and the host was super responsive."
              }
            ],
            houseRules: {
              checkIn: "2:00 PM – 10:00 PM",
              checkOut: "11:00 AM",
              selfCheckIn: "Self check-in with keypad / building staff",
              smoking: false,
              pets: false,
              parties: false
            },
            cancellationPolicy: "Free cancellation up to 48 hours before check-in. Partial refund thereafter.",
            instantBook: true
          };
          setProperty(transformed);

          // Pricing inputs, fetched alongside the listing. `price` above is
          // the raw host rate - the 7% guest fee is applied inside
          // quoteStay(), not here, so it can't get double-counted.
          const [tierRes, dateRes] = await Promise.all([
            supabase
              .from("property_guest_pricing_tiers")
              .select("min_guests, price_per_night")
              .eq("property_id", data.id),
            supabase
              .from("date_prices")
              .select("date, price")
              .eq("property_id", data.id),
          ]);

          const tiers: GuestPricingTier[] = (tierRes.data ?? []).map((t: any) => ({
            minGuests: Number(t.min_guests),
            pricePerNight: Number(t.price_per_night),
          }));
          const dateOverrides: Record<string, number> = {};
          for (const row of dateRes.data ?? []) {
            // `date` comes back as 'YYYY-MM-DD' already; keep it as the key
            // rather than round-tripping through Date, which would shift it.
            if (row?.date != null && row?.price != null) {
              dateOverrides[String(row.date).slice(0, 10)] = Number(row.price);
            }
          }

          setExtraGuestNote(
            typeof data.extra_guest_note === "string" && data.extra_guest_note.trim()
              ? data.extra_guest_note.trim()
              : null,
          );

          setPricingInputs({
            hostPricePerNight: price,
            tiers,
            perPersonEnabled: Boolean(data.per_person_pricing_enabled),
            extraGuestThreshold:
              data.extra_guest_threshold != null ? Number(data.extra_guest_threshold) : null,
            extraGuestFee: data.extra_guest_fee != null ? Number(data.extra_guest_fee) : null,
            dateOverrides,
          });
        } else {
          setProperty(MOCK_PROPERTIES[0]);
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setProperty(MOCK_PROPERTIES[0]);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [propertyId]);

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));

  // Real listings are priced through the shared rules in @/lib/pricing, which
  // mirror the app and the create-booking edge function: guest-count tiers or
  // the host's per-person rule, per-night date overrides, the 7% guest fee,
  // then GST. Mock listings carry no pricing inputs and keep the old flat
  // rate * nights maths so the demo cards still render.
  const quote = pricingInputs
    ? quoteStay(pricingInputs, guestCount, checkInDate, checkOutDate, nights)
    : null;
  // Display-only view of the host's per-person rule. The money itself is
  // already inside `quote`; this just lets the UI say why the price moved.
  const perGuestSurcharge =
    pricingInputs?.perPersonEnabled &&
    pricingInputs.extraGuestThreshold != null &&
    pricingInputs.extraGuestFee != null
      ? {
          threshold: pricingInputs.extraGuestThreshold,
          fee: pricingInputs.extraGuestFee,
          extraGuests: Math.max(0, guestCount - pricingInputs.extraGuestThreshold),
        }
      : null;
  const stayTotal = quote ? quote.accommodation : property.pricePerNight * nights;
  const nightlyRate = quote ? quote.perNight : property.pricePerNight;
  const originalStayTotal = property.originalPrice ? property.originalPrice * nights / 2 : stayTotal * 2;
  const airbnbFeeComparison = Math.round(stayTotal * 0.155);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this property with your travel companions."
      });
    }
  };

  const images = property.images && property.images.length >= 5 
    ? property.images 
    : [
        ...property.images,
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
      ];

  return (
    <SEO
      title={`${property.title} - Wayzyy Stays`}
      description={`${property.propertyType} with ${property.bedrooms} bedrooms, ${property.bathrooms} baths. Rated ${property.rating}★.`}
      image={images[0]}
    >
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <AirbnbHeader compact />

        <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Header Title & Share/Save Actions (Matching Screenshot 2) */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-foreground">
                {property.title}
              </h1>

              <div className="flex items-center gap-4 text-xs font-semibold text-foreground shrink-0">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:bg-muted p-2 rounded-xl transition-colors underline"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => toggleWishlist(property.id)}
                  className="flex items-center gap-1.5 hover:bg-muted p-2 rounded-xl transition-colors underline"
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-[#FF6B00] text-[#FF6B00]" : ""}`} />
                  <span>{isSaved ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5-Photo Mosaic Grid Matching Screenshot 2 */}
          <div className="relative rounded-3xl overflow-hidden shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] sm:h-[420px] md:h-[480px]">
              {/* Main Hero Photo (Left Half) */}
              <div
                onClick={() => {
                  setLightboxIndex(0);
                  setShowAllPhotos(true);
                }}
                className="md:col-span-2 h-full cursor-pointer overflow-hidden group"
              >
                <img
                  src={images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* 4 Secondary Photos (Right Grid 2x2) */}
              <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
                {images.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLightboxIndex(idx + 1);
                      setShowAllPhotos(true);
                    }}
                    className="h-[236px] cursor-pointer overflow-hidden group"
                  >
                    <img
                      src={img}
                      alt={`${property.title} photo ${idx + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* "Show all photos" trigger button at bottom right (Matching Screenshot 2) */}
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-2xl bg-background/95 hover:bg-background text-foreground border border-border px-4 py-2 text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              <Grid className="h-3.5 w-3.5 text-[#FF6B00]" />
              <span>Show all photos</span>
            </button>
          </div>

          {/* Main Details & Booking Rail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
            {/* Left Content Rail (2 Columns) */}
            <div className="lg:col-span-2 space-y-8 divide-y divide-border">
              {/* Property Specs Header */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                  {property.propertyType}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.bathrooms} bathrooms
                </p>
              </div>

              {/* Guest Favourite Laurel Banner Matching Screenshot 2 & 3 */}
              {property.isGuestFavourite && (
                <div className="pt-6">
                  <div className="flex items-center justify-between p-5 rounded-3xl border border-border bg-muted/20 shadow-xs">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-base font-extrabold text-foreground">Guest favourite</p>
                        <p className="text-xs text-muted-foreground">
                          One of the most loved homes on Wayzyy, according to guests
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 divide-x divide-border pl-4">
                      <div className="text-center">
                        <p className="text-lg font-black text-foreground">{property.rating.toFixed(1)}</p>
                        <div className="flex items-center gap-0.5 justify-center">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>
                      <div className="text-center pl-6">
                        <p className="text-lg font-black text-foreground">{property.reviewCount}</p>
                        <p className="text-[11px] text-muted-foreground underline font-medium">Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Host Summary Card Matching Screenshot 2 */}
              <div className="pt-6 flex items-center gap-4">
                <img
                  src={property.host.avatar}
                  alt={property.host.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-border shadow-xs"
                />
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Hosted by {property.host.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {property.host.isNewHost ? "New Host" : "Superhost"} · Response time: {property.host.responseTime}
                  </p>
                </div>
              </div>

              {/* Highlights List Matching Screenshot 3 */}
              <div className="pt-6 space-y-5">
                {property.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 h-9 w-9 rounded-2xl bg-muted/60 flex items-center justify-center shrink-0">
                      {h.icon === "trophy" && <Trophy className="h-4 w-4 text-[#FF6B00]" />}
                      {h.icon === "door" && <DoorClosed className="h-4 w-4 text-foreground" />}
                      {h.icon === "map-pin" && <MapPin className="h-4 w-4 text-[#FF6B00]" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{h.title}</p>
                      <p className="text-xs text-muted-foreground">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Section with Show More */}
              <div className="pt-6 space-y-3">
                <h3 className="text-lg font-bold font-display text-foreground">About this space</h3>
                <div className={`text-sm text-muted-foreground leading-relaxed space-y-3 ${descriptionExpanded ? "" : "line-clamp-4"}`}>
                  {property.description.split("\n\n").map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
                <button
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="text-xs font-bold text-[#FF6B00] underline hover:opacity-80"
                >
                  {descriptionExpanded ? "Show less" : "Show more →"}
                </button>
              </div>

              {/* Amenities Grid ("What this place offers") */}
              <div className="pt-6 space-y-4">
                <h3 className="text-lg font-bold font-display text-foreground">What this place offers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.amenities.slice(0, 8).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                {property.amenities.length > 8 && (
                  <button
                    onClick={() => setShowAllAmenities(true)}
                    className="mt-2 rounded-2xl border border-border px-5 py-2.5 text-xs font-bold hover:bg-muted transition-colors"
                  >
                    Show all {property.amenities.length} amenities
                  </button>
                )}
              </div>

              {/* Interactive Calendar Section */}
              <div className="pt-6 space-y-4">
                <h3 className="text-lg font-bold font-display text-foreground">
                  {nights} nights in {property.city}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {format(checkInDate, "MMM d, yyyy")} – {format(checkOutDate, "MMM d, yyyy")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-3xl border border-border bg-muted/10">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-muted-foreground">Check-in Date</label>
                    <input
                      type="date"
                      value={format(checkInDate, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getTime())) {
                          setCheckInDate(d);
                          if (d >= checkOutDate) setCheckOutDate(addDays(d, 1));
                        }
                      }}
                      className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-sm font-semibold focus:border-[#FF6B00] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-muted-foreground">Checkout Date</label>
                    <input
                      type="date"
                      value={format(checkOutDate, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getTime()) && d > checkInDate) {
                          setCheckOutDate(d);
                        }
                      }}
                      className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-sm font-semibold focus:border-[#FF6B00] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="pt-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <h3 className="text-xl font-bold font-display text-foreground">
                    {property.rating.toFixed(1)} · {property.reviewCount} Reviews
                  </h3>
                </div>

                {/* Score Breakdown Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(property.ratingsBreakdown).map(([key, score]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold capitalize">
                        <span>{key}</span>
                        <span>{score.toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full"
                          style={{ width: `${(score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Guest Reviews Cards */}
                <div className="space-y-4 pt-2">
                  {property.reviews.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-3xl border border-border bg-card space-y-2.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.authorAvatar}
                          alt={rev.authorName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-foreground">{rev.authorName}</p>
                          <p className="text-[11px] text-muted-foreground">{rev.date} · {rev.timeOnWayzyy}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rev.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Map ("Where you'll be" Matching Screenshot 4) */}
              <div className="pt-6 space-y-4">
                <h3 className="text-xl font-bold font-display text-foreground">Where you'll be</h3>
                <p className="text-xs text-muted-foreground font-medium">{property.area}, {property.city}, {property.state}, India</p>

                <div className="h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-border shadow-sm">
                  <MapContainer
                    center={[property.lat, property.lng]}
                    zoom={14}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[property.lat, property.lng]} icon={houseIcon}>
                      <Popup>
                        <div className="text-xs font-bold p-1">
                          {property.title}
                          <p className="text-[10px] text-muted-foreground">{property.area}, {property.city}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Right Sticky Floating Reservation Card (Matching Screenshot 2 & 3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5">
                {/* Price Display */}
                <div className="flex items-baseline justify-between">
                  <div>
                    {originalStayTotal > stayTotal && (
                      <span className="text-sm line-through text-muted-foreground mr-2 font-medium">
                        {property.currency}{originalStayTotal.toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-2xl font-black text-foreground">
                      {property.currency}{stayTotal.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal ml-1">
                      for {nights} {nights > 1 ? "nights" : "night"}
                    </span>
                  </div>

                  <span className="rounded-full bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20 px-2.5 py-1 text-[11px] font-bold">
                    Prices include all fees
                  </span>
                </div>

                {/* Check-in / Checkout Selector Box */}
                <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
                  <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="p-3">
                      <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Check-in</p>
                      <p className="text-xs font-bold text-foreground mt-0.5">{format(checkInDate, "M/d/yyyy")}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Checkout</p>
                      <p className="text-xs font-bold text-foreground mt-0.5">{format(checkOutDate, "M/d/yyyy")}</p>
                    </div>
                  </div>

                  {/* Guests Dropdown Trigger */}
                  <div className="p-3 relative">
                    <div 
                      onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Guests</p>
                        <p className="text-xs font-bold text-foreground mt-0.5">{guestCount} {guestCount > 1 ? "guests" : "guest"}</p>
                      </div>
                    </div>

                    {isGuestDropdownOpen && (
                      <div className="absolute top-full inset-x-0 mt-2 z-20 rounded-2xl border border-border bg-background p-4 shadow-xl flex items-center justify-between">
                        <span className="text-xs font-bold">Total Guests</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={guestCount <= 1}
                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                            className="h-7 w-7 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold">{guestCount}</span>
                          <button
                            type="button"
                            disabled={guestCount >= property.maxGuests}
                            onClick={() => setGuestCount(Math.min(property.maxGuests, guestCount + 1))}
                            className="h-7 w-7 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extra-guest surcharge, charged online. Sits directly under the
                    guest picker because that is where the decision is made - a
                    guest raising the party size needs to see the consequence at
                    that moment, not buried in the description. Pricing it online
                    rather than as a pay-at-property note is deliberate: it
                    removes the incentive to under-declare the party size at
                    booking and settle up quietly at the door. */}
                {perGuestSurcharge && (
                  <div className="flex items-start gap-2 rounded-2xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 p-3">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B00]" />
                    <p className="text-xs font-semibold leading-relaxed text-foreground">
                      Above {perGuestSurcharge.threshold} guests, {property.currency}
                      {perGuestSurcharge.fee.toLocaleString("en-IN")} per extra guest per night.
                      {perGuestSurcharge.extraGuests > 0 ? (
                        <span className="mt-1 block font-medium text-muted-foreground">
                          {perGuestSurcharge.extraGuests} extra{" "}
                          {perGuestSurcharge.extraGuests === 1 ? "guest" : "guests"} × {nights}{" "}
                          {nights === 1 ? "night" : "nights"} is already included in the total below.
                        </span>
                      ) : (
                        <span className="mt-1 block font-medium text-muted-foreground">
                          Applied automatically if you add more guests.
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Separate from the surcharge above: what happens if more
                    people actually turn up than were booked. That is settled
                    between guest and host, so the copy must not imply Wayzyy
                    guarantees or mediates it. */}
                {extraGuestNote && (
                  <div className="flex items-start gap-2 rounded-2xl border border-border bg-muted/40 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {extraGuestNote}{" "}
                      <Link to="/guest-terms" className="font-semibold text-foreground underline">
                        See terms
                      </Link>
                    </p>
                  </div>
                )}

                {/* Free cancellation note */}
                <div className="rounded-2xl bg-muted/40 p-3 text-center text-xs font-semibold text-muted-foreground">
                  Free cancellation before {format(addDays(checkInDate, -2), "d MMMM")}
                </div>

                {/* Reserve Button (Vibrant #FF6B00 Ember Gradient) */}
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-[#FF781A] to-[#E05300] text-white font-black text-base shadow-xl shadow-[#FF6B00]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Reserve
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  You won't be charged yet
                </p>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-3 border-t border-border text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{property.currency}{nightlyRate.toLocaleString("en-IN")} × {nights} nights</span>
                    <span>{property.currency}{stayTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cleaning fee</span>
                    <span className="text-emerald-500 font-bold">Free</span>
                  </div>

                  {/* Airbnb Fee Savings Callout */}
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    You save <strong>₹{airbnbFeeComparison.toLocaleString("en-IN")}</strong> in platform commissions on Wayzyy!
                  </div>

                  {quote && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST</span>
                      <span>{property.currency}{quote.taxes.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-black text-foreground pt-2 border-t border-border">
                    <span>{quote ? "Total" : "Total before taxes"}</span>
                    <span>
                      {property.currency}
                      {(quote ? quote.total : stayTotal).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Report Listing */}
                <div className="pt-2 text-center">
                  <button className="flex items-center justify-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-foreground underline">
                    <Flag className="h-3.5 w-3.5" />
                    <span>Report this listing</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Full Screen Lightbox Photo Gallery Modal */}
        {showAllPhotos && (
          <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4">
              <span className="text-xs font-bold text-white/70">
                Photo {lightboxIndex + 1} of {images.length}
              </span>
              <button
                onClick={() => setShowAllPhotos(false)}
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <img
                src={images[lightboxIndex]}
                alt={`Photo ${lightboxIndex + 1}`}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
              />

              <button
                onClick={() => setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() => setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`h-14 w-20 rounded-xl overflow-hidden border-2 transition-all ${
                    i === lightboxIndex ? "border-[#FF6B00] scale-105" : "border-transparent opacity-50"
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Razorpay Booking Flow Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          property={property}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestCount={guestCount}
          totalAmount={stayTotal}
        />
      </div>
    </SEO>
  );
}
