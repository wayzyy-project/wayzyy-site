import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Waitlist } from "@/components/Waitlist";
import { SEO } from "@/components/SEO";

export default function AppLaunchSoon() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground">
      <SEO
        title="App Launching Soon — Wayzyy Homestays"
        description="We are launching soon with over 500 hand-picked properties and 50 trusted hosts. Join the waitlist for direct booking with zero platform markup."
      />
      <SiteNav />

      {/* Main Container */}
      <main className="relative flex-grow flex items-center justify-center pt-28 pb-16 px-4">
        {/* Glow decoration */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,hsl(var(--ember)/0.15),transparent_65%)]"
        />

        <div className="relative w-full max-w-2xl mx-auto text-center space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <span className="inline-flex items-center rounded-full bg-ember/10 px-3 py-1 text-xs font-medium text-ember ring-1 ring-inset ring-ember/20">
              Launching Soon
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.1] tracking-tight">
              Booking is going <br />
              <span className="text-ember">live very soon.</span>
            </h1>
            <p className="max-w-lg mx-auto text-muted-foreground text-base sm:text-lg leading-relaxed">
              Our team is now trying their best to get in front of your eyes. With over{" "}
              <strong className="text-foreground">500 properties</strong> and{" "}
              <strong className="text-foreground">50 hosts</strong>, we are increasing the numbers before our launch so that we have options for all your needs.
            </p>
          </motion.div>

          {/* Waitlist signup container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-md bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-xl shadow-ember/5">
              <h3 className="font-display text-lg text-foreground mb-1 text-left sm:text-center">
                Get notified when bookings open
              </h3>
              <p className="text-sm text-muted-foreground mb-6 text-left sm:text-center">
                Be the first to browse verified villas and save up to 20% compared to other booking sites.
              </p>
              <div className="flex justify-center">
                <Waitlist defaultAudience="traveler" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
