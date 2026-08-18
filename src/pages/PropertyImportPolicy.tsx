import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PropertyImportPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Property Listing & Import Verification Policy - Wayzyy"
        description="Learn how Wayzyy handles property listing imports, direct host pricing, manual identity verification, and third-party review exclusions."
      />

      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/policies" className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Policies
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-sm font-semibold text-foreground">
              Wayzyy
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
        <div className="border-b border-border pb-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Property Verification & Import Standard
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Property Listing & Import Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            Effective Date: 25 June 2026 • Governed by Digital Personal Data Protection Act 2023 & Consumer Protection Rules
          </p>
        </div>

        {/* Overview Box */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Executive Overview</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Wayzyy provides an automated listing import tool to empower hosts to migrate property descriptions and high-resolution photo galleries seamlessly from external platforms (e.g. Airbnb, Booking.com). To protect guest authenticity and host pricing autonomy, this Policy mandates strict rules regarding pricing, reviews, and manual verifications.
          </p>
        </div>

        {/* Section 1: Review Integrity */}
        <div id="review-policy" className="rounded-2xl border border-border bg-card p-6 space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base font-display">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            1. Prohibition of Third-Party Review & Rating Scraping
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Wayzyy does <strong>not</strong> import, scrape, or display guest reviews, star counts, or host ratings from external third-party travel platforms.
          </p>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside bg-muted/30 p-4 rounded-xl border border-border">
            <li><strong>Verified Stays Only:</strong> Every review on Wayzyy corresponds to an authentic, completed booking processed via Wayzyy.</li>
            <li><strong>No Transferable Testimonials:</strong> Reviews cannot be imported from other platforms to prevent artificial manipulation or legacy ratings bias.</li>
            <li><strong>Fair Rating Ecosystem:</strong> Both hosts and guests build their trust ratings organically on Wayzyy.</li>
          </ul>
        </div>

        {/* Section 2: Pricing Control */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base font-display">
            <Lock className="h-5 w-5 text-primary" />
            2. Exclusion of External Dynamic Pricing & Direct Host Control
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            External platform pricing, algorithmic surge multipliers, and hidden guest service fees are completely stripped during the import process.
          </p>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside bg-muted/30 p-4 rounded-xl border border-border">
            <li><strong>Explicit Host Pricing:</strong> When importing a listing, hosts (or authorized admins) are required to explicitly enter their direct nightly base rate and weekend rate.</li>
            <li><strong>No Hidden Markups:</strong> Guests see true host prices without hidden commission inflations.</li>
          </ul>
        </div>

        {/* Section 3: Manual Verification */}
        <div id="verification-workflow" className="rounded-2xl border border-border bg-card p-6 space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base font-display">
            <FileText className="h-5 w-5 text-primary" />
            3. Mandatory Manual Verification & Approval Workflow
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every imported listing is created in <strong>Pending Review</strong> status before becoming visible to travellers.
          </p>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside bg-muted/30 p-4 rounded-xl border border-border">
            <li><strong>Human Audit:</strong> Wayzyy’s Indian operations team inspects property imagery, location accuracy, and host authorization.</li>
            <li><strong>Identity Verification:</strong> Hosts can complete manual verification by submitting official photo ID (Aadhaar, PAN, or Passport) and a live selfie.</li>
            <li><strong>Listing Activation:</strong> Once verified, the listing transitions to Active status and receives a "Verified Host" badge.</li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">Have questions about property imports?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Reach out to our host support team directly.</p>
          </div>
          <a
            href="mailto:support@wayzyy.com"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Contact Host Operations
          </a>
        </div>
      </main>
    </div>
  );
}
