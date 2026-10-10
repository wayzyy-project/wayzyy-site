// Display-only port of supabase/functions/_shared/cancellation.ts (quoteRefund).
// cancel-booking recomputes the refund server-side and never trusts this - the
// website only previews it. Keep the numbers in sync with the server copy.

export type RefundLevel = "full" | "partial" | "none";

const FULL_PARTIAL_DAYS: Record<string, { full: number; partial: number }> = {
  Flexible: { full: 1, partial: 0 },
  Moderate: { full: 5, partial: 0 },
  Limited: { full: 14, partial: 7 },
  Firm: { full: 30, partial: 7 },
};

export const PARTIAL_REFUND_RATE = 0.5;
export const CASH_REFUND_GATEWAY_RATE = 0.02;
export const CASH_REFUND_GATEWAY_GST_RATE = 0.18;
export const CASH_REFUND_FIXED_CHARGE = 5;
export const GRACE_PERIOD_HOURS = 24;
export const GRACE_PERIOD_MIN_DAYS_TO_CHECK_IN = 7;

export const daysUntil = (checkIn: string, now: Date = new Date()): number =>
  Math.floor((new Date(checkIn + "T00:00:00Z").getTime() - now.getTime()) / 86400000);

export const hoursSince = (bookedAt: string, now: Date = new Date()): number =>
  Math.floor((now.getTime() - new Date(bookedAt).getTime()) / 3600000);

export interface RefundQuote {
  level: RefundLevel;
  withinGracePeriod: boolean;
  refundableAmount: number;
  creditAmount: number;
  cashAmount: number;
  processingCharge: number;
  percent: number;
}

export function quoteRefund(
  policyId: string | null | undefined,
  daysUntilCheckIn: number,
  totalPaid: number,
  hoursSinceBooking: number,
): RefundQuote {
  const p = FULL_PARTIAL_DAYS[policyId ?? ""] ?? FULL_PARTIAL_DAYS.Flexible;
  const grace =
    hoursSinceBooking >= 0 &&
    hoursSinceBooking <= GRACE_PERIOD_HOURS &&
    daysUntilCheckIn >= GRACE_PERIOD_MIN_DAYS_TO_CHECK_IN;
  let level: RefundLevel;
  if (grace || daysUntilCheckIn >= p.full) level = "full";
  else if (daysUntilCheckIn < 0) level = "none";
  else if (daysUntilCheckIn >= p.partial) level = "partial";
  else level = "none";

  const share = level === "full" ? 1 : level === "partial" ? PARTIAL_REFUND_RATE : 0;
  const refundableAmount = Math.round(Math.max(0, totalPaid) * share);
  const gatewayFee = refundableAmount * CASH_REFUND_GATEWAY_RATE;
  const processingCharge = Math.min(
    refundableAmount,
    Math.round(gatewayFee + gatewayFee * CASH_REFUND_GATEWAY_GST_RATE + CASH_REFUND_FIXED_CHARGE),
  );
  return {
    level,
    withinGracePeriod: grace,
    refundableAmount,
    creditAmount: refundableAmount,
    cashAmount: Math.max(0, refundableAmount - processingCharge),
    processingCharge,
    percent: Math.round(share * 100),
  };
}
