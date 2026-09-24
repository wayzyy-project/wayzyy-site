import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Star, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_WEEKEND_DAYS,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  datesForPeriod,
  formatINR,
  formatPct,
  monthLabel,
  planIssues,
  previewByMonth,
  suggestedMonthlyPct,
  upcomingMonths,
  weekendBaseRate,
  nightlyRate,
  type PeriodPart,
  type PricingInsights,
  type PricingPlan,
} from "@/lib/advancedPricing";

interface Props {
  propertyId: string;
  basePrice: number | null;
  weekendPrice: number | null;
  selection: string[];
  existingOverrides: Record<string, number>;
  booked: Set<string>;
  onClose: () => void;
  onApplied: () => void;
}

const STEPS = ["Market insights", "Dates", "Weekday & weekend", "Monthly changes", "Review"] as const;
const PARTS: { id: PeriodPart; label: string; hint: string }[] = [
  { id: "full", label: "Full month", hint: "Every night" },
  { id: "first_half", label: "First half", hint: "1st–15th" },
  { id: "second_half", label: "Second half", hint: "16th–end" },
  { id: "selection", label: "Calendar selection", hint: "Dates you picked" },
];
const pctLabel = (f: number | null | undefined) => (f == null ? "—" : `${Math.round(f * 100)}%`);

