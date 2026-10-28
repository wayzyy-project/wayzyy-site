import { imgSet } from "@/lib/img";
import React, { useState, useEffect, useRef } from "react";
import { guestNightlyPrice, airbnbEquivalentTotal } from "@/lib/pricing";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { PropertyListing } from "@/data/mockProperties";
import { isPropertyWishlisted, toggleWishlist } from "@/lib/wishlist";
import { propertyPath } from "@/lib/propertySlug";

interface PropertyCardProps {
  property: PropertyListing;
  nights?: number;
  includeAllFees?: boolean;
  /** First cards on a page: load the cover immediately and mark it high priority. Everything else is lazy. */
  priority?: boolean;
  /** "?checkin=...&checkout=...&guests=..." from the search, so the listing prices the same stay. */
  search?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  nights: nightsProp,
  includeAllFees = true,
  priority = false,
  search = "",
}) => {
  // Picked dates win; otherwise price the host's minimum stay (1 night unless they set more).
  const nights = nightsProp ?? Math.max(1, property.minNights ?? 1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  // The cover shimmers until its photo has loaded, then fades in over it.
  const [coverLoaded, setCoverLoaded] = useState(false);

  useEffect(() => {
    setIsSaved(isPropertyWishlisted(property.id));
    const handleUpdate = () => {
      setIsSaved(isPropertyWishlisted(property.id));
    };
    window.addEventListener("wayzyy_wishlist_updated", handleUpdate);
    return () => window.removeEventListener("wayzyy_wishlist_updated", handleUpdate);
  }, [property.id]);

  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80"];

  // Photos scroll sideways with native swipe / trackpad and snap per image.
  // Only the first photo loads up front; the rest are lazy, so a page of
  // cards stays light. Capped at 6 per card.
  const shown = images.slice(0, 6);
  const trackRef = useRef<HTMLDivElement>(null);
  // Only the cover loads until someone touches/hovers the card; swiping then
  // loads the rest. (Mounting all six photos of ~70 cards pulled hundreds of
  // images nobody looked at; Airbnb loads the next photo on interaction too.)
  const [engaged, setEngaged] = useState(false);
  const engage = () => { if (!engaged) setEngaged(true); };
  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCurrentImageIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property.id);
  };

  // Price calculations
  const totalPrice = guestNightlyPrice(property.pricePerNight) * nights;
  const airbnbEquivalent = airbnbEquivalentTotal(totalPrice);

  return (
    <Link
      to={propertyPath(property) + search}
      className="group block flex flex-col gap-2.5 text-left transition-all duration-200"
    >
      {/* Image Carousel Container */}
      <div className={`relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-muted ${coverLoaded ? "" : "skeleton-shimmer"}`}>
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          onPointerEnter={engage}
          onTouchStart={engage}
          onFocus={engage}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto no-scrollbar"
        >
          {shown.map((src, i) => {
            // Same-size empty slot keeps the swipe track and the dots correct.
            if (i > 0 && !engaged) return <div key={src + i} className="h-full w-full shrink-0 snap-center" aria-hidden />;
            const set = imgSet(src);
            return (
              <img
                key={src + i}
                src={set.src}
                srcSet={set.srcSet}
                // Card width follows the grid: 1 column on phones up to 6 on wide screens.
                sizes="(min-width: 1900px) 17vw, (min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                alt={i === 0 ? property.title : ""}
                className={`h-full w-full shrink-0 snap-center object-cover transition-opacity duration-500 ${i === 0 && !coverLoaded ? "opacity-0" : "opacity-100"}`}
                ref={i === 0 ? (el) => { if (el?.complete && el.naturalWidth > 0) setCoverLoaded(true); } : undefined}
                onLoad={i === 0 ? () => setCoverLoaded(true) : undefined}
                onError={i === 0 ? () => setCoverLoaded(true) : undefined}
                loading={i === 0 && priority ? "eager" : "lazy"}
                {...(i === 0 && priority ? { fetchPriority: "high" as const } : {})}
                decoding="async"
                draggable={false}
              />
            );
          })}
        </div>

        {property.tags && property.tags.length > 0 && (
          <span className="absolute left-3 top-3 z-10 max-w-[70%] truncate rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-gray-900 shadow-sm">
            {property.tags[0]}
          </span>
        )}

        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full transition-transform active:scale-75 hover:scale-110"
          title={isSaved ? "Saved - change wishlists" : "Save to a wishlist"}
        >
          <Heart
            className={`h-6 w-6 stroke-white stroke-[2.2] transition-colors drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] ${
              isSaved ? "fill-[#FF6B00] stroke-[#FF6B00]" : "fill-black/30 text-white"
            }`}
          />
        </button>

        {shown.length > 1 && (
          <div className="pointer-events-none absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
            {shown.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Details Matching Screenshot 1 */}
      <div className="flex flex-col text-sm space-y-0.5">
        {/* Title line & Location */}
        <div className="flex items-baseline justify-between font-bold text-foreground">
          <span className="truncate pr-2">{property.title.split("–")[0] || `${property.propertyType.split(" in ")[0]} in ${property.area || property.city}`}</span>
        </div>

        {/* Subtitle / Location */}
        <p className="text-xs text-muted-foreground truncate font-medium">
          {property.propertyType}
        </p>

        {/* Pricing line - no star rating: real reviews aren't accurate/
            complete yet, so nothing gets claimed here until they are. */}
        {property.showcase ? (
          <div className="mt-1 text-xs font-semibold text-ember">Contact us to book</div>
        ) : (
        <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-sm text-foreground">
          <span className="font-price text-muted-foreground line-through decoration-1">
            {property.currency}{airbnbEquivalent.toLocaleString("en-IN")}
          </span>
          <span className="font-price font-bold">
            {property.currency}{totalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-muted-foreground">
            {nights > 1 ? `for ${nights} nights` : "night"}
          </span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            Save {property.currency}{(airbnbEquivalent - totalPrice).toLocaleString("en-IN")}
          </span>
        </div>
        )}
      </div>
    </Link>
  );
};
