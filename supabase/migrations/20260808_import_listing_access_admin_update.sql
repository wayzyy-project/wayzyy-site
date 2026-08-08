-- Migration: Grant admin UPDATE access for import_listing_access_requests
-- Created: 2026-08-08

-- Allow admin (hello@wayzyy.com) to update import listing access request rows
create policy "Admin can update all import access requests"
  on public.import_listing_access_requests for update
  using ((auth.jwt() ->> 'email'::text) = 'hello@wayzyy.com'::text)
  with check ((auth.jwt() ->> 'email'::text) = 'hello@wayzyy.com'::text);
