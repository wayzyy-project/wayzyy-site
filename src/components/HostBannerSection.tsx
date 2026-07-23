import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, Key, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HostBannerSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-card/40 py-20 px-[clamp(1.25rem,6vw,6rem)]">
      <div className="mx-auto max-w-5xl rounded-3xl border border-ember/25 bg-gradient-to-b from-ember/10 via-card to-card p-8 sm:p-12 shadow-2xl relative">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-ember/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-3.5 py-1 text-xs font-semibold text-ember uppercase tracking-wider">
              <Key className="h-3.5 w-3.5" /> Become a Host
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Host With Us on Wayzyy
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              Whether you manage a private villa in Assagao, a beachside cottage in Palolem, or a modern apartment in Panjim — list your property directly with Wayzyy.
            </p>

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

            <div className="pt-4">
              <Link to="/host">
                <Button size="lg" className="bg-ember text-white hover:bg-ember/90 rounded-xl px-8 py-3 font-semibold text-base gap-2 shadow-lg shadow-ember/20">
                  Host With Us — List Your Property
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
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
