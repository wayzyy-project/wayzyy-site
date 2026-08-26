-- ============================================================================
-- Supabase Migration: waitlist_signups
-- Run this in your Supabase Dashboard -> SQL Editor (New query)
-- ============================================================================

-- 1. Create table if it doesn't exist
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  audience text not null default 'host', -- 'host' or 'traveler'
  city text,
  phone text,
  notes text,
  notified boolean default false
);

-- 2. Ensure all columns exist in case the table was created earlier
alter table public.waitlist_signups add column if not exists city text;
alter table public.waitlist_signups add column if not exists phone text;
alter table public.waitlist_signups add column if not exists notes text;
alter table public.waitlist_signups add column if not exists notified boolean default false;

-- 3. Enable Row Level Security (RLS) for data privacy
alter table public.waitlist_signups enable row level security;

-- 4. Create indexes for quick search and sorting
create index if not exists waitlist_signups_email_idx on public.waitlist_signups (email);
create index if not exists waitlist_signups_created_at_idx on public.waitlist_signups (created_at desc);
create index if not exists waitlist_signups_audience_idx on public.waitlist_signups (audience);
