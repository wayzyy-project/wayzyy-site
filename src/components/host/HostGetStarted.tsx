import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  IndianRupee,
  Sparkles,
  Upload,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const SUPPORT_EMAIL = "hello@wayzyy.com";
export const SUPPORT_PHONE = "+91 87968 95934";
const SUPPORT_PHONE_HREF = "+918796895934";

/** Max properties a host can pull in themselves before talking to us. */
export const SELF_SERVE_IMPORT_LIMIT = 5;

/**
 * Per-account overrides above the default cap - for demo/showcase accounts
 * that need to import more than a real early host would, without loosening
 * the limit (which exists to stop API abuse) for everyone else. Keyed by
 * lowercased email.
 */
const IMPORT_LIMIT_OVERRIDES: Record<string, number> = {
  "akshayne912@gmail.com": 25,
};

/** The effective self-serve import cap for a given account. */
export function importLimitFor(email: string | null | undefined): number {
  if (!email) return SELF_SERVE_IMPORT_LIMIT;
  return IMPORT_LIMIT_OVERRIDES[email.toLowerCase()] ?? SELF_SERVE_IMPORT_LIMIT;
}

export type OnboardingSubmission = {
  id: string;
  created_at: string;
  status: string;
  property_urls: string[] | null;
  airbnb_profile_url: string | null;
};

/**
 * The concierge path's timeline, in the order a host actually experiences
 * it. `identity` sits late on purpose: identity verification is a step our
 * team initiates once the listings are in, so it never blocks a host from
 * getting their properties submitted in the first place.
 */
const CONCIERGE_STEPS = [
  { key: "received", label: "Properties received", body: "We have your links. Nothing more needed from you right now." },
  { key: "importing", label: "We're importing", body: "Our team is pulling in your photos, details, and layouts." },
  { key: "ready_for_pricing", label: "Review your pricing", body: "Your listings land here as drafts. Set your rates, then submit." },
  { key: "submitted_for_review", label: "Final review", body: "We check everything over before it goes live." },
  { key: "identity", label: "Identity verification", body: "We'll reach out to complete DigiLocker verification. Handled by our team." },
  { key: "published", label: "Live on Wayzyy", body: "Your properties are bookable." },
] as const;

/** Where a given submission status sits on the timeline above. */
function stepIndexForStatus(status: string): number {
  switch (status) {
    case "received":
      return 0;
    case "importing":
    case "verifying": // legacy value from the pre-unification schema
      return 1;
    case "ready_for_pricing":
      return 2;
    case "submitted_for_review":
      return 3;
    case "published":
      return 5;
    default:
      return 0;
  }
}

