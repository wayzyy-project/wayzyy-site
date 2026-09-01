import React from "react";
import { Link } from "react-router-dom";
import {
  User, ShieldCheck, Mail, Calendar, Home, CheckCircle2, AlertCircle, X, Sparkles, ExternalLink, SlidersHorizontal, Camera, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HostProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVerified: boolean;
  pendingVerification: boolean;
  totalListings: number;
  liveListings: number;
  onVerifyClick: () => void;
  onStartTourClick: () => void;
}

export function HostProfileModal({
  isOpen,
  onClose,
  isVerified,
  pendingVerification,
  totalListings,
  liveListings,
  onVerifyClick,
  onStartTourClick,
}: HostProfileModalProps) {
  const { user, signOut } = useAuth();

  if (!isOpen || !user) return null;

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Host";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "June 2026";

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Host Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-xl font-bold shadow-md">
            {initials}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-foreground truncate">{fullName}</h3>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400 shrink-0">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground shrink-0" /> {user.email}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" /> Hosting on Wayzyy since {createdAt}
            </p>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className={`rounded-2xl border p-4 space-y-2 ${
          isVerified
            ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400"
            : pendingVerification
            ? "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400"
            : "border-primary/30 bg-primary/5 text-foreground"
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {isVerified
                ? "Identity Verified"
                : pendingVerification
                ? "Verification Pending Review"
                : "Identity Verification Required"}
            </span>
            {!isVerified && (
              <Button size="sm" variant="outline" onClick={() => { onClose(); onVerifyClick(); }} className="text-xs gap-1 py-1 h-7">
                <Camera className="h-3 w-3" />
                {pendingVerification ? "View ID" : "Verify Now"}
              </Button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {isVerified
              ? "Your Aadhaar / Passport identity verification is complete. Guests see a Verified Host trust badge on your listings."
              : pendingVerification
              ? "Your submitted government ID and selfie are being reviewed by our operations team."
              : "Verify your identity with government ID and selfie to earn the Verified Host badge."}
          </p>
        </div>

        {/* Portfolio Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="font-display text-2xl font-bold text-foreground">{totalListings}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Total Properties</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="font-display text-2xl font-bold text-primary">{liveListings}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Active Live Listings</p>
          </div>
        </div>

        {/* Quick Account Actions */}
        <div className="space-y-2 pt-1 border-t border-border">
          <button
            onClick={() => { onClose(); onStartTourClick(); }}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/40 text-xs font-medium text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Take Platform Tour
            </span>
            <span className="text-muted-foreground text-[11px]">5 Steps →</span>
          </button>

          <Link
            to="/policies/property-import-policy"
            target="_blank"
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/40 text-xs font-medium text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Property Import & Listing Policy
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>

          <button
            onClick={() => { signOut(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-xs font-semibold text-destructive transition-colors mt-2"
          >
            <LogOut className="h-4 w-4" /> Log out of Host Account
          </button>
        </div>
      </div>
    </div>
  );
}