export function AdvancedPricingWizard({ propertyId, basePrice, weekendPrice, selection, existingOverrides, booked, onClose, onApplied }: Props) {
  const { toast } = useToast();
  const months = useMemo(() => upcomingMonths(12), []);
  const [step, setStep] = useState(0);
  const [insights, setInsights] = useState<PricingInsights | null>(null);
  const [insightsState, setInsightsState] = useState<"loading" | "ready" | "error">("loading");

  const [chosenMonths, setChosenMonths] = useState<string[]>(() => (selection.length ? [] : [months[0]]));
  const [part, setPart] = useState<PeriodPart>(selection.length ? "selection" : "full");
  const [plan, setPlan] = useState<PricingPlan>(() => {
    const weekday = basePrice ?? 0;
    const hasWeekend = weekendPrice != null && weekendPrice > 0;
    return {
      weekdayRate: weekday,
      weekendMode: hasWeekend ? "flat" : "percent",
      weekendRate: hasWeekend ? weekendPrice! : weekday,
      weekendPct: 20,
      weekendDays: DEFAULT_WEEKEND_DAYS,
      monthlyPct: {},
    };
  });
  const [keepCustom, setKeepCustom] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadInsights = async (from?: string, to?: string) => {
    setInsightsState((s) => (s === "ready" ? s : "loading"));
    const { data, error } = await supabase.functions.invoke("pricing-insights", { body: { propertyId, from, to } });
    if (error || !data || (data as any).error) {
      setInsightsState((s) => (s === "ready" ? s : "error"));
      return;
    }
    setInsights(data as PricingInsights);
    setInsightsState("ready");
  };

  useEffect(() => { loadInsights(); }, [propertyId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const periodDates = useMemo(() => datesForPeriod(chosenMonths, part, selection), [chosenMonths, part, selection]);
  const targetDates = useMemo(
    () => periodDates.filter((d) => !booked.has(d) && !(keepCustom && existingOverrides[d] != null)),
    [periodDates, booked, keepCustom, existingOverrides],
  );
  const periodMonths = useMemo(() => [...new Set(periodDates.map((d) => d.slice(0, 7)))], [periodDates]);
  const preview = useMemo(() => previewByMonth(targetDates, plan), [targetDates, plan]);
  const issue = planIssues(plan);

  const applySuggestions = () => {
    if (!insights) return;
    setPlan((p) => ({
      ...p,
      weekdayRate: insights.suggestions.weekday ?? p.weekdayRate,
      weekendMode: "percent",
      weekendPct: insights.suggestions.weekendPremiumPct,
      monthlyPct: { ...p.monthlyPct, ...suggestedMonthlyPct(insights, months) },
    }));
    toast({ title: "Market suggestions filled in", description: "Review each step before applying." });
    setStep(1);
  };

  const next = () => {
    if (step === 1 && periodDates.length) loadInsights(periodDates[0], periodDates[periodDates.length - 1]);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const canContinue =
    step === 1 ? periodDates.length > 0
    : step === 2 ? !issue
    : true;

  const apply = async () => {
    if (issue || !targetDates.length) return;
    setSaving(true);
    const rows = targetDates.map((date) => ({ property_id: propertyId, date, price: nightlyRate(date, plan) }));
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await supabase.from("date_prices").upsert(rows.slice(i, i + 500), { onConflict: "property_id,date" });
      if (error) {
        setSaving(false);
        toast({ title: "Couldn't save pricing", description: error.message, variant: "destructive" });
        return;
      }
    }
    setSaving(false);
    toast({ title: `${rows.length} nights priced`, description: "Your calendar has been updated." });
    onApplied();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Advanced pricing">
      <div className="liquid-glass flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-3xl border border-white/15 bg-black/80 sm:rounded-3xl">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ember">Advanced pricing · Step {step + 1} of {STEPS.length}</p>
            <h2 className="mt-1 font-display text-lg font-bold text-white">{STEPS[step]}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex gap-1 px-5 pt-3">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-ember" : "bg-white/10"}`} />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {step === 0 && <InsightsStep insights={insights} state={insightsState} basePrice={basePrice} onUse={applySuggestions} />}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-white">Which part of the month?</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PARTS.map((p) => {
                    const disabled = p.id === "selection" && !selection.length;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setPart(p.id)}
                        className={`rounded-xl border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${part === p.id ? "border-ember bg-ember/15" : "border-white/15 hover:border-white/30"}`}
                      >
                        <span className="block text-sm font-semibold text-white">{p.label}</span>
                        <span className="block text-[11px] text-white/50">{p.hint}</span>
                      </button>
                    );
                  })}
                </div>
                {!selection.length && <p className="mt-2 text-[11px] text-white/40">To price specific dates, close this and select them on the calendar first.</p>}
              </div>

              {part !== "selection" && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-white">Which months? <span className="font-normal text-white/50">Pick as many as you like</span></p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {months.map((m) => {
                      const on = chosenMonths.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setChosenMonths((prev) => (on ? prev.filter((x) => x !== m) : [...prev, m]))}
                          className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${on ? "border-ember bg-ember/15 text-white" : "border-white/15 text-white/70 hover:border-white/30"}`}
                        >
                          {monthLabel(m, true)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/70">
                {periodDates.length ? `${periodDates.length} nights in this period.` : "Pick at least one month."}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="ap-weekday" className="text-sm font-semibold text-white">Weekday rate</label>
                <p className="text-[11px] text-white/50">Your base nightly price. Your current standard rate is {basePrice ? formatINR(basePrice) : "not set"}.</p>
                <Input id="ap-weekday" type="number" inputMode="numeric" value={plan.weekdayRate || ""} onChange={(e) => setPlan({ ...plan, weekdayRate: Number(e.target.value) })} className="mt-2 max-w-xs text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">Weekend rate</p>
                <div className="mt-2 inline-flex rounded-lg border border-white/15 p-0.5 text-xs">
                  {(["percent", "flat"] as const).map((mode) => (
                    <button key={mode} type="button" onClick={() => setPlan({ ...plan, weekendMode: mode })} className={`rounded-md px-3 py-1.5 font-medium ${plan.weekendMode === mode ? "bg-ember text-white" : "text-white/60"}`}>
                      {mode === "percent" ? "% above weekday" : "Fixed amount"}
                    </button>
                  ))}
                </div>
                {plan.weekendMode === "percent" ? (
                  <div className="mt-2 flex items-center gap-2">
                    <Input type="number" value={plan.weekendPct} onChange={(e) => setPlan({ ...plan, weekendPct: Number(e.target.value) })} className="max-w-[120px] text-sm" aria-label="Weekend percent change" />
                    <span className="text-xs text-white/60">% → {formatINR(weekendBaseRate(plan))} a night</span>
                  </div>
                ) : (
                  <Input type="number" value={plan.weekendRate || ""} onChange={(e) => setPlan({ ...plan, weekendRate: Number(e.target.value) })} className="mt-2 max-w-xs text-sm" aria-label="Weekend rate" />
                )}
                {insights && (
                  <p className="mt-2 text-[11px] text-white/50">
                    {insights.suggestions.weekendPremiumSource === "wayzyy"
                      ? `Similar Wayzyy stays charge about ${formatPct(insights.suggestions.weekendPremiumPct)} on weekends.`
                      : "Most Goa hosts charge 15–25% more on weekends."}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">Which nights count as weekend?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[5, 6, 0].map((d) => {
                    const on = plan.weekendDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setPlan({ ...plan, weekendDays: on ? plan.weekendDays.filter((x) => x !== d) : [...plan.weekendDays, d] })}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${on ? "border-ember bg-ember/15 text-white" : "border-white/15 text-white/60"}`}
                      >
                        {WEEKDAY_NAMES[d]} night
                      </button>
                    );
                  })}
                </div>
              </div>
              {issue && <p className="text-xs text-red-300">{issue}</p>}
            </div>
          )}

          {step === 3 && (
            <MonthlyStep
              months={periodMonths}
              plan={plan}
              setPlan={setPlan}
              insights={insights}
            />
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-white/50">
                    <tr><th className="px-3 py-2 font-medium">Month</th><th className="px-3 py-2 font-medium">Change</th><th className="px-3 py-2 font-medium">Weekday</th><th className="px-3 py-2 font-medium">Weekend</th><th className="px-3 py-2 text-right font-medium">Nights</th></tr>
                  </thead>
                  <tbody className="tabular-nums text-white">
                    {preview.map((r) => (
                      <tr key={r.month} className="border-t border-white/10">
                        <td className="px-3 py-2">{monthLabel(r.month)}</td>
                        <td className="px-3 py-2 text-white/70">{formatPct(r.pct)}</td>
                        <td className="px-3 py-2">{r.weekdayRate ? formatINR(r.weekdayRate) : "—"}</td>
                        <td className="px-3 py-2">{r.weekendRate ? formatINR(r.weekendRate) : "—"}</td>
                        <td className="px-3 py-2 text-right">{r.nights}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <label className="flex cursor-pointer items-start gap-2 text-xs text-white/70">
                <input type="checkbox" checked={keepCustom} onChange={(e) => setKeepCustom(e.target.checked)} className="mt-0.5 accent-[#ff6b00]" />
                Keep nights I've already priced by hand
              </label>
              <p className="text-[11px] text-white/50">
                {targetDates.length} nights will be updated. Booked nights are skipped, and guests who already booked keep their price. Your discounts still apply on top of these rates.
              </p>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-white/10 p-4">
          <Button variant="outline" onClick={() => (step === 0 ? onClose() : setStep(step - 1))} className="gap-1.5 border-white/20 text-white hover:bg-white/10">
            {step === 0 ? "Cancel" : <><ArrowLeft className="h-4 w-4" /> Back</>}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} disabled={!canContinue} className="gap-1.5 bg-ember text-white hover:bg-ember/90">
              {step === 0 ? "Set up pricing" : "Next"} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={apply} disabled={saving || !!issue || !targetDates.length} className="gap-1.5 bg-ember text-white hover:bg-ember/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Apply to {targetDates.length} nights
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}

function RangeBar({ min, max, p25, p75, median, you }: { min: number; max: number; p25: number; p75: number; median: number; you: number | null }) {
  const lo = Math.min(min, you ?? min);
  const hi = Math.max(max, you ?? max);
  const at = (v: number) => `${((v - lo) / Math.max(1, hi - lo)) * 100}%`;
  return (
    <div className="relative mt-6 h-2 rounded-full bg-white/10" aria-hidden="true">
      <div className="absolute h-2 rounded-full bg-white/30" style={{ left: at(p25), width: `calc(${at(p75)} - ${at(p25)})` }} />
      <div className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-white" style={{ left: at(median) }} />
      {you != null && (
        <div className="absolute -top-6 -translate-x-1/2 text-center" style={{ left: at(you) }}>
          <span className="rounded bg-ember px-1.5 py-0.5 text-[10px] font-semibold text-white">You</span>
          <div className="mx-auto mt-0.5 h-3 w-3 rounded-full border-2 border-black bg-ember" />
        </div>
      )}
    </div>
  );
}

function InsightsStep({ insights, state, basePrice, onUse }: { insights: PricingInsights | null; state: "loading" | "ready" | "error"; basePrice: number | null; onUse: () => void }) {
  if (state === "loading") {
    return <div className="flex flex-col items-center gap-2 py-16 text-xs text-white/50"><Loader2 className="h-5 w-5 animate-spin" /> Comparing you with similar stays…</div>;
  }
  if (state === "error" || !insights) {
    return <p className="rounded-xl bg-white/5 p-4 text-sm text-white/70">Market data isn't available right now. You can still set up your pricing with "Set up pricing".</p>;
  }

  const ref = insights.position?.source === "airbnb" ? insights.airbnb?.comparables.stats : insights.wayzyy.stats;
  const refName = insights.position?.source === "airbnb" ? "Airbnb" : "Wayzyy";
  const air = insights.airbnb;
  const season = air?.seasonality ?? null;
  const maxAbs = season ? Math.max(10, ...season.map((s) => Math.abs(s.pct))) : 10;

  return (
    <div className="space-y-4">
      {ref && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-white/50">Similar {insights.property.bedrooms}-bedroom stays in {insights.property.locality} on {refName}</p>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-white">{formatINR(ref.p25)} – {formatINR(ref.p75)}</p>
          <p className="text-xs text-white/60">Typical nightly range · median {formatINR(ref.median)} · {ref.count} listings</p>
          <RangeBar {...ref} you={basePrice} />
          {insights.position && (
            <p className="mt-3 text-sm text-white">
              {insights.position.label === "below" && <>Your rate is <strong>{Math.abs(insights.position.vsMedianPct)}% below</strong> the median. There may be room to raise it.</>}
              {insights.position.label === "within" && <>Your rate is <strong>within the typical range</strong> ({formatPct(insights.position.vsMedianPct)} vs median).</>}
              {insights.position.label === "above" && <>Your rate is <strong>{insights.position.vsMedianPct}% above</strong> the median. Strong photos and reviews help justify it.</>}
            </p>
          )}
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={`Airbnb occupancy, ${insights.property.locality}`} value={pctLabel(air?.comparables.avgOccupancy ?? air?.market?.avgOccupancy)} hint="Similar listings, last 12 months" />
        <Stat label="Nearby Wayzyy hosts booked" value={pctLabel(insights.wayzyy.periodOccupancy)} hint={`Next ${insights.period.nights} nights`} />
        <Stat label="Your calendar booked" value={pctLabel(insights.you.periodOccupancy)} hint={`${insights.you.bookedNights} of ${insights.period.nights} nights`} />
      </div>

      {insights.wayzyy.periodUpliftPct != null && (
        <p className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/70">
          Hosts near you have set custom rates {formatPct(insights.wayzyy.periodUpliftPct)} vs their standard price for these dates.
        </p>
      )}

      {season && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-white">Seasonal demand in {insights.property.locality}</p>
          <p className="text-[11px] text-white/50">Airbnb average nightly rate each month vs the yearly average</p>
          <div className="mt-3 overflow-x-auto">
            <div className="flex h-28 min-w-[420px] items-center gap-1">
              {season.map((s) => (
                <div key={s.month} className="flex h-full flex-1 flex-col items-center" title={`${MONTH_NAMES[s.month - 1]}: ${formatPct(s.pct)} (avg ${formatINR(s.adr)})`}>
                  <div className="flex h-1/2 w-full items-end justify-center">
                    {s.pct > 0 && <div className="w-3/4 rounded-t bg-ember" style={{ height: `${(s.pct / maxAbs) * 100}%` }} />}
                  </div>
                  <div className="h-px w-full bg-white/20" />
                  <div className="flex h-1/2 w-full items-start justify-center">
                    {s.pct < 0 && <div className="w-3/4 rounded-b bg-white/30" style={{ height: `${(-s.pct / maxAbs) * 100}%` }} />}
                  </div>
                  <span className="mt-1 text-[9px] text-white/50">{MONTH_NAMES[s.month - 1].slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {air?.comparables.top?.length ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-white">Popular Airbnb stays like yours</p>
          <ul className="mt-2 divide-y divide-white/10">
            {air.comparables.top.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2 text-xs">
                <span className="min-w-0 truncate text-white/80">{c.name}</span>
                <span className="flex shrink-0 items-center gap-3 tabular-nums text-white/60">
                  {c.rating != null && <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-current" /> {c.rating.toFixed(2)} ({c.reviewCount})</span>}
                  <span className="font-semibold text-white">{formatINR(c.rate)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <button type="button" onClick={onUse} className="flex w-full items-center justify-center gap-2 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ember/20">
        <Sparkles className="h-4 w-4 text-ember" /> Start from market suggestions
      </button>
      <p className="text-center text-[11px] text-white/40">Suggestions only. You'll review every number before anything changes.</p>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] text-white/50">{label}</p>
      <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-white">{value}</p>
      <p className="text-[10px] text-white/40">{hint}</p>
    </div>
  );
}

function MonthlyStep({ months, plan, setPlan, insights }: { months: string[]; plan: PricingPlan; setPlan: (p: PricingPlan) => void; insights: PricingInsights | null }) {
  const suggested = suggestedMonthlyPct(insights, months);
  const hasSuggestions = Object.keys(suggested).length > 0;
  const setPct = (m: string, v: number) => setPlan({ ...plan, monthlyPct: { ...plan.monthlyPct, [m]: Math.max(-50, Math.min(300, v)) } });

  return (
    <div className="space-y-4">
      <p className="text-xs text-white/60">Raise or lower each month on top of your weekday and weekend rates. Use 0% to keep them as they are.</p>
      {hasSuggestions && (
        <button type="button" onClick={() => setPlan({ ...plan, monthlyPct: { ...plan.monthlyPct, ...suggested } })} className="flex items-center gap-1.5 text-xs font-semibold text-ember hover:underline">
          <Sparkles className="h-3.5 w-3.5" /> Use the {insights?.suggestions.monthlySource === "airbnb" ? "Airbnb" : "nearby hosts'"} seasonal pattern
        </button>
      )}
      <ul className="space-y-2">
        {months.map((m) => {
          const pct = plan.monthlyPct[m] ?? 0;
          const probe = `${m}-10`;
          return (
            <li key={m} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5">
              <span className="w-28 text-sm font-medium text-white">{monthLabel(m)}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPct(m, pct - 5)} className="h-7 w-7 rounded-md border border-white/15 text-white/70 hover:bg-white/10" aria-label={`Lower ${monthLabel(m)} by 5%`}>−</button>
                <Input type="number" value={pct} onChange={(e) => setPct(m, Number(e.target.value))} className="h-7 w-16 text-center text-xs" aria-label={`${monthLabel(m)} percent change`} />
                <button type="button" onClick={() => setPct(m, pct + 5)} className="h-7 w-7 rounded-md border border-white/15 text-white/70 hover:bg-white/10" aria-label={`Raise ${monthLabel(m)} by 5%`}>+</button>
                <span className="text-xs text-white/50">%</span>
              </div>
              <span className="ml-auto text-[11px] tabular-nums text-white/60">
                {formatINR(nightlyRate(probe, { ...plan, weekendDays: [] }))} weekday · {formatINR(nightlyRate(probe, { ...plan, weekendDays: [0, 1, 2, 3, 4, 5, 6] }))} weekend
              </span>
              {suggested[m] != null && suggested[m] !== pct && (
                <span className="w-full text-[10px] text-white/40">Market suggests {formatPct(suggested[m])}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
