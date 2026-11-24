// Checks a listing's calendar against the dates a guest searched, for the stays page.
// Pure, so it can be tested; the page fetches the calendar (property_unavailable_dates RPC)
// and date_rules, then calls these. The listing page and the server still re-check at booking.
import { stayRuleError, type StayRules } from "./stayRules";

export interface ListingCalendar {
  /** Booked / blocked nights, 'YYYY-MM-DD'. */
  unavailable: Set<string>;
  rules: StayRules;
  /** Multi-unit listings: a taken night means one unit is gone, so they are never "booked". */
  totalUnits: number;
}

export interface Stay { checkIn: string; checkOut: string }

export const addDays = (d: string, n: number): string => {
  const t = new Date(`${d}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
};
const nightsBetween = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
const istToday = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

export const BOOKED = "Booked for your dates";

/** Why this listing can't take the stay ("Booked for your dates" or the host's rule), or null when it is free. */
export function stayProblem(cal: ListingCalendar, checkIn: string, checkOut: string): string | null {
  const nights = nightsBetween(checkIn, checkOut);
  if (cal.totalUnits <= 1) {
    for (let i = 0; i < nights; i++) if (cal.unavailable.has(addDays(checkIn, i))) return BOOKED;
  }
  return stayRuleError(cal.rules, checkIn, checkOut, nights);
}

/**
 * The nearest free stay of the same length (stretched to the host's minimum for that check-in),
 * moving the check-in up to `maxShift` days earlier or later; on a tie the later one wins.
 * Never suggests a check-in before today. null when nothing within range is free.
 */
export function nearestFree(cal: ListingCalendar, checkIn: string, checkOut: string, maxShift = 42, today = istToday()): Stay | null {
  const nights = nightsBetween(checkIn, checkOut);
  for (let k = 1; k <= maxShift; k++) {
    for (const shift of [k, -k]) {
      const ci = addDays(checkIn, shift);
      if (ci < today) continue;
      const min = cal.rules.dateMinNights?.[ci] ?? cal.rules.minNights ?? 1;
      const co = addDays(ci, Math.max(nights, min));
      if (!stayProblem(cal, ci, co)) return { checkIn: ci, checkOut: co };
    }
  }
  return null;
}
