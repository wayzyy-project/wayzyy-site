import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, MapPin, Users, BedDouble, Bath, Home, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";

interface ShareProperty {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  space_type: string | null;
}

/**
 * Read-only public listing preview - photos (click to zoom through all of
 * them), description, amenities, approximate location on a map, and
 * nothing else: Wayzyy is pre-launch, so price and booking are handled
 * directly by the team, never on this page. Fetches through
 * /api/property-preview (service-role-backed) rather than the anon
 * Supabase client because draft / pending_review listings aren't readable
 * under RLS - a property shown here doesn't have to be "active" yet.
 *
 * The exact address is never sent to this page (street/pincode are
 * withheld pre-booking, same convention as Airbnb) - only city/state and
 * an approximate lat/lng for the map pin.
 */
export default function PropertyShare() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<ShareProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null || !property ? i : (i + 1) % property.images.length));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null || !property ? i : (i - 1 + property.images.length) % property.images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, property]);

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

  const area = property.location || [property.city, property.state].filter(Boolean).join(", ") || "Goa, India";
  const hasMap = property.latitude != null && property.longitude != null;
  const mapSrc = hasMap
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude! - 0.01}%2C${property.latitude! - 0.01}%2C${property.longitude! + 0.01}%2C${property.latitude! + 0.01}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`
    : null;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${property.title} - Wayzyy`}
        description={property.description?.slice(0, 155) || `${property.title} in ${area} - view photos on Wayzyy.`}
      />

      <header className="flex items-center gap-2.5 px-5 py-4 sm:px-8">
        <img src="/favicon.svg" alt="Wayzyy" className="h-7 w-7 rounded-full object-cover" />
        <span className="font-display text-base font-bold tracking-tight text-slate-900">wayzyy</span>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        {property.images?.length > 0 && (
          <div className="mb-6 grid grid-cols-4 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className="col-span-4 row-span-2 cursor-zoom-in sm:col-span-2"
            >
              <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover" />
            </button>
            {property.images.slice(1, 5).map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i + 1)}
                className="hidden cursor-zoom-in sm:block"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        {property.images?.length > 1 && (
          <p className="-mt-4 mb-6 text-xs text-slate-400">Tap any photo to view all {property.images.length}, full-size.</p>
        )}

        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{property.title}</h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {area}
          {property.space_type && <span className="text-slate-300">·</span>}
          {property.space_type && <span>{property.space_type}</span>}
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

        <div className="mt-6">
          <h2 className="mb-2 text-sm font-bold text-slate-900">Location</h2>
          <p className="mb-2 text-sm text-slate-600">{area}</p>
          {hasMap ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                title="Property location"
                src={mapSrc!}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <p className="text-xs text-slate-400">Exact pin not available yet - approximate area shown above.</p>
          )}
          <p className="mt-2 text-xs text-slate-400">Exact address is shared once a stay is confirmed.</p>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p className="text-sm text-slate-600">
            Wayzyy is pre-launch - this page is for viewing only. Pricing and booking are handled directly by our team.
          </p>
        </div>
      </main>

      {lightboxIndex !== null && property.images?.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {property.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => (i === null ? i : (i - 1 + property.images.length) % property.images.length))}
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => (i === null ? i : (i + 1) % property.images.length))}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={property.images[lightboxIndex]}
            alt={`${property.title} - photo ${lightboxIndex + 1} of ${property.images.length}`}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
          <p className="absolute bottom-4 text-xs text-white/60">
            {lightboxIndex + 1} / {property.images.length}
          </p>
        </div>
      )}
    </div>
  );
}
