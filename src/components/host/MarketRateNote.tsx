import { useEffect, useState } from "react";
import { AlertTriangle, BadgeCheck, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface MarketRate {
  avg_nightly_rate: number | null;
  rate_basis: "last_90_days" | "last_12_months" | null;
}

// The rate a host's imported listing actually charged on the platform it came
// from - fetched once at import, stored, never shown to guests.
export function useMarketRates(propertyIds: string[]) {
  const [rates, setRates] = useState<Record<string, MarketRate>>({});
  const key = [...propertyIds].sort().join(",");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    supabase.functions.invoke("market-rates", { body: { propertyIds: key.split(",") } }).then(({ data }) => {
      if (!cancelled && data?.rates) setRates(data.rates);
    });
    return () => { cancelled = true; };
  }, [key]);

  return rates;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const basisLabel = (b: MarketRate["rate_basis"]) => (b === "last_12_months" ? "avg. over the last 12 months" : "avg. over the last 90 days");

export function NoMarkupBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />
        No markup for hosts: you keep 100% of your nightly rate
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        We don't take a cut from your price, so there's no need to add extra to cover fees. Use the same base price you charge on other booking platforms, or at most
        about 5% above it.
        {!compact && " Listings priced in line get more bookings and are the ones we feature in our marketing. A big jump above your usual rate makes guests less likely to book. You can fine-tune prices by date anytime once your listing is live."}
      </p>
    </div>
  );
}

/** Small "same property elsewhere" card. With `price`, it also compares the host's entered rate. */
export function MarketRateCard({ rate, price }: { rate: MarketRate | undefined; price?: number | null }) {
  if (!rate?.avg_nightly_rate) return null;
  const market = rate.avg_nightly_rate;
  const diff = price ? Math.round((price / market - 1) * 100) : null;

  return (
    <div className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">This property on other booking platforms</p>
      <p className="text-sm font-bold tabular-nums text-foreground">
        {inr(market)} <span className="text-xs font-normal text-muted-foreground">/ night · {basisLabel(rate.rate_basis)}</span>
      </p>
      {diff != null && diff > 15 && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Your price is {diff}% higher. Since we don't mark up your price, this will likely cost you bookings and keeps your listing out of our promotions.
        </p>
      )}
      {diff != null && diff > 5 && diff <= 15 && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Your price is {diff}% higher. Staying within about 5% keeps you competitive.
        </p>
      )}
      {diff != null && diff <= 5 && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {diff < -5 ? `Your price is ${Math.abs(diff)}% lower, which will stand out to guests.` : "Right in line with your usual rate."}
        </p>
      )}
    </div>
  );
}

/** One-line caution for a listing that's already priced well above its rate elsewhere. */
export function PriceCaution({ rate, price, className = "" }: { rate: MarketRate | undefined; price: number | null | undefined; className?: string }) {
  if (!rate?.avg_nightly_rate || !price) return null;
  const diff = Math.round((price / rate.avg_nightly_rate - 1) * 100);
  if (diff <= 15) return null;
  return (
    <p className={`flex items-start gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400 ${className}`}>
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        This property's price is {diff}% above your average rate on other booking platforms ({inr(rate.avg_nightly_rate)}). We don't mark up
        your price, so matching it will help you get booked.
      </span>
    </p>
  );
}
