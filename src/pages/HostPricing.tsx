import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, SlidersHorizontal, Eye, Inbox, CalendarCheck, Percent, Clock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AdvancedPricingWizard } from "@/components/host/AdvancedPricingWizard";
import { formatINR } from "@/lib/advancedPricing";
import { toDateStr, parseLocalDate } from "@/lib/pricing";

interface Listing {
  id: string;
  title: string;
  image: string | null;
  status: string;
  basePrice: number;
  weekendPrice: number | null;
}

interface ListingStats {
  views30d: number;
  requests30d: number;
  bookings30d: number;
  pending: number;
  bookedNext30: number;
  openNext30: number;
  customNext90: number;
}

type NightFilter = "all" | "weekdays" | "weekends";
type Mode = "set" | "adjust" | "reset";

const DAY = 24 * 60 * 60 * 1000;
const MIN_NIGHTLY = 100;
const MAX_RANGE_NIGHTS = 365;

// Friday and Saturday nights - the same weekend the pricing wizard uses.
const isWeekendNight = (d: Date) => d.getDay() === 5 || d.getDay() === 6;

const nightsBetween = (from: string, to: string): string[] => {
  const out: string[] = [];
  const end = parseLocalDate(to);
  for (const d = parseLocalDate(from); d <= end; d.setDate(d.getDate() + 1)) out.push(toDateStr(d));
  return out;
};

const pct = (n: number | null) => (n == null ? "—" : `${Math.round(n * 100)}%`);

