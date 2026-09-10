// Mirrors mobile/src/utils/hostDisplayName.ts - keep the two in sync. Single
// source of truth for turning a host's account into something presentable
// when they haven't set a display name yet, instead of showing a raw
// "priya.sharma91@gmail.com" local-part verbatim.

/** "priya.sharma91@gmail.com" -> "Priya Sharma". Best-effort placeholder for
 *  hosts who haven't filled in their name - not a replacement for asking
 *  them to set one. */
export const humanizeEmailLocalPart = (email: string): string => {
  const local = email.split("@")[0] ?? "";
  const withoutTrailingDigits = local.replace(/\d+$/, "");
  const parts = withoutTrailingDigits.split(/[._-]+/).filter(Boolean);
  if (parts.length === 0) return "Host";
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
};

/**
 * `profileName` should be `null`/`undefined` when nothing real is on file -
 * never pass a generic placeholder like "Host" in here, or every guest ends
 * up seeing that literal word instead of a name derived from the email.
 */
export const resolveHostDisplayName = (
  profileName: string | null | undefined,
  email: string | null | undefined,
): string => {
  const trimmed = profileName?.trim();
  if (trimmed && trimmed.toLowerCase() !== "host") return trimmed;
  if (email) return humanizeEmailLocalPart(email);
  return "Host";
};
