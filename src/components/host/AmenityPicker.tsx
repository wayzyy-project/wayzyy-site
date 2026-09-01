import { useMemo, useRef, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { AMENITY_GROUPS, amenityGroupOf } from "@/lib/amenities";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}

const MAX_SUGGESTIONS = 8;

/**
 * Selected amenities are chips you remove; new ones come from a search box.
 *
 * The previous version rendered the whole catalogue as toggles, so with
 * nothing selected every chip looked identical and "tap to add or remove"
 * described nothing the host could see. It also doesn't scale - the
 * catalogue is ~100 entries now.
 */
export function AmenityPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();

  const suggestions = useMemo(() => {
    const chosen = new Set(value.map((v) => v.toLowerCase()));
    const pool = AMENITY_GROUPS.flatMap((g) => g.items).filter((a) => !chosen.has(a.toLowerCase()));
    if (!q) return pool.slice(0, MAX_SUGGESTIONS);
    // Prefix matches first - typing "wi" should surface WiFi before
    // "Fast WiFi", which merely contains it.
    const starts = pool.filter((a) => a.toLowerCase().startsWith(q));
    const contains = pool.filter((a) => !a.toLowerCase().startsWith(q) && a.toLowerCase().includes(q));
    return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
  }, [q, value]);

  // Anything not already in the catalogue can still be added - hosts have
  // things we haven't thought of, and forcing them into our list loses that.
  const exactExists = suggestions.some((a) => a.toLowerCase() === q) ||
    value.some((v) => v.toLowerCase() === q);
  const canAddCustom = q.length > 1 && !exactExists;

  const add = (amenity: string) => {
    const clean = amenity.trim();
    if (!clean) return;
    if (value.some((v) => v.toLowerCase() === clean.toLowerCase())) return;
    onChange([...value, clean]);
    setQuery("");
    setHighlight(0);
    inputRef.current?.focus();
  };

  const remove = (amenity: string) => onChange(value.filter((v) => v !== amenity));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - (canAddCustom ? 0 : 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[highlight]) add(suggestions[highlight]);
      else if (canAddCustom) add(query);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div>
      {/* What's actually on the listing */}
      {value.length === 0 ? (
        <p className="mb-3 rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
          No amenities on this listing yet. Search below to add them.
        </p>
      ) : (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 py-1.5 pl-3 pr-1.5 text-xs text-ember"
            >
              {a}
              <button
                type="button"
                onClick={() => remove(a)}
                aria-label={`Remove ${a}`}
                className="rounded-full p-0.5 transition-colors hover:bg-ember/25"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search to add */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder="Search amenities — type and press Enter"
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ember focus:outline-none"
        />

        {open && (suggestions.length > 0 || canAddCustom) && (
          <div
            data-lenis-prevent
            className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-2xl"
          >
            {suggestions.map((a, i) => (
              <button
                key={a}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(a)}
                onMouseEnter={() => setHighlight(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  i === highlight ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <span>{a}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">{amenityGroupOf(a)}</span>
              </button>
            ))}

            {canAddCustom && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(query)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ember transition-colors hover:bg-ember/10"
              >
                <Plus className="h-3.5 w-3.5 shrink-0" />
                Add “{query.trim()}”
              </button>
            )}
          </div>
        )}
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        {value.length} on this listing. Not in the list? Type it and press Enter.
      </p>
    </div>
  );
}
