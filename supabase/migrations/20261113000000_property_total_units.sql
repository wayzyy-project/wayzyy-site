-- Listings that are one of several identical units (e.g. 12 one-bedroom flats).
-- The site never greys dates out for these; a clash sends the guest to the team.
alter table public.properties
  add column if not exists total_units integer not null default 1 check (total_units >= 1);

update public.properties set total_units = 12 where id = '419362cc-ed98-4c15-9136-315c5d9a0c24'; -- Smart 1BHK, Charvi
update public.properties set total_units = 4  where id = 'd3c6f721-7292-4c76-b54b-eda27c09b9a7'; -- Studio, Charvi
update public.properties set total_units = 4  where id = '4d2a6b28-bca4-4793-b2aa-145032d4f6fe'; -- Jacuzzi suite, Charvi
update public.properties set total_units = 2  where id = 'ece2a2b6-9bc0-46e3-89a2-c78c1e74ad9f'; -- Single room, Charvi
update public.properties set total_units = 3  where id = '72db37e5-1638-45e6-ab70-00c0358cb440'; -- Flat S2 (draft)
