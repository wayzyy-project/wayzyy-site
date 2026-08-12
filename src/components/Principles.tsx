import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";

const lines = [
  ["Flat-fee subscription,", "not a booking tax."],
  ["Aadhaar-verified", "hosts & guests."],
  ["24/7 support - ", "real agents, not bots."],
  ["Bad guests", "get blacklisted."],
  ["New listings", "reviewed by staff."],
  ["No algorithm", "punishing hosts."],
];

export function Principles() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative overflow-hidden py-28 sm:py-40">
      <Reveal>
        <div className="container mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            What we promise
          </div>
        </div>
      </Reveal>

      <motion.div
        style={{ x }}
        className="flex w-max gap-12 px-[clamp(1.25rem,6vw,6rem)]"
      >
        {lines.map(([a, b], i) => (
          <div
            key={i}
            className="flex shrink-0 items-baseline gap-6 font-display"
          >
            <span className="text-foreground text-[clamp(2.5rem,7vw,6.5rem)] leading-none">
              {a}
            </span>
            <span className="italic text-ember text-[clamp(2.5rem,7vw,6.5rem)] leading-none">
              {b}
            </span>
            <span className="ml-2 text-muted-foreground text-[clamp(2.5rem,7vw,6.5rem)] leading-none">
              /
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
