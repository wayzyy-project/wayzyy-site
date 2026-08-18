import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Loader2, Mail, XCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Submission = {
  id: string;
  created_at: string;
  full_name: string;
  status: string | null;
  property_urls: string[] | null;
  airbnb_profile_url: string | null;
};

const STATUS_META: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  received: { label: "Received", icon: Clock, className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  verifying: { label: "Being verified", icon: Clock, className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  published: { label: "Live on Wayzyy", icon: CheckCircle2, className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  rejected: { label: "Needs attention", icon: XCircle, className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" },
};

export default function HostOnboardingStatus() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [fetching, setFetching] = useState(false);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/host-onboarding/status`,
      },
    });
    setSending(false);
    if (error) {
      toast({ title: "Couldn't send the link", description: error.message, variant: "destructive" });
      return;
    }
    setLinkSent(true);
  };

  useEffect(() => {
    if (!user?.email) return;
    setFetching(true);
    supabase
      .from("host_onboarding_submissions")
      .select("id, created_at, full_name, status, property_urls, airbnb_profile_url")
      .eq("email", user.email)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setFetching(false);
        if (!error) setSubmissions(data as Submission[]);
      });
  }, [user?.email]);

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
            Enter the email you submitted your properties with, and we'll send you a secure sign-in link. No password needed.
          </p>

          {authLoading || fetching ? (
            <div className="mt-10 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <div className="mt-6 space-y-4">
              {!submissions || submissions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  We don't have a submission on file for {user.email} yet.{" "}
                  <Link to="/host-onboarding" className="font-medium text-ember hover:underline">
                    Submit your properties
                  </Link>
                  .
                </div>
              ) : (
                submissions.map((s) => {
                  const meta = STATUS_META[s.status ?? "received"] ?? STATUS_META.received;
                  const urlCount = (s.property_urls?.length ?? 0) + (s.airbnb_profile_url ? 1 : 0);
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
                        {urlCount > 0 && ` · ${urlCount} propert${urlCount === 1 ? "y" : "ies"} shared`}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          ) : linkSent ? (
            <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 text-center">
              <Mail className="h-6 w-6 text-ember" />
              <p className="text-sm font-medium">Check your inbox</p>
              <p className="text-xs text-muted-foreground">
                We sent a sign-in link to {email}. Open it on this device to see your status.
              </p>
            </div>
          ) : (
            <form onSubmit={sendLink} className="mt-6 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
              />
              <Button type="submit" variant="cta" size="pill-lg" disabled={sending} className="w-full">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send me a sign-in link"}
              </Button>
            </form>
          )}
        </main>
      </div>
    </SEO>
  );
}
