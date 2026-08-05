import React, { useState, useEffect } from "react";
import {
  Sparkles, ShieldCheck, Home, Upload, IndianRupee, CalendarSync, ArrowRight, ArrowLeft, CheckCircle2, X, Compass, User
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HostOnboardingTourProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: "all" | "active" | "pending") => void;
}

interface TourStep {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
  bullets: string[];
  highlightId?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to Wayzyy Hosting",
    subtitle: "India's host-first platform with zero per-booking commission cut",
    icon: Sparkles,
    content: "Welcome aboard! Wayzyy is engineered for hosts in Goa and India who want full ownership over their pricing, guest policies, and payouts without losing 15%+ to third-party travel apps.",
    bullets: [
      "Keep 100% of your listed nightly rate — no 15.5% platform cuts",
      "Direct payouts sent to your bank account within 24 hours of check-in",
      "Verified guests backed by Aadhaar/DigiLocker identity verification",
    ],
  },
  {
    title: "Manual Identity Verification",
    subtitle: "Earn the Verified Host badge and build guest trust",
    icon: ShieldCheck,
    content: "Indian travellers value trust above all else. Completing identity verification unlocks a prominent 'Verified Host' trust badge across all your listings.",
    bullets: [
      "Upload official government ID (Aadhaar, PAN, or Passport)",
      "Upload a live selfie for human team verification",
      "Encrypted data protection compliant with India's DPDP Act 2023",
    ],
  },
  {
    title: "Add or Import Listings",
    subtitle: "List properties manually or import existing Airbnb URLs",
    icon: Upload,
    content: "Transitioning existing properties is fast and simple. Use our 1-click import tool or create a fresh listing from scratch.",
    bullets: [
      "Paste any Airbnb listing URL to automatically pull photos and layouts",
      "Set your own competitive direct host prices without third-party surge markups",
      "All imported properties undergo manual quality review before going live",
    ],
  },
  {
    title: "Direct Pricing & Policy Autonomy",
    subtitle: "Your cancellation terms and nightly rates belong to you",
    icon: IndianRupee,
    content: "Wayzyy never unilaterally overrides your cancellation policies or alters your pricing structure. You retain full control over weekday, weekend, and seasonal rates.",
    bullets: [
      "Choose from Flexible, Balanced, or Firm cancellation tiers",
      "No mandatory automated discounts or hidden guest fee markups",
      "Prepaid credit packs bring effective platform cost down to ~2%",
    ],
  },
  {
    title: "Calendar Sync & Host Profile",
    subtitle: "Prevent double-bookings and represent your host brand",
    icon: CalendarSync,
    content: "Connect 2-way iCal calendars to sync availability automatically across platforms. Access your host profile anytime to view your listings portfolio and account verification status.",
    bullets: [
      "Automatic 2-way iCal sync with Airbnb, Booking.com & VRBO",
      "Inspect listing performance, calendar blockouts, and guest reviews",
      "View your public host profile representation anytime from the dashboard",
    ],
  },
];

export function HostOnboardingTour({ userId, isOpen, onClose }: HostOnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem(`wayzyy_host_tour_completed_${userId}`, "true");
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    localStorage.setItem(`wayzyy_host_tour_completed_${userId}`, "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-primary/30 bg-card p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Bar with Step Counter & Skip */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {currentStep + 1}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Host Onboarding Guide • Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Skip Guide <X className="h-4 w-4" />
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
            <StepIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground leading-snug">{step.title}</h2>
            <p className="text-xs font-medium text-primary mt-0.5">{step.subtitle}</p>
          </div>
        </div>

        {/* Step Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">{step.content}</p>

        {/* Bullet Highlights */}
        <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2.5">
          {step.bullets.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Step Action Controls */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>

          <div className="flex items-center gap-2">
            <Button onClick={handleNext} size="sm" className="gap-1.5 bg-primary text-primary-foreground font-semibold text-xs px-5 py-2">
              {isLastStep ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Got It, Let's Host!
                </>
              ) : (
                <>
                  Next Step <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
