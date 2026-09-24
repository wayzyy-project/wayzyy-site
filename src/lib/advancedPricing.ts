// Advanced pricing plan -> per-night `date_prices` rows.
// Keep in sync with wayzyy-app/mobile/src/utils/advancedPricing.ts.

export type PeriodPart = "full" | "first_half" | "second_half" | "selection";

export interface PricingPlan {
  weekdayRate: number;
  weekendMode: "flat" | "percent";
  weekendRate: number;
  weekendPct: number;
  /** JS getDay() values of nights priced as weekend (5 = Fri night, 6 = Sat night). */
  weekendDays: number[];
  /** Keyed "YYYY-MM" -> percent change applied on top of the weekday/weekend rate. */
  monthlyPct: Record<string, number>;
}

export interface InsightStats { count: number; min: number; p25: number; median: number; p75: number; max: number }

export interface PricingInsights {
  property: { title: string; locality: string; bedrooms: number; basePrice: number | null; weekendPrice: number | null };
  period: { from: string; to: string; nights: number };
  wayzyy: { scope: string; stats: InsightStats | null; weekendPremiumPct: number | null; periodUpliftPct: number | null; periodOccupancy: number | null };
  airbnb: {
    market: { activeListings: number | null; avgDailyRate: number | null; medianDailyRate: number | null; avgOccupancy: number | null; asOfMonth: string | null } | null;
    seasonality: { month: number; adr: number; occupancy: number | null; pct: number }[] | null;
    comparables: {
      stats: InsightStats | null;
      avgOccupancy: number | null;
      avgRating: number | null;
      top: { name: string; bedrooms: number | null; rating: number | null; reviewCount: number; guestFavorite: boolean; rate: number; occupancy: number | null }[];
    };
  } | null;
  you: { periodOccupancy: number; bookedNights: number };
  position: { label: "below" | "within" | "above"; vsMedianPct: number; source: "airbnb" | "wayzyy" | null } | null;
  suggestions: {
    weekday: number | null;
    weekendPremiumPct: number;
    weekendPremiumSource: "wayzyy" | "default";
    monthlyPct: Record<string, number>;
    monthlySource: "airbnb" | "wayzyy" | null;
  };
}

export const MIN_NIGHTLY_RATE = 100;
export const DEFAULT_WEEKEND_DAYS = [5, 6];
export const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function monthKey(dateKey: string): string {
  return dateKey.slice(0, 7);
}

export function monthLabel(key: string, short = false): string {
  const [y, m] = key.split("-").map(Number);
  const name = MONTH_NAMES[m - 1];
  return short ? `${name.slice(0, 3)} ${String(y).slice(2)}` : `${name} ${y}`;
}

/** The next `count` months starting with the current one, as "YYYY-MM". */
export function upcomingMonths(count = 12, from = new Date()): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
    out.push(toDateKey(d).slice(0, 7));
  }
  return out;
}

/** Nights covered by the chosen months + part, excluding anything before today. */
export function datesForPeriod(months: string[], part: PeriodPart, selection: string[], today = toDateKey(new Date())): string[] {
  if (part === "selection") return [...selection].filter((d) => d >= today).sort();
  const out: string[] = [];
  for (const key of [...months].sort()) {
    const [y, m] = key.split("-").map(Number);
    const last = new Date(y, m, 0).getDate();
    const start = part === "second_half" ? 16 : 1;
    const end = part === "first_half" ? 15 : last;
    for (let day = start; day <= end; day++) {
      const k = `${key}-${String(day).padStart(2, "0")}`;
      if (k >= today) out.push(k);
    }
  }
  return out;
}

export function isWeekendNight(dateKey: string, weekendDays: number[]): boolean {
  return weekendDays.includes(new Date(`${dateKey}T00:00:00`).getDay());
}

export function weekendBaseRate(plan: PricingPlan): number {
  return plan.weekendMode === "flat" ? plan.weekendRate : plan.weekdayRate * (1 + plan.weekendPct / 100);
}

/** Rounded to the nearest ₹50 so generated rates look hand-set, never below the platform minimum. */
export function nightlyRate(dateKey: string, plan: PricingPlan): number {
  const base = isWeekendNight(dateKey, plan.weekendDays) ? weekendBaseRate(plan) : plan.weekdayRate;
  const pct = plan.monthlyPct[monthKey(dateKey)] ?? 0;
  return Math.max(MIN_NIGHTLY_RATE, Math.round((base * (1 + pct / 100)) / 50) * 50);
}

export interface MonthPreview {
  month: string;
  nights: number;
  weekdayRate: number | null;
  weekendRate: number | null;
  pct: number;
}

export function previewByMonth(dates: string[], plan: PricingPlan): MonthPreview[] {
  const byMonth = new Map<string, MonthPreview>();
  for (const d of dates) {
    const m = monthKey(d);
    const row = byMonth.get(m) ?? { month: m, nights: 0, weekdayRate: null, weekendRate: null, pct: plan.monthlyPct[m] ?? 0 };
    row.nights++;
    if (isWeekendNight(d, plan.weekendDays)) row.weekendRate = nightlyRate(d, plan);
    else row.weekdayRate = nightlyRate(d, plan);
    byMonth.set(m, row);
  }
  return [...byMonth.values()];
}

export function planIssues(plan: PricingPlan): string | null {
  if (!Number.isFinite(plan.weekdayRate) || plan.weekdayRate < MIN_NIGHTLY_RATE) return `Weekday rate must be ₹${MIN_NIGHTLY_RATE} or more.`;
  if (plan.weekendMode === "flat" && (!Number.isFinite(plan.weekendRate) || plan.weekendRate < MIN_NIGHTLY_RATE)) return `Weekend rate must be ₹${MIN_NIGHTLY_RATE} or more.`;
  if (plan.weekendMode === "percent" && (!Number.isFinite(plan.weekendPct) || plan.weekendPct < -50 || plan.weekendPct > 300)) return "Weekend change must be between -50% and +300%.";
  return null;
}

/** Suggested month-by-month changes from the insights, keyed to the given months. */
export function suggestedMonthlyPct(insights: PricingInsights | null, months: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  const byMonthOfYear = insights?.suggestions.monthlyPct ?? {};
  for (const key of months) {
    const moy = Number(key.slice(5, 7));
    const v = byMonthOfYear[String(moy)];
    if (typeof v === "number") out[key] = v;
  }
  return out;
}

export const formatINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const formatPct = (n: number) => `${n > 0 ? "+" : ""}${n}%`;
