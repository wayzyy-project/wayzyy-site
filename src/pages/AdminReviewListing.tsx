import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, Star, XCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Admin access here is gated the same way as every other admin surface in
// this codebase (mobile app + AdminVerifications.tsx): a hardcoded email
// check, enforced server-side by RLS on the `properties` update and by the
// approve-listing/reject-listing edge functions themselves. That email
// string being readable in this page's JS bundle isn't a credential leak —
// it's not a secret, any more than a username is. The actual protection is
// the account's password (never shipped to the client) plus the server-side
// checks, which is what actually stops someone acting as admin.
const ADMIN_EMAIL = "hello@wayzyy.com";

const CRITERIA = [
  { key: "photo_quality", label: "Photo quality", weight: 0.25, desc: "Are the photos clear, well-lit, and plentiful?" },
  { key: "listing_completeness", label: "Listing completeness", weight: 0.2, desc: "Is the title, description, and all details filled out?" },
  { key: "location_desirability", label: "Location desirability", weight: 0.2, desc: "Is the location attractive or in demand for travellers?" },
  { key: "price_reasonableness", label: "Price reasonableness", weight: 0.2, desc: "Is the price competitive and fair for the market?" },
  { key: "host_profile", label: "Host profile", weight: 0.15, desc: "Does the host have a good profile and communication?" },
] as const;

type CriterionKey = (typeof CRITERIA)[number]["key"];

function computeOverall(ratings: Record<CriterionKey, number>): number | null {
  let sum = 0;
  let totalWeight = 0;
  for (const c of CRITERIA) {
    const r = ratings[c.key];
    if (r > 0) {
      sum += r * c.weight;
      totalWeight += c.weight;
    }
  }
  if (totalWeight === 0) return null;
  return Math.round((sum / totalWeight) * 10) / 10;
}

interface Property {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  street: string | null;
  pincode: string | null;
  registration_number: string | null;
  price_per_night: number;
  weekend_price: number | null;
  images: string[];
  host_email: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  category: string | null;
  space_type: string | null;
  status: string;
  cancel_policy: string;
  instant_book: boolean;
  admin_photo_quality: number | null;
  admin_listing_completeness: number | null;
  admin_location_desirability: number | null;
  admin_price_reasonableness: number | null;
  admin_host_profile: number | null;
  admin_notes: string | null;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center gap-4 px-4">
        <h1 className="font-display text-2xl">Admin sign in</h1>
        <p className="text-sm text-muted-foreground">This page is restricted to the Wayzyy admin account.</p>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true);
            const { error } = await signIn(email, password);
            setSubmitting(false);
            if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
          }}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} className="p-0.5">
          <Star className={`h-5 w-5 ${n <= value ? "fill-ember text-ember" : "text-border"}`} />
        </button>
      ))}
    </div>
  );
}

