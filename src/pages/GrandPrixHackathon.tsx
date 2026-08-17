import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ChevronDown, Flag, Users, Rocket, Loader2, CheckCircle2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import raceVeryFar from "@/assets/grand-prix/very-far.webp";
import raceUpClose from "@/assets/grand-prix/up-close.webp";
import raceMirror from "@/assets/grand-prix/closers-on-mirror.webp";
import racePedal from "@/assets/grand-prix/cockpit-pedal.webp";

/** Classic F1 5-red-lights-out start sequence, looping. */
function StartingLights() {
  const reduce = useReducedMotion();
  const [lit, setLit] = useState(0); // 0-5 lights lit, 6 = lights-out flash

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    let n = 0;
    const tick = () => {
      if (cancelled) return;
      n += 1;
      if (n <= 5) {
        setLit(n);
        timeout = setTimeout(tick, 420);
      } else {
        setLit(0);
        timeout = setTimeout(() => {
          n = 0;
          tick();
        }, 1100);
      }
    };
    timeout = setTimeout(tick, 600);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [reduce]);

  return (
    <div className="mx-auto mb-6 flex items-center justify-center gap-2.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="h-3 w-3 rounded-full border border-red-500/50 transition-all duration-200 sm:h-3.5 sm:w-3.5"
          style={{
            background: lit >= i ? "#ef4444" : "rgba(239,68,68,0.08)",
            boxShadow: lit >= i ? "0 0 12px 2px rgba(239,68,68,0.7)" : "none",
          }}
        />
      ))}
    </div>
  );
}

/** Diagonal speed-streak background, purely decorative, respects reduced motion. */
function SpeedLines() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden opacity-[0.18] sm:h-28">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute h-px w-[55%] bg-gradient-to-r from-transparent via-foreground to-transparent"
          style={{ top: `${10 + i * 24}%`, left: i % 2 === 0 ? "-60%" : "auto", right: i % 2 === 0 ? "auto" : "-60%" }}
          animate={{ x: i % 2 === 0 ? ["0%", "220%"] : ["0%", "-220%"] }}
          transition={{ duration: 2.4 + i * 0.5, repeat: Infinity, ease: "easeIn", repeatDelay: 0.6 }}
        />
      ))}
    </div>
  );
}

/** A small waving checkered racing flag, SVG + CSS wave animation. */
function WavingFlag({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 60 40"
      className={className}
      style={{
        animation: reduce ? undefined : "gpx-flag-wave 2.4s ease-in-out infinite",
        transformOrigin: "0% 50%",
      }}
    >
      <line x1="2" y1="2" x2="2" y2="38" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <g>
        {Array.from({ length: 6 }).map((_, col) =>
          Array.from({ length: 4 }).map((_, row) => (
            <rect
              key={`${col}-${row}`}
              x={4 + col * 9}
              y={2 + row * 9}
              width="9"
              height="9"
              fill={(col + row) % 2 === 0 ? "#fff" : "#111"}
            />
          ))
        )}
      </g>
    </svg>
  );
}

/**
 * One frame of the race sequence. `win` is four scroll stops: fade-in start,
 * fade-in end, fade-out start, fade-out end. The image keeps scaling across
 * its whole window so consecutive shots read as one continuous push-in.
 */
function RaceFrame({
  p,
  src,
  win,
  from = 1,
  to = 1.22,
  reduce,
}: {
  p: MotionValue<number>;
  src: string;
  win: [number, number, number, number];
  from?: number;
  to?: number;
  reduce: boolean | null;
}) {
  const opacity = useTransform(p, win, [0, 1, 1, 0]);
  const scale = useTransform(p, [win[0], win[3]], [from, to]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 will-change-[opacity]">
      <motion.img
        src={src}
        alt=""
        aria-hidden
        style={{ scale: reduce ? 1 : scale }}
        className="h-full w-full object-cover will-change-transform"
      />
    </motion.div>
  );
}

