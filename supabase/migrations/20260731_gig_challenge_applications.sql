-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- before the gig-challenge form goes live. The API route inserts into this
-- table using the service role key, which bypasses RLS regardless — RLS is
-- enabled here with no public policies purely so anon/authenticated clients
-- can never read or write applicant data directly from the browser.

create table if not exists public.gig_challenge_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_ref text,
  full_name text not null,
  email text not null,
  phone text,
  city text,
  linkedin text,
  github text,
  status text,
  written_pitch text,
  techniques text[],
  safety_approach text,
  metrics text,
  cost_estimate text,
  past_work_repo text,
  video_link text,
  availability text,
  earliest_start_date text
);

alter table public.gig_challenge_applications enable row level security;

create index if not exists gig_challenge_applications_created_at_idx
  on public.gig_challenge_applications (created_at desc);
