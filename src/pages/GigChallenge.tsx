import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/theme-toggle";
import { Reveal } from "@/components/Reveal";
import { GoaGlobe } from "@/components/gig-challenge/GoaGlobe";
import { FlightProgress } from "@/components/gig-challenge/FlightProgress";
import { PassportStamps, StampDef } from "@/components/gig-challenge/PassportStamps";
import { EasterEggs } from "@/components/gig-challenge/EasterEggs";
import { MagneticButton } from "@/components/gig-challenge/MagneticButton";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Plane,
  ShieldAlert,
  Zap,
  Video,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  Send,
  HelpCircle,
  AlertTriangle,
  UserCheck,
  Layers,
  Award,
  Luggage,
  Ticket,
  Radar,
  CloudLightning,
  MapPin,
  Stamp as StampIcon,
  Clock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

const gigChallengeSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Solo Developer Challenge — AI Chat Moderation & Evasion Detection",
  "description": "Wayzyy is hiring solo developers for a 2-day paid challenge to build next-generation chat moderation and contact evasion detection. $1,000/month internship or full-time opportunity.",
  "identifier": {
    "@type": "PropertyValue",
    "name": "Wayzyy Technologies",
    "value": "WAYZYY-GIG-2026-01"
  },
  "datePosted": "2026-07-31",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Wayzyy",
    "sameAs": "https://wayzyy.com",
    "logo": "https://wayzyy.com/favicon.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Remote / India"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "value": 1000,
      "unitText": "MONTH"
    }
  }
};

const STAMPS: StampDef[] = [
  { id: "problem", label: "Turbulence Ahead", icon: CloudLightning },
  { id: "process", label: "Flight Plan", icon: Plane },
  { id: "perks", label: "In-Flight Perks", icon: Luggage },
  { id: "apply", label: "Boarding Pass", icon: Ticket },
  { id: "faq", label: "Control Tower", icon: Radar },
];

