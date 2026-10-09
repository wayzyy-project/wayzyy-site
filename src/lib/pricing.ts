/**
 * Guest-facing pricing rules for the website.
 *
 * This is a port of `mobile/src/utils/pricing.ts` in the wayzyy-app repo,
 * which is itself mirrored by `supabase/functions/_shared/pricing.ts` (the
 * server-side authority used by create-booking). All three must agree: a
 * guest booking the same property for the same dates and party size has to
 * be quoted the same number on the website, in the app, and at capture.
 *
 * Before this existed the website quoted `price_per_night * nights` flat,
 * dropping Wayzyy's fee, every per-guest rule, and every host date override.
 */

import { computeBestDiscount, type DiscountType, type PropertyDiscount } from "@/lib/discounts";

/**
 * What a guest pays for a stay:
 *   accommodation  - the host's nightly prices (after any discount, plus pet
 *                    fee) - exactly what the host earns
 *   stayGst        - GST on the accommodation, night by night (see below)
 *   serviceFee     - Wayzyy's fee, 7% of the accommodation, its own line
 *   serviceFeeGst  - 18% GST on that fee
 */
export const WAYZYY_FEE_RATE = 0.07;
export const SERVICE_FEE_GST_RATE = 0.18;

/**
 * The nightly price a guest sees: the host's price with Wayzyy's 7% fee already
 * included, so a card matches the stay subtotal at checkout (GST is added
 * there). Display only, booking maths always starts from the host's own price.
 */
export const guestNightlyPrice = (hostPrice: number): number =>
  Math.round(hostPrice * (1 + WAYZYY_FEE_RATE));

/** GST on accommodation by that night's charge: nothing up to ₹1,000, 5% up to ₹7,500, 18% above. */
export const stayGstRateFor = (nightlyCharge: number): number =>
  nightlyCharge <= 1000 ? 0 : nightlyCharge <= 7500 ? 0.05 : 0.18;

export interface StayCharges {
  accommodation: number;
  stayGst: number;
  serviceFee: number;
  serviceFeeGst: number;
  total: number;
}

/**
 * `nightlyPrices` is the host's price for each night (computeNightlyPrices).
 * A flat pet fee is spread across the nights so it's taxed at the same rate
 * as the nights it belongs to.
 */
export function computeStayCharges(
  nightlyPrices: number[],
  discountPercentage: number | null,
  petFee: number,
): StayCharges {
  const petShare = nightlyPrices.length > 0 ? petFee / nightlyPrices.length : 0;
  let accommodationExact = 0;
  let stayGstExact = 0;
  for (const price of nightlyPrices) {
    const night = (discountPercentage ? price * (1 - discountPercentage / 100) : price) + petShare;
    accommodationExact += night;
    stayGstExact += night * stayGstRateFor(night);
  }
  const accommodation = Math.round(accommodationExact);
  const stayGst = Math.round(stayGstExact);
  const serviceFee = Math.round(accommodation * WAYZYY_FEE_RATE);
  const serviceFeeGst = Math.round(serviceFee * SERVICE_FEE_GST_RATE);
  return { accommodation, stayGst, serviceFee, serviceFeeGst, total: accommodation + stayGst + serviceFee + serviceFeeGst };
}

/**
 * Format a Date as 'YYYY-MM-DD' from its LOCAL parts.
 *
 * Deliberately not `toISOString().slice(0,10)`: that converts to UTC first,
 * so any IST time before 05:30 reports the previous day and the stay gets
 * priced against the wrong night.
 */
export const toDateStr = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Parse 'YYYY-MM-DD' as local midnight, for the same reason as above. */
export const parseLocalDate = (s: string): Date => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/**
 * The host's price for each night of a stay - a stay can span both
 * standard-priced and host-overridden (`date_prices`) nights. `overrides`
 * is keyed 'YYYY-MM-DD' -> that night's host price.
 */
export function computeNightlyPrices(
  basePricePerNight: number,
  checkIn: string,
  checkOut: string,
  overrides: Record<string, number>,
): number[] {
  const prices: number[] = [];
  const end = parseLocalDate(checkOut);
  for (const d = parseLocalDate(checkIn); d < end; d.setDate(d.getDate() + 1)) {
    prices.push(overrides[toDateStr(d)] ?? basePricePerNight);
  }
  return prices;
}

export interface GuestPricingTier {
  minGuests: number;
  pricePerNight: number;
}

