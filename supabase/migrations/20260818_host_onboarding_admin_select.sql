-- Migration: let the admin account read every host_onboarding_submissions row
-- Created: 2026-08-18
--
-- The existing select policy (20260818_host_onboarding_status_rls.sql)
-- only lets a signed-in user see their own row, by email. This adds a
-- second policy for the admin specifically - Postgres RLS policies for
-- the same command OR together, so this purely extends visibility for
-- hello@wayzyy.com without touching the per-user policy.

create policy "Admin can view all onboarding submissions"
  on public.host_onboarding_submissions for select
  using ((auth.jwt() ->> 'email'::text) = 'hello@wayzyy.com'::text);
