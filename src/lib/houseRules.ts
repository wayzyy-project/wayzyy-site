/**
 * House rules and safety details a guest sees on a listing, and the options a
 * host picks them from. Mirrors `mobile/src/utils/houseRules.ts` in the
 * wayzyy-app repo so the website and the app show and save the same values.
 */

/** Stored in properties.safety_amenities. Ids match what app onboarding has always saved. */
export const SAFETY_ITEMS = [
  { id: "Smoke Alarm", label: "Smoke alarm", match: ["smoke"] },
  { id: "CO Alarm", label: "Carbon monoxide alarm", match: ["carbon", "co alarm"] },
  { id: "Fire Extinguisher", label: "Fire extinguisher", match: ["extinguisher"] },
  { id: "First Aid", label: "First aid kit", match: ["first aid"] },
] as const;

export type SafetyItemId = (typeof SAFETY_ITEMS)[number]["id"];

/** Older and imported listings spell these differently ("Smoke alarm", "First aid kit"), so match loosely. */
export const hasSafetyItem = (amenities: string[], match: readonly string[]): boolean =>
  match.some((m) => amenities.some((a) => a.toLowerCase().includes(m)));

export const CHECK_IN_TIMES = [
  "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM",
] as const;
export const CHECK_OUT_TIMES = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
] as const;

/**
 * Times are stored either as "3:00 PM" (app editor) or "14:00" (imports and
 * the column default). Shows both the same way, so the host's picker can find
 * the saved value and guests never see a 24-hour time next to a 12-hour one.
 */
export function displayTime(value: string | null | undefined, fallback: string): string {
  const raw = (value ?? "").trim();
  if (!raw) return fallback;
  const twelve = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?$/i);
  if (twelve) {
    return `${Number(twelve[1])}:${twelve[2] ?? "00"} ${twelve[3].toUpperCase()}M`;
  }
  const twentyFour = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFour) {
    const h = Number(twentyFour[1]);
    if (h > 23) return raw;
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${twentyFour[2]} ${suffix}`;
  }
  return raw;
}

/** Everything the listing page's House rules and Safety sections show. */
export interface ListingRules {
  checkIn: string;
  checkOut: string;
  maxGuests: number;
  selfCheckIn: boolean;
  pets: boolean | null;
  smoking: boolean | null;
  parties: boolean | null;
  commercialPhotography: boolean | null;
  additional: string[];
  safetyAmenities: string[];
  securityCameras: boolean | null;
  hasEmergencyContact: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rulesFromRow(row: any): ListingRules {
  return {
    checkIn: displayTime(row.check_in_time, "2:00 PM"),
    checkOut: displayTime(row.check_out_time, "11:00 AM"),
    maxGuests: Number(row.max_guests) || 1,
    selfCheckIn: row.self_check_in === true,
    pets: row.pets_allowed ?? null,
    smoking: row.smoking_allowed ?? null,
    parties: row.parties_allowed ?? null,
    commercialPhotography: row.commercial_photography_allowed ?? null,
    additional: Array.isArray(row.house_rules_additional)
      ? row.house_rules_additional.map((r: unknown) => String(r).trim()).filter(Boolean)
      : [],
    safetyAmenities: Array.isArray(row.safety_amenities) ? row.safety_amenities.map(String) : [],
    securityCameras: row.has_security_cameras ?? null,
    hasEmergencyContact: Boolean(String(row.emergency_contact_phone ?? "").trim()),
  };
}