/**
 * Admin-curated per-property guest-count tiers
 * (`property_guest_pricing_tiers`). A handful of negotiated properties
 * charge a different nightly rate once party size crosses a threshold.
 * Properties with no rows here are completely unaffected.
 */
export function resolveBasePriceForGuests(
  basePricePerNight: number,
  guests: number,
  tiers: GuestPricingTier[],
): number {
  let best: GuestPricingTier | null = null;
  for (const t of tiers) {
    if (t.minGuests <= guests && (!best || t.minGuests > best.minGuests)) best = t;
  }
  return best ? best.pricePerNight : basePricePerNight;
}

/**
 * Host self-service per-person pricing: above `threshold` guests, each
 * additional guest adds a flat fee per night. Used only as a fallback when
 * the property has no explicit tier rows - the admin-curated path always
 * wins when present.
 */
export function applyPerPersonPricing(
  basePricePerNight: number,
  guests: number,
  threshold: number | null | undefined,
  feePerExtraGuest: number | null | undefined,
): number {
  if (threshold == null || feePerExtraGuest == null || guests <= threshold) return basePricePerNight;
  return basePricePerNight + feePerExtraGuest * (guests - threshold);
}

export interface PricingInputs {
  /** Raw host rate, BEFORE the guest markup. */
  hostPricePerNight: number;
  tiers: GuestPricingTier[];
  perPersonEnabled: boolean;
  extraGuestThreshold: number | null;
  extraGuestFee: number | null;
  /** 'YYYY-MM-DD' -> host price for that night. */
  dateOverrides: Record<string, number>;
  discounts: PropertyDiscount[];
  pastBookingsCount: number;
}

export interface QuoteResult extends StayCharges {
  /** Sum of the nightly prices before any discount, for the "₹X × N nights" line. */
  nightsSubtotal: number;
  /** Average undiscounted host price per night. */
  perNight: number;
  /** True when guest count or date overrides moved the price off the base rate. */
  hasDynamicPricing: boolean;
  /** The single best host discount applied, if any (never stacked). */
  discount: { type: DiscountType; percentage: number; savings: number } | null;
}

/**
 * The full quote, composed in the same order as the app's BookingScreen and
 * the create-booking edge function:
 *   tiers (if any) -> else per-person rule -> per-night with date overrides
 *   -> best single host discount -> stay GST night by night -> Wayzyy fee
 *   + GST on the fee.
 */
export function quoteStay(
  inputs: PricingInputs,
  guests: number,
  checkIn: Date,
  checkOut: Date,
  nights: number,
): QuoteResult {
  const { hostPricePerNight, tiers, perPersonEnabled, extraGuestThreshold, extraGuestFee, dateOverrides } = inputs;

  // Admin-curated tiers always win when present; otherwise fall back to the
  // host's own per-person toggle, if they enabled it.
  const basePriceForGuests =
    tiers.length > 0
      ? resolveBasePriceForGuests(hostPricePerNight, guests, tiers)
      : perPersonEnabled
        ? applyPerPersonPricing(hostPricePerNight, guests, extraGuestThreshold, extraGuestFee)
        : hostPricePerNight;

  const nightlyPrices = computeNightlyPrices(
    basePriceForGuests,
    toDateStr(checkIn),
    toDateStr(checkOut),
    dateOverrides,
  );
  const nightsSubtotal = nightlyPrices.reduce((sum, p) => sum + p, 0);

  // create-booking measures days-until-check-in from UTC midnight of the
  // check-in date; doing the same here keeps last-minute/early-bird from
  // flipping between client and server right at the 14/30-day boundary.
  const daysUntilCheckIn = Math.floor(
    (new Date(`${toDateStr(checkIn)}T00:00:00Z`).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const best = computeBestDiscount(inputs.discounts, {
    nights,
    daysUntilCheckIn,
    pastBookingsCount: inputs.pastBookingsCount,
  });

  // The website has no pet selection, so no pet fee.
  const charges = computeStayCharges(nightlyPrices, best?.percentage ?? null, 0);

  return {
    ...charges,
    nightsSubtotal,
    perNight: nights > 0 ? Math.round(nightsSubtotal / nights) : nightsSubtotal,
    hasDynamicPricing:
      tiers.length > 0 || perPersonEnabled || Object.keys(dateOverrides).length > 0,
    discount: best ? { ...best, savings: nightsSubtotal - charges.accommodation } : null,
  };
}
