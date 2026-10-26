// GA4 ecommerce events for the guest booking funnel, sent through the Google
// tag (gtag.js, G-XK0N6WHWJ2) loaded in index.html. GTM sits beside it for ad
// tags only - a GA4 tag inside GTM would count these events twice.
//
// value is what the guest pays minus GST (stay + Wayzyy fee, after coupon and
// wallet credit). Never put guest details (name, email, phone, Aadhaar) here.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export interface TrackedStay {
  propertyId: string;
  title: string;
  category?: string;
  city?: string;
  nights: number;
  /** Pre-GST amount for the whole stay, in rupees. */
  value: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const toItem = (stay: TrackedStay) => ({
  item_id: stay.propertyId,
  item_name: stay.title,
  item_category: stay.category,
  item_category2: stay.city,
  // One "unit" is a night, so price × quantity adds back up to value.
  price: round2(stay.value / Math.max(1, stay.nights)),
  quantity: Math.max(1, stay.nights),
});

function send(event: string, params: Record<string, unknown>) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    // Analytics must never break booking.
  }
}

const base = (stay: TrackedStay) => ({
  currency: "INR",
  value: round2(stay.value),
  items: [toItem(stay)],
});

export const trackViewItem = (stay: TrackedStay) => send("view_item", base(stay));

export const trackBeginCheckout = (stay: TrackedStay) => send("begin_checkout", base(stay));

export const trackAddPaymentInfo = (stay: TrackedStay, paymentType: string, coupon?: string | null) =>
  send("add_payment_info", { ...base(stay), payment_type: paymentType, ...(coupon ? { coupon } : {}) });

export const trackPurchase = (
  stay: TrackedStay,
  opts: { transactionId: string; tax: number; coupon?: string | null; status: "confirmed" | "requested" },
) =>
  send("purchase", {
    ...base(stay),
    transaction_id: opts.transactionId,
    tax: round2(opts.tax),
    ...(opts.coupon ? { coupon: opts.coupon } : {}),
    // Request-to-book stays are paid up front but the host can still decline
    // (which refunds), so reports can split the two.
    booking_status: opts.status,
  });
