-- Signed-out guests got 401 on property_discounts, so the listing page showed no weekly/monthly discounts.
-- RLS already allows reading ("Anyone can view property discounts"); only the table grant was missing.
grant select on public.property_discounts to anon;
