import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck, Upload, Home, CalendarSync, ArrowRight, ArrowLeft, CheckCircle2, X, User, Sparkles, SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HostOnboardingTourProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: "all" | "active" | "pending") => void;
}

interface TourStep {
  targetId: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
  bullets: string[];
  preferredPlacement?: "top" | "bottom" | "left" | "right";
}

const GAME_TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-identity-verification",
    title: "Manual Identity Verification",
    subtitle: "Upload ID & live selfie for verified host badge",
    icon: ShieldCheck,
    content: "Click here to submit your Aadhaar, PAN, or Passport along with a live selfie. Verified hosts gain maximum trust from guests across India.",
    bullets: [
      "Upload government ID & live selfie",
      "Human team verification within hours",
      "Unlocks 'Verified Host' trust badge",
    ],
    preferredPlacement: "bottom",
  },
  {
    targetId: "tour-import-airbnb",
    title: "Import Airbnb Listing",
    subtitle: "1-Click URL import from Airbnb or Booking",
    icon: Upload,
    content: "Paste your existing Airbnb listing link here to automatically import property photos, layouts, amenities, and pricing details in seconds.",
    bullets: [
      "Paste any Airbnb listing link",
      "Auto-fetches photos & descriptions",
      "Manual review before going live",
    ],
    preferredPlacement: "bottom",
  },
  {
    targetId: "tour-list-property",
    title: "List Property Manually",
    subtitle: "Create a fresh property listing from scratch",
    icon: Home,
    content: "Click this button to open our step-by-step listing wizard. Set your own nightly rates, guest capacity, photo gallery, and house rules.",
    bullets: [
      "Full pricing & house rules autonomy",
      "Zero per-booking commission cut",
      "Direct bank payouts within 24h",
    ],
    preferredPlacement: "bottom",
  },
  {
    targetId: "tour-portfolio-tabs",
    title: "Property Portfolio & Live Status",
    subtitle: "Filter active listings and pending reviews",
    icon: SlidersHorizontal,
    content: "Use these tabs to switch between all properties, live listings, and properties under manual review. Manage calendar sync and pricing per listing.",
    bullets: [
      "Track live vs pending review status",
      "2-Way iCal calendar sync",
      "Direct pricing & instant blockouts",
    ],
    preferredPlacement: "top",
  },
  {
    targetId: "tour-host-profile",
    title: "Host Profile & Portfolio",
    subtitle: "View public host reputation & stats",
    icon: User,
    content: "Click your Host Profile anytime to view your public host representation, total active listings, review score, and account verification badge.",
    bullets: [
      "Public host representation page",
      "Inspect host performance metrics",
      "Manage identity badge & payouts",
    ],
    preferredPlacement: "bottom",
  },
];

export function HostOnboardingTour({ userId, isOpen, onClose }: HostOnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = GAME_TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === GAME_TOUR_STEPS.length - 1;

  // ── Calculate Target Rect & Scroll into view ──
  useEffect(() => {
    if (!isOpen) return;

    const updateTargetPosition = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        // Smoothly scroll the element into view
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };

    updateTargetPosition();

    // Re-calculate on resize or scroll
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition, true);

    const timeout = setTimeout(updateTargetPosition, 300);

    return () => {
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition, true);
      clearTimeout(timeout);
    };
  }, [isOpen, currentStep, step.targetId]);

  if (!isOpen) return null;

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

  // Tooltip positioning logic around targetRect
  let tooltipTop = window.innerHeight / 2 - 140;
  let tooltipLeft = window.innerWidth / 2 - 190;

  if (targetRect) {
    if (step.preferredPlacement === "bottom") {
      tooltipTop = targetRect.bottom + 16;
      tooltipLeft = Math.max(16, Math.min(window.innerWidth - 400, targetRect.left + targetRect.width / 2 - 190));
    } else if (step.preferredPlacement === "top") {
      tooltipTop = Math.max(16, targetRect.top - 280);
      tooltipLeft = Math.max(16, Math.min(window.innerWidth - 400, targetRect.left + targetRect.width / 2 - 190));
    }
  }

  return (
    <>
      <style>{`
        @keyframes spotlight-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(255, 107, 0, 0.9), 0 0 35px rgba(255, 107, 0, 0.7); }
          50% { box-shadow: 0 0 0 8px rgba(255, 107, 0, 1), 0 0 50px rgba(255, 107, 0, 0.9); }
        }
        .animate-spotlight-pulse {
          animation: spotlight-pulse 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* ── Dark Backdrop Overlay ── */}
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto" />

      {/* ── Spotlight Ring around the Target Element ── */}
      {targetRect && (
        <div
          className="fixed z-50 rounded-2xl border-2 border-[#ff6b00] pointer-events-none transition-all duration-300 ease-out animate-spotlight-pulse"
          style={{
            top: `${targetRect.top - 6}px`,
            left: `${targetRect.left - 6}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        />
      )}

      {/* ── Game-Style Speech Bubble Tooltip ── */}
      <div
        className="fixed z-50 w-full max-w-sm rounded-3xl border-2 border-[#ff6b00] bg-slate-900 text-white p-5 shadow-2xl transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
        style={{
          top: `${Math.max(16, Math.min(window.innerHeight - 300, tooltipTop))}px`,
          left: `${Math.max(16, Math.min(window.innerWidth - 400, tooltipLeft))}px`,
        }}
      >
        {/* Game Pointer Arrow */}
        <div
          className="absolute h-4 w-4 rotate-45 border-2 border-[#ff6b00] bg-slate-900"
          style={{
            top: step.preferredPlacement === "bottom" ? "-9px" : "auto",
            bottom: step.preferredPlacement === "top" ? "-9px" : "auto",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            borderBottomColor: step.preferredPlacement === "bottom" ? "transparent" : "#ff6b00",
            borderRightColor: step.preferredPlacement === "bottom" ? "transparent" : "#ff6b00",
            borderTopColor: step.preferredPlacement === "top" ? "transparent" : "#ff6b00",
            borderLeftColor: step.preferredPlacement === "top" ? "transparent" : "#ff6b00",
          }}
        />

        {/* Top Counter & Skip */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6b00] text-xs font-bold text-white shadow-xs">
              {currentStep + 1}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b00]">
              Interactive Guide • Step {currentStep + 1} of {GAME_TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            Skip Tour <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Step Header */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/40 shadow-xs">
            <StepIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white leading-snug">{step.title}</h3>
            <p className="text-[11px] font-semibold text-[#ff6b00] mt-0.5">{step.subtitle}</p>
          </div>
        </div>

        {/* Step Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3">{step.content}</p>

        {/* Bullet Highlights */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 space-y-2 mb-4">
          {step.bullets.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-200 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#ff6b00] shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full h-8 px-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>

          <Button
            onClick={handleNext}
            size="sm"
            className="gap-1.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-full h-8 px-4 shadow-md shadow-[#ff6b00]/30"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Start Hosting!
              </>
            ) : (
              <>
                Next Section <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
