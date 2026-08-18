-- Migration: Host onboarding submissions (new-host property intake)
-- Created: 2026-08-18

create table if not exists public.host_onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  airbnb_profile_url text,
  property_urls text[],
  status text not null default 'received', -- 'received' | 'verifying' | 'published' | 'rejected'
  notes text
);

alter table public.host_onboarding_submissions enable row level security;

create index if not exists host_onboarding_submissions_created_at_idx
  on public.host_onboarding_submissions (created_at desc);

create index if not exists host_onboarding_submissions_email_idx
  on public.host_onboarding_submissions (email);
