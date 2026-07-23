import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Search, CheckCircle2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ADMIN_EMAIL = "hello@wayzyy.com";

interface LookupResult {
  listingId: string;
  name: string | null;
  description: string | null;
  photoUrls: string[];
  coverPhotoUrl: string | null;
  hostName: string | null;
  location: { locality?: string; region?: string; country?: string } | null;
  details: { guests?: number; bedrooms?: number; beds?: number; baths?: number } | null;
  rating: number | null;
  reviewCount: number | null;
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

function ImportTool() {
  const { toast } = useToast();
  const [urlOrId, setUrlOrId] = useState("");
  const [looking, setLooking] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [hostEmail, setHostEmail] = useState("");
  const [consentNote, setConsentNote] = useState("");
  const [importing, setImporting] = useState(false);
  const [importedId, setImportedId] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!urlOrId.trim()) return;
    setLooking(true);
    setResult(null);
    setImportedId(null);
    try {
      const isUrl = urlOrId.includes("airbnb.com");
      const { data, error } = await supabase.functions.invoke("airroi-listing-lookup", {
        body: isUrl ? { listingUrl: urlOrId.trim() } : { listingId: urlOrId.trim() },
      });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? "Lookup failed");
      setResult(data as LookupResult);
    } catch (err) {
      toast({ title: "Couldn't find listing", description: err instanceof Error ? err.message : "Please check the URL/ID.", variant: "destructive" });
    } finally {
      setLooking(false);
    }
  };

  const handleImport = async () => {
    if (!result) return;
    if (!hostEmail.trim() || !hostEmail.includes("@")) {
      toast({ title: "Host email required", description: "Enter the host's Wayzyy account email.", variant: "destructive" });
      return;
    }
    if (consentNote.trim().length < 5) {
      toast({ title: "Consent note required", description: "Record how/when the host approved this, e.g. \"Confirmed via WhatsApp 23 Jul\".", variant: "destructive" });
      return;
    }
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("airroi-import-listing", {
        body: { listingId: result.listingId, hostEmail: hostEmail.trim(), consentNote: consentNote.trim() },
      });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? "Import failed");
      setImportedId(data.propertyId);
      toast({ title: "Imported", description: `${data.photosImported} photo(s) copied into a pending listing.` });
    } catch (err) {
      toast({ title: "Import failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl">Import an existing Airbnb listing</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        For hosts who already have a live Airbnb listing and have explicitly approved reusing their own
        photos on Wayzyy. This creates a normal <span className="font-medium text-foreground">pending review</span> listing —
        it still needs price confirmation and the usual approval before going live. Every import is logged
        with who approved it and when.
      </p>

      <div className="mt-6 flex items-center gap-2">
        <Input
          value={urlOrId}
          onChange={(e) => setUrlOrId(e.target.value)}
          placeholder="Airbnb listing URL or numeric ID"
        />
        <Button onClick={handleLookup} disabled={looking || !urlOrId.trim()} className="shrink-0 gap-1.5">
          {looking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Look up
        </Button>
      </div>

      {result && (
        <div className="mt-8 space-y-6 rounded-2xl border border-border p-5">
          <div>
            <p className="font-medium">{result.name ?? "Untitled listing"}</p>
            <p className="text-sm text-muted-foreground">
              {[result.location?.locality, result.location?.region].filter(Boolean).join(", ")}
              {result.details && ` · ${result.details.bedrooms ?? "?"} bed · ${result.details.guests ?? "?"} guests`}
              {result.rating != null && ` · ${result.rating.toFixed(2)}★ (${result.reviewCount})`}
            </p>
          </div>

          {result.photoUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {result.photoUrls.slice(0, 8).map((url, i) => (
                <img key={i} src={url} alt="" className="aspect-square w-full rounded-lg border border-border object-cover" />
              ))}
            </div>
          )}

          <div className="space-y-4 border-t border-border pt-4">
            <div>
              <Label htmlFor="hostEmail">Host's Wayzyy account email</Label>
              <Input id="hostEmail" value={hostEmail} onChange={(e) => setHostEmail(e.target.value)} placeholder="host@example.com" />
              <p className="mt-1 text-xs text-muted-foreground">They need an existing Wayzyy account — this doesn't create one.</p>
            </div>
            <div>
              <Label htmlFor="consentNote">How did the host approve this?</Label>
              <Textarea
                id="consentNote"
                value={consentNote}
                onChange={(e) => setConsentNote(e.target.value)}
                placeholder='e.g. "Confirmed by phone with Rohan on 23 Jul, he owns this listing and approved reusing the photos"'
                rows={2}
              />
            </div>
            <Button onClick={handleImport} disabled={importing} className="w-full gap-2 bg-ember text-white hover:bg-ember/90">
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Import as pending listing
            </Button>
          </div>

          {importedId && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
              Created. <Link to={`/admin/review/${importedId}`} className="underline">Open it in the review panel</Link> to
              confirm the real price and finish approving it.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminAirroiImport() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Import Airbnb listing — Wayzyy Admin" description="Import a host's existing Airbnb listing with their approval." />
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Wayzyy
        </Link>
        <ThemeToggle />
      </header>
      <AuthGate>
        <ImportTool />
      </AuthGate>
    </div>
  );
}
