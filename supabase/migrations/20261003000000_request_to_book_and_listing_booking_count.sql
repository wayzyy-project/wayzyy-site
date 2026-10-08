-- Migration: request-to-book default and new-listing discount booking count
-- Created: 2026-10-03
--
-- Two closely-related changes that the new-listing discount requires:
--
--   1. instant_booking column on properties
--      The platform default is always request-to-book (host approves each
--      booking before it is confirmed). We have been operating that way in
--      practice, but the column did not exist in the schema, so any code
--      reading it got NULL (falsy) by accident rather than by design.
--      Adding the column with default false makes the intent explicit and
--      lets the host portal toggle actually persist the preference.
--
--   2. listing_completed_booking_count(property_uuid) function
--      The new-listing discount ("first 3 bookings" promotion) must stop
--      applying once a listing has 3 completed stays. The app's
--      create-booking function will call this to decide whether the
--      discount is still valid at checkout time, so the count must live
--      in the DB rather than in application code.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. instant_booking column
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.properties
  add column if not exists instant_booking boolean not null default false;

comment on column public.properties.instant_booking is
  'When true the booking is confirmed immediately without host approval. '
  'Default false (request-to-book) — hosts opt in explicitly.';

-- Backfill: every existing listing is request-to-book. The column default
-- already handles new rows; this makes existing ones consistent so a query
-- filtering on instant_booking = false returns all legacy listings.
update public.properties
set instant_booking = false
where instant_booking is null;

create index if not exists properties_instant_booking_idx
  on public.properties (instant_booking);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. completed booking count function
--    Returns the number of bookings for a given property_id whose status is
--    'completed'. The new-listing discount is valid while this count < 3.
--    Defined as SECURITY DEFINER so the edge function (which runs with the
--    service role key) can call it without needing explicit RLS bypass logic.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.listing_completed_booking_count(
  p_property_id uuid
)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.bookings
  where property_id = p_property_id
    and status = 'completed';
$$;

comment on function public.listing_completed_booking_count(uuid) is
  'Returns the number of completed bookings for a listing. '
  'Used to cap the new-listing discount at 3 completed stays.';

grant execute on function public.listing_completed_booking_count(uuid)
  to authenticated, service_role;
