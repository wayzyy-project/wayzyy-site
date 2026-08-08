-- The previous migration (20260808_import_listing_access_admin_update.sql)
-- added an RLS UPDATE policy for admin, but RLS policies only filter rows —
-- Postgres still requires the base table-level privilege before RLS is even
-- evaluated. The original migration only granted select/insert to
-- `authenticated`, so admin's approve/decline update was still rejected
-- (this is why the request kept showing "Action Processed" instead of
-- "Import Feature Granted!", and why the host's dashboard kept showing
-- "pending" — the row's status never actually changed in the database).

grant update on public.import_listing_access_requests to authenticated;
