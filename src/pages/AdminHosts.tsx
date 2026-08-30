import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Loader2, Mail, Search, UserPlus, Upload, Users } from "lucide-react";
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
    if (!q) return hosts;
    return hosts.filter(
      (h) =>
        (h.full_name || "").toLowerCase().includes(q) ||
        (h.email || "").toLowerCase().includes(q) ||
        (h.phone || "").toLowerCase().includes(q)
    );
  }, [hosts, query]);

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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
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
                    <p className="font-semibold text-foreground truncate">{h.full_name || "Unnamed host"}</p>
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
                  </div>
                </div>

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
