-- Date-specific host prices for Dec 2026 on two Goa listings, set from the
-- matching Airbnb prices: price = host payout x = Airbnb price / 1.155.
-- date_prices holds the host's price; the site adds the 7% fee and GST at checkout.
-- Joining properties skips a row (instead of failing) if the listing is absent in an environment.

insert into public.date_prices (property_id, date, price)
select p.id, v.d::date, v.price
from (values
  -- 2BHK Apartment with Swimming Pool, Siolim: stay 12-14 Dec
  ('66c8c936-b360-48f0-aed3-15ea0c94d356', '2026-12-12', 8658),
  ('66c8c936-b360-48f0-aed3-15ea0c94d356', '2026-12-13', 8658),
  -- Beautiful 2 BR Villa with Pool, Candolim: stay 14-16 Dec (Airbnb pre-discount rate)
  ('7950ece8-6706-4288-a00c-312f78928d77', '2026-12-14', 5757),
  ('7950ece8-6706-4288-a00c-312f78928d77', '2026-12-15', 5757)
) as v(pid, d, price)
join public.properties p on p.id = v.pid::uuid
on conflict (property_id, date) do update set price = excluded.price;
