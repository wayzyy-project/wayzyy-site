-- Migration: let a signed-in user read their own host_onboarding_submissions rows
-- Created: 2026-08-18

create policy "Users can view their own onboarding submissions"
  on public.host_onboarding_submissions for select
  using (email = (auth.jwt() ->> 'email'));

grant select on public.host_onboarding_submissions to authenticated;
