import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Check, X, ShieldAlert } from "lucide-react";
import { SEO } from "@/components/SEO";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wayzyy",
  "description": "Host-first short-term rental platform for Goa villas. No per-booking commission for hosts.",
  "brand": {
    "@type": "Organization",
    "name": "Wayzyy"
  },
  "url": "https://wayzyy.com/airbnb-alternative"
};

export default function AirbnbAlternativeLanding() {
  return (
    <SEO
      title="Airbnb Alternative in India & Goa: Meet Wayzyy"
      description="Looking for an Airbnb alternative in India or apps like Airbnb? Wayzyy is the host-first direct rental platform built for Goa villas. No per-booking commission."
      jsonLd={[productSchema]}
    >
      <div className="relative min-h-screen bg-background text-foreground flex flex-col">
        <SiteNav />

        {/* Breadcrumb section */}
        <div className="bg-card/20 py-4 border-b border-border/40 mt-16 sm:mt-20">
          <div className="container max-w-4xl flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-foreground font-medium">Airbnb Alternative</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="border-b border-border bg-card/10 py-16 sm:py-24">
          <div className="container max-w-4xl text-center px-4">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Direct Booking Alternative
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-foreground font-bold tracking-tight mt-4 max-w-2xl mx-auto leading-[1.1]">
              Airbnb Alternative: <br />
              <span className="text-ember">Discover Wayzyy</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
              Wayzyy is a host-first short-term rental platform, built specifically for Goa. No per-booking commission for hosts. No inflated markup for guests.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container max-w-4xl py-12 sm:py-20 px-4 flex-grow space-y-16">
          
          {/* The Direct Jab */}
          <div className="rounded-2xl border border-ember/25 bg-ember/5 p-6 sm:p-8 flex gap-4 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ember/5 rounded-full blur-3xl -z-10" />
            <ShieldAlert className="h-6 w-6 text-ember shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">The Hidden 15.5% Commission</h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Airbnb charges hosts a <strong>15.5% fee</strong> on every single booking, forever, with no ceiling. That cost almost always ends up baked into the price a guest pays. Wayzyy works differently — hosts pay a flat, low-cost credit instead of a percentage cut, which means the price you see is closer to the price the host actually wanted to charge.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl text-foreground font-bold text-center">Compare the Models</h2>
            <div className="overflow-x-auto border border-border rounded-2xl bg-card/25 shadow-xl">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="p-4 sm:p-5 font-display font-semibold text-sm tracking-wider uppercase text-muted-foreground w-1/3">Feature</th>
                    <th className="p-4 sm:p-5 font-display font-semibold text-sm tracking-wider uppercase text-muted-foreground w-1/3">Airbnb</th>
                    <th className="p-4 sm:p-5 font-display font-semibold text-sm tracking-wider uppercase text-ember w-1/3">Wayzyy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm sm:text-base">
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">Host fee</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">15.5% per booking, no ceiling</td>
                    <td className="p-4 sm:p-5 text-foreground font-medium bg-ember/5 border-l border-ember/20">Flat prepaid credit (as low as 2%)</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">Guest pricing</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Fee baked into listed price</td>
                    <td className="p-4 sm:p-5 text-foreground font-medium bg-ember/5 border-l border-ember/20">Transparent, host-set price</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">Identity verification</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Standard account verification</td>
                    <td className="p-4 sm:p-5 text-foreground font-medium bg-ember/5 border-l border-ember/20">Aadhaar-based verification via DigiLocker, for every host and guest</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">Dispute resolution</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Outsourced, AirCover claims process, slow</td>
                    <td className="p-4 sm:p-5 text-foreground font-medium bg-ember/5 border-l border-ember/20">In-house, evidence-based, 3-layer system, resolved in 7 days</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">Review disputes</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">No appeal for unfair ratings; one bad review can cost Superhost status</td>
                    <td className="p-4 sm:p-5 text-foreground font-medium bg-ember/5 border-l border-ember/20">Ratings of 3 stars or below go through manual review before publishing</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">Payout speed</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Standard payout cycle</td>
                    <td className="p-4 sm:p-5 text-foreground font-medium bg-ember/5 border-l border-ember/20">Within 24 hours of guest check-in</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">Focus</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Global, general marketplace</td>
                    <td className="p-4 sm:p-5 text-foreground font-medium bg-ember/5 border-l border-ember/20">Goa-specific, built around local hosts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Why Hosts are Switching */}
          <div className="space-y-8">
            <h2 className="font-display text-2xl sm:text-3xl text-foreground font-bold text-center">Why Hosts Are Switching</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card/30 p-6 space-y-3 hover:border-ember/40 transition-colors">
                <div className="text-2xl text-ember font-bold">01</div>
                <h3 className="font-display font-semibold text-foreground text-lg">Keep what you earn</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No commission means no silent cut disappearing from every booking. On a ₹10,000/night villa booked for a week, Airbnb's 15.5% fee takes roughly ₹11,200 off the top. Wayzyy's credit-based cost is a fraction of that.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/30 p-6 space-y-3 hover:border-ember/40 transition-colors">
                <div className="text-2xl text-ember font-bold">02</div>
                <h3 className="font-display font-semibold text-foreground text-lg">Real protection</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every host and guest goes through Aadhaar-based identity verification. Disputes are resolved by a real team, using photo evidence and a structured claims process — not an outsourced call center reading a script.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/30 p-6 space-y-3 hover:border-ember/40 transition-colors">
                <div className="text-2xl text-ember font-bold">03</div>
                <h3 className="font-display font-semibold text-foreground text-lg">Built for Goa</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Wayzyy understands the local market — from village-level villa knowledge to Goa-specific compliance requirements — in a way a platform built for every country at once cannot.
                </p>
              </div>
            </div>
          </div>

          {/* Clear Call to Action */}
          <div className="rounded-3xl border border-border/80 bg-card/45 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-ember/5 to-transparent -z-10" />
            <h2 className="font-display text-2xl sm:text-3xl text-foreground font-bold">Switch to Direct Hosting</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
              Ready to list your Goa vacation rental or villa directly and stop paying 15.5% platform commissions?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <a
                href="mailto:hello@wayzyy.com"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ember hover:bg-ember-dark text-white font-medium shadow-lg hover:shadow-ember/20 transition-all hover:-translate-y-0.5 focus:outline-none"
              >
                <span>List your villa on Wayzyy</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-border bg-background hover:bg-muted/40 text-foreground font-medium transition-all focus:outline-none"
              >
                Browse stays in Goa
              </Link>
            </div>
          </div>

          {/* Bottom Depth Line */}
          <div className="border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
            Want the full fee breakdown?{" "}
            <Link to="/blog/airbnb-vs-booking-vs-wayzyy" className="text-ember hover:underline font-medium inline-flex items-center gap-0.5">
              Read our detailed comparison of Airbnb, Booking.com, and Wayzyy
            </Link>
          </div>

        </div>

        <SiteFooter />
      </div>
    </SEO>
  );
}
