import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Wallet, Percent } from "lucide-react";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";

// Served straight from /public so the SSR prerender script (which runs the
// component tree through plain tsx, without Vite's asset pipeline) can
// resolve these as plain string URLs instead of bundler-processed imports.
const economicsIllustration = "/illustrations/economics-illustration.webp";
const realHostingIllustration = "/illustrations/real-hosting-illustration.webp";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function EconomicsSection() {
  const reduce = useReducedMotion();
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: imgProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  // Subtle parallax: the villa photo drifts a little slower than the page
  // scrolls, giving the "big numbers" stat section some depth. One instance
  // of this on the whole homepage is the ask - a marketing/explanatory
  // section like this one is exactly where it earns its place.
  const imgY = useTransform(imgProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="economics"
      className="relative scroll-smooth-anchor overflow-hidden bg-gradient-to-b from-background via-ember/[0.05] to-background py-28 dark:via-ember/[0.07] dark:to-background sm:py-40"
    >
      <div className="container">
        <Reveal>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            How the money actually works
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-4xl font-display text-4xl leading-[1.04] text-foreground sm:text-6xl text-balance">
            We don't take a cut.{" "}
            <span className="text-muted-foreground">You recharge, like a phone plan.</span>
          </h2>
        </Reveal>

        {/* Block A: image left, text right */}
        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div
              ref={imgRef}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border sm:aspect-[16/11] shadow-2xl"
            >
              <motion.img
                src={economicsIllustration}
                alt="Goa beach house editorial illustration"
                className="h-full w-full scale-[1.14] object-cover"
                loading="lazy"
                style={reduce ? undefined : { y: imgY }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <h3 className="font-display text-3xl text-foreground sm:text-4xl text-balance">
                Every other platform is a toll booth. We built a top-up meter instead.
              </h3>
              <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
                Airbnb, Booking.com, Vrbo - they all work the same way underneath: every
                booking gets skimmed. The better your villa does, the more they take. It's
                a fee that grows exactly when you'd expect it to shrink.
              </p>
              <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
                Wayzyy flips that. You buy a credit pack up front - think of it like
                recharging a SIM card - and it unlocks a set amount of booking value. No
                deduction from individual payouts, no surprise line-item on your payout
                statement. You already know what you paid, because you paid it yourself,
                on your terms, before a single guest checked in.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Big numbers moment */}
        <Reveal delay={0.05}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-ember/30 bg-ember/5 p-5 sm:mt-24 sm:p-14">
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:tracking-[0.25em]">
                  <Percent className="h-3.5 w-3.5 text-ember" />
                  Airbnb's effective take rate
                </div>
                <div className="mt-2 font-display text-4xl text-foreground sm:mt-3 sm:text-7xl">
                  ~18%
                </div>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  Skimmed per booking, most Goa villa hosts see this. It scales with your
                  success - the busier you are, the more you hand over.
                </p>
              </div>
              <div className="sm:border-l sm:border-ember/20 sm:pl-6">
                <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:tracking-[0.25em]">
                  <Wallet className="h-3.5 w-3.5 text-ember" />
                  Wayzyy's effective rate
                </div>
                <div className="mt-2 font-display text-4xl text-ember sm:mt-3 sm:text-7xl">
                  ~2%
                </div>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  A flat, prepaid credit pack. It doesn't creep up as you grow - past
                  ₹5,00,000 a year, it flattens into a Custom plan, still 2.0%.
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-ember/20 pt-5 sm:mt-10 sm:pt-8">
              <p className="text-pretty font-display text-lg leading-snug text-foreground sm:text-3xl">
                Book ₹1,00,000 worth of stays in a year, and Airbnb takes roughly{" "}
                <span className="text-muted-foreground line-through decoration-2">₹18,000</span>.
                On Wayzyy, that's a ₹2,200 credit pack.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted-foreground sm:mt-3 sm:text-sm sm:tracking-[0.2em]">
                That's over ₹15,000 you keep - on that volume alone.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Block B: text left, image right */}
        <div className="mt-14 grid items-center gap-10 sm:mt-24 lg:grid-cols-2 lg:gap-16">
          <Reveal className="lg:order-1">
            <div>
              <h3 className="font-display text-3xl text-foreground sm:text-4xl text-balance">
                This is what real hosting in Goa looks like - and it's who we built this for.
              </h3>
              <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
                Not a hypothetical. Real villas, real pools, real hosts who spent years
                building a business, watching commissions climb every time they got
                better at it. Aadhaar-verified guests, staff-reviewed listings, and a fee
                structure that doesn't punish you for succeeding.
              </p>
              <div className="mt-8">
                <Button asChild variant="cta-outline" size="pill">
                  <Link to="/earnings-calculator" className="gap-1.5">
                    Run your own numbers
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.08 }}
            className="lg:order-2"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border sm:aspect-[16/11] shadow-2xl">
              <img
                src={realHostingIllustration}
                alt="Real hosting in Goa villa pool deck illustration"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
