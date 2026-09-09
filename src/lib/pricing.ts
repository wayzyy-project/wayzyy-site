/**
 * Guest-facing pricing rules for the website.
 *
 * This is a port of `mobile/src/utils/pricing.ts` in the wayzyy-app repo,
 * which is itself mirrored by `supabase/functions/_shared/pricing.ts` (the
 * server-side authority used by create-booking). All three must agree: a
 * guest booking the same property for the same dates and party size has to
 * be quoted the same number on the website, in the app, and at capture.
 *
 * Before this existed the website did none of it - it quoted
 * `price_per_night * nights` flat, which silently dropped the 7% guest
 * service fee, every per-guest rule, and every host date override.
 */

/**
 * The guest service fee, folded into every price a guest sees - never
 * itemized, never shown as "was X, now Y". Hosts set and receive exactly
 * the rate they list; this margin exists only in what guests are charged.
 */
export const GUEST_MARKUP_RATE = 0.07;

export const toGuestPrice = (hostPrice: number): number =>
  Math.round(hostPrice * (1 + GUEST_MARKUP_RATE));

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
 * Host-facing total for a stay, summed night by night rather than
 * `rate * nights` - a stay can span both standard-priced and
 * host-overridden (`date_prices`) nights. `overrides` is keyed
 * 'YYYY-MM-DD' -> that night's host price.
 */
export function computeNightlyTotal(
  basePricePerNight: number,
  checkIn: string,
  checkOut: string,
  overrides: Record<string, number>,
): number {
  let total = 0;
  const end = parseLocalDate(checkOut);
  for (const d = parseLocalDate(checkIn); d < end; d.setDate(d.getDate() + 1)) {
    total += overrides[toDateStr(d)] ?? basePricePerNight;
  }
  return total;
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
}

export interface QuoteResult {
  /** Guest-facing accommodation total for the whole stay. */
  accommodation: number;
  /** Guest-facing average per night, for the "₹X for N nights" line. */
  perNight: number;
  taxes: number;
  total: number;
  /** True when guest count or date overrides moved the price off the base rate. */
  hasDynamicPricing: boolean;
}

/**
 * The full quote, composed in the same order as the app's BookingScreen and
 * the create-booking edge function:
 *   tiers (if any) -> else per-person rule -> per-night with date overrides
 *   -> guest markup -> GST.
 *
 * GST follows the app: 18% above a ₹7,500 host rate, otherwise 12%.
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

  const hostNightlyTotal = computeNightlyTotal(
    basePriceForGuests,
    toDateStr(checkIn),
    toDateStr(checkOut),
    dateOverrides,
  );

  const accommodation = toGuestPrice(hostNightlyTotal);
  const gstRate = hostPricePerNight > 7500 ? 0.18 : 0.12;
  const taxes = Math.round(accommodation * gstRate);

  return {
    accommodation,
    perNight: nights > 0 ? Math.round(accommodation / nights) : accommodation,
    taxes,
    total: accommodation + taxes,
    hasDynamicPricing:
      tiers.length > 0 || perPersonEnabled || Object.keys(dateOverrides).length > 0,
  };
}
