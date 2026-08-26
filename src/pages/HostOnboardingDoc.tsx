import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { HostOnboardingDeck } from "@/components/HostOnboardingDeck";
import { Reveal } from "@/components/Reveal";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Home,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";

export default function HostOnboardingDoc() {
  const [searchParams] = useSearchParams();
  const isFromWaitlist = searchParams.get("from") === "waitlist";
  const cityParam = searchParams.get("city") || "Goa";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-ember/20 selection:text-ember">
      <SEO
        title="Founding Hosts Onboarding Deck (Goa 2026) | Wayzyy"
        description="Official Wayzyy Founding Hosts Onboarding Presentation for Goa villa and homestay owners. Explore 0% host commission, market data, credit packs, and direct host protection."
        canonicalUrl="https://wayzyy.com/onboarding"
      />

      <SiteNav />

      <main className="container pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <Link
            to="/host"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ember hover:text-ember/80 transition-colors uppercase tracking-wider"
          >
            Skip to Host Portal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Waitlist Welcome Callout */}
        {isFromWaitlist && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-3xl border border-ember/40 bg-gradient-to-r from-ember/15 via-ember/10 to-amber-500/10 p-5 sm:p-7 shadow-xl backdrop-blur-md"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ember">
                  <CheckCircle2 className="h-4 w-4" /> Waitlist Confirmed · {cityParam} Founding Hosts
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                  You're officially on the list!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Take a look at the 11-page onboarding deck below. Once you're ready, your next step is simply stepping into the <strong>Host Portal</strong> to log in and list your property.
                </p>
              </div>

              <Link
                to="/host"
                className="shrink-0 h-11 px-7 rounded-full bg-ember hover:bg-ember/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2"
              >
                Go to Host Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Page Main Headline */}
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
              Read through the 11-page invitation deck detailing why hosts across {cityParam} and beyond are switching from 18%+ legacy commissions to 0% direct booking with Wayzyy.
            </p>
          </div>
        </Reveal>

        {/* Interactive Deck Component */}
        <div className="my-8">
          <HostOnboardingDeck />
        </div>

        {/* Next Step / Guided Host Journey */}
        <Reveal delay={0.15}>
          <div className="mt-16 rounded-3xl border border-border/80 bg-card/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-ember">
                Next Steps for Hosts
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Liked what you read? Here's your journey.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Getting started on Wayzyy takes less than 5 minutes. No complex paperwork, no hidden costs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 sm:p-6 space-y-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ember/20 text-ember font-extrabold text-xs">
                  01
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Read Onboarding Deck
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You're here! Understand the 0% commission model, market data, and prepaid credit packs.
                </p>
              </div>

              <div className="rounded-2xl border border-ember/40 bg-ember/5 p-5 sm:p-6 space-y-3 shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ember text-white font-extrabold text-xs shadow-md">
                  02
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Log in to Host Portal
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sign in securely using Google SSO or email. Set up your host profile in seconds.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 sm:p-6 space-y-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ember/20 text-ember font-extrabold text-xs">
                  03
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  List Your Property
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Add photos, set your price, get Aadhaar verified, and keep 100% of every booking.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground font-medium text-center sm:text-left">
                Already have an Airbnb or Booking.com listing? You can self-import it in 1 click!
              </p>
              <Link
                to="/host"
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-ember hover:bg-ember/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                Go to Host Portal & Log In <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