export default function HostPricing() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<Record<string, ListingStats>>({});
  const [booked, setBooked] = useState<Record<string, Set<string>>>({});
  const [overrides, setOverrides] = useState<Record<string, Record<string, number>>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [wizardFor, setWizardFor] = useState<Listing | null>(null);

  const todayStr = toDateStr(new Date());
  const [from, setFrom] = useState(todayStr);
  const [to, setTo] = useState(toDateStr(new Date(Date.now() + 29 * DAY)));
  const [nightFilter, setNightFilter] = useState<NightFilter>("all");
  const [mode, setMode] = useState<Mode>("adjust");
  const [fixedPrice, setFixedPrice] = useState("");
  const [adjustPct, setAdjustPct] = useState("10");
  const [keepCustom, setKeepCustom] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: props } = await supabase
      .from("properties")
      .select("id, title, images, status, price_per_night, weekend_price")
      .eq("host_id", user.id)
      .order("created_at", { ascending: false });

    const list: Listing[] = (props ?? []).map((p: any) => ({
      id: p.id,
      title: p.title || "Untitled listing",
      image: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
      status: p.status,
      basePrice: Number(p.price_per_night) || 0,
      weekendPrice: p.weekend_price != null && Number(p.weekend_price) > 0 ? Number(p.weekend_price) : null,
    }));
    setListings(list);
    const ids = list.map((l) => l.id);
    if (!ids.length) { setLoading(false); return; }

    const now = Date.now();
    const in30 = toDateStr(new Date(now + 30 * DAY));
    const in90 = toDateStr(new Date(now + 90 * DAY));
    const ago30 = new Date(now - 30 * DAY).toISOString();

    const [perfRes, bookingsRes, blockedRes, pricesRes] = await Promise.all([
      supabase.rpc("get_host_listing_performance", { p_host_id: user.id }),
      supabase.from("bookings").select("property_id, status, check_in, check_out, created_at").in("property_id", ids),
      supabase.from("blocked_dates").select("property_id, blocked_date").in("property_id", ids).gte("blocked_date", todayStr).lt("blocked_date", in30),
      supabase.from("date_prices").select("property_id, date, price, source").in("property_id", ids).gte("date", todayStr),
    ]);

    const views: Record<string, number> = {};
    for (const r of (perfRes.data ?? []) as { property_id: string; views_30d: number }[]) views[r.property_id] = r.views_30d;

    const next30 = new Set(nightsBetween(todayStr, toDateStr(new Date(now + 29 * DAY))));
    const bookedByListing: Record<string, Set<string>> = {};
    const s: Record<string, ListingStats> = {};
    for (const id of ids) {
      bookedByListing[id] = new Set();
      s[id] = { views30d: views[id] ?? 0, requests30d: 0, bookings30d: 0, pending: 0, bookedNext30: 0, openNext30: 30, customNext90: 0 };
    }

    for (const b of (bookingsRes.data ?? []) as any[]) {
      const st = s[b.property_id];
      if (!st) continue;
      if (b.created_at >= ago30) {
        st.requests30d += 1;
        if (b.status === "confirmed" || b.status === "completed") st.bookings30d += 1;
      }
      if (b.status === "pending") st.pending += 1;
      if (b.status === "confirmed" || b.status === "pending") {
        // A booking holds every night from check-in up to, not including, check-out.
        for (const n of nightsBetween(b.check_in, toDateStr(new Date(parseLocalDate(b.check_out).getTime() - DAY)))) {
          bookedByListing[b.property_id].add(n);
        }
      }
    }

    const blockedNext30: Record<string, number> = {};
    for (const r of (blockedRes.data ?? []) as any[]) blockedNext30[r.property_id] = (blockedNext30[r.property_id] ?? 0) + 1;

    const ov: Record<string, Record<string, number>> = {};
    for (const id of ids) ov[id] = {};
    for (const r of (pricesRes.data ?? []) as any[]) {
      if (r.source === "weekend_rule") continue;
      ov[r.property_id][r.date] = Number(r.price);
      if (r.date < in90) s[r.property_id].customNext90 += 1;
    }

    for (const id of ids) {
      const bookedNights = [...bookedByListing[id]].filter((n) => next30.has(n)).length;
      s[id].bookedNext30 = bookedNights;
      s[id].openNext30 = Math.max(0, 30 - bookedNights - (blockedNext30[id] ?? 0));
    }

    setStats(s);
    setBooked(bookedByListing);
    setOverrides(ov);
    setLoading(false);
  }, [user, todayStr]);

  useEffect(() => { load(); }, [load]);

  // Arriving from a listing's "Advanced pricing" button preselects it.
  useEffect(() => {
    const preselect = searchParams.get("listing");
    if (preselect && listings.some((l) => l.id === preselect)) setSelected(new Set([preselect]));
  }, [searchParams, listings]);

  const totals = useMemo(() => {
    const all = Object.values(stats);
    const sum = (k: keyof ListingStats) => all.reduce((a, s) => a + s[k], 0);
    const views = sum("views30d");
    const bookings = sum("bookings30d");
    const bookedNights = sum("bookedNext30");
    const capacity = bookedNights + sum("openNext30");
    return {
      views,
      requests: sum("requests30d"),
      bookings,
      pending: sum("pending"),
      conversion: views > 0 ? bookings / views : null,
      occupancy: capacity > 0 ? bookedNights / capacity : null,
    };
  }, [stats]);

  const rangeNights = useMemo(() => {
    if (!from || !to || from > to) return [];
    return nightsBetween(from, to).filter((n) => {
      if (n < todayStr) return false;
      if (nightFilter === "all") return true;
      const weekend = isWeekendNight(parseLocalDate(n));
      return nightFilter === "weekends" ? weekend : !weekend;
    });
  }, [from, to, nightFilter, todayStr]);

  // Every night each selected listing would change, after skipping booked
  // nights (guests keep the price they paid) and, if asked, custom prices.
  const plan = useMemo(() => {
    const rows: { property_id: string; date: string; price: number }[] = [];
    const resets: { property_id: string; date: string }[] = [];
    for (const l of listings) {
      if (!selected.has(l.id)) continue;
      for (const date of rangeNights) {
        if (booked[l.id]?.has(date)) continue;
        const existing = overrides[l.id]?.[date];
        if (mode === "reset") {
          if (existing != null) resets.push({ property_id: l.id, date });
          continue;
        }
        if (keepCustom && existing != null) continue;
        const standard = isWeekendNight(parseLocalDate(date)) && l.weekendPrice ? l.weekendPrice : l.basePrice;
        const price = mode === "set"
          ? Number(fixedPrice)
          : Math.round(standard * (1 + Number(adjustPct) / 100));
        rows.push({ property_id: l.id, date, price });
      }
    }
    return { rows, resets };
  }, [listings, selected, rangeNights, booked, overrides, mode, keepCustom, fixedPrice, adjustPct]);

  const issue = useMemo(() => {
    if (!selected.size) return "Select at least one listing.";
    if (!from || !to || from > to) return "Choose a start date on or before the end date.";
    if (nightsBetween(from, to).length > MAX_RANGE_NIGHTS) return `Choose a range of at most ${MAX_RANGE_NIGHTS} nights.`;
    if (mode === "set" && !(Number(fixedPrice) >= MIN_NIGHTLY)) return `Enter a nightly price of at least ${formatINR(MIN_NIGHTLY)}.`;
    if (mode === "adjust" && (!Number.isFinite(Number(adjustPct)) || Number(adjustPct) <= -90 || Number(adjustPct) > 300)) {
      return "Enter a percentage between -90% and +300%.";
    }
    if (mode !== "reset" && plan.rows.some((r) => r.price < MIN_NIGHTLY)) return `Some nights would fall below ${formatINR(MIN_NIGHTLY)}.`;
    if (mode === "reset" ? !plan.resets.length : !plan.rows.length) return "No nights to change - they're all booked or already custom-priced.";
    return null;
  }, [selected, from, to, mode, fixedPrice, adjustPct, plan]);

  const changeCount = mode === "reset" ? plan.resets.length : plan.rows.length;

  const apply = async () => {
    if (issue) return;
    setSaving(true);
    try {
      if (mode === "reset") {
        const byListing: Record<string, string[]> = {};
        for (const r of plan.resets) (byListing[r.property_id] ??= []).push(r.date);
        for (const [propertyId, dates] of Object.entries(byListing)) {
          for (let i = 0; i < dates.length; i += 200) {
            const { error } = await supabase.from("date_prices").delete().eq("property_id", propertyId).in("date", dates.slice(i, i + 200));
            if (error) throw error;
          }
        }
      } else {
        for (let i = 0; i < plan.rows.length; i += 500) {
          const { error } = await supabase.from("date_prices").upsert(plan.rows.slice(i, i + 500), { onConflict: "property_id,date" });
          if (error) throw error;
        }
      }
      toast({
        title: mode === "reset" ? `${changeCount} nights reset to your standard rate` : `${changeCount} nights priced`,
        description: `Across ${selected.size} listing${selected.size === 1 ? "" : "s"}. Booked nights were left unchanged.`,
      });
      await load();
    } catch (e) {
      toast({ title: "Couldn't save pricing", description: e instanceof Error ? e.message : "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggle = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const allSelected = listings.length > 0 && selected.size === listings.length;

  if (authLoading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-slate-950"><Loader2 className="h-8 w-8 animate-spin text-amber-400" /></div>;
  }
  if (!user) return <Navigate to="/host" replace />;

  return (
    <SEO title="Advanced pricing - Wayzyy Host" description="See how your listings are performing and update pricing across one or many listings." path="/host/pricing">
      <div className="dark min-h-screen bg-slate-950 text-foreground">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
          <header className="space-y-2">
            <Link to="/host" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
            </Link>
            <h1 className="font-display text-3xl font-bold text-white">Advanced pricing</h1>
            <p className="max-w-2xl text-sm text-white/60">
              See how each listing is doing, then update prices for one listing or many at once. Booked nights are never changed, and your discounts still apply on top.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : !listings.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70">
              You don't have any listings yet. <Link to="/host" className="font-semibold text-primary underline">Add one from your dashboard</Link>.
            </div>
          ) : (
            <>
              {/* ── Insights ── */}
              <section aria-labelledby="insights-heading" className="space-y-3">
                <h2 id="insights-heading" className="text-sm font-bold uppercase tracking-wider text-white/50">Last 30 days, all listings</h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                  <Stat icon={Eye} label="Listing views" value={totals.views.toLocaleString("en-IN")} />
                  <Stat icon={Inbox} label="Booking requests" value={String(totals.requests)} />
                  <Stat icon={CalendarCheck} label="Confirmed bookings" value={String(totals.bookings)} />
                  <Stat icon={Percent} label="Views to bookings" value={pct(totals.conversion)} hint="Bookings per listing view" />
                  <Stat icon={CalendarCheck} label="Next 30 days booked" value={pct(totals.occupancy)} hint="Of nights not blocked" />
                  <Stat icon={Clock} label="Awaiting your reply" value={String(totals.pending)} hint="Reply within 6 hours" urgent={totals.pending > 0} />
                </div>
              </section>

              {/* ── Listings table ── */}
              <section aria-labelledby="listings-heading" className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <h2 id="listings-heading" className="text-sm font-bold uppercase tracking-wider text-white/50">Your listings</h2>
                  <p className="text-xs text-white/50">{selected.size} of {listings.length} selected</p>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full min-w-[920px] text-left text-sm">
                    <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
                      <tr>
                        <th className="w-10 px-4 py-3">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => setSelected(allSelected ? new Set() : new Set(listings.map((l) => l.id)))}
                            aria-label="Select all listings"
                          />
                        </th>
                        <th className="px-3 py-3 font-semibold">Listing</th>
                        <th className="px-3 py-3 text-right font-semibold">Standard rate</th>
                        <th className="px-3 py-3 text-right font-semibold">Views</th>
                        <th className="px-3 py-3 text-right font-semibold">Requests</th>
                        <th className="px-3 py-3 text-right font-semibold">Bookings</th>
                        <th className="px-3 py-3 text-right font-semibold">Views to bookings</th>
                        <th className="px-3 py-3 text-right font-semibold">Next 30 days</th>
                        <th className="px-3 py-3 text-right font-semibold">Custom prices</th>
                        <th className="px-3 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {listings.map((l) => {
                        const st = stats[l.id];
                        const conv = st && st.views30d > 0 ? st.bookings30d / st.views30d : null;
                        const capacity = st ? st.bookedNext30 + st.openNext30 : 0;
                        return (
                          <tr key={l.id} className={selected.has(l.id) ? "bg-primary/10" : "hover:bg-white/5"}>
                            <td className="px-4 py-3">
                              <Checkbox checked={selected.has(l.id)} onCheckedChange={() => toggle(l.id)} aria-label={`Select ${l.title}`} />
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-3">
                                {l.image
                                  ? <img src={l.image} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                                  : <div className="h-10 w-14 shrink-0 rounded-lg bg-white/10" />}
                                <div className="min-w-0">
                                  <p className="line-clamp-1 font-semibold text-white">{l.title}</p>
                                  <p className="text-xs capitalize text-white/50">{l.status.replace("_", " ")}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-right tabular-nums text-white">
                              {formatINR(l.basePrice)}
                              {l.weekendPrice && <span className="block text-xs text-white/50">Weekend {formatINR(l.weekendPrice)}</span>}
                            </td>
                            <td className="px-3 py-3 text-right tabular-nums text-white">{st?.views30d ?? 0}</td>
                            <td className="px-3 py-3 text-right tabular-nums text-white">
                              {st?.requests30d ?? 0}
                              {st && st.pending > 0 && <span className="block text-xs font-semibold text-amber-400">{st.pending} awaiting reply</span>}
                            </td>
                            <td className="px-3 py-3 text-right tabular-nums text-white">{st?.bookings30d ?? 0}</td>
                            <td className="px-3 py-3 text-right tabular-nums text-white">{pct(conv)}</td>
                            <td className="px-3 py-3 text-right tabular-nums text-white">
                              {capacity > 0 ? pct(st!.bookedNext30 / capacity) : "—"}
                              <span className="block text-xs text-white/50">{st?.openNext30 ?? 0} nights open</span>
                            </td>
                            <td className="px-3 py-3 text-right tabular-nums text-white">
                              {st?.customNext90 ?? 0}
                              <span className="block text-xs text-white/50">next 90 days</span>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 border border-white/20 text-xs text-white hover:bg-white/10 hover:text-white"
                                onClick={() => setWizardFor(l)}
                              >
                                <SlidersHorizontal className="h-3.5 w-3.5" /> Guided pricing
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-white/50">
                  Guided pricing compares one listing with similar stays nearby and walks you through weekday, weekend and monthly rates.
                </p>
              </section>

              {/* ── Bulk edit ── */}
              <section aria-labelledby="bulk-heading" className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
                <div>
                  <h2 id="bulk-heading" className="font-display text-xl font-bold text-white">Update prices</h2>
                  <p className="mt-1 text-sm text-white/60">
                    Applies to the {selected.size || "selected"} listing{selected.size === 1 ? "" : "s"} ticked above.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="bulk-from" className="text-xs text-white/70">From</Label>
                    <Input id="bulk-from" type="date" min={todayStr} value={from} onChange={(e) => setFrom(e.target.value)} className="border-white/20 bg-black/30 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bulk-to" className="text-xs text-white/70">To (last night)</Label>
                    <Input id="bulk-to" type="date" min={from || todayStr} value={to} onChange={(e) => setTo(e.target.value)} className="border-white/20 bg-black/30 text-white" />
                  </div>
                  <fieldset className="space-y-1.5">
                    <legend className="text-xs font-medium text-white/70">Nights</legend>
                    <Segmented
                      value={nightFilter}
                      onChange={(v) => setNightFilter(v as NightFilter)}
                      options={[["all", "All"], ["weekdays", "Sun–Thu"], ["weekends", "Fri & Sat"]]}
                    />
                  </fieldset>
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-xs font-medium text-white/70">Change</legend>
                  <Segmented
                    value={mode}
                    onChange={(v) => setMode(v as Mode)}
                    options={[["adjust", "Adjust by %"], ["set", "Set a price"], ["reset", "Reset to standard rate"]]}
                  />
                </fieldset>

                {mode === "adjust" && (
                  <div className="max-w-xs space-y-1.5">
                    <Label htmlFor="bulk-pct" className="text-xs text-white/70">Percentage change from each listing's standard rate</Label>
                    <div className="flex items-center gap-2">
                      <Input id="bulk-pct" type="number" inputMode="decimal" value={adjustPct} onChange={(e) => setAdjustPct(e.target.value)} className="border-white/20 bg-black/30 text-white" />
                      <span className="text-sm text-white/60">%</span>
                    </div>
                    <p className="text-xs text-white/50">Use a negative number to lower prices, e.g. -15.</p>
                  </div>
                )}
                {mode === "set" && (
                  <div className="max-w-xs space-y-1.5">
                    <Label htmlFor="bulk-price" className="text-xs text-white/70">Nightly price for every selected night</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/60">₹</span>
                      <Input id="bulk-price" type="number" inputMode="numeric" min={MIN_NIGHTLY} value={fixedPrice} onChange={(e) => setFixedPrice(e.target.value)} className="border-white/20 bg-black/30 text-white" />
                    </div>
                  </div>
                )}
                {mode === "reset" && (
                  <p className="text-sm text-white/60">Removes custom prices in this range so those nights go back to each listing's standard weekday or weekend rate.</p>
                )}

                {mode !== "reset" && (
                  <div className="flex items-center gap-2">
                    <Checkbox id="keep-custom" checked={keepCustom} onCheckedChange={(v) => setKeepCustom(v === true)} />
                    <Label htmlFor="keep-custom" className="text-sm text-white/80">Keep nights I've already priced individually</Label>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <p className={`text-sm ${issue ? "text-amber-400" : "text-white/70"}`}>
                    {issue ?? `${changeCount} night${changeCount === 1 ? "" : "s"} across ${selected.size} listing${selected.size === 1 ? "" : "s"} will change. Booked nights are skipped.`}
                  </p>
                  <Button onClick={apply} disabled={!!issue || saving} className="gap-2 bg-primary font-bold text-white hover:bg-primary/90">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {mode === "reset" ? "Reset prices" : "Apply prices"}
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>

        {wizardFor && (
          <AdvancedPricingWizard
            propertyId={wizardFor.id}
            basePrice={wizardFor.basePrice}
            weekendPrice={wizardFor.weekendPrice}
            selection={[]}
            existingOverrides={overrides[wizardFor.id] ?? {}}
            booked={booked[wizardFor.id] ?? new Set()}
            onClose={() => setWizardFor(null)}
            onApplied={() => { setWizardFor(null); load(); }}
          />
        )}
      </div>
    </SEO>
  );
}

function Stat({ icon: Icon, label, value, hint, urgent }: { icon: typeof Eye; label: string; value: string; hint?: string; urgent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${urgent ? "border-amber-400/40 bg-amber-400/10" : "border-white/10 bg-white/5"}`}>
      <Icon className={`h-4 w-4 ${urgent ? "text-amber-400" : "text-primary"}`} aria-hidden="true" />
      <p className="mt-3 font-display text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="text-xs font-medium text-white/70">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-white/45">{hint}</p>}
    </div>
  );
}

function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-white/15 bg-black/30 p-1">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={`min-h-[36px] rounded-lg px-3 text-sm font-semibold transition-colors ${value === v ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
