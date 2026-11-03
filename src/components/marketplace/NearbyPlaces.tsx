import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { nearbyPlaces, SEED_HOST_EMAILS, isBrowsable, type PlaceListing } from "../../../api/_lib/places";

// "Explore other options in and around <area>" at the bottom of a stay. Each
// link opens that area's page (/assagao/stays), which lists only its stays.

const COLUMNS = "id, title, city, state, latitude, longitude, host_email";

interface Props {
  city?: string | null;
  lat?: number | null;
  lng?: number | null;
}

export function NearbyPlaces({ city, lat, lng }: Props) {
  const [listings, setListings] = useState<PlaceListing[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("properties").select(COLUMNS).eq("status", "active");
      if (cancelled) return;
      setListings(
        (data ?? []).filter(
          (p: any) => !SEED_HOST_EMAILS.includes(String(p.host_email ?? "").toLowerCase()) && isBrowsable(p),
        ) as unknown as PlaceListing[],
      );
    })();
    return () => { cancelled = true; };
  }, []);

  const places = useMemo(() => (listings ? nearbyPlaces(listings, { city, lat, lng }) : null), [listings, city, lat, lng]);
  if (!places || (!places.here && places.nearby.length === 0)) return null;

  const area = places.here?.label ?? city ?? "Goa";
  const stays = (n: number) => `${n} ${n === 1 ? "stay" : "stays"}`;
  const links = [
    ...(places.here ? [{ href: places.here.href, label: places.here.label, sub: `${stays(places.here.count)} in this area` }] : []),
    ...places.nearby.map((p) => ({ href: p.href, label: p.label, sub: p.km === null ? stays(p.count) : `${stays(p.count)} · ${p.km} km away` })),
    ...(places.region ? [{ href: places.region.href, label: `All of ${places.region.label}`, sub: stays(places.region.count) }] : []),
  ];

  return (
    <section aria-labelledby="nearby-places" className="mt-16 border-t border-border pt-10">
      <h2 id="nearby-places" className="font-display text-xl font-bold text-foreground sm:text-2xl">
        Explore other options in and around {area}
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link to={l.href} className="group block">
              <span className="block text-sm font-semibold text-foreground group-hover:text-[#FF6B00] group-hover:underline">
                {l.label}
              </span>
              <span className="block text-sm text-muted-foreground">{l.sub}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
