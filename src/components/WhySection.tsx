import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { AlertTriangle, MessageSquareWarning, ShieldOff, Eraser, CheckCircle2, UserX } from "lucide-react";

const hostStories = [
  {
    icon: MessageSquareWarning,
    kicker: "Case Study 01 · Extortion",
    title: "The Refund-for-Review Playbook",
    quote:
      "\"Refund me or I’ll feel obligated to mention this in my review.\" A Superhost with 10 years and 5,000+ reviews lost a full night's stay to guest extortion.",
    outcome: "Legacy support granted a free night. The host's calm warning to other hosts was deleted; the guest's 1-star stayed up.",
    tint: "border-red-500/30 bg-red-500/5",
  },
  {
    icon: AlertTriangle,
    kicker: "Case Study 02 · Verification Failure",
    title: "Staged Evidence Beats Time-Stamped Proof",
    quote:
      "A late-night photo set with replaced bedding was accepted instantly by an offshore support agent, overriding the host's clean timestamped check-in photos.",
    outcome: "Penalty-free cancellation granted without host verification or opportunity for defense.",
    tint: "border-amber-500/30 bg-amber-500/5",
  },
  {
    icon: Eraser,
    kicker: "Case Study 03 · Silenced Warnings",
    title: "Suppressed Host Warnings & High Platform Fees",
    quote:
      "Honest reviews left to protect future hosts get scrubbed as 'retaliatory.' Meanwhile, platforms quietly deduct 15%–20% commission on every stay.",
    outcome: "Hosts absorb high fees while losing basic platform trust and support.",
    tint: "border-ember/30 bg-ember/5",
  },
];

export function WhySection() {
  return (
    <section id="why" className="relative scroll-smooth-anchor py-24 sm:py-36 border-t border-border/40">
      <div className="container">
        <Reveal>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Why We're Building Wayzyy
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="max-w-4xl font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-foreground tracking-tight">
            Hosts are walking away.{" "}
            <span className="text-muted-foreground font-normal">
              Not because hosting got harder —
            </span>{" "}
            because traditional platforms stopped having their back.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Across India and worldwide, thousands of dedicated homestay hosts encounter the exact same systemic issues on legacy platforms every single day:
          </p>
        </Reveal>

        {/* Featured Host Story Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {hostStories.map((story, i) => (
            <Reveal key={story.title} delay={0.08 * i}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`group relative flex flex-col justify-between h-full rounded-2xl border ${story.tint} p-6 sm:p-7 shadow-lg backdrop-blur-md`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ember">
                      {story.kicker}
                    </span>
                    <story.icon className="h-5 w-5 text-ember shrink-0" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground leading-snug">
                    {story.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
                    {story.quote}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                  <span className="font-bold text-red-400 block mb-1">Impact:</span>
                  {story.outcome}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Wayzyy Statement Banner */}
        <Reveal delay={0.2}>
          <div className="mt-12 rounded-3xl border border-ember/40 bg-gradient-to-r from-ember/15 via-ember/10 to-amber-500/10 p-6 sm:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ember">
                  <CheckCircle2 className="h-4 w-4" /> The Wayzyy Standard
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                  Aadhaar verification, evidence-backed disputes, and 0% booking commission.
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We verify both hosts and guests through Aadhaar & DigiLocker, enforce fair cancellation rules, and operate on a flat credit pack model so you keep 100% of your earnings.
                </p>
              </div>

              <a
                href="#waitlist"
                className="shrink-0 h-12 px-6 rounded-full bg-ember hover:bg-ember/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2"
              >
                Join Goa Host Waitlist
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
