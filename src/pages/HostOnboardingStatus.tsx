import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Loader2, Send, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Submission = {
  id: string;
  created_at: string;
  full_name: string;
  status: string | null;
  property_count: number;
};

const STATUS_META: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  received: { label: "Received", icon: Clock, className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  verifying: { label: "Being verified", icon: Clock, className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  published: { label: "Live on Wayzyy", icon: CheckCircle2, className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  rejected: { label: "Needs attention", icon: XCircle, className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" },
};

const PROGRESS_STEPS = [
  { key: "received", label: "Submitted", icon: Send },
  { key: "verifying", label: "Being verified", icon: ShieldCheck },
  { key: "published", label: "Live on Wayzyy", icon: Sparkles },
] as const;

/** Horizontal progress flowchart for one submission - mirrors the flowchart
 *  on /host-onboarding itself, but filled in against this host's actual status. */
function ProgressFlow({ status }: { status: string | null }) {
  const currentIndex = status === "rejected" ? -1 : PROGRESS_STEPS.findIndex((s) => s.key === (status ?? "received"));

  if (status === "rejected") {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
        <XCircle className="h-3.5 w-3.5 shrink-0" /> This submission needs attention, we'll reach out by email or phone.
      </div>
    );
  }

  return (
    <div className="mt-4 flex items-center">
      {PROGRESS_STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === PROGRESS_STEPS.length - 1;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  done ? "border-ember bg-ember/15 text-ember" : "border-border bg-muted/30 text-muted-foreground/50"
                }`}
              >
                <step.icon className="h-3.5 w-3.5" />
              </div>
              <span className={`text-center text-[10px] leading-tight ${done ? "font-medium text-foreground" : "text-muted-foreground/60"}`}>
                {step.label}
              </span>
            </div>
            {!isLast && <div className={`mx-1 mb-4 h-px flex-1 ${i < currentIndex ? "bg-ember" : "bg-border"}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function HostOnboardingStatus() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/host-onboarding-status?email=${encodeURIComponent(email)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Couldn't check status");
      setSubmissions(body.submissions ?? []);
      setCheckedEmail(email);
    } catch (err: any) {
      toast({ title: "Couldn't check status", description: err?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SEO
      title="Check your Wayzyy host application status"
      description="Track the status of your Wayzyy property submission — received, being verified, or live."
      path="/host-onboarding/status"
    >
      <div className="relative min-h-screen bg-background text-foreground">
        <header className="mx-auto flex max-w-2xl items-center px-5 py-6">
          <Link to="/host-onboarding" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </header>

        <main className="mx-auto max-w-md px-5 pb-24">
          <h1 className="font-display text-2xl font-bold">Check your status</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter the email you submitted your properties with.
          </p>

          <form onSubmit={checkStatus} className="mt-6 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
            />
            <Button type="submit" variant="cta" disabled={loading} className="shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
            </Button>
          </form>

          {checkedEmail && (
            <div className="mt-6 space-y-4">
              {!submissions || submissions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  We don't have a submission on file for {checkedEmail} yet.{" "}
                  <Link to="/host-onboarding" className="font-medium text-ember hover:underline">
                    Submit your properties
                  </Link>
                  .
                </div>
              ) : (
                submissions.map((s) => {
                  const meta = STATUS_META[s.status ?? "received"] ?? STATUS_META.received;
                  return (
                    <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{s.full_name}</p>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
                          <meta.icon className="h-3 w-3" /> {meta.label}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Submitted {new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {s.property_count > 0 && ` · ${s.property_count} propert${s.property_count === 1 ? "y" : "ies"} shared`}
                      </p>
                      <ProgressFlow status={s.status} />
                    </div>
                  );
                })
              )}

              <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
                Want to see how the host section looks? You can{" "}
                <Link to="/host" className="font-medium text-ember hover:underline">
                  create your account at wayzyy.com/host
                </Link>{" "}
                any time, separately from this submission.
              </div>
            </div>
          )}
        </main>
      </div>
    </SEO>
  );
}
