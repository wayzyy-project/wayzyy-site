import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "hello@wayzyy.com";

interface Submission {
  id: string;
  created_at: string;
  booking_ref: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  linkedin: string | null;
  github: string | null;
  status: string | null;
  written_pitch: string;
  techniques: string[] | null;
  safety_approach: string | null;
  metrics: string | null;
  cost_estimate: string | null;
  past_work_repo: string | null;
  video_link: string;
  availability: string | null;
  earliest_start_date: string | null;
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

function statusBadge(status: string | null) {
  if (status === "approved") return { label: "Approved", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
  if (status === "rejected") return { label: "Rejected", className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" };
  return { label: "Pending review", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
}

function GigChallengeQueue() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const fetchSubmissions = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin-gig-challenge", {
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

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    if (!session?.access_token) return;
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin-gig-challenge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ id, status }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to update status");
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      toast({ title: status === "approved" ? "Marked approved" : "Marked rejected" });
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = submissions.filter((s) => {
    if (tab === "all") return true;
    if (tab === "pending") return !s.status || s.status === "pending";
    return s.status === tab;
  });

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => !s.status || s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Gig Challenge Submissions</h1>
          <p className="text-sm text-muted-foreground">{submissions.length} total application{submissions.length === 1 ? "" : "s"}</p>
        </div>
        <Link to="/adminn" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Admin home
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-1 border-b border-border pb-2 text-xs font-medium">
        {(["all", "pending", "approved", "rejected"] as const).map((t) => (
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
                      {s.email} {s.phone ? `· ${s.phone}` : ""} {s.city ? `· ${s.city}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Submitted {new Date(s.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                      {s.booking_ref ? ` · Ref ${s.booking_ref}` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
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
                      disabled={processingId === s.id || s.status === "approved"}
                      onClick={() => handleStatus(s.id, "approved")}
                      className="gap-1.5 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      {processingId === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      Approve
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pitch</p>
                    <p className="mt-1 text-foreground/90 whitespace-pre-wrap">{s.written_pitch}</p>
                  </div>
                  <div className="space-y-2">
                    {s.safety_approach && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Safety approach</p>
                        <p className="mt-1 text-foreground/90 whitespace-pre-wrap">{s.safety_approach}</p>
                      </div>
                    )}
                    {s.metrics && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Metrics</p>
                        <p className="mt-1 text-foreground/90">{s.metrics}</p>
                      </div>
                    )}
                    {s.cost_estimate && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cost estimate</p>
                        <p className="mt-1 text-foreground/90">{s.cost_estimate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {s.techniques && s.techniques.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.techniques.map((t) => (
                      <span key={t} className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                  <a href={s.video_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> Video walkthrough
                  </a>
                  {s.past_work_repo && (
                    <a href={s.past_work_repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" /> Past work
                    </a>
                  )}
                  {s.github && (
                    <a href={s.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" /> GitHub
                    </a>
                  )}
                  {s.linkedin && (
                    <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                  {s.availability && <span className="text-muted-foreground">Availability: {s.availability}</span>}
                  {s.earliest_start_date && <span className="text-muted-foreground">Earliest start: {s.earliest_start_date}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminGigChallenge() {
  return (
    <SEO title="Gig Challenge Submissions - Wayzyy Admin" description="Internal admin tool." path="/admin-wayzyy-lol" noindex>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link to="/" className="text-sm font-semibold">Wayzyy Admin</Link>
            <ThemeToggle />
          </div>
        </header>
        <AuthGate>
          <GigChallengeQueue />
        </AuthGate>
      </div>
    </SEO>
  );
}
