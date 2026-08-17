import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, Flag, Users, Rocket, Loader2, CheckCircle2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
          className="absolute h-px w-[55%] bg-gradient-to-r from-transparent via-white to-transparent"
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

/** A single F1 wheel: dark tyre, rim spokes, spun by CSS so it survives re-renders. */
function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      {/* tyre */}
      <circle cx={cx} cy={cy} r={r} fill="#0d0d0f" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2a2e" strokeWidth="2" />
      {/* soft-compound sidewall stripe */}
      <circle cx={cx} cy={cy} r={r - 3.5} fill="none" stroke="hsl(25,100%,50%)" strokeWidth="1.2" opacity="0.55" />
      {/* spinning rim */}
      <g className="gpx-wheel" style={{ ["--gpx-cx" as string]: `${cx}px`, ["--gpx-cy" as string]: `${cy}px` }}>
        <circle cx={cx} cy={cy} r={r - 6} fill="#17171b" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x={cx - 1}
            y={cy - (r - 6)}
            width="2"
            height={r - 6}
            fill="#5b5b63"
            transform={`rotate(${deg} ${cx} ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r="2.6" fill="hsl(25,100%,50%)" />
      </g>
    </g>
  );
}

/** Stylized modern F1 car, side profile, facing right. */
function F1Car({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 92" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gpxBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(25,100%,52%)" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#a51d1d" />
        </linearGradient>
        <linearGradient id="gpxCover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(25,100%,58%)" />
          <stop offset="100%" stopColor="#e0431f" />
        </linearGradient>
      </defs>

      {/* ---- rear wing ---- */}
      <rect x="222" y="18" width="34" height="6" rx="2" fill="#ef4444" />
      <rect x="224" y="27" width="30" height="3.5" rx="1.5" fill="#26262b" />
      <rect x="236" y="22" width="5" height="30" fill="#1c1c20" />
      <rect x="252" y="16" width="4" height="34" rx="1.5" fill="#2f2f36" />

      {/* ---- floor / plank ---- */}
      <path d="M46 62 L232 60 L236 70 L44 70 Z" fill="#131317" />

      {/* ---- main tub + sidepod ---- */}
      <path
        d="M18 62
           L54 54
           L104 50
           Q118 34 146 34
           L166 34
           Q182 34 190 44
           L226 50
           L234 62
           L20 66
           Z"
        fill="url(#gpxBody)"
      />

      {/* sidepod inlet */}
      <path d="M150 46 L188 48 L192 60 L150 60 Z" fill="#c22c2c" />
      <rect x="152" y="49" width="26" height="6" rx="3" fill="#0d0d0f" opacity="0.85" />

      {/* ---- nose cone ---- */}
      <path d="M0 66 L20 60 L22 68 L2 71 Z" fill="#1c1c20" />
      <path d="M18 61 L46 55 L48 64 L20 67 Z" fill="url(#gpxBody)" />

      {/* ---- front wing (multi-element) ---- */}
      <rect x="-2" y="70" width="42" height="4" rx="1.5" fill="#f2f2f2" />
      <rect x="2" y="66" width="30" height="3" rx="1.5" fill="#d4d4d8" opacity="0.9" />
      <rect x="-2" y="62" width="4" height="14" rx="1.5" fill="#2f2f36" />

      {/* ---- engine cover / airbox ---- */}
      <path d="M158 34 Q170 12 182 12 L188 12 Q194 12 196 20 L206 48 L172 44 Z" fill="url(#gpxCover)" />

      {/* ---- halo ---- */}
      <path d="M124 40 Q126 22 150 22 Q170 22 176 32" fill="none" stroke="#1c1c20" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="120" y="30" width="4" height="14" rx="2" fill="#1c1c20" />

      {/* ---- cockpit + driver helmet ---- */}
      <path d="M128 42 Q132 32 152 32 L170 34 L172 44 Z" fill="#0d0d0f" />
      <circle cx="150" cy="34" r="8" fill="#f4f4f5" />
      <path d="M143 34 a7 7 0 0 1 14 0 z" fill="hsl(25,100%,50%)" />
      <rect x="143" y="33" width="13" height="3.5" rx="1.5" fill="#18181b" />

      {/* ---- livery ---- */}
      <path d="M56 56 L206 52 L207 57 L57 61 Z" fill="#fff" opacity="0.9" />
      <text x="206" y="40" fontSize="14" fontWeight="800" fill="#fff" fontFamily="sans-serif">W</text>

      {/* ---- wheels ---- */}
      <Wheel cx={62} cy={64} r={19} />
      <Wheel cx={214} cy={64} r={21} />
    </svg>
  );
}

/** Scroll-driven section where the F1 car races across the full width of the viewport. */
function RaceStrip() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });

  // The car crosses the full width; it leans on entry/exit like weight transfer.
  const carX = useTransform(p, [0, 1], ["-22%", "122%"]);
  const carLean = useTransform(p, [0, 0.14, 0.86, 1], [2.5, 0, 0, -2.5]);
  const wake = useTransform(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const headlineOpacity = useTransform(p, [0.04, 0.22], [0, 1]);
  const headlineY = useTransform(p, [0.04, 0.22], [26, 0]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* horizon heat glow */}
        <div className="pointer-events-none absolute bottom-[20%] left-1/2 h-72 w-[min(1000px,110vw)] -translate-x-1/2 rounded-[50%] bg-red-600/15 blur-[110px]" />

        <motion.p
          style={{ opacity: reduce ? 1 : headlineOpacity, y: reduce ? 0 : headlineY }}
          className="relative z-10 -mt-24 max-w-3xl px-4 text-center font-display text-3xl font-bold leading-tight sm:text-5xl"
        >
          Every great pitch starts{" "}
          <span className="bg-gradient-to-r from-red-500 via-[hsl(25,100%,55%)] to-red-500 bg-clip-text text-transparent">
            on the grid.
          </span>
        </motion.p>

        {/* ---- track surface ---- */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[24%]">
          <div className="h-px w-full bg-white/[0.14]" />
          <div className="gpx-road mt-[7px] h-[3px] w-full opacity-45" />
          <div className="mt-6 h-24 w-full bg-gradient-to-b from-white/[0.03] to-transparent" />
        </div>

        {/* ---- car ---- */}
        <motion.div
          aria-hidden
          style={{ left: reduce ? "50%" : carX, x: "-50%", rotate: reduce ? 0 : carLean }}
          className="pointer-events-none absolute bottom-[24%] z-0 will-change-transform"
        >
          {/* speed wake trailing the car */}
          <motion.div style={{ opacity: reduce ? 0 : wake }} className="absolute right-[88%] top-0 h-full w-56">
            {[28, 46, 62, 76].map((topPct, i) => (
              <span
                key={topPct}
                className="absolute right-0 block h-px bg-gradient-to-l from-white/45 to-transparent"
                style={{ top: `${topPct}%`, width: `${100 - i * 16}%` }}
              />
            ))}
          </motion.div>

          <div className="gpx-bob">
            <F1Car className="h-20 w-56 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] sm:h-28 sm:w-80" />
          </div>

          {/* contact shadow */}
          <div className="mx-auto h-2 w-[78%] -translate-y-1 rounded-[50%] bg-black/60 blur-[6px]" />
        </motion.div>
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
      description="Wayzyy Grand Prix Hackathon participants: pitch how you'd make Wayzyy better than Airbnb for a sponsored Goa villa trip, Wayzyy credits, or a $1,000/month hire."
    >
      <div className="relative min-h-screen bg-[#0a0a0a] text-white">
        <CheckeredMarquee />

        <header className="sticky top-2 z-40 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Wayzyy home
          </Link>
          <ThemeToggle />
        </header>

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
              <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 sm:text-lg">
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
                { icon: Rocket, title: "Registered, no finals", body: "Didn't make the cut? You can still pitch for the $1,000/month opportunity, and it's highly preferred.", accent: "border-white/20 bg-white/5" },
              ].map((card) => (
                <Reveal key={card.title} delay={0.05}>
                  <motion.div
                    className={`h-full rounded-2xl border-2 ${card.accent} p-6`}
                    whileHover={{ y: -6, scale: 1.02, boxShadow: "0 0 32px rgba(255,107,0,0.25)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <card.icon className="h-6 w-6 text-white" />
                    <h3 className="mt-3 font-display text-lg font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{card.body}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <RaceStrip />

        {/* Where Airbnb falls short */}
        <section className="px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
                Where Airbnb falls short
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/60 sm:text-base">
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
                    className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    whileHover={{ y: -4, borderColor: "rgba(255,107,0,0.4)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <h3 className="font-display text-base font-semibold text-white">{problem.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{problem.body}</p>
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
              <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/60 sm:text-base">
                50+ hosts and 500+ properties are already on Wayzyy, pre-launch. Here's how to
                make your pitch count.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.03}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-display text-base font-semibold text-white">Pick one problem</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    From the list above, or one you've spotted yourself. Solve it for Wayzyy
                    specifically, not for Airbnb in the abstract.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-display text-base font-semibold text-white">Features are optional</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Market research, pricing strategy, or a growth angle that gets Wayzyy more
                    real users and hosts counts just as much as a technical fix.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.03}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:col-span-2">
                  <h3 className="font-display text-base font-semibold text-white">Put it in the deck</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
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
                <p className="text-sm text-white/80">
                  The strongest pitch gets the build-with-us opportunity: <strong className="text-white">$1,000/month</strong>{" "}
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
            <p className="mx-auto max-w-2xl text-center font-display text-xl italic text-white/80 sm:text-2xl">
              A flat-fee subscription, not a cut of every booking. We like to keep things simple
              and flat, the same way we'll handle your hiring application.
            </p>
          </Reveal>
        </section>

        {/* Form */}
        <section id="apply" className="px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-red-500/30 bg-white/[0.03] p-6 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="h-10 w-10 text-[hsl(25,100%,50%)]" />
                <h3 className="font-display text-xl font-semibold">You're on the grid.</h3>
                <p className="max-w-sm text-sm text-white/70">
                  We've got your pitch. Check your inbox for confirmation, we'll follow up within
                  48-72 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-bold">Submit your pitch</h2>
                  <p className="mt-1 text-sm text-white/60">Every field marked * is required.</p>
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
                            : "border-white/15 hover:border-white/30"
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
                          <span className="block text-sm font-medium text-white">{t.label}</span>
                          <span className="block text-xs text-white/60">{t.desc}</span>
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
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.04);
            padding: 0.6rem 0.85rem;
            font-size: 0.875rem;
            color: white;
          }
          .gpx-input::placeholder { color: rgba(255,255,255,0.35); }
          .gpx-input:focus { outline: none; border-color: hsl(25,100%,50%); }
          @keyframes gpx-flag-wave {
            0%, 100% { transform: perspective(200px) rotateY(0deg) skewY(0deg); }
            25% { transform: perspective(200px) rotateY(-8deg) skewY(-2deg); }
            50% { transform: perspective(200px) rotateY(0deg) skewY(1deg); }
            75% { transform: perspective(200px) rotateY(8deg) skewY(-1deg); }
          }

          /* Wheel spin. transform-box:fill-box lets us rotate about the wheel's
             own centre without recomputing an SVG user-space origin. */
          @keyframes gpx-spin { to { transform: rotate(360deg); } }
          .gpx-wheel {
            transform-box: fill-box;
            transform-origin: center;
            animation: gpx-spin 0.28s linear infinite;
          }

          /* Suspension chatter over the track surface. */
          @keyframes gpx-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-1.5px); }
          }
          .gpx-bob { animation: gpx-bob 0.32s ease-in-out infinite; }

          /* Scrolling centre-line dashes, sells speed under the car. */
          @keyframes gpx-road { to { background-position-x: -160px; } }
          .gpx-road {
            background-image: repeating-linear-gradient(90deg, #fff 0 26px, transparent 26px 80px);
            animation: gpx-road 0.55s linear infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .gpx-wheel, .gpx-bob, .gpx-road { animation: none; }
          }
        `}</style>
      </div>
    </SEO>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">{label}</span>
      {children}
    </label>
  );
}
