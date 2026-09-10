# Which listings are real, and which are seed data

Written 2026-09-10. The point of this file is that the answer should never
have to be reconstructed from memory again.

## The flag that tells them apart

`properties.imported_by_admin` is the marker. It is set when ops imports a
listing for a host from their existing Airbnb URL; seed and hand-made test
rows do not have it. `source_url` is a secondary signal (the Airbnb link the
import came from), though a few real rows are missing it.

**Do not maintain a list of real property IDs by hand - it goes stale the
moment someone imports another one. Ask the database:**

```sql
-- every real listing, whatever its status
select id, title, city, price_per_night, status, host_email, source_url
from public.properties
where imported_by_admin is true
order by host_email, created_at;
```

```sql
-- seed / test rows that are publicly visible right now
select id, title, city, price_per_night
from public.properties
where status = 'active' and coalesce(imported_by_admin, false) = false
order by created_at;
```

## Snapshot at time of writing

23 properties were `active` (publicly visible). 6 real, 17 seed.

### Real, and verified correct

Ravi Bhupal (office@mindmapping.co.in) - all Colva, all live, guest-count
tiers starting at 7 guests with a +Rs700 step that reaches each property's
max_guests, descriptions clean of any pricing text:

| Property | Base | Max guests | Tiers |
| --- | --- | --- | --- |
| 7 bedroom private villa, largest in South Goa | Rs25,000 | 16 | 10 |
| 4 Rooms, 5 Mins from beach, with Pool Table | Rs8,500 | 15 | 9 |
| A 3 bedroom villa with air hockey table | Rs7,000 | 12 | 6 |

Glency Britto (purpleporticogoa@gmail.com) - imported, being approved:

| Property | Base | Pricing |
| --- | --- | --- |
| 1 BHK Private Pool Villa in Siolim (d1ca328c) | Rs7,250 | per-person: +Rs1,500 per guest above 3 |
| 3 BHK Private Pool Beach Villa, Candolim (bb94cc2b) | - | tiers deliberately removed |
| 3BHK Private Pool Goan Home, Anjuna (f195b939) | - | tiers deliberately removed |

### Seed / test - safe to ignore, not safe to launch with

Rishikesh, Gurgaon, Noida, Ghaziabad and Delhi listings (not Goa at all),
plus `kjenfkjnwjfo`, `Hey12`, `Untitled listing`, `Villa`, `Casa yoi`.

## Open problem: the Assagao villa is duplicated

"Serene 3BHK Villa w/breakfst Near Assagao's Finest" exists **12 times** in
the table. Four are `active` right now, at four different prices:

- Rs13,000 (imported_by_admin, has source_url)
- Rs12,000 (imported_by_admin, has source_url)
- Rs33,300 (imported_by_admin, no source_url)
- Rs10,000 (not imported - a seed copy sharing the title)

So this is not purely seed noise: the same property was genuinely imported
more than once. A guest browsing today sees it four times, priced 3x apart.
Decide which single row is canonical before launch:

```sql
select id, price_per_night, status, source_url, created_at
from public.properties
where title = 'Serene 3BHK Villa w/breakfst Near Assagao''s Finest'
order by created_at;
```

Two other titles are duplicated twice each: "Luxury Lakeside 2BHK Villa |
Near Baga Beach" and "The Palace Diaries | House of Bindu".

## Before /stays launches

1. Resolve the duplicates above.
2. Demote seed rows out of `active` (reversible - use `draft`, not delete).
3. `ExploreStays.tsx` merges `MOCK_PROPERTIES` into the live feed and queries
   `.neq("status","rejected")`, which also shows `draft` and `pending_review`.
   Both need changing before launch, or fake and unapproved listings ship.
