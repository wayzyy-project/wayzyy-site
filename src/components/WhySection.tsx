import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { AlertTriangle, MessageSquareWarning, ShieldOff, Eraser } from "lucide-react";

const beats = [
  {
    icon: MessageSquareWarning,
    title: "Refund-for-review extortion",
    body:
      '"Refund me or I’ll feel obligated to mention this in my review." This is a textbook threat, and on legacy platforms it works.',
  },
  {
    icon: AlertTriangle,
    title: "Staged \"evidence\" beats time-stamped proof",
    body:
      "A 2am photo set, replaced bedding, a sympathetic agent, and the cancellation goes through - penalty-free - even when the host has clean before-photos.",
  },
  {
    icon: Eraser,
    title: "The host's warning gets deleted",
    body:
      "Honest reviews left for the next host get pulled as \"retaliatory.\" The lying guest's review stays up. Other hosts never see the warning.",
  },
  {
    icon: ShieldOff,
    title: '"The decision is final."',
    body:
      "Trust & Safety isn't reachable. Receipts don't matter. Ten years of clean hosting doesn't matter. The same line gets repeated until you stop emailing.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="relative scroll-smooth-anchor py-28 sm:py-40">
      <div className="container">
        <Reveal>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Why we’re building this
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="max-w-4xl font-display text-4xl leading-[1.04] text-foreground sm:text-6xl text-balance">
            Hosts are walking away.{" "}
            <span className="text-muted-foreground">
              Not because they got tired - 
            </span>{" "}
            because the platform stopped having their back.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            One story we keep hearing - a Superhost, almost ten years, 5,000+
            reviews, 4.88 average. A guest tried the refund-for-review playbook.
            Got a free night and a penalty-free cancel. The host's calm,
            evidence-backed warning to other hosts? <em>Deleted.</em> The lying
            guest's 1-star? <em>Still up.</em>
          </p>
        </Reveal>

        {/* the receipt-style breakdown */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {beats.map((b, i) => (
            <Reveal key={b.title} delay={0.05 * i}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <b.icon className="h-5 w-5 text-ember" />
                <h3 className="mt-4 font-display text-2xl text-foreground sm:text-3xl">
                  {b.title}
                </h3>
                <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">
                  {b.body}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 rounded-2xl border border-ember/30 bg-ember/5 p-6 sm:p-10">
            <p className="font-display text-2xl leading-snug text-foreground sm:text-3xl text-balance">
              "I didn't lose money I can't recover. What I lost is trust in the
              platform. After ten years of hosting - I'm out."
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
             - every host eventually
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
