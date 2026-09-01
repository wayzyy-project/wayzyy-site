import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, IndianRupee, Loader2, Lock, RotateCcw, Unlock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ---------- date helpers (local-time safe) ---------- */
// Everything keys off a YYYY-MM-DD string built from local parts. Using
// toISOString() here would shift dates backwards for anyone east of UTC -
// including all of India - and silently price the wrong night.
function key(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addMonths(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function isWeekend(d: Date) { const g = d.getDay(); return g === 0 || g === 6; }
function sameDay(a: Date, b: Date) { return key(a) === key(b); }

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  propertyId: string;
  basePrice: number | null;
  weekendPrice: number | null;
}

export function PropertyCalendar({ propertyId, basePrice, weekendPrice }: Props) {
  const { toast } = useToast();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState<Set<string>>(new Set());

  // Range selection: first click sets the anchor, second click closes the
  // range. A single click that never gets a second one is just a one-day
  // range, so both interactions share one code path.
  const [anchor, setAnchor] = useState<string | null>(null);
  const [head, setHead] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("");

  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [pricesRes, blockedRes, bookingsRes] = await Promise.all([
      supabase.from("date_prices").select("date, price").eq("property_id", propertyId),
      supabase.from("blocked_dates").select("blocked_date").eq("property_id", propertyId),
      supabase.from("bookings").select("check_in, check_out, status").eq("property_id", propertyId).in("status", ["confirmed", "pending"]),
    ]);

    const nextPrices: Record<string, number> = {};
    if (!pricesRes.error) {
      for (const r of pricesRes.data ?? []) nextPrices[(r as any).date] = Number((r as any).price);
    }
    setOverrides(nextPrices);

    const nextBlocked = new Set<string>();
    if (!blockedRes.error) {
      for (const r of blockedRes.data ?? []) nextBlocked.add((r as any).blocked_date);
    }
    setBlocked(nextBlocked);

    // A booking occupies every night from check-in up to (not including)
    // check-out - the guest leaves that morning, so it's bookable again.
    const nextBooked = new Set<string>();
    if (!bookingsRes.error) {
      for (const b of bookingsRes.data ?? []) {
        const start = new Date((b as any).check_in);
        const end = new Date((b as any).check_out);
        for (let d = new Date(start); d < end; d = addDays(d, 1)) nextBooked.add(key(d));
      }
    }
    setBooked(nextBooked);
    setLoading(false);
  }, [propertyId]);

  useEffect(() => { load(); }, [load]);

  /* ---------- selection ---------- */
  const selected = useMemo(() => {
    if (!anchor) return new Set<string>();
    const a = new Date(anchor);
    const b = head ? new Date(head) : a;
    const [from, to] = a <= b ? [a, b] : [b, a];
    const out = new Set<string>();
    for (let d = new Date(from); d <= to; d = addDays(d, 1)) out.add(key(d));
    return out;
  }, [anchor, head]);

  const onDayClick = (d: Date) => {
    const k = key(d);
    if (!anchor || head) {
      setAnchor(k);
      setHead(null);
      setPriceInput(overrides[k] != null ? String(overrides[k]) : "");
    } else {
      setHead(k);
    }
  };

  const clearSelection = () => { setAnchor(null); setHead(null); setPriceInput(""); };

  const priceFor = (d: Date) => {
    const k = key(d);
    if (overrides[k] != null) return overrides[k];
    if (isWeekend(d) && weekendPrice) return weekendPrice;
    return basePrice ?? 0;
  };

  /* ---------- actions ---------- */
  const applyPrice = async () => {
    const value = Number(priceInput);
    if (!Number.isFinite(value) || value < 100) {
      toast({ title: "Enter a valid rate", description: "₹100 or more.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const rows = [...selected].map((date) => ({ property_id: propertyId, date, price: value }));
    const { error } = await supabase.from("date_prices").upsert(rows, { onConflict: "property_id,date" });
    setSaving(false);
    if (error) {
      toast({ title: "Couldn't save pricing", description: error.message, variant: "destructive" });
      return;
    }
    setOverrides((prev) => {
      const next = { ...prev };
      for (const d of selected) next[d] = value;
      return next;
    });
    toast({ title: `${selected.size} night${selected.size === 1 ? "" : "s"} updated`, description: `Now ₹${value.toLocaleString("en-IN")} a night.` });
    clearSelection();
  };

  const resetPrice = async () => {
    setSaving(true);
    const { error } = await supabase.from("date_prices").delete().eq("property_id", propertyId).in("date", [...selected]);
    setSaving(false);
    if (error) {
      toast({ title: "Couldn't reset", description: error.message, variant: "destructive" });
      return;
    }
    setOverrides((prev) => {
      const next = { ...prev };
      for (const d of selected) delete next[d];
      return next;
    });
    toast({ title: "Back to your standard rate" });
    clearSelection();
  };

  const setBlocking = async (block: boolean) => {
    setSaving(true);
    let error;
    if (block) {
      const rows = [...selected].filter((d) => !blocked.has(d)).map((date) => ({ property_id: propertyId, blocked_date: date }));
      if (rows.length) ({ error } = await supabase.from("blocked_dates").insert(rows));
    } else {
      ({ error } = await supabase.from("blocked_dates").delete().eq("property_id", propertyId).in("blocked_date", [...selected]));
    }
    setSaving(false);
    if (error) {
      toast({ title: block ? "Couldn't block those dates" : "Couldn't reopen those dates", description: error.message, variant: "destructive" });
      return;
    }
    setBlocked((prev) => {
      const next = new Set(prev);
      for (const d of selected) block ? next.add(d) : next.delete(d);
      return next;
    });
    toast({ title: block ? "Dates blocked" : "Dates reopened" });
    clearSelection();
  };

  /* ---------- grid ---------- */
  const cells = useMemo(() => {
    const first = startOfMonth(month);
    // Monday-first, matching how Indian calendars are usually printed.
    const lead = (first.getDay() + 6) % 7;
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = Array(lead).fill(null);
    for (let i = 1; i <= days; i++) out.push(new Date(month.getFullYear(), month.getMonth(), i));
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [month]);

  const selectionHasBlocked = [...selected].some((d) => blocked.has(d));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">
          {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, -1))}
            className="rounded-lg border border-white/20 p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            className="rounded-lg border border-white/20 p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-white/60">
        Click a date to select it, then click another to select everything in between.
      </p>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-white/50" /></div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-white/40">{w}</div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={`x${i}`} />;
              const k = key(d);
              const past = d < today;
              const isBooked = booked.has(k);
              const isBlocked = blocked.has(k);
              const isSel = selected.has(k);
              const hasOverride = overrides[k] != null;
              const disabled = past || isBooked;

              return (
                <button
                  key={k}
                  type="button"
                  disabled={disabled}
                  onClick={() => onDayClick(d)}
                  className={[
                    "relative flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember",
                    disabled ? "cursor-not-allowed border-white/5 text-white/25" : "cursor-pointer",
                    isSel ? "border-ember bg-ember/20 text-white"
                      : isBooked ? "border-white/10 bg-white/5"
                      : isBlocked ? "border-white/10 bg-white/[0.03] text-white/40"
                      : "border-white/10 text-white hover:border-white/30",
                  ].join(" ")}
                >
                  <span className={`font-semibold ${sameDay(d, today) ? "underline underline-offset-2" : ""}`}>{d.getDate()}</span>
                  {!disabled && !isBlocked && (
                    <span className={`text-[9px] tabular-nums ${hasOverride ? "font-semibold text-ember" : "text-white/50"}`}>
                      {priceFor(d) ? `₹${priceFor(d).toLocaleString("en-IN")}` : "—"}
                    </span>
                  )}
                  {isBooked && <span className="text-[9px] text-white/40">Booked</span>}
                  {isBlocked && !isBooked && <Lock className="h-2.5 w-2.5 text-white/40" />}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-ember bg-ember/20" /> Selected</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-white/5" /> Booked</span>
            <span className="flex items-center gap-1.5"><Lock className="h-2.5 w-2.5" /> Blocked</span>
            <span className="flex items-center gap-1.5"><span className="text-ember">₹</span> Custom rate</span>
          </div>

          {selected.size > 0 && (
            <div className="rounded-2xl border border-ember/30 bg-ember/5 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">
                  {selected.size} night{selected.size === 1 ? "" : "s"} selected
                </p>
                <button type="button" onClick={clearSelection} className="text-xs text-white/60 hover:text-white">Clear</button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Rate for these nights"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="pl-8 text-sm"
                  />
                </div>
                <Button onClick={applyPrice} disabled={saving || !priceInput} className="gap-1.5 bg-ember text-white hover:bg-ember/90">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Set rate
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
                <Button variant="outline" size="sm" onClick={resetPrice} disabled={saving} className="gap-1.5 border-white/20 text-xs text-white hover:bg-white/10">
                  <RotateCcw className="h-3.5 w-3.5" /> Use standard rate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBlocking(!selectionHasBlocked)}
                  disabled={saving}
                  className="gap-1.5 border-white/20 text-xs text-white hover:bg-white/10"
                >
                  {selectionHasBlocked ? <><Unlock className="h-3.5 w-3.5" /> Reopen dates</> : <><Lock className="h-3.5 w-3.5" /> Block dates</>}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
