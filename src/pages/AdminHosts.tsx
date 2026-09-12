import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowUpRight, Check, Copy, Loader2, Mail, Phone, Search, Trash2, Upload,
} from "lucide-react";
import { ImportListingModal, type ImportTargetHost } from "@/components/host/ImportListingModal";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ADMIN_EMAIL = "hello@wayzyy.com";

interface HostRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  propertyCounts: { draft: number; pending_review: number; active: number; rejected: number; total: number };
  properties: HostProperty[];
  submission: HostSubmission | null;
  /** Manual pipeline stage set from this page. Never inferred. */
  stage: StageKey;
}

interface HostSubmission {
  id: string;
  status: string | null;
  propertyUrls: string[];
  airbnbProfileUrl: string | null;
  createdAt: string;
}

interface HostProperty {
  id: string;
  title: string | null;
  status: string;
  price_per_night: number | null;
  imported_by_admin: boolean;
  source_url: string | null;
}

interface WaitlistLead {
  id: string;
  created_at: string;
  email: string;
  audience?: string | null;
  city?: string | null;
  phone?: string | null;
  notes?: string | null;
  name?: string | null;
}

/* ------------------------------------------------------------------ */
/* Deriving what actually needs doing                                  */
/* ------------------------------------------------------------------ */

/** Both a submitted Airbnb link and a property's stored source_url reduce
 *  to the same room id, which is the only reliable way to tell whether a
 *  given link has already been imported - the URLs themselves differ by
 *  tracking params, locale domain, and share suffixes. */
function roomIdOf(url: string | null | undefined): string | null {
  if (!url) return null;
  const room = url.match(/rooms\/(\d+)/i);
  if (room?.[1]) return room[1];
  const bare = url.match(/\b(\d{8,20})\b/);
  return bare?.[1] ?? null;
}

interface HostSignals {
  /** Links this host sent that we haven't imported yet. */
  pendingLinks: string[];
  /** They sent a host profile URL instead of individual links, and we
   *  haven't imported anything for them yet. The form offers this as the
   *  "fastest option", so it's a real submission that still needs work -
   *  it just can't be counted in links. */
  profileOnlyPending: boolean;
  /** Room ids we've already imported, for per-link markers in the detail view. */
  importedRoomIds: Set<string>;
  /** True when no property carries a source_url, so import state can't be
   *  proven either way (properties created before source_url was stored).
   *  We say nothing rather than claiming links are pending. */
  matchUnavailable: boolean;
}

function signalsFor(h: HostRow): HostSignals {
  const submitted = h.submission?.propertyUrls ?? [];
  const importedRoomIds = new Set(
    h.properties.map((p) => roomIdOf(p.source_url)).filter((x): x is string => !!x)
  );
  // With properties on file but not one source_url among them, matching is
  // impossible - claiming every link is un-imported would be worse than
  // staying quiet, so the signal is suppressed instead of guessed.
  const matchUnavailable = h.properties.length > 0 && importedRoomIds.size === 0;
  const pendingLinks = matchUnavailable
    ? []
    : submitted.filter((url) => {
        const id = roomIdOf(url);
        return id ? !importedRoomIds.has(id) : true;
      });
  // A profile-URL submission carries no individual links, so pendingLinks
  // is 0 and the host would drop out of the import queue entirely despite
  // having asked us to import their whole portfolio.
  const profileOnlyPending =
    !!h.submission?.airbnbProfileUrl && submitted.length === 0 && h.properties.length === 0;

  return { pendingLinks, importedRoomIds, matchUnavailable, profileOnlyPending };
}

/** The stages an admin actually works through. Each is a real "someone has
 *  to do something" state, not a status rename. */
type FilterKey = "all" | "to_import" | "awaiting_pricing" | "to_approve" | "live";

/** The manual pipeline. Deliberately separate from FILTERS above: those are
 *  derived from the data and answer "whose move is it right now", this is
 *  set by hand and answers "where is this relationship". A host can be
 *  "commercials" here and still be sitting in "You: import links" there -
 *  both are true, and collapsing them into one axis would hide one of them. */
