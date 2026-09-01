import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, CheckCircle2, Loader2, XCircle } from "lucide-react";
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
// string being readable in this page's JS bundle isn't a credential leak - 
// it's not a secret, any more than a username is. The actual protection is
// the account's password (never shipped to the client) plus the server-side
// checks, which is what actually stops someone acting as admin.
const ADMIN_EMAIL = "hello@wayzyy.com";

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
  wayzyy_verified: boolean | null;
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

function ReviewListing({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [decided, setDecided] = useState<"active" | "rejected" | null>(null);
  const [verified, setVerified] = useState(false);
  const [notes, setNotes] = useState("");

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
    setVerified(p.wayzyy_verified === true);
    if (p.admin_notes) setNotes(p.admin_notes);
    setLoading(false);
  }, [propertyId, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDecision = async (newStatus: "active" | "rejected") => {
    if (!property) return;
    // A draft is a listing we imported that the host hasn't priced yet, so it
    // still carries price_per_night = 0. The "All" tab on /adminn/listings has
    // no status filter, so drafts are reachable from here - approving one
    // would publish it bookable at zero and skip the host's pricing step
    // entirely. It has to go back to them first.
    if (newStatus === "active" && (property.status === "draft" || !property.price_per_night)) {
      toast({
        title: "No price on this listing yet",
        description: "It's still with the host to set their rate. It'll come back here for approval once they've priced it.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {
        wayzyy_verified: verified,
        admin_notes: notes || null,
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.email ?? "admin",
      };
      // properties.rating stays untouched: it's the guest-facing star
      // rating and belongs to real reviews, not to us.

      const { error } = await supabase.from("properties").update(updates).eq("id", propertyId);
      if (error) throw error;

      if (newStatus === "active") {
        supabase.functions.invoke("approve-listing", { body: { propertyId } }).catch(() => {});
      } else {
        supabase.functions.invoke("reject-listing", { body: { propertyId, adminNotes: notes } }).catch(() => {});
      }

      setDecided(newStatus);
      toast({ title: newStatus === "active" ? "Listing approved" : "Listing rejected" });
      setTimeout(() => navigate("/adminn/listings"), 800);
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
          This listing is currently {decided === "active" ? "live" : "rejected"}. You can still update the badge or notes below and re-decide.
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
        <div><p className="text-muted-foreground">Location</p><p className="font-medium">{property.location || [property.city, property.state].filter(Boolean).join(", ") || "Goa, India"}</p></div>
        <div><p className="text-muted-foreground">Coordinates</p><p className="font-medium">{property.latitude && property.longitude ? `${property.latitude}, ${property.longitude}` : "City center fallback"}</p></div>
        <div><p className="text-muted-foreground">Weekday price</p><p className="font-medium">₹{property.price_per_night?.toLocaleString("en-IN")}</p></div>
        <div><p className="text-muted-foreground">Weekend price</p><p className="font-medium">{property.weekend_price ? `₹${property.weekend_price.toLocaleString("en-IN")}` : "Same as weekday"}</p></div>
        <div><p className="text-muted-foreground">Type</p><p className="font-medium">{property.category ?? " - "} · {property.space_type ?? " - "}</p></div>
        <div><p className="text-muted-foreground">Guests / beds / baths</p><p className="font-medium">{property.max_guests} guests · {property.bedrooms}br · {property.beds} beds · {property.bathrooms} bath</p></div>
        <div><p className="text-muted-foreground">Registration #</p><p className="font-medium">{property.registration_number ?? " - "}</p></div>
        <div><p className="text-muted-foreground">Cancellation policy</p><p className="font-medium">{property.cancel_policy}</p></div>
        <div><p className="text-muted-foreground">Instant book</p><p className="font-medium">{property.instant_book ? "Yes" : "No"}</p></div>
        <div><p className="text-muted-foreground">Status</p><p className="font-medium">{property.status}</p></div>
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold">Description</p>
        <p className="whitespace-pre-wrap rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">
          {property.description || " - "}
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

      {/* A listing is either checked by our team or it isn't. The old
          1-5 scoring across five criteria produced a number that was
          written into properties.rating - the guest-facing star rating -
          so a listing with no stays showed travellers an admin's opinion
          dressed up as reviews. */}
      <div>
        <p className="mb-3 text-sm font-semibold">Wayzyy Verified</p>
        <button
          type="button"
          onClick={() => setVerified((v) => !v)}
          aria-pressed={verified}
          className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
            verified ? "border-ember bg-ember/5" : "border-border hover:border-foreground/30"
          }`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              verified ? "bg-ember text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            <BadgeCheck className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">
              {verified ? "Marked as Wayzyy Verified" : "Mark as Wayzyy Verified"}
            </span>
            <span className="block text-xs text-muted-foreground">
              Our team has checked the photos, details and location. Shows as a badge to guests and in the app.
            </span>
          </span>
          <span
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${verified ? "bg-ember" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                verified ? "left-[1.375rem]" : "left-0.5"
              }`}
            />
          </span>
        </button>
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
      <SEO title="Review listing - Wayzyy Admin" description="Review and approve or reject a submitted listing." noindex />
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/adminn" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
        </Link>
        <ThemeToggle />
      </header>
      <AuthGate>{propertyId ? <ReviewListing propertyId={propertyId} /> : <p className="py-16 text-center text-sm text-muted-foreground">Missing property id.</p>}</AuthGate>
    </div>
  );
}