/** A line of copy timed to one beat of the race sequence. */
function RaceBeat({
  p,
  win,
  children,
}: {
  p: MotionValue<number>;
  win: [number, number, number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(p, win, [0, 1, 1, 0]);
  const y = useTransform(p, [win[0], win[1]], [22, 0]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-[14%] mx-auto max-w-3xl px-6 text-center font-display text-2xl font-bold leading-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)] sm:text-4xl"
    >
      {children}
    </motion.p>
  );
}

/** Persistent "keep going" nudge, fades out as soon as the sequence starts moving. */
function ScrollCue({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0, 0.05], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2"
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
        Keep scrolling, keep building
      </span>
      <motion.span
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-white/60"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.span>
    </motion.div>
  );
}

/** Scroll-driven cinematic: wide shot, into the mirror, into the driver, onto the pedal. */
function RaceSequence() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.4 });

  return (
    <section ref={ref} className="relative h-[420vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Starts fully opaque: the in-window opens before 0 so the first frame
            is already on screen at rest, instead of fading up from black. */}
        <RaceFrame p={p} src={raceVeryFar} win={[-0.1, 0, 0.22, 0.29]} reduce={reduce} />
        <RaceFrame p={p} src={raceUpClose} win={[0.22, 0.29, 0.46, 0.53]} reduce={reduce} />
        <RaceFrame p={p} src={raceMirror} win={[0.46, 0.53, 0.7, 0.77]} reduce={reduce} />
        <RaceFrame p={p} src={racePedal} win={[0.7, 0.77, 1.01, 1.02]} reduce={reduce} />

        {/* legibility scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.75)]" />

        <RaceBeat p={p} win={[-0.05, 0, 0.2, 0.26]}>
          Every great pitch starts{" "}
          <span className="bg-gradient-to-r from-red-500 via-[hsl(25,100%,58%)] to-red-500 bg-clip-text text-transparent">
            on the grid.
          </span>
        </RaceBeat>

        <RaceBeat p={p} win={[0.26, 0.32, 0.44, 0.5]}>
          Be the{" "}
          <span className="bg-gradient-to-r from-red-500 via-[hsl(25,100%,58%)] to-red-500 bg-clip-text text-transparent">
            P1
          </span>{" "}
          here.
        </RaceBeat>

        <RaceBeat p={p} win={[0.5, 0.56, 0.68, 0.74]}>
          We're looking for the person in the mirror.
        </RaceBeat>

        <RaceBeat p={p} win={[0.74, 0.8, 0.99, 1.0]}>
          Let's keep the{" "}
          <span className="bg-gradient-to-r from-red-500 via-[hsl(25,100%,58%)] to-red-500 bg-clip-text text-transparent">
            foot on the pedal.
          </span>
        </RaceBeat>

        <ScrollCue p={p} />
      </div>
    </section>
  );
}

/** Scrolling checkered strip, in place of a static repeating background. */
function CheckeredMarquee() {
  const reduce = useReducedMotion();
  return (
    <div className="h-2 w-full overflow-hidden bg-black">
      <motion.div
        className="h-2 w-[200%]"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, #fff 0 16px, #0a0a0a 16px 32px)",
        }}
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

type FormState = {
  teamName: string;
  fullName: string;
  email: string;
  hackathonTrack: "participant" | "registered_no_finals" | "";
  pitchDeckLink: string;
  videoLink: string;
  pitch: string;
};

const INITIAL_FORM: FormState = {
  teamName: "",
  fullName: "",
  email: "",
  hackathonTrack: "",
  pitchDeckLink: "",
  videoLink: "",
  pitch: "",
};

const TRACKS: { value: FormState["hackathonTrack"]; label: string; desc: string }[] = [
  { value: "participant", label: "We competed offline", desc: "₹500 Wayzyy credit guaranteed, pitch still counts for the $1,000/month track." },
  { value: "registered_no_finals", label: "Registered, didn't make the finals", desc: "Still eligible to pitch for the $1,000/month opportunity — highly preferred." },
];

export default function GrandPrixHackathon() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.hackathonTrack || !form.pitchDeckLink || !form.pitch) {
      toast({ title: "A few fields are still empty", description: "Fill in the required fields to submit.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const bookingRef = `GPX-${Date.now().toString(36).toUpperCase()}`;
      const res = await fetch("/api/grand-prix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bookingRef }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      toast({ title: "You're on the grid.", description: "We'll be in touch within 48-72 hours." });
    } catch (err) {
      toast({ title: "Couldn't submit", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SEO
      title="Wayzyy Grand Prix Hackathon — Pitch, Win, Get Hired"
      description="Grand Prix Hackathon participants: pitch how you'd make Wayzyy better than Airbnb. ₹500 in Wayzyy credits for every offline team, and a $1,000/month build-with-us opportunity for the strongest pitch."
      ogImage="/og-grand-prix.jpg"
      path="/grand-prix"
    >
      <div className="relative min-h-screen bg-background text-foreground">
        <CheckeredMarquee />

        <header className="sticky top-2 z-40 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Wayzyy home
          </Link>
          <ThemeToggle />
        </header>

        <RaceSequence />

        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-8 sm:pt-16">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]" />
          <div className="pointer-events-none absolute top-20 right-0 h-[300px] w-[300px] rounded-full bg-[hsl(25,100%,50%)]/25 blur-[100px]" />
          <SpeedLines />

          <div className="relative mx-auto max-w-4xl text-center">
            <StartingLights />
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400">
                <Flag className="h-3 w-3" /> Grand Prix Hackathon
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 flex items-center justify-center gap-3 font-display text-4xl font-bold leading-tight sm:gap-5 sm:text-6xl">
                <WavingFlag className="hidden h-10 w-14 shrink-0 drop-shadow-[0_0_10px_rgba(0,0,0,0.6)] sm:block sm:h-14 sm:w-20" />
                <span>
                  Welcome to the grid,{" "}
                  <span className="bg-gradient-to-r from-red-500 via-[hsl(25,100%,55%)] to-red-500 bg-clip-text text-transparent">
                    Grand Prix racers.
                  </span>
                </span>
                <WavingFlag className="hidden h-10 w-14 shrink-0 -scale-x-100 drop-shadow-[0_0_10px_rgba(0,0,0,0.6)] sm:block sm:h-14 sm:w-20" />
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
                One lap, one question: what does Airbnb get wrong, and how would you fix it for
                Wayzyy? Pitch us, take home Wayzyy credits, or land the $1,000/month
                build-with-us opportunity.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Tracks */}
        <section className="px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="mb-6 text-center font-display text-2xl font-bold sm:text-3xl">
                Two ways onto the podium
              </h2>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, title: "Offline participants", body: "Every team that competed in-person gets ₹500 in Wayzyy credits, guaranteed, no pitch required.", accent: "border-red-500/40 bg-red-500/10" },
                { icon: Rocket, title: "Registered, no finals", body: "Didn't make the cut? You can still pitch for the $1,000/month opportunity, and it's highly preferred.", accent: "border-border bg-card" },
              ].map((card) => (
                <Reveal key={card.title} delay={0.05}>
                  <motion.div
                    className={`h-full rounded-2xl border-2 ${card.accent} p-6`}
                    whileHover={{ y: -6, scale: 1.02, boxShadow: "0 0 32px rgba(255,107,0,0.25)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <card.icon className="h-6 w-6 text-foreground" />
                    <h3 className="mt-3 font-display text-lg font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* What Wayzyy is */}
        <section className="px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
                First, what Wayzyy actually is
              </h2>
              <div className="mx-auto mt-5 max-w-2xl space-y-4 text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
                <p>
                  We're an India-native homestay and villa rental marketplace, built for Goa
                  first.
                </p>
                <p>
                  Hosts pay a flat prepaid subscription instead of a commission on every booking,
                  so they keep close to all of what they earn.
                </p>
                <p>
                  Guests see the real total up front. No cleaning fee that appears at checkout, no
                  service fee stacked on top.
                </p>
                <p>
                  Both sides get verified through Aadhaar and DigiLocker, and payments run on UPI,
                  because that's how India actually pays.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { stat: "~2%", label: "Effective host fee", sub: "against roughly 15-17% on the global platforms" },
                { stat: "50+", label: "Hosts onboarded", sub: "with 500+ properties, all before we've launched" },
                { stat: "100%", label: "Verified both ways", sub: "hosts and guests, through Aadhaar and DigiLocker" },
              ].map((s) => (
                <Reveal key={s.label} delay={0.04}>
                  <div className="h-full rounded-2xl border border-border bg-card p-5 text-center">
                    <p className="font-display text-3xl font-bold text-[hsl(25,100%,55%)]">{s.stat}</p>
                    <p className="mt-1 font-display text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.06}>
              <p className="mx-auto mt-8 max-w-2xl text-center font-display text-lg leading-snug text-foreground sm:text-xl">
                So what we're looking for is simple. We want to be better than Airbnb,{" "}
                <span className="bg-gradient-to-r from-red-500 via-[hsl(25,100%,58%)] to-red-500 bg-clip-text text-transparent">
                  in almost every way possible.
                </span>
              </p>
              <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
                Want the fuller picture before you pitch? Read up on{" "}
                <Link to="/" className="font-medium text-[hsl(25,100%,58%)] underline underline-offset-4 hover:text-foreground">
                  what we're building
                </Link>{" "}
                or dig through{" "}
                <Link to="/blog" className="font-medium text-[hsl(25,100%,58%)] underline underline-offset-4 hover:text-foreground">
                  our blog
                </Link>
                , where we write about pricing, hosting, and the Indian short-stay market in
                detail.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Where Airbnb falls short */}
        <section className="px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
                Where Airbnb falls short
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
                Pick one problem below, or bring your own. Tell us your approach to solving it,
                and walk us through it in your pitch deck.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "High take-rate on every booking",
                  body: "Airbnb, Booking.com, and Vrbo charge hosts and guests a combined ~15-17% per booking. That eats directly into host margins and guest budgets.",
                },
                {
                  title: "Payment defaults and disputes",
                  body: "Cross-border card payments and chargebacks leave hosts exposed to no-shows and payment reversals with little recourse.",
                },
                {
                  title: "Weak identity verification",
                  body: "Global platforms have no real way to verify Indian hosts or guests, no Aadhaar, no DigiLocker, which leaves trust and safety thin.",
                },
                {
                  title: "Opaque, drip-priced totals",
                  body: "Cleaning fees, service fees, and taxes stack up invisibly until checkout, eroding guest trust in the price they were shown.",
                },
                {
                  title: "Slow, generic support",
                  body: "Hosts and guests in India get routed through support systems built for the US/EU market, with no local language, timezone, or context.",
                },
                {
                  title: "No UPI-native payments",
                  body: "Indian hosts and guests default to UPI for almost everything, but the big platforms are still card-and-wallet first, adding friction to every transaction.",
                },
              ].map((problem) => (
                <Reveal key={problem.title} delay={0.03}>
                  <motion.div
                    className="h-full rounded-2xl border border-border bg-card p-5"
                    whileHover={{ y: -4, borderColor: "rgba(255,107,0,0.4)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <h3 className="font-display text-base font-semibold text-foreground">{problem.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{problem.body}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* What to pitch */}
        <section className="px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">What we're looking for</h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground sm:text-base">
                50+ hosts and 500+ properties are already on Wayzyy, pre-launch. Here's how to
                make your pitch count.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.03}>
                <div className="h-full rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-display text-base font-semibold text-foreground">Pick one problem</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    From the list above, or one you've spotted yourself. Solve it for Wayzyy
                    specifically, not for Airbnb in the abstract.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="h-full rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-display text-base font-semibold text-foreground">Features are optional</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Market research, pricing strategy, or a growth angle that gets Wayzyy more
                    real users and hosts counts just as much as a technical fix.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.03}>
                <div className="h-full rounded-2xl border border-border bg-card p-5 sm:col-span-2">
                  <h3 className="font-display text-base font-semibold text-foreground">Put it in the deck</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Your reasoning, your approach, and any evidence behind it belongs in the pitch
                    deck, that's what we'll actually read.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.08}>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-[hsl(25,100%,50%)]/40 bg-[hsl(25,100%,50%)]/[0.08] p-4">
                <span className="mt-0.5 shrink-0 rounded-full bg-[hsl(25,100%,50%)] px-2 py-0.5 text-xs font-bold text-black">
                  $1,000/mo
                </span>
                <p className="text-sm text-foreground/80">
                  The strongest pitch gets the build-with-us opportunity: <strong className="text-foreground">$1,000/month</strong>{" "}
                  working directly with us as we build Wayzyy. This is the same opportunity we've
                  marketed everywhere, and it's live for Grand Prix pitches too.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Keep it simple */}
        <section className="px-4 pb-16 sm:px-8">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center font-display text-xl italic text-foreground/80 sm:text-2xl">
              A flat-fee subscription, not a cut of every booking. We like to keep things simple
              and flat, the same way we'll handle your hiring application.
            </p>
          </Reveal>
        </section>

        {/* Form */}
        <section id="apply" className="px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-red-500/30 bg-card p-6 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="h-10 w-10 text-[hsl(25,100%,50%)]" />
                <h3 className="font-display text-xl font-semibold">You're on the grid.</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  We've got your pitch. Check your inbox for confirmation, we'll follow up within
                  48-72 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-bold">Submit your pitch</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Every field marked * is required.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Team name">
                    <input
                      className="gpx-input"
                      value={form.teamName}
                      onChange={(e) => update("teamName", e.target.value)}
                      placeholder="e.g. Paddock Devs"
                    />
                  </Field>
                  <Field label="Your name *">
                    <input
                      className="gpx-input"
                      required
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      placeholder="Full name"
                    />
                  </Field>
                </div>

                <Field label="Email you registered for the hackathon with *">
                  <input
                    className="gpx-input"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </Field>

                <Field label="Which track are you on? *">
                  <div className="space-y-2">
                    {TRACKS.map((t) => (
                      <label
                        key={t.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                          form.hackathonTrack === t.value
                            ? "border-[hsl(25,100%,50%)] bg-[hsl(25,100%,50%)]/10"
                            : "border-border hover:border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name="hackathonTrack"
                          className="mt-1"
                          checked={form.hackathonTrack === t.value}
                          onChange={() => update("hackathonTrack", t.value)}
                        />
                        <span>
                          <span className="block text-sm font-medium text-foreground">{t.label}</span>
                          <span className="block text-xs text-muted-foreground">{t.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Pitch deck link *">
                  <input
                    className="gpx-input"
                    required
                    value={form.pitchDeckLink}
                    onChange={(e) => update("pitchDeckLink", e.target.value)}
                    placeholder="Google Slides / Drive / PDF link"
                  />
                </Field>

                <Field label="Video link (optional)">
                  <input
                    className="gpx-input"
                    value={form.videoLink}
                    onChange={(e) => update("videoLink", e.target.value)}
                    placeholder="Walkthrough or demo video"
                  />
                </Field>

                <Field label="Your pitch — what does Airbnb miss, and how do you fix it for Wayzyy? *">
                  <textarea
                    className="gpx-input min-h-[140px] resize-y"
                    required
                    value={form.pitch}
                    onChange={(e) => update("pitch", e.target.value)}
                    placeholder="Walk us through the gap, the fix, and why it matters..."
                  />
                </Field>

                <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" variant="cta" size="pill-lg" disabled={submitting} className="w-full">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit pitch"}
                  </Button>
                </motion.div>
              </form>
            )}
          </div>
        </section>

        <CheckeredMarquee />

        <style>{`
          .gpx-input {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid hsl(var(--border));
            background: hsl(var(--background));
            padding: 0.6rem 0.85rem;
            font-size: 0.875rem;
            color: hsl(var(--foreground));
          }
          .gpx-input::placeholder { color: hsl(var(--muted-foreground)); }
          .gpx-input:focus { outline: none; border-color: hsl(25,100%,50%); }
          @keyframes gpx-flag-wave {
            0%, 100% { transform: perspective(200px) rotateY(0deg) skewY(0deg); }
            25% { transform: perspective(200px) rotateY(-8deg) skewY(-2deg); }
            50% { transform: perspective(200px) rotateY(0deg) skewY(1deg); }
            75% { transform: perspective(200px) rotateY(8deg) skewY(-1deg); }
          }
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
