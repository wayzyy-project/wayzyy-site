import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Duplicated from CinematicHero.tsx rather than imported, to avoid a
 * circular import between the two modules (CinematicHero renders
 * FanCardDeck, and FanCardDeck needs this same enter/exit-window helper).
 * Keep in sync with the copy there if the curve ever changes.
 */
function smoothstep(edge0: number, edge1: number, x: number) {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
function segmentInOut(x: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  const fadeIn = smoothstep(inStart, inEnd, x);
  const fadeOut = 1 - smoothstep(outStart, outEnd, x);
  return Math.min(fadeIn, fadeOut);
}

export interface FanCard {
  heading: string;
  body: string;
  /** Tailwind bg color/gradient class for the pastel-glass tint overlay. */
  tint: string;
}

interface FanCardDeckProps {
  cards: FanCard[];
  progress: MotionValue<number>;
  windowIn: [number, number];
  windowOut: [number, number];
}

// Subtle rotation and vertical stagger per card index for a refined fanned look
const ROTATIONS = [-3, -1, 1, 3];
const Y_OFFSETS = [8, -2, -2, 8];

/** One card of the fanned deck — its own entrance/exit window nested inside the deck's overall window, staggered slightly per index. */
function DeckCard({
  card,
  index,
  progress,
  windowIn,
  windowOut,
}: {
  card: FanCard;
  index: number;
  count: number;
  progress: MotionValue<number>;
  windowIn: [number, number];
  windowOut: [number, number];
}) {
  const stagger = index * 0.025;
  const inStart = windowIn[0] + stagger;
  const inEnd = Math.min(windowIn[1] + stagger, windowOut[0]);

  const t = useTransform(progress, (p) => segmentInOut(p, inStart, inEnd, windowOut[0], windowOut[1]));

  const baseRotate = ROTATIONS[Math.min(index, ROTATIONS.length - 1)];
  const baseY = Y_OFFSETS[Math.min(index, Y_OFFSETS.length - 1)];

  const opacity = t;
  const scale = useTransform(t, [0, 1], [0.88, 1]);
  const rotate = useTransform(t, [0, 1], [baseRotate * 2, baseRotate]);
  const y = useTransform(t, [0, 1], [baseY + 30, baseY]);

  return (
    <motion.div
      style={{ opacity, scale, rotate, y }}
      className={
        "liquid-glass flex flex-col justify-between w-full rounded-2xl p-4 shadow-xl sm:p-5 md:p-6 lg:p-7 backdrop-blur-xl border border-white/20 " +
        card.tint
      }
    >
      <div>
        <h3 className="font-display text-sm font-bold leading-snug text-white sm:text-base md:text-lg lg:text-xl">
          {card.heading}
        </h3>
        <p className="mt-2 text-xs font-normal leading-relaxed text-white/80 sm:text-sm lg:text-base">
          {card.body}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Mobile equivalent — 2x2 grid for small viewports so all 4 cards fit cleanly.
 */
function MobileDeckCard({
  card,
  index,
  progress,
  windowIn,
  windowOut,
}: {
  card: FanCard;
  index: number;
  progress: MotionValue<number>;
  windowIn: [number, number];
  windowOut: [number, number];
}) {
  const stagger = index * 0.02;
  const inStart = windowIn[0] + stagger;
  const inEnd = Math.min(windowIn[1] + stagger, windowOut[0]);
  const t = useTransform(progress, (p) => segmentInOut(p, inStart, inEnd, windowOut[0], windowOut[1]));
  const opacity = t;
  const y = useTransform(t, [0, 1], [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={"liquid-glass rounded-2xl p-4 shadow-xl border border-white/20 " + card.tint}
    >
      <h3 className="font-display text-sm font-bold leading-tight text-white">{card.heading}</h3>
      <p className="mt-1.5 text-xs font-normal leading-snug text-white/80">{card.body}</p>
    </motion.div>
  );
}

/**
 * Side-by-side hand of cards deck of pastel-glass panels in the hero section.
 * Cards fan in staggered (scale+rotate+opacity) within `windowIn`, hold,
 * then fade/scale down together across `windowOut`.
 */
export function FanCardDeck({ cards, progress, windowIn, windowOut }: FanCardDeckProps) {
  return (
    <>
      {/* Desktop & Tablet: Side-by-side 4-column grid centered in viewport with zero clipping */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[10%] hidden justify-center px-4 sm:px-6 md:px-8 sm:flex sm:items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {cards.map((card, i) => (
            <DeckCard
              key={card.heading}
              card={card}
              index={i}
              count={cards.length}
              progress={progress}
              windowIn={windowIn}
              windowOut={windowOut}
            />
          ))}
        </div>
      </div>

      {/* Mobile: static 2x2 grid, centered in the viewport */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-2 content-center items-center gap-3 px-4 sm:hidden">
        {cards.map((card, i) => (
          <MobileDeckCard
            key={card.heading}
            card={card}
            index={i}
            progress={progress}
            windowIn={windowIn}
            windowOut={windowOut}
          />
        ))}
      </div>
    </>
  );
}

export default FanCardDeck;