export default function GigChallenge() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    linkedin: "",
    github: "",
    status: "working_professional",
    writtenPitch: "",
    techniques: [] as string[],
    safetyApproach: "",
    metrics: "",
    costEstimate: "",
    pastWorkRepo: "",
    videoLink: "",
    availability: "yes",
    earliestStartDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const comboFiredRef = useRef(false);
  const bookingRef = useMemo(
    () => `WYZ-${Date.now().toString(36).toUpperCase()}`,
    []
  );

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTechniqueToggle = (tech: string, e?: React.MouseEvent) => {
    setFormData((prev) => {
      const exists = prev.techniques.includes(tech);
      const nextTechniques = exists
        ? prev.techniques.filter((t) => t !== tech)
        : [...prev.techniques, tech];

      if (!exists && nextTechniques.length >= 3 && !comboFiredRef.current) {
        comboFiredRef.current = true;
        confetti({
          particleCount: 40,
          spread: 55,
          startVelocity: 28,
          scalar: 0.7,
          colors: ["#ff6b1a", "#ffd9b3"],
          origin: {
            x: e ? e.clientX / window.innerWidth : 0.5,
            y: e ? e.clientY / window.innerHeight : 0.5,
          },
        });
      }
      if (nextTechniques.length < 3) comboFiredRef.current = false;

      return { ...prev, techniques: nextTechniques };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoLink || !formData.writtenPitch || !formData.fullName || !formData.email) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill out all mandatory fields including your 2-5 min video link.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/gig-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, bookingRef }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      setSubmitted(true);
      confetti({
        particleCount: 110,
        spread: 90,
        startVelocity: 40,
        origin: { y: 0.5 },
        colors: ["#ff6b1a", "#ffd9b3", "#141019"],
      });
      toast({
        title: "Pitch Submitted Successfully!",
        description: "We've received your pitch and video walkthrough. Check your email for confirmation — our engineering team will review it within 48-72 hours."
      });
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong saving your pitch. Please try again, or email hello@wayzyy.com directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SEO
      title="Build Challenge — $1,000 Solo Developer Internship / FTE | Wayzyy"
      description="Can you build chat moderation better than Airbnb? $1,000/month opportunity + 2-day paid trial for solo devs to solve contact-info evasion & chat safety."
      jsonLd={gigChallengeSchema}
    >
      <div className="min-h-screen bg-background text-foreground selection:bg-[hsl(var(--ember))]/20 selection:text-[hsl(var(--ember))]">
        <FlightProgress />
        <PassportStamps stamps={STAMPS} />
        <EasterEggs />

        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
          <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="group flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>wayzyy.com</span>
              </Link>
              <span className="text-border">/</span>
              <div className="flex items-center gap-2">
                <img src="/favicon.svg" alt="Wayzyy" className="h-7 w-7 rounded-full object-cover" />
                <span className="font-display font-semibold text-sm tracking-tight text-foreground">
                  Gig Challenge
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <MagneticButton
                onClick={() => scrollToSection("apply")}
                className="rounded-full bg-[hsl(var(--ember))] px-3.5 py-1.5 text-[12px] font-semibold tracking-tight text-white shadow-sm shadow-[hsl(var(--ember))]/20 ring-1 ring-inset ring-white/15 transition-colors hover:bg-[hsl(var(--ember))]/90 cursor-pointer"
              >
                Submit Pitch
              </MagneticButton>
            </div>
          </div>
        </header>

        {/* ==================== SECTION 1: HERO ==================== */}
        <section className="relative overflow-hidden border-b border-border bg-card/40 py-16 sm:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-[hsl(var(--ember))]/10 blur-[120px]" />

          <div className="container relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--ember))]/30 bg-[hsl(var(--ember))]/10 backdrop-blur-sm px-4 py-1 text-xs font-semibold text-[hsl(var(--ember))]">
                <Plane className="h-3.5 w-3.5" />
                <span>SOLO DEVELOPER CHALLENGE • $1,000 OFFER</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-foreground leading-[1.12] text-balance">
                Think you can build something better than{" "}
                <span className="relative inline-block text-[hsl(var(--ember))]">
                  Airbnb's chat moderation?
                </span>
                <br /> We're paying <span className="text-[hsl(var(--ember))]">$1,000</span> to find out.
              </h1>

              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                A 2-day paid build challenge for sharp solo developers. Pitch your architecture, walk us through your thinking on video, and build a production-grade moderation engine that beats legacy platforms.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <MagneticButton
                  onClick={() => scrollToSection("apply")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[hsl(var(--ember))] px-5 py-2.5 text-[13px] font-semibold tracking-tight text-white shadow-sm shadow-[hsl(var(--ember))]/20 ring-1 ring-inset ring-white/15 transition-colors hover:bg-[hsl(var(--ember))]/90 cursor-pointer"
                >
                  <span>Apply & Submit Pitch</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </MagneticButton>
                <MagneticButton
                  onClick={() => scrollToSection("problem")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-background/50 px-5 py-2.5 text-[13px] font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted/60 hover:border-[hsl(var(--ember))]/40 cursor-pointer"
                >
                  <span>Read Challenge Brief</span>
                </MagneticButton>
              </div>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto lg:mx-0 text-left text-xs sm:text-sm">
                <div className="p-3 rounded-lg border border-border/60 bg-background/60 backdrop-blur-sm">
                  <span className="font-semibold text-foreground block">Solo Devs Only</span>
                  <span className="text-muted-foreground text-xs">No teams, direct proof of skill</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-background/60 backdrop-blur-sm">
                  <span className="font-semibold text-[hsl(var(--ember))] block">$1,000 / Month</span>
                  <span className="text-muted-foreground text-xs">Internship or FTE path</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-background/60 backdrop-blur-sm">
                  <span className="font-semibold text-foreground block">2-Day Paid Trial</span>
                  <span className="text-muted-foreground text-xs">Trial payout for shortlisted devs</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-background/60 backdrop-blur-sm">
                  <span className="font-semibold text-foreground block">2-5 Min Video</span>
                  <span className="text-muted-foreground text-xs">Loom / Drive pitch walkthrough</span>
                </div>
              </div>
            </div>

            {/* 3D Goa globe — flight paths converging from Indian tech hubs */}
            <div className="relative mx-auto h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] lg:h-[420px] lg:w-[420px]">
              <GoaGlobe className="h-full w-full" />
              <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                <MapPin className="h-3 w-3 text-[hsl(var(--ember))]" />
                <span>ALL ROUTES LEAD TO GOA</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2: THE PROBLEM ==================== */}
        <section id="problem" className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
            <Reveal className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--ember))] uppercase tracking-wider">
                <CloudLightning className="h-4 w-4" />
                <span>Turbulence Ahead</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-foreground text-balance">
                Why Standard Chat Moderation Fails
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Guests and hosts try to bypass direct booking policies by disguising contact info. Standard regex and baseline LLMs either miss evasions or create friction with false positives.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Reveal delay={0.05} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 hover:border-[hsl(var(--ember))]/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-[hsl(var(--ember))]/10 flex items-center justify-center text-[hsl(var(--ember))]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">1. Contact-Info Evasion</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Users bypass traditional filters using creative spelling, phone digit splitting, word-numbers, and symbol insertions inside usernames and chat messages.
                </p>

                <div className="rounded-xl border border-border bg-background p-4 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-muted-foreground text-[11px] pb-2 border-b border-border">
                    <span>MEMBER CHAT INPUT</span>
                    <span className="text-[hsl(var(--ember))]">EVASION DETECTED</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400">
                      <code>"hi i a92m a121ksh35ay call me on nine eight 7 six zero"</code>
                    </div>
                    <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400">
                      <code>"reach out at insta: akshay_98_76_five_four"</code>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.12} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 hover:border-[hsl(var(--ember))]/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-[hsl(var(--ember))]/10 flex items-center justify-center text-[hsl(var(--ember))]">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">2. Conversation Safety & Moderation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This isn't just phone detection. Real moderation requires guardrails against hostility, coercion, off-platform scam links, and unsafe user behavior.
                </p>

                <div className="rounded-xl border border-[hsl(var(--ember))]/30 bg-[hsl(var(--ember))]/5 p-4 space-y-2 text-xs">
                  <div className="font-bold text-[hsl(var(--ember))] flex items-center gap-1.5">
                    <Zap className="h-4 w-4" />
                    <span>The Benchmark Requirement</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Airbnb's current system often locks innocent messages while letting clever digit-splitting slip through. We want a fast, deterministic + probabilistic hybrid pipeline that outperforms legacy OTA chat moderation.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 3: HOW IT WORKS ==================== */}
        <section id="process" className="py-16 sm:py-24 border-b border-border bg-card/20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
            <Reveal className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--ember))] uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                <span>Flight Plan</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-foreground text-balance">
                How The Challenge Works
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Two clear legs designed to evaluate your engineering intuition and build execution without wasting weeks in traditional interviews.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Reveal delay={0.05} className="relative rounded-2xl border-2 border-border bg-background p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--ember))]/10 px-3 py-1 text-xs font-bold text-[hsl(var(--ember))]">
                    LEG 1 · BOARDING
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">No Code Required Yet</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Pitch Your Approach</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Submit your written solution strategy. Explain your proposed architecture, model/regex choices, trade-offs (latency vs accuracy vs cost), and safety guardrails.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--ember))]/30 bg-[hsl(var(--ember))]/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--ember))]">
                    <Video className="h-4 w-4" />
                    <span>MANDATORY REQUIREMENT: Pitch Deck & Video</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                    <li><strong className="text-foreground">Pitch Deck:</strong> 3-6 slides max covering problem, proposed models, trade-offs & design.</li>
                    <li><strong className="text-foreground">2-5 Min Video:</strong> Solo screen-recording or talking head (Loom, Google Drive, unlisted YouTube) walking through your deck.</li>
                  </ul>
                  <p className="text-[11px] text-[hsl(var(--ember))]/90 italic">
                    *Why video? A video proves genuine understanding and filters out AI-generated pitch fluff.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.12} className="relative rounded-2xl border-2 border-[hsl(var(--ember))]/30 bg-background p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--ember))] px-3 py-1 text-xs font-bold text-white">
                    LEG 2 · TAKEOFF
                  </div>
                  <span className="text-xs font-semibold text-[hsl(var(--ember))]">2-Day Paid Trial</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">The 2-Day Working Build</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If shortlisted from Leg 1, you get 2 days to build a working prototype. Any language, framework, or model stack is allowed.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--ember))]" />
                    <span>Evaluation Criteria</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                    <li><strong className="text-foreground">Accuracy:</strong> High precision & recall on edge-case contact evasion dataset.</li>
                    <li><strong className="text-foreground">Cost & Latency:</strong> Low millisecond response time & reasonable per-check scale cost.</li>
                    <li><strong className="text-foreground">Production-Ready:</strong> Clean API design, easily deployable microservice or package.</li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 4: WHAT YOU GET ==================== */}
        <section id="perks" className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
            <Reveal className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--ember))] uppercase tracking-wider">
                <Luggage className="h-4 w-4" />
                <span>In-Flight Perks</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-foreground text-balance">
                What You Get
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Fair compensation for your trial build and a direct fast-track to joining Wayzyy.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Reveal delay={0.02} className="rounded-2xl border border-border bg-card p-6 space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--ember))]/10 flex items-center justify-center text-[hsl(var(--ember))] mx-auto">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">$1,000 / Month Role</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Paid internship for college students or full-time / contract role for experienced solo developers.
                </p>
              </Reveal>

              <Reveal delay={0.08} className="rounded-2xl border border-[hsl(var(--ember))]/30 bg-[hsl(var(--ember))]/5 p-6 space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--ember))] flex items-center justify-center text-white mx-auto shadow-md shadow-[hsl(var(--ember))]/30">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Paid 2-Day Trial</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Shortlisted Round 2 candidates receive the 2-day equivalent payout of the $1,000/month rate for their trial build work.
                </p>
              </Reveal>

              <Reveal delay={0.14} className="rounded-2xl border border-border bg-card p-6 space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--ember))]/10 flex items-center justify-center text-[hsl(var(--ember))] mx-auto">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Effective Probation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If your 2-day build works well, that build serves directly as your probation — leading to immediate onboarding.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 5: APPLICATION — BOARDING PASS ==================== */}
        <section id="apply" className="py-16 sm:py-24 border-b border-border bg-card/30">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
            <Reveal className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--ember))] uppercase tracking-wider">
                <Send className="h-4 w-4" />
                <span>Application & Pitch Submission</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-foreground">
                Your Boarding Pass
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                Fill out the ticket below. Make sure to include your <strong className="text-foreground">2-5 minute video walkthrough link</strong> of your pitch deck.
              </p>
            </Reveal>

            {/* Ticket Card */}
            <Reveal delay={0.05} className="rounded-3xl border-2 border-border bg-background shadow-2xl shadow-black/5 overflow-hidden">
              {/* Ticket header strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[hsl(var(--ember))]/5 px-6 sm:px-10 py-5 font-mono text-[10px] sm:text-xs">
                <div>
                  <div className="text-muted-foreground">PASSENGER</div>
                  <div className="font-bold text-foreground truncate">{formData.fullName || "— — —"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">DESTINATION</div>
                  <div className="font-bold text-foreground">WAYZYY HQ, GOA</div>
                </div>
                <div>
                  <div className="text-muted-foreground">GATE</div>
                  <div className="font-bold text-[hsl(var(--ember))]">07</div>
                </div>
                <div>
                  <div className="text-muted-foreground">STATUS</div>
                  <div className="font-bold text-foreground">{submitted ? "BOARDED" : "READY"}</div>
                </div>
              </div>

              {/* Perforation */}
              <div className="relative">
                <div className="border-t-2 border-dashed border-border" />
                <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-border bg-muted" />
                <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-border bg-muted" />
              </div>

              <div className="p-6 sm:p-10 space-y-8">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div
                      className="mx-auto flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border-4 border-double text-[hsl(var(--ember))]"
                      style={{
                        borderColor: "hsl(var(--ember))",
                        animation: "stamp-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      <StampIcon className="h-9 w-9" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">Boarding Approved!</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      Thank you for submitting your pitch and video walkthrough. Our team will review your pitch deck and get back to you within 48-72 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--ember))] hover:underline pt-2"
                    >
                      Submit another response
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--ember))] text-white text-xs font-bold">1</span>
                        Developer Information
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alex Rivera"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="alex@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">Phone & City *</label>
                          <input
                            type="text"
                            required
                            placeholder="+91 9876543210, Bangalore"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">Status *</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          >
                            <option value="college_student">College Student (Paid Internship Path)</option>
                            <option value="working_professional">Working Professional (Contract / FTE Path)</option>
                            <option value="freelancer">Solo Freelancer / Independent Dev</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">LinkedIn Profile *</label>
                          <input
                            type="url"
                            required
                            placeholder="https://linkedin.com/in/username"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">GitHub Profile *</label>
                          <input
                            type="url"
                            required
                            placeholder="https://github.com/username"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--ember))] text-white text-xs font-bold">2</span>
                        Technical Pitch & Architecture Strategy
                      </h3>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Submit Your Pitch Link Here (Doc / Deck / Notion) *
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://docs.google.com/... or Notion link covering your approach to obfuscated phone numbers, symbol insertion, and word-numbers"
                          value={formData.writtenPitch}
                          onChange={(e) => setFormData({ ...formData, writtenPitch: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground block">
                          Techniques & Models Considered *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Regex & Rules Engine", "Small Local LLMs (Ollama/SLMs)", "Vector Embeddings & Cosine", "Fine-Tuned Classifier", "Hybrid Deterministic/Probabilistic"].map((tech) => {
                            const active = formData.techniques.includes(tech);
                            return (
                              <button
                                key={tech}
                                type="button"
                                onClick={(e) => handleTechniqueToggle(tech, e)}
                                className={`px-4 py-2 rounded-full border text-xs font-medium backdrop-blur-sm transition-all cursor-pointer ${
                                  active
                                    ? "border-[hsl(var(--ember))] bg-[hsl(var(--ember))]/15 text-[hsl(var(--ember))] shadow-sm shadow-[hsl(var(--ember))]/20 scale-105"
                                    : "border-border/80 bg-background/50 text-muted-foreground hover:text-foreground hover:border-border"
                                }`}
                              >
                                {tech}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Broader Conversation Safety Moderation *
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="How would you handle non-contact safety angles (hostility, scam links, harassment guardrails)?"
                          value={formData.safetyApproach}
                          onChange={(e) => setFormData({ ...formData, safetyApproach: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Evaluation & Success Metrics *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Precision > 98%, Recall > 95%, Latency < 50ms"
                            value={formData.metrics}
                            onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Estimated Cost Per 100k Checks *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. ~$0.50 per 100k via local regex + micro SLM fallback"
                            value={formData.costEstimate}
                            onChange={(e) => setFormData({ ...formData, costEstimate: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Link to Relevant GitHub Project / Shipped Work *
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://github.com/username/repo-name"
                          value={formData.pastWorkRepo}
                          onChange={(e) => setFormData({ ...formData, pastWorkRepo: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border-2 border-[hsl(var(--ember))]/40 bg-[hsl(var(--ember))]/5 p-5">
                      <h3 className="text-base font-bold text-[hsl(var(--ember))] flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        3. Pitch Deck Video Requirement (REQUIRED)
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Upload or link a <strong className="text-foreground">2-5 minute video</strong> walking through your 3-6 slide pitch deck explaining your approach directly to camera (Loom, Google Drive, unlisted YouTube — any format works).
                      </p>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Video URL (Loom / Google Drive / YouTube Unlisted) *
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://www.loom.com/share/your-video-id"
                          value={formData.videoLink}
                          onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                          className="w-full rounded-xl border border-[hsl(var(--ember))]/40 bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--ember))] text-white text-xs font-bold">4</span>
                        Availability & Start Date
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Available for 2-Day Paid Trial? *
                          </label>
                          <select
                            value={formData.availability}
                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          >
                            <option value="yes">Yes — Ready immediately</option>
                            <option value="within_1_week">Yes — Within 1 week</option>
                            <option value="no">No</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">Earliest Start Date *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Immediate / Next Monday"
                            value={formData.earliestStartDate}
                            onChange={(e) => setFormData({ ...formData, earliestStartDate: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ember))]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Barcode + booking ref, ticket-style */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div
                        className="h-8 flex-1 max-w-[200px] opacity-70"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, hsl(var(--foreground)) 0 2px, transparent 2px 5px)",
                        }}
                        aria-hidden
                      />
                      <span className="font-mono text-[10px] text-muted-foreground">{bookingRef}</span>
                    </div>

                    <MagneticButton
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-[hsl(var(--ember))] py-3 text-[13px] font-semibold tracking-tight text-white shadow-sm shadow-[hsl(var(--ember))]/20 ring-1 ring-inset ring-white/15 transition-colors hover:bg-[hsl(var(--ember))]/90 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Submitting Pitch..." : "Submit Application & Pitch Video"}
                    </MagneticButton>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==================== SECTION 6: FAQ / CONTROL TOWER ==================== */}
        <section id="faq" className="py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-10">
            <Reveal className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--ember))] uppercase tracking-wider">
                <Radar className="h-4 w-4" />
                <span>Control Tower</span>
              </div>
              <h2 className="font-display text-3xl text-foreground">
                Logistics & FAQ
              </h2>
            </Reveal>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="rounded-2xl border border-border px-5 py-1">
                <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[hsl(var(--ember))]">
                  What is the review timeline after I submit my pitch?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  We review incoming pitch decks and video walkthroughs on a rolling basis. You will hear back within 48 to 72 hours regarding whether you're shortlisted for the Leg 2 2-day paid build.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="rounded-2xl border border-border px-5 py-1">
                <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[hsl(var(--ember))]">
                  What happens during and after the 2-day trial build?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  During the trial, you'll build your prototype. At the end of 2 days, you'll submit your repository and run a live demo. You get paid the 2-day equivalent of the $1,000/month rate for your trial time. If your build meets our accuracy and scale criteria, that serves as your probation and converts immediately into a paid internship or FTE role.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="rounded-2xl border border-border px-5 py-1">
                <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[hsl(var(--ember))]">
                  Can I apply as a team of 2 or 3 developers?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  No — this challenge is strictly for solo developers. We are evaluating individual architectural thinking, speed, and end-to-end execution ability.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="rounded-2xl border border-border px-5 py-1">
                <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[hsl(var(--ember))]">
                  Who can I contact if I have questions about the brief?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  If you have any questions or clarification requests regarding the challenge brief, feel free to email us directly at{" "}
                  <a href="mailto:hello@wayzyy.com" className="text-[hsl(var(--ember))] font-semibold hover:underline">
                    hello@wayzyy.com
                  </a>
                  . Or, you know, find the other way to get our attention hidden somewhere on this page.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <div className="border-t border-border py-6">
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-[hsl(var(--ember))]" />
            Submissions close August 7, 2026 — apply before the gate shuts.
          </p>
        </div>

        <SiteFooter />
      </div>
    </SEO>
  );
}
