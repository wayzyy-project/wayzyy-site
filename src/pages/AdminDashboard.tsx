import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  DownloadCloud,
  FileCheck2,
  Home,
  Loader2,
  LogOut,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "hello@wayzyy.com";

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
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-ember" />
          <h1 className="font-display text-2xl">Admin Sign In</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Restricted access for Wayzyy system administration.
        </p>
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
            if (error)
              toast({
                title: "Sign in failed",
                description: error.message,
                variant: "destructive",
              });
          }}
          className="bg-ember hover:bg-ember/90 text-white"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in to Dashboard"}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

function DashboardContent() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [pendingProperties, setPendingProperties] = useState<number>(0);
  const [pendingVerifications, setPendingVerifications] = useState<number>(0);
  const [totalListings, setTotalListings] = useState<number>(0);
  const [pendingOnboarding, setPendingOnboarding] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [pendingPropRes, totalPropRes, pendingVerifRes, pendingOnboardingRes] = await Promise.all([
          supabase.from("properties").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
          supabase.from("properties").select("id", { count: "exact", head: true }),
          supabase.from("identity_verifications").select("id", { count: "exact", head: true }).eq("status", "submitted"),
          supabase.from("host_onboarding_submissions").select("id", { count: "exact", head: true }).eq("status", "received"),
        ]);

        setPendingProperties(pendingPropRes.count ?? 0);
        setTotalListings(totalPropRes.count ?? 0);
        setPendingVerifications(pendingVerifRes.count ?? 0);
        setPendingOnboarding(pendingOnboardingRes.count ?? 0);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-ember/10 px-3 py-1 text-xs font-semibold text-ember">
              System Admin
            </span>
            <span className="text-xs text-muted-foreground">{ADMIN_EMAIL}</span>
          </div>
          <h1 className="font-display text-2xl mt-2">Wayzyy Executive Control Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage listing approvals, host identity verifications, and AirROI property imports.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-2 shrink-0">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Live Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Pending Property Reviews</p>
            <Building2 className="h-4 w-4 text-amber-500" />
          </div>
          <p className="font-display text-3xl mt-2">
            {loadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : pendingProperties}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting price & photo verification</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Pending Verifications</p>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </div>
          <p className="font-display text-3xl mt-2">
            {loadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : pendingVerifications}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Aadhaar, PAN & Passport submissions</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total Listings</p>
            <Home className="h-4 w-4 text-green-500" />
          </div>
          <p className="font-display text-3xl mt-2">
            {loadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : totalListings}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Properties in database</p>
        </div>
      </div>

      {/* Navigation Hub Cards */}
      <div className="space-y-4">
        <h2 className="font-display text-xl">Admin Workflows</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: AirROI Import */}
          <div
            onClick={() => navigate("/adminn/import-airbnb")}
            className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-ember hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember/10 text-ember transition-colors group-hover:bg-ember group-hover:text-white">
              <DownloadCloud className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg mt-4 group-hover:text-ember transition-colors">
              Import Airbnb Listings
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Import host listings via AirROI with multi-link lookup, photo re-hosting, and automatic amenity translation.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-ember">
              Open Importer →
            </div>
          </div>

          {/* Card 2: Property Reviews */}
          <div
            onClick={() => navigate("/adminn/listings")}
            className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-ember hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg mt-4 group-hover:text-amber-500 transition-colors">
              Listing Approval Queue
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Review property submissions, score completeness & photo quality, confirm rates, and approve listings.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-500">
              Review Listings ({pendingProperties}) →
            </div>
          </div>

          {/* Card 3: Identity Verifications */}
          <div
            onClick={() => navigate("/adminn/verifications")}
            className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-ember hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg mt-4 group-hover:text-blue-500 transition-colors">
              Host Identity Verification
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Review host government ID documents, selfies, signed document links, and grant verified host status.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-500">
              View Verifications ({pendingVerifications}) →
            </div>
          </div>

          {/* Card 4: Onboarding Hosts */}
          <div
            onClick={() => navigate("/adminn/onboarding-hosts")}
            className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-ember hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg mt-4 group-hover:text-emerald-500 transition-colors">
              Onboarding Hosts
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Review the properties hosts have submitted, mark them as verifying or published, updates reflect on their status page.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
              Review Submissions ({pendingOnboarding}) →
            </div>
          </div>

          {/* Card 5: Registered Hosts directory */}
          <div
            onClick={() => navigate("/adminn/hosts")}
            className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-ember hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 transition-colors group-hover:bg-violet-500 group-hover:text-white">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg mt-4 group-hover:text-violet-500 transition-colors">
              Registered Hosts
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Every registered account. Find a host, import properties straight into their account, then notify them once you're done.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-violet-500">
              Browse Hosts →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="System Admin Control Hub - Wayzyy" description="Executive control panel for Wayzyy administration." noindex />
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Wayzyy
        </Link>
        <ThemeToggle />
      </header>
      <AuthGate>
        <DashboardContent />
      </AuthGate>
    </div>
  );
}
