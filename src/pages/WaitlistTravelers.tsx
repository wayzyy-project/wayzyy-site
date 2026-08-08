import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Check, Instagram, Linkedin, Twitter } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { CinematicBackgroundMedia } from "@/components/waitlist-travelers/CinematicBackgroundMedia";
import { mp } from "@/lib/mixpanel";

/**
 * Dedicated traveler-waitlist landing — the "For Users" destination from
 * the /waitlist chooser. Hosts already have a live portal (/host), so
 * this page exists purely to capture traveler emails ahead of launch.
 *
 * The email form below posts to the same /api/waitlist endpoint (and
 * fires the same mixpanel event) that the homepage's <Waitlist /> uses —
 * it's a purpose-styled variant of that same submission logic, not a
 * disconnected/fake form, adapted for a fixed "traveler" audience and a
 * dark cinematic backdrop where the shared component's light-theme
 * toggle pill wouldn't read well.
 */
export default function WaitlistTravelers() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("That doesn't look like a real email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, audience: "traveler" }),
      });
      if (!res.ok) throw new Error("Failed");
      mp.waitlistSignup("traveler", email);
      setSent(true);
      toast.success("You're in. We'll send a postcard when stays go live.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Traveler Waitlist — Wayzyy"
        description="Booking for travelers isn't open yet. Join the Wayzyy waitlist and be first in when Goa stays go live."
        path="/waitlist/travelers"
      />
      <main className="relative w-full min-h-[115vh] overflow-x-hidden flex flex-col items-center">
        <CinematicBackgroundMedia />

        <SiteNav floating />

        <div className="relative z-10 w-full max-w-7xl px-6 pt-40 sm:pt-48 md:pt-56 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full liquid-glass px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Travelers — coming soon
          </div>
          <h1 className="font-display text-4xl leading-[1.05] text-white sm:text-6xl md:text-7xl text-balance max-w-4xl">
            Be first when{" "}
            <span className="italic text-ember">Goa opens up.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
            Hosting is already live. Booking isn't — yet. Join the list and
            we'll let you through the door before anyone else, with referral
            discounts for the first wave.
          </p>

          {!sent ? (
            <form
              onSubmit={onSubmit}
              className="mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
            >
              <Input
                type="email"
                required
                placeholder="you@gowhereverwhen.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="liquid-glass h-12 flex-1 rounded-full px-5 text-base text-white placeholder:text-white/50"
              />
              <Button
                type="submit"
                variant="cta"
                disabled={loading}
                className="group h-12 gap-2 px-6 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Get early access"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </Button>
            </form>
          ) : (
            <div className="mt-8 flex h-12 w-full max-w-md items-center justify-center gap-3 rounded-full liquid-glass px-4 text-sm text-white">
              <Check className="h-4 w-4 text-ember" />
              You're on the list. Watch for a note from us.
            </div>
          )}

          <p className="mt-3 text-xs text-white/50">
            No subscription required. Just an email — unsubscribe anytime.
          </p>
        </div>

        <motion.footer
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="liquid-glass w-full rounded-3xl p-6 md:p-10 text-white/70 mt-32 md:mt-64 relative z-10 max-w-7xl mx-6 sm:mx-10"
        >
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/favicon.svg"
                  alt="Wayzyy"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="font-display text-lg tracking-wide text-white">
                  WAYZYY
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm text-white/60">
                Cozy stays, crazy nights and fair hosting. That's Wayzyy —
                homestays without the small print.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
                  Explore
                </p>
                <Link className="text-white/70 hover:text-white transition-colors" to="/blog">
                  Blog
                </Link>
                <Link
                  className="text-white/70 hover:text-white transition-colors"
                  to="/earnings-calculator"
                >
                  Earnings Calculator
                </Link>
                <Link className="text-white/70 hover:text-white transition-colors" to="/host">
                  Host With Us
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
                  Company
                </p>
                <Link
                  className="text-white/70 hover:text-white transition-colors"
                  to="/what-is-wayzyy"
                >
                  What is Wayzyy
                </Link>
                <Link className="text-white/70 hover:text-white transition-colors" to="/host-terms">
                  Host Terms
                </Link>
                <Link className="text-white/70 hover:text-white transition-colors" to="/guest-terms">
                  Guest Terms
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
                  Connect
                </p>
                <a
                  href="https://www.instagram.com/staywayzyy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4 text-ember" /> Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/wayzyy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-ember" /> LinkedIn
                </a>
                <a
                  href="https://x.com/wayzyycom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Twitter className="h-4 w-4 text-ember" /> X (Twitter)
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} Wayzyy Technologies Private
              Limited. Built honest.
            </span>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/staywayzyy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <span>·</span>
              <a
                href="https://www.linkedin.com/company/wayzyy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <span>·</span>
              <a
                href="https://x.com/wayzyycom"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                X (Twitter)
              </a>
            </div>
          </div>
        </motion.footer>
      </main>
    </>
  );
}
