import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Home, BedDouble, Users } from "lucide-react";
import { SEO } from "@/components/SEO";

interface PreviewListing {
  id: string;
  title: string | null;
  city: string | null;
  state: string | null;
  coverImage: string | null;
  bedrooms: number | null;
  maxGuests: number | null;
  status: string;
}

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  active: { label: "Live", className: "bg-emerald-100 text-emerald-700" },
  pending_review: { label: "In review", className: "bg-amber-100 text-amber-700" },
  draft: { label: "Needs your pricing", className: "bg-slate-100 text-slate-600" },
};

/**
 * Read-only public portfolio preview - every non-rejected listing one host
 * has with us, so someone we've imported for can see what's already on
 * Wayzyy before they've ever logged in. Fetches through /api/host-preview
 * (service-role-backed) for the same reason PropertyShare does: draft and
 * pending_review listings aren't readable under anon RLS.
 */
export default function HostPreview() {
  const { hostId } = useParams();
  const [hostName, setHostName] = useState<string | null>(null);
  const [properties, setProperties] = useState<PreviewListing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!hostId) return;
    let cancelled = false;
    fetch(`/api/host-preview?hostId=${encodeURIComponent(hostId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (cancelled) return;
        if (!body?.properties?.length) {
          setNotFound(true);
        } else {
          setHostName(body.hostName ?? null);
          setProperties(body.properties as PreviewListing[]);
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
  }, [hostId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }

  if (notFound || !properties) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <h1 className="font-display text-xl font-bold text-slate-900">Nothing to show yet</h1>
        <p className="max-w-sm text-sm text-slate-500">
          We couldn't find any listings for this link.
        </p>
        <Link to="/" className="mt-2 text-sm font-semibold text-ember">
          Go to wayzyy.com
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${hostName ? `${hostName}'s` : "Your"} properties on Wayzyy`}
        description="A preview of every listing on Wayzyy under this host account."
      />

      <header className="flex items-center gap-2.5 px-5 py-4 sm:px-8">
        <img src="/favicon.svg" alt="Wayzyy" className="h-7 w-7 rounded-full object-cover" />
        <span className="font-display text-base font-bold tracking-tight text-slate-900">wayzyy</span>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          {hostName ? `${hostName}'s properties` : "Your properties"} on Wayzyy
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {properties.length} listing{properties.length === 1 ? "" : "s"}. Tap one to see photos, description and location.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {properties.map((p) => {
            const status = STATUS_LABEL[p.status] ?? { label: p.status, className: "bg-slate-100 text-slate-600" };
            const area = [p.city, p.state].filter(Boolean).join(", ") || "Goa, India";
            return (
              <Link
                key={p.id}
                to={`/property/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt={p.title ?? "Listing photo"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Home className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <span className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <div className="space-y-1 p-4">
                  <p className="truncate text-sm font-semibold text-slate-900">{p.title || "Untitled listing"}</p>
                  <p className="truncate text-xs text-slate-500">{area}</p>
                  <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                    {p.bedrooms != null && (
                      <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {p.bedrooms}</span>
                    )}
                    {p.maxGuests != null && (
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {p.maxGuests}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
