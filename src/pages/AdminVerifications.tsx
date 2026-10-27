import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ADMIN_EMAIL = "hello@wayzyy.com";
const DOC_LABELS: Record<string, string> = { aadhaar: "Aadhaar card", pan: "PAN card", passport: "Passport" };

// The list carries no images: submissions store the document photos inline
// (some are several MB each), so selecting them all at once made the queue
// request fail with a 500. Photos are fetched one submission at a time.
interface Submission {
  id: string;
  user_id: string;
  user_email: string | null;
  doc_type: string;
  submitted_at: string;
}

interface SubmissionImages {
  front: string | null;
  back: string | null;
  selfie: string | null;
}

async function signUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  // Older submissions hold the image itself as a data URL, not a storage path.
  if (path.startsWith("data:")) return path;
  const { data } = await supabase.storage.from("identity-verification").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
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

function VerificationQueue() {
  const { toast } = useToast();
  const [items, setItems] = useState<Submission[]>([]);
  const [images, setImages] = useState<Record<string, SubmissionImages>>({});
  const [loadingImagesId, setLoadingImagesId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("identity_verification_submissions")
      .select("id, user_id, user_email, doc_type, submitted_at")
      .eq("status", "pending_review")
      .order("submitted_at", { ascending: true });

    if (error) {
      toast({ title: "Could not load queue", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    setItems(data as Submission[]);
    setLoading(false);
  }, [toast]);

  const showDocuments = async (id: string) => {
    setLoadingImagesId(id);
    const { data, error } = await supabase
      .from("identity_verification_submissions")
      .select("doc_front_url, doc_back_url, selfie_url")
      .eq("id", id)
      .single();
    if (error || !data) {
      setLoadingImagesId(null);
      toast({ title: "Could not load documents", description: error?.message, variant: "destructive" });
      return;
    }
    const [front, back, selfie] = await Promise.all([
      signUrl(data.doc_front_url), signUrl(data.doc_back_url), signUrl(data.selfie_url),
    ]);
    setImages((prev) => ({ ...prev, [id]: { front, back, selfie } }));
    setLoadingImagesId(null);
  };

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: string) => {
    setBusyId(id);
    const { data, error } = await supabase.functions.invoke("approve-identity-verification", {
      body: { submissionId: id },
    });
    setBusyId(null);
    if (error || !data?.success) {
      toast({ title: "Approve failed", description: data?.error ?? error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Approved" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleReject = async (id: string) => {
    setBusyId(id);
    const { data, error } = await supabase.functions.invoke("reject-identity-verification", {
      body: { submissionId: id, reason: rejectReason[id] },
    });
    setBusyId(null);
    if (error || !data?.success) {
      toast({ title: "Reject failed", description: data?.error ?? error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Rejected" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">No pending identity verifications.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-border p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-display text-lg">{DOC_LABELS[item.doc_type] ?? item.doc_type}</p>
              <p className="text-sm text-muted-foreground">
                {item.user_email ?? item.user_id} · {new Date(item.submitted_at).toLocaleString()}
              </p>
            </div>
          </div>

          {!images[item.id] && (
            <Button variant="outline" className="w-full" disabled={loadingImagesId === item.id} onClick={() => showDocuments(item.id)}>
              {loadingImagesId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "View documents"}
            </Button>
          )}

          {images[item.id] && (
          <div className="grid grid-cols-3 gap-3">
            {images[item.id].front && (
              <a href={images[item.id].front!} target="_blank" rel="noreferrer">
                <img src={images[item.id].front!} alt="Document front" className="aspect-[1.586] w-full rounded-lg border border-border object-cover" />
                <p className="mt-1 text-center text-xs text-muted-foreground">Front</p>
              </a>
            )}
            {images[item.id].back && (
              <a href={images[item.id].back!} target="_blank" rel="noreferrer">
                <img src={images[item.id].back!} alt="Document back" className="aspect-[1.586] w-full rounded-lg border border-border object-cover" />
                <p className="mt-1 text-center text-xs text-muted-foreground">Back</p>
              </a>
            )}
            {images[item.id].selfie && (
              <a href={images[item.id].selfie!} target="_blank" rel="noreferrer">
                <img src={images[item.id].selfie!} alt="Selfie" className="aspect-square w-full rounded-lg border border-border object-cover" />
                <p className="mt-1 text-center text-xs text-muted-foreground">Selfie</p>
              </a>
            )}
          </div>
          )}

          <Textarea
            className="mt-4"
            placeholder="Rejection reason (optional - shown to the user if you reject)"
            value={rejectReason[item.id] ?? ""}
            onChange={(e) => setRejectReason((prev) => ({ ...prev, [item.id]: e.target.value }))}
          />

          <div className="mt-3 flex gap-3">
            <Button
              className="flex-1 gap-2"
              disabled={busyId === item.id}
              onClick={() => handleApprove(item.id)}
            >
              {busyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              disabled={busyId === item.id}
              onClick={() => handleReject(item.id)}
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminVerifications() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Identity verification queue - Wayzyy Admin" description="Review manual identity verification submissions." noindex />
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/adminn" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
        </Link>
        <ThemeToggle />
      </header>
      <div className="px-4 pt-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <h1 className="font-display text-3xl">Identity verification queue</h1>
          <Link to="/adminn/listings" className="text-sm text-ember hover:underline">Listing review panel →</Link>
        </div>
      </div>
      <AuthGate>
        <VerificationQueue />
      </AuthGate>
    </div>
  );
}
