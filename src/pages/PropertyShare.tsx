import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, MapPin, Users, BedDouble, Bath, Home, Clock } from "lucide-react";
import { SEO } from "@/components/SEO";

interface ShareProperty {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  images: string[];
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
}

/**
 * Read-only public listing preview - title, photos, description, amenities.
 * No price, no booking, payment, wishlist, or messaging: Wayzyy is
 * pre-launch, so this exists purely for a host or the team to send someone
 * a look at a property. Pricing and booking are handled in conversation by
 * the team, not on this page. Fetches through /api/property-preview (a
 * service-role-backed endpoint) rather than the anon Supabase client
 * because draft / pending_review listings aren't readable under RLS -
 * a property being shown here doesn't require it to be "active" yet.
 */
export default function PropertyShare() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<ShareProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    fetch(`/api/property-preview?id=${encodeURIComponent(propertyId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (cancelled) return;
        if (!body?.property) {
          setNotFound(true);
        } else {
          setProperty(body.property as ShareProperty);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
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

  const location = [property.city, property.state].filter(Boolean).join(", ") || "Goa, India";

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${property.title} - Wayzyy`}
        description={property.description?.slice(0, 155) || `${property.title} in ${location} - view photos on Wayzyy.`}
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

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p className="text-sm text-slate-600">
            Wayzyy is pre-launch - this page is for viewing only. Pricing and booking are handled directly by our team.
          </p>
        </div>
      </main>
    </div>
  );
}
