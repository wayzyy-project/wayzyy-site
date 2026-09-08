import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, Globe, Cpu, Zap, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";

export default function SarvamStartupProgram() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wayzyy.com" },
        { "@type": "ListItem", "position": 2, "name": "News", "item": "https://wayzyy.com/news" },
        { "@type": "ListItem", "position": 3, "name": "Sarvam AI Startup Program", "item": "https://wayzyy.com/news/sarvam-startup-program" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Wayzyy selected for the Sarvam AI Startup Program",
      "description": "Wayzyy has been selected for the Sarvam AI Startup Program to build next-generation multilingual AI hospitality tools on India's sovereign AI infrastructure.",
      "image": "https://wayzyy.com/sarvam-logo.png",
      "datePublished": "2026-08-15",
      "author": {
        "@type": "Organization",
        "name": "Wayzyy",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Wayzyy",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wayzyy.com/logo.svg",
        },
      },
    },
  ];

  return (
    <SEO
      title="Wayzyy selected for the Sarvam AI Startup Program - News"
      description="Wayzyy has been selected for the Sarvam AI Startup Program to build next-generation multilingual AI hospitality tools on India's sovereign AI infrastructure."
      jsonLd={schemas}
      path="/news/sarvam-startup-program"
    >
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#FF6B00]/20 selection:text-[#FF6B00]">
        {/* Minimal standalone nav — fully separate from the marketplace */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/logo.svg" alt="Wayzyy" className="h-8 w-8 rounded-full object-cover" />
              <span style={{ fontFamily: '"Raleway", sans-serif' }} className="text-lg font-black tracking-tight text-zinc-900 group-hover:text-[#FF6B00] transition-colors">
                Wayzyy
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/blog" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">News</Link>
              <Link to="/" className="rounded-full bg-zinc-900 text-white px-4 py-1.5 text-xs font-semibold hover:bg-zinc-700 transition-colors">
                Visit Wayzyy
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 mx-auto max-w-3xl w-full px-5 sm:px-8 py-12 space-y-12">
          {/* Breadcrumbs & Meta */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-zinc-400" />
              <Link to="/blog" className="hover:text-zinc-900 transition-colors">News</Link>
              <ChevronRight className="h-3 w-3 text-zinc-400" />
              <span className="text-zinc-900 font-semibold">Sarvam AI Startup Program</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">August 2026</span>
              <span className="h-1 w-1 rounded-full bg-zinc-300" />
              <span className="rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 px-3 py-0.5 text-xs font-semibold">
                Partnership
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
              Wayzyy selected for the Sarvam AI Startup Program
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal pt-1">
              We're excited to announce that Wayzyy has been selected for the <strong className="text-zinc-900 font-semibold">Sarvam AI Startup Program</strong> — an initiative designed to support early-stage companies building AI-powered products on India's sovereign AI infrastructure.
            </p>
          </div>

          {/* Featured Minimalist White Partnership Hero Card with Uploaded Sarvam Logo */}
          <div className="my-10 flex justify-center">
            <div className="w-full rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12 shadow-sm flex items-center justify-center gap-8 sm:gap-14 hover:border-zinc-300 transition-all">
              {/* Wayzyy Logo & Wordmark */}
              <div className="flex items-center gap-3.5">
                <img
                  src="/logo.svg"
                  alt="Wayzyy"
                  className="h-11 w-11 sm:h-14 sm:w-14 rounded-full object-cover"
                />
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                  Wayzyy
                </span>
              </div>

              {/* Multiplication Cross (✕) */}
              <div className="text-xl sm:text-2xl font-light text-zinc-300 select-none">
                ✕
              </div>

              {/* Sarvam AI Logo & Wordmark using uploaded logo */}
              <div className="flex items-center gap-3.5">
                <img
                  src="/sarvam-logo.png"
                  alt="Sarvam AI"
                  className="h-11 w-11 sm:h-14 sm:w-14 object-contain"
                />
                <span className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 lowercase">
                  sarvam
                </span>
              </div>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="space-y-8 text-zinc-700 text-base leading-relaxed">
            <p>
              <a
                href="https://www.sarvam.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 font-semibold underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900 transition-colors"
              >
                Sarvam AI
              </a>{" "}
              is building full-stack AI infrastructure from India — including large language models, speech-to-text, text-to-speech, Indic translation, and document intelligence APIs — all natively optimized for 22 Indian languages and English. Their mission to build sovereign, world-class AI from India deeply resonates with our vision at Wayzyy.
            </p>

            {/* What this means */}
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                What this means for us
              </h2>
              <p className="text-zinc-600">
                As part of the program, Wayzyy receives:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900">
                    <Zap className="h-4 w-4 text-[#FF6B00]" />
                    <span>API credits</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    6 to 12 months of access to Sarvam's production-grade APIs, including speech, language, and document intelligence endpoints.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900">
                    <Cpu className="h-4 w-4 text-[#FF6B00]" />
                    <span>Priority engineering support</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Direct access to Sarvam's engineering team for integration, optimization, and scaling guidance.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900">
                    <ShieldCheck className="h-4 w-4 text-zinc-900" />
                    <span>Production-ready infrastructure</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Enterprise-grade AI infrastructure built for reliability and scale, purpose-built for the Indian context.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900">
                    <Globe className="h-4 w-4 text-[#FF6B00]" />
                    <span>Launch visibility</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Opportunities for co-branded case studies and ecosystem amplification.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Use Cases */}
            <div className="space-y-4 pt-6">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Primary Use Cases with Which We Plan to Begin Integrations
              </h2>
              <p className="text-zinc-600">
                Wayzyy will leverage Sarvam AI's sovereign APIs across four mission-critical operational pillars to redefine safety, verification, and host-guest interactions:
              </p>

              <div className="space-y-4 pt-2">
                {/* Use Case 1 */}
                <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">Document Digitization & Property Verification</h3>
                      <p className="text-xs text-zinc-500">Automated OCR and document intelligence for host verification</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    When a host submits documents (such as state tourism registration certificates, property tax receipts, electricity bills, or ownership deeds), Sarvam's document intelligence models will automatically extract, digitize, and validate the relevant property data. The system cross-references extracted details with the listing specifications to ensure every property on Wayzyy is 100% verified and legitimate before approval.
                  </p>
                </div>

                {/* Use Case 2 */}
                <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">Real-Time Chat Moderation & Safety</h3>
                      <p className="text-xs text-zinc-500">Proactive screening of host-guest messaging</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    We are deploying Indic language moderation models to automatically screen host-guest communications in real time. This detects unsafe interactions, blocks fraudulent off-platform transaction attempts, protects sensitive personal credentials, and ensures a respectful, trusted environment for our community.
                  </p>
                </div>

                {/* Use Case 3 */}
                <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">Native Indic Text Translation</h3>
                      <p className="text-xs text-zinc-500">Eliminating language friction across 22 Indian languages</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Homestay hosts in destinations like Goa, Rajasthan, and Himachal Pradesh often prefer communicating in their local vernaculars (Hindi, Konkani, Marathi, Gujarati, etc.). Sarvam's high-accuracy Indic translation models bridge the gap, translating inquiries, house rules, and check-in instructions seamlessly between hosts and guests.
                  </p>
                </div>

                {/* Use Case 4 */}
                <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">Chat Completions & First-Response Customer Support</h3>
                      <p className="text-xs text-zinc-500">Instant conversational triage for hosts and travelers</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    When a host or guest initiates a support request with our team, Sarvam-powered chat completions will manage the opening interaction. The AI provides instant first responses, gathers context, troubleshoots common FAQs (pricing adjustments, calendar sync, policy clarifications), and smoothly routes complex escalations directly to a human support specialist with full background context.
                  </p>
                </div>
              </div>
            </div>

            {/* Why this matters */}
            <div className="space-y-4 pt-6">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Why this matters
              </h2>
              <p>
                At Wayzyy, we believe the next wave of transformative hospitality and marketplace experiences in India will be built by teams who understand local context deeply. Sarvam's sovereign AI stack — trained on Indian languages and optimized for Indian use cases — gives us infrastructure that aligns directly with the problems we're solving for peer-to-peer homestays and vacation rentals.
              </p>
              <p>
                This partnership accelerates our ability to build intelligent systems that are not just technically advanced, but genuinely accessible to the people they serve — from multilingual assistance for regional homestay hosts to instant document intelligence for government tourism compliance.
              </p>
            </div>

            {/* Looking ahead */}
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Looking ahead
              </h2>
              <p>
                Being part of the Sarvam Startup Program is a meaningful milestone for Wayzyy. It validates our direction and gives us the tools to move faster. We're grateful to the Sarvam team for their support and look forward to building together.
              </p>
              <div className="pt-2">
                <a
                  href="https://www.sarvam.ai/startup-program"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-900 font-semibold hover:text-[#FF6B00] transition-colors"
                >
                  <span>Learn more about the Sarvam AI Startup Program</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Author / CTA Box */}
          <div className="pt-10 border-t border-zinc-200">
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src="/logo.svg" alt="Wayzyy" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900" style={{ fontFamily: '"Raleway", sans-serif' }}>Wayzyy</h4>
                  <p className="text-xs text-zinc-500">Homestays with flat-fee subscriptions & 0% guest fees.</p>
                </div>
              </div>
              <Link
                to="/"
                className="rounded-xl bg-zinc-900 text-white px-5 py-2.5 text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Visit Wayzyy
              </Link>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </SEO>
  );
}
