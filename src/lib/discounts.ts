// Mirrors mobile/src/utils/discounts.ts and wayzyy-app's
// supabase/functions/_shared/discounts.ts. create-booking re-runs the same
// selection and rejects any baseAmount more than 1% off its own figure - so
// the selection logic below must stay identical to the server's.
export type DiscountType = "weekly" | "monthly" | "last_minute" | "early_bird" | "new_listing";

export interface PropertyDiscount {
  discount_type: DiscountType;
  percentage: number;
  enabled: boolean;
}

export interface DiscountContext {
  nights: number;
  daysUntilCheckIn: number;
  pastBookingsCount: number;
}

export function computeBestDiscount(
  discounts: PropertyDiscount[],
  ctx: DiscountContext,
): { type: DiscountType; percentage: number } | null {
  const applicable: { type: DiscountType; percentage: number }[] = [];
  for (const d of discounts) {
    if (!d.enabled || !(d.percentage > 0)) continue;
    if (d.discount_type === "weekly" && ctx.nights >= 7) applicable.push({ type: "weekly", percentage: d.percentage });
    if (d.discount_type === "monthly" && ctx.nights >= 28) applicable.push({ type: "monthly", percentage: d.percentage });
    if (d.discount_type === "last_minute" && ctx.daysUntilCheckIn >= 0 && ctx.daysUntilCheckIn <= 14) applicable.push({ type: "last_minute", percentage: d.percentage });
    if (d.discount_type === "early_bird" && ctx.daysUntilCheckIn >= 30) applicable.push({ type: "early_bird", percentage: d.percentage });
    if (d.discount_type === "new_listing" && ctx.pastBookingsCount < 3) applicable.push({ type: "new_listing", percentage: d.percentage });
  }
  if (!applicable.length) return null;
  return applicable.reduce((best, cur) => (cur.percentage > best.percentage ? cur : best));
}

export const applyDiscount = (amount: number, percentage: number): number =>
  Math.round(amount * (1 - percentage / 100));

export const DISCOUNT_TYPES: DiscountType[] = ["weekly", "monthly", "last_minute", "early_bird", "new_listing"];

export const DISCOUNT_LABELS: Record<DiscountType, { label: string; sub: string }> = {
  weekly: { label: "Weekly", sub: "For 7 nights or more" },
  monthly: { label: "Monthly", sub: "For 28 nights or more" },
  last_minute: { label: "Last-minute", sub: "For stays booked 0–14 days before arrival" },
  early_bird: { label: "Early-bird", sub: "For stays booked 30+ days before arrival" },
  new_listing: { label: "New listing promotion", sub: "Applies to your first 3 bookings" },
};

// Suggested starting percentages, matching Airbnb's own defaults - shown as
// the pre-filled value when a host turns a discount on for the first time,
// not auto-enabled.
export const SUGGESTED_DISCOUNT_PERCENTAGE: Record<DiscountType, number> = {
  weekly: 10,
  monthly: 15,
  last_minute: 10,
  early_bird: 10,
  new_listing: 20,
};
