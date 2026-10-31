import { StayDatesCalendar } from "@/components/booking/StayDatesCalendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { spaceTypeLine } from "@/lib/spaceType";
import { img, imgSet } from "@/lib/img";
import { PhotoLightbox } from "@/components/marketplace/PhotoLightbox";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import {
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
  SprayCan,
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
  BedDouble,
  BadgeCheck,
  Phone,
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { PropertyDetailSkeleton } from "@/components/marketplace/Skeletons";
import { ListingRulesSections } from "@/components/marketplace/ListingRules";
import { rulesFromRow, roomsSummary, sleepingFromRow } from "@/lib/houseRules";
import { MOCK_PROPERTIES, PropertyListing, Review } from "@/data/mockProperties";
import { formatDescription } from "@/lib/descriptionFormat";
import { quoteStay, guestNightlyPrice, airbnbEquivalentTotal, toDateStr, parseLocalDate, WAYZYY_FEE_RATE, type PricingInputs, type GuestPricingTier } from "@/lib/pricing";
import { stayRuleError, describeStayRules } from "@/lib/stayRules";
import { DISCOUNT_LABELS } from "@/lib/discounts";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { isPropertyWishlisted, toggleWishlist, recordRecentlyViewed } from "@/lib/wishlist";
import { resolveHostDisplayName } from "@/lib/hostDisplayName";
import { useAuth } from "@/hooks/useAuth";
import { getOrCreateThread } from "@/lib/messaging";
import { SUPPORT_PHONE, SUPPORT_EMAIL } from "@/components/host/HostGetStarted";
import { areaForListing } from "@/data/areaGuides";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookingModal } from "@/components/booking/BookingModal";
import { EnquiryModal } from "@/components/booking/EnquiryModal";
import { bookingsOpenFor } from "@/lib/bookingGate";
import { trackViewItem } from "@/lib/analytics";
import { propertyPath, extractPropertyId, isUuid } from "@/lib/propertySlug";
import { APIProvider, Map as GoogleMap, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/lib/googleMaps";

// Same house-pin look the old Leaflet marker used, as a plain DOM node for
// AdvancedMarker's `content` prop instead of a Leaflet divIcon.
function HousePin() {
  return (
    <div
      style={{
        backgroundColor: "#FF6B00",
        color: "#ffffff",
        width: 42,
        height: 42,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(255,107,0,0.4)",
        border: "2.5px solid #ffffff",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
  );
}

// The guest-host messaging feature (threads/messages) has no migration
// tracking those tables and hasn't been verified stable in production -
// flagged during the chat-moderation handoff, not yet resolved. Rather
// than maintain two forked copies of this page (one with messaging for
// later, one without for today), the button is gated behind this one
// constant. Flip it true in this single place once messaging is actually
// ready; nothing else about the page needs to change.
const MESSAGING_ENABLED = false;

// Booking is real on this branch: BookingModal now actually calls Razorpay
// and the real create-booking function (it used to fake a "confirmed"
// booking with a direct, unauthenticated client-side insert and never
// charge anyone - see BookingModal.tsx). Deliberately NOT flipped on main
// yet - /goa-stays and the host-preview links still point people at a
// brochure-only build there. Flip this same constant back to false if this
// branch needs to revert to brochure mode for any reason; nothing else
// about the page needs to change either way.
const BOOKING_ENABLED = true;
const SUPPORT_PHONE_HREF = SUPPORT_PHONE.replace(/\s+/g, "");

function logListingView(propertyId: string, hostId: string | null) {
  const key = `wz_viewed_${propertyId}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // Private browsing can block sessionStorage - still log the view.
  }
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (hostId && user?.id === hostId) return;
    supabase
      .from("property_views")
      .insert({ property_id: propertyId, host_id: hostId, viewer_id: user?.id ?? null })
      .then(({ error }) => { if (error) console.warn("property view log failed:", error.message); });
  });
}

export default function PropertyDetail() {
  // The URL can be /property/<id> (old links) or /property/<name-words>-<id>.
  const { propertyId: routeParam } = useParams<{ propertyId: string }>();
  const propertyId = routeParam ? extractPropertyId(routeParam) : undefined;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn } = useAuth();

  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [showMessageSignIn, setShowMessageSignIn] = useState(false);
  const [messageAuthEmail, setMessageAuthEmail] = useState("");
  const [messageAuthPassword, setMessageAuthPassword] = useState("");
  const [startingThread, setStartingThread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showMapInfo, setShowMapInfo] = useState(false);
  const [hostVerified, setHostVerified] = useState(false);
  // Per-date minimum stays (date_rules), so the date picker can warn before checkout.
  const [dateMinNights, setDateMinNights] = useState<Record<string, number>>({});
  const ruleListingId = property?.id;
  useEffect(() => {
    if (!ruleListingId || !/^[0-9a-f-]{36}$/i.test(ruleListingId)) return;
    supabase.from("date_rules").select("date, min_nights").eq("property_id", ruleListingId).not("min_nights", "is", null)
      .then(({ data }) => setDateMinNights(Object.fromEntries((data ?? []).map((r: any) => [r.date, Number(r.min_nights)]))));
  }, [ruleListingId]);
  const [otherHostListings, setOtherHostListings] = useState<
    { id: string; title: string; image: string | null; pricePerNight: number; showcase?: boolean }[]
  >([]);

  // Real host profile (name + avatar) and their other live listings - only
  // for real (non-mock) properties, which carry a real host.id. Kept as a
  // separate effect from the main property fetch so a slow/failed profile
  // lookup never blocks the listing itself from rendering.
  useEffect(() => {
    const hostId = property?.host.id;
    if (!hostId) return;
    let cancelled = false;

    supabase
      .from("profiles")
      .select("name, avatar_url, identity_verified, aadhaar_verified")
      .eq("id", hostId)
      .maybeSingle()
      .then(({ data: profile }) => {
        if (cancelled || !profile) return;
        setHostVerified(!!(profile.identity_verified || profile.aadhaar_verified));
        setProperty((prev) => {
          if (!prev) return prev;
          const resolvedName = resolveHostDisplayName(profile.name, prev.host.email);
          return {
            ...prev,
            host: {
              ...prev.host,
              name: resolvedName,
              avatar: profile.avatar_url || prev.host.avatar,
            },
          };
        });
      });

    supabase
      .from("properties")
      .select("id, title, images, price_per_night, status, showcase")
      .eq("host_id", hostId)
      // Live listings plus showcased drafts, same as Explore shows.
      .or("status.eq.active,showcase.eq.true")
      .neq("id", propertyId)
      .order("created_at", { ascending: false })
      .limit(40)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setOtherHostListings(
          data.map((p: any) => ({
            id: p.id,
            title: p.title,
            image: Array.isArray(p.images) ? p.images[0] ?? null : null,
            pricePerNight: Number(p.price_per_night) || 0,
            showcase: p.status !== "active" && !!p.showcase,
          })),
        );
      });

    return () => { cancelled = true; };
  }, [property?.host.id, propertyId]);

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

  // Reservation Form State. Dates and party size searched on the Stays page
  // come along in the link (?checkin=&checkout=&guests=), as they do in the
  // app, so this page prices the same stay the card just showed.
  const [searchParams] = useSearchParams();
  const fromSearch = (() => {
    const ci = searchParams.get("checkin");
    const co = searchParams.get("checkout");
    const valid = (v: string | null) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);
    if (!valid(ci) || !valid(co) || co! <= ci!) return null;
    const checkIn = parseLocalDate(ci!);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return checkIn < today ? null : { checkIn, checkOut: parseLocalDate(co!) };
  })();
  const [checkInDate, setCheckInDate] = useState<Date>(fromSearch?.checkIn ?? new Date());
  // Default to the shortest stay allowed (1 night unless the host set more; raised once the listing loads).
  const [checkOutDate, setCheckOutDate] = useState<Date>(fromSearch?.checkOut ?? addDays(new Date(), 1));
  const [datesOpen, setDatesOpen] = useState(false);
  // Booked / blocked nights (dates only, from a guest-readable RPC), so the
  // calendars grey them out and the default stay never lands on them - picking
  // them used to fail only at payment, with a 409 from create-booking-order.
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [dateNotice, setDateNotice] = useState<string | null>(null);
  useEffect(() => {
    const id = property?.id;
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return;
    let cancelled = false;
    supabase.rpc("property_unavailable_dates", { p_property_id: id }).then(({ data, error }) => {
      if (cancelled || error || !Array.isArray(data)) return;
      const set = new Set<string>(data.map((d: any) => String(typeof d === "string" ? d : d.property_unavailable_dates)));
      setUnavailable(set);
      // Move the default stay to the first free stretch of the same length.
      const nightsWanted = Math.max(1, differenceInDays(checkOutDate, checkInDate));
      const taken = (d: Date) => set.has(format(d, "yyyy-MM-dd"));
      const clash = (from: Date) => { for (let i = 0; i < nightsWanted; i++) if (taken(addDays(from, i))) return true; return false; };
      if (clash(checkInDate)) {
        for (let i = 1; i <= 365; i++) {
          const from = addDays(checkInDate, i);
          if (!clash(from)) {
            setCheckInDate(from);
            setCheckOutDate(addDays(from, nightsWanted));
            setDateNotice(`The earliest dates were booked, so we've picked the next free ones: ${format(from, "d MMM")}.`);
            break;
          }
        }
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?.id]);

  // Once the listing loads, stretch the default stay to the host's minimum.
  useEffect(() => {
    const min = property?.minNights ?? 1;
    if (differenceInDays(checkOutDate, checkInDate) < min) setCheckOutDate(addDays(checkInDate, min));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?.minNights]);
  const [guestCount, setGuestCount] = useState(() => Math.min(50, Math.max(1, Number(searchParams.get("guests")) || 1)));
  // Null for mock listings; populated for real ones after the Supabase fetch.
  const [pricingInputs, setPricingInputs] = useState<PricingInputs | null>(null);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  // Send old id-only links (and out-of-date names) to the canonical named URL, so
  // there is one address per listing for search engines and for sharing.
  useEffect(() => {
    if (!property || !isUuid(property.id)) return;
    const want = propertyPath({ id: property.id, title: property.title, city: property.city });
    if (window.location.pathname !== want) navigate(`${want}${window.location.search}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?.id, property?.title, property?.city]);

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
            } catch (e) { /* ignore */ }
          }

          const price = Number(data.price_per_night) || 3700;

          // Real reviews for this listing - this used to be a single
          // hardcoded fake review shown under every real property
          // regardless of what guests actually wrote, same shape as the
          // mobile app's fetch off the reviews table.
          const { data: reviewRows } = await supabase
            .from("reviews")
            .select("id, reviewer_name, reviewer_avatar, rating, comment, created_at")
            .eq("property_id", data.id)
            .order("created_at", { ascending: false });
          const realReviews: Review[] = (reviewRows ?? []).map((r: any) => ({
            id: r.id,
            authorName: r.reviewer_name ?? "Guest",
            authorAvatar: r.reviewer_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            rating: r.rating,
            date: new Date(r.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
            content: r.comment ?? "",
          }));
          const realRating = Number(data.rating) || (realReviews.length
            ? realReviews.reduce((sum, r) => sum + r.rating, 0) / realReviews.length
            : 0);

          const transformed: PropertyListing = {
            id: data.id,
            slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : data.id,
            title: data.title || "Spacious Homestay",
            description: data.description || "A wonderful place to stay.",
            category: (data.category?.toLowerCase() || "apartments") as any,
            showcase: data.status !== "active" && !!data.showcase,
            propertyType: spaceTypeLine(data.space_type, data.city, "India"),
            city: data.city || "Goa",
            // properties has 'location', not 'street'/'lat'/'lng' - those
            // columns don't exist, so this was reading undefined every time
            // and falling back to a fixed Gautam Budh Nagar (Noida) point
            // for literally every real listing's map pin.
            area: data.location || data.city || "Goa",
            state: data.state || "Goa",
            country: "India",
            lat: Number(data.latitude) || 15.5898,
            lng: Number(data.longitude) || 73.7749,
            images: parsedImages,
            pricePerNight: price,
            originalPrice: price * 2,
            currency: "₹",
            rating: realRating,
            reviewCount: realReviews.length,
            // Real reviews aren't accurate/complete yet - never claim
            // "guest favourite" or "top 10%" until they are.
            isGuestFavourite: false,
            isTopTenPercent: false,
            // The host's own numbers. Missing values used to show as 2 bedrooms,
            // 2 beds and 2 bathrooms (and 5 guests), so a studio read "2 bedrooms".
            maxGuests: Number(data.max_guests) || 1,
            bedrooms: Number(data.bedrooms ?? 0),
            beds: Number(data.beds ?? 0),
            bathrooms: Number(data.bathrooms ?? 0),
            sleeping: sleepingFromRow(data.sleeping_arrangements),
            // Only what the host listed. This used to fall back to six invented
            // amenities (including "24/7 Security with CCTV"), which could
            // contradict the host's own camera disclosure.
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            minNights: Number(data.min_nights) || 1,
            maxNights: data.max_nights != null ? Number(data.max_nights) : null,
            advanceNoticeDays: data.advance_notice_days ?? null,
            sameDayCutoffHour: data.same_day_cutoff_hour ?? null,
            preparationDays: data.preparation_days ?? null,
            availabilityWindowDays: data.availability_window_days ?? null,
            checkinDays: Array.isArray(data.checkin_days) && data.checkin_days.length ? data.checkin_days.map(Number) : null,
            checkoutDays: Array.isArray(data.checkout_days) && data.checkout_days.length ? data.checkout_days.map(Number) : null,
            wayzyyVerified: data.wayzyy_verified === true,
            host: {
              // host_id present -> the real profile (name + avatar) is
              // fetched right after this and overwrites these placeholders.
              id: data.host_id ?? null,
              email: data.host_email ?? null,
              name: data.host_email ? resolveHostDisplayName(null, data.host_email) : "Wayzyy Host",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              isSuperhost: true,
              isNewHost: true,
              joinedDate: "Joined in 2025",
              responseRate: "100%",
              responseTime: "within an hour"
            },
            // The other two highlights here used to claim "highly ranked
            // based on ratings, reviews" and "100% of guests... gave this
            // location a 5-star rating" - fabricated on every listing
            // regardless of whether any of that was true. Self check-in is
            // the only one that isn't a review claim, and it now shows only
            // when the host has actually said guests can check themselves in.
            highlights: data.self_check_in === true
              ? [{ icon: "door", title: "Self check-in", description: "You can check yourself in without meeting the host." }]
              : [],
            rules: rulesFromRow(data),
            tags: Array.isArray(data.tags) ? data.tags.map(String).filter(Boolean) : [],
            // Was a flat { cleanliness: 5.0, accuracy: 5.0, ... } on every
            // listing regardless of real reviews - no longer rendered (see
            // the removed Reviews section below), kept only because
            // PropertyListing's type still requires the field.
            ratingsBreakdown: { cleanliness: 0, accuracy: 0, communication: 0, location: 0, checkIn: 0, value: 0 },
            reviews: realReviews,
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

          // Feeds the host's view counts in Advanced pricing (same table the
          // app logs to). Once per listing per browser session, never the
          // host looking at their own listing; a failed log is ignored.
          logListingView(data.id, data.host_id ?? null);
          recordRecentlyViewed(data.id);

          // Pricing inputs, fetched alongside the listing. `price` above is
          // the raw host rate - the 7% guest fee is applied inside
          // quoteStay(), not here, so it can't get double-counted. Only
          // needed to quote a real stay total, which only the live booking
          // rail does - skip it while BOOKING_ENABLED is off (the `finally`
          // below still clears loading either way).
          if (!BOOKING_ENABLED) return;
          const [tierRes, dateRes, discountRes, pastBookingsRes] = await Promise.all([
            supabase
              .from("property_guest_pricing_tiers")
              .select("min_guests, price_per_night, on_dated_nights")
              .eq("property_id", data.id),
            supabase
              .from("date_prices")
              .select("date, price")
              .eq("property_id", data.id),
            supabase
              .from("property_discounts")
              .select("discount_type, percentage, enabled")
              .eq("property_id", data.id),
            // RPC rather than a bookings query: RLS hides other guests'
            // rows. Same count create-booking uses for the new-listing
            // discount (first 3 bookings, pending requests included).
            supabase.rpc("property_booking_count", { p_property_id: data.id }),
          ]);

          const tiers: GuestPricingTier[] = (tierRes.data ?? []).map((t: any) => ({
            minGuests: Number(t.min_guests),
            pricePerNight: Number(t.price_per_night),
            onDatedNights: t.on_dated_nights === true,
          }));
          const dateOverrides: Record<string, number> = {};
          for (const row of dateRes.data ?? []) {
            // `date` comes back as 'YYYY-MM-DD' already; keep it as the key
            // rather than round-tripping through Date, which would shift it.
            if (row?.date != null && row?.price != null) {
              dateOverrides[String(row.date).slice(0, 10)] = Number(row.price);
            }
          }

          setPricingInputs({
            hostPricePerNight: price,
            tiers,
            perPersonEnabled: Boolean(data.per_person_pricing_enabled),
            extraGuestThreshold:
              data.extra_guest_threshold != null ? Number(data.extra_guest_threshold) : null,
            extraGuestFee: data.extra_guest_fee != null ? Number(data.extra_guest_fee) : null,
            dateOverrides,
            discounts: (discountRes.data ?? []).map((d: any) => ({
              discount_type: d.discount_type,
              percentage: Number(d.percentage),
              enabled: Boolean(d.enabled),
            })),
            pastBookingsCount: Number(pastBookingsRes.data ?? 0),
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

  // GA4 view_item for real listings only (mock fallbacks carry no pricing
  // inputs), valued like begin_checkout: the pre-GST quote for the dates shown.
  const viewedPropertyId = pricingInputs && property ? property.id : null;
  useEffect(() => {
    if (!viewedPropertyId || !property || !pricingInputs) return;
    const n = Math.max(1, differenceInDays(checkOutDate, checkInDate));
    const q = quoteStay(pricingInputs, guestCount, checkInDate, checkOutDate, n);
    trackViewItem({
      propertyId: property.id,
      title: property.title,
      category: property.category,
      city: property.city,
      nights: n,
      value: q.accommodation + q.serviceFee,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedPropertyId]);

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-background">
        <AirbnbHeader compact />
        <PropertyDetailSkeleton />
      </div>
    );
  }

  const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));
  const minNights = property.minNights ?? 1;
  const stayRules = {
    minNights, maxNights: property.maxNights, checkinDays: property.checkinDays, checkoutDays: property.checkoutDays,
    advanceNoticeDays: property.advanceNoticeDays, sameDayCutoffHour: property.sameDayCutoffHour,
    availabilityWindowDays: property.availabilityWindowDays, preparationDays: property.preparationDays,
    dateMinNights,
  };

  // Real listings are priced through the shared rules in @/lib/pricing, which
  // mirror the app and the create-booking edge function: guest-count tiers or
  // the host's per-person rule, per-night date overrides, the 7% guest fee,
  // then GST. Mock listings carry no pricing inputs and keep the old flat
  // rate * nights maths so the demo cards still render.
  const quote = pricingInputs
    ? quoteStay(pricingInputs, guestCount, checkInDate, checkOutDate, nights)
    : null;
  // The 7% Wayzyy fee is folded into every line a guest sees; the server still
  // prices and taxes the host's amount and the fee separately.
  const fold = (n: number) => Math.round(n * (1 + WAYZYY_FEE_RATE));
  const areaGuide = property ? areaForListing(property.title, property.area, property.city) : null;
  const stayTotal = quote ? quote.accommodation + quote.serviceFee : property.pricePerNight * nights;
  const nightlyRate = quote ? fold(quote.perNight) : property.pricePerNight;
  // Struck-through "on Airbnb" figure: the same estimate the cards use, taken
  // from this stay's own total so it shows on every listing, not just those
  // whose host base price happened to sit above the dated price.
  const originalStayTotal = airbnbEquivalentTotal(stayTotal);
  const foldedDiscount = quote?.discount ? fold(quote.discount.savings) : 0;
  const nightsSubtotal = quote ? stayTotal + foldedDiscount : property.pricePerNight * nights;
  // Airbnb's guest fee runs ~15.5% of the stay; Wayzyy's is 7% (shown as its
  // own line below), so the saving is the difference, not the whole 15.5%.
  const airbnbFeeComparison = Math.max(0, Math.round(stayTotal * 0.155) - (quote ? quote.serviceFee : 0));

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

  // Opens (or creates) the exact same thread the mobile app uses - same
  // `threads` table, same row, so whatever's sent here shows up in the
  // host's app inbox and vice versa.
  const startThreadAndNavigate = async (guestId: string, guestName: string) => {
    if (!property.host.id) return;
    setStartingThread(true);
    try {
      const threadId = await getOrCreateThread({
        propertyId: property.id,
        propertyTitle: property.title,
        guestId,
        hostId: property.host.id,
        guestName,
        hostName: property.host.name,
      });
      if (threadId) navigate(`/inbox/${threadId}`);
    } catch (e) {
      toast({ title: "Couldn't start conversation", description: e instanceof Error ? e.message : "Please try again.", variant: "destructive" });
    } finally {
      setStartingThread(false);
    }
  };

  const handleMessageHost = () => {
    if (!property.host.id) return; // mock/demo listing - nothing real to message
    if (user) {
      startThreadAndNavigate(user.id, resolveHostDisplayName(user.user_metadata?.name as string | undefined, user.email));
    } else {
      setShowMessageSignIn(true);
    }
  };

  const handleMessageSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartingThread(true);
    const { data, error } = await signIn(messageAuthEmail, messageAuthPassword);
    if (error || !data.user) {
      setStartingThread(false);
      toast({ title: "Couldn't sign in", description: error?.message ?? "Check your email and password.", variant: "destructive" });
      return;
    }
    setShowMessageSignIn(false);
    await startThreadAndNavigate(data.user.id, resolveHostDisplayName(data.user.user_metadata?.name as string | undefined, data.user.email));
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

  // Search / link-preview text. Title leads with the place's name and area; the
  // description is the host's own words, trimmed to what search results show.
  const placeLine = [property.city, property.state].filter(Boolean).join(", ");
  const seoTitle = `${property.title}${placeLine ? ` - ${placeLine}` : ""} | Wayzyy`;
  const seoDescription =
    (property.description || "").replace(/\s+/g, " ").trim().slice(0, 155) ||
    `${property.propertyType}, ${roomsSummary(property)}${placeLine ? ` in ${placeLine}` : ""}. Book directly on Wayzyy.`;
  // Structured data for real listings only (Google's VacationRental type). No
  // rating is included: reviews on this site are not live yet.
  const listingJsonLd = isUuid(property.id)
    ? {
        "@context": "https://schema.org",
        "@type": "VacationRental",
        identifier: property.id,
        name: property.title,
        description: seoDescription,
        url: `https://wayzyy.com${propertyPath({ id: property.id, title: property.title, city: property.city })}`,
        image: images.slice(0, 8),
        address: { "@type": "PostalAddress", addressLocality: property.city, addressRegion: property.state, addressCountry: "IN" },
        latitude: property.lat,
        longitude: property.lng,
        containsPlace: {
          "@type": "Accommodation",
          occupancy: { "@type": "QuantitativeValue", value: property.maxGuests },
          numberOfBedrooms: property.bedrooms,
          numberOfBathroomsTotal: property.bathrooms,
          amenityFeature: (property.amenities || []).slice(0, 20).map((name: string) => ({
            "@type": "LocationFeatureSpecification",
            name,
            value: true,
          })),
        },
      }
    : undefined;

  // "Report this listing" was previously a dead button with no onClick -
  // opens the guest's own mail client instead, pre-filled with exactly
  // what support needs to find the right listing without asking a
  // follow-up question first.
  const reportListingHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `Reporting a listing: ${property.title}`,
  )}&body=${encodeURIComponent(
    `Listing: ${property.title}\nLink: ${typeof window !== "undefined" ? window.location.href : `https://wayzyy.com/property/${property.id}`}\n\nWhat's wrong with this listing?\n`,
  )}`;

  return (
    <SEO
      title={seoTitle}
      description={seoDescription}
      ogImage={images[0]}
      path={isUuid(property.id) ? propertyPath({ id: property.id, title: property.title, city: property.city }) : undefined}
      jsonLd={listingJsonLd}
    >
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <AirbnbHeader compact />

        <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Header Title & Share/Save Actions (Matching Screenshot 2) */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-foreground">
                {property.title}
                {property.wayzyyVerified && (
                  <span className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Wayzyy Verified · Host verified
                  </span>
                )}
                {property.tags && property.tags.length > 0 && (
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {property.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 text-xs font-semibold text-[#FF6B00]">
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
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
                  {...imgSet(images[0], [640, 900, 1400, 1800])}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  // The main photo is what the page is judged on: fetch it first.
                  fetchPriority="high"
                  decoding="async"
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* 4 Secondary Photos (Right Grid 2x2) */}
              <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
                {images.slice(1, 5).map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLightboxIndex(idx + 1);
                      setShowAllPhotos(true);
                    }}
                    className="h-[236px] cursor-pointer overflow-hidden group"
                  >
                    <img
                      {...imgSet(photo, [320, 480, 640, 900])}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      loading="lazy"
                      decoding="async"
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
                  {property.wayzyyVerified && (
                    <BadgeCheck role="img" aria-label="Wayzyy Verified" className="ml-1.5 inline h-6 w-6 align-[-0.2em] text-[#FF6B00]">
                      <title>Wayzyy Verified</title>
                    </BadgeCheck>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {roomsSummary(property)}
                </p>
              </div>

              {areaGuide && (
                <div className="pt-6">
                  <Link to={areaGuide.guide} className="group block rounded-2xl border border-border p-5 hover:border-[#FF6B00]/50 transition-colors">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF6B00]">About the area - {areaGuide.vibe}</span>
                    <p className="mt-1 text-base font-bold text-foreground">Staying in {areaGuide.area}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{areaGuide.blurb}</p>
                    <p className="mt-2 text-sm font-semibold text-foreground group-hover:text-[#FF6B00]">Read the {areaGuide.area} guide →</p>
                  </Link>
                </div>
              )}

              {/* Other properties from this host - same idea as Airbnb's
                  host-profile listing grid, just inline here rather than a
                  separate host-profile page. */}
              {otherHostListings.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-sm font-bold text-foreground mb-3">
                    More from {property.host.name} · {otherHostListings.length} {otherHostListings.length === 1 ? "stay" : "stays"}
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                    {otherHostListings.map((listing) => (
                      <Link
                        key={listing.id}
                        to={`/property/${listing.id}`}
                        className="shrink-0 w-40 group"
                      >
                        <div className="aspect-square w-40 overflow-hidden rounded-xl bg-muted">
                          {listing.image && (
                            <img
                              src={img(listing.image, 640)}
                              alt={listing.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <p className="mt-1.5 text-xs font-semibold text-foreground truncate">{listing.title}</p>
                        {listing.showcase ? (
                          <p className="text-[11px] font-semibold text-[#FF6B00]">Contact us to book</p>
                        ) : (
                          <p className="font-price text-[11px] text-muted-foreground">
                            ₹{guestNightlyPrice(listing.pricePerNight).toLocaleString("en-IN")} / night
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights List Matching Screenshot 3 */}
              <div className="pt-6 space-y-5">
                {property.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 h-9 w-9 rounded-2xl bg-muted/60 flex items-center justify-center shrink-0">
                      {h.icon === "trophy" && <Trophy className="h-4 w-4 text-[#FF6B00]" />}
                      {h.icon === "door" && <DoorClosed className="h-4 w-4 text-foreground" />}
                      {h.icon === "map-pin" && <MapPin className="h-4 w-4 text-[#FF6B00]" />}
                      {h.icon === "sparkles" && <SprayCan className="h-4 w-4 text-[#FF6B00]" />}
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
                {/* Trust: what Wayzyy actually checked. The Aadhaar line only
                    shows when the host's profile is verified. */}
                <div className="flex flex-wrap gap-2">
                  {hostVerified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" /> Host Aadhaar verified via DigiLocker
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#FF6B00]" /> Listing reviewed by the Wayzyy team
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground">About this space</h3>
                <div className={`text-sm text-muted-foreground leading-relaxed ${descriptionExpanded ? "" : "line-clamp-4"}`}>
                  {formatDescription(property.description).map((block, idx) =>
                    block.type === "heading" ? (
                      <h4 key={idx} className="mt-6 mb-2 text-sm font-bold text-foreground first:mt-0">{block.text}</h4>
                    ) : block.type === "list" ? (
                      <ul key={idx} className="mb-4 list-disc space-y-1 pl-5">
                        {block.items.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p key={idx} className="mb-3">
                        {block.label && <span className="font-semibold text-foreground">{block.label}: </span>}
                        {block.text}
                      </p>
                    ),
                  )}
                </div>
                <button
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="text-xs font-bold text-[#FF6B00] underline hover:opacity-80"
                >
                  {descriptionExpanded ? "Show less" : "Show more →"}
                </button>
              </div>

              {/* Amenities Grid ("What this place offers") */}
              {property.amenities.length > 0 && (
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
              )}

              {property.sleeping && property.sleeping.length > 0 && (
                <div className="pt-6 space-y-4">
                  <h3 className="text-lg font-bold font-display text-foreground">Where you'll sleep</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {property.sleeping.map((room, i) => (
                      <div key={i} className="rounded-2xl border border-border p-4">
                        <BedDouble className="mb-2 h-5 w-5 text-foreground" />
                        <p className="text-sm font-semibold text-foreground">{room.name}</p>
                        <p className="text-xs text-muted-foreground">{room.beds.map((b) => `${b.count} ${b.type.toLowerCase()}${b.count === 1 ? "" : "s"}`).join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.rules && <ListingRulesSections rules={property.rules} />}

              {BOOKING_ENABLED && !property.showcase && (
                <div className="pt-6 space-y-4">
                  <h3 className="text-lg font-bold font-display text-foreground">
                    {nights} nights in {property.city}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {format(checkInDate, "MMM d, yyyy")} – {format(checkOutDate, "MMM d, yyyy")}
                  </p>

                  <div className="rounded-3xl border border-border bg-muted/10 p-2 sm:p-4 overflow-x-auto">
                    <StayDatesCalendar
                      checkIn={checkInDate}
                      checkOut={checkOutDate}
                      minNights={minNights}
                      unavailable={unavailable}
                      months={typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? 2 : 1}
                      onChange={(a, b) => { setCheckInDate(a); setCheckOutDate(b); }}
                    />
                  </div>
                  {describeStayRules(stayRules).map((line) => (
                    <p key={line} className="text-xs font-semibold text-[#FF6B00]">{line}</p>
                  ))}
                </div>
              )}

              {/* Reviews section removed - real reviews aren't accurate/
                  complete yet, so no rating, star count or review list is
                  shown anywhere on this page until they are. */}

              {/* Contact goes to the Wayzyy team only - never to the host. */}
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">Questions about this stay?</p>
                  <p className="text-sm text-muted-foreground">Chat with the Wayzyy team. We'll help with dates, groups and anything else before you book.</p>
                </div>
                <a
                  href={`https://wa.me/${SUPPORT_PHONE_HREF.replace("+", "")}?text=${encodeURIComponent(`Hi Wayzyy, I'm interested in "${property.title}" (${typeof window !== "undefined" ? window.location.href : ""})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with us on WhatsApp"
                  title="Chat with us on WhatsApp"
                  className="mx-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white hover:brightness-95 transition"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </a>
              </div>

              {/* Location Map ("Where you'll be" Matching Screenshot 4) */}
              <div className="pt-6 space-y-4">
                <h3 className="text-xl font-bold font-display text-foreground">Where you'll be</h3>
                <p className="text-xs text-muted-foreground font-medium">{/* area often already contains the city ("Panaji, Goa"), so drop repeats */}
                  {[...new Set([property.area, property.city, property.state, "India"].flatMap((x) => String(x ?? "").split(",")).map((x) => x.trim()).filter(Boolean))].join(", ")}</p>

                <div className="h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-border shadow-sm">
                  <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      // AdvancedMarker requires a Map ID to render at all.
                      // DEMO_MAP_ID is Google's own always-valid placeholder
                      // for exactly this - real cloud-based custom styling
                      // needs a real one created under Map Management in
                      // Cloud Console, but this renders correctly without it.
                      mapId="DEMO_MAP_ID"
                      defaultCenter={{ lat: property.lat, lng: property.lng }}
                      defaultZoom={14}
                      scrollwheel={false}
                      disableDefaultUI
                      zoomControl
                      gestureHandling="cooperative"
                    >
                      <AdvancedMarker
                        position={{ lat: property.lat, lng: property.lng }}
                        onClick={() => setShowMapInfo(true)}
                      >
                        <HousePin />
                      </AdvancedMarker>
                      {showMapInfo && (
                        <InfoWindow
                          position={{ lat: property.lat, lng: property.lng }}
                          onCloseClick={() => setShowMapInfo(false)}
                        >
                          <div className="text-xs font-bold p-1">
                            {property.title}
                            <p className="text-[10px] text-muted-foreground">{property.area}, {property.city}</p>
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  </APIProvider>
                </div>
              </div>
            </div>

            {/* Right Sticky Rail: full reservation card once booking is
                live, a plain "get in touch" card while it isn't. */}
            <div className="lg:col-span-1">
              {BOOKING_ENABLED && !property.showcase ? (
              <div className="sticky top-28 rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5">
                {/* Price Display */}
                <div className="flex items-baseline justify-between">
                  <div>
                    {originalStayTotal > stayTotal && (
                      <span className="font-price text-sm line-through text-muted-foreground mr-2 font-medium">
                        {property.currency}{originalStayTotal.toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="font-price text-2xl font-bold text-foreground">
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
                  <Popover open={datesOpen} onOpenChange={setDatesOpen}>
                    <PopoverTrigger asChild>
                      <button type="button" className="grid w-full grid-cols-2 divide-x divide-border text-left hover:bg-muted/40 transition-colors" aria-label="Change dates">
                        <div className="p-3">
                          <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Check-in</p>
                          <p className="text-xs font-bold text-foreground mt-0.5">{format(checkInDate, "d MMM yyyy")}</p>
                        </div>
                        <div className="p-3">
                          <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Checkout</p>
                          <p className="text-xs font-bold text-foreground mt-0.5">{format(checkOutDate, "d MMM yyyy")}</p>
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-auto rounded-2xl p-2">
                      <StayDatesCalendar
                        checkIn={checkInDate}
                        checkOut={checkOutDate}
                        minNights={minNights}
                        unavailable={unavailable}
                        onChange={(a, b) => { setCheckInDate(a); setCheckOutDate(b); setDateNotice(null); setDatesOpen(false); }}
                      />
                    </PopoverContent>
                  </Popover>
                  {dateNotice && <p className="px-3 py-2 text-[11px] font-semibold text-[#FF6B00]">{dateNotice}</p>}

                  {/* Guests - a popover (not an absolutely positioned box) so the
                      surrounding overflow-hidden card can't clip the stepper. */}
                  <Popover open={isGuestDropdownOpen} onOpenChange={setIsGuestDropdownOpen}>
                    <PopoverTrigger asChild>
                      <button type="button" className="block w-full p-3 text-left hover:bg-muted/40 transition-colors" aria-label="Change number of guests">
                        <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Guests</p>
                        <p className="text-xs font-bold text-foreground mt-0.5">{guestCount} {guestCount > 1 ? "guests" : "guest"}</p>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-64 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Total guests</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label="Fewer guests"
                            disabled={guestCount <= 1}
                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                            className="h-8 w-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="w-4 text-center text-sm font-bold">{guestCount}</span>
                          <button
                            type="button"
                            aria-label="More guests"
                            disabled={guestCount >= property.maxGuests}
                            onClick={() => setGuestCount(Math.min(property.maxGuests, guestCount + 1))}
                            className="h-8 w-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] text-muted-foreground">Up to {property.maxGuests} guests.</p>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Nothing is rendered about guest-count pricing. The price
                    moves with the party size and that is the whole disclosure;
                    the platform does not add copy on top of it. A host who
                    wants to explain their rate does so in their description. */}

                {/* Free cancellation note - only while that date is still ahead of us
                    (a stay starting in the next couple of days has no such window). */}
                {addDays(checkInDate, -2).getTime() > Date.now() && (
                  <div className="rounded-2xl bg-muted/40 p-3 text-center text-xs font-semibold text-muted-foreground">
                    Free cancellation before {format(addDays(checkInDate, -2), "d MMMM")}
                  </div>
                )}

                {/* Reserve Button (Vibrant #FF6B00 Ember Gradient) */}
                <button
                  onClick={() => {
                    // Bookings not open yet: take an enquiry instead of a payment.
                    // No payment, no sign-in, nothing is booked (see EnquiryModal).
                    if (!bookingsOpenFor(property.id)) {
                      setIsEnquiryOpen(true);
                      return;
                    }
                    // The date inputs already stop a shorter range from
                    // being entered, but this is the real gate on this
                    // page - and create-booking re-checks it server-side
                    // regardless, since the client is never trusted alone.
                    const ruleError = stayRuleError(stayRules, toDateStr(checkInDate), toDateStr(checkOutDate), nights);
                    if (ruleError) {
                      toast({ title: "These dates don't fit the host's rules", description: ruleError, variant: "destructive" });
                      return;
                    }
                    // No real quote means this is the mock fallback (the
                    // listing failed to load) - create-booking-order would
                    // happily charge for it, then create-booking would reject.
                    if (!quote) {
                      toast({
                        title: "Couldn't load live pricing",
                        description: "Please refresh the page and try again.",
                        variant: "destructive",
                      });
                      return;
                    }
                    for (let d = checkInDate; d < checkOutDate; d = addDays(d, 1)) {
                      if (unavailable.has(format(d, "yyyy-MM-dd"))) {
                        toast({
                          title: "Those dates are booked",
                          description: "Some nights in your stay aren't available. Pick dates that avoid the greyed-out days.",
                          variant: "destructive",
                        });
                        setDatesOpen(true);
                        return;
                      }
                    }
                    setIsBookingModalOpen(true);
                  }}
                  className="btn-brand btn-brand-lg w-full"
                >
                  {bookingsOpenFor(property.id) ? "Reserve" : "Enquire about this stay"}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  {bookingsOpenFor(property.id)
                    ? "The host confirms every request - fully refunded if they decline"
                    : "We're going live soon. Share your details and our team will get back to you."}
                </p>

                {/* Price Breakdown */}
                <div className="font-price space-y-2.5 pt-3 border-t border-border text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{quote?.hasDynamicPricing ? "Avg. " : ""}{property.currency}{nightlyRate.toLocaleString("en-IN")} × {nights} {nights === 1 ? "night" : "nights"}</span>
                    <span>{property.currency}{nightsSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {quote?.discount && (
                    <div className="flex justify-between font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>{DISCOUNT_LABELS[quote.discount.type].label} discount ({quote.discount.percentage}% off)</span>
                      <span>−{property.currency}{foldedDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
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
                      <span>Taxes (GST)</span>
                      <span>{property.currency}{(quote.stayGst + quote.serviceFeeGst).toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="font-price flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
                    <span>{quote ? "Total" : "Total before taxes"}</span>
                    <span>
                      {property.currency}
                      {(quote ? quote.total : stayTotal).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Report Listing - opens the guest's own mail client,
                    pre-filled with the listing name and link. */}
                <div className="pt-2 text-center">
                  <a
                    href={reportListingHref}
                    className="flex items-center justify-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-foreground underline w-fit"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>Report this listing</span>
                  </a>
                </div>
              </div>
              ) : (
              <div className="sticky top-28 rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5">
                <div>
                  {property.showcase ? (
                    <span className="text-2xl font-bold text-foreground">Contact us to book</span>
                  ) : (
                  <>
                  <span className="font-price text-2xl font-bold text-foreground">
                    {property.currency}{property.pricePerNight.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal ml-1">/ night</span>
                  </>
                  )}
                  {describeStayRules(stayRules).map((line) => (
                    <p key={line} className="mt-1 text-xs font-semibold text-[#FF6B00]">{line}</p>
                  ))}
                </div>

                <div className="rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">
                  Interested in this property? Get in touch and our team will help with dates, pricing and booking.
                </div>

                <a
                  href={`tel:${SUPPORT_PHONE_HREF}`}
                  className="btn-brand btn-brand-lg w-full text-center"
                >
                  Get in touch with us
                </a>
                <p className="text-center text-xs text-muted-foreground">{SUPPORT_PHONE}</p>
                {property.showcase && (
                  <button
                    type="button"
                    onClick={() => setIsEnquiryOpen(true)}
                    className="w-full rounded-full border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                  >
                    Send an enquiry
                  </button>
                )}

                {/* Report Listing - opens the guest's own mail client,
                    pre-filled with the listing name and link. */}
                <div className="pt-2 text-center">
                  <a
                    href={reportListingHref}
                    className="flex items-center justify-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-foreground underline w-fit"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>Report this listing</span>
                  </a>
                </div>
              </div>
              )}
            </div>
          </div>
        </main>

        {/* Full Screen Lightbox Photo Gallery Modal */}
        {showAllPhotos && (
          <PhotoLightbox
            images={images}
            index={lightboxIndex}
            onIndexChange={setLightboxIndex}
            onClose={() => setShowAllPhotos(false)}
          />
        )}

        {/* Pre-launch enquiry (replaces the booking flow until bookings open). */}
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          property={property}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestCount={guestCount}
        />

        {/* Razorpay Booking Flow Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          property={property}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestCount={guestCount}
          // The full quote (stay + GST + Wayzyy fee + its GST) - exactly what
          // create-booking-order and create-booking recompute and check.
          totalAmount={quote ? quote.total : stayTotal}
          accommodation={quote ? quote.accommodation : undefined}
          tax={quote ? quote.stayGst + quote.serviceFeeGst : 0}
          minNights={minNights}
          unavailable={unavailable}
          onDatesChange={(a, b) => { setCheckInDate(a); setCheckOutDate(b); }}
        />

        {/* Sign in to message the host - same account used everywhere else
            on Wayzyy, since this opens the same threads table the app reads. */}
        <Dialog open={showMessageSignIn} onOpenChange={setShowMessageSignIn}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Sign in to message the host</DialogTitle>
              <DialogDescription>Use your Wayzyy account - the same one you use in the app.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMessageSignIn} className="space-y-3">
              <div>
                <Label htmlFor="msgAuthEmail">Email</Label>
                <Input id="msgAuthEmail" type="email" value={messageAuthEmail} onChange={(e) => setMessageAuthEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="msgAuthPassword">Password</Label>
                <Input id="msgAuthPassword" type="password" value={messageAuthPassword} onChange={(e) => setMessageAuthPassword(e.target.value)} required />
              </div>
              <button
                type="submit"
                disabled={startingThread}
                className="w-full rounded-full bg-[#FF6B00] py-2.5 text-sm font-bold text-white hover:bg-[#FF6B00]/90 disabled:opacity-50 flex items-center justify-center"
              >
                {startingThread ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in & message"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </SEO>
  );
}
