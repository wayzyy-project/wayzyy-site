import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Gift,
  Home,
  Loader2,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  airbnbProfileUrl: string;
  propertyUrls: string;
  agreedToTerms: boolean;
};

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  airbnbProfileUrl: "",
  propertyUrls: "",
  agreedToTerms: false,
};

const STEPS = [
  { icon: Send, title: "You submit", body: "Your details and property links, that's it." },
  { icon: ShieldCheck, title: "We verify", body: "Our team checks each property before it goes live." },
  { icon: Sparkles, title: "You go live", body: "Your properties are published on Wayzyy." },
  { icon: Rocket, title: "Bookings roll in", body: "We push marketing hard the moment we launch." },
];

export default function HostOnboarding() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.agreedToTerms) {
      toast({ title: "A few fields are still empty", description: "Fill in the required fields and accept the terms to continue.", variant: "destructive" });
      return;
    }
    if (!form.airbnbProfileUrl.trim() && !form.propertyUrls.trim()) {
      toast({ title: "Add at least one property", description: "Share your Airbnb profile link, or your property URLs.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/host-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      toast({ title: "You're in.", description: "Check your inbox for confirmation." });
    } catch (err) {
      toast({ title: "Couldn't submit", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SEO
      title="Welcome, Goa hosts — bring your properties to Wayzyy"
      description="Submit your properties in one simple form. Our team verifies them, and they go live on Wayzyy the moment we launch."
      path="/host-onboarding"
    >
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-ember/15 blur-[130px]" />

        <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Wayzyy" className="h-9 w-9 rounded-full object-cover" />
          </Link>
          <Link
            to="/host"
            className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Host portal &rarr;
          </Link>
        </header>

        {/* Hero */}
        <section className="relative px-5 pb-14 pt-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ember">
                <Home className="h-3 w-3" /> Now onboarding Goa hosts
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-5xl">
                Welcome to Wayzyy's host list.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
                It's great to have you here. We're actively expanding across Goa, and now it's
                time to get your existing properties visible on Wayzyy too. One simple form,
                that's all it takes.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Horizontal flowchart */}
        <section className="px-5 pb-16 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              {/* Mobile: single column, top-to-bottom, down arrows between
                  steps. Desktop: horizontal row with a connecting line -
                  the old layout used a 2x2 grid with right-arrows, which
                  broke on the wrap (the arrow after step 2 pointed right
                  when the real next step was below it, not beside it). */}
              <div className="flex flex-col items-stretch gap-2 sm:hidden">
                {STEPS.map((step, i) => (
                  <div key={step.title}>
                    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/40 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                        <step.icon className="h-5 w-5 text-ember" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{step.body}</p>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex justify-center py-1.5">
                        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="relative hidden sm:grid sm:grid-cols-4 sm:gap-x-4">
                <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 h-px bg-border" />
                {STEPS.map((step) => (
                  <div key={step.title} className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                      <step.icon className="h-5 w-5 text-ember" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">{step.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{step.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Form. Extra bottom padding clears the global fixed MobileTabBar. */}
        <section className="px-5 pb-28 sm:px-8 sm:pb-16">
          <div className="liquid-glass mx-auto max-w-xl rounded-3xl border border-border p-6 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-ember" />
                <h3 className="font-display text-xl font-semibold">You're in.</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  It's on us from here. Our team will verify your properties, and you'll get
                  updates by email and phone as they go live.
                </p>
                <div className="mt-2 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-left text-xs text-muted-foreground">
                  <Gift className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                  <span>
                    A small welcome kit is on its way too, our way of saying thanks for being with
                    us this early.
                  </span>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Want to check your status any time? Head to{" "}
                  <Link to="/host-onboarding/status" className="font-medium text-ember hover:underline">
                    wayzyy.com/host-onboarding/status
                  </Link>{" "}
                  and enter the email you used here.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-bold">Submit your properties</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We'll take it from here, imports included.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name *">
                    <input
                      className="wh-input"
                      required
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Phone *">
                    <input
                      className="wh-input"
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 ..."
                    />
                  </Field>
                </div>

                <Field label="Email *">
                  <input
                    className="wh-input"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </Field>

                <Field label="Your Airbnb host profile URL">
                  <input
                    className="wh-input"
                    value={form.airbnbProfileUrl}
                    onChange={(e) => update("airbnbProfileUrl", e.target.value)}
                    placeholder="https://www.airbnb.co.in/users/show/..."
                  />
                </Field>

                <Field label="Or your property URLs, separated by commas">
                  <textarea
                    className="wh-input min-h-[90px] resize-y"
                    value={form.propertyUrls}
                    onChange={(e) => update("propertyUrls", e.target.value)}
                    placeholder="https://airbnb.co.in/rooms/123, https://airbnb.co.in/rooms/456"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Share at least one, your Airbnb profile or your property links.
                  </p>
                </Field>

                <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
                  <Checkbox
                    checked={form.agreedToTerms}
                    onCheckedChange={(v) => update("agreedToTerms", v === true)}
                    className="mt-0.5"
                  />
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    I agree to Wayzyy's{" "}
                    <Link to="/host-terms#account-registration" target="_blank" className="font-medium text-ember hover:underline">
                      Host Terms
                    </Link>
                    ,{" "}
                    <Link to="/privacy" target="_blank" className="font-medium text-ember hover:underline">
                      Privacy Policy
                    </Link>
                    , and how Wayzyy{" "}
                    <Link to="/policies/property-import-policy#verification-workflow" target="_blank" className="font-medium text-ember hover:underline">
                      imports and verifies my listings
                    </Link>
                    {" "}from the URLs I share, including that Wayzyy{" "}
                    <Link to="/policies/property-import-policy#review-policy" target="_blank" className="font-medium text-ember hover:underline">
                      does not import reviews or ratings
                    </Link>{" "}
                    from other platforms.
                  </span>
                </label>

                <Button type="submit" variant="cta" size="pill-lg" disabled={submitting} className="w-full">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit my properties"}
                </Button>
              </form>
            )}
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted-foreground">
            Want to see how everything looks on your end first? Head to{" "}
            <Link to="/host" className="font-medium text-ember hover:underline">
              wayzyy.com/host
            </Link>{" "}
            to log in or sign up, see how your properties will appear, and explore other ways to
            import your listings yourself. Or just submit this form, and we'll handle the rest.
          </p>
        </section>

        <style>{`
          .wh-input {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid hsl(var(--border));
            background: hsl(var(--background));
            padding: 0.6rem 0.85rem;
            font-size: 0.875rem;
            color: hsl(var(--foreground));
          }
          .wh-input::placeholder { color: hsl(var(--muted-foreground)); }
          .wh-input:focus { outline: none; border-color: hsl(var(--ember)); }
        `}</style>
      </div>
    </SEO>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
