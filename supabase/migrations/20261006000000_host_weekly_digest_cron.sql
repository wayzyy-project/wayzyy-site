-- Migration: weekly host digest email cron job
-- Created: 2026-10-06
--
-- Schedules a Supabase Edge Function (host-weekly-digest) to run every
-- Monday at 09:00 IST (03:30 UTC).
--
-- The digest email is sent to every active host whose listings have had
-- at least one booking activity (new bookings, upcoming check-ins,
-- completed stays, or pending payouts) in the previous 7 days.
--
-- Prerequisites
--   • The pg_cron extension must be enabled on the project (Dashboard →
--     Database → Extensions → pg_cron). It is enabled by default on all
--     Supabase Pro+ projects.
--   • The Edge Function `host-weekly-digest` must be deployed before or
--     alongside this migration. The cron job silently no-ops if the
--     function does not exist yet, so the migration is safe to run first.
--
-- Schedule logic
--   Cron expression  : 30 3 * * 1
--   UTC time         : Monday 03:30
--   IST equivalent   : Monday 09:00 (UTC+5:30)
--   Chosen because   : most Indian hosts check email mid-morning; avoiding
--                      the 09:00 IST slot on other weekdays keeps the
--                      digest day distinct.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Enable pg_cron if not already enabled
--    (idempotent; safe to run even when the extension exists)
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists pg_cron with schema extensions;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Grant pg_cron usage to postgres role (required on some Supabase versions)
-- ─────────────────────────────────────────────────────────────────────────────

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Remove any existing version of this job before (re)creating it so the
--    migration is idempotent and can be run again safely after a rename.
-- ─────────────────────────────────────────────────────────────────────────────

select cron.unschedule('host-weekly-digest')
where exists (
  select 1 from cron.job where jobname = 'host-weekly-digest'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Schedule the job
--    The Edge Function is invoked via a net.http_post call (pg_net) which is
--    the Supabase-recommended pattern for cron → Edge Function triggering.
--    Replace <PROJECT_REF> with the actual project ref at deploy time, or
--    use the vault/secrets approach documented in SUPABASE_DEPLOY.md.
-- ─────────────────────────────────────────────────────────────────────────────

select cron.schedule(
  'host-weekly-digest',          -- job name (unique)
  '30 3 * * 1',                  -- every Monday at 03:30 UTC = 09:00 IST
  $$
    select net.http_post(
      url     := (select decrypted_secret from vault.decrypted_secrets where name = 'SUPABASE_FUNCTION_URL') || '/host-weekly-digest',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'SUPABASE_SERVICE_ROLE_KEY')
      ),
      body    := jsonb_build_object(
        'scheduled_at', now()::text
      )
    );
  $$
);

comment on extension pg_cron is
  'Schedules periodic SQL jobs. Used by Wayzyy for the weekly host digest '
  'email (every Monday 09:00 IST) and any future recurring maintenance tasks.';
