import { Link } from "react-router-dom";
import { ArrowUpRight, Home, Plane, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/Reveal";
import { Waitlist } from "@/components/Waitlist";

export default function WaitlistChooser() {
  return (
    <>
      <SEO
        title="Join Wayzyy - Founding Hosts & Travelers Waitlist"
        description="Join the Founding Hosts list across Goa, Bangalore, Jaipur & beyond. 0% host commission, verified homestays, and direct bookings."
        canonicalUrl="https://wayzyy.com/waitlist"
      />
      <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between">
        <SiteNav />
        <main className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,hsl(var(--ember)/0.15),transparent_60%),radial-gradient(circle_at_80%_100%,hsl(var(--ember)/0.08),transparent_55%)]"
          />
          <div className="container relative max-w-5xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="mx-auto max-w-3xl text-center space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
                  Founding Hosts & Travelers Waitlist
                </div>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-foreground tracking-tight">
                  Be the first to walk through <span className="text-ember">the door.</span>
                </h1>
                <p className="mt-3 text-pretty text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join our founding hosts across Goa, Bangalore, Jaipur, and beyond. Submit your city and contact details below — upon submitting, you'll be directed to our 11-page Onboarding Document and guided into the Host Portal.
                </p>
              </div>
            </Reveal>

            {/* Main Form Container */}
            <div className="mx-auto mt-10 max-w-2xl">
              <Reveal delay={0.1}>
                <div className="rounded-3xl border border-border/70 bg-card/80 p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
                  <Waitlist defaultAudience="host" />
                </div>
              </Reveal>
            </div>

            {/* Fast Track Cards */}
            <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
              <Reveal delay={0.15}>
                <Link
                  to="/onboarding"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-ember/40 hover:shadow-lg"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10 text-ember mb-3">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Read Onboarding Document
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      Explore the official 11-page pitch deck with real Goa market data, 0% commission math, and transparent credit packs.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-ember group-hover:underline">
                    View 11-Page Deck <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Reveal>

              <Reveal delay={0.2}>
                <Link
                  to="/host"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-ember/40 hover:shadow-lg"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10 text-ember mb-3">
                      <Home className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Direct Host Portal
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      Already familiar with Wayzyy? Skip straight into the portal to log in, get Aadhaar verified, and list your property.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-ember group-hover:underline">
                    Go to Host Portal <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
