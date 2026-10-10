import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, IndianRupee, Info, Loader2, Lock, RotateCcw, SlidersHorizontal, Unlock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PricingGuideLink } from "@/components/host/MarketRateNote";
import { INDIA_FESTIVAL_PACKS, type FestivalPack } from "@/data/indiaFestivals";

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
function sameDay(a: Date, b: Date) { return key(a) === key(b); }

/* ---------- rate input ---------- */
// The rate box takes a rupee amount ("6500") or a percentage change from each
// night's current rate ("+20%", "-10%"; "15%" means +15%).
type RateInput = { kind: "abs"; value: number } | { kind: "pct"; pct: number };
function parseRateInput(raw: string): RateInput | null {
  const t = raw.trim().replace(/[\s,]/g, "");
  if (!t) return null;
  const m = t.match(/^([+\-\u2212]?)(\d+(?:\.\d+)?)%$/);
  if (m) {
    const pct = Number(m[2]) * (m[1] === "-" || m[1] === "\u2212" ? -1 : 1);
    if (!Number.isFinite(pct) || pct === 0 || pct < -90 || pct > 300) return null;
    return { kind: "pct", pct };
  }
  const value = Number(t);
  return Number.isFinite(value) ? { kind: "abs", value } : null;
}
const formatPct = (pct: number) => `${pct > 0 ? "+" : "\u2212"}${Math.abs(pct)}%`;
const PCT_CHIPS = [10, 20, 30, -10];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// getDay() values for the "Select every ..." buttons, Monday first (Sunday is 0).
const EVERY_DOW = [1, 2, 3, 4, 5, 6, 0];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
  // Friday/Saturday nights priced from the listing's weekend rate (written by the DB, not the host).
  const [weekendRule, setWeekendRule] = useState<Record<string, number>>({});
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState<Set<string>>(new Set());

  // Range selection: first click sets the anchor, second click closes the
  // range. A single click that never gets a second one is just a one-day
  // range, so both interactions share one code path.
  const [anchor, setAnchor] = useState<string | null>(null);
  const [head, setHead] = useState<string | null>(null);
  // "Select every Sunday" etc.: every upcoming night on that weekday, a year ahead.
  const [weekdayPick, setWeekdayPick] = useState<number | null>(null);
  const [priceInput, setPriceInput] = useState("");

  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [pricesRes, blockedRes, bookingsRes] = await Promise.all([
      supabase.from("date_prices").select("date, price, source").eq("property_id", propertyId),
      supabase.from("blocked_dates").select("blocked_date").eq("property_id", propertyId),
      supabase.from("bookings").select("check_in, check_out, status").eq("property_id", propertyId).in("status", ["confirmed", "pending"]),
    ]);

    const nextPrices: Record<string, number> = {};
    const nextRule: Record<string, number> = {};
    if (!pricesRes.error) {
      for (const r of (pricesRes.data ?? []) as { date: string; price: number; source: string }[]) {
        (r.source === "weekend_rule" ? nextRule : nextPrices)[r.date] = Number(r.price);
      }
    }
    setOverrides(nextPrices);
    setWeekendRule(nextRule);

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
    if (weekdayPick != null) {
      const out = new Set<string>();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const last = new Date(start.getFullYear(), start.getMonth() + 12, 0);
      for (let d = new Date(start); d <= last; d = addDays(d, 1)) {
        // Booked nights cannot be changed here.
        if (d.getDay() === weekdayPick && !booked.has(key(d))) out.add(key(d));
      }
      return out;
    }
    if (!anchor) return new Set<string>();
    const a = new Date(anchor);
    const b = head ? new Date(head) : a;
    const [from, to] = a <= b ? [a, b] : [b, a];
    const out = new Set<string>();
    for (let d = new Date(from); d <= to; d = addDays(d, 1)) out.add(key(d));
    return out;
  }, [anchor, head, weekdayPick, booked]);

  const onDayClick = (d: Date) => {
    const k = key(d);
    if (weekdayPick != null) {
      // Tapping a date leaves "every <weekday>" and starts a normal selection.
      setWeekdayPick(null);
      setAnchor(k);
      setHead(null);
      setPriceInput(overrides[k] != null ? String(overrides[k]) : "");
      return;
    }
    if (!anchor || head) {
      setAnchor(k);
      setHead(null);
      setPriceInput(overrides[k] != null ? String(overrides[k]) : "");
    } else {
      setHead(k);
    }
  };

  const clearSelection = () => { setAnchor(null); setHead(null); setWeekdayPick(null); setPriceInput(""); };

  const todayKey = key(new Date());
  const upcomingFestivals = useMemo(
    () => INDIA_FESTIVAL_PACKS.filter((f) => f.end >= todayKey).slice(0, 6),
    [todayKey],
  );
  const selectFestival = (f: FestivalPack) => {
    setWeekdayPick(null);
    const first = f.start < todayKey ? todayKey : f.start;
    setAnchor(first);
    setHead(f.end);
    setPriceInput(formatPct(f.suggestedPct));
    setMonth(startOfMonth(new Date(first + "T00:00:00")));
  };

  const pctHint = useMemo(() => {
    const parsed = parseRateInput(priceInput);
    const firstSel = [...selected][0];
    if (!parsed || parsed.kind !== "pct" || !firstSel) return null;
    const cur = (overrides[firstSel] ?? weekendRule[firstSel] ?? basePrice ?? 0);
    if (!cur) return null;
    const next = Math.round(cur * (1 + parsed.pct / 100));
    return `Each night changes by ${formatPct(parsed.pct)} from its current rate, for example ₹${cur.toLocaleString("en-IN")} → ₹${next.toLocaleString("en-IN")}.`;
  }, [priceInput, selected, overrides, weekendRule, basePrice]);

  const selectEveryWeekday = (dow: number) => {
    if (weekdayPick === dow) { clearSelection(); return; }
    setAnchor(null);
    setHead(null);
    setPriceInput("");
    setWeekdayPick(dow);
  };

  const priceFor = (d: Date) => {
    const k = key(d);
    return overrides[k] ?? weekendRule[k] ?? basePrice ?? 0;
  };

  /* ---------- actions ---------- */
  const applyPrice = async () => {
    const parsed = parseRateInput(priceInput);
    if (!parsed || (parsed.kind === "abs" && parsed.value < 100)) {
      toast({
        title: "Enter a valid rate",
        description: priceInput.includes("%") ? "Use a change between −90% and +300%, like +20%." : "₹100 or more, or a change like +20%.",
        variant: "destructive",
      });
      return;
    }
    // A percentage is applied to what each night costs today (its own custom
    // rate, the weekend rate, or the base rate).
    const updates: Record<string, number> = {};
    for (const date of selected) {
      if (parsed.kind === "abs") { updates[date] = parsed.value; continue; }
      const current = priceFor(new Date(date + "T00:00:00"));
      if (!current) {
        toast({ title: "Set a base price first", description: "A percentage change needs a current rate to start from.", variant: "destructive" });
        return;
      }
      updates[date] = Math.round(current * (1 + parsed.pct / 100));
    }
    if (Object.values(updates).some((v) => v < 100)) {
      toast({ title: "Rate too low", description: "That change would take some nights below ₹100.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const rows = Object.entries(updates).map(([date, price]) => ({ property_id: propertyId, date, price }));
    const { error } = await supabase.from("date_prices").upsert(rows, { onConflict: "property_id,date" });
    setSaving(false);
    if (error) {
      toast({ title: "Couldn't save pricing", description: error.message, variant: "destructive" });
      return;
    }
    setOverrides((prev) => ({ ...prev, ...updates }));
    toast({
      title: `${rows.length} night${rows.length === 1 ? "" : "s"} updated`,
      description: parsed.kind === "abs" ? `Now ₹${parsed.value.toLocaleString("en-IN")} a night.` : `Changed by ${formatPct(parsed.pct)}.`,
    });
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
    load();
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-white">
          {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex items-center gap-1">
          {/* Opens the all-listings pricing page with this listing preselected. */}
          <Button asChild size="sm" className="mr-1 gap-1.5 bg-ember text-xs text-white hover:bg-ember/90">
            <Link to={`/host/pricing?listing=${propertyId}`}>
              <SlidersHorizontal className="h-3.5 w-3.5" /> Advanced pricing
            </Link>
          </Button>
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

      <p className="text-xs text-white/70">
        Click a date to select it, then click another to select everything in between. Weekend rates apply to Friday and
        Saturday nights. <PricingGuideLink className="text-xs">Pricing guide</PricingGuideLink>
      </p>

      <p className="flex items-start gap-1.5 rounded-xl border border-ember/25 bg-ember/5 px-3 py-2 text-xs text-white/75">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" />
        <span>
          <span className="font-semibold text-white">Advanced pricing</span> sets weekday, weekend and month-by-month
          rates for a whole period at once, with market insights to guide you. Use it instead of pricing dates one by one.
        </span>
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

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-white/60">Select every</p>
            <div className="flex flex-wrap gap-1.5">
              {EVERY_DOW.map((dow, i) => (
                <button
                  key={dow}
                  type="button"
                  onClick={() => selectEveryWeekday(dow)}
                  aria-pressed={weekdayPick === dow}
                  aria-label={`Select every ${WEEKDAY_NAMES[dow]}`}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    weekdayPick === dow
                      ? "border-ember bg-ember text-white"
                      : "border-white/15 bg-transparent text-white/80 hover:border-white/40"
                  }`}
                >
                  {WEEKDAYS[i]}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-white/40">Pick a day name to select it for the next 12 months, then set a rate or block those nights.</p>
          </div>

          {upcomingFestivals.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-white/60">Festivals &amp; long weekends</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {upcomingFestivals.map((f) => {
                  const from = new Date(f.start + "T00:00:00");
                  const to = new Date(f.end + "T00:00:00");
                  const mon = (d: Date) => d.toLocaleString("en-IN", { month: "short" });
                  const range = from.getMonth() === to.getMonth()
                    ? `${from.getDate()}–${to.getDate()} ${mon(to)}`
                    : `${from.getDate()} ${mon(from)} – ${to.getDate()} ${mon(to)}`;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => selectFestival(f)}
                      className="min-w-[150px] rounded-xl border border-white/15 p-3 text-left hover:border-white/40"
                    >
                      <span className="block text-xs font-bold text-white">{f.name}</span>
                      <span className="mt-1 block text-[11px] text-white/60">{range}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-ember">Suggested {formatPct(f.suggestedPct)}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-white/40">Festival dates follow the lunar calendar and can shift by a day. Check before saving.</p>
            </div>
          )}

          {selected.size > 0 && (
            <div className="rounded-2xl border border-ember/30 bg-ember/5 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">
                  {weekdayPick != null ? `Every ${WEEKDAY_NAMES[weekdayPick]} · ` : ""}
                  {selected.size} night{selected.size === 1 ? "" : "s"}{weekdayPick != null ? "" : " selected"}
                </p>
                <button type="button" onClick={clearSelection} className="text-xs text-white/60 hover:text-white">Clear</button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                  <Input
                    type="text"
                    inputMode="text"
                    placeholder="Rate (6500) or change (+20%)"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="pl-8 text-sm"
                  />
                </div>
                <Button onClick={applyPrice} disabled={saving || !priceInput} className="gap-1.5 bg-ember text-white hover:bg-ember/90">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {parseRateInput(priceInput)?.kind === "pct" ? "Apply" : "Set rate"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {PCT_CHIPS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriceInput(formatPct(p))}
                    disabled={saving}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80 hover:border-white/40"
                  >
                    {formatPct(p)}
                  </button>
                ))}
              </div>
              {pctHint && <p className="text-xs text-white/60">{pctHint}</p>}

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
