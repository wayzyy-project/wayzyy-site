import { Link } from "react-router-dom";
import { Swords, ArrowRight, DollarSign, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GigChallengeTeaser() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-card/30 py-16 sm:py-24 px-[clamp(1.25rem,6vw,6rem)]">
      {/* Background ambient ember glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-[600px] rounded-full bg-[hsl(var(--ember))]/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl rounded-3xl border-2 border-[hsl(var(--ember))]/30 bg-gradient-to-b from-[hsl(var(--ember))]/10 via-card to-card p-8 sm:p-12 shadow-2xl overflow-hidden">
        {/* Top right decorative badge */}
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-[hsl(var(--ember))]/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--ember))]/40 bg-[hsl(var(--ember))]/10 px-3.5 py-1 text-xs font-bold text-[hsl(var(--ember))] uppercase tracking-wider">
              <Swords className="h-3.5 w-3.5" />
              <span>Solo Developer Challenge</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Think you can beat <span className="text-[hsl(var(--ember))]">Airbnb's chat moderation?</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We're hiring solo developers to solve contact-info evasion (phone digit splitting, obfuscated text, unsafe links). Pitch your architecture and build a production-grade engine.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/60 p-3.5">
                <div className="h-9 w-9 rounded-lg bg-[hsl(var(--ember))]/10 flex items-center justify-center text-[hsl(var(--ember))] shrink-0 font-bold">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">$1,000 / Month Role</div>
                  <div className="text-[11px] text-muted-foreground">Internship or FTE Solo Dev</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/60 p-3.5">
                <div className="h-9 w-9 rounded-lg bg-[hsl(var(--ember))]/10 flex items-center justify-center text-[hsl(var(--ember))] shrink-0 font-bold">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Paid 2-Day Trial</div>
                  <div className="text-[11px] text-muted-foreground">Round 2 Build Payout</div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link to="/gig-challenge">
                <Button
                  size="lg"
                  className="rounded-full bg-[hsl(var(--ember))]/90 hover:bg-[hsl(var(--ember))] text-white font-bold text-sm sm:text-base px-8 py-3.5 shadow-lg shadow-[hsl(var(--ember))]/30 transition-all hover:scale-105 gap-2"
                >
                  View Challenge Brief & Pitch
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-background/80 backdrop-blur-md p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">THE BENCHMARK</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full">
                <ShieldAlert className="h-3 w-3" /> Evasion Case
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <div className="text-[10px] text-red-400/80 mb-1 font-sans font-bold">INPUT TO DETECT:</div>
                <code>"hi i a92m a121ksh35ay call nine eight 7 six zero"</code>
              </div>

              <div className="space-y-2 pt-1 font-sans text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--ember))]" />
                  <span>Round 1: Pitch Deck + 2–5 min Loom video</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--ember))]" />
                  <span>Round 2: 2-day working prototype build</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/gig-challenge"
                className="text-xs font-bold text-[hsl(var(--ember))] hover:underline inline-flex items-center gap-1"
              >
                Read full challenge criteria & submit pitch →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
