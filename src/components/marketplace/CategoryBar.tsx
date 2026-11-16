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
  // Every size below is a multiple of --u (see .fluid-bar in index.css): from 1024px up the whole
  // row shrinks in proportion with the window, so at any zoom it keeps the same layout on one line.
  const pill = "inline-flex shrink-0 items-center rounded-full border font-semibold transition-colors h-[calc(var(--u)*36)] gap-[calc(var(--u)*8)] px-[calc(var(--u)*16)] text-[length:calc(var(--u)*14)]";
  const icon = "h-[calc(var(--u)*16)] w-[calc(var(--u)*16)]";

  return (
    <div className="relative [@media(min-height:600px)]:sticky [@media(min-height:600px)]:top-[80px] z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/60 sm:border-b-0">
      <div className="fluid-bar mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10 xl:px-14 flex items-center gap-[calc(var(--u)*16)] py-3">
        {/* Categories + quick filters in one big pill from sm up; phones keep the plain scrolling row */}
        <div className="flex min-w-0 flex-1 items-center justify-start gap-[calc(var(--u)*8)] overflow-x-auto no-scrollbar sm:flex-initial sm:rounded-full sm:border sm:border-[#FF6B00] sm:bg-background sm:p-[calc(var(--u)*6)] sm:shadow-sm">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                aria-pressed={isSelected}
                className={`${pill} ${
                  isSelected
                    ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                    : "border-[#FF6B00] bg-background text-[#FF6B00]"
                }`}
              >
                <Icon className={icon} />
                {cat.label}
              </button>
            );
          })}

          <span aria-hidden className="mx-[calc(var(--u)*4)] h-[calc(var(--u)*24)] w-px shrink-0 bg-border" />

          {QUICK_FILTERS.map((q) => {
            const Icon = q.icon;
            const on = q.isOn(filters);
            return (
              <button
                key={q.id}
                onClick={() => onChangeFilters(q.toggle(filters))}
                aria-pressed={on}
                className={`${pill} ${
                  on
                    ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                    : "border-[#FF6B00] bg-background text-[#FF6B00]"
                }`}
              >
                <Icon className={icon} />
                {q.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-[calc(var(--u)*8)] sm:rounded-full sm:border sm:border-[#FF6B00] sm:bg-background sm:p-[calc(var(--u)*6)] sm:shadow-sm">
          <button
            onClick={onOpenFilterModal}
            aria-label="Filters"
            className={`${pill} border-[#FF6B00] bg-background text-[#FF6B00] max-sm:px-3`}
          >
            <SlidersHorizontal className={icon} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <label className="hidden lg:flex items-center gap-[calc(var(--u)*10)] rounded-full px-[calc(var(--u)*12)] text-[length:calc(var(--u)*14)] cursor-pointer">
            <span className="text-muted-foreground">Prices include all fees</span>
            <button
              type="button"
              role="switch"
              aria-checked={includeAllFees}
              onClick={() => onToggleIncludeAllFees(!includeAllFees)}
              className={`h-[calc(var(--u)*20)] w-[calc(var(--u)*36)] rounded-full transition-colors relative p-[calc(var(--u)*2)] ${includeAllFees ? "bg-[#FF6B00]" : "bg-muted"}`}
            >
              <span className={`block h-[calc(var(--u)*16)] w-[calc(var(--u)*16)] rounded-full bg-white transition-transform shadow-xs ${includeAllFees ? "translate-x-[calc(var(--u)*16)]" : "translate-x-0"}`} />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};
