import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, Key, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function HostBannerSection() {
  return (
    <section className="relative scroll-smooth-anchor bg-gradient-to-b from-background via-ember/[0.05] to-background py-28 dark:via-ember/[0.07] dark:to-background sm:py-40">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <Reveal>
              <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <Key className="h-3.5 w-3.5 text-ember" /> Become a host
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl leading-[1.04] text-foreground sm:text-6xl text-balance">
                Host With Us on Wayzyy
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-base text-muted-foreground leading-relaxed">
                Whether you manage a private villa in Assagao, a beachside cottage in Palolem, or a modern apartment in Panjim — list your property directly with Wayzyy.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-ember shrink-0" />
                  <span>Keep ~98% of your booking revenue (flat fee subscription model)</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <ShieldCheck className="h-5 w-5 text-ember shrink-0" />
                  <span>DigiLocker / Aadhaar identity verification for every guest</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <Wallet className="h-5 w-5 text-ember shrink-0" />
                  <span>Fast 24-hour payouts straight to your Indian bank account</span>
                </div>
              </div>
            </Reveal>

            <div className="pt-4">
              <Button asChild variant="cta" size="pill-lg" className="gap-2 shadow-lg shadow-ember/20">
                <Link to="/host">
                  Host With Us — List Your Property
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-background/60 p-6 space-y-4 shadow-sm">
            <h3 className="font-display text-lg font-bold">Why Hosts Choose Wayzyy</h3>
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="rounded-xl border border-border p-3 bg-card/50">
                <span className="font-semibold text-foreground block mb-0.5">Zero Percentage Take Rates</span>
                Stop losing 15-20% on every single reservation to global platforms.
              </div>
              <div className="rounded-xl border border-border p-3 bg-card/50">
                <span className="font-semibold text-foreground block mb-0.5">Evidence-Based Policies</span>
                No automatic refund defaults or silent cancellation policy overrides.
              </div>
              <div className="rounded-xl border border-border p-3 bg-card/50">
                <span className="font-semibold text-foreground block mb-0.5">Direct Local Support</span>
                Reach our team directly over WhatsApp & phone whenever you need assistance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
