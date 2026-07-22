// Mirrors mobile/src/utils/discounts.ts's label metadata (website only
// configures these, checkout/discount-selection math stays app-side since
// the website doesn't have a booking checkout flow).
export type DiscountType = "weekly" | "monthly" | "last_minute" | "early_bird" | "new_listing";

export const DISCOUNT_TYPES: DiscountType[] = ["weekly", "monthly", "last_minute", "early_bird", "new_listing"];

export const DISCOUNT_LABELS: Record<DiscountType, { label: string; sub: string }> = {
  weekly: { label: "Weekly", sub: "For 7 nights or more" },
  monthly: { label: "Monthly", sub: "For 28 nights or more" },
  last_minute: { label: "Last-minute", sub: "For stays booked 0–14 days before arrival" },
  early_bird: { label: "Early-bird", sub: "For stays booked 30+ days before arrival" },
  new_listing: { label: "New listing promotion", sub: "Applies to your first 3 bookings" },
};

// Suggested starting percentages, matching Airbnb's own defaults — shown as
// the pre-filled value when a host turns a discount on for the first time,
// not auto-enabled.
export const SUGGESTED_DISCOUNT_PERCENTAGE: Record<DiscountType, number> = {
  weekly: 10,
  monthly: 15,
  last_minute: 10,
  early_bird: 10,
  new_listing: 20,
};
