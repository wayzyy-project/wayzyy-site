import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { Backpacker } from "./Backpacker";

/* ─────────────────────────────────────────────────────────────
   Tiny reusable helper - keeps useTransform calls tidy
───────────────────────────────────────────────────────────── */
function usePx(
  p: MotionValue<number>,
  input: [number, number],
  output: [number, number]
) {
  return useTransform(p, input, output);
}
function useOp(
  p: MotionValue<number>,
  input: [number, number],
  output: [number, number]
) {
  return useTransform(p, input, output);
}

/* ─────────────────────────────────────────────────────────────
   Smoke puff for chimney
───────────────────────────────────────────────────────────── */
function SmokePuff({ delay }: { delay: number }) {
  return (
    <motion.circle
      cx="0"
      cy="0"
      r="5"
      fill="hsl(var(--muted-foreground))"
      opacity={0.28}
      animate={{
        y: [-2, -28],
        x: [0, delay % 2 === 0 ? 6 : -4],
        opacity: [0.32, 0],
        r: [4, 9],
      }}
      transition={{
        duration: 1.8,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   House exterior SVG
───────────────────────────────────────────────────────────── */
function HouseSVG({ doorGlow }: { doorGlow: MotionValue<number> }) {
  return (
    <svg
      viewBox="0 0 340 300"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* --- roof --- */}
      <polygon
        points="170,20 310,130 30,130"
        fill="hsl(var(--ember))"
      />
      {/* roof ridge shadow */}
      <polygon
        points="170,20 310,130 280,130"
        fill="hsl(14,70%,44%)"
        opacity="0.35"
      />
      {/* --- walls --- */}
      <rect x="60" y="128" width="220" height="160" fill="hsl(var(--paper))" />
      {/* wall side shadow */}
      <rect x="240" y="128" width="40" height="160" fill="hsl(0,0%,0%)" opacity="0.06" />

      {/* --- chimney --- */}
      <rect x="220" y="50" width="28" height="80" fill="hsl(var(--muted-foreground))" opacity="0.65" />
      <rect x="216" y="46" width="36" height="10" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.75" />
      {/* smoke group */}
      <g transform="translate(234, 46)">
        <SmokePuff delay={0} />
        <SmokePuff delay={0.6} />
        <SmokePuff delay={1.2} />
      </g>

      {/* --- windows --- */}
      {/* Left window */}
      <rect x="80" y="155" width="56" height="48" rx="3" fill="hsl(35,85%,66%)" opacity="0.85" />
      <rect x="80" y="155" width="56" height="48" rx="3" fill="none" stroke="hsl(var(--ink))" strokeWidth="3" opacity="0.4" />
      {/* window cross */}
      <line x1="108" y1="155" x2="108" y2="203" stroke="hsl(var(--ink))" strokeWidth="2" opacity="0.35" />
      <line x1="80" y1="179" x2="136" y2="179" stroke="hsl(var(--ink))" strokeWidth="2" opacity="0.35" />
      {/* party silhouettes in left window */}
      <motion.circle cx="93" cy="170" r="5" fill="hsl(var(--ink))" opacity={0.5}
        animate={{ y: [0, -2, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cx="107" cy="167" r="4.5" fill="hsl(var(--ink))" opacity={0.45}
        animate={{ y: [0, -2, 0] }} transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
      <motion.circle cx="120" cy="171" r="4" fill="hsl(var(--ink))" opacity={0.4}
        animate={{ y: [0, -1.5, 0] }} transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} />

      {/* Right window */}
      <rect x="204" y="155" width="56" height="48" rx="3" fill="hsl(35,85%,66%)" opacity="0.85" />
      <rect x="204" y="155" width="56" height="48" rx="3" fill="none" stroke="hsl(var(--ink))" strokeWidth="3" opacity="0.4" />
      <line x1="232" y1="155" x2="232" y2="203" stroke="hsl(var(--ink))" strokeWidth="2" opacity="0.35" />
      <line x1="204" y1="179" x2="260" y2="179" stroke="hsl(var(--ink))" strokeWidth="2" opacity="0.35" />
      <motion.circle cx="217" cy="169" r="5" fill="hsl(var(--ink))" opacity={0.5}
        animate={{ y: [0, -2, 0] }} transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} />
      <motion.circle cx="232" cy="167" r="4.5" fill="hsl(var(--ink))" opacity={0.45}
        animate={{ y: [0, -2, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.45 }} />

      {/* --- door --- */}
      {/* door frame */}
      <rect x="146" y="188" width="48" height="100" rx="3" fill="hsl(var(--border))" />
      {/* door panel */}
      <rect x="150" y="192" width="40" height="96" rx="2" fill="hsl(var(--ember))" opacity="0.92" />
      {/* door panel details */}
      <rect x="155" y="198" width="30" height="18" rx="2" fill="hsl(14,70%,44%)" opacity="0.4" />
      <rect x="155" y="222" width="30" height="24" rx="2" fill="hsl(14,70%,44%)" opacity="0.4" />
      <rect x="155" y="252" width="30" height="18" rx="2" fill="hsl(14,70%,44%)" opacity="0.4" />
      {/* door handle with glow */}
      <motion.circle
        cx="183"
        cy="244"
        r="4"
        fill="hsl(var(--ember-soft))"
        style={{ filter: `drop-shadow(0 0 ${useTransform(doorGlow, [0, 1], [2, 10])}px hsl(var(--ember)))` }}
      />
      <motion.circle cx="183" cy="244" r="4" fill="hsl(var(--ember-soft))"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />

      {/* --- stone path --- */}
      <polygon
        points="140,288 200,288 220,300 120,300"
        fill="hsl(var(--muted))"
        opacity="0.7"
      />
      {/* path stones */}
      <ellipse cx="170" cy="294" rx="14" ry="3.5" fill="hsl(var(--border))" opacity="0.6" />
      <ellipse cx="162" cy="290" rx="10" ry="3" fill="hsl(var(--border))" opacity="0.5" />
      <ellipse cx="178" cy="290" rx="10" ry="3" fill="hsl(var(--border))" opacity="0.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Trees
───────────────────────────────────────────────────────────── */
function Tree({ x, flip }: { x: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 120"
      style={{
        position: "absolute",
        bottom: "12%",
        left: flip ? undefined : x,
        right: flip ? x : undefined,
        width: 60,
        height: 120,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      aria-hidden
    >
      <polygon points="30,4 56,80 4,80" fill="hsl(var(--muted-foreground))" opacity="0.45" />
      <polygon points="30,28 52,96 8,96" fill="hsl(var(--muted-foreground))" opacity="0.4" />
      <rect x="24" y="95" width="12" height="22" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.55" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Compass icon SVG
───────────────────────────────────────────────────────────── */
function CompassIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10 mb-3" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="none" stroke="hsl(var(--ember))" strokeWidth="2" />
      <polygon points="24,6 27,22 24,20 21,22" fill="hsl(var(--ember))" />
      <polygon points="24,42 21,26 24,28 27,26" fill="hsl(var(--muted-foreground))" opacity="0.5" />
      <polygon points="6,24 22,21 20,24 22,27" fill="hsl(var(--muted-foreground))" opacity="0.5" />
      <polygon points="42,24 26,27 28,24 26,21" fill="hsl(var(--ember))" />
      <circle cx="24" cy="24" r="3" fill="hsl(var(--ember))" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   House icon SVG (for paintings)
───────────────────────────────────────────────────────────── */
function HouseIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10 mb-3" aria-hidden>
      <polygon points="24,6 42,22 6,22" fill="none" stroke="hsl(var(--ember))" strokeWidth="2" />
      <rect x="10" y="21" width="28" height="22" rx="1" fill="none" stroke="hsl(var(--ember))" strokeWidth="2" />
      <rect x="19" y="30" width="10" height="13" rx="1" fill="hsl(var(--ember))" opacity="0.35" />
      <rect x="30" y="25" width="7" height="7" rx="1" fill="hsl(var(--ember))" opacity="0.35" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Painting frame
───────────────────────────────────────────────────────────── */
function Painting({
  side,
  x,
  opacity,
}: {
  side: "travelers" | "hosts";
  x: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x, opacity }}
      className="relative flex flex-col items-center rounded-sm overflow-hidden"
      css-note="no tailwind 3d needed here"
      aria-hidden
    >
      {/* frame border */}
      <div
        className="relative flex flex-col items-center p-5"
        style={{
          width: 220,
          minHeight: 290,
          background: "hsl(var(--card))",
          border: "3px solid hsl(var(--border))",
          boxShadow: "4px 6px 24px hsl(var(--ink) / 0.12)",
          borderRadius: 4,
        }}
      >
        {/* ember accent line at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "hsl(var(--ember))",
            borderRadius: "4px 4px 0 0",
          }}
        />
        <div className="mt-4 flex flex-col items-center text-center">
          {side === "travelers" ? <CompassIcon /> : <HouseIcon />}
          <p
            className="font-display text-xl mb-3"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {side === "travelers" ? "For Travelers" : "For Hosts"}
          </p>
          {/* bullet lines */}
          {[0.85, 1, 0.7].map((w, i) => (
            <div
              key={i}
              className="rounded-full mb-2"
              style={{
                height: 6,
                width: `${w * 140}px`,
                background:
                  i === 0
                    ? "hsl(var(--ember) / 0.7)"
                    : "hsl(var(--muted-foreground) / 0.35)",
              }}
            />
          ))}
          <p
            className="text-xs mt-3 leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))", maxWidth: 160 }}
          >
            {side === "travelers"
              ? "Discover unique stays handpicked by people who actually traveled there."
              : "List your space honestly and attract guests who truly appreciate it."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Book page face (front / back)
───────────────────────────────────────────────────────────── */
function PageFace({
  children,
  isFront,
  bg,
}: {
  children: React.ReactNode;
  isFront: boolean;
  bg?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: isFront ? "rotateY(0deg)" : "rotateY(180deg)",
        background: bg ?? "hsl(36,33%,95%)",
        borderRadius: isFront ? "0 4px 4px 0" : "4px 0 0 4px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "28px 24px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Open book component
───────────────────────────────────────────────────────────── */
function OpenBook({
  page1Rotate,
  page2Rotate,
  page3Rotate,
  bookOpacity,
  bookY,
}: {
  page1Rotate: MotionValue<number>;
  page2Rotate: MotionValue<number>;
  page3Rotate: MotionValue<number>;
  bookOpacity: MotionValue<number>;
  bookY: MotionValue<number>;
}) {
  const bookStyle: React.CSSProperties = {
    width: 560,
    height: 380,
    position: "relative",
    perspective: "1200px",
  };

  const pageContainerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    transformStyle: "preserve-3d",
    transformOrigin: "left center",
  };

  const textColor = "hsl(var(--foreground))";
  const mutedColor = "hsl(var(--muted-foreground))";
  const ember = "hsl(var(--ember))";

  return (
    <motion.div
      style={{ opacity: bookOpacity, y: bookY, rotateX: 4 }}
      className="relative"
    >
      <div style={bookStyle}>
        {/* book shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -16,
            left: "10%",
            right: "10%",
            height: 24,
            background: "hsl(var(--ink) / 0.12)",
            borderRadius: "50%",
            filter: "blur(10px)",
          }}
        />

        {/* left page - static cover art */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            background: "hsl(36,33%,93%)",
            borderRadius: "4px 0 0 4px",
            borderRight: "2px solid hsl(var(--border))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            boxShadow: "inset -4px 0 12px hsl(var(--ink) / 0.06)",
          }}
        >
          {/* hand-drawn house outline */}
          <svg viewBox="0 0 160 140" style={{ width: 140, height: 120 }} aria-hidden>
            <polygon
              points="80,10 150,60 10,60"
              fill="none"
              stroke={ember}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <rect
              x="20"
              y="58"
              width="120"
              height="72"
              rx="2"
              fill="none"
              stroke={ember}
              strokeWidth="2.5"
            />
            {/* windows */}
            <rect x="32" y="74" width="28" height="24" rx="2" fill="none" stroke={ember} strokeWidth="1.5" opacity="0.6" />
            <rect x="100" y="74" width="28" height="24" rx="2" fill="none" stroke={ember} strokeWidth="1.5" opacity="0.6" />
            {/* door */}
            <rect x="65" y="92" width="30" height="38" rx="2" fill="none" stroke={ember} strokeWidth="1.5" />
            {/* chimney */}
            <rect x="104" y="30" width="14" height="32" fill="none" stroke={ember} strokeWidth="1.5" opacity="0.5" />
            {/* path */}
            <path d="M65,130 Q72,136 80,136 Q88,136 95,130" fill="none" stroke={ember} strokeWidth="1.5" opacity="0.4" />
          </svg>
          <p
            className="font-display text-lg mt-3"
            style={{ color: ember, letterSpacing: "-0.02em" }}
          >
            wayzyy
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: mutedColor }}
          >
            the honest stay
          </p>
        </div>

        {/* right side base (visible when all pages turned) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            background: "hsl(36,33%,91%)",
            borderRadius: "0 4px 4px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <p
            className="font-display"
            style={{ fontSize: 42, color: ember, lineHeight: 1 }}
          >
            wayzyy
          </p>
          <p className="text-sm mt-3" style={{ color: mutedColor }}>
            Join the waitlist ↓
          </p>
        </div>

        {/* ── Page 3 (bottom of stack, rendered first) ── */}
        <motion.div
          style={{
            ...pageContainerStyle,
            rotateY: page3Rotate,
            zIndex: 3,
          }}
        >
          <PageFace isFront bg="hsl(36,33%,95%)">
            <p
              className="font-display text-xl mb-3"
              style={{ color: textColor }}
            >
              For Travelers
            </p>
            <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
              Discover stays curated by real travelers, with honest photos and
              transparent pricing.
            </p>
            <div
              className="mt-4 w-8 rounded-full"
              style={{ height: 3, background: ember }}
            />
          </PageFace>
          <PageFace isFront={false} bg="hsl(36,28%,92%)">
            <p
              className="font-display text-xl mb-3"
              style={{ color: textColor }}
            >
              For Hosts
            </p>
            <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
              List your space, set fair prices, and connect with guests who
              actually care about the experience.
            </p>
            <div
              className="mt-4 w-8 rounded-full"
              style={{ height: 3, background: ember }}
            />
          </PageFace>
        </motion.div>

        {/* ── Page 2 ── */}
        <motion.div
          style={{
            ...pageContainerStyle,
            rotateY: page2Rotate,
            zIndex: 4,
          }}
        >
          <PageFace isFront bg="hsl(36,33%,96%)">
            <p
              className="font-display text-xl mb-3"
              style={{ color: textColor }}
            >
              Why we're building Wayzyy
            </p>
            <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
              Because travel should feel human again - not a transaction.
            </p>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: mutedColor }}>
              We're starting from scratch, with trust as the foundation.
            </p>
            <div
              className="mt-4 w-6 rounded-full"
              style={{ height: 3, background: ember }}
            />
          </PageFace>
          <PageFace isFront={false} bg="hsl(36,28%,93%)">
            <div className="space-y-4">
              {["No hidden fees.", "Honest reviews.", "Real listings."].map(
                (line) => (
                  <p
                    key={line}
                    className="font-display text-lg"
                    style={{ color: textColor }}
                  >
                    {line}
                  </p>
                )
              )}
            </div>
            <div
              className="mt-5 w-10 rounded-full"
              style={{ height: 3, background: ember }}
            />
          </PageFace>
        </motion.div>

        {/* ── Page 1 (top of stack, rendered last) ── */}
        <motion.div
          style={{
            ...pageContainerStyle,
            rotateY: page1Rotate,
            zIndex: 5,
          }}
        >
          <PageFace isFront bg="hsl(36,33%,97%)">
            {/* blank first right page - just lines for decoration */}
            <div className="space-y-2 opacity-30">
              {[1, 0.85, 0.95, 0.7, 0.88].map((w, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    height: 5,
                    width: `${w * 170}px`,
                    background: "hsl(var(--muted-foreground))",
                  }}
                />
              ))}
            </div>
          </PageFace>
          <PageFace isFront={false} bg="hsl(36,30%,94%)">
            <p
              className="font-display text-xl mb-3"
              style={{ color: textColor }}
            >
              Why we're building Wayzyy
            </p>
            <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
              Because travel should feel human again - not a transaction.
            </p>
            <div
              className="mt-4 w-6 rounded-full"
              style={{ height: 3, background: ember }}
            />
          </PageFace>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export function HouseEntrySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  /* ── Sky gradient opacity ── */
  const skyOpacity = useOp(p, [0.45, 0.58], [1, 0]);

  /* ── Stars ── */
  const starOpacity = useOp(p, [0.0, 0.08, 0.38, 0.45], [0, 1, 1, 0]);

  /* ── Exterior house ── */
  const houseScale = useTransform(p, [0.0, 0.38], [1, 1.3]);
  const houseOpacity = useOp(p, [0.45, 0.55], [1, 0]);

  /* ── Backpacker ── */
  const bpY = usePx(p, [0.0, 0.52], [0, -210]);
  const bpScale = useTransform(p, [0.0, 0.52], [1, 1.7]);
  const bpOpacity = useOp(p, [0.44, 0.54], [1, 0]);

  /* ── Door glow (Phase 2) ── */
  const doorGlow = useTransform(p, [0.22, 0.38], [0, 1]);

  /* ── Door swing (Phase 3) ── */
  const doorRotateY = useTransform(p, [0.38, 0.52], [0, -75]);

  /* ── Interior ── */
  const interiorOpacity = useOp(p, [0.50, 0.60, 0.80, 0.88], [0, 1, 1, 0]);

  /* ── Paintings ── */
  const paintingOpacity = useOp(p, [0.56, 0.66, 0.68, 0.76], [0, 1, 1, 0]);
  const leftPaintingX = useTransform(p, [0.56, 0.66], [-250, 0]);
  const rightPaintingX = useTransform(p, [0.56, 0.66], [250, 0]);
  const paintingsY = useTransform(p, [0.68, 0.76], [0, -80]);

  /* ── Table ── */
  const tableOpacity = useOp(p, [0.70, 0.80, 0.95, 1.0], [0, 1, 1, 0]);
  const tableY = usePx(p, [0.70, 0.80], [200, 0]);

  /* ── Book ── */
  const bookOpacity = useOp(p, [0.72, 0.82], [0, 1]);
  const bookY = usePx(p, [0.72, 0.82], [60, 0]);

  /* ── Page turns ── */
  const page1Rotate = useTransform(p, [0.80, 0.88], [0, -180]);
  const page2Rotate = useTransform(p, [0.88, 0.95], [0, -180]);
  const page3Rotate = useTransform(p, [0.95, 1.0], [0, -180]);

  /* ── Scroll cue ── */
  const cueOpacity = useOp(p, [0.88, 0.95], [0, 1]);

  /* ── Light spill behind door ── */
  const lightSpillOpacity = useTransform(p, [0.38, 0.48], [0, 1]);

  /* If reduced motion, use static final state */
  if (reduce) {
    return (
      <section className="relative flex items-center justify-center py-32 bg-[hsl(var(--background))]">
        <div className="text-center space-y-4 max-w-xl px-6">
          <p className="font-display text-4xl" style={{ color: "hsl(var(--foreground))" }}>
            wayzyy
          </p>
          <p className="text-base" style={{ color: "hsl(var(--muted-foreground))" }}>
            Honest stays. Real connections. No hidden fees.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "650vh" }}
      aria-label="Wayzyy house entry cinematic section"
    >
      {/* sticky viewport */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* ── Phase 1–3: Exterior scene ── */}
        <motion.div
          style={{ opacity: houseOpacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Sky gradient */}
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: skyOpacity,
              background:
                "linear-gradient(to bottom, hsl(var(--ember-soft) / 0.55) 0%, hsl(var(--background)) 65%)",
            }}
          />

          {/* Stars */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: starOpacity }}
            aria-hidden
          >
            {[
              { cx: "15%", cy: "12%" },
              { cx: "78%", cy: "8%" },
              { cx: "42%", cy: "6%" },
              { cx: "60%", cy: "15%" },
              { cx: "25%", cy: "20%" },
            ].map(({ cx, cy }, i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={2.5}
                fill="hsl(var(--ember-soft))"
                animate={{ opacity: [0.4, 1, 0.4], r: [2, 3, 2] }}
                transition={{
                  duration: 2 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.svg>

          {/* Trees */}
          <Tree x={80} />
          <Tree x={100} flip />

          {/* House + backpacker container */}
          <motion.div
            className="relative"
            style={{ scale: houseScale, width: 360, height: 320 }}
          >
            <HouseSVG doorGlow={doorGlow} />

            {/* Door perspective wrapper for 3D swing */}
            <div
              style={{
                position: "absolute",
                bottom: "0.5%",
                left: "43%",
                width: 40,
                height: 96,
                perspective: "800px",
              }}
            >
              {/* Light spill */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, hsl(35 85% 70% / 0.8), transparent)",
                  opacity: lightSpillOpacity,
                  borderRadius: 2,
                  zIndex: 0,
                }}
              />
              {/* Door panel that swings open */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "hsl(var(--ember))",
                  borderRadius: 2,
                  rotateY: doorRotateY,
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  zIndex: 1,
                  boxShadow: "2px 0 12px hsl(var(--ink) / 0.2)",
                }}
              />
            </div>

            {/* Backpacker */}
            <motion.div
              className="absolute"
              style={{
                bottom: "2%",
                left: "50%",
                translateX: "-50%",
                y: bpY,
                scale: bpScale,
                opacity: bpOpacity,
                width: 48,
                height: 64,
                color: "hsl(var(--foreground))",
              }}
            >
              <Backpacker className="w-full h-full" />
            </motion.div>
          </motion.div>

          {/* Ground strip */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "18%",
              background:
                "linear-gradient(to top, hsl(var(--muted)) 0%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* ── Phase 4–5: Interior + Paintings ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: interiorOpacity }}
        >
          {/* Interior wall */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, hsl(var(--card)) 0%, hsl(var(--muted)) 85%, hsl(36,28%,78%) 100%)",
            }}
          />

          {/* Baseboard */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: "22%", background: "hsl(36,28%,76%)", borderTop: "3px solid hsl(var(--border))" }}
          />

          {/* Wall lamp */}
          <motion.div
            className="absolute"
            style={{ top: "22%", left: "50%", translateX: "-50%" }}
          >
            <motion.div
              style={{
                width: 18,
                height: 28,
                background: "hsl(35,80%,72%)",
                borderRadius: "50% 50% 40% 40%",
                boxShadow: "0 0 32px 12px hsl(35 80% 72% / 0.5)",
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              style={{
                width: 6,
                height: 14,
                background: "hsl(var(--muted-foreground))",
                margin: "0 auto",
                borderRadius: 2,
              }}
            />
          </motion.div>

          {/* Paintings row */}
          <motion.div
            className="relative z-10 flex gap-16 items-center"
            style={{ opacity: paintingOpacity, y: paintingsY }}
          >
            <Painting
              side="travelers"
              x={leftPaintingX}
              opacity={paintingOpacity}
            />
            <Painting
              side="hosts"
              x={rightPaintingX}
              opacity={paintingOpacity}
            />
          </motion.div>

          {/* ── Phase 5: Table ── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center"
            style={{ opacity: tableOpacity, y: tableY }}
          >
            {/* table surface */}
            <div
              style={{
                width: 640,
                height: 24,
                background: "hsl(36,34%,62%)",
                borderRadius: "6px 6px 0 0",
                boxShadow: "0 -4px 24px hsl(var(--ink) / 0.15)",
                marginBottom: -4,
              }}
            />
            {/* table body */}
            <div
              style={{
                width: 620,
                height: 200,
                background: "hsl(36,34%,68%)",
                borderRadius: "0 0 4px 4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 24,
                gap: 16,
              }}
            >
              {/* Book on table */}
              <OpenBook
                page1Rotate={page1Rotate}
                page2Rotate={page2Rotate}
                page3Rotate={page3Rotate}
                bookOpacity={bookOpacity}
                bookY={bookY}
              />
            </div>

            {/* Scroll cue */}
            <motion.p
              className="text-sm font-medium mt-4"
              style={{
                opacity: cueOpacity,
                color: "hsl(var(--muted-foreground))",
                letterSpacing: "0.05em",
              }}
            >
              ↓ Keep reading
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
