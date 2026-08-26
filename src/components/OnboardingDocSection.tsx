import { Reveal } from "./Reveal";
import { HostOnboardingDeck } from "./HostOnboardingDeck";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";

export function OnboardingDocSection() {
  return (
    <section id="onboarding-doc" className="relative scroll-smooth-anchor py-24 sm:py-32 border-t border-border/40 bg-muted/20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ember">
              <Sparkles className="h-4 w-4" />
              Founding Hosts Deck · Goa 2026
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-[1.08]">
              The Official Wayzyy Onboarding Document
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Take a look through our official 11-page pitch and roadmap for Goa villa and homestay hosts. Scroll or click through each page below.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-ember hover:text-ember/80 transition-colors uppercase tracking-wider"
              >
                Open Full Screen View <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <HostOnboardingDeck embedded={true} />
        </Reveal>
      </div>
    </section>
  );
}
