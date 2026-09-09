import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { FilterOptions } from "./CategoryBar";
import { Button } from "@/components/ui/button";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  totalResultsCount: number;
}

const AMENITY_OPTIONS = [
  "Fast Wifi (150+ Mbps)",
  "Air conditioning in all rooms",
  "Private crystal swimming pool",
  "Shared resort pool",
  "Dedicated workspace with ergonomic desk",
  "Fully equipped modular kitchen",
  "Free high-speed covered parking on premises",
  "Washing machine & Iron",
  "24/7 Security with CCTV & Smart Door Lock",
  "Private balcony with skyline view",
  "Pet friendly"
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters: initialFilters,
  onApplyFilters,
  totalResultsCount
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>({ ...initialFilters });

  if (!isOpen) return null;

  const handleToggleAmenity = (amenity: string) => {
    setLocalFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleReset = () => {
    const reset: FilterOptions = {
      category: "all",
      minPrice: 1000,
      maxPrice: 30000,
      propertyTypes: [],
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
      instantBookOnly: false,
      includeAllFees: true
    };
    setLocalFilters(reset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-border bg-background shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-base font-bold text-foreground">Filters</h2>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>

        {/* Filter Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 divide-y divide-border">
          {/* Price Range */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Price range</h3>
              <p className="text-xs text-muted-foreground">Nightly prices before zero guest platform fees</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border p-3.5 focus-within:border-[#FF6B00]">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Minimum</label>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-semibold text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => setLocalFilters({ ...localFilters, minPrice: Number(e.target.value) || 0 })}
                    className="w-full bg-transparent text-sm font-bold outline-none"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-border p-3.5 focus-within:border-[#FF6B00]">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Maximum</label>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-semibold text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) || 30000 })}
                    className="w-full bg-transparent text-sm font-bold outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rooms and Beds */}
          <div className="pt-6 space-y-4">
            <h3 className="text-base font-bold text-foreground">Bedrooms</h3>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, bedrooms: num })}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all border ${
                    localFilters.bedrooms === num
                      ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-xs shadow-[#FF6B00]/20"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                >
                  {num === 0 ? "Any" : `${num}+`}
                </button>
              ))}
            </div>

            <h3 className="text-base font-bold text-foreground pt-3">Bathrooms</h3>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, bathrooms: num })}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all border ${
                    localFilters.bathrooms === num
                      ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-xs shadow-[#FF6B00]/20"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                >
                  {num === 0 ? "Any" : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="pt-6 space-y-4">
            <h3 className="text-base font-bold text-foreground">Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const checked = localFilters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs font-medium transition-all ${
                      checked
                        ? "border-[#FF6B00] bg-[#FF6B00]/5 text-foreground font-semibold"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-md flex items-center justify-center border ${checked ? "bg-[#FF6B00] border-[#FF6B00] text-white" : "border-border"}`}>
                      {checked && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instant Book */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Instant Book</h3>
                <p className="text-xs text-muted-foreground">Listings you can book without waiting for host approval</p>
              </div>
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, instantBookOnly: !localFilters.instantBookOnly })}
                className={`h-6 w-11 rounded-full transition-colors relative p-0.5 ${
                  localFilters.instantBookOnly ? "bg-[#FF6B00]" : "bg-muted"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${
                    localFilters.instantBookOnly ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-foreground underline"
          >
            Clear all
          </button>
          <Button
            onClick={() => {
              onApplyFilters(localFilters);
              onClose();
            }}
            className="rounded-2xl px-7 py-3 bg-gradient-to-r from-[#FF6B00] to-[#E05300] hover:opacity-90 text-white font-bold text-sm shadow-md shadow-[#FF6B00]/25"
          >
            Show {totalResultsCount} places
          </Button>
        </div>
      </div>
    </div>
  );
};
