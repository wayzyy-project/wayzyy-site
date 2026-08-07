import React from "react";

interface HostOnboardingTourProps {
  userId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function HostOnboardingTour({ onClose }: HostOnboardingTourProps) {
  // Permanently disabled per user request in favor of native tooltips
  return null;
}
