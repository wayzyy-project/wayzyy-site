import { motion, useReducedMotion } from "framer-motion";

type Props = {
  className?: string;
  /** 0 = host side, 1 = traveler side */
  progress?: number;
};

/**
 * Tiny stylized backpacker walking. The legs cycle, the pack bobs,
 * a few dust particles kick up behind the heel. We rely on inline
 * <animate> + framer-motion for layering, so it works even when JS
 * is busy elsewhere on the page.
 */
export function Backpacker({ className }: Props) {
  const reduce = useReducedMotion();
  const step = reduce ? "0s" : "0.55s";

  return (
    <motion.svg
      viewBox="0 0 120 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* dust kick */}
      {!reduce && (
        <>
          <circle cx="38" cy="148" r="2.4" fill="currentColor" opacity="0.35">
            <animate
              attributeName="cx"
              values="38;24"
              dur="1.1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.45;0"
              dur="1.1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="2.4;0.8"
              dur="1.1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="34" cy="146" r="1.6" fill="currentColor" opacity="0.25">
            <animate
              attributeName="cx"
              values="34;18"
              dur="1.3s"
              begin="0.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0"
              dur="1.3s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* backpack */}
      <motion.g
        animate={
          reduce
            ? undefined
            : { y: [0, -1.2, 0], transition: { duration: 0.55, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <rect
          x="34"
          y="58"
          width="22"
          height="34"
          rx="6"
          fill="currentColor"
          opacity="0.92"
        />
        <rect x="38" y="64" width="14" height="4" rx="2" fill="hsl(var(--ember))" />
        <rect x="38" y="74" width="10" height="2" rx="1" fill="hsl(var(--paper))" opacity="0.55" />
        {/* bedroll on top */}
        <rect x="34" y="54" width="22" height="6" rx="3" fill="hsl(var(--ember))" opacity="0.95" />
      </motion.g>

      {/* body */}
      <motion.g
        animate={
          reduce
            ? undefined
            : { y: [0, -1.5, 0], transition: { duration: 0.55, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        {/* head */}
        <circle cx="64" cy="38" r="10" fill="currentColor" />
        {/* hat brim */}
        <rect x="52" y="32" width="24" height="3" rx="1.5" fill="currentColor" />
        <rect x="58" y="26" width="12" height="8" rx="2" fill="currentColor" />
        {/* torso */}
        <path
          d="M50 56 Q64 50 78 56 L74 96 Q64 100 54 96 Z"
          fill="currentColor"
        />
        {/* arm forward */}
        <g>
          <rect x="74" y="60" width="5" height="22" rx="2.5" fill="currentColor">
            {!reduce && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="-18 76 62;18 76 62;-18 76 62"
                dur={step}
                repeatCount="indefinite"
              />
            )}
          </rect>
        </g>
        {/* arm back */}
        <g>
          <rect x="49" y="60" width="5" height="22" rx="2.5" fill="currentColor">
            {!reduce && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="18 51 62;-18 51 62;18 51 62"
                dur={step}
                repeatCount="indefinite"
              />
            )}
          </rect>
        </g>
      </motion.g>

      {/* legs */}
      <g>
        <rect x="58" y="96" width="6" height="32" rx="3" fill="currentColor">
          {!reduce && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-22 61 98;22 61 98;-22 61 98"
              dur={step}
              repeatCount="indefinite"
            />
          )}
        </rect>
        <rect x="64" y="96" width="6" height="32" rx="3" fill="currentColor">
          {!reduce && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="22 67 98;-22 67 98;22 67 98"
              dur={step}
              repeatCount="indefinite"
            />
          )}
        </rect>
        {/* boots */}
        <rect x="55" y="126" width="11" height="5" rx="2" fill="hsl(var(--ember))" />
        <rect x="62" y="126" width="11" height="5" rx="2" fill="hsl(var(--ember))" />
      </g>
    </motion.svg>
  );
}
