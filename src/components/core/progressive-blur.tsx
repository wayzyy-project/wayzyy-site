import React from "react";

export type ProgressiveBlurDirection = "top" | "bottom" | "left" | "right";

interface ProgressiveBlurProps {
  className?: string;
  /** Base blur amount (px) multiplier — each layer's blur scales off this. */
  blurIntensity?: number;
  /** Which edge the blur intensifies toward. Defaults to "bottom". */
  direction?: ProgressiveBlurDirection;
  /** Number of stacked blur layers. More layers = smoother ramp. */
  layers?: number;
}

const gradientAxis: Record<ProgressiveBlurDirection, "to top" | "to bottom" | "to left" | "to right"> = {
  top: "to bottom",
  bottom: "to top",
  left: "to right",
  right: "to left",
};

/**
 * ProgressiveBlur — a stack of absolutely-positioned layers, each with a
 * different `backdrop-filter: blur()` amount and a `mask-image` gradient,
 * so the cumulative blur ramps smoothly across the element's own height
 * (or width) instead of cutting in as one flat, hard-edged blur.
 *
 * Renders as a single pointer-events-none overlay `<div>` — position it
 * absolutely over whatever it should blur (e.g. the bottom edge of a
 * photo, or a decorative gradient behind a headline).
 */
export function ProgressiveBlur({
  className,
  blurIntensity = 4,
  direction = "bottom",
  layers = 6,
}: ProgressiveBlurProps) {
  const axis = gradientAxis[direction];

  return (
    <div className={className}>
      {Array.from({ length: layers }).map((_, i) => {
        // Each layer blurs progressively more than the last…
        const blur = ((i + 1) / layers) * blurIntensity;
        // …and is masked so it only "counts" over its own slice of the
        // stack, fading in and back out — stacking these slices is what
        // produces the smooth top-to-bottom (or edge-to-edge) ramp.
        const start = (i / layers) * 100;
        const mid = ((i + 1) / layers) * 100;
        const end = Math.min(((i + 2) / layers) * 100, 100);
        const mask = `linear-gradient(${axis}, transparent ${start}%, black ${mid}%, black ${mid}%, transparent ${end}%)`;

        return (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur.toFixed(2)}px)`,
              WebkitBackdropFilter: `blur(${blur.toFixed(2)}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
