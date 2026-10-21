// space_type is stored as a short code from the listing import ("entire",
// "private", "shared") or, for older listings, as free text ("Entire villa").
// Turn it into the line guests see: "Entire place in Siolim".
const CODES: Record<string, string> = {
  entire: "Entire place",
  private: "Private room",
  shared: "Shared room",
};

export function spaceTypeLine(spaceType: string | null | undefined, city: string | null | undefined, fallbackCity = "Goa"): string {
  const raw = String(spaceType ?? "").trim();
  const label = CODES[raw.toLowerCase()] ?? (raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Entire place");
  return `${label} in ${city || fallbackCity}`;
}
