import { Link } from "react-router-dom";
import { ArrowUpRight, Home, Plane } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/Reveal";

/**
 * /waitlist - a chooser, not a form. Hosts already have a real, live
 * portal at /host (list a property, manage bookings - no waiting around),
 * so this page's only job is to split visitors into the path that's
 * actually right for them: straight into the host portal, or onto the
 * traveler waitlist at /waitlist/travelers for the booking side, which
 * isn't live yet.
 */
export default function WaitlistChooser() {
  return (
    <>
      <SEO
        title="Join Wayzyy - Waitlist"
        description="Hosting is live on Wayzyy today. Travelers - booking opens soon. Pick your path and get in."
        path="/waitlist"
      />
      <div className="relative min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,hsl(var(--ember)/0.14),transparent_60%),radial-gradient(circle_at_80%_100%,hsl(var(--ember)/0.08),transparent_55%)]"
          />
          <div className="container relative">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                  Which one's you?
                </div>
                <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl text-balance">
                  Two sides. One door.
                </h1>
                <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
                  Hosting is live right now. Booking opens soon. Tell us which
                  one you are and we'll get you to the right place.
                </p>
              </div>
            </Reveal>

            <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
              <Reveal delay={0.05}>
                <Link
                  to="/host"
                  className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-ember/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/10 text-ember">
                      <Home className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 font-display text-2xl text-foreground">
                      For Hosts
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Live today - no waiting list. List your Goa property,
                      set your own price, and keep what you earn with a flat
                      subscription instead of a per-booking cut.
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-foreground group-hover:text-ember transition-colors">
                    Go to the Host Portal
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>

              <Reveal delay={0.1}>
                <Link
                  to="/waitlist/travelers"
                  className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-ember/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/10 text-ember">
                      <Plane className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 font-display text-2xl text-foreground">
                      For Travelers
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Almost ready. We're not taking bookings yet, but the
                      waitlist gets you in first - plus referral discounts
                      for the first wave.
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-foreground group-hover:text-ember transition-colors">
                    Join the traveler waitlist
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
