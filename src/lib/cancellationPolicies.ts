// Mirrors mobile/src/utils/cancellationPolicies.ts - keep both in sync.
export type ShortTermPolicyId = "Flexible" | "Moderate" | "Limited" | "Firm";
export type LongTermPolicyId = "Moderate" | "Limited" | "Firm";

export const LONG_TERM_NIGHTS_THRESHOLD = 28;

/**
 * What every listing starts on until the host picks something else.
 * These are written at import/creation time, so a host opening the
 * cancellation tab for the first time sees them already selected without
 * ever having chosen them - the UI labels them as ours for that reason.
 */
export const DEFAULT_SHORT_TERM_POLICY: ShortTermPolicyId = "Flexible";
export const DEFAULT_LONG_TERM_POLICY: LongTermPolicyId = "Firm";

interface ShortTermPolicyDef {
  id: ShortTermPolicyId;
  label: string;
  rules: string[];
}

export const SHORT_TERM_POLICIES: ShortTermPolicyDef[] = [
  { id: "Flexible", label: "Flexible", rules: ["Full refund at least 1 day before check-in", "Partial refund within 1 day of check-in"] },
  { id: "Moderate", label: "Moderate", rules: ["Full refund at least 5 days before check-in", "Partial refund within 5 days of check-in"] },
  { id: "Limited", label: "Limited", rules: ["Full refund at least 14 days before check-in", "Partial refund 7–14 days before check-in"] },
  { id: "Firm", label: "Firm", rules: ["Full refund at least 30 days before check-in", "Partial refund 7–30 days before check-in"] },
];

interface LongTermPolicyDef {
  id: LongTermPolicyId;
  label: string;
  rules: string[];
}

export const LONG_TERM_POLICIES: LongTermPolicyDef[] = [
  {
    id: "Moderate", label: "Moderate Long-Term",
    rules: [
      "Full refund if cancelled within 48 hours of booking (and at least 28 days before check-in)",
      "After that, the guest is refunded for unused nights, minus a 30-day notice period",
    ],
  },
  {
    id: "Limited", label: "Limited Long-Term",
    rules: [
      "Full refund if cancelled within 48 hours of booking (and at least 28 days before check-in)",
      "After that, non-refundable",
    ],
  },
  {
    id: "Firm", label: "Firm Long-Term",
    rules: [
      "Full refund if cancelled within 48 hours of booking (and at least 30 days before check-in)",
      "After that, non-refundable",
    ],
  },
];
