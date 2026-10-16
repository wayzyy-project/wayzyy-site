import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Key, PawPrint } from "lucide-react";
import { FilterOptions, DEFAULT_FILTERS } from "./CategoryBar";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  // Live count for a draft, so the button reads "Show 14 stays" as you tap.
  countFor: (filters: FilterOptions) => number;
}

// Same amenity list as the mobile app's Filters screen.
export const AMENITY_FILTERS = [
  "WiFi", "Kitchen", "Washer", "AC", "Heating", "Hot Water", "TV", "Pool",
  "Parking", "Breakfast", "Garden", "Beach Access", "Pet-friendly",
  "BBQ", "Workspace", "Gym", "EV Charger",
];

const PLACE_TYPES: { value: FilterOptions["placeType"]; label: string; sub: string }[] = [
  { value: "any", label: "Any type", sub: "Rooms and entire homes" },
  { value: "room", label: "Room", sub: "Your own room, shared spaces" },
  { value: "entire", label: "Entire home", sub: "The whole place to yourself" },
];

const PRICE_PRESETS = [
  { label: "Under ₹3,000", min: 0, max: 3000 },
  { label: "₹3,000 – 7,000", min: 3000, max: 7000 },
  { label: "₹7,000 – 15,000", min: 7000, max: 15000 },
  { label: "₹15,000+", min: 15000, max: DEFAULT_FILTERS.maxPrice },
];

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value === 0}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-30 hover:border-foreground transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-10 text-center text-sm font-semibold tabular-nums text-foreground">{value === 0 ? "Any" : `${value}+`}</span>
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground hover:border-foreground transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, sub, on, onToggle }: { icon: React.ComponentType<{ className?: string }>; label: string; sub: string; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onToggle} className="flex w-full items-center gap-4 py-3 text-left">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{sub}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${on ? "bg-[#FF6B00]" : "bg-muted-foreground/30"}`}>
        <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, onApplyFilters, countFor }) => {
  const [draft, setDraft] = useState<FilterOptions>(filters);
  useEffect(() => { if (isOpen) setDraft(filters); }, [isOpen, filters]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  const set = <K extends keyof FilterOptions>(k: K, v: FilterOptions[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const toggleAmenity = (a: string) =>
    set("amenities", draft.amenities.includes(a) ? draft.amenities.filter((x) => x !== a) : [...draft.amenities, a]);
  const count = countFor(draft);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 sm:p-6 animate-in fade-in duration-200" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full sm:max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-background shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
      >
        <div className="relative flex items-center justify-center border-b border-border px-6 py-4">
          <button onClick={onClose} aria-label="Close filters" className="absolute left-4 rounded-full p-2 hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
          <h2 id="filters-title" className="text-base font-bold text-foreground">Filters</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 divide-y divide-border">
          <section className="py-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Price range</h3>
              <p className="text-sm text-muted-foreground">Nightly price, before fees</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRICE_PRESETS.map((p) => {
                const on = draft.minPrice === p.min && draft.maxPrice === p.max;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setDraft((d) => (on ? { ...d, minPrice: DEFAULT_FILTERS.minPrice, maxPrice: DEFAULT_FILTERS.maxPrice } : { ...d, minPrice: p.min, maxPrice: p.max }))}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:border-foreground/50"}`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["minPrice", "maxPrice"] as const).map((k) => (
                <label key={k} className="rounded-2xl border border-border px-4 py-2.5 focus-within:border-foreground">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{k === "minPrice" ? "Minimum" : "Maximum"}</span>
                  <span className="flex items-center gap-1 text-base text-foreground">
                    ₹
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={draft[k]}
                      onChange={(e) => set(k, Math.max(0, Number(e.target.value) || 0))}
                      className="w-full bg-transparent outline-none tabular-nums"
                    />
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="py-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Type of place</h3>
            <div className="grid grid-cols-3 gap-2">
              {PLACE_TYPES.map((t) => {
                const on = draft.placeType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("placeType", t.value)}
                    className={`rounded-2xl border px-3 py-3 text-left transition-colors ${on ? "border-foreground bg-muted/60" : "border-border hover:border-foreground/50"}`}
                  >
                    <span className="block text-sm font-semibold text-foreground">{t.label}</span>
                    <span className="block text-[11px] leading-snug text-muted-foreground">{t.sub}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="py-4">
            <h3 className="pt-2 text-lg font-bold text-foreground">Rooms &amp; beds</h3>
            <Stepper label="Bedrooms" value={draft.bedrooms} onChange={(v) => set("bedrooms", v)} />
            <Stepper label="Beds" value={draft.beds} onChange={(v) => set("beds", v)} />
            <Stepper label="Bathrooms" value={draft.bathrooms} onChange={(v) => set("bathrooms", v)} />
          </section>

          <section className="py-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {AMENITY_FILTERS.map((a) => {
                const on = draft.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAmenity(a)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:border-foreground/50"}`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="py-4">
            <h3 className="pt-2 text-lg font-bold text-foreground">Booking options</h3>
            <ToggleRow icon={Key} label="Self check-in" sub="Easy access with a smart lock or lockbox" on={draft.selfCheckIn} onToggle={() => set("selfCheckIn", !draft.selfCheckIn)} />
            <ToggleRow icon={PawPrint} label="Allows pets" sub="Bring your pet along" on={draft.petsAllowed} onToggle={() => set("petsAllowed", !draft.petsAllowed)} />
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button onClick={() => setDraft({ ...DEFAULT_FILTERS, includeAllFees: draft.includeAllFees })} className="text-sm font-semibold text-foreground underline underline-offset-2">
            Clear all
          </button>
          <button
            onClick={() => { onApplyFilters(draft); onClose(); }}
            className="btn-brand btn-brand-lg"
          >
            {count === 0 ? "No stays match" : `Show ${count} ${count === 1 ? "stay" : "stays"}`}
          </button>
        </div>
      </div>
    </div>
  );
};
