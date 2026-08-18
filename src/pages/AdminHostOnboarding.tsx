import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Loader2, Rocket, ShieldCheck, XCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "hello@wayzyy.com";

type Status = "received" | "verifying" | "published" | "rejected";

interface Submission {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  airbnb_profile_url: string | null;
  property_urls: string[] | null;
  status: Status | null;
  notes: string | null;
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

function statusBadge(status: Status | null) {
  if (status === "verifying") return { label: "Verifying", className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
  if (status === "published") return { label: "Published", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
  if (status === "rejected") return { label: "Rejected", className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" };
  return { label: "Received", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
}

function HostOnboardingQueue() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | Status>("all");

  const fetchSubmissions = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin-host-onboarding", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to load submissions");
      setSubmissions(body.submissions ?? []);
    } catch (err: any) {
      toast({ title: "Couldn't load submissions", description: err?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token]);

  const handleStatus = async (id: string, status: Status) => {
    if (!session?.access_token) return;
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin-host-onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ id, status }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to update status");
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      toast({ title: `Marked ${status}` });
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = submissions.filter((s) => tab === "all" || (s.status ?? "received") === tab);

  const counts = {
    all: submissions.length,
    received: submissions.filter((s) => (s.status ?? "received") === "received").length,
    verifying: submissions.filter((s) => s.status === "verifying").length,
    published: submissions.filter((s) => s.status === "published").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Host Onboarding Submissions</h1>
          <p className="text-sm text-muted-foreground">{submissions.length} host{submissions.length === 1 ? "" : "s"} submitted properties</p>
        </div>
        <Link to="/adminn" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Admin home
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-border pb-2 text-xs font-medium">
        {(["all", "received", "verifying", "published", "rejected"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 capitalize transition-colors ${
              tab === t ? "bg-card font-semibold text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No submissions in this view.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => {
            const badge = statusBadge(s.status);
            const urls = [...(s.property_urls ?? []), ...(s.airbnb_profile_url ? [s.airbnb_profile_url] : [])];
            return (
              <div key={s.id} className="rounded-2xl border border-border bg-card/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{s.full_name}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.email} · {s.phone}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Submitted {new Date(s.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingId === s.id || s.status === "rejected"}
                      onClick={() => handleStatus(s.id, "rejected")}
                      className="gap-1 border-red-500/30 text-xs text-red-600 hover:bg-red-500/10 hover:text-red-700"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingId === s.id || s.status === "verifying"}
                      onClick={() => handleStatus(s.id, "verifying")}
                      className="gap-1 border-blue-500/30 text-xs text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
                    >
                      {processingId === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      Verifying
                    </Button>
                    <Button
                      size="sm"
                      disabled={processingId === s.id || s.status === "published"}
                      onClick={() => handleStatus(s.id, "published")}
                      className="gap-1.5 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      {processingId === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Rocket className="h-3.5 w-3.5" />}
                      Publish
                    </Button>
                  </div>
                </div>

                {urls.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    {urls.map((u) => (
                      <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" /> {new URL(u).hostname.replace("www.", "")}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminHostOnboarding() {
  return (
    <SEO title="Host Onboarding Submissions - Wayzyy Admin" description="Internal admin tool." path="/admin-wayzyy-lol/hosts" noindex>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link to="/" className="text-sm font-semibold">Wayzyy Admin</Link>
            <ThemeToggle />
          </div>
        </header>
        <AuthGate>
          <HostOnboardingQueue />
        </AuthGate>
      </div>
    </SEO>
  );
}
