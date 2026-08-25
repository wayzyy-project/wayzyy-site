-- Migration: unify the two host onboarding paths behind one account
-- Created: 2026-08-25
--
-- Until now there were two disconnected systems:
--   1. /host-onboarding  -> host_onboarding_submissions (standalone, no
--      user_id, no way to join back to an account)
--   2. /host             -> properties (keyed by host_id = auth user)
--
-- A host who submitted via the concierge form and later signed up had no
-- link between the two - you had to match them by email by hand. This
-- migration makes the account the single anchor for both paths.

-- 1. Tie concierge submissions to the account that made them.
alter table public.host_onboarding_submissions
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists host_onboarding_submissions_user_id_idx
  on public.host_onboarding_submissions (user_id);

-- Backfill: match existing submissions to accounts by email so historic
-- concierge submissions show up in the right host's dashboard. Case
-- insensitive because the intake form doesn't normalize casing.
update public.host_onboarding_submissions s
set user_id = u.id
from auth.users u
where s.user_id is null
  and lower(s.email) = lower(u.email);

-- 2. Widen the submission status vocabulary to match the real flow the
--    host sees on their dashboard timeline. Old values ('received',
--    'verifying', 'published', 'rejected') stay valid so nothing in
--    AdminHostOnboarding breaks mid-deploy; the new ones describe the
--    steps between "we got it" and "it's live".
--      received            -> submitted, not picked up yet
--      importing           -> our team is importing their properties
--      ready_for_pricing   -> imported as drafts, host needs to set prices
--      submitted_for_review-> host confirmed pricing, awaiting final review
--      published           -> live
--      rejected            -> not proceeding
comment on column public.host_onboarding_submissions.status is
  'received | importing | ready_for_pricing | submitted_for_review | published | rejected (legacy: verifying)';

-- 3. A host needs a reachable phone number - the concierge path is
--    phone-first (we call them), and signup never captured it before.
alter table public.profiles
  add column if not exists phone text;

-- 4. Let a host read their own submissions from the dashboard. Previously
--    the only read path was a public, unauthenticated API that looked
--    submissions up by email alone - anyone who guessed a host's email
--    could see their status. Reading inside the authenticated dashboard
--    removes that hole.
drop policy if exists "hosts read own onboarding submissions" on public.host_onboarding_submissions;
create policy "hosts read own onboarding submissions"
  on public.host_onboarding_submissions
  for select
  using (auth.uid() = user_id);

-- 5. Let a host create a submission for their own account from inside the
--    dashboard (the concierge form no longer posts anonymously).
drop policy if exists "hosts create own onboarding submissions" on public.host_onboarding_submissions;
create policy "hosts create own onboarding submissions"
  on public.host_onboarding_submissions
  for insert
  with check (auth.uid() = user_id);

grant select, insert on public.host_onboarding_submissions to authenticated;

-- 6. The API writes these rows with the service role key. This table was
--    created without an explicit service_role grant - the same omission
--    that silently broke every grand_prix_applications insert with a
--    42501 "permission denied" until it was caught by hand. Granting it
--    here is idempotent and closes that failure mode for good.
grant select, insert, update, delete on public.host_onboarding_submissions to service_role;