function ReviewListing({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [decided, setDecided] = useState<"active" | "rejected" | null>(null);
  const [ratings, setRatings] = useState<Record<CriterionKey, number>>({
    photo_quality: 0,
    listing_completeness: 0,
    location_desirability: 0,
    price_reasonableness: 0,
    host_profile: 0,
  });
  const [notes, setNotes] = useState("");

  const overall = useMemo(() => computeOverall(ratings), [ratings]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("properties").select("*").eq("id", propertyId).single();
    if (error || !data) {
      toast({ title: "Could not load listing", description: error?.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const p = data as Property;
    setProperty(p);
    setDecided(p.status === "active" || p.status === "rejected" ? (p.status as "active" | "rejected") : null);
    if (p.admin_photo_quality != null) {
      setRatings({
        photo_quality: p.admin_photo_quality ?? 0,
        listing_completeness: p.admin_listing_completeness ?? 0,
        location_desirability: p.admin_location_desirability ?? 0,
        price_reasonableness: p.admin_price_reasonableness ?? 0,
        host_profile: p.admin_host_profile ?? 0,
      });
    }
    if (p.admin_notes) setNotes(p.admin_notes);
    setLoading(false);
  }, [propertyId, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDecision = async (newStatus: "active" | "rejected") => {
    if (!property) return;
    if (newStatus === "active" && overall == null) {
      toast({ title: "Rate first", description: "Please rate at least one criterion before approving.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {
        admin_photo_quality: ratings.photo_quality || null,
        admin_listing_completeness: ratings.listing_completeness || null,
        admin_location_desirability: ratings.location_desirability || null,
        admin_price_reasonableness: ratings.price_reasonableness || null,
        admin_host_profile: ratings.host_profile || null,
        admin_overall_rating: overall,
        admin_notes: notes || null,
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.email ?? "admin",
      };
      if (newStatus === "active" && overall != null) updates.rating = overall;

      const { error } = await supabase.from("properties").update(updates).eq("id", propertyId);
      if (error) throw error;

      if (newStatus === "active") {
        supabase.functions.invoke("approve-listing", { body: { propertyId, adminRating: overall } }).catch(() => {});
      } else {
        supabase.functions.invoke("reject-listing", { body: { propertyId, adminNotes: notes } }).catch(() => {});
      }

      setDecided(newStatus);
      toast({ title: newStatus === "active" ? "Listing approved" : "Listing rejected" });
      setTimeout(() => navigate("/admin/listings"), 800);
    } catch (err) {
      toast({ title: "Couldn't save", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!property) {
    return <p className="py-16 text-center text-sm text-muted-foreground">Listing not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      {decided && (
        <div className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${decided === "active" ? "border-green-500/30 bg-green-500/10 text-green-600" : "border-red-500/30 bg-red-500/10 text-red-600"}`}>
          {decided === "active" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          This listing is currently {decided === "active" ? "live" : "rejected"}. You can still update the ratings/notes below and re-decide.
        </div>
      )}

      <div>
        <h1 className="font-display text-2xl">{property.title || "Untitled listing"}</h1>
        <p className="text-sm text-muted-foreground">
          {[property.street, property.city, property.state, property.pincode].filter(Boolean).join(", ")}
        </p>
      </div>

      {property.images?.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {property.images.map((src, i) => (
            <img key={i} src={src} alt="" className="aspect-square w-full rounded-lg border border-border object-cover" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-border p-4 text-sm sm:grid-cols-3">
        <div><p className="text-muted-foreground">Host</p><p className="font-medium">{property.host_email}</p></div>
        <div><p className="text-muted-foreground">Weekday price</p><p className="font-medium">₹{property.price_per_night?.toLocaleString("en-IN")}</p></div>
        <div><p className="text-muted-foreground">Weekend price</p><p className="font-medium">{property.weekend_price ? `₹${property.weekend_price.toLocaleString("en-IN")}` : "Same as weekday"}</p></div>
        <div><p className="text-muted-foreground">Type</p><p className="font-medium">{property.category ?? "—"} · {property.space_type ?? "—"}</p></div>
        <div><p className="text-muted-foreground">Guests / beds / baths</p><p className="font-medium">{property.max_guests} guests · {property.bedrooms}br · {property.beds} beds · {property.bathrooms} bath</p></div>
        <div><p className="text-muted-foreground">Registration #</p><p className="font-medium">{property.registration_number ?? "—"}</p></div>
        <div><p className="text-muted-foreground">Cancellation policy</p><p className="font-medium">{property.cancel_policy}</p></div>
        <div><p className="text-muted-foreground">Instant book</p><p className="font-medium">{property.instant_book ? "Yes" : "No"}</p></div>
        <div><p className="text-muted-foreground">Status</p><p className="font-medium">{property.status}</p></div>
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold">Description</p>
        <p className="whitespace-pre-wrap rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">
          {property.description || "—"}
        </p>
      </div>

      {property.amenities?.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((a) => (
              <span key={a} className="rounded-full border border-border px-2.5 py-0.5 text-xs">{a}</span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-semibold">Quality rating</p>
        <div className="space-y-3">
          {CRITERIA.map((c) => (
            <div key={c.key} className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <StarPicker value={ratings[c.key]} onChange={(v) => setRatings((prev) => ({ ...prev, [c.key]: v }))} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Overall: <span className="font-medium text-foreground">{overall != null ? `${overall.toFixed(1)} ★` : "Not rated yet"}</span>
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Admin notes</p>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Visible to the host if you reject." />
      </div>

      <div className="flex gap-3">
        <Button
          className="flex-1 gap-2 bg-green-600 text-white hover:bg-green-700"
          disabled={saving}
          onClick={() => handleDecision("active")}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Approve
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2 border-red-500/40 text-red-600 hover:bg-red-500/10"
          disabled={saving}
          onClick={() => handleDecision("rejected")}
        >
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>
  );
}

export default function AdminReviewListing() {
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Review listing — Wayzyy Admin" description="Review and approve or reject a submitted listing." />
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Wayzyy
        </Link>
        <ThemeToggle />
      </header>
      <AuthGate>{propertyId ? <ReviewListing propertyId={propertyId} /> : <p className="py-16 text-center text-sm text-muted-foreground">Missing property id.</p>}</AuthGate>
    </div>
  );
}
