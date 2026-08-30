import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Copy, Loader2, Mail, Search, UserPlus, Upload, Users } from "lucide-react";
import { ImportListingModal, type ImportTargetHost } from "@/components/host/ImportListingModal";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

/** The stages an admin actually works through, in order. Each is a real
 *  "someone has to do something" state, not just a status rename. */
type FilterKey = "all" | "form" | "needs_import" | "awaiting_pricing" | "to_approve" | "live";

const FILTERS: { key: FilterKey; label: string; hint: string }[] = [
  { key: "all", label: "All hosts", hint: "Every registered account" },
  { key: "form", label: "Sent us links", hint: "Filled the concierge form" },
  { key: "needs_import", label: "Needs import", hint: "Sent links, nothing imported yet" },
  { key: "awaiting_pricing", label: "Awaiting host pricing", hint: "We imported, host hasn't priced" },
  { key: "to_approve", label: "Ready to approve", hint: "Host priced it — your turn" },
  { key: "live", label: "Live", hint: "Published and bookable" },
];

function matchesFilter(h: HostRow, f: FilterKey): boolean {
  const c = h.propertyCounts;
  if (f === "all") return true;
  if (f === "form") return !!h.submission;
  if (f === "needs_import") return !!h.submission && c.total === 0;
  if (f === "awaiting_pricing") return c.draft > 0;
  if (f === "to_approve") return c.pending_review > 0;
  if (f === "live") return c.active > 0;
  return true;
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

function HostDirectory() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [hosts, setHosts] = useState<HostRow[]>([]);
  const [waitlistLeads, setWaitlistLeads] = useState<WaitlistLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [importTarget, setImportTarget] = useState<ImportTargetHost | null>(null);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

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
    const byStage = hosts.filter((h) => matchesFilter(h, filter));
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/adminn" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Registered Hosts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every registered account. Find a host, import their properties directly into their account, then notify them once you're done.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stage filters - each one answers "who needs something from me
          right now?", which is the actual question when working this
          queue. Counts come from the same host list so an empty stage is
          visibly empty rather than requiring a click to find out. */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = hosts.filter((h) => matchesFilter(h, f.key)).length;
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              title={f.hint}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${isActive ? "opacity-80" : "opacity-60"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No hosts match "{query}".
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => {
            const c = h.propertyCounts;
            return (
              <div key={h.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate">{h.full_name || "Unnamed host"}</p>
                      {h.submission && (
                        <span className="shrink-0 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                          Sent us links
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{h.email}{h.phone ? ` · ${h.phone}` : ""}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Joined {new Date(h.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {c.draft > 0 && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        {c.draft} needs pricing
                      </span>
                    )}
                    {c.pending_review > 0 && (
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        {c.pending_review} pending review
                      </span>
                    )}
                    {c.active > 0 && (
                      <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-600 dark:text-green-400">
                        {c.active} live
                      </span>
                    )}
                    {c.total === 0 && (
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">No properties yet</span>
                    )}
                    {c.total > 0 && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}
                        className="flex items-center gap-0.5 rounded-full px-1.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        {expandedId === h.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Per-property breakdown - the two admin-facing stages
                    (imported, waiting on the host's own pricing) vs
                    (host has priced + approved, waiting on our final
                    go/no-go) need to be visible per host, not just as an
                    aggregate count, otherwise there's no way to tell which
                    specific property needs which kind of attention. */}
                {expandedId === h.id && (
                  <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {/* What they actually sent us through the concierge
                        form. Kept right next to the import button so the
                        links don't have to be hunted down in a separate
                        queue before importing them. */}
                    {h.submission && (h.submission.propertyUrls.length > 0 || h.submission.airbnbProfileUrl) && (
                      <div className="mb-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                          Links they sent us ({h.submission.propertyUrls.length})
                        </p>
                        {h.submission.airbnbProfileUrl && (
                          <a
                            href={h.submission.airbnbProfileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-1.5 block truncate text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                          >
                            Host profile: {h.submission.airbnbProfileUrl}
                          </a>
                        )}
                        <div className="space-y-1">
                          {h.submission.propertyUrls.map((url, i) => {
                            const alreadyImported = h.properties.some((p) => p.source_url && url.includes(p.source_url.split("/rooms/")[1] ?? " "));
                            return (
                              <div key={i} className="flex items-center gap-2">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="min-w-0 flex-1 truncate text-[11px] text-primary hover:underline"
                                >
                                  {url}
                                </a>
                                {alreadyImported && (
                                  <span className="shrink-0 text-[10px] font-semibold text-green-600 dark:text-green-400">imported</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(url);
                                    toast({ title: "Link copied", description: "Paste it into the import box." });
                                  }}
                                  className="shrink-0 text-muted-foreground hover:text-foreground"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {h.properties.map((prop) => (
                      <div key={prop.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{prop.title || "Untitled listing"}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {prop.price_per_night ? `₹${prop.price_per_night.toLocaleString("en-IN")}/night` : "No price set"}
                            {prop.imported_by_admin ? " · imported by our team" : ""}
                          </p>
                        </div>
                        {prop.status === "draft" && (
                          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            Waiting on host pricing
                          </span>
                        )}
                        {prop.status === "pending_review" && (
                          <Link
                            to={`/adminn/review/${prop.id}`}
                            className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 hover:bg-amber-500/25 dark:text-amber-400"
                          >
                            Ready for final approve →
                          </Link>
                        )}
                        {prop.status === "active" && (
                          <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">Live</span>
                        )}
                        {prop.status === "rejected" && (
                          <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">Rejected</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImportTarget({ id: h.id, email: h.email || "", name: h.full_name || "" })}
                    className="gap-1.5 text-xs"
                  >
                    <Upload className="h-3.5 w-3.5" /> Import property
                  </Button>
                  {c.draft > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleNotify(h)}
                      disabled={notifyingId === h.id}
                      className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                    >
                      {notifyingId === h.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                      Notify host ({c.draft} ready)
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* People who filled the pre-launch waitlist form but never actually
          created an account - no auth.users row exists for them, so
          there's no account to import a property into yet. This is the
          gap between "expressed interest / sent us their links on
          WhatsApp" and "shows up in the list above" - shown here so
          nobody gets lost in between, not as an import target. */}
      <div className="mt-10">
        <h2 className="font-display text-lg font-bold flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-muted-foreground" /> Waitlist Leads
          <span className="text-xs font-normal text-muted-foreground">({filteredLeads.length} not registered yet)</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Filled the waitlist form but haven't created a Wayzyy account. Reach out and get them signed up before you can import for them.
        </p>

        {loading ? null : filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No unconverted waitlist leads{query ? ` match "${query}"` : ""}.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLeads.map((l) => (
              <div key={l.id} className="rounded-xl border border-border bg-card p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{l.name || l.email}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {l.email}{l.phone ? ` · ${l.phone}` : ""}{l.city ? ` · ${l.city}` : ""}
                  </p>
                  {l.notes && <p className="text-[11px] text-muted-foreground mt-0.5 truncate">"{l.notes}"</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(l.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(l.email);
                      toast({ title: "Copied", description: l.email });
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy email
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ImportListingModal
        isOpen={!!importTarget}
        targetHost={importTarget}
        onClose={() => setImportTarget(null)}
        onSuccess={fetchHosts}
      />
    </div>
  );
}

export default function AdminHosts() {
  return (
    <AuthGate>
      <SEO title="Registered Hosts | Wayzyy Admin" description="Admin directory of registered hosts." noindex />
      <HostDirectory />
    </AuthGate>
  );
}
