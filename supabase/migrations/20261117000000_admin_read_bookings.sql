-- Lets the admin account (hello@wayzyy.com) read every booking and enquiry in /adminn/bookings.
-- Read-only; same email check the other admin policies use (properties_select_admin etc.).
drop policy if exists bookings_select_admin on public.bookings;
create policy bookings_select_admin on public.bookings
  for select using ((auth.jwt() ->> 'email'::text) = 'hello@wayzyy.com'::text);

drop policy if exists property_enquiries_select_admin on public.property_enquiries;
create policy property_enquiries_select_admin on public.property_enquiries
  for select using ((auth.jwt() ->> 'email'::text) = 'hello@wayzyy.com'::text);
