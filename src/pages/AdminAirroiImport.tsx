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
import { normalizeAmenities } from "@/lib/amenities";

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
  pricing?: { rate_per_night?: number; nightly_price?: number; base_price?: number; price?: number; amount?: number } | null;
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
  const [results, setResults] = useState<LookupResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hostEmail, setHostEmail] = useState("");
  const [consentNote, setConsentNote] = useState("");
  const [importing, setImporting] = useState(false);
  const [importedResults, setImportedResults] = useState<{ id: string; listingId: string }[]>([]);

  const handleLookup = async () => {
    if (!urlOrId.trim()) return;
    setLooking(true);
    setResults([]);
    setSelectedIds([]);
    setImportedResults([]);
    try {
      const inputStr = urlOrId.trim();
      const extractedIds = new Set<string>();

      // Extract room IDs from URLs (e.g. rooms/12345)
      const roomMatches = Array.from(inputStr.matchAll(/rooms\/(\d+)/gi));
      for (const m of roomMatches) {
        if (m[1]) extractedIds.add(m[1]);
      }

      // Extract standalone numeric IDs (8 to 20 digits)
      const numMatches = Array.from(inputStr.matchAll(/\b(\d{8,20})\b/g));
      for (const m of numMatches) {
        const idStr = m[1];
        // Ignore user profile IDs if present in text
        if (idStr && !inputStr.includes(`/users/profile/${idStr}`) && !inputStr.includes(`/users/show/${idStr}`)) {
          extractedIds.add(idStr);
        }
      }

      const targetIds = Array.from(extractedIds).slice(0, 10);
      if (targetIds.length === 0) {
        throw new Error("No valid Airbnb listing IDs or room URLs found. Please paste listing links or numeric IDs.");
      }

      // Query AirROI for each listing ID in parallel
      const lookupPromises = targetIds.map(async (id) => {
        try {
          const { data, error } = await supabase.functions.invoke("airroi-listing-lookup", {
            body: { listingId: id },
          });
          if (error || data?.error) return null;
          return data as LookupResult;
        } catch {
          return null;
        }
      });

      const responses = await Promise.all(lookupPromises);
      const list = responses.filter((item): item is LookupResult => item !== null && Boolean(item.listingId));

      if (list.length === 0) {
        throw new Error("Could not find listing details from AirROI. Please verify the listing IDs/URLs.");
      }

      setResults(list);
      setSelectedIds(list.map((item) => item.listingId));
      toast({ title: `Found ${list.length} listing(s)`, description: "Select the listings you wish to import below." });
    } catch (err) {
      toast({ title: "Couldn't find listing(s)", description: err instanceof Error ? err.message : "Please check the URL/ID.", variant: "destructive" });
    } finally {
      setLooking(false);
    }
  };

  const handleImport = async () => {
    if (selectedIds.length === 0) {
      toast({ title: "No listings selected", description: "Please select at least one listing to import.", variant: "destructive" });
      return;
    }
    if (!hostEmail.trim() || !hostEmail.includes("@")) {
      toast({ title: "Host email required", description: "Enter the host's Wayzyy account email.", variant: "destructive" });
      return;
    }
    if (consentNote.trim().length < 5) {
      toast({ title: "Consent note required", description: "Record how/when the host approved this, e.g. \"Confirmed via WhatsApp 23 Jul\".", variant: "destructive" });
      return;
    }

    setImporting(true);
    const newlyImported: { id: string; listingId: string }[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        const { data, error } = await supabase.functions.invoke("airroi-import-listing", {
          body: { listingId: id, hostEmail: hostEmail.trim(), consentNote: consentNote.trim() },
        });
        if (error || data?.error) throw new Error(data?.error ?? error?.message ?? "Import failed");
        newlyImported.push({ id: data.propertyId, listingId: id });
        successCount++;
      } catch (e) {
        console.error(`Import failed for ${id}:`, e);
        failCount++;
      }
    }

    setImporting(false);
    setImportedResults(newlyImported);

    if (successCount > 0) {
      toast({
        title: `Imported ${successCount} listing(s)`,
        description: failCount > 0 ? `${failCount} failed.` : "All created as pending review listings.",
      });
    } else {
      toast({ title: "Import failed", description: "Could not import selected listings.", variant: "destructive" });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === results.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(results.map((r) => r.listingId));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl">Import existing Airbnb listings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste single or multiple Airbnb listing links or numeric IDs (separated by commas or lines, up to 10 max).
        Creates <span className="font-medium text-foreground">pending review</span> listings for host confirmation on Wayzyy.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
        <Textarea
          value={urlOrId}
          onChange={(e) => setUrlOrId(e.target.value)}
          placeholder="Paste Airbnb listing link(s) or numeric ID(s)... e.g.:&#10;https://www.airbnb.com/rooms/1041747980845934345&#10;1062861888540276995"
          rows={3}
          className="font-mono text-xs"
        />
        <Button onClick={handleLookup} disabled={looking || !urlOrId.trim()} className="shrink-0 gap-1.5 h-auto py-3 sm:py-6">
          {looking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Look up
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="font-medium text-sm">
              Found {results.length} listing(s) ({selectedIds.length} selected)
            </p>
            <Button variant="outline" size="sm" onClick={toggleSelectAll}>
              {selectedIds.length === results.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="space-y-4">
            {results.map((item) => {
              const isSelected = selectedIds.includes(item.listingId);
              const importedInfo = importedResults.find((r) => r.listingId === item.listingId);

              return (
                <div
                  key={item.listingId}
                  className={`rounded-2xl border p-5 transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.listingId)}
                        className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium">{item.name ?? "Untitled listing"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ID: {item.listingId}
                          {item.hostName && ` · Host: ${item.hostName}`}
                          {item.location?.locality && ` · ${item.location.locality}`}
                          {item.details && ` · ${item.details.bedrooms ?? "?"} bed · ${item.details.guests ?? "?"} guests`}
                          {(item.pricing?.rate_per_night || item.pricing?.nightly_price || item.pricing?.price || item.pricing?.amount) &&
                            ` · ₹${(item.pricing.rate_per_night || item.pricing.nightly_price || item.pricing.price || item.pricing.amount)?.toLocaleString("en-IN")} / night`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {item.photoUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {item.photoUrls.slice(0, 4).map((url, i) => (
                        <img key={i} src={url} alt="" className="aspect-square w-full rounded-lg border border-border object-cover" />
                      ))}
                    </div>
                  )}

                  {importedInfo && (
                    <div className="mt-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-700 dark:text-green-400">
                      Imported as pending listing! <Link to={`/adminn/review/${importedInfo.id}`} className="underline font-medium">Review in Admin Panel</Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium">Import Configuration</h3>
            <div>
              <Label htmlFor="hostEmail">Host's Wayzyy account email</Label>
              <Input id="hostEmail" value={hostEmail} onChange={(e) => setHostEmail(e.target.value)} placeholder="host@example.com" />
              <p className="mt-1 text-xs text-muted-foreground">The account email of the host being onboarded.</p>
            </div>
            <div>
              <Label htmlFor="consentNote">How did the host approve this?</Label>
              <Textarea
                id="consentNote"
                value={consentNote}
                onChange={(e) => setConsentNote(e.target.value)}
                placeholder='e.g. "Confirmed via WhatsApp with Kriti on 23 Jul, she owns these listings and approved importing"'
                rows={2}
              />
            </div>
            <Button onClick={handleImport} disabled={importing || selectedIds.length === 0} className="w-full gap-2 bg-ember text-white hover:bg-ember/90">
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Import {selectedIds.length} Selected Listing(s)
            </Button>
          </div>

          {/* Import Verification & Policy Disclosures */}
          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Wayzyy Property Import & Verification Policy
              </h4>
              <Link to="/policies/property-import-policy" target="_blank" className="text-xs text-primary font-medium hover:underline">
                Read Full Policy →
              </Link>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When importing listings on behalf of hosts, all third-party guest reviews, star ratings, and algorithmic pricing are intentionally excluded. Imported properties are created in <span className="font-semibold text-foreground">pending review</span> state for manual host price configuration and identity verification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAirroiImport() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Import Airbnb listing — Wayzyy Admin" description="Import a host's existing Airbnb listing with their approval." noindex />
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/adminn" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
        </Link>
        <ThemeToggle />
      </header>
      <AuthGate>
        <ImportTool />
      </AuthGate>
    </div>
  );
}
