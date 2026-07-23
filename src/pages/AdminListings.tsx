import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "hello@wayzyy.com";

const STATUS_LABEL: Record<string, string> = {
  pending_review: "Pending review",
  active: "Approved",
  rejected: "Rejected",
  inactive: "Inactive",
};

const STATUS_CLASS: Record<string, string> = {
  pending_review: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  active: "bg-green-500/10 text-green-600 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  inactive: "bg-muted text-muted-foreground",
};

interface Listing {
  id: string;
  title: string;
  city: string;
  state: string;
  price_per_night: number;
  images: string[];
  host_email: string;
  status: string;
  created_at: string;
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

function ListingQueue() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"pending" | "all">("pending");
  const [listings, setListings] = useState<Listing[] | null>(null);

  const load = useCallback(async () => {
    setListings(null);
    let query = supabase
      .from("properties")
      .select("id, title, city, state, price_per_night, images, host_email, status, created_at")
      .order("created_at", { ascending: false });
    if (tab === "pending") query = query.eq("status", "pending_review");

    const { data, error } = await query;
    if (error) {
      toast({ title: "Could not load listings", description: error.message, variant: "destructive" });
      setListings([]);
      return;
    }
    setListings((data ?? []) as Listing[]);
  }, [tab, toast]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-2xl">Listing review panel</h1>
          <Link to="/adminn/verifications" className="text-sm text-ember hover:underline">Identity verification queue →</Link>
        </div>
        <div className="flex rounded-full border border-border p-1 text-sm">
          <button
            className={`rounded-full px-3 py-1 transition-colors ${tab === "pending" ? "bg-ember text-white" : "text-muted-foreground"}`}
            onClick={() => setTab("pending")}
          >
            Pending
          </button>
          <button
            className={`rounded-full px-3 py-1 transition-colors ${tab === "all" ? "bg-ember text-white" : "text-muted-foreground"}`}
            onClick={() => setTab("all")}
          >
            All
          </button>
        </div>
      </div>

      {listings === null ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <Home className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {tab === "pending" ? "No listings waiting for review." : "No listings yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => navigate(`/adminn/review/${l.id}`)}
              className="flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:border-ember/50"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                {l.images?.[0] ? (
                  <img src={l.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Home className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-medium">{l.title || "Untitled listing"}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[l.status] ?? "bg-muted text-muted-foreground"}`}>
                    {STATUS_LABEL[l.status] ?? l.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{[l.city, l.state].filter(Boolean).join(", ")} · {l.host_email}</p>
                <p className="mt-0.5 text-sm font-medium">
                  {l.price_per_night ? `₹${l.price_per_night.toLocaleString("en-IN")} / night` : "Price not set"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminListings() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Listing review panel — Wayzyy Admin" description="Review pending listings submitted on Wayzyy." noindex />
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/adminn" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
        </Link>
        <ThemeToggle />
      </header>
      <AuthGate>
        <ListingQueue />
      </AuthGate>
    </div>
  );
}
