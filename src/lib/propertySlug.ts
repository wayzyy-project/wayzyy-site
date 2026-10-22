// Property URLs carry the place's name: /property/irida-luxurious-2bhk-villa-anjuna-<uuid>.
// The id stays at the end, so the page (and the app) can always find the listing
// from the URL, while the words give people and search engines something readable.
// Old id-only links keep working and are redirected to the named form.

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export const isUuid = (s: string): boolean => new RegExp(`^${UUID_RE.source}$`, "i").test(s);

export const slugify = (input: string): string =>
  input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/, "");

/** Canonical path for a listing. Falls back to the plain id when there is no usable name. */
export const propertyPath = (p: { id: string; title?: string | null; city?: string | null }): string => {
  if (!isUuid(p.id)) return `/property/${p.id}`; // demo / legacy ids stay as they are
  // Skip the city when the title already names it ("…, Rohini" + "Rohini").
  const cityWord = p.city && !String(p.title ?? "").toLowerCase().includes(String(p.city).toLowerCase()) ? p.city : null;
  const words = slugify([p.title, cityWord].filter(Boolean).join(" "));
  return `/property/${words ? `${words}-` : ""}${p.id}`;
};

/** The listing id from either URL form (the trailing UUID), or the raw value for legacy ids. */
export const extractPropertyId = (param: string): string => {
  const all = param.match(new RegExp(UUID_RE.source, "gi"));
  return all ? all[all.length - 1] : param;
};
