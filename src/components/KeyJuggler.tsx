import { motion, useReducedMotion } from "framer-motion";

type Props = { className?: string };

/**
 * Tiny stylized figure tossing a key up and catching it, on loop - same
 * stick-figure art language as Backpacker (circle head, hat brim, rect
 * limbs, currentColor + ember accents). Sits next to the "Hosting" nav
 * link as a small bit of motion, not a full illustration.
 */
export function KeyJuggler({ className }: Props) {
  const reduce = useReducedMotion();
  const cycle = reduce ? undefined : "1.1s";

  return (
    <motion.svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* head */}
      <circle cx="20" cy="10" r="4.5" fill="currentColor" />
      <rect x="14.5" y="6.5" width="11" height="1.6" rx="0.8" fill="currentColor" />
      <rect x="17" y="4" width="6" height="3.4" rx="1" fill="currentColor" />

      {/* torso */}
      <path d="M14.5 17 Q20 14.5 25.5 17 L24 30 Q20 32 16 30 Z" fill="currentColor" />

      {/* standing legs */}
      <rect x="17" y="30" width="2.6" height="8" rx="1.3" fill="currentColor" opacity="0.9" />
      <rect x="20.4" y="30" width="2.6" height="8" rx="1.3" fill="currentColor" opacity="0.9" />

      {/* still arm */}
      <rect x="12.5" y="19" width="2.4" height="9" rx="1.2" fill="currentColor" />

      {/* throwing arm - swings up then back down, catching */}
      <g>
        <rect x="25" y="19" width="2.4" height="9" rx="1.2" fill="currentColor">
          {!reduce && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="35 26 20; -70 26 20; 35 26 20"
              keyTimes="0;0.5;1"
              dur={cycle}
              repeatCount="indefinite"
            />
          )}
        </rect>
      </g>

      {/* the key - arcs up out of the hand and drops back into it */}
      {!reduce && (
        <g fill="hsl(var(--ember))">
          <circle cx="0" cy="0" r="1.6" fill="none" stroke="hsl(var(--ember))" strokeWidth="1.3" />
          <rect x="-0.6" y="1" width="1.2" height="3.2" />
          <rect x="0.6" y="2.6" width="1.4" height="0.9" />
          <rect x="0.6" y="4" width="1.1" height="0.9" />
          <animateMotion
            path="M27,17 C 30,4 14,4 17,17"
            dur={cycle}
            repeatCount="indefinite"
            rotate="auto"
          />
        </g>
      )}
    </motion.svg>
  );
}
