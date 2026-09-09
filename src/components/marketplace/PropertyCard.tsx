import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { PropertyListing } from "@/data/mockProperties";
import { isPropertyWishlisted, toggleWishlist } from "@/lib/wishlist";

interface PropertyCardProps {
  property: PropertyListing;
  nights?: number;
  includeAllFees?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  nights = 2,
  includeAllFees = true,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

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

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property.id);
  };

  // Price calculations
  const totalPrice = property.pricePerNight * nights;

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block flex flex-col gap-2.5 text-left transition-all duration-200"
    >
      {/* Image Carousel Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted shadow-xs group-hover:shadow-md transition-shadow">
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Guest Favourite Badge (Top Left matching screenshot 1) */}
        {property.isGuestFavourite && (
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-black/90 backdrop-blur-md px-3.5 py-1 shadow-md border border-black/5 dark:border-white/10">
            <span className="text-[11px] font-extrabold tracking-tight text-foreground">Guest favourite</span>
          </div>
        )}

        {/* Favorite Heart Button (Top Right matching screenshot 1) */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-full transition-transform active:scale-75 hover:scale-110"
          title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart
            className={`h-6 w-6 stroke-white stroke-[2.2] transition-colors drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] ${
              isSaved ? "fill-[#FF6B00] stroke-[#FF6B00]" : "fill-black/30 text-white"
            }`}
          />
        </button>

        {/* Image Carousel Navigation Arrows (Visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Carousel Dots */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
              {images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? "w-4 bg-white shadow-xs" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
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

        {/* Pricing line & Star Rating */}
        <div className="mt-1 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-baseline gap-1 text-foreground">
            <span className="font-extrabold text-foreground">
              {property.currency}{totalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground font-normal">
              {nights > 1 ? `for ${nights} nights` : "night"}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-foreground">
            <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
            <span className="font-extrabold">{property.rating.toFixed(1)}</span>
            {property.reviewCount > 0 && (
              <span className="text-muted-foreground font-normal">({property.reviewCount})</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
