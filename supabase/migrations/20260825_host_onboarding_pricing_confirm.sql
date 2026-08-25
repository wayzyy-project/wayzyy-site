-- Migration: let a host hand their own submission back for final review
-- Created: 2026-08-25
--
-- The concierge path has exactly one point where the host acts on the
-- submission itself: once we've imported their listings and set the row to
-- 'ready_for_pricing', they set their rates and confirm. That confirm is an
-- UPDATE, and the policies added in 20260825_host_onboarding_unified_flow
-- only covered select and insert.
--
-- The policy is deliberately narrow rather than a blanket "hosts can update
-- their own row": the only transition a host may perform is
-- ready_for_pricing -> submitted_for_review. Everything else (importing,
-- published, rejected) stays admin-only, so a host can't publish their own
-- listings by writing a status directly.

drop policy if exists "hosts confirm pricing on own submission" on public.host_onboarding_submissions;
create policy "hosts confirm pricing on own submission"
  on public.host_onboarding_submissions
  for update
  using (auth.uid() = user_id and status = 'ready_for_pricing')
  with check (auth.uid() = user_id and status = 'submitted_for_review');

grant update on public.host_onboarding_submissions to authenticated;
