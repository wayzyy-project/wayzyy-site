import React, { createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ImageComparison — automatic animated wipe reveal between two images,
 * triggered whenever the `value` prop changes (e.g. a login/signup toggle).
 *
 * Unlike a manual drag-slider comparison, this swaps images with a
 * clip-path wipe animation driven entirely by props — no pointer handling.
 */

type WipeDirection = "left-to-right" | "right-to-left" | "diagonal";

interface ImageComparisonContextValue {
  value: string;
  direction: WipeDirection;
  duration: number;
}

const ImageComparisonContext = createContext<ImageComparisonContextValue | null>(null);

function useImageComparisonContext() {
  const ctx = useContext(ImageComparisonContext);
  if (!ctx) {
    throw new Error("ImageComparison.* components must be used within <ImageComparison>");
  }
  return ctx;
}

interface ImageComparisonProps {
  children: React.ReactNode;
  className?: string;
  /** Current active key — changing this triggers the wipe transition. */
  value: string;
  direction?: WipeDirection;
  /** Transition duration in seconds. */
  duration?: number;
}

export function ImageComparison({
  children,
  className,
  value,
  direction = "left-to-right",
  duration = 0.6,
}: ImageComparisonProps) {
  return (
    <ImageComparisonContext.Provider value={{ value, direction, duration }}>
      <div className={`relative overflow-hidden ${className ?? ""}`}>{children}</div>
    </ImageComparisonContext.Provider>
  );
}

interface ImageComparisonImageProps {
  src: string;
  alt: string;
  /** Which value of the parent's `value` prop this image should render for. */
  showWhen: string;
  className?: string;
}

const clipVariantsByDirection: Record<
  WipeDirection,
  { enter: string; exit: string; base: string }
> = {
  "left-to-right": {
    base: "inset(0% 0% 0% 0%)",
    enter: "inset(0% 0% 0% 100%)",
    exit: "inset(0% 100% 0% 0%)",
  },
  "right-to-left": {
    base: "inset(0% 0% 0% 0%)",
    enter: "inset(0% 100% 0% 0%)",
    exit: "inset(0% 0% 0% 100%)",
  },
  diagonal: {
    base: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    enter: "polygon(0 0, 0 0, 0 100%, 0 100%)",
    exit: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
  },
};

/**
 * Renders an image that wipes in/out whenever the parent's `value`
 * changes to/from `showWhen`. Images are absolutely stacked so the
 * wipe reads as one image sliding over the other.
 */
export function ImageComparisonImage({ src, alt, showWhen, className }: ImageComparisonImageProps) {
  const { value, direction, duration } = useImageComparisonContext();
  const isActive = value === showWhen;
  const clip = clipVariantsByDirection[direction];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.img
          key={showWhen}
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`}
          initial={{ clipPath: clip.enter }}
          animate={{ clipPath: clip.base }}
          exit={{ clipPath: clip.exit }}
          transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
        />
      )}
    </AnimatePresence>
  );
}

/**
 * Optional static base layer — the previous image stays mounted underneath
 * so there's never a flash of empty background while the wipe is mid-flight.
 */
export function ImageComparisonBase({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`} />;
}
