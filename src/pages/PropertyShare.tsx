import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, MapPin, Users, BedDouble, Bath, Home } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toGuestPrice } from "@/lib/pricing";
import { SEO } from "@/components/SEO";

interface ShareProperty {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  images: string[];
  price_per_night: number;
  weekend_price: number | null;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
}

/**
 * Read-only public listing preview - title, photos, description, price.
 * No booking, payment, wishlist, or messaging: this is the URL the mobile
 * app's native Share button already generates for every property, and it
 * has to resolve to something on wayzyy.com even before the web app's full
 * booking flow ships.
 */
export default function PropertyShare() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<ShareProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    supabase
      .from("properties")
      .select(
        "id, title, description, city, state, images, price_per_night, weekend_price, max_guests, bedrooms, beds, bathrooms, amenities"
      )
      .eq("id", propertyId)
      .eq("status", "active")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
        } else {
          setProperty(data as ShareProperty);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <h1 className="font-display text-xl font-bold text-slate-900">Listing not available</h1>
        <p className="max-w-sm text-sm text-slate-500">
          This property is no longer listed, or the link is incorrect.
        </p>
        <Link to="/" className="mt-2 text-sm font-semibold text-ember">
          Go to wayzyy.com
        </Link>
      </div>
    );
  }

  const weekday = toGuestPrice(property.price_per_night);
  const weekend = property.weekend_price ? toGuestPrice(property.weekend_price) : null;
  const location = [property.city, property.state].filter(Boolean).join(", ") || "Goa, India";

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${property.title} - Wayzyy`}
        description={property.description?.slice(0, 155) || `${property.title} in ${location} - view photos and pricing on Wayzyy.`}
      />

      <header className="flex items-center gap-2.5 px-5 py-4 sm:px-8">
        <img src="/favicon.svg" alt="Wayzyy" className="h-7 w-7 rounded-full object-cover" />
        <span className="font-display text-base font-bold tracking-tight text-slate-900">wayzyy</span>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        {property.images?.length > 0 && (
          <div className="mb-6 grid grid-cols-4 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
            <img
              src={property.images[0]}
              alt={property.title}
              className="col-span-4 row-span-2 h-full w-full object-cover sm:col-span-2"
            />
            {property.images.slice(1, 5).map((src, i) => (
              <img key={i} src={src} alt="" className="hidden h-full w-full object-cover sm:block" />
            ))}
          </div>
        )}

        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{property.title}</h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {location}
        </p>

        <div className="mt-5 flex flex-wrap gap-4 border-y border-slate-100 py-4 text-sm text-slate-700">
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-400" /> {property.max_guests} guests</span>
          <span className="flex items-center gap-1.5"><Home className="h-4 w-4 text-slate-400" /> {property.bedrooms} bedrooms</span>
          <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-slate-400" /> {property.beds} beds</span>
          <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-slate-400" /> {property.bathrooms} baths</span>
        </div>

        {property.description && (
          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-600">{property.description}</p>
        )}

        {property.amenities?.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold text-slate-900">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((a) => (
                <span key={a} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Price per night</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">
            ₹{weekday.toLocaleString("en-IN")}
            <span className="ml-1 text-sm font-normal text-slate-500">weekday</span>
          </p>
          {weekend && weekend !== weekday && (
            <p className="mt-0.5 text-sm text-slate-600">
              ₹{weekend.toLocaleString("en-IN")} <span className="text-slate-400">weekend</span>
            </p>
          )}
          <p className="mt-3 text-xs text-slate-400">
            Final price may vary by dates and number of guests. Contact Wayzyy to book.
          </p>
        </div>
      </main>
    </div>
  );
}
