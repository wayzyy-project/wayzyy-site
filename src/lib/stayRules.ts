// Optional host stay rules, mirroring supabase/functions/_shared/bookingQuote.ts
// (the server is the real enforcement; this is so guests see the rule before
// they pay). null / empty = no rule. Weekdays: 0 = Sunday ... 6 = Saturday.
export interface StayRules {
  minNights?: number | null;
  maxNights?: number | null;
  checkinDays?: number[] | null;
  checkoutDays?: number[] | null;
}

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Chips read Monday-first, like the calendar.
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const listDays = (days: number[]) => [...days].sort((a, b) => a - b).map((d) => DAY_NAMES[d]).join(", ");

/** Weekday of a 'YYYY-MM-DD' string, read at UTC midnight like the server. */
export const weekdayOf = (dateStr: string): number => new Date(`${dateStr}T00:00:00Z`).getUTCDay();

/** First rule a stay breaks, or null. Dates are 'YYYY-MM-DD'. */
export function stayRuleError(rules: StayRules, checkIn: string, checkOut: string, nights: number): string | null {
  const min = rules.minNights ?? 1;
  if (nights < min) return `This host requires at least ${min} night${min === 1 ? "" : "s"}.`;
  if (rules.maxNights != null && nights > rules.maxNights) {
    return `This host allows a maximum stay of ${rules.maxNights} night${rules.maxNights === 1 ? "" : "s"}.`;
  }
  if (rules.checkinDays?.length && !rules.checkinDays.includes(weekdayOf(checkIn))) {
    return `This host only allows check-in on ${listDays(rules.checkinDays)}.`;
  }
  if (rules.checkoutDays?.length && !rules.checkoutDays.includes(weekdayOf(checkOut))) {
    return `This host only allows check-out on ${listDays(rules.checkoutDays)}.`;
  }
  return null;
}

/** Short lines shown next to the date pickers. */
export function describeStayRules(rules: StayRules): string[] {
  const out: string[] = [];
  if ((rules.minNights ?? 1) > 1) out.push(`${rules.minNights}-night minimum stay`);
  if (rules.maxNights != null) out.push(`${rules.maxNights}-night maximum stay`);
  if (rules.checkinDays?.length) out.push(`Check-in: ${listDays(rules.checkinDays)} only`);
  if (rules.checkoutDays?.length) out.push(`Check-out: ${listDays(rules.checkoutDays)} only`);
  return out;
}
