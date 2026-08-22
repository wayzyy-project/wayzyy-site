-- Migration: Grand Prix Hackathon applications
-- Created: 2026-08-17

create table if not exists public.grand_prix_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_ref text,
  team_name text,
  full_name text not null,
  email text not null,
  hackathon_track text, -- 'participant' | 'registered_no_finals'
  pitch_deck_link text not null,
  video_link text,
  pitch text not null,
  status text default 'pending', -- 'pending' | 'approved' | 'rejected'
  notes text
);

alter table public.grand_prix_applications enable row level security;

grant select, insert, update, delete on public.grand_prix_applications to service_role;

create index if not exists grand_prix_applications_created_at_idx
  on public.grand_prix_applications (created_at desc);
