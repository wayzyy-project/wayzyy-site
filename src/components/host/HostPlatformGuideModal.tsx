import React, { useState } from "react";
import {
  BookOpen, Download, Percent, ShieldCheck, CalendarSync, MessageCircle, X, ChevronRight, ChevronLeft, CheckCircle2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HostPlatformGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GUIDE_STEPS = [
  {
    step: "01",
    icon: Percent,
    title: "0% Commission Direct Hosting",
    badge: "Host Revenue",
    description: "Keep 100% of what guests pay. Unlike traditional platforms charging 15-20% commission, Wayzyy operates on a flat transparent model with zero hidden fees.",
    highlights: [
      "No host booking commissions",
      "Direct payout to your Indian bank account",
      "Set your own weekday and weekend rates",
    ],
  },
  {
    step: "02",
    icon: Download,
    title: "1-Click Airbnb & OTA Import",
    badge: "Smart Sync",
    description: "Import your existing Airbnb or Booking.com listing in seconds. Automatically fetches photo galleries, room layouts, amenities, and property descriptions.",
    highlights: [
      "No manual copy-pasting required",
      "Preserves high-res photo gallery",
      "Admin approved for fast, secure onboarding",
    ],
  },
  {
    step: "03",
    icon: CalendarSync,
    title: "Calendar & Pricing Management",
    badge: "Operations",
    description: "Manage bookings, block dates, and adjust pricing from your web dashboard or mobile app with real-time calendar syncing.",
    highlights: [
      "Instant calendar blocking",
      "Flexible short-term & long-term cancellation policies",
      "Goa Tourism (GTR) compliance verification",
    ],
  },
  {
    step: "04",
    icon: ShieldCheck,
    title: "Verified Host Trust Badge",
    badge: "Security & Trust",
    description: "Boost guest trust and booking conversion by completing manual verification with your government ID and a live selfie.",
    highlights: [
      "Verified Host badge displayed on all property cards",
      "Manual human review by operations team",
      "Enhanced search ranking for verified listings",
    ],
  },
];

export function HostPlatformGuideModal({ isOpen, onClose }: HostPlatformGuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const current = GUIDE_STEPS[currentStep];
  const IconComponent = current.icon;
  const isLast = currentStep === GUIDE_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ember/10 text-ember border border-ember/20">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-foreground">Wayzyy Host Guide</h2>
              <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {GUIDE_STEPS.length} — Platform Overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {GUIDE_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentStep ? "w-8 bg-ember" : "w-2 bg-muted hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        {/* Step Card Content */}
        <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/15 text-ember border border-ember/30">
              <IconComponent className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-ember/10 border border-ember/30 px-3 py-1 text-[11px] font-bold text-ember">
              {current.badge}
            </span>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-lg text-foreground">{current.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{current.description}</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60">
            {current.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          <Button
            onClick={handleNext}
            size="sm"
            className="bg-ember text-white hover:bg-ember/90 text-xs font-bold gap-1.5 rounded-full px-5 shadow-sm"
          >
            {isLast ? (
              <>Got It, Let's Host! <CheckCircle2 className="h-4 w-4" /></>
            ) : (
              <>Next Feature <ChevronRight className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
