import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import {
  Camera,
  ShieldCheck,
  Tag,
  Headphones,
  TrendingUp,
  Star,
  Gift,
} from "lucide-react";

type Side = "traveler" | "host";

const content = {
  host: {
    label: "I'm Hosting",
    headline: (
      <>We grow with you —{" "}<span className="text-ember italic font-display">not off you.</span></>
    ),
    intro:
      "Choose a subscription tier that fits your booking volume. Keep far more of each booking than you would anywhere else — no per-booking percentage, ever. And if a guest causes repeated trouble, they're off the platform.",
    bullets: [
      {
        icon: Tag,
        title: "Tiered subscription plans",
        body:
          "Pick a pass that matches your booking volume — Starter, Growth, or Pro. A flat fee per tier, not a percentage bled from every guest payment. Predictable costs, no surprises.",
      },
      {
        icon: Headphones,
        title: "24/7 support — real agents",
        body:
          "Unlike other platforms where you're stuck in a loop of automated replies, our team picks up. Real humans, with authority, around the clock. Email, call, sorted.",
      },
      {
        icon: ShieldCheck,
        title: "Aadhaar-verified guest identity",
        body:
          "Every guest's identity is digitally verified via Aadhaar before they book. Full KYC details secured on both ends — you know exactly who's walking through your door.",
      },
      {
        icon: TrendingUp,
        title: "No algorithm penalty on your reach",
        body:
          "We don't throttle your listing's visibility because of a rough patch. A couple of low ratings won't silently bury your property in search results. Your reach is yours.",
      },
    ],
  },
  traveler: {
    label: "I'm Travelling",
    headline: (
      <>Real listings.{" "}<span className="text-ember italic font-display">Real protection.</span></>
    ),
    intro:
      "No fake images. No mystery fees. Every host is Aadhaar-verified, every new listing reviewed by our staff, and guests who leave a trail of dishonest reviews get blacklisted — so the community stays worth being part of.",
    bullets: [
      {
        icon: Camera,
        title: "AI-verified listing photos",
        body:
          "Every image uploaded by a host is run through our AI detection pipeline. Fake renders, old photos, stock images — flagged before they reach you.",
      },
      {
        icon: ShieldCheck,
        title: "Aadhaar-verified hosts",
        body:
          "Hosts are identity-verified via Aadhaar before listing. Privacy and security come first — you always know the property is owned by a real, verifiable person.",
      },
      {
        icon: Star,
        title: "Staff reviews for new listings",
        body:
          "Every newly added property gets a justified review from our team before it accumulates guest reviews. No empty 5-stars on day one.",
      },
      {
        icon: Gift,
        title: "Early joiner referral discounts",
        body:
          "Join early, refer a friend, both of you get discounts on your first stays. Guests who leave repeated bad-faith reviews are removed from the platform — keeping the community clean.",
      },
    ],
  },
} as const;

export function TwoSides() {
  const [side, setSide] = useState<Side>("host");
  const data = content[side];

  return (
    <section id="two-sides" className="relative scroll-smooth-anchor border-y border-border bg-card/40 py-28 sm:py-40">
      <div className="container">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                Two sides, one platform
              </div>
              <h2 className="font-display text-4xl leading-[1.04] text-foreground sm:text-6xl text-balance">
                Pick your side.{" "}
                <span className="text-muted-foreground">
                  Same Wayzyy, different view.
                </span>
              </h2>
            </div>
            {/* segmented toggle */}
            <div className="flex shrink-0 rounded-full border border-border bg-background p-1 text-sm">
              {(["host", "traveler"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={
                    "relative rounded-full px-5 py-2 transition-colors " +
                    (side === s
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {side === s && (
                    <motion.span
                      layoutId="two-sides-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative">{content[s].label}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={side}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <h3 className="max-w-3xl font-display text-3xl text-foreground sm:text-5xl text-balance">
              {data.headline}
            </h3>
            <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {data.intro}
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {data.bullets.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 * i,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -3 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 sm:p-8"
                >
                  <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-ember/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <b.icon className="h-5 w-5 text-ember" />
                  <h4 className="mt-4 font-display text-2xl text-foreground sm:text-3xl">
                    {b.title}
                  </h4>
                  <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">
                    {b.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
