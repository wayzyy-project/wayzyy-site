import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Heart, Sparkles, Building2, HelpCircle, Instagram, Linkedin, Twitter } from "lucide-react";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Wayzyy",
  "legalName": "Wayzyy Technologies Private Limited",
  "url": "https://wayzyy.com",
  "logo": "https://wayzyy.com/favicon.png",
  "alternateName": ["Wayzyy Goa", "Wayzyy Stays", "Wayzyy Travel", "Wayzyy Vacation Rentals", "Wayzyy Homestays"],
  "sameAs": [
    "https://www.instagram.com/staywayzyy/",
    "https://www.linkedin.com/company/wayzyy/",
    "https://x.com/wayzyycom"
  ],
  "description": "Wayzyy is Goa's zero-commission vacation rental and villa booking platform connecting travelers directly with verified local hosts.",
  "knowsAbout": ["Goa Tourism", "Vacation Rentals", "Villas in Goa", "Zero Commission Stays", "Goa Homestays"]
};

export default function WhatIsWayzyy() {
  return (
    <SEO
      title="What is Wayzyy? - Goa's Zero-Commission Villa & Stay Platform"
      description="What is Wayzyy? Wayzyy is Goa's zero-commission stay platform connecting travelers directly with verified local villa and homestay hosts."
      jsonLd={organizationSchema}
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation Bar */}
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
              <span className="text-border">·</span>
              <img src="/favicon.svg" alt="Wayzyy" className="h-9 w-9 rounded-full object-cover" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="border-b border-border bg-card/40 py-16 sm:py-24">
          <div className="container max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1 text-xs uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-ember" />
              Brand & Platform Guide
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-foreground leading-tight">
              What is <span className="text-ember font-semibold">Wayzyy</span>?
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
              Wayzyy is Goa’s zero-commission vacation rental and villa booking platform built for travelers who want honest pricing and hosts who want fair, commission-free rentals.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container max-w-3xl py-12 sm:py-16 space-y-12 text-base sm:text-lg text-foreground/90 leading-relaxed">
          {/* Definition Box */}
          <div className="p-8 rounded-2xl border border-ember/30 bg-ember/5 space-y-4">
            <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-ember" /> The Short Answer
            </h2>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              <strong>Wayzyy</strong> (pronounced <em>way-zee</em>) is a hospitality technology platform connecting travelers directly with verified villa, homestay, and apartment hosts across North and South Goa. Unlike traditional platforms that charge high 15%–20% guest service fees and host commissions, Wayzyy operates on a transparent, flat-subscription model with <strong>zero booking commissions</strong> for hosts and zero hidden markups for travelers.
            </p>
          </div>

          {/* Key Pillars */}
          <section className="space-y-6">
            <h2 className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              Why Was Wayzyy Built?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-border bg-card/30 space-y-2">
                <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-ember" /> For Travelers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get direct host contact, verified property listings, transparent pricing without hidden service fees, and authentic recommendations across Goa.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card/30 space-y-2">
                <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-ember" /> For Property Hosts
                </h3>
                <p className="text-sm text-muted-foreground">
                  Keep 100% of your booking income. No per-booking commissions, fair cancellation policies, DigiLocker KYC verification, and direct guest rapport.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Testimonials - the community evidence behind "Why Was Wayzyy Built?" above.
            Full-bleed section (its own `container`), so it steps outside the page's
            max-w-3xl reading column the same way the Hero and Content sections above
            each carry their own width. */}
        <TestimonialsSection />

        <div className="container max-w-3xl py-12 sm:py-16 space-y-12 text-base sm:text-lg text-foreground/90 leading-relaxed">
          {/* Pronunciation & Identity */}
          <section className="space-y-6">
            <h2 className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              Spelling & Pronunciation
            </h2>
            <p>
              Wayzyy is spelled <strong>W-A-Y-Z-Y-Y</strong>. While search engines occasionally confuse it with dictionary words or slang (like <em>wayyy</em>), Wayzyy is the official registered brand name of <strong>Wayzyy Technologies Private Limited</strong>.
            </p>
          </section>

          {/* Social Links */}
          <section className="space-y-6 pt-4">
            <h2 className="font-display text-3xl text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <HelpCircle className="h-7 w-7 text-ember" /> Official Channels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://www.instagram.com/staywayzyy/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl border border-border bg-card/40 hover:border-ember transition-colors flex items-center gap-3"
              >
                <Instagram className="h-5 w-5 text-ember" />
                <span className="text-sm font-medium text-foreground">@staywayzyy</span>
              </a>

              <a
                href="https://www.linkedin.com/company/wayzyy/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl border border-border bg-card/40 hover:border-ember transition-colors flex items-center gap-3"
              >
                <Linkedin className="h-5 w-5 text-ember" />
                <span className="text-sm font-medium text-foreground">Wayzyy LinkedIn</span>
              </a>

              <a
                href="https://x.com/wayzyycom"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl border border-border bg-card/40 hover:border-ember transition-colors flex items-center gap-3"
              >
                <Twitter className="h-5 w-5 text-ember" />
                <span className="text-sm font-medium text-foreground">@wayzyycom</span>
              </a>
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </SEO>
  );
}
