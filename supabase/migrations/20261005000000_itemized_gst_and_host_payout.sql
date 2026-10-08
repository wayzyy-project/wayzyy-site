-- Migration: itemized GST breakdown and host net payout columns on bookings
-- Created: 2026-10-05
--
-- The bookings table only stored total_price (guest-facing, inclusive of
-- markup + GST). Finance, the weekly host digest, and the payout screen all
-- need the individual components:
--
--   accommodation_total  — guest-facing nightly subtotal (host price × 1.07)
--   gst_rate             — the rate applied (0.12 below ₹7,500/night, 0.18 above)
--   gst_amount           — round(accommodation_total × gst_rate); shown as
--                          "Taxes & fees" on guest receipts
--   gst_liable_party     — 'host' for registered GST hosts, 'platform' for
--                          unregistered; determines who remits to the government
--   platform_fee         — the 7% guest markup retained by Wayzyy
--                          (accommodation_total - host_accommodation_total)
--   host_accommodation   — accommodation_total ÷ 1.07, i.e. what the host
--                          actually earns before any discount adjustment
--   host_net_payout      — what is wired to the host:
--                          host_accommodation minus any applicable discount
--                          (new-listing, early-bird, etc.) that Wayzyy
--                          co-funds, plus the Wayzyy platform fee to Wayzyy.
--                          Formula: host_accommodation × (1 - discount_pct)
--                          The column is nullable; null means the payout has
--                          not been finalised yet (booking is pending/upcoming).
--
-- All columns are nullable so that existing rows (which pre-date this
-- migration) remain valid without a full-table rewrite. New bookings written
-- by the create-booking edge function will populate all of them at insert time.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Add columns (all nullable for backward compatibility)
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.bookings
  add column if not exists accommodation_total  numeric(12,2),
  add column if not exists gst_rate             numeric(5,4),
  add column if not exists gst_amount           numeric(12,2),
  add column if not exists gst_liable_party     text,
  add column if not exists platform_fee         numeric(12,2),
  add column if not exists host_accommodation   numeric(12,2),
  add column if not exists host_net_payout      numeric(12,2);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Constraints
-- ─────────────────────────────────────────────────────────────────────────────

-- GST rate must be one of the two legal values or null (pre-migration rows).
alter table public.bookings
  add constraint bookings_gst_rate_check
  check (gst_rate is null or gst_rate in (0.12, 0.18));

-- Liable party vocabulary.
alter table public.bookings
  add constraint bookings_gst_liable_party_check
  check (gst_liable_party is null or gst_liable_party in ('host', 'platform'));

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Comments
-- ─────────────────────────────────────────────────────────────────────────────

comment on column public.bookings.accommodation_total is
  'Guest-facing nightly subtotal: host_price_per_night × 1.07 (guest markup) × nights.';

comment on column public.bookings.gst_rate is
  '0.12 when the host rate is ≤ ₹7,500/night; 0.18 above that. '
  'Mirrors the rule in pricing.ts and the create-booking edge function.';

comment on column public.bookings.gst_amount is
  'round(accommodation_total × gst_rate). Shown as "Taxes & fees" on guest receipts.';

comment on column public.bookings.gst_liable_party is
  'host: the host is GST-registered and remits directly to the government. '
  'platform: host is unregistered; Wayzyy remits on their behalf.';

comment on column public.bookings.platform_fee is
  'Wayzyy revenue on this booking: accommodation_total - host_accommodation. '
  'Equal to host_accommodation_total × 0.07 for the standard 7% guest markup.';

comment on column public.bookings.host_accommodation is
  'What the host earns for the accommodation before discounts: '
  'accommodation_total ÷ 1.07.';

comment on column public.bookings.host_net_payout is
  'Amount wired to the host after any Wayzyy-co-funded discount is deducted. '
  'Null until the booking is confirmed and payout is finalised.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Index — the weekly digest groups by payout date, so an index on
--    (host_net_payout IS NOT NULL, created_at) speeds that query up.
-- ─────────────────────────────────────────────────────────────────────────────

create index if not exists bookings_host_net_payout_idx
  on public.bookings (host_net_payout)
  where host_net_payout is not null;