function SupportLine({ prefix }: { prefix: string }) {
  return (
    <p className="text-xs text-white/60">
      {prefix}{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-ember hover:underline">
        {SUPPORT_EMAIL}
      </a>{" "}
      or{" "}
      <a href={`https://wa.me/${SUPPORT_PHONE_HREF}`} target="_blank" rel="noopener noreferrer" className="font-medium text-ember hover:underline">
        {SUPPORT_PHONE}
      </a>
      .
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Concierge submission form                                           */
/* ------------------------------------------------------------------ */

function ConciergeForm({
  userId,
  onBack,
  onSubmitted,
}: {
  userId: string;
  onBack: () => void;
  onSubmitted: () => void;
}) {
  const { toast } = useToast();
  const [airbnbProfileUrl, setAirbnbProfileUrl] = useState("");
  const [propertyUrls, setPropertyUrls] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!airbnbProfileUrl.trim() && !propertyUrls.trim()) {
      toast({
        title: "Add at least one link",
        description: "Share your host profile URL, or your individual property links.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Name/email/phone come from the account rather than being re-typed -
      // the profile row is the source of truth, and asking again is exactly
      // the duplicated-form problem this flow replaced.
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email, phone")
        .eq("id", userId)
        .maybeSingle();

      // Routed through the API rather than inserting client-side so the
      // host still gets their "we've received your properties" confirmation
      // email - that send lives server-side with the ZeptoMail key.
      const res = await fetch("/api/host-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          fullName: profile?.name ?? "",
          email: profile?.email ?? "",
          phone: profile?.phone ?? "",
          airbnbProfileUrl: airbnbProfileUrl.trim(),
          propertyUrls: propertyUrls
            .split(/[\n,]/)
            .map((u) => u.trim())
            .filter(Boolean)
            .join(","),
          // Terms were accepted at signup, which is now always upstream of
          // this form - the host cannot reach it without an account.
          agreedToTerms: true,
        }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error ?? "Submission failed");
      }

      toast({
        title: "Got it — we'll take it from here.",
        description: "You'll see progress right here on your dashboard.",
      });
      onSubmitted();
    } catch (err: any) {
      toast({
        title: "Couldn't submit",
        description: err?.message ?? "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="liquid-glass space-y-5 rounded-3xl border border-white/20 bg-black/40 p-5 sm:p-7">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-3 text-xs font-medium text-white/50 transition-colors hover:text-white"
        >
          &larr; Back
        </button>
        <h3 className="font-display text-xl font-bold text-white sm:text-2xl">Send us your properties</h3>
        <p className="mt-1 text-sm text-white/60">
          Just the links. We'll import everything, set them up, and hand them back for you to price.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/70">
          Your host profile URL
        </span>
        <input
          value={airbnbProfileUrl}
          onChange={(e) => setAirbnbProfileUrl(e.target.value)}
          placeholder="https://airbnb.co.in/users/show/..."
          className="h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:border-ember focus:outline-none"
        />
        <span className="mt-1.5 block text-[11px] text-white/50">
          Fastest option — we'll pull every property listed under it.
        </span>
      </label>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-white/40">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/70">
          Individual property links
        </span>
        <textarea
          value={propertyUrls}
          onChange={(e) => setPropertyUrls(e.target.value)}
          placeholder={"https://airbnb.co.in/rooms/123\nhttps://airbnb.co.in/rooms/456"}
          className="min-h-[110px] w-full resize-y rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-ember focus:outline-none"
        />
        <span className="mt-1.5 block text-[11px] text-white/50">
          One per line, or separated by commas. No limit here — send as many as you have.
        </span>
      </label>

      <Button type="submit" disabled={submitting} className="w-full gap-2 bg-ember py-6 font-bold text-white hover:bg-ember/90">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send to our team <ArrowRight className="h-4 w-4" /></>}
      </Button>

      <SupportLine prefix="Questions before you send?" />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Status timeline (concierge path, post-submission)                   */
/* ------------------------------------------------------------------ */

function ConciergeTimeline({
  submission,
  onConfirmPricing,
}: {
  submission: OnboardingSubmission;
  onConfirmPricing: () => void;
}) {
  const activeIndex = stepIndexForStatus(submission.status);
  const count =
    (submission.property_urls?.length ?? 0) + (submission.airbnb_profile_url ? 1 : 0);
  const [confirming, setConfirming] = useState(false);
  const { toast } = useToast();

  // The one point in the concierge path where the ball is in the host's
  // court: we've imported their listings, they set their rates, and this
  // hands it back to us for final review.
  const awaitingPricing = submission.status === "ready_for_pricing";

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const { error } = await supabase
        .from("host_onboarding_submissions")
        .update({ status: "submitted_for_review" })
        .eq("id", submission.id);
      if (error) throw error;
      toast({
        title: "Sent for final review",
        description: "We'll check everything over and publish your listings.",
      });
      onConfirmPricing();
    } catch (err: any) {
      toast({
        title: "Couldn't submit",
        description: err?.message ?? "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="liquid-glass space-y-6 rounded-3xl border border-white/20 bg-black/40 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {/* The header has to track whose court the ball is in. Saying
              "we're on it" while the host is the one who needs to act
              reads as "sit tight" at exactly the wrong moment. */}
          <div
            className={
              "mb-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide " +
              (awaitingPricing
                ? "border-ember bg-ember text-white"
                : "border-ember/30 bg-ember/10 text-ember")
            }
          >
            {awaitingPricing ? (
              <><IndianRupee className="h-3 w-3" /> Your turn</>
            ) : submission.status === "submitted_for_review" ? (
              <><Sparkles className="h-3 w-3" /> In final review</>
            ) : (
              <><Sparkles className="h-3 w-3" /> We're on it</>
            )}
          </div>
          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
            {awaitingPricing
              ? "Set your rates, and we'll publish"
              : submission.status === "submitted_for_review"
              ? "Back with us for final review"
              : "Your properties are with our team"}
          </h3>
          <p className="mt-1 text-sm text-white/60">
            Submitted {new Date(submission.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            {count > 0 && <> · {count} link{count === 1 ? "" : "s"}</>}
          </p>
        </div>
      </div>

      <ol className="space-y-0">
        {CONCIERGE_STEPS.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={step.key} className="flex gap-4">
              {/* rail */}
              <div className="flex flex-col items-center">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-ember" />
                ) : active ? (
                  <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    <span className="absolute h-5 w-5 animate-ping rounded-full bg-ember/40" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-ember" />
                  </span>
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-white/25" />
                )}
                {i < CONCIERGE_STEPS.length - 1 && (
                  <span className={"my-1 w-px flex-1 " + (done ? "bg-ember/40" : "bg-white/10")} />
                )}
              </div>
              {/* content */}
              <div className={"pb-6 " + (i === CONCIERGE_STEPS.length - 1 ? "pb-0" : "")}>
                <p className={"text-sm font-semibold " + (active ? "text-ember" : done ? "text-white" : "text-white/50")}>
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/55">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {awaitingPricing && (
        <div className="rounded-2xl border border-ember/40 bg-ember/10 p-4 sm:p-5">
          <p className="text-sm font-semibold text-white">Your listings are ready for pricing</p>
          <p className="mt-1 text-xs leading-relaxed text-white/70">
            We've imported everything. Set your nightly rates on each listing below, then send them
            back to us and we'll publish.
          </p>
          <Button
            onClick={handleConfirm}
            disabled={confirming}
            className="mt-4 w-full gap-2 bg-ember py-5 font-bold text-white hover:bg-ember/90 sm:w-auto"
          >
            {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Pricing looks good — submit <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <SupportLine prefix="Need to add more properties or change something?" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Two-path chooser (the empty state)                                  */
/* ------------------------------------------------------------------ */

function PathCard({
  badge,
  title,
  body,
  points,
  cta,
  onClick,
  featured,
  icon: Icon,
}: {
  badge: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  onClick: () => void;
  featured?: boolean;
  icon: typeof Upload;
}) {
  return (
    <div
      className={
        "flex flex-col rounded-3xl border p-5 sm:p-6 " +
        (featured ? "border-ember/40 bg-ember/[0.07]" : "border-white/15 bg-white/[0.03]")
      }
    >
      <div className="flex items-center gap-2.5">
        <div
          className={
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border " +
            (featured ? "border-ember/40 bg-ember/15 text-ember" : "border-white/15 bg-white/10 text-white")
          }
        >
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={
            "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider " +
            (featured ? "bg-ember/20 text-ember" : "bg-white/10 text-white/60")
          }
        >
          {badge}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-white sm:text-xl">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/60">{body}</p>

      <ul className="mt-4 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-xs text-white/70">
            <Check className={"mt-0.5 h-3.5 w-3.5 shrink-0 " + (featured ? "text-ember" : "text-white/40")} />
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onClick}
        className={
          "mt-6 w-full gap-2 py-5 font-bold " +
          (featured
            ? "bg-ember text-white hover:bg-ember/90"
            : "border border-white/20 bg-white/10 text-white hover:bg-white/20")
        }
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

export function HostGetStarted({
  userId,
  submission,
  defaultConcierge,
  onImportClick,
  onManualClick,
  onSubmitted,
}: {
  userId: string;
  submission: OnboardingSubmission | null;
  /** Deep-linked from an old /host-onboarding link — open the concierge form directly. */
  defaultConcierge?: boolean;
  onImportClick: () => void;
  onManualClick: () => void;
  onSubmitted: () => void;
}) {
  const [mode, setMode] = useState<"choose" | "concierge">(defaultConcierge ? "concierge" : "choose");

  // Once a concierge submission exists, the timeline replaces the chooser -
  // the host's question changes from "how do I start" to "where is it".
  if (submission) return <ConciergeTimeline submission={submission} onConfirmPricing={onSubmitted} />;

  if (mode === "concierge") {
    return <ConciergeForm userId={userId} onBack={() => setMode("choose")} onSubmitted={onSubmitted} />;
  }

  return (
    <div className="space-y-5">
      <div className="text-center sm:text-left">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Let's get your properties on Wayzyy.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/60 sm:mx-0">
          You don't have any listings yet. Two ways to start — pick whichever suits you.
          Both end the same way: your properties live, with no per-booking commission.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PathCard
          featured
          icon={UserCheck}
          badge="Recommended"
          title="We do it for you"
          body="Send us your existing listing links. Our team imports everything and hands it back ready to price."
          points={[
            "No property limit — send your whole portfolio",
            "We handle photos, details, and layouts",
            "You just review pricing at the end",
            "Track every step right here",
          ]}
          cta="Send us my links"
          onClick={() => setMode("concierge")}
        />
        <PathCard
          icon={Upload}
          badge="Self-serve"
          title="I'll do it myself"
          body="Import your listings yourself and stay in control of every detail from the start."
          points={[
            `Import up to ${SELF_SERVE_IMPORT_LIMIT} properties on your own`,
            "See exactly how each listing looks",
            "Set your own pricing as you go",
            "Need more than " + SELF_SERVE_IMPORT_LIMIT + "? Just talk to us",
          ]}
          cta="Import a listing"
          onClick={onImportClick}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Prefer to build a listing from scratch?</p>
            <p className="mt-0.5 text-xs text-white/55">
              No existing listing to import — create one manually, step by step.
            </p>
          </div>
          <Button
            onClick={onManualClick}
            variant="ghost"
            className="shrink-0 gap-1.5 border border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            List manually <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center sm:flex-row sm:justify-center sm:gap-4 sm:text-left">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Mail className="h-3.5 w-3.5 text-ember" />
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white">{SUPPORT_EMAIL}</a>
        </div>
        <span className="hidden h-3 w-px bg-white/15 sm:block" />
        <div className="flex items-center gap-2 text-xs text-white/60">
          <MessageCircle className="h-3.5 w-3.5 text-ember" />
          <a href={`https://wa.me/${SUPPORT_PHONE_HREF}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            {SUPPORT_PHONE} (WhatsApp)
          </a>
        </div>
      </div>
    </div>
  );
}

export default HostGetStarted;
