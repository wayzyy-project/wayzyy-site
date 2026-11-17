-- Immersive walkthrough videos made from listing photos.
-- Files live in the public `property-videos` bucket; the page loads them only
-- when a guest taps "Watch walkthrough".
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-videos', 'property-videos', true, 20971520, array['video/mp4', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

alter table public.properties
  add column if not exists walkthrough_url text,
  add column if not exists walkthrough_poster_url text;
