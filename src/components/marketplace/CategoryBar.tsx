import React from "react";
import { 
  SlidersHorizontal, 
  Palmtree, 
  Building, 
  House,
  Flame,
  Waves,
  PawPrint,
  BedDouble,
  IndianRupee,
  ShieldCheck,
  Hotel
} from "lucide-react";

export interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  propertyTypes: string[];
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  placeType: "any" | "room" | "entire";
  selfCheckIn: boolean;
  petsAllowed: boolean;
  instantBookOnly: boolean;
  includeAllFees: boolean;
}

export const DEFAULT_FILTERS: FilterOptions = {
  category: "all",
  minPrice: 0,
  maxPrice: 100000,
  propertyTypes: [],
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  amenities: [],
  placeType: "any",
  selfCheckIn: false,
  petsAllowed: false,
  instantBookOnly: false,
  includeAllFees: true,
};

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenFilterModal: () => void;
  includeAllFees: boolean;
  onToggleIncludeAllFees: (val: boolean) => void;
  filters: FilterOptions;
  onChangeFilters: (f: FilterOptions) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Stays", icon: House },
  { id: "apartments", label: "Modern 2BHKs", icon: Building },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "beach", label: "Beach", icon: Palmtree },
];

// One-tap filters for what people in Goa search for most. Each one toggles a
// field on the same FilterOptions the full Filters dialog edits.
const QUICK_FILTERS: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isOn: (f: FilterOptions) => boolean;
  toggle: (f: FilterOptions) => FilterOptions;
}[] = [
  {
    id: "pool", label: "Private pool", icon: Waves,
    isOn: (f) => f.amenities.includes("Pool"),
    toggle: (f) => ({ ...f, amenities: f.amenities.includes("Pool") ? f.amenities.filter((a) => a !== "Pool") : [...f.amenities, "Pool"] }),
  },
  {
    id: "pets", label: "Pet friendly", icon: PawPrint,
    isOn: (f) => f.petsAllowed,
    toggle: (f) => ({ ...f, petsAllowed: !f.petsAllowed }),
  },
  {
    id: "beds", label: "3+ bedrooms", icon: BedDouble,
    isOn: (f) => f.bedrooms >= 3,
    toggle: (f) => ({ ...f, bedrooms: f.bedrooms >= 3 ? 0 : 3 }),
  },
  {
    id: "budget", label: "Under ₹5,000", icon: IndianRupee,
    isOn: (f) => f.maxPrice <= 5000,
    toggle: (f) => ({ ...f, minPrice: 0, maxPrice: f.maxPrice <= 5000 ? DEFAULT_FILTERS.maxPrice : 5000 }),
  },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenFilterModal,
  includeAllFees,
  onToggleIncludeAllFees,
  filters,
  onChangeFilters,
}) => {
  return (
    <div className="sticky top-[80px] z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10 xl:px-14 flex items-center gap-4 py-3">
        {/* Categories + quick filters share one scrolling row on small screens */}
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                aria-pressed={isSelected}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:border-[#FF6B00] hover:text-[#FF6B00]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "" : "text-[#FF6B00]"}`} />
                {cat.label}
              </button>
            );
          })}

          <span aria-hidden className="mx-2 h-6 w-px shrink-0 bg-border" />

          {QUICK_FILTERS.map((q) => {
            const Icon = q.icon;
            const on = q.isOn(filters);
            return (
              <button
                key={q.id}
                onClick={() => onChangeFilters(q.toggle(filters))}
                aria-pressed={on}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                  on
                    ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#C24E00] dark:text-[#FF8A33]"
                    : "border-border bg-background text-muted-foreground hover:text-[#FF6B00] hover:border-[#FF6B00]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {q.label}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={onOpenFilterModal}
            aria-label="Filters"
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 sm:px-4 py-2 text-sm font-semibold hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors bg-background"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <label className="hidden xl:flex items-center gap-2.5 rounded-full border border-border px-4 py-2 text-sm bg-background cursor-pointer">
            <span className="text-muted-foreground">Prices include all fees</span>
            <button
              type="button"
              role="switch"
              aria-checked={includeAllFees}
              onClick={() => onToggleIncludeAllFees(!includeAllFees)}
              className={`h-5 w-9 rounded-full transition-colors relative p-0.5 ${includeAllFees ? "bg-[#FF6B00]" : "bg-muted"}`}
            >
              <span className={`block h-4 w-4 rounded-full bg-white transition-transform shadow-xs ${includeAllFees ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};
