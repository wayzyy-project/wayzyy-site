import React, { useRef } from "react";
import { 
  SlidersHorizontal, 
  Palmtree, 
  Waves, 
  Building, 
  Sparkles,
  Flame,
  Castle, 
  TreePine, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Compass,
  Hotel
} from "lucide-react";

export interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  propertyTypes: string[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  instantBookOnly: boolean;
  includeAllFees: boolean;
}

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenFilterModal: () => void;
  includeAllFees: boolean;
  onToggleIncludeAllFees: (val: boolean) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Stays", icon: Sparkles },
  { id: "villas", label: "Luxury Villas", icon: Castle },
  { id: "pools", label: "Amazing Pools", icon: Waves },
  { id: "apartments", label: "Modern 2BHKs", icon: Building },
  { id: "beachfront", label: "Beachfront", icon: Palmtree },
  { id: "goa", label: "Goa Getaways", icon: Palmtree },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "nature", label: "Countryside", icon: TreePine },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenFilterModal,
  includeAllFees,
  onToggleIncludeAllFees,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[80px] z-40 w-full bg-background/90 backdrop-blur-md border-b border-border/50 py-3 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-xs hover:scale-105 transition-all text-muted-foreground hover:text-foreground shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Categories Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex items-center gap-7 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex flex-col items-center gap-1.5 pb-2 transition-all whitespace-nowrap border-b-2 ${
                  isSelected
                    ? "border-[#FF6B00] text-foreground font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isSelected ? "text-[#FF6B00]" : "text-muted-foreground"}`} />
                <span className="text-xs tracking-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-xs hover:scale-105 transition-all text-muted-foreground hover:text-foreground shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Right Tools: Filter Modal Trigger & 'Display total before taxes' toggle matching Airbnb */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenFilterModal}
            className="flex items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-xs font-bold hover:border-[#FF6B00] transition-colors bg-background shadow-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#FF6B00]" />
            <span>Filters</span>
          </button>

          {/* "Prices include all fees" switch pill */}
          <div className="hidden lg:flex items-center gap-2.5 rounded-2xl border border-border px-4 py-2 text-xs font-semibold bg-background shadow-xs">
            <span className="text-muted-foreground text-[11px] font-medium">Prices include all fees</span>
            <button
              onClick={() => onToggleIncludeAllFees(!includeAllFees)}
              className={`h-5 w-9 rounded-full transition-colors relative p-0.5 ${
                includeAllFees ? "bg-[#FF6B00]" : "bg-muted"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform shadow-xs ${
                  includeAllFees ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
