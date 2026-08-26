import { SEO } from "@/components/SEO";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { HostOnboardingDeck } from "@/components/HostOnboardingDeck";
import { Reveal } from "@/components/Reveal";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, BookOpen } from "lucide-react";

export default function HostOnboardingDoc() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-ember/20 selection:text-ember">
      <SEO
        title="Founding Hosts Onboarding Deck (Goa 2026) | Wayzyy"
        description="Official Wayzyy Founding Hosts Onboarding Presentation for Goa villa and homestay owners. Explore 0% host commission, market data, credit packs, and direct host protection."
        canonicalUrl="https://wayzyy.com/onboarding"
      />

      <SiteNav />

      <main className="container pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Link & Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <Reveal>
          <div className="mb-8 text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
              Founding Hosts Invitation · Goa 2026
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08]">
              The Official Wayzyy Onboarding Document
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Read through the 11-page invitation deck detailing why Goa hosts are switching from 18%+ legacy commissions to 0% direct booking with Wayzyy.
            </p>
          </div>
        </Reveal>

        {/* Interactive Deck Component */}
        <div className="my-8">
          <HostOnboardingDeck />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