export type StageKey = "new" | "commercials" | "reviewing" | "final_stage" | "live";

const STAGES: { key: StageKey; label: string; className: string }[] = [
  { key: "new",         label: "New",         className: "bg-muted text-muted-foreground" },
  { key: "commercials", label: "Commercials", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { key: "reviewing",   label: "Reviewing",   className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { key: "final_stage", label: "Final stage", className: "bg-ember/10 text-ember" },
  { key: "live",        label: "Live",        className: "bg-green-500/10 text-green-600 dark:text-green-400" },
];

const STAGE_BY_KEY: Record<StageKey, { label: string; className: string }> = Object.fromEntries(
  STAGES.map((s) => [s.key, { label: s.label, className: s.className }]),
) as Record<StageKey, { label: string; className: string }>;

/** Labels name whose move it is, because that's the only thing being
 *  scanned for. "With the host" tested badly - it didn't say whether the
 *  listing was on its way out or on its way back, and it sits *before*
 *  any approval, not after. Each entry also carries the sentence shown
 *  under the row explaining the state in full, since a two-word pill
 *  can't carry that on its own and a tooltip nobody hovers can't either. */
const FILTERS: { key: FilterKey; label: string; explain: string }[] = [
  { key: "all", label: "Everyone", explain: "Every registered account, whatever stage they're at." },
  {
    key: "to_import",
    label: "You: import links",
    explain: "They sent us their listings through the form — either individual links or their whole Airbnb host profile — and we haven't imported anything yet. Open a host to see exactly what they sent.",
  },
  {
    key: "awaiting_pricing",
    label: "Host: set pricing",
    explain: "We've imported these into the host's dashboard with no price on them. Nothing is approved yet — we're waiting on the host to set their nightly rate and approve. Use Notify to nudge them.",
  },
  {
    key: "to_approve",
    label: "You: final approve",
    explain: "The host has set their pricing and approved. These are waiting on your final approve before they go live.",
  },
  { key: "live", label: "Live", explain: "Approved by you and bookable on Wayzyy right now." },
];

function matchesFilter(h: HostRow, f: FilterKey): boolean {
  const c = h.propertyCounts;
  if (f === "all") return true;
  // Counts un-imported links rather than "has zero properties", so a host
  // whose links were only partly imported still surfaces here instead of
  // silently dropping out of the queue.
  if (f === "to_import") {
    const sig = signalsFor(h);
    return sig.pendingLinks.length > 0 || sig.profileOnlyPending;
  }
  if (f === "awaiting_pricing") return c.draft > 0;
  if (f === "to_approve") return c.pending_review > 0;
  if (f === "live") return c.active > 0;
  return true;
}

const EMPTY_COPY: Record<FilterKey, { title: string; body: string }> = {
  all: { title: "No hosts yet", body: "Registered accounts appear here as people sign up." },
  to_import: { title: "Nothing waiting to import", body: "Everything hosts have sent us is already in their account." },
  awaiting_pricing: { title: "Nothing waiting on a host", body: "Properties you import land here until the host sets their price and approves." },
  to_approve: { title: "Nothing to approve", body: "Listings appear here once a host has priced and approved them." },
  live: { title: "Nothing live yet", body: "Approved listings show up here once they're bookable." },
};

function initialsOf(name: string | null, email: string | null) {
  const source = (name || email || "?").trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */

function HostDirectory() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [hosts, setHosts] = useState<HostRow[]>([]);
  const [waitlistLeads, setWaitlistLeads] = useState<WaitlistLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [importTarget, setImportTarget] = useState<ImportTargetHost | null>(null);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [stageFilter, setStageFilter] = useState<StageKey | "any">("any");
  const [savingStage, setSavingStage] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showLeads, setShowLeads] = useState(false);

  const fetchHosts = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin-hosts", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to load hosts");
      setHosts(body.hosts ?? []);
      setWaitlistLeads(body.waitlistLeads ?? []);
    } catch (err: any) {
      toast({ title: "Couldn't load hosts", description: err?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, [session?.access_token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byStage = hosts
      .filter((h) => matchesFilter(h, filter))
      .filter((h) => stageFilter === "any" || h.stage === stageFilter);
    if (!q) return byStage;
    return byStage.filter(
      (h) =>
        (h.full_name || "").toLowerCase().includes(q) ||
        (h.email || "").toLowerCase().includes(q) ||
        (h.phone || "").toLowerCase().includes(q)
    );
  }, [hosts, query, filter]);

  // A waitlist lead is "converted" once the same email shows up as a real
  // registered account - no point showing them twice in two lists.
  const registeredEmails = useMemo(
    () => new Set(hosts.map((h) => (h.email || "").toLowerCase()).filter(Boolean)),
    [hosts]
  );

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return waitlistLeads
      .filter((l) => !registeredEmails.has((l.email || "").toLowerCase()))
      .filter((l) => {
        if (!q) return true;
        return (
          (l.name || "").toLowerCase().includes(q) ||
          (l.email || "").toLowerCase().includes(q) ||
          (l.phone || "").toLowerCase().includes(q)
        );
      });
  }, [waitlistLeads, registeredEmails, query]);

  const handleStageChange = async (host: HostRow, stage: StageKey) => {
    if (!session?.access_token) return;
    const previous = host.stage;
    // Optimistic: the dropdown should feel instant. Rolled back below if the
    // write fails, so the badge never claims a stage the server rejected.
    setHosts((prev) => prev.map((h) => (h.id === host.id ? { ...h, stage } : h)));
    setSavingStage(host.id);
    try {
      const res = await fetch("/api/admin-hosts", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ hostId: host.id, stage }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to update stage");
    } catch (err: any) {
      setHosts((prev) => prev.map((h) => (h.id === host.id ? { ...h, stage: previous } : h)));
      toast({ title: "Couldn't update stage", description: err?.message, variant: "destructive" });
    } finally {
      setSavingStage(null);
    }
  };

  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  // Deletes one property. Used from the host detail sheet for a draft you
  // just imported and got wrong - re-imported by mistake, wrong listing
  // entirely, host asked you to drop it before it ever reaches them. Not a
  // bulk "clear this host's imports" action: one row, deliberately picked.
  //
  // The database still refuses this for anything with a booking attached
  // (guard_property_deletion), so the only real guard needed here is asking
  // the admin to confirm - a draft or pending_review row has no bookings by
  // definition, since nothing is bookable until it's active.
  const handleDeleteProperty = async (property: HostProperty) => {
    if (!session?.access_token) return;
    const ok = window.confirm(
      `Delete "${property.title || "this listing"}"? This removes the import - it cannot be undone.`,
    );
    if (!ok) return;

    setDeletingPropertyId(property.id);
    try {
      const res = await fetch("/api/admin-hosts", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to delete");
      toast({ title: "Import deleted", description: `"${property.title || "Listing"}" was removed.` });
      await fetchHosts();
    } catch (err: any) {
      toast({ title: "Couldn't delete", description: err?.message, variant: "destructive" });
    } finally {
      setDeletingPropertyId(null);
    }
  };

  const handleNotify = async (host: HostRow) => {
    if (!session?.access_token || !host.email) return;
    setNotifyingId(host.id);
    try {
      const res = await fetch("/api/admin-hosts", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ hostId: host.id, hostEmail: host.email, hostName: host.full_name }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to send email");
      toast({ title: "Host notified", description: `Emailed ${host.full_name || host.email} about ${body.notified} propert${body.notified === 1 ? "y" : "ies"}.` });
    } catch (err: any) {
      toast({ title: "Couldn't notify host", description: err?.message, variant: "destructive" });
    } finally {
      setNotifyingId(null);
    }
  };

  const detailHost = hosts.find((h) => h.id === detailId) ?? null;
  const needsMe = hosts.filter((h) => matchesFilter(h, "to_import") || matchesFilter(h, "to_approve")).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link to="/adminn" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">Hosts</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {loading
              ? "Loading accounts…"
              : needsMe > 0
              ? `${needsMe} host${needsMe === 1 ? "" : "s"} need${needsMe === 1 ? "s" : ""} something from you.`
              : "Everything's handled — nothing waiting on you."}
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const count = hosts.filter((h) => matchesFilter(h, f.key)).length;
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {f.label}
                {count > 0 && <span className="ml-1.5 opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Manual pipeline. Separate row from the derived filters above: one
            says whose move it is, the other says where the relationship is,
            and they combine rather than replace each other. */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Stage
          </span>
          {(["any", ...STAGES.map((st) => st.key)] as (StageKey | "any")[]).map((key) => {
            const meta = key === "any" ? { label: "Any" } : STAGE_BY_KEY[key];
            const count = key === "any" ? hosts.length : hosts.filter((h) => h.stage === key).length;
            const isActive = stageFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStageFilter(key)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {meta.label}
                {count > 0 && <span className="ml-1.5 opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* What the selected stage actually means, spelled out. The counts on
          the pills are hosts, not listings, which is worth saying once
          rather than letting "Live 6" be read as six listings. */}
      <p className="mb-5 text-xs leading-relaxed text-muted-foreground">
        {FILTERS.find((f) => f.key === filter)?.explain}
        {filter !== "all" && (
          <span className="text-muted-foreground/70">
            {" "}Counts are hosts, not listings.
          </span>
        )}
      </p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
              <Skeleton className="mt-4 h-6 w-1/2 rounded-full" />
              <Skeleton className="mt-4 h-8 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-medium text-foreground">
            {query ? `No hosts match "${query}"` : EMPTY_COPY[filter].title}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            {query ? "Try a different name, email, or phone number." : EMPTY_COPY[filter].body}
          </p>
          {query && (
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setQuery("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((h) => (
            <HostCard
              key={h.id}
              host={h}
              notifying={notifyingId === h.id}
              savingStage={savingStage === h.id}
              onStageChange={(stage) => handleStageChange(h, stage)}
              onOpen={() => setDetailId(h.id)}
              onImport={() => setImportTarget({ id: h.id, email: h.email || "", name: h.full_name || "" })}
              onNotify={() => handleNotify(h)}
            />
          ))}
        </div>
      )}

      {/* Waitlist leads never created an account, so they can't be imported
          for - they're a follow-up list, not part of the work queue above.
          Collapsed by default so they don't compete with it. */}
      {!loading && filteredLeads.length > 0 && (
        <div className="mt-10 border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setShowLeads((v) => !v)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <h2 className="font-display text-lg font-semibold">Waitlist leads</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {filteredLeads.length} {filteredLeads.length === 1 ? "person" : "people"} asked to join but never created an account.
              </p>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">{showLeads ? "Hide" : "Show"}</span>
          </button>

          {showLeads && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {filteredLeads.map((l) => (
                <div key={l.id} className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-border px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{l.name || l.email}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {l.email}{l.city ? ` · ${l.city}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(l.email);
                      toast({ title: "Email copied", description: l.email });
                    }}
                    className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={`Copy ${l.email}`}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <HostDetailSheet
        host={detailHost}
        onClose={() => setDetailId(null)}
        onImport={(h) => setImportTarget({ id: h.id, email: h.email || "", name: h.full_name || "" })}
        onNotify={handleNotify}
        notifying={!!detailHost && notifyingId === detailHost.id}
        onDeleteProperty={handleDeleteProperty}
        deletingPropertyId={deletingPropertyId}
      />

      <ImportListingModal
        isOpen={!!importTarget}
        targetHost={importTarget}
        onClose={() => setImportTarget(null)}
        onSuccess={fetchHosts}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function HostCard({
  host, notifying, savingStage, onStageChange, onOpen, onImport, onNotify,
}: {
  host: HostRow;
  notifying: boolean;
  savingStage: boolean;
  onStageChange: (stage: StageKey) => void;
  onOpen: () => void;
  onImport: () => void;
  onNotify: () => void;
}) {
  const c = host.propertyCounts;
  const { pendingLinks, profileOnlyPending } = signalsFor(host);

  // Anything that needs the admin specifically, stated as the thing to do.
  const actions: string[] = [];
  if (pendingLinks.length) actions.push(`${pendingLinks.length} link${pendingLinks.length === 1 ? "" : "s"} to import`);
  else if (profileOnlyPending) actions.push("Sent their Airbnb profile");
  if (c.pending_review) actions.push(`${c.pending_review} ready to approve`);

  // Everything else, stated quietly - it's status, not a task.
  const status: string[] = [];
  if (c.draft) status.push(`${c.draft} awaiting their price`);
  if (c.active) status.push(`${c.active} live`);
  if (!actions.length && !status.length) status.push("No properties yet");

  return (
    // min-w-0 matters: a grid item defaults to min-width:auto, so without it
    // the card refuses to shrink below the intrinsic width of its longest
    // unbreakable string (a long email), blowing past the column and
    // preventing `truncate` from ever engaging on narrow screens.
    <div className="group flex min-w-0 flex-col rounded-xl border border-border bg-card transition-colors hover:border-foreground/25">
      <button
        type="button"
        onClick={onOpen}
        className="flex-1 rounded-t-xl px-4 pt-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ring-1 ring-border">
            {initialsOf(host.full_name, host.email)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium leading-tight">{host.full_name || "Unnamed host"}</p>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STAGE_BY_KEY[host.stage].className}`}
              >
                {STAGE_BY_KEY[host.stage].label}
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">{host.email}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="mt-3.5 min-h-[1.5rem]">
          {actions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {actions.map((a) => (
                <span key={a} className="rounded-full bg-ember/10 px-2.5 py-1 text-[11px] font-semibold text-ember">
                  {a}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{status.join(" · ")}</p>
          )}
        </div>
        {actions.length > 0 && status.length > 0 && (
          <p className="mt-1.5 text-xs text-muted-foreground">{status.join(" · ")}</p>
        )}
      </button>

      {/* Stage picker. A native <select> on purpose: it is one of five values,
          it sits inside a card whose body is itself a button, and a custom
          popover here would fight that click target on touch. */}
      <div className="border-t border-border px-4 pt-3">
        <label className="sr-only" htmlFor={`stage-${host.id}`}>
          Pipeline stage for {host.full_name || host.email || "this host"}
        </label>
        <select
          id={`stage-${host.id}`}
          value={host.stage}
          disabled={savingStage}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStageChange(e.target.value as StageKey)}
          className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          {STAGES.map((st) => (
            <option key={st.key} value={st.key}>
              {st.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center gap-2 px-4 pb-3">
        <Button size="sm" variant="outline" onClick={onImport} className="h-8 flex-1 gap-1.5 text-xs">
          <Upload className="h-3.5 w-3.5" /> Import
        </Button>
        <Button
          size="sm"
          onClick={onNotify}
          disabled={c.draft === 0 || notifying}
          title={c.draft === 0 ? "Nothing to notify about — no properties are awaiting their pricing" : undefined}
          className="h-8 flex-1 gap-1.5 text-xs"
        >
          {notifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
          Notify
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const PROP_STATE: Record<string, { label: string; className: string }> = {
  draft: { label: "Needs their price", className: "bg-muted text-muted-foreground" },
  pending_review: { label: "Approve", className: "bg-ember/10 text-ember" },
  active: { label: "Live", className: "bg-green-500/10 text-green-600 dark:text-green-400" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

function HostDetailSheet({
  host, onClose, onImport, onNotify, notifying, onDeleteProperty, deletingPropertyId,
}: {
  host: HostRow | null;
  onClose: () => void;
  onImport: (h: HostRow) => void;
  onNotify: (h: HostRow) => void;
  onDeleteProperty: (p: HostProperty) => void;
  deletingPropertyId: string | null;
  notifying: boolean;
  savingStage: boolean;
  onStageChange: (stage: StageKey) => void;
}) {
  const { toast } = useToast();
  if (!host) return null;

  const { importedRoomIds, matchUnavailable } = signalsFor(host);
  const submitted = host.submission?.propertyUrls ?? [];

  return (
    <Sheet open={!!host} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground ring-1 ring-border">
              {initialsOf(host.full_name, host.email)}
            </span>
            <span className="min-w-0">
              <span className="block truncate">{host.full_name || "Unnamed host"}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                Joined {new Date(host.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
              </span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-5 space-y-6">
          <div className="space-y-1.5 text-sm">
            {host.email && (
              <a href={`mailto:${host.email}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{host.email}</span>
              </a>
            )}
            {host.phone && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" /> {host.phone}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onImport(host)} className="flex-1 gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Import a property
            </Button>
            <Button
              size="sm"
              onClick={() => onNotify(host)}
              disabled={host.propertyCounts.draft === 0 || notifying}
              className="flex-1 gap-1.5"
            >
              {notifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
              Notify host
            </Button>
          </div>

          {submitted.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Links they sent us
              </h3>
              {host.submission?.airbnbProfileUrl && (
                <a
                  href={host.submission.airbnbProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block truncate text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Host profile: {host.submission.airbnbProfileUrl}
                </a>
              )}
              {matchUnavailable && (
                <p className="mt-2 text-xs text-muted-foreground">
                  These properties predate import tracking, so we can't tell which links are already in.
                </p>
              )}
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {submitted.map((url, i) => {
                  const id = roomIdOf(url);
                  const imported = !matchUnavailable && !!id && importedRoomIds.has(id);
                  return (
                    <li key={i} className="flex items-center gap-2 px-3 py-2">
                      {imported ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" />
                      ) : (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                      )}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`min-w-0 flex-1 truncate text-xs underline-offset-2 hover:underline ${
                          imported ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {url}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          toast({ title: "Link copied", description: "Paste it into the import box." });
                        }}
                        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Copy link"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Properties ({host.properties.length})
            </h3>
            {host.properties.length === 0 ? (
              <p className="mt-2 rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                Nothing imported yet.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {host.properties.map((p) => {
                  const state = PROP_STATE[p.status] ?? { label: p.status, className: "bg-muted text-muted-foreground" };
                  return (
                    <li key={p.id} className="flex items-center gap-2 px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.title || "Untitled listing"}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.price_per_night ? `₹${p.price_per_night.toLocaleString("en-IN")}/night` : "No price set"}
                          {p.imported_by_admin ? " · imported by us" : ""}
                        </p>
                      </div>
                      {p.status === "pending_review" ? (
                        <Link
                          to={`/adminn/review/${p.id}`}
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-opacity hover:opacity-80 ${state.className}`}
                        >
                          {state.label} →
                        </Link>
                      ) : (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${state.className}`}>
                          {state.label}
                        </span>
                      )}
                      {/* Only offered for draft / pending_review - a listing
                          that's gone active is a host's own to remove, from
                          the portal, where the booking guard applies. This
                          is for the "imported it twice by mistake" case,
                          before the host is ever notified. */}
                      {(p.status === "draft" || p.status === "pending_review") && (
                        <button
                          type="button"
                          onClick={() => onDeleteProperty(p)}
                          disabled={deletingPropertyId === p.id}
                          title="Delete this import"
                          aria-label={`Delete ${p.title || "this import"}`}
                          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        >
                          {deletingPropertyId === p.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminHosts() {
  return (
    <AuthGate>
      <SEO title="Hosts | Wayzyy Admin" description="Admin directory of registered hosts." noindex />
      <HostDirectory />
    </AuthGate>
  );
}
