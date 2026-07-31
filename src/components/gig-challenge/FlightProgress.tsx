import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Plane } from "lucide-react";

/**
 * A dotted flight path across the top of the viewport; the plane
 * advances with scroll progress. Doubles as a progress indicator.
 */
export function FlightProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });
  const planeLeft = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] w-full">
      <div className="absolute inset-0 border-b border-dashed border-border/70" />
      <motion.div
        className="absolute inset-y-0 left-0 bg-[hsl(var(--ember))]/70"
        style={{ scaleX: progress, transformOrigin: "0% 50%" }}
      />
      <motion.div
        className="absolute -top-[9px] flex h-5 w-5 -translate-x-1/2 rotate-90 items-center justify-center rounded-full bg-background text-[hsl(var(--ember))] shadow-[0_0_0_2px_hsl(var(--ember))]"
        style={{ left: planeLeft }}
      >
        <Plane className="h-3 w-3" strokeWidth={2.5} />
      </motion.div>
    </div>
  );
}
