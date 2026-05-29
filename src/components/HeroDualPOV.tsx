import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Backpacker } from "./Backpacker";
import { MapPin, Compass } from "lucide-react";

/**
 * A sticky, two-panel hero. As you scroll through the section,
 * a backpacker silhouette walks from the "traveler" half across
 * the seam into the "host" half, while the panels slide to reveal
 * the other side's point of view.
 */
export function HeroDualPOV() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  // backpacker walks from -5% to 105% horizontally; bobs a little vertically
  const walkerX = useTransform(p, [0, 1], ["-6%", "106%"]);
  const walkerScale = useTransform(p, [0, 0.5, 1], [0.95, 1.04, 0.95]);

  // panels shift in opposite directions to create a parallax "swap"
  const travelerX = useTransform(p, [0, 1], ["0%", "-30%"]);
  const hostX = useTransform(p, [0, 1], ["30%", "0%"]);

  // fade between the two captions
  const travelerOpacity = useTransform(p, [0, 0.45, 0.55], [1, 1, 0]);
  const hostOpacity = useTransform(p, [0.45, 0.55, 1], [0, 1, 1]);

  // sun glow shifts
  const sunX = useTransform(p, [0, 1], ["20%", "80%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[260vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* sky / sun */}
        <motion.div
          aria-hidden
          style={{ left: sunX }}
          className="pointer-events-none absolute top-[12%] -ml-40 h-80 w-80 rounded-full bg-ember/30 blur-3xl"
        />
        <div className="grain pointer-events-none absolute inset-0" />

        {/* horizon line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[68%] h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />

        {/* HOST PANEL (left side, visible first, slides left as we scroll) */}
        <motion.div
          style={{ x: reduce ? "0%" : travelerX, opacity: travelerOpacity }}
          className="absolute inset-y-0 left-0 flex w-3/4 items-center sm:w-1/2"
        >
          <div className="ml-[clamp(1.25rem,6vw,6rem)] max-w-md">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-ember" />
              For hosts
            </div>
            <h2 className="font-display text-4xl leading-[1.02] text-foreground sm:text-6xl">
              A platform that<br />
              <em className="italic text-ember">actually backs you.</em>
            </h2>
            <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
              A simple flat-fee subscription — not a percentage of every
              booking. 24/7 support from real agents, not bots. Getting
              listed shouldn't require a PhD.
            </p>
          </div>
        </motion.div>

        {/* TRAVELER PANEL (right side, slides in as we scroll) */}
        <motion.div
          style={{ x: reduce ? "0%" : hostX, opacity: hostOpacity }}
          className="absolute inset-y-0 right-0 flex w-3/4 items-center justify-end sm:w-1/2"
        >
          <div className="mr-[clamp(1.25rem,6vw,6rem)] max-w-md text-right">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <Compass className="h-3.5 w-3.5 text-ember" />
              For travelers
            </div>
            <h2 className="font-display text-4xl leading-[1.02] text-foreground sm:text-6xl">
              Stays without the<br />
              <em className="italic text-ember">small print.</em>
            </h2>
            <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
              The price you see is the price you pay. No surprise cleaning fees,
              no checkout chores list, no resort-fee cosplay. Just real homes,
              real hosts, real nights.
            </p>
          </div>
        </motion.div>

        {/* GROUND seam */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-muted/60 to-transparent" />

        {/* BACKPACKER walks across — pinned to ground on mobile, floats up on desktop */}
        <motion.div
          aria-hidden
          style={{ left: walkerX, scale: walkerScale }}
          className="pointer-events-none absolute bottom-[2%] -ml-6 z-0 sm:bottom-[14%] sm:-ml-12 sm:z-10"
        >
          <Backpacker className="h-20 w-14 text-foreground sm:h-44 sm:w-32" />
          {/* shadow */}
          <div className="mx-auto -mt-1 h-1 w-8 rounded-full bg-foreground/20 blur-[2px] sm:-mt-2 sm:h-2 sm:w-16 sm:blur-[3px]" />
        </motion.div>

        {/* scroll cue */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            <span className="inline-block h-3 w-px bg-muted-foreground" />
            scroll to walk
          </motion.div>
        </div>
      </div>
    </section>
  );
}
